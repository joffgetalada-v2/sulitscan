# SulitScan August Buyer-Guides Growth Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Implement every production change with strict RED/GREEN test-driven development and obtain an independent task review before proceeding.

**Goal:** Grow qualified Philippine shopping traffic and affiliate trust by fixing verified search-snippet and homepage-conversion gaps, publishing five primary-source-backed buyer workflows, and documenting the remaining AdSense and distribution work without inventing fresh prices or campaign claims.

**Architecture:** Preserve the existing data-driven Next.js 16 App Router design. Small pure SEO helpers provide concise article titles and page-aware deal-listing descriptions; the animated homepage preview links to an internal deal detail page. Five evergreen posts extend `src/data/posts.ts`, reuse the existing article trust/schema/recommendation pipeline, and each receives a distinct local 1600x900 JPEG banner. Focused Node and Playwright tests protect metadata, content quality, internal linking, media, and conversion behavior.

**Tech Stack:** Next.js 16.2.11 App Router, React 19, TypeScript, Tailwind CSS, Node test runner, Playwright, Next Image, Vercel.

## Global Constraints

- Work in `C:\Vercel\sulitscan\.worktrees\august-buyer-guides` on `codex/august-buyer-guides`; promote to `main` only after every release gate passes.
- Read `AGENTS.md` and the relevant installed Next.js 16 metadata/image documentation before production changes.
- Follow strict TDD for code and registry behavior: add a focused failing test, run and record RED, implement the minimum change, then rerun for GREEN.
- Publish people-first original synthesis. Cite current primary sources, identify the policy-review date, distinguish examples from live terms, and never claim hands-on testing that did not happen.
- Never add SHEIN, Lazada, or AliExpress. Keep affiliate focus on the existing Temu, Shopee PH, and Sephora PH partners.
- Do not force ImportTaxPH or ApplyReadyCV into unrelated articles. This five-guide cluster has no natural sister-site placement.
- Do not publish current-price, coupon-code, delivery-time, campaign, product-authenticity, refund-deadline, or certification claims unless framed against a dated primary source and a reminder to verify the live platform/order/label.
- Keep all monetized links behind the existing affiliate disclosure and tracking wrapper; new hero navigation must go to an internal deal route, not directly to an affiliate URL.
- Do not implement URL-parameter stripping in this release: affiliate attribution parameters may be business-significant. Record the query-variant finding for Search Console monitoring instead.
- Final release gates: `npm run check`, `npx playwright test --workers=1`, `npm audit --omit=dev`, `git diff --check`, independent final diff review, push to `main`, and live validation after deployment.

---

### Task 1: Search snippets and homepage conversion accuracy

