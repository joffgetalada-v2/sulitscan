# SulitScan Newsletter Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the lead-dropping newsletter placeholder with an honest, privacy-safe Resend Contacts integration and conversion tracking.

**Architecture:** A dependency-free newsletter service validates submissions and wraps the structural Resend Contacts client. The Next route only parses requests and maps the service result to an uncached response; the React client reports a conversion only after confirmed success.

**Tech Stack:** Next.js 16 Route Handlers, React 19, Resend 6.12.4, Vercel Analytics, Node test runner, Playwright.

## Global Constraints

- Do not expose or log an email address, contact ID, API key, or provider message.
- Preserve a prior global unsubscribe; a public signup must not silently reactivate it.
- Return the same success body for new, existing, unsubscribed, and honeypot submissions.
- Keep ordinary successful new and existing-contact paths to two provider operations: get/create for new contacts and get/get for existing contacts.
- Reject `?`, `#`, and `/` anywhere in the normalized email while preserving common plus-addressing.
- Hold configured HTTP 200 results to a 900ms floor plus independently sampled 0–200ms jitter when provider work finishes under the target; do not delay invalid or 503 results.
- Never return success when the provider or configuration failed.
- Serialize no failure category; log only a stable prefix and `{ category, status }` using `missing_configuration` or `provider_unavailable`.
- Follow the installed Next.js 16 Route Handler and environment-variable documentation.

---

### Task 1: Newsletter service and Resend boundary

**Files:**
- Create: `src/lib/newsletter-signup.ts`
- Create: `tests/newsletter.node.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `handleNewsletterSignup(body: unknown, contacts: NewsletterContactsClient | null): Promise<NewsletterResult>`
- Produces: structural `NewsletterContactsClient` with Resend-compatible `get` and `create` methods.
- Produces: `test:newsletter` in the release gate.

- [ ] **Step 1: Write failing service tests**

Add literal test cases for trimmed/lower-cased valid email, invalid/overlong email, rejected `?`/`#`/`/` characters anywhere in the normalized address (including domain/path-injection literals), preserved plus-addressing, strict boolean consent, source allow-listing, honeypot, active existing contact, existing unsubscribed contact, new contact creation, concurrent-create recovery, missing configuration, SDK error responses, and thrown network failures. Fakes must return complete `{ data, error, headers }` response objects. Assert exact public status/body pairs, internal failure categories, provider-operation sequences, and a `Cache-Control: no-store` header.

- [ ] **Step 2: Run the new suite and verify RED**

Run: `node --test tests/newsletter.node.mjs`

Expected: failure because `src/lib/newsletter-signup.ts` does not exist.

- [ ] **Step 3: Implement the minimal service**

Implement strict validation and generic results. Look up with `contacts.get({ email })`; confirm existing contacts with a second identical lookup; create missing contacts with `{ email, unsubscribed: false }`; if creation fails, perform one final lookup to recover a concurrent create. Treat an existing unsubscribed contact as processed without changing it. Convert missing configuration to `missing_configuration` and SDK/thrown provider failures to `provider_unavailable`, retaining categories only as non-serialized internal result metadata.

- [ ] **Step 4: Run the service suite and verify GREEN**

Run: `node --test tests/newsletter.node.mjs`

Expected: all newsletter service tests pass.

- [ ] **Step 5: Add the dedicated suite to the release gate**

Add `"test:newsletter": "node --test tests/newsletter.node.mjs"` and invoke it from `npm run check` before the build.

### Task 2: Honest Route Handler

**Files:**
- Modify: `src/app/api/newsletter/route.ts`
- Modify: `src/lib/newsletter-signup.ts`
- Test: `tests/newsletter.node.mjs`

**Interfaces:**
- Consumes: `handleNewsletterSignup` and `NewsletterContactsClient` from Task 1.
- Produces: `POST /api/newsletter` with 200/400/422/503 semantics, `Cache-Control: no-store`, and a 900ms plus 0–200ms timing window for configured success responses.

- [ ] **Step 1: Write a failing malformed-request test**

