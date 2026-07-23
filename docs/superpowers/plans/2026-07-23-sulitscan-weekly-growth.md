# SulitScan Weekly Growth Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove confirmed indexable demo-offer and crawl gaps, add a truthful final-checkout comparison tool, and publish five search-led guides with original banners.

**Architecture:** Public deal eligibility is centralized in `src/data/deals.ts`; category and store collections share one server-pagination helper and one server-rendered grid. The calculator separates pure numeric logic from a client UI, while articles remain in the established typed `posts.ts` registry and reuse the existing recommendation, JSON-LD, analytics, and image paths.

**Tech Stack:** Next.js 16.2.11 App Router, React 19, TypeScript, Tailwind CSS, Node test runner, Playwright, Vercel Analytics, Next Image.

## Global Constraints

- Do not publish or link SHEIN anywhere in public promotional content while offer access is blocked.
- Do not invent coupons, live prices, stock, usage totals, reviews, physical testing, or “best/lowest price” claims.
- Public deal pages expose only active partner-platform deals that have public imagery.
- Category and store pagination uses exactly 24 deals per page and crawlable server-rendered links.
- ImportTaxPH is linked only for landed-cost work; do not add ApplyReadyCV where the article/tool has no CV or job-application context.
- Every new guide is dated `2026-07-23` and has its own `public/images/guides/<slug>.jpg` banner.
- Follow `node_modules/next/dist/docs/` for Next.js 16 metadata, promised dynamic params, sitemaps, and the `preload` Image prop.
- Preserve current affiliate disclosures, sponsored-offer separation, deterministic recommendation rules, and analytics-failure-safe navigation.
- Use test-first red/green/refactor for behavior changes; generated raster assets receive file-presence and visual inspection gates.

---

### Task 1: Secure public deal routes and framework dependencies

**Files:**
- Modify: `src/data/deals.ts`
- Modify: `src/app/deals/[slug]/page.tsx`
- Modify: `src/app/categories/[slug]/page.tsx`
- Modify: `src/app/stores/[slug]/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/stores/page.tsx`
- Modify: `src/components/DealScannerVisual.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `tests/affiliate-compliance.node.mjs`
- Test: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `getDealBySlug(slug: string): Deal | undefined`, now guaranteed to return only publicly active deals.
- Preserves: `getActiveDeals()` ordering and eligibility.

- [ ] **Step 1: Add failing inactive-deal eligibility assertions**

Extend `tests/affiliate-compliance.node.mjs` to load `src/data/deals.ts` and assert:

```js
assert.equal(dealsModule.getDealBySlug("summer-dress-shein"), undefined)
assert.equal(dealsModule.getDealBySlug("xiaomi-smart-band-9-shopee"), undefined)
assert.ok(dealsModule.getDealBySlug(dealsModule.getActiveDeals()[0].slug))
```

Add a Playwright regression expecting both inactive URLs to return HTTP 404 and `robots` content containing `noindex`.

- [ ] **Step 2: Run the compliance test and observe the intended failure**

Run: `npm run test:compliance`  
Expected: FAIL because `getDealBySlug()` currently returns hidden demo records.

- [ ] **Step 3: Centralize public eligibility**

Move the active-platform set above the slug helper, add a single predicate, and use it in both public helpers:

```ts
export function isPublicDeal(deal: Deal): boolean {
  return ACTIVE_PLATFORMS.has(deal.platform) && Boolean(deal.imageUrl)
}

export function getDealBySlug(slug: string): Deal | undefined {
  return deals.find((deal) => deal.slug === slug && isPublicDeal(deal))
}

