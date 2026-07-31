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