Add tests for `handleNewsletterRequest(request, contacts, timing)`: use a Web `Request` whose JSON body is malformed and assert status 400, `{ error: "Invalid newsletter request." }`, and `Cache-Control: no-store` without contacting the provider; use injected clock/delay/jitter seams to prove different successful provider durations receive compensating delays to the same `900ms + jitter` total; assert 0ms and 200ms jitter boundaries; and prove invalid and 503 results are not delayed.

Run: `node --test tests/newsletter.node.mjs`

Expected: failure because `handleNewsletterRequest` does not exist.

- [ ] **Step 2: Add the request parser and replace the webhook placeholder**

Add the dependency-free request parser so malformed JSON returns 400, then delegates valid JSON to `handleNewsletterSignup`. For configured status-200 results, wait until request-start time plus 900ms plus an independently sampled 0–200ms jitter; accept injected timing functions so tests remain instant and deterministic. Do not apply the timing floor to invalid or 503 results. In the route, instantiate `Resend` only when `RESEND_API_KEY` exists, pass `resend.contacts` to the request parser, and return its body/status with `Cache-Control: no-store`. For 503 results, log only a stable prefix and `{ category, status }`; do not log or serialize email, contact ID, API key, or provider messages.

- [ ] **Step 3: Verify route types and service behavior**

Run: `npm run typecheck && npm run test:newsletter`

Expected: both commands exit 0.

### Task 3: Signup UI and analytics

**Files:**
- Modify: `src/components/newsletter/NewsletterSignup.tsx`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: API `{ success: true }` or `{ error: string }` responses.
- Produces: `newsletter_signup_request_completed` with `{ source }` only after generic success.

- [ ] **Step 1: Write failing browser tests**

Add one test that submits an email without consent and expects a visible `role="alert"` with zero newsletter requests. Add one intercepted-success test that expects neutral request-received UI and exactly one `newsletter_signup_request_completed` event whose properties equal `{ source: "homepage" }`. Add a 503 test that expects an error and no completion event.

- [ ] **Step 2: Run the focused browser tests and verify RED**

Run: `npx playwright test tests/smoke.spec.ts --grep "newsletter" --workers=1`

Expected: the consent-error and analytics assertions fail against the old component.

- [ ] **Step 3: Implement the minimal client behavior**

Remove the pending status and copy, set error status when consent is missing, show neutral request-received copy after generic success, and call `track("newsletter_signup_request_completed", { source })` only after an API-confirmed success. Keep analytics in a try/catch so it never blocks signup UI.

- [ ] **Step 4: Run the focused browser tests and verify GREEN**

Run: `npx playwright test tests/smoke.spec.ts --grep "newsletter" --workers=1`

Expected: all focused newsletter tests pass.

### Task 4: Processor disclosure and release verification

**Files:**
- Modify: `src/app/privacy-policy/page.tsx`

**Interfaces:**
- Produces: accurate user-facing disclosure of Resend storage, unsubscribe, and deletion handling.

- [ ] **Step 1: Update the privacy disclosure**

State that Resend processes and stores subscriber addresses on SulitScan's behalf, addresses are not sold, broadcast unsubscribe links are honored, and deletion can be requested through the contact page.

- [ ] **Step 2: Run the full release gate**

Run: `npm run check`

Expected: lint, typecheck, every dedicated Node suite, link/product checks, and production build exit 0.

- [ ] **Step 3: Run the full browser suite serially**

Run: `npx playwright test --workers=1`

Expected: all Playwright tests pass.

- [ ] **Step 4: Commit the newsletter subproject**

Run: `git add package.json src/lib/newsletter-signup.ts src/app/api/newsletter/route.ts src/components/newsletter/NewsletterSignup.tsx src/app/privacy-policy/page.tsx tests/newsletter.node.mjs tests/smoke.spec.ts docs/superpowers/specs/2026-07-31-sulitscan-newsletter-conversion-design.md docs/superpowers/plans/2026-07-31-sulitscan-newsletter-conversion.md && git commit -m "feat: retain newsletter signups with Resend"`
