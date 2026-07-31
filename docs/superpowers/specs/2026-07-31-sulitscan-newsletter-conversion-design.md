# SulitScan Newsletter Conversion Design

**Date:** 2026-07-31

## Problem

SulitScan renders a newsletter signup on the homepage, blog index, and every article, but the current API only forwards signups when `NEWSLETTER_WEBHOOK_URL` is configured. Without it, the route returns an "almost ready" response and discards the email. This loses a return-visitor channel that could turn search traffic into repeat affiliate visits.

The repository already includes Resend and a server-only `RESEND_API_KEY`. The local key is currently invalid, so the implementation must report configuration/provider failures honestly and must not claim that production storage is already active.

## Considered Approaches

### 1. Publish another content batch

More articles can attract new searches, but this does not repair the existing signup funnel. Five new buyer guides were already published in the preceding release, so adding more content before retaining interested readers would compound the leak.

### 2. Keep the generic webhook integration

This is simple but still requires a second external service and a missing `NEWSLETTER_WEBHOOK_URL`. It also has no provider-specific duplicate, unsubscribe, or error semantics.

### 3. Store subscribers in Resend global Contacts — selected

Use Resend's current Contacts API, which is already installed. A new contact is created as subscribed. An existing contact is confirmed with a second lookup and treated as already processed; an existing globally unsubscribed contact remains unsubscribed so a public form cannot silently reverse a prior opt-out. Normal successful new and existing paths each perform two provider operations, reducing subscriber-state differences at that boundary. The request boundary also holds configured successful responses to a 900ms floor plus independently sampled 0–200ms jitter when provider work finishes under that target. A concurrent create race is recovered by checking for the contact once more. Client responses never reveal whether an address already exists.

## User Experience

- A valid, consented submission shows success only after Resend confirms the contact exists or was created.
- Configured success responses complete no earlier than 900–1100ms, while invalid and unavailable responses are not intentionally delayed.
- Success copy neutrally says the request was received; it does not claim the address is subscribed or tell the user to watch an inbox.
- Missing configuration, invalid credentials, or provider failures show a retryable error; the discarded "almost ready" state is removed.
- Submitting without the consent checkbox shows a visible inline error and sends no request.
- Honeypot submissions receive a generic success response without contacting Resend.
- No email address, contact ID, or provider error is returned to the browser or sent to analytics.

## Architecture

`src/lib/newsletter-signup.ts` is dependency-free and owns validation, normalized input, generic response mapping (including `Cache-Control: no-store`), provider-result inspection, duplicate protection, success-response timing, and the contact-store interface. `handleNewsletterRequest` accepts an injectable clock/delay/jitter seam for instant deterministic tests; production defaults use wall-clock time, a timer, and a fresh uniform integer jitter from 0 through 200ms per configured success. The Next route remains a thin adapter: parse JSON, construct a structural Resend Contacts client from the server-only key, call the service, return its status/body/headers, and log only a stable prefix with `{ category, status }`. Failure categories are internal metadata and are never serialized in the response body.

The client tracks one `newsletter_signup_request_completed` Vercel Analytics event after a generic API-confirmed success. Its only property is the controlled placement source (`homepage`, `blog-index`, or `blog-article`). Failures never emit a completion event, and the event name does not claim that an existing opt-out was reversed.

## Validation and Response Contract

- Malformed JSON: HTTP 400 with a generic input error.
- Non-object body, invalid or over-254-character email, a normalized email containing `?`, `#`, or `/` anywhere, or `consent !== true`: HTTP 422. Common plus-addressing remains valid.
- Valid new, existing, previously unsubscribed, or honeypot submission: HTTP 200 `{ "success": true }`.
- Missing `RESEND_API_KEY`, SDK `{ error }`, or thrown network/provider failure: HTTP 503 with a generic retry message. The service attaches internal `missing_configuration` or `provider_unavailable` metadata for sanitized route logging, but the response body stays identical.
- Responses include `Cache-Control: no-store`.
- With a configured contacts client, HTTP 200 responses are held until `request start + 900ms + jitter` when the provider completes sooner. HTTP 400, 422, and 503 responses are returned without the timing floor.

The API accepts only the existing source values. Source is not stored with Resend and is not used to reveal subscriber state.

## Privacy and Abuse Controls

The privacy policy will name Resend as the email service provider that processes and stores subscriber addresses on SulitScan's behalf. It will explain unsubscribe and deletion requests. Existing affiliate and analytics disclosures remain unchanged.

The honeypot is retained. Stronger upstream rate limiting and double opt-in remain operational follow-ups because durable, distributed abuse control and confirmation-email deliverability require external account configuration. The route will fail closed when Resend is unavailable rather than silently discarding personal data.

## Verification

- Node tests cover validation (including local/domain/path-injection delimiters and plus-addressing), consent, source normalization, two-operation existing/new success paths, deterministic compensation of different provider durations to the same target, 900ms plus 0–200ms jitter boundaries, no delay for invalid/unavailable results, preserved opt-out, new creation, concurrent create recovery, exact failure categories, sanitized route logging, SDK error objects, and thrown failures.
- Playwright covers visible consent errors, neutral request-received UI, the exact `newsletter_signup_request_completed` payload, and no completion event on API failure.
- The dedicated Node suite is added to `npm run check`.
- Full lint, typecheck, all dedicated suites, link/product checks, build, and full Playwright run are required before release.
