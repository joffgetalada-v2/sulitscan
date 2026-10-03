# SulitScan October Growth and Freshness Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recover SulitScan from its truthful zero-active-deal state, correct search/indexing drift, improve guide discovery and conversion, and publish five source-backed October buyer guides with original banners.

**Architecture:** Preserve the existing time-based deal expiry and data-driven App Router architecture. Add explicit clock injection to pure catalog selectors, build sitemap/filter/scanner/contact policies in focused helpers, and make pages consume those policies without duplicating eligibility rules. Keep the five guides in the established post registry and enforce their editorial and media contract through the Node test suite.

**Tech Stack:** Next.js 16.3.4 App Router, React 19.2.4, TypeScript, Node test runner, Playwright, Tailwind CSS, Sharp-compatible progressive JPEG assets.

**Spec:** `docs/superpowers/specs/2026-10-03-sulitscan-october-growth-design.md`

## Global Constraints

- Never advance a deal `lastChecked` value or expose an expired deal as active without a real partner-page or affiliate-feed verification.
- Use the current Next.js 16.3.4 documentation in `node_modules/next/dist/docs/` before changing App Router caching, metadata, `searchParams`, or Route Handler behavior.
- A sitemap URL must be indexable and self-canonical under the same catalog state used to build the sitemap.
- Do not change affiliate tracking destinations, advertiser relationships, AdSense state, publisher IDs, consent settings, or DTI/BIR claims.
- Do not claim hands-on testing, fixed live prices, guaranteed discounts, guaranteed safety/authenticity/fit/performance, or regulatory approval that the cited source does not establish.
- ImportTaxPH is allowed only in the food-container cross-border-cost section; ApplyReadyCV is allowed only in the phone-tripod online-interview context.
- Every new banner must be a distinct, visually inspected 1600×900 progressive JPEG with no readable text, logo, trademark, price, claim, or watermark.
- Stage only intended paths. Do not touch the primary checkout's unrelated untracked `output/` or `tmp/` trees.

## Review Focus

- A future date with zero active deals must produce useful pages and a sitemap with no expired or placeholder URLs; Task 1 and Task 2 own this test.
- Repeated, invalid, or oversized blog query parameters must not throw, become indexable, or change newest-first ordering unexpectedly; Task 5 owns this test.
- Empty or malformed contact JSON and a resolved Resend error must never return success or interpolate unsafe input; Task 3 owns this test.
- Campaign logic must be correct at both inclusive UTC boundaries, between campaigns, and when a configured guide is missing; Task 4 owns this test.
- A guide may contain an external sister-site hostname only in its explicitly permitted context and must not imply an active matching deal; Task 6 owns this test.

---

### Task 1: Deterministic catalog clock and indexable sitemap

**Files:**
- Modify: `src/data/deals.ts`
- Create: `src/lib/sitemap-builder.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/deal-freshness.node.mjs`
- Modify: `tests/recommendations.node.mjs`
- Modify: `tests/affiliate-compliance.node.mjs`
- Modify: `tests/seo-helpers.node.mjs`
- Create: `tests/sitemap.node.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: optional trailing `now: Date = new Date()` parameters on `getActiveDeals`, `getFeaturedDeals`, `getRelatedDealsForDeal`, `getActiveCategories`, `getDealsByCategory`, and `getDealsByPlatform`.
- Produces: `buildSitemapEntries(now: Date): MetadataRoute.Sitemap` in `src/lib/sitemap-builder.ts`.
- Consumes: existing deal indexability, pagination, categories, stores, posts, and `siteConfig` helpers.

- [ ] **Step 1: Pin the clock-dependent test fixtures**

Update existing tests that require active June records to pass `new Date("2026-09-05T00:00:00.000Z")`. Add an explicit assertion that all public records are inactive at `new Date("2026-10-03T00:00:00.000Z")`. Do not change thresholds or source dates.

- [ ] **Step 2: Write the failing sitemap policy test**

Assert that a historical populated state emits only canonical active deal/entity pagination routes and that the 2026-10-03 state contains only permanent routes and blog routes. Assert URL uniqueness, no query/filter URLs other than canonical pagination, no zero-result entity routes, and the spec's final 78-URL count after Task 6 adds five posts; before Task 6, express the count as `14 + posts.length` so this task can pass independently.

- [ ] **Step 3: Run the focused tests and verify RED**

Run: `node --test tests/deal-freshness.node.mjs tests/recommendations.node.mjs tests/affiliate-compliance.node.mjs tests/seo-helpers.node.mjs tests/sitemap.node.mjs`

Expected: FAIL because selectors do not accept the fixed clock and `buildSitemapEntries` does not exist.

- [ ] **Step 4: Add optional clock injection without changing defaults**

Thread the same `now` value through every selector listed in Interfaces. Existing production callers with no argument must retain current-time behavior.

- [ ] **Step 5: Extract and wire the sitemap builder**

Move route assembly into `buildSitemapEntries(now)`, capture one `new Date()` in `src/app/sitemap.ts`, export `dynamic = "force-dynamic"`, and delegate to the builder. Never create a page-one route through `Math.max(1, pageCount)` when the entity has zero records.

- [ ] **Step 6: Add the sitemap test script and verify GREEN**

Add `test:sitemap` and include it in `check` after `test:seo`.

Run: `npm run test:deal-freshness && npm run test:recommendations && npm run test:compliance && npm run test:seo && npm run test:sitemap && npm run lint && npm run typecheck`

Expected: all commands exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/data/deals.ts src/lib/sitemap-builder.ts src/app/sitemap.ts tests/deal-freshness.node.mjs tests/recommendations.node.mjs tests/affiliate-compliance.node.mjs tests/seo-helpers.node.mjs tests/sitemap.node.mjs package.json
git commit -m "fix: align deal freshness and sitemap eligibility"
```

