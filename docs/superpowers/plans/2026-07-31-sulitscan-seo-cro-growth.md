# SulitScan SEO, Discovery, and Monetization Growth Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Implement every production change with strict RED/GREEN test-driven development and obtain an independent task review before proceeding.

**Goal:** Improve organic crawl distribution and affiliate conversion while adding one useful seasonal-search destination without publishing unverified price, coupon, or campaign claims.

**Architecture:** Keep the current static, data-driven Next.js architecture. Add a deterministic related-deal selector, harden canonical pagination state, reduce repeated paginated content, use the existing affiliate-link wrapper for all monetized outbound paths, and add one indexable evergreen sale-calendar guide.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node test runner, Playwright, Vercel Analytics.

## Global Constraints

- Read `AGENTS.md` and the relevant installed Next.js 16 documentation before production changes.
- Follow strict TDD: write a focused failing test, run it and record the expected failure, then implement the minimum production change and rerun the same test.
- Preserve affiliate disclosure and `rel="sponsored nofollow noopener noreferrer"` on monetized outbound links.
- Track only public identifiers already rendered on the site; never send destination URLs, titles, query parameters, form values, or personal data to analytics.
- Do not publish coupon codes, exact discount promises, sale windows, prices, or merchant eligibility claims unless directly verified from a current primary source. The calendar may identify common planning dates and must tell readers to confirm each retailer's live terms.
- Do not add Product or Offer structured data while catalog prices and availability cannot be refreshed reliably.
- Keep the site statically renderable and include every new indexable route in the sitemap and visible internal navigation.
- Use only the approved existing affiliate destinations: Temu `https://temu.to/k/ge7hcjmmrb4`, Shopee `https://invl.me/clnkccq`, and Sephora `https://invl.me/clnkccv`.
- Change the inaccurate header promise `New deals added weekly` to the truthful `New shopping guides added weekly`.
- The final release must pass `npm run check`, the full serial Playwright suite, `npm audit --omit=dev`, and a clean `git diff --check` before promotion and push to `main`.

---

### Task 1: Relevant deal discovery and affiliate path repair

**Files:**
- Modify: `src/data/deals.ts`
- Modify: `src/data/stores.ts`
- Modify: `src/components/Header.tsx`
- Modify: `src/app/deals/[slug]/page.tsx`
- Modify: `tests/recommendations.node.mjs`
- Modify: `tests/affiliate-compliance.node.mjs`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `getRelatedDealsForDeal(current, count)` returning unique public deals that prefer shared category, then shared platform and tags, with deterministic quality tie-breakers and no current-deal result.
- Produces: clickable store and category chips on deal detail pages.
- Produces: approved tracked store-level affiliate destinations for Temu, Shopee PH, and Sephora PH.
- Produces: product `offerId` on the deal-detail primary affiliate event.

- [ ] **Step 1: Write focused failing tests**

Add Node tests for deterministic, relevant, unique related deals and approved store affiliate destinations. Add browser assertions for clickable store/category paths and the deal-detail primary click event's public `offerId` with no private fields.

- [ ] **Step 2: Run focused tests and verify RED**

Run the touched Node suites and focused Playwright tests. Record failures caused by the missing helper, non-link chips, direct retailer URLs, and absent detail `offerId`.

- [ ] **Step 3: Implement the minimum production changes**

Replace the global-featured related products with the new helper, map platforms/categories to existing internal routes, replace plain store destinations with the approved affiliate destinations, pass the deal slug to detail-click analytics, and correct the weekly header promise.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the exact focused tests from Step 2 plus lint and typecheck.

- [ ] **Step 5: Commit and write the task report**

Commit only Task 1 files and record RED/GREEN evidence, self-review, and concerns in the assigned SDD report.

---

### Task 2: Canonical pagination and repeated-content cleanup

**Files:**
- Modify: `src/lib/deal-listing.ts`
- Modify: `src/app/deals/page.tsx`
- Modify: `src/app/categories/[slug]/page.tsx`
- Modify: `src/app/stores/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/seo-helpers.node.mjs`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `isCanonical` for the normalized all-deals listing request.
- Produces: noindex/follow metadata for malformed or out-of-range `/deals` pages.
- Produces: indexable self-canonical `/deals?page=2..N` sitemap entries.
- Produces: page-one-only FAQ schema, Top Picks, intros, and supporting FAQ content on entity listings.
- Produces: concise page-number-specific descriptions for page 2+ entity metadata.

- [ ] **Step 1: Write focused failing tests**

Cover valid page 2, malformed page values, extra page values, and out-of-range requests. Add browser/server assertions for `/deals?page=99` noindex, valid paginated sitemap entries, and the absence of page-one-only content/schema on category/store page 2.

- [ ] **Step 2: Run focused tests and verify RED**

Record the current incorrect indexability, missing sitemap URLs, and repeated supporting content.

- [ ] **Step 3: Implement the minimum production changes**

Expose canonical validity, use it in metadata, generate deal-pagination sitemap entries, and guard page-one-only supporting sections/schema. Preserve the deal grids and pagination navigation on every valid page.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the exact focused tests from Step 2 plus lint and typecheck.

- [ ] **Step 5: Commit and write the task report**

Commit only Task 2 files and record evidence, self-review, and concerns.

---

### Task 3: Evergreen Philippine shopping sale calendar

**Files:**
- Add: `src/app/sales-calendar/page.tsx`
- Add: `public/images/guides/shopping-sale-calendar-philippines.webp`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: indexable canonical `/sales-calendar` with static metadata, social image, Breadcrumb and FAQ structured data.
- Produces: a buyer-first planning guide for double-day sales, payday periods, seasonal buying, a final-price checklist, current on-site deals, and the checkout comparison tool.
- Produces: monetized store CTAs only through `ExternalAffiliateLink` and the approved existing destinations.

- [ ] **Step 1: Write focused failing browser tests**

Assert canonical/social metadata, one H1, structured data, the original optimized banner, calendar disclosure language, internal links, compliant affiliate CTAs, and discoverability from navigation/homepage/sitemap.

- [ ] **Step 2: Run the focused tests and verify RED**

Record the expected 404/missing-route failure.

- [ ] **Step 3: Implement the static guide**

Use the provided 1600x900 WebP banner. Explain common date patterns without claiming a retailer participates. Include `Last reviewed: July 31, 2026`, clear live-terms warnings, practical planning/checklists, links to `/deals`, `/stores`, `/blog`, and `/tools/checkout-comparison`, plus tracked approved partner CTAs.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the exact browser test from Step 1 plus link/content guards, lint, and typecheck.

- [ ] **Step 5: Commit and write the task report**

Commit only Task 3 files and record evidence, self-review, image source path/prompt, and concerns.

---

### Task 4: Release verification and promotion

- [ ] Run `npm run check` and record the full successful result.
- [ ] Run `npx playwright test --workers=1` and record the final passed-test count.
- [ ] Run `npm audit --omit=dev` and `git diff --check`.
- [ ] Perform a broad independent final diff review and resolve all Critical/Important findings through the SDD fix loop.
- [ ] Promote the verified commits to local `main`, push `main`, and verify production canonical, sitemap, sale-calendar, and affiliate-path markers after deployment.
