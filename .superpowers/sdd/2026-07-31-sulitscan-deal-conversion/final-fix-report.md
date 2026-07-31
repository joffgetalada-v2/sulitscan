# SulitScan Deal Conversion Final Fix Report

**Date:** 2026-07-31
**Status:** Complete and committed with the final fix wave.

## Scope completed

- `EntityDeals` now marks only its first card eager/high and passes each deal's public slug with a 1-based position through the existing `DealCard` analytics boundary.
- `DealScannerVisual` now declares the exact bounded responsive size `(max-width: 480px) calc(100vw - 2rem), 448px`.
- `Hero` now statically imports the scanner, allowing the initial optimized image and its responsive preload to appear in server HTML while retaining the scanner Client Component, Framer Motion transitions, interval, and slide controls.
- Category, store, and homepage browser regressions cover the reported Important findings without adding the deferred callsite-specific `DealCard` sizes work.

## Strict RED evidence

Command:

```text
npx playwright test tests/smoke.spec.ts --grep "optimizes entity deal images|homepage scanner image" --workers=1
```

Result before production edits: **3 failed**.

- `/categories/under-1000`: entity first image rendered `loading="lazy"` instead of eager/high.
- `/stores/temu`: entity second image rendered `loading="eager"` instead of lazy/not-high.
- Homepage scanner: scanner-specific server region contained no image because the component was rendered with `ssr: false`.

The first post-implementation run exposed two test-scoping issues: category Top Picks precede the entity listing, and the first raw `sulitscan.com/deals` match came from structured data. Test locators were narrowed to the labeled entity sections and the scanner browser-bar markup. No additional production change was needed for those corrections.

## GREEN and verification evidence

Targeted regression command:

```text
npx playwright test tests/smoke.spec.ts --grep "optimizes entity deal images|homepage scanner image" --workers=1
```

Result: **3 passed**.

Broader focused browser command:

```text
npx playwright test tests/smoke.spec.ts --grep "optimized deal images|optimizes entity deal images|homepage scanner image|affiliate_click" --workers=1
```

Result: **7 passed**. This includes the existing `/deals` image-loading contract and all focused affiliate-click coverage alongside the new entity and scanner regressions.

Static checks:

```text
npm run lint
npm run typecheck
git diff --check
```

Results: all exited **0** with no lint, TypeScript, or whitespace errors.

## Self-review

- Both category and store entity grids are covered through their labeled deal sections.
- The second entity card is clicked deliberately, proving the analytics position is 1-based (`2`) rather than merely defined.
- Event keys are restricted to `offerId`, `placement`, `platform`, `position`, and `source`; assertions exclude `href`, URL, query, title, and email fields.
- The server preload is matched to the optimized asset extracted from the scanner image after its unique browser-bar marker, so unrelated homepage images cannot satisfy the assertion.
- Production changes are limited to the two Important findings. No callsite-specific `DealCard` sizes expansion or unrelated refactor was included.

## Concerns

No remaining Important issue was found in this fix scope. The full `npm run check` and full Playwright suite were not requested for this final wave; focused browser coverage plus lint and typecheck were run instead.