### Task 2: Zero-catalog conversion paths and scanner payload boundary

**Files:**
- Create: `src/components/CatalogRefreshNotice.tsx`
- Create: `src/lib/deal-scanner.ts`
- Modify: `src/components/DealScannerVisual.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/DealsGrid.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/deals/page.tsx`
- Modify: `src/app/categories/[slug]/page.tsx`
- Modify: `src/app/stores/[slug]/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Create: `tests/catalog-empty-state.node.mjs`
- Modify: `tests/smoke.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: serializable `DealScannerSlide` and `getDealScannerSlides(deals: Deal[], limit?: number): DealScannerSlide[]`.
- Produces: `CatalogRefreshNotice` with optional heading/context props and fixed links to `/blog`, `/tools/checkout-comparison`, and the three store pages.
- Consumes: deterministic active deal selectors from Task 1.

- [ ] **Step 1: Write failing zero-state and payload-boundary tests**

Assert that `DealScannerVisual.tsx` does not import `@/data/deals`, `getDealScannerSlides` deduplicates categories and caps the payload, unfiltered zero-result `/deals` renders refresh guidance without “Clear all filters,” filtered zero-result views retain filter-specific reset copy, and home copy never says `0+ curated deal notes`. Add a Playwright assertion for the three useful zero-state paths.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `node --test tests/catalog-empty-state.node.mjs && npx playwright test tests/smoke.spec.ts --grep "empty catalog" --workers=1`

Expected: FAIL because the helper/component and differentiated zero states do not exist.

- [ ] **Step 3: Move scanner selection and serialization to the server boundary**

Map only the fields the visual renders, cap the slides, pass them from `src/app/page.tsx` through `Hero`, and remove client imports of the deal registry and freshness helper. When the slide array is empty, render a non-price guide/checklist card linked to `/blog` and `/tools/checkout-comparison`.

- [ ] **Step 4: Implement shared useful zero states**

Use `CatalogRefreshNotice` on home and unfiltered `/deals`. Keep a separate filtered-no-match message in `DealsGrid`. Replace category/store “browse all empty deals” loops with relevant guide and store/tool paths. Keep existing affiliate disclosure and external-link behavior.

- [ ] **Step 5: Make blog recommendations time-safe**

Add `export const revalidate = 86400` to the blog detail route so time-sensitive related deal content is regenerated daily.

- [ ] **Step 6: Verify GREEN and the client boundary**

Add `test:catalog-empty-state` to `package.json` and include it in `check` after `test:sitemap`.

Run: `npm run test:catalog-empty-state && npm run lint && npm run typecheck && npm run build`

Expected: all commands exit 0; build output succeeds with no catalog import in the scanner client source.

- [ ] **Step 7: Commit**

