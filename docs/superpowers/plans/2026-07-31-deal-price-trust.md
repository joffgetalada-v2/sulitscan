# SulitScan Deal Price Trust Implementation Plan

> **For Codex:** Execute this plan with `superpowers:subagent-driven-development`, one implementation task and one independent review at a time. Follow strict RED/GREEN TDD and do not weaken tests to obtain a pass.

**Goal:** Preserve SulitScan's useful affiliate discovery paths while preventing stale affiliate datafeed prices, discounts, or savings claims from being presented as current, and automatically retire genuinely expired deal inventory from search and browsing.

**Architecture:** Add one dependency-free freshness policy module that parses the two existing `lastChecked` formats and returns `current`, `reference`, or `expired`. Make `getActiveDeals()` exclude only expired inventory, while direct detail routes remain accessible and receive `noindex, follow`. Cards, deal details, and ItemList descriptions use the same policy so visible copy and structured data cannot disagree. Daily ISR keeps date-dependent listings, metadata, and the sitemap from freezing at build time.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, Node test runner, Playwright, Tailwind CSS.

## Global constraints

- Do not scrape, guess, or rewrite prices, coupons, stock, shipping times, or offer terms.
- Do not change affiliate destinations or affiliate tracking behavior.
- Do not add Product or Offer structured data.
- Keep all June 2026 published inventory discoverable on 2026-07-31 as `reference`, but suppress discount/original-price/savings claims because it is no longer current.
- An exact date is `current` only from age 0 through 14 UTC calendar days. It is `reference` from 15 through 90 days and `expired` after 90 days.
- A month-only source period is never called current. It is `reference` from the first day of that month through 90 days after the month's final UTC day, and `expired` afterward. A future period or unparseable value is `expired`.
- Expired deals are removed from normal listings, recommendations, entity counts, and the sitemap, but a direct public deal URL remains reachable with `noindex, follow` and a live-store CTA.
- Reference deals show the recorded sale price clearly labeled `Reference price`; they do not show the original price, numeric discount, savings amount, or suspicious-discount badge/note.
- Expired detail pages show no stored price or discount number and say to check the live price.
- Price-dependent buyer reasons must be replaced with neutral category/store guidance in visible copy and ItemList JSON-LD whenever a deal is not current. Preserve genuinely qualitative reasons.
- Use `export const revalidate = 86400` on date-dependent home, deal-list, category, store, detail, and sitemap routes; Cache Components is not enabled in this project.
- Update `npm run check` so the new dedicated freshness suite can never be skipped.
- Keep `https://importtaxph.com/` only in its existing relevant cross-border contexts. Do not add ApplyReadyCV to unrelated shopping pages.
- Do not configure AdSense without the user's real publisher ID. Only correct documentation to match the already-built environment-variable and article-only serving controls.

### Task 1: Build and enforce the catalog freshness policy

**Files:**
- Create: `src/lib/deal-freshness.ts`
- Create: `tests/deal-freshness.node.mjs`
- Modify: `src/data/deals.ts`
- Modify: `tests/recommendations.node.mjs`
- Modify: `tests/seo-helpers.node.mjs`
- Modify: `tests/affiliate-compliance.node.mjs`
- Modify: `package.json`

1. Write failing unit tests that load the TypeScript helper and prove:
   - `Checked June 27, 2026` is current on July 11, reference on July 12, reference on September 25, and expired on September 26.
   - `Affiliate datafeed price, June 2026. Confirm...` is reference during June and through September 28, then expired on September 29.
   - leap-year February month-end parsing is correct.
   - future exact/month-only dates and malformed labels are expired.
   - date comparison uses UTC calendar days and accepts an injected `now` for deterministic tests.
   - price-sensitive reasons containing peso amounts, percentages, or price/discount/save/cost language are replaced for noncurrent deals, while qualitative reasons remain unchanged.
2. Run the new suite and capture the expected RED failure because the module does not exist.
3. Implement a dependency-free helper with exported constants, parser/status functions, `isDealExpired`, and a single neutral-reason function accepting the minimal deal fields it needs.
4. Make `getActiveDeals()` filter public inventory through `!isDealExpired(deal)` before sorting. Keep `getDealBySlug()` based on `isPublicDeal()` so expired direct URLs still resolve.
5. Update every Node test harness that transpiles `deals.ts` so it injects the freshness module dependency.
6. Add `test:deal-freshness` to `package.json` and include it in `npm run check` before other deal-dependent suites.
7. Run the new suite plus recommendation, SEO, and compliance suites; obtain GREEN.
8. Commit with message `feat: enforce affiliate deal freshness`.

