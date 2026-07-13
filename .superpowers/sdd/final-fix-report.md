# SulitScan Final Review Fix Report

Date: 2026-07-13
Base commit: `2bb0d928e3b5034f44f76b58c5f38565bc65e192`
Scope: all Important findings and both Minor findings in `final-review-findings.md`
Push: intentionally not performed

## Outcome

- Replaced SEO-tag and title-regex recommendation inference with explicit per-post editorial metadata.
- Required a topic match for related guides before platform/category tie-breakers can contribute.
- Required explicit deal tag, category, platform, and price eligibility before a deal can be scored.
- Restored Shopee-named related guides on the canonical Shopee seller article.
- Removed unrelated home products from the work-from-home desk guide recommendations.
- Replaced ImportTaxPH callout regex inference with `importTaxContext?: "temu" | "general"`.
- Kept ImportTaxPH absent from the gift and beauty guides; assigned it explicitly only to useful Temu/cross-border contexts.
- Migrated homepage/store partner banners and store-index affiliate links to `ExternalAffiliateLink` with stable placements.
- Migrated the dormant shared `StoreCard` sponsored path as well, allowing the static guard to reject every raw sponsored anchor in `src`.
- Defined the Playwright local port once and derived its URL and server command.
- Added `npm run test:recommendations` to the standard `npm run check` chain.
- Updated the stale `/blog` smoke-title fixture to match the existing production metadata discovered by the full production test run.

## RED evidence

### Final-catalog recommendation tests

Command:

```powershell
npm run test:recommendations
```

Result before implementation: exit 1; 5 passed, 4 failed.

- Home organization did not include the required Shopee home guide.
- Gift guide did not include the checkout/shipping checklist.
- Desk guide still returned the unrelated gift guide.
- Canonical Shopee guide returned no Shopee-named guides.
- Beauty already happened to satisfy the new relevance assertions and passed in the RED run.

### Route and event tests

Command:

```powershell
npx playwright test -g "homepage partner banner|store-index affiliate|gift and beauty guides omit"
```

Result before implementation: exit 1; 0 passed, 3 failed.

- Homepage partner banner emitted no `affiliate_click` event.
- Store-index affiliate link emitted no `affiliate_click` event.
- Gift guide rendered the regex-inferred ImportTaxPH callout.

### Static integration guard

Command:

```powershell
npm run check:links
```

Result after adding guards but before production migration: exit 1 with 12 expected findings:

- Three raw sponsored anchors.
- Missing shared wrappers and stable placements in `PartnerBanners`, `StoreCard`, and the store index.
- Duplicated Playwright port configuration.
- Missing recommendation suite in the standard check chain.

## GREEN evidence

### Focused recommendation suite

Command:

```powershell
npm run test:recommendations
```

Final focused result: exit 0; 9 passed, 0 failed. It exercises the real final arrays for:

- `best-home-organization-finds-under-500-philippines`
- `best-gifts-under-500-philippines`
- `best-work-from-home-desk-accessories-under-1000-philippines`
- `best-beauty-finds-under-500-philippines`
- `how-to-check-shopee-seller-legit-philippines`

The assertions require expected related guides, reject named unrelated guides, constrain returned deal categories, require topic-specific deal tags, and keep the Shopee seller guide on Shopee PH deals.

### Focused route/event suite

Command:

```powershell
npx playwright test -g "homepage partner banner|store-index affiliate|gift and beauty guides omit"
```

Final focused result: exit 0; 3 passed, 0 failed.

The event assertions compare the complete private payload:

- Homepage banner: `{ platform: "Shopee", placement: "partner-banner", source: "home" }`
- Store index: `{ platform: "Temu", placement: "store-index", source: "stores" }`

### Direct static checks

```powershell
npm run typecheck
npm run lint
npm run check:links
```

Results: all exit 0. `check:links` reported 217 deals, 9 categories, 3 stores, and 19 posts with valid links and affiliate attributes.

### Full standard gate on the final source tree

Command:

```powershell
npm run check
```

Final result: exit 0 in 20.4 seconds.