```bash
git add src/components/CatalogRefreshNotice.tsx src/lib/deal-scanner.ts src/components/DealScannerVisual.tsx src/components/Hero.tsx src/components/DealsGrid.tsx src/app/page.tsx src/app/deals/page.tsx 'src/app/categories/[slug]/page.tsx' 'src/app/stores/[slug]/page.tsx' 'src/app/blog/[slug]/page.tsx' tests/catalog-empty-state.node.mjs tests/smoke.spec.ts package.json
git commit -m "feat: add useful paths while deals refresh"
```

### Task 3: Reliable contact request handling

**Files:**
- Create: `src/lib/contact-message.ts`
- Modify: `src/app/api/contact/route.ts`
- Create: `tests/contact-route.node.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `parseContactMessage(value: unknown): ContactMessageResult` with validated, trimmed fields or a status/error result.
- Produces: `escapeHtml(value: string): string` and `sanitizeSubjectFragment(value: string): string` in the pure helper.
- Consumes: Resend's `{ data, error }` result without sending during tests.

- [ ] **Step 1: Write failing parser and provider-result tests**

Cover invalid JSON, arrays, numeric fields, blank fields, invalid email, unknown subject, CR/LF subject injection, HTML characters, configured maximum lengths, a thrown provider exception, a resolved `{ error }`, and a successful `{ data, error: null }`.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/contact-route.node.mjs`

Expected: FAIL because the pure parser and provider error handling do not exist.

- [ ] **Step 3: Implement validation and safe formatting**

Use exact limits of 100 characters for name, 254 for email, 50 for subject key, and 5,000 for message. Return 400 for malformed JSON/body types, 422 for invalid fields, and 500 for provider failures. Escape all HTML fields and strip CR/LF from subject fragments.

- [ ] **Step 4: Inspect the Resend result**

Return `{ success: true }` only if `result.error` is absent. Preserve routing and the existing user-facing fallback email address.

- [ ] **Step 5: Verify GREEN**

Add `test:contact` to `package.json` and include it in `check` after `test:catalog-empty-state`.

Run: `npm run test:contact && npm run lint && npm run typecheck`

Expected: all commands exit 0 and no live email is sent.

- [ ] **Step 6: Commit**

```bash
git add src/lib/contact-message.ts src/app/api/contact/route.ts tests/contact-route.node.mjs package.json
git commit -m "fix: validate contact requests and delivery errors"
```

### Task 4: Data-driven 10.10 and 11.11 promotion windows

**Files:**
- Modify: `src/lib/seasonal-promotion.ts`
- Modify: `tests/seasonal-promotion.node.mjs`
- Modify: `src/app/page.tsx`
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Preserves: `SeasonalPromotion`, `getSeasonalPromotion(now?: Date)`, and `getPromotedPosts(orderedPosts, now?, count?)`.
- Produces: the exact 10.10 and 11.11 campaign records and UTC boundaries from the spec.

- [ ] **Step 1: Replace expired 9.9 expectations with failing campaign-table tests**

Test the instant before, inclusive start, in-window instant, inclusive end, and instant after each campaign; the gap between campaigns; invalid dates; immutable distinct returns; missing guide behavior; deduplication; and count normalization.

- [ ] **Step 2: Verify RED**

Run: `npm run test:seasonal-promotion`

Expected: FAIL because the helper only knows the expired 9.9 campaign.

- [ ] **Step 3: Implement the ordered campaign table**

Select the first campaign whose inclusive interval contains `now.getTime()`. Invalid dates return no promotion. Keep the generic hydration-safe header initial state and existing post ordering behavior outside active windows.

- [ ] **Step 4: Verify page and header wiring**

Update component tests to assert the exact 10.10 copy and destination on 2026-10-03 and exact 11.11 behavior in its window.

- [ ] **Step 5: Verify GREEN**

Run: `npm run test:seasonal-promotion && npm run lint && npm run typecheck`

Expected: all commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seasonal-promotion.ts tests/seasonal-promotion.node.mjs src/app/page.tsx src/components/Header.tsx
git commit -m "feat: schedule 10.10 and 11.11 guide spotlights"
```

### Task 5: Server-rendered blog guide explorer

**Files:**
- Create: `src/lib/blog-listing.ts`
- Modify: `src/app/blog/page.tsx`
- Create: `tests/blog-listing.node.mjs`
- Modify: `tests/seo-helpers.node.mjs`
- Modify: `tests/smoke.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `BlogSearchParams`, `NormalizedBlogFilters`, and `resolveBlogListing(posts: BlogPost[], raw: BlogSearchParams): BlogListingResult`.
- Produces: `buildBlogHref(filters: Partial<NormalizedBlogFilters>): string`.
- Consumes: asynchronous Next.js 16 `searchParams` and `getPostsNewestFirst()`.

