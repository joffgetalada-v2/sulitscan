# SulitScan AdSense Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make SulitScan technically and editorially ready for an AdSense review while adding five original buyer guides and preserving affiliate trust.

**Architecture:** A small pure AdSense configuration helper controls a root verification meta tag, blog-article-only ad script, and dynamic ads.txt record from one publisher ID. Existing data-driven article and sitemap systems receive five evidence-led entries, while shared trust UI and policy pages explain authorship, advertising, cookies, and correction practices.

**Tech Stack:** Next.js 16.2.11 App Router, React 19, TypeScript, Tailwind CSS, Node test runner, Playwright, Next Image, Google AdSense.

## Global Constraints

- Work on the user-approved `main` branch and push only after full verification.
- Read relevant Next.js 16 docs before changing layouts or third-party scripts.
- Never invent an AdSense publisher ID; `ca-pub-` must contain exactly 16 digits.
- Do not promote SHEIN, Lazada, or AliExpress.
- Use ImportTaxPH only for a genuine cross-border landed-cost decision; do not force ApplyReadyCV into unrelated shopping content.
- Do not claim hands-on testing unless it occurred.
- Keep ads off deal, category, store, tool, legal, and navigation-only routes.

---

### Task 1: AdSense configuration and route isolation

**Files:**
- Create: `src/lib/adsense.ts`
- Create: `src/components/AdSenseSiteVerification.tsx`
- Create: `src/components/AdSenseArticleScript.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/ads.txt/route.ts`
- Delete: `src/components/AdSensePlaceholder.tsx`
- Test: `tests/adsense.node.mjs`

**Interfaces:**
- Produces: `normalizeAdSenseClientId(value?: string): string | null`
- Produces: `toAdSensePublisherId(value?: string): string | null`
- Produces: `isAdSenseServingEnabled(value?: string): boolean`
- Consumes: `NEXT_PUBLIC_ADSENSE_CLIENT_ID` as the single publisher-ID source and `NEXT_PUBLIC_ADSENSE_ADS_ENABLED` as the separate serving flag

- [ ] Write tests proving valid `ca-pub-` and `pub-` IDs normalize, malformed/placeholder IDs are rejected, and only the literal value `true` enables serving.
- [ ] Run `node --test tests/adsense.node.mjs` and confirm failures because `src/lib/adsense.ts` does not exist.
- [ ] Implement the pure helper, verification meta component, article-only script, and ads.txt derivation.
- [ ] Run `node --test tests/adsense.node.mjs` and confirm all tests pass.
- [ ] Add source guards proving the root contains verification only and the executable script is referenced only from the article route.

### Task 2: Publisher trust and policy readiness

**Files:**
- Create: `src/components/ArticleTrustPanel.tsx`
- Create: `docs/adsense-readiness.md`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/privacy-policy/page.tsx`
- Modify: `src/app/cookie-policy/page.tsx`
- Modify: `src/app/editorial-policy/page.tsx`
- Modify: `src/app/stores/page.tsx`
- Modify: `src/app/affiliate-disclosure/page.tsx`
- Modify: `src/components/Footer.tsx`
- Test: `tests/affiliate-compliance.node.mjs`
- Test: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: a visible “About this guide” panel with `/about`, `/editorial-policy`, and `/contact` links.
- Produces: policy copy containing Google AdSense, advertising cookies, web beacons, IP address, Ad Settings, certified CMP, ad labeling, and content-to-ad limits.

- [ ] Add failing compliance tests for Google disclosures, article trust links, AdSense placement rules, and absence of public unfinished partner copy.
- [ ] Run `npm run test:compliance` and confirm the new assertions fail.
- [ ] Implement the trust panel, policy copy, active-partner-only UI, and deployment checklist.
- [ ] Run `npm run test:compliance` and confirm all tests pass.

### Task 3: Five evidence-led buyer guides

**Files:**
- Modify: `src/data/posts.ts`
- Modify: `tests/recommendations.node.mjs`
- Modify: `scripts/check-links.mjs`

**Interfaces:**
- Produces: post IDs `post-030` through `post-034` with slugs and metadata from the design document.
- Produces: distinct recommendation topics and only editorially eligible related deals.

- [ ] Add failing registry tests for exact IDs, slugs, titles, date `2026-07-28`, unique excerpts, minimum structure, source links, FAQs, cross-link rules, and contextual sister-site restrictions.
- [ ] Run `npm run test:recommendations` and confirm failures because the five posts do not exist.
- [ ] Write the five articles in `src/data/posts.ts`, each with at least five H2 sections, assessment method, checklist, FAQs, internal links, and disclosure.
- [ ] Update the required-growth-post link guard and run `npm run test:recommendations` plus `npm run check:links`.

### Task 4: Five original article banners

**Files:**
- Create: `public/images/guides/online-product-review-checklist-philippines.jpg`
- Create: `public/images/guides/refurbished-vs-used-vs-open-box-philippines.jpg`
- Create: `public/images/guides/online-furniture-measurement-guide-philippines.jpg`
- Create: `public/images/guides/online-purchase-warranty-guide-philippines.jpg`
- Create: `public/images/guides/energy-efficient-appliance-buying-guide-philippines.jpg`
- Modify: `public/images/guides/README.md`
- Test: `tests/recommendations.node.mjs`

**Interfaces:**
- Produces: five unique 1600x900 JPEGs without text, logos, watermarks, or unsafe crop dependencies.

- [ ] Extend the image test to require each exact path, 1600x900 JPEG dimensions, and five unique SHA-256 hashes.
- [ ] Run the image test and confirm failure because assets are missing.
- [ ] Generate each banner in a separate image-generation call, inspect it, convert/crop to 1600x900 JPEG if required, and save to its exact public path.
- [ ] Run the image test and `npm run check:links` until both pass.

### Task 5: Browser, policy, and release verification

**Files:**
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Verifies: new routes, visible banners, trust panel, FAQ schema, canonicals, related content, sitemap membership, no mobile overflow, and no AdSense code on non-article routes.

- [ ] Add Playwright cases for the five guides and AdSense isolation.
- [ ] Run targeted Playwright tests and confirm the new guide assertions pass after implementation.
- [ ] Run `npm run check`, `npm run test:e2e`, `npm audit --omit=dev`, and `git diff --check`.
- [ ] Review the complete diff against the design success criteria and fix any gap.
- [ ] Commit, push `main`, wait for production, then verify live status codes, sitemap totals, `/ads.txt`, new guides, and permanent-policy caveats.