### Task 2: Make price presentation, metadata, schema, and sitemap agree

**Files:**
- Modify: `src/components/DealCard.tsx`
- Modify: `src/app/deals/[slug]/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/deals/page.tsx`
- Modify: `src/app/categories/[slug]/page.tsx`
- Modify: `src/app/stores/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/seo-helpers.node.mjs`
- Modify: `tests/smoke.spec.ts`

1. Add failing static/unit assertions for daily revalidation, expired sitemap exclusion, and expired detail robots behavior. Add Playwright expectations against the current June fixtures proving:
   - a card says `Reference price` and still shows the recorded sale price;
   - no numeric discount, original-price strikethrough, or `Save` amount appears on that card;
   - detail pages use the same reference treatment and retain a working affiliate CTA;
   - price-dependent ItemList descriptions do not expose stale peso/discount claims.
2. Run the targeted tests and capture RED.
3. Use the freshness helper in `DealCard` and the deal detail page. Current deals retain the existing full price treatment; reference and expired states follow the global constraints. Give the freshness message accessible text and keep the report-outdated-price link.
4. In `generateMetadata`, set `robots: { index: freshness.status !== "expired", follow: true }`. Preserve canonical, Open Graph, and Twitter metadata.
5. Replace price-dependent `reason` values with the helper output in all four ItemList producers and the two visible deal presentations.
6. Add daily revalidation exports to all date-dependent routes. Filter deal sitemap entries with the same expiry policy (even though active deals are already filtered) so the intent is explicit and regression-tested.
7. Run the targeted Node and Playwright tests; obtain GREEN.
8. Commit with message `feat: label reference prices and retire expired deals`.

### Task 3: Correct trust copy and AdSense operations documentation

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `README.md`
- Modify: `tests/adsense.node.mjs`
- Modify: `tests/smoke.spec.ts`

1. Add failing assertions that the homepage no longer claims continuous monitoring, fixed discount ranges, or shipping estimates for every deal. Assert that the README names only the implemented AdSense controls.
2. Replace homepage language with verifiable affiliate-datafeed and buyer-review wording. Replace the `30–75% Discounts shown` metric with a useful catalog/reference-price message and a reminder to confirm the live store price.
3. Correct README instructions to use:
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` for verification and `/ads.txt` generation;
   - `NEXT_PUBLIC_ADSENSE_ADS_ENABLED=true` only after approval to enable the existing article-only loader;
   - the current automatic behavior, without a nonexistent `ADSENSE_PUBLISHER_ID`, `AdSensePlaceholder`, or manual layout script step.
4. Run the AdSense Node suite and targeted homepage/article Playwright tests; obtain GREEN.
5. Commit with message `docs: align deal and adsense trust guidance`.

### Task 4: Independent final review, release verification, and production validation

**Files:**
- Review every diff from the merge base through branch HEAD.
- Update this plan only if the implementation intentionally diverges and the reason is documented.

1. Run a fresh broad review for requirement coverage, price-claim leakage, date-boundary correctness, accessibility, SEO/indexation consistency, and unnecessary scope. Fix every Critical or Important finding with regression tests and re-review.
2. Run the full local release gate:
   - `npm run check`
   - `npx playwright test --workers=1`
   - `npm audit --omit=dev`
   - `git diff --check`
3. Confirm the branch is clean and commits contain only this release.
4. Fast-forward local `main` to the verified branch, remove the owned worktree/branch, and rerun merged-main smoke checks outside the nested worktree.
5. Push `main` to `origin`, poll the Vercel deployment to `Ready`, and validate live:
   - homepage reference-price trust copy;
   - one Temu/Shopee deal card and detail page reference treatment;
   - no stale discount/original-price/savings claim on the checked fixture;
   - canonical and index/follow on the current reference detail page;
   - sitemap still contains the reference deal;
   - `/ads.txt` accurately reports unconfigured status until a real publisher ID is supplied;
   - affiliate CTA resolves successfully without performing a purchase.
6. Report shipped commits, verification counts, deployment URL, remaining external blockers, and the exact next catalog-refresh/AdSense steps. Do not claim approval, commissions, or traffic growth without external evidence.
