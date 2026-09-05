# SulitScan September Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship five source-backed buyer guides with original banners, an automatic 9.9 discovery spotlight, and defensive expired-deal schema handling.

**Architecture:** Preserve the existing data-driven blog and deal architecture. Add two small pure policy helpers—one for structured-data eligibility and one for date-bounded promotion—then wire them into the existing page components. Add the five posts to the established registry and enforce the complete release contract in Node tests.

**Tech Stack:** Next.js 16.2.11 App Router, React 19, TypeScript, Node test runner, Playwright, Sharp-generated JPEG derivatives.

**Spec:** `docs/superpowers/specs/2026-09-05-sulitscan-september-growth-design.md`

## Global Constraints

- Do not advance any deal `lastChecked` value without a real live verification.
- Do not change affiliate URLs, advertiser relationships, AdSense state, publisher IDs, or business-registration claims.
- Keep the existing thin-content index gate: only deals with unique editorial descriptions may enter the sitemap/index.
- All platform, regulatory, health, and technical policy statements need a current primary source and a clear limitation.
- Do not claim hands-on product testing, fixed live prices, guaranteed performance, authenticity, fit, safety, or refunds.
- The five covers must be distinct 1600×900 progressive JPEGs with no text, logo, trademark, price, or watermark.
- Do not add ImportTaxPH or ApplyReadyCV to these five posts; neither is contextual to the selected decisions.
- Use test-first development for behavior and registry changes; generated assets may exist unreferenced before the registry test is written.
- Read the relevant Next.js 16 guides in `node_modules/next/dist/docs/` before editing App Router code.

---

### Task 1: Deal schema safety and repository hygiene

**Files:**
- Modify: `tests/seo-helpers.node.mjs`
- Modify: `src/lib/deal-seo.ts`
- Modify: `src/app/deals/[slug]/page.tsx`
- Modify: `eslint.config.mjs`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `DealFreshness` from `src/lib/deal-freshness.ts`.
- Produces: `shouldIncludeDealProductSchema(freshness: DealFreshness): boolean`.

- [ ] **Step 1: Write the failing schema-policy test**