- [ ] **Step 1: Write failing normalization, matching, and metadata tests**

Assert repeated values use the first value, whitespace is collapsed, query length is capped at 80, unknown categories normalize to `All`, matching covers title/excerpt/category/tags case-insensitively, ordering remains newest-first, and no-result state is explicit. Assert any raw query/filter canonicalizes to `/blog` with `noindex,follow`; the unfiltered page remains indexable.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/blog-listing.node.mjs tests/seo-helpers.node.mjs`

Expected: FAIL because the filter helper and dynamic blog metadata do not exist.

- [ ] **Step 3: Implement the pure filter helper**

Do not search full article bodies. Return the visible posts, valid category options, normalized filters, and `isFiltered` from title/excerpt/category/tag fields only.

- [ ] **Step 4: Add the accessible GET form and category links**

Make the blog page async, render current values with native form controls, preserve query when changing a valid category, show the visible-result count, render only visible cards and ItemList entries, and add a reset action for no results. Do not add a client component.

- [ ] **Step 5: Add dynamic metadata**

Use `generateMetadata({ searchParams })`; keep the canonical at `${siteConfig.url}/blog` and set `robots.index` false whenever raw filtering/query input is present.

- [ ] **Step 6: Verify GREEN**

Add `test:blog-listing` to `package.json` and include it in `check` after `test:seasonal-promotion`.

Run: `npm run test:blog-listing && npm run test:seo && npm run lint && npm run typecheck && npx playwright test tests/smoke.spec.ts --grep "blog explorer" --workers=1`

Expected: all commands exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/lib/blog-listing.ts src/app/blog/page.tsx tests/blog-listing.node.mjs tests/seo-helpers.node.mjs tests/smoke.spec.ts package.json
git commit -m "feat: add searchable shopping guide explorer"
```

### Task 6: Five October guides and original media

**Files:**
- Modify: `src/data/posts.ts`
- Modify: `tests/recommendations.node.mjs`
- Add: `public/images/guides/food-storage-containers-buying-guide-philippines.jpg`
- Add: `public/images/guides/sephora-ph-minis-vs-full-size-value-sets.jpg`
- Add: `public/images/guides/mattress-protector-buying-guide-philippines.jpg`
- Add: `public/images/guides/phone-tripod-buying-guide-philippines.jpg`
- Add: `public/images/guides/christmas-lights-buying-guide-philippines.jpg`
- Modify: `public/images/guides/README.md`
- Modify: `content-calendar.md`
- Create: `docs/seo-audit-2026-10-03.md`

**Interfaces:**
- Produces: ordered registry entries `post-060` through `post-064` with exact slugs/titles/dates from the spec.
- Consumes: existing `BlogPost`, recommendation intent, sister-site tracking renderer, FAQ schema, internal recommendation, and cover-image conventions.

- [ ] **Step 1: Generate and visually inspect five unreferenced banners**

Use the image-generation skill and save distinct source outputs. Convert/crop each to a 1600×900 progressive JPEG, inspect every final, and reject any image with readable text, a brand mark, trademark, price, claim, watermark, misleading certification mark, or malformed object.

Use these exact alt-text intents:

1. `Food storage container comparison with glass, plastic, and stainless containers beside portion dividers, lids, and a refrigerator shelf`
2. `Beauty value set comparison with miniature and full-size unbranded skincare bottles beside a pouch, ruler, and cost-per-use symbols`
3. `Mattress protector buying guide with a cutaway mattress, fitted protector, depth measurement, water droplets, and washing symbols`
4. `Phone tripod buying guide with smartphone clamp, tabletop and full-height tripods, stability feet, and a video-call frame`
5. `Christmas lights buying guide with plug-in string lights, solar panel, battery pack, outdoor shelter, and safety checklist symbols`

- [ ] **Step 2: Write the failing October registry contract**