- ESLint passed.
- TypeScript passed.
- Recommendation tests passed 9/9 from inside the standard chain.
- Link/static integration guard passed.
- Affiliate product guard passed for 217 deals, 169 published.
- Product quality guard passed; it retained five informational pre-existing catalog notes.
- Next.js 16.2.7 production build passed and generated 219 static pages.

### Full Chromium suite against the production build

Command pattern:

```powershell
$server = Start-Process node.exe node_modules/next/dist/bin/next,start,-p,3200 -WindowStyle Hidden -PassThru
$env:BASE_URL = "http://localhost:3200"
npx playwright test
```

First run: 31 passed, 1 failed because `/blog` expected the stale title fragment `Blog` while the existing metadata is `Smart Shopping Guides Philippines | SulitScan PH`.

After correcting only that fixture, the final run passed 32/32 with exit 0 in 7.2 seconds.

### Repository hygiene

```powershell
git diff --check
```

Result: exit 0. `test-results` and `playwright-report` were removed after verification. No new test dependency was added.

## Design decisions

### Explicit editorial intent

`BlogPost.recommendationIntent` now contains editorial topics, platform relationships, and optional deal eligibility. SEO tags remain for search/display metadata and no longer authorize recommendations. Related-post platform/category signals can only refine a real shared-topic match.

Deal candidates must match at least one editorial deal tag plus every configured category, platform, and maximum-price constraint. This prevents a cheap Shopee/Temu item from qualifying only because it is under the article budget or comes from a named marketplace.

### Explicit ImportTaxPH context

`BlogPost.importTaxContext` is the sole article-callout switch. `"temu"` selects the Temu calculator; `"general"` selects the homepage estimator. Inline ImportTaxPH links use the same metadata to choose the Temu-specific destination. Gift and beauty intentionally omit the field.

### Centralized sponsored links

`PartnerBanners`, the store index, and `StoreCard` now render through `ExternalAffiliateLink`. The wrapper still owns `target="_blank"`, `rel="sponsored nofollow noopener noreferrer"`, non-blocking analytics, and the privacy-limited payload. Static analysis rejects any raw sponsored `<a>` outside the wrapper and requires stable placements for the shared call sites.

## Files changed

- `package.json`
- `playwright.config.ts`
- `scripts/check-links.mjs`
- `src/app/blog/[slug]/page.tsx`
- `src/app/stores/page.tsx`
- `src/components/PartnerBanners.tsx`
- `src/components/StoreCard.tsx`
- `src/data/posts.ts`
- `src/lib/blog-recommendations.ts`
- `tests/recommendations.node.mjs`
- `tests/smoke.spec.ts`
- `.superpowers/sdd/final-fix-report.md`

## Self-review

- Security: affiliate rel attributes remain centralized and unchanged; raw sponsored anchors are now rejected.
- Privacy: new event tests require only `platform`, `placement`, and `source`; no URL, title, query, or personal data is emitted.
- Navigation resilience: `ExternalAffiliateLink` behavior is unchanged and existing analytics-failure navigation tests pass.
- Editorial safety: article prose, cautious claims, disclosures, FAQ/schema, metadata, and sitemap behavior were not changed.
- Commercial scope: deal catalog and partner data were not changed; the three catalog partners remain Shopee PH, Temu, and Sephora PH.
- Test scope: real catalog data is loaded without mocks and no dependency was added.
- Git scope: all changes are focused on the findings and full-suite stale fixture; no push was performed.

## Concerns and maintenance notes

- Recommendation quality now intentionally depends on editors adding `recommendationIntent` to new posts. A post without this metadata receives no recommendations rather than unsafe generic fallbacks.
- The first focused GREEN parallel browser rerun briefly missed the homepage event while a development server from the RED/GREEN cycle was being reused; an isolated rerun passed 1/1 and a fresh parallel rerun passed 3/3. The final production-build suite then passed the event test as part of 32/32.
- The product-quality guard still reports five informational catalog notes (three long titles and two demoted high-discount items). They are pre-existing and non-blocking.
- No external deployment, Search Console action, or push was authorized or performed.