export function getActiveDeals(): Deal[] {
  return deals.filter(isPublicDeal).sort(compareDealsForDefault)
}
```

Keep the existing deal route's `notFound()` path; its metadata lookup will now return `{}` and the page will 404 for inactive slugs.

- [ ] **Step 4: Add entity-specific social metadata**

For deal, category, and store metadata, provide page-specific `openGraph` and `twitter` objects with title, description, canonical URL, `summary_large_image`, and a safe image. Use `siteConfig.ogImage` when an entity image is unavailable; use an absolute `${siteConfig.url}${store.bannerImage}` for a local store banner.

- [ ] **Step 5: Apply the documented Next.js image API and security patch**

Replace intentional above-the-fold `priority` props under `src/` with `preload`. Do not alter sitemap `priority` values. Then run:

```powershell
npm install next@16.2.11 eslint-config-next@16.2.11
```

- [ ] **Step 6: Verify green behavior and dependency state**

Run: `npm run test:compliance`  
Expected: all compliance tests PASS.

Run: `npm run typecheck`  
Expected: PASS with the Next.js 16.2.11 types.

Run: `npm audit --omit=dev`  
Expected: zero production vulnerabilities.

- [ ] **Step 7: Commit the task**

```powershell
git add package.json package-lock.json src/data/deals.ts src/app/deals/[slug]/page.tsx src/app/categories/[slug]/page.tsx src/app/stores/[slug]/page.tsx src/app/blog/page.tsx src/app/blog/[slug]/page.tsx src/app/stores/page.tsx src/components/DealScannerVisual.tsx tests/affiliate-compliance.node.mjs tests/smoke.spec.ts
git commit -m "fix: block inactive deal pages and update Next.js"
```

---

### Task 2: Make category and store inventories crawlable

**Files:**
- Create: `src/lib/entity-deal-listing.ts`
- Create: `src/components/EntityDeals.tsx`
- Modify: `src/app/categories/[slug]/page.tsx`
- Modify: `src/app/stores/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Delete: `src/components/CategoryDeals.tsx`
- Delete: `src/components/StoreDeals.tsx`
- Test: `tests/seo-helpers.node.mjs`
- Test: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `ENTITY_DEALS_PAGE_SIZE = 24`.
- Produces: `resolveEntityDealListing(deals: Deal[], rawPage: string | string[] | undefined): EntityDealListingResult`.
- Produces: `buildEntityPageHref(basePath: string, page: number): string`.
- Produces: `EntityDeals` server component accepting `listing`, `basePath`, `gridClassName`, and `priceNote`.

- [ ] **Step 1: Write failing pagination-helper tests**

Add tests to `tests/seo-helpers.node.mjs` using a 50-deal fixture:

```js
const pageTwo = entityListing.resolveEntityDealListing(fixture, "2")
assert.equal(pageTwo.page, 2)
assert.equal(pageTwo.items.length, 24)
assert.equal(pageTwo.items[0], fixture[24])
assert.equal(pageTwo.pageCount, 3)
assert.equal(pageTwo.isCanonicalRequest, true)

const invalid = entityListing.resolveEntityDealListing(fixture, "garbage")
assert.equal(invalid.page, 1)
assert.equal(invalid.isCanonicalRequest, false)

assert.equal(entityListing.buildEntityPageHref("/categories/home-finds", 1), "/categories/home-finds")
assert.equal(entityListing.buildEntityPageHref("/categories/home-finds", 2), "/categories/home-finds?page=2")
```

- [ ] **Step 2: Run the SEO test and observe the missing-module failure**

Run: `npm run test:seo`  
Expected: FAIL because `src/lib/entity-deal-listing.ts` does not exist.

- [ ] **Step 3: Implement the pure listing helper**

Normalize array values to their first entry, accept only positive integer strings, clamp to the available page count, return a 24-item slice, and mark only blank page 1 or the exact normalized page string as canonical.

- [ ] **Step 4: Implement server-rendered entity pagination**

`EntityDeals` renders the provided slice, the exact page count, previous/next links, up to five numbered links, `aria-current="page"`, and the existing price disclaimer. It contains no `use client`, state, or button-based loading.

- [ ] **Step 5: Wire category and store pages**

Add `searchParams: Promise<{ page?: string | string[] }>` to both page and metadata props. Resolve the current slice server-side. Page 1 canonicals omit the query; page 2+ canonicals use `?page=N`; invalid/non-canonical page inputs set `robots.index` false. Add “Page N” to H1-adjacent status, title, ItemList name, and ItemList positions where `N > 1`.

- [ ] **Step 6: Add deeper entity pages to the sitemap**

For every featured category and active store, derive page count from its active deals and append page 2+ URLs using `buildEntityPageHref`. Keep the clean page-1 routes already emitted.

- [ ] **Step 7: Add browser regressions and verify green**

In `tests/smoke.spec.ts`, assert `/categories/under-1000` and `/stores/temu` expose a real “Next page” link, page 2 returns 200, its canonical includes `?page=2`, and its deal cards differ from page 1.