For each guide, assert exact id/slug/title/category/dates/read time, a unique six-tag set, cover path/alt text, recommendation intent, three FAQs, required H2 sections, at least five additional H2s, at least three internal links, official source URLs, and substantial distinct copy. Assert only post-060 contains ImportTaxPH and only post-063 contains ApplyReadyCV; no post may imply a current matching product. Validate five unique 1600×900 progressive JPEGs and recorded SHA-256 values.

- [ ] **Step 3: Verify RED**

Run: `npm run test:recommendations`

Expected: FAIL because the October registry entries do not exist.

- [ ] **Step 4: Author post-060 and post-061**

Implement the food-container and Sephora mini/full-size decisions using only propositions supported by the spec's current official sources. Give each a direct answer, comparison workflow, checkout checklist, limitations, affiliate disclosure, internal links, recommendation intent, and three FAQs.

- [ ] **Step 5: Author post-062 and post-063**

Implement the mattress-protector and phone-tripod decisions. Attribute model-specific dimensions/claims to the exact model, and keep the ApplyReadyCV paragraph limited to preparing application materials before an online interview.

- [ ] **Step 6: Author post-064**

Implement the Christmas-lights decision with precise DTI-BPS scope language, a dated 2021 historical-safety qualification, and an explicit warning that exclusions do not imply safety.

- [ ] **Step 7: Document media, audit, and cadence**

Record generation method, exact final dimensions, progressive format, alt text, and SHA-256 values in the image README. Add the five posts plus next research queue to `content-calendar.md`. Write `docs/seo-audit-2026-10-03.md` with evidence, implemented actions, owner-dependent follow-ups, and the five-quality-guides-per-week recommendation without claimed keyword volume.

- [ ] **Step 8: Verify the release contract**

Run: `npm run test:recommendations && npm run test:sitemap && npm run check:links && npm run lint && npm run typecheck`

Expected: all commands exit 0; sitemap test now confirms exactly 78 URLs at the 2026-10-03 state.

- [ ] **Step 9: Commit**

```bash
git add src/data/posts.ts tests/recommendations.node.mjs public/images/guides/food-storage-containers-buying-guide-philippines.jpg public/images/guides/sephora-ph-minis-vs-full-size-value-sets.jpg public/images/guides/mattress-protector-buying-guide-philippines.jpg public/images/guides/phone-tripod-buying-guide-philippines.jpg public/images/guides/christmas-lights-buying-guide-philippines.jpg public/images/guides/README.md content-calendar.md docs/seo-audit-2026-10-03.md
git commit -m "feat: publish October buyer guide collection"
```

### Task 7: Full release verification and production promotion

**Files:**
- Modify only files required to fix verified release regressions.

**Interfaces:**
- Consumes: every task above.
- Produces: a reviewed, verified branch promoted to `main` and live production evidence.

- [ ] **Step 1: Run the complete local release gate**

Run: `npm audit --audit-level=high`

Run: `npm run check`

Run: `npx playwright test --workers=1`

Expected: every command exits 0. Fix root causes and rerun any failed command in full.

- [ ] **Step 2: Inspect the production build artifacts**

Confirm the scanner client chunk no longer contains the full deal catalog, the sitemap route is dynamic, all five guides are emitted, and no build warning indicates accidental dynamic/canonical behavior.

- [ ] **Step 3: Request a whole-branch review**

Review the complete diff from `b03f646748fb911256cf83bd47211613592a8916` for correctness, freshness truthfulness, SEO/indexability, accessibility, conversion copy, source fidelity, and unintended affiliate or legal claims. Resolve every valid finding and rerun affected tests.

- [ ] **Step 4: Promote to main without disturbing primary untracked files**

Fetch `origin/main`, verify it has not diverged unexpectedly, then fast-forward or cherry-pick the reviewed work into the primary `main` checkout. Stage explicit paths only and push `main` to `origin`.

- [ ] **Step 5: Verify deployment**

Check the live homepage, `/deals`, `/blog` filters, all five article routes and images, metadata/schema, `sitemap.xml`, the 10.10 announcement, and responsive behavior. Confirm expired deal and zero-result entity routes are absent from the live sitemap. Do not submit a real contact message.

- [ ] **Step 6: Record the final evidence**

Report the pushed commit, verification commands, live checks, sitemap/indexing guidance, and any owner-only follow-up. Do not declare rankings or traffic gains before Search Console and analytics collect post-release data.