Add a test that loads `src/lib/deal-seo.ts`, requires `shouldIncludeDealProductSchema`, and asserts `true` for `{ status: "current" }`, `true` for `{ status: "reference" }`, and `false` for `{ status: "expired" }`. Add a source-wiring assertion that the deal route conditionally renders `ProductJsonLd` through that helper.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:seo`

Expected: FAIL because `shouldIncludeDealProductSchema` is not exported or used.

- [ ] **Step 3: Implement the minimal policy and route guard**

Export the pure helper from `src/lib/deal-seo.ts`. In the deal page, keep breadcrumbs for every direct page but wrap `ProductJsonLd` so it renders only when the helper returns true. Do not change CTA, indexing, or freshness copy.

- [ ] **Step 4: Make tooling ignore linked worktrees and patch the audited transitive dependency**

Add `.worktrees/**` to ESLint's `globalIgnores`. Update only the lockfile resolution needed to install `browserslist` later than `4.28.6`; do not add a direct runtime dependency.

- [ ] **Step 5: Verify GREEN and repository health**

Run: `npm run test:seo && npm run lint && npm run typecheck && npm audit --audit-level=high`

Expected: all commands exit 0; audit reports zero high/critical findings.

- [ ] **Step 6: Commit**

```bash
git add tests/seo-helpers.node.mjs src/lib/deal-seo.ts 'src/app/deals/[slug]/page.tsx' eslint.config.mjs package-lock.json
git commit -m "fix: suppress stale deal offer schema"
```

### Task 2: Automatic 9.9 discovery spotlight

**Files:**
- Create: `src/lib/seasonal-promotion.ts`
- Create: `tests/seasonal-promotion.node.mjs`
- Modify: `src/app/page.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: `SeasonalPromotion` with `slug`, `href`, and `announcement`.
- Produces: `getSeasonalPromotion(now?: Date): SeasonalPromotion | undefined`.
- Produces: `getPromotedPosts<T extends { slug: string }>(orderedPosts: T[], now?: Date, count?: number): T[]`.

- [ ] **Step 1: Write exact failing boundary and ordering tests**

Test the instant before the campaign, the inclusive start, an in-window date, the inclusive end, and the instant after the campaign. Assert the exact href `/blog/shopee-9-9-sale-philippines-2026-checklist`, exact announcement `9.9 checkout checklist: compare the final total →`, de-duplication, promoted-first ordering, normal ordering outside the window, and count clamping from zero through the available list.

- [ ] **Step 2: Add the test command and verify RED**

Add `test:seasonal-promotion` to `package.json` and include it in `check` after `test:seo`.

Run: `npm run test:seasonal-promotion`

Expected: FAIL because `src/lib/seasonal-promotion.ts` does not exist.

- [ ] **Step 3: Implement the pure helper**

Use UTC millisecond comparisons against `2026-08-31T16:00:00.000Z` and `2026-09-10T15:59:59.999Z`. Return immutable campaign copy. Normalize `count` to a finite nonnegative integer and never duplicate the promoted slug.

- [ ] **Step 4: Wire the homepage and hydration-safe header**

The homepage passes all posts in existing newest-first order through `getPromotedPosts(..., new Date(), 3)`. The client header initially renders the generic weekly announcement; in its existing mount effect, calculate `getSeasonalPromotion()` and update the link/copy. Preserve navigation, scroll behavior, and accessibility.

- [ ] **Step 5: Verify GREEN**

Run: `npm run test:seasonal-promotion && npm run lint && npm run typecheck`

Expected: all commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seasonal-promotion.ts tests/seasonal-promotion.node.mjs src/app/page.tsx src/components/Header.tsx package.json
git commit -m "feat: spotlight the live 9.9 buyer guide"
```

### Task 3: Five September buyer guides and banners

**Files:**
- Modify: `tests/recommendations.node.mjs`
- Modify: `src/data/posts.ts`
- Add: `public/images/guides/shopee-mall-vs-preferred-seller-philippines.jpg`
- Add: `public/images/guides/portable-fan-buying-guide-philippines.jpg`
- Add: `public/images/guides/insulated-tumbler-buying-guide-philippines.jpg`
- Add: `public/images/guides/wireless-earbuds-buying-guide-philippines.jpg`
- Add: `public/images/guides/online-foundation-shade-match-philippines.jpg`
- Modify: `public/images/guides/README.md`
- Modify: `content-calendar.md`
- Create: `docs/seo-audit-2026-09-05.md`

**Interfaces:**
- Consumes: existing `BlogPost`, recommendation intent, Markdown renderer, related-post logic, and cover-image conventions.
- Produces: ordered `post-055` through `post-059` with exact slugs from the spec.

- [ ] **Step 1: Write the failing September release contract**

Add one registry case per post with exact id, slug, title, category, dates, read time, tags, cover path, alt text, source URLs, required internal links, recommendation topics/platforms/deal filters, three FAQs, and the recorded SHA-256. Assert the last five posts match the order, every body contains the required assessment/limitations/disclosure H2s plus at least five other H2s, bodies are substantial and distinct, external sister-site hosts are absent, and all five covers are unique 1600×900 JPEGs.

- [ ] **Step 2: Run the focused suite and verify RED**

Run: `npm run test:recommendations`

Expected: FAIL because none of the five registry entries exists.

- [ ] **Step 3: Add the five fully authored posts**

Use the exact topics, source set, cautions, section coverage, dates, and link rules in the spec. Give each a direct opening answer, decision workflow, checklist, limitations, affiliate disclosure, and three FAQs. Match recommendations to current catalog tags without implying a currently listed product that does not exist.

- [ ] **Step 4: Finalize and document the five covers**

Keep the five generated covers at the exact paths above. Verify 1600×900 progressive JPEG output, visually inspect every final, and record generation method, dimensions, alt text, and SHA-256 in the README.

- [ ] **Step 5: Update planning and audit documentation**

Append the five published articles to `content-calendar.md`. In `docs/seo-audit-2026-09-05.md`, record the audit evidence, intentional 40-deal index gate, freshness deadlines, competitor gap, security/tooling fixes, release contents, no-account limitations, and prioritized manual actions. State that the existing sitemap URL should be resubmitted only if a console requests it; it updates automatically, so the old sitemap should not be removed.

- [ ] **Step 6: Verify GREEN and content integrity**

Run: `npm run test:recommendations && npm run test:seo && npm run check:links && npm run check:affiliate-products && npm run check:product-quality`

Expected: all commands exit 0; counts increase from 54 to 59 posts.

- [ ] **Step 7: Commit**

```bash
git add tests/recommendations.node.mjs src/data/posts.ts public/images/guides public/images/guides/README.md content-calendar.md docs/seo-audit-2026-09-05.md
git commit -m "feat: publish September buyer guide cluster"
```

### Task 4: Release verification

**Files:**
- Modify only if a verification failure reveals a task-scoped defect; route any fix through the subagent review loop.

**Interfaces:**
- Consumes: completed Tasks 1-3.
- Produces: fresh release evidence and a reviewed branch ready for fast-forwarding to `main`.

- [ ] **Step 1: Run full static and build verification**

Run: `npm audit --audit-level=high && npm run check`

Expected: both commands exit 0; build contains 59 blog paths and the expanded sitemap.

- [ ] **Step 2: Run serial browser verification**

Run: `npx playwright test --workers=1`

Expected: all tests pass with zero failures.

- [ ] **Step 3: Inspect final assets and metadata**

Visually inspect all five covers. Run a local production server if needed and confirm each new page has one H1, self-canonical metadata, cover image, BlogPosting JSON-LD, FAQ JSON-LD, internal links, and affiliate disclosure. Confirm the 9.9 article is first in the homepage guide grid during the campaign fixture and that the normal recent order returns after the campaign boundary.

- [ ] **Step 4: Request task and whole-branch reviews**

Generate review packages using the Subagent-Driven Development scripts. Resolve every Critical/Important finding through the prescribed fix-and-re-review loop. Finish only when both spec compliance and quality are approved.