**Files:**
- Create: `src/lib/blog-seo.ts`
- Modify: `src/lib/deal-seo.ts`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/deals/page.tsx`
- Modify: `src/components/DealScannerVisual.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/app/page.tsx`
- Modify: `tests/seo-helpers.node.mjs`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `buildBlogSeoTitle(post)` returning a concise, deterministic, descriptive title no longer than 65 characters, while leaving the visible article H1 unchanged.
- Produces: `buildDealsPageDescription(page)` returning the existing description for page one and a unique `Page N` description for later canonical pages.
- Produces: an internal `/deals/[slug]` link from the active homepage scanner card.
- Produces: truthful “No automatic redirects” trust language and a header guide announcement that links to `/blog`.

- [ ] Add Node assertions covering all post title uniqueness/length, representative title meaning, and page-aware deal descriptions; add Playwright assertions for the scanner’s internal href, header destination, and trust copy.
- [ ] Run the focused Node and Playwright tests and record RED for the missing helpers/non-link/copy mismatch.
- [ ] Implement the pure helpers and consume them in metadata; convert only the scanner CTA to an internal `Link`; update the two trust-copy occurrences and announcement destination.
- [ ] Rerun the focused tests, lint, and typecheck and record GREEN.
- [ ] Commit only Task 1 files and append RED/GREEN evidence plus self-review to the SDD progress ledger.

### Task 2: Five Philippine buyer workflows

**Files:**
- Modify: `src/data/posts.ts`
- Modify: `tests/recommendations.node.mjs`
- Modify: `scripts/check-links.mjs`

**Interfaces:**
- Produces the exact slugs:
  - `how-to-stack-shopee-vouchers-philippines`
  - `shopee-return-refund-guide-philippines`
  - `temu-returns-refunds-price-adjustment-philippines`
  - `how-to-check-skincare-makeup-legit-philippines`
  - `online-electrical-appliance-safety-ps-icc-philippines`
- Produces: five distinct articles dated/reviewed `2026-08-03`, each with a concrete workflow, at least one decision table or worked example, a checklist, limitations/current-policy caveat, primary-source links, FAQs, useful internal links, and a matching recommendation intent.

- [ ] Add failing registry tests for exact slugs, IDs, distinct titles/excerpts, review dates, minimum substantive structure, primary-source domains, FAQs, required internal-link clusters, and absence of forced sister-site or blocked-merchant links.
- [ ] Run `npm run test:recommendations` and record RED because the five posts do not exist.
- [ ] Write the five source-backed guides in natural Philippine English. Explain voucher cap/minimum-spend math; Shopee’s live in-app return deadline/evidence path; Temu remedy/refund/eligible price-adjustment distinctions; FDA cosmetic-notification versus authenticity; and PS/ICC label/seller/voltage checks.
- [ ] Add reciprocal contextual links only where they help established guides, update the required-post link guard, then run `npm run test:recommendations` and `npm run check:links` for GREEN.
- [ ] Commit only Task 2 files and append source/quality evidence plus self-review to the SDD progress ledger.

### Task 3: Original banners and browser-level guide protection

**Files:**
- Create: `public/images/guides/how-to-stack-shopee-vouchers-philippines.jpg`
- Create: `public/images/guides/shopee-return-refund-guide-philippines.jpg`
- Create: `public/images/guides/temu-returns-refunds-price-adjustment-philippines.jpg`
- Create: `public/images/guides/how-to-check-skincare-makeup-legit-philippines.jpg`
- Create: `public/images/guides/online-electrical-appliance-safety-ps-icc-philippines.jpg`
- Modify: `public/images/guides/README.md`
- Modify: `tests/recommendations.node.mjs`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: five distinct 1600x900 JPEG cover assets without logos, legible text, watermarks, unsafe product claims, or crop-dependent critical details.
- Verifies: each guide returns 200 with a self-canonical, concise title, original loaded banner, trust panel, FAQ schema, useful related content, sitemap membership, and no mobile horizontal overflow.

- [ ] Extend the image registry test to require each exact path, JPEG signature, 1600x900 dimensions, and five unique SHA-256 hashes; add parameterized Playwright coverage for all five guide routes.
- [ ] Run the image and focused browser tests and record RED because assets/complete routes are missing.
- [ ] Generate each banner in a separate built-in image-generation call using the approved photorealistic-natural wide-header brief; inspect every output and save the exact 1600x900 JPEG path.
- [ ] Update the guide image README with the generation brief/provenance, then run the image registry tests, focused browser tests, and `npm run check:links` for GREEN.
- [ ] Commit only Task 3 files and append image inspection/test evidence plus self-review to the SDD progress ledger.

### Task 4: Dated audit and execution checklist

**Files:**
- Create: `docs/seo-audit-2026-08-03.md`
- Modify: `docs/traffic-growth-checklist.md`

**Interfaces:**
- Records: live 261-URL sitemap crawl, 34-post baseline, zero broken/indexability/canonical/H1 findings, duplicate paginated deal descriptions, query-variant monitoring concern, PageSpeed API 429 limitation, reference-price feed risk, unreportable Hobby custom events, and AdSense’s unconfigured state.
- Produces: a prioritized indexing/distribution list for the five new URLs, a no-sitemap-removal instruction, feed-refresh deadlines, AdSense ID/CMP steps, and measurable weekly affiliate/search checks.

- [ ] Write the dated audit with evidence, severity, implemented-versus-external ownership, and no unsupported PageSpeed score.
- [ ] Update the traffic checklist with the five exact URLs and a value-first distribution sequence; state that the existing sitemap should be refreshed/resubmitted rather than removed.
- [ ] Review the documents against current code/live evidence and ensure no task is represented as complete before it is verifiably complete.
- [ ] Run `git diff --check`, commit only Task 4 files, and append self-review to the SDD progress ledger.

### Task 5: Independent review, verification, promotion, and live validation

- [ ] Build a review package from the SDD ledger and task commits; dispatch an independent final diff reviewer and resolve every Critical/Important finding through the fix loop.
- [ ] Run `npm run check` and record exact suite/build results.
- [ ] Run `npx playwright test --workers=1` and record the final passed-test count.
- [ ] Run `npm audit --omit=dev` and `git diff --check`.
- [ ] Confirm `git status`, compare with current `origin/main`, and promote the reviewed commits to local `main` without including generated worktree artifacts.
- [ ] Push `main`, wait for production deployment, then validate the five routes, five images, canonical metadata, scanner CTA, sitemap totals, robots, redirects, and unchanged pre-approval `/ads.txt` behavior.
- [ ] Report external next actions separately: affiliate feed refresh/dashboard reconciliation, AdSense publisher ID and CMP setup, and Search Console/Bing URL inspection/indexing requests.
