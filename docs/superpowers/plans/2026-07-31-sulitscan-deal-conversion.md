# SulitScan Deal Discovery and Attribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce deal-page image transfer and make affiliate clicks attributable to specific public offers.

**Architecture:** Keep the existing Next Image allow-list and affiliate wrapper. Change loading behavior at the deal-card call site and add optional, privacy-safe event dimensions at the shared outbound-link boundary.

**Tech Stack:** Next.js 16 Image, React 19, Vercel Analytics, Playwright.

## Global Constraints

- Track only public identifiers already present in rendered content.
- Never track destination URLs, query parameters, titles, or user data.
- Preserve sponsored/nofollow/noopener/noreferrer attributes and outbound navigation.
- Keep only one eager/high-priority listing candidate.

---

### Task 1: Optimized deal images

**Files:**
- Modify: `src/components/DealCard.tsx`
- Modify: `src/components/DealScannerVisual.tsx`
- Modify: `src/components/DealsGrid.tsx`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: optimized `/_next/image` delivery for remote deal assets.
- Produces: only listing position 1 with eager/high priority.

- [ ] **Step 1: Write a failing browser test**

Load `/deals`, inspect the first two rendered product images, and assert the first has an optimizer URL plus eager/high priority while the second is lazy and not high priority. Verify both image elements complete with non-zero natural width.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npx playwright test tests/smoke.spec.ts --grep "optimized deal images" --workers=1`

Expected: failure because deal-card images currently use raw CDN URLs and four cards are prioritized.

- [ ] **Step 3: Enable optimization and narrow priority**

Remove `unoptimized` from `DealCard` and `DealScannerVisual`. Change `imagePriority={index < 4}` to `imagePriority={index === 0}`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npx playwright test tests/smoke.spec.ts --grep "optimized deal images" --workers=1`

Expected: the optimizer/loading assertions pass.

### Task 2: Offer-level affiliate analytics

**Files:**
- Modify: `src/components/ExternalAffiliateLink.tsx`
- Modify: `src/components/DealCard.tsx`
- Modify: `src/components/DealsGrid.tsx`
- Modify: `src/components/PartnerBanners.tsx`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: optional `offerId?: string` and `position?: number` props.
- Produces: `affiliate_click` properties containing the defined public dimensions.

- [ ] **Step 1: Extend analytics tests and verify RED**

Require a deal-card event to contain the clicked deal slug and 1-based position. Require a partner-banner event to contain the public banner ID. Assert no `href`, URL, title, or email property is present.

Run: `npx playwright test tests/smoke.spec.ts --grep "affiliate_click" --workers=1`

Expected: identifier assertions fail because the wrapper does not yet accept them.

- [ ] **Step 2: Implement optional dimensions**

Add `offerId` and `position` props to `ExternalAffiliateLink`. Build the event properties from the existing platform/placement/source plus only defined optional values. Pass `deal.slug` and listing position from `DealCard`/`DealsGrid`, and `banner.id` from `PartnerBanners`.

- [ ] **Step 3: Run focused analytics tests and verify GREEN**

Run: `npx playwright test tests/smoke.spec.ts --grep "affiliate_click" --workers=1`

Expected: all affiliate-click tests pass and outbound links retain their compliance attributes.

### Task 3: Release verification and commit

**Files:**
- Verify all files changed in Tasks 1-2.

**Interfaces:**
- Consumes: optimized images and attribution dimensions.
- Produces: a verified main-branch release commit.

- [ ] **Step 1: Run the complete release gate**

Run: `npm run check`

Expected: all lint, type, content, compliance, and build checks pass.

- [ ] **Step 2: Run the full browser suite serially**

Run: `npx playwright test --workers=1`

Expected: all Playwright tests pass.

- [ ] **Step 3: Commit the deal-conversion subproject**

Run: `git add src/components/ExternalAffiliateLink.tsx src/components/DealCard.tsx src/components/DealScannerVisual.tsx src/components/DealsGrid.tsx src/components/PartnerBanners.tsx tests/smoke.spec.ts docs/superpowers/specs/2026-07-31-sulitscan-deal-conversion-design.md docs/superpowers/plans/2026-07-31-sulitscan-deal-conversion.md && git commit -m "perf: optimize deal discovery and attribution"`

---

### Task 4: Final Important findings — entity parity

**Files:**
- Modify: `src/components/EntityDeals.tsx`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: first-only eager/high loading on category and store entity grids.
- Produces: public deal slug plus 1-based entity-list position in `affiliate_click`.

- [x] **Step 1: Write category/store browser regressions**

For `/categories/under-1000` and `/stores/temu`, scope to the labeled entity deal section. Assert optimized first and second images, eager/high only on the first, successful nonzero image loads, and a second-card event containing the public offer slug with `position: 2` and no private fields.

- [x] **Step 2: Verify RED**

Run: `npx playwright test tests/smoke.spec.ts --grep "optimizes entity deal images|homepage scanner image" --workers=1`

Observed: both entity regressions failed on the legacy priority behavior before production changes.

- [x] **Step 3: Implement entity parity and verify GREEN**

Change `imagePriority` to `index === 0` and pass `position={index + 1}` from `EntityDeals`.

### Task 5: Final Important findings — server-rendered scanner

**Files:**
- Modify: `src/components/DealScannerVisual.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: a bounded responsive scanner source selection.
- Produces: scanner-specific optimized image/preload markup in the initial server HTML.

- [x] **Step 1: Write the homepage browser/server regression and verify RED**

Assert the optimized URL, exact `sizes`, successful image load, and a server HTML preload tied to the scanner image found after its unique `sulitscan.com/deals` browser-bar marker.

Observed: the server HTML had no scanner image while `Hero` used `dynamic(..., { ssr: false })`.

- [x] **Step 2: Implement bounded server rendering and verify GREEN**

Add `sizes="(max-width: 480px) calc(100vw - 2rem), 448px"` to the scanner image and replace the no-SSR dynamic import with a static import. Preserve `DealScannerVisual` as a Client Component so its animation and controls remain unchanged.

### Task 6: Final fix verification and commit

- [x] Run the focused deal browser tests serially.
- [x] Run `npm run lint` and `npm run typecheck`.
- [x] Self-review the complete final-fix diff against both Important findings.
- [x] Record strict RED/GREEN evidence in `.superpowers/sdd/2026-07-31-sulitscan-deal-conversion/final-fix-report.md`.
- [x] Commit the final fix, regression tests, design, plan, and report together.