Run: `npm run test:seo`  
Expected: all SEO tests PASS.

Run: `npm run typecheck`  
Expected: PASS.

- [ ] **Step 8: Commit the task**

```powershell
git add src/lib/entity-deal-listing.ts src/components/EntityDeals.tsx src/app/categories/[slug]/page.tsx src/app/stores/[slug]/page.tsx src/app/sitemap.ts tests/seo-helpers.node.mjs tests/smoke.spec.ts
git rm src/components/CategoryDeals.tsx src/components/StoreDeals.tsx
git commit -m "fix: make category and store deals crawlable"
```

---

### Task 3: Build the final checkout comparison tool

**Files:**
- Create: `src/lib/checkout-comparison.ts`
- Create: `src/components/CheckoutComparisonCalculator.tsx`
- Create: `src/app/tools/checkout-comparison/page.tsx`
- Create: `tests/checkout-comparison.node.mjs`
- Modify: `package.json`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/data/posts.ts`
- Test: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `CheckoutOfferInput` with `itemPrice`, `quantity`, `shipping`, `voucherDiscount`, `paymentDiscount`, `otherFees`, and `importCost` numeric fields.
- Produces: `calculateCheckoutOffer(input): { subtotal: number; total: number; perUnit: number }`.
- Produces: `compareCheckoutOffers(a, b): { winner: "a" | "b" | "tie"; difference: number }`.

- [ ] **Step 1: Write the failing pure-logic tests**

Test an offer with item price 250, quantity 2, shipping 50, voucher 75, payment discount 25, other fees 10, and import cost 40. Assert subtotal 500, total 500, and per-unit 250. Test negative inputs clamp to zero, quantity `0` becomes `1`, and equal totals return `winner: "tie"` with difference 0.

- [ ] **Step 2: Run the new test and observe the missing-module failure**

Run: `node --test tests/checkout-comparison.node.mjs`  
Expected: FAIL because the calculator module does not exist.

- [ ] **Step 3: Implement minimal pure calculation logic**

Use finite-number normalization, `Math.max(0, value)`, integer quantity normalization, and round currency results to two decimal places. Total formula:

```ts
total = Math.max(0, itemPrice * quantity + shipping + otherFees + importCost - voucherDiscount - paymentDiscount)
```

- [ ] **Step 4: Build the accessible calculator UI**

Render two labeled offer fieldsets, numeric inputs with `min="0"`, a submit button labeled “Compare final totals,” and an `aria-live="polite"` result. On submit, call Vercel `track("checkout_comparison_completed", { source: "checkout-comparison-tool" })` inside `try/catch`; do not send labels, prices, or any entered value.

- [ ] **Step 5: Build the SEO landing page and contextual links**

Add page-specific metadata, canonical, breadcrumb JSON-LD, FAQ JSON-LD, explanatory sections, formula, limitations, and a tracked ImportTaxPH link for estimating possible cross-border costs. Add visible links from header/footer, a homepage utility section, sitemap, and the existing `why-final-prices-change-at-checkout` plus import-tax guides.

- [ ] **Step 6: Add browser behavior coverage and verify green**

Playwright fills both offers, submits, confirms the winner/difference and per-unit values, intercepts the privacy-safe analytics event, and confirms no input values are present in event data.

Run: `npm run test:checkout-comparison`  
Expected: all calculator tests PASS.

Run: `npm run typecheck`  
Expected: PASS.

- [ ] **Step 7: Commit the task**

```powershell
git add package.json src/lib/checkout-comparison.ts src/components/CheckoutComparisonCalculator.tsx src/app/tools/checkout-comparison/page.tsx src/components/Header.tsx src/components/Footer.tsx src/app/page.tsx src/app/sitemap.ts src/data/posts.ts tests/checkout-comparison.node.mjs tests/smoke.spec.ts
git commit -m "feat: add checkout price comparison tool"
```

---

### Task 4: Publish five search-led guides

**Files:**
- Modify: `src/data/posts.ts`
- Modify: `tests/recommendations.node.mjs`

**Interfaces:**
- Adds post IDs `post-025` through `post-029`.
- Uses the existing `BlogPost`, `BlogRecommendationIntent`, FAQ, cover image, and inline-link renderer contracts.

- [ ] **Step 1: Add failing editorial data tests**

Assert all five exact slugs exist, each uses `publishedAt` and `lastReviewed` equal to `2026-07-23`, all excerpts are unique and at most 160 characters, all five have at least four H2 sections plus an affiliate disclosure, and their recommendation rules return only active non-suspicious deals. Add focused assertions that the unboxing guide states video requirements vary by platform and the power-bank guide includes an `iata.org` source plus a carrier-policy recheck.

- [ ] **Step 2: Run the recommendation test and observe missing-post failures**

Run: `npm run test:recommendations`  
Expected: FAIL because the five slugs do not exist.

- [ ] **Step 3: Add the online shoe size guide**

Use slug `online-shoe-size-guide-philippines`, category `Fashion Guides`, topics `shoe-buying` and `fashion-buying`, platforms Temu and Shopee PH, Fashion category, and deal tags `shoes`, `sandals`, `heels`, `clogs`. Explain measurement and fit without asserting universal size conversions.

- [ ] **Step 4: Add the unboxing evidence guide**

Use slug `unboxing-video-evidence-online-shopping-philippines`, category `Shopping Tips`, topics `shopping-safety` and `returns`, and no product-deal rule. Cite DTI e-commerce guidance, call video optional evidence rather than a legal requirement, and link the existing returns, safety, and seller-check guides.

- [ ] **Step 5: Add the travel organizer guide**

Use slug `travel-packing-organizers-philippines-buying-guide`, category `Travel Guides`, topics `travel-planning`, `bag-buying`, and `carry-on-luggage`, platform Shopee PH, categories Travel and Fashion, tags `travel`, `organizer`, `bag`, `packing`, and max price 500.

- [ ] **Step 6: Add the first-apartment guide**

Use slug `first-apartment-essentials-under-1000-philippines`, category `Home Guides`, topics `home-organization`, `cookware-buying`, and `first-home`, platforms Temu and Shopee PH, Home category, tags `home`, `storage`, `kitchen`, `organizer`, `lighting`, and max price 1000.

- [ ] **Step 7: Add the power-bank guide**

Use slug `power-bank-buying-guide-philippines`, category `Tech Guides`, topics `tech-accessories`, `power-bank-buying`, and `travel-planning`, platforms Temu and Shopee PH, Electronics category, tags `power-bank`, `usb-c`, `charger`, and max price 1000. Cite IATA's portable-device and lithium-battery guidance, distinguish mAh from Wh, and link the existing phone-accessory, carry-on, and new comparison-tool pages.

- [ ] **Step 8: Link related existing guides and verify green**

Add natural inline links from the existing phone-accessory guide to the power-bank guide, carry-on guide to travel organizers, bags guide to shoe sizing where relevant, and voucher/return guide to unboxing evidence. Do not add forced sister-site links.

Run: `npm run test:recommendations`  
Expected: all recommendation/editorial tests PASS.

Run: `npm run check:links`  
Expected: 29 posts and all internal links resolve.

- [ ] **Step 9: Commit the task**

```powershell
git add src/data/posts.ts tests/recommendations.node.mjs
git commit -m "content: publish five weekly shopping guides"
```

---

### Task 5: Generate and validate five original guide banners

**Files:**
- Create: `public/images/guides/online-shoe-size-guide-philippines.jpg`
- Create: `public/images/guides/unboxing-video-evidence-online-shopping-philippines.jpg`
- Create: `public/images/guides/travel-packing-organizers-philippines-buying-guide.jpg`
- Create: `public/images/guides/first-apartment-essentials-under-1000-philippines.jpg`
- Create: `public/images/guides/power-bank-buying-guide-philippines.jpg`
- Modify: `public/images/guides/README.md`
- Test: `tests/recommendations.node.mjs`

**Interfaces:**
- Every new post's `coverImage` resolves to a real 16:9 JPEG in `public/images/guides/`.

- [ ] **Step 1: Add failing asset-presence assertions**

For the five new posts, resolve the `coverImage` path under `public/`, assert the file exists, and assert no two posts share the same path.

- [ ] **Step 2: Run the recommendation test and observe missing-file failures**

Run: `npm run test:recommendations`  
Expected: FAIL for the five missing JPEG files.

- [ ] **Step 3: Generate each banner with the built-in image generator**

Use five separate prompts in the `ads-marketing` or `photorealistic-natural` taxonomy, 16:9 composition, SulitScan's green/slate/amber visual family, brand-neutral objects, no logos, no watermarks, no fake UI, no legible promotional text, and negative space that crops safely at 260px height.

- [ ] **Step 4: Copy final assets into the workspace and normalize them**

Copy the selected outputs from the generator's `$CODEX_HOME/generated_images/` location into the exact project paths above. Use the repository's existing JPEG dimensions/quality convention; do not overwrite older guides.

- [ ] **Step 5: Inspect every banner**

Open all five with `view_image`. Check subject accuracy, anatomy/object integrity, accidental text/logos/watermarks, contrast, 16:9 crop safety, and suitability behind no overlaid copy. Regenerate any failed asset with one targeted correction.

- [ ] **Step 6: Verify green and commit**

Run: `npm run test:recommendations`  
Expected: all asset and recommendation tests PASS.

```powershell
git add public/images/guides tests/recommendations.node.mjs
git commit -m "assets: add weekly guide banners"
```

---

### Task 6: Document the audit, verify, and prepare the release

**Files:**
- Create: `docs/seo-audit-2026-07-23.md`
- Create: `competitor-profiles/_summary.md`
- Modify: `docs/traffic-growth-checklist.md`
- Modify: `.superpowers/sdd/progress.md` (scratch ledger only; do not commit unless already tracked)

**Interfaces:**
- Produces the exact post-deploy indexing list and deferred external actions.

- [ ] **Step 1: Write the dated audit**

Include confirmed evidence, competitor comparison, fixes delivered, remaining actions, and measurements. Record the external Vercel-domain requirement: change `www` to a permanent 301/308 redirect. State that the existing sitemap should remain submitted and be refreshed, not removed.

- [ ] **Step 2: Write the competitor summary**

Summarize iPrice, ShopBack, Saleduck, PriceMe, ProductNation, Moneymax, and SulitScan using direct source URLs. Separate facts from inferences and record why the user-entered calculator was selected over live-price or coupon claims.

- [ ] **Step 3: Add exact indexing targets**

List the five new blog URLs, `/tools/checkout-comparison`, every new category/store page-2+ URL emitted by the sitemap, and the materially updated existing guides. Note that Google Search Console requests should prioritize the five guides and calculator; sitemap discovery handles the remaining pagination URLs.

- [ ] **Step 4: Run full automated verification**

Run: `npm audit --omit=dev`  
Expected: zero production vulnerabilities.

Run: `npm run check`  
Expected: lint, typecheck, node tests, link/compliance/product guards, and production build all PASS; build route count increases for five posts and one tool.

Run: `npm run test:e2e`  
Expected: all Playwright tests PASS against the production build.

- [ ] **Step 5: Validate rendered SEO and visual behavior**

Using a rendered browser, verify JSON-LD, canonical, robots, Open Graph, and Twitter metadata on a new guide, the calculator, a deal, category page 2, and store page 2. Inspect desktop and mobile screenshots for the homepage utility link, calculator, entity pagination, blog index, and five guide heroes. Confirm inactive demo/SHEIN URLs return 404.

- [ ] **Step 6: Commit documentation**

```powershell
git add docs/seo-audit-2026-07-23.md docs/traffic-growth-checklist.md competitor-profiles/_summary.md
git commit -m "docs: record July 23 SEO and competitor audit"
```

- [ ] **Step 7: Complete final review and release**

Generate a full branch review package from base `b980b1c`, dispatch an independent final reviewer, fix every Critical/Important finding, re-run affected tests and full verification, then fast-forward or cherry-pick the reviewed commits onto a freshly updated local `main`. Push `main`, verify `origin/main`, wait for deployment, and confirm live sitemap count, five guide 200s, calculator 200, pagination 200s, and demo/SHEIN 404s.

---

## Self-Review Record

- **Spec coverage:** Each design requirement maps to Tasks 1–6; public eligibility and crawl fixes precede growth additions.
- **Placeholder scan:** No deferred implementation placeholder remains; external `www` redirect is explicitly documented as a Vercel-domain action.
- **Type consistency:** `ENTITY_DEALS_PAGE_SIZE`, `resolveEntityDealListing`, `buildEntityPageHref`, `CheckoutOfferInput`, `calculateCheckoutOffer`, and `compareCheckoutOffers` are named consistently across producers and consumers.

