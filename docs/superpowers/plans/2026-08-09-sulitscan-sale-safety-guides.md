# SulitScan Sale-Season Safety Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish five original, source-backed Philippine shopping guides with five distinct inspected banners, reciprocal internal links, discovery coverage, and an exact post-deployment indexing checklist.

**Architecture:** Keep SulitScan's existing data-driven blog architecture. Add five `BlogPost` records and contextual links in `src/data/posts.ts`; the existing dynamic blog route, metadata builder, JSON-LD, related-content engine, and sitemap consume those records automatically. Extend the existing Node and Playwright contracts before implementation, then add five local JPEG assets and their provenance. Do not add a CMS, route, component, dependency, payment flow, or monetization feature.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, Node test runner, Playwright, OpenAI built-in image generation, JPEG assets under `public/images/guides`.

## Global Constraints

- Work only in `C:\Vercel\sulitscan\.worktrees\august-sale-safety-guides` on `codex/august-sale-safety-guides`.
- Follow test-driven development: add the focused test first, run it and record the expected failure, then change production content or assets, then rerun to green.
- Preserve all existing user changes and do not touch the separate `august-buyer-guides` worktree.
- Keep monetization, payments, AdSense configuration, affiliate destinations, partner inventory, and dependencies unchanged.
- Use the exact five IDs, slugs, dates, titles, recommendation intents, source URLs, internal links, cover paths, and cover alts in this plan.
- Each guide must contain at least 1,000 original words, at least seven meaningful `##` sections, an immediate direct answer, a dated assessment method, a numbered worked workflow, a numbered checklist, limitations, an affiliate disclosure, and three visible FAQs.
- Treat current platform screens, order records, official domains, and checkout as authoritative where the cited policy can change. Never promise a discount, voucher stack, threshold, scam recovery, refund, approval, or ranking.
- Do not force ApplyReadyCV into any guide. Link ImportTaxPH only from the Temu minimum-order guide as a contextual landed-cost estimate, explicitly not a customs threshold or official assessment.
- Every image must be a separate built-in image-generation call and use a photorealistic-natural, wide, crop-safe editorial composition. Reject readable text, letters, numbers, logos, trademarks, marketplace UI, barcodes, watermarks, real/scannable QR codes, government seals, certification marks, account numbers, or personal information.
- Before any completion claim, run the focused suites, full `npm.cmd run check`, focused serial Playwright coverage, `git diff --check`, and a final scoped diff review.

---

## Task 1: Add the five guide contracts, article content, and reciprocal links

**Files:**

- Modify: `tests/recommendations.node.mjs`
- Modify: `tests/smoke.spec.ts`
- Modify: `scripts/check-links.mjs`
- Modify: `src/data/posts.ts`

### Exact registry

| ID | Slug | Exact title | Category | Worked heading | Checklist heading |
|---|---|---|---|---|---|
| `post-040` | `shopee-9-9-sale-philippines-2026-checklist` | `Shopee 9.9 Sale Philippines 2026: Smart Checkout Checklist` | `Shopping Tips` | `## Worked 9.9 checkout decision` | `## 9.9 checkout checklist` |
| `post-041` | `fake-qr-code-payment-scams-philippines` | `Fake QR Code Payment Scams Philippines: Checks Before You Scan` | `Shopping Safety` | `## Worked suspicious-QR response` | `## QR payment safety checklist` |
| `post-042` | `dti-trustmark-bir-registration-seal-online-sellers` | `DTI Trustmark and BIR Registration Seal: Verify Online Sellers` | `Shopping Safety` | `## Worked seller-verification decision` | `## Seller verification checklist` |
| `post-043` | `fake-cod-parcel-scam-philippines` | `Fake COD Parcel Scam Philippines: What to Do Before Paying` | `Shopping Safety` | `## Worked COD doorstep decision` | `## COD parcel checklist` |
| `post-044` | `temu-minimum-order-philippines` | `Temu Minimum Order Philippines: Checkout Without Overspending` | `Shopping Tips` | `## Worked Temu cart decision` | `## Minimum-order checkout checklist` |

All five records use `publishedAt: "2026-08-09"` and `lastReviewed: "2026-08-09"`. Use distinct excerpts no longer than 160 characters, accurate `readTime` values, distinct relevant tags, and distinct existing `coverGradient` values. Do not add `coverImage` or `coverImageAlt` until Task 2.

Recommendation intents, in order:

```ts
{ topics: ["sale-planning", "checkout-checklist", "shopee-shopping"], platforms: ["Shopee PH"], deals: { tags: ["shopee"] } }
{ topics: ["qr-scam", "payment-safety", "shopping-safety"], platforms: ["Shopee PH"], deals: { tags: ["shopee"] } }
{ topics: ["seller-verification", "business-registration", "shopping-safety"], platforms: ["Shopee PH"], deals: { tags: ["shopee"] } }
{ topics: ["cod-scam", "parcel-safety", "shopping-safety"], platforms: ["Shopee PH"], deals: { tags: ["shopee"] } }
{ topics: ["temu-checkout", "minimum-order", "checkout-value"], platforms: ["Temu"], deals: { tags: ["temu"] } }
```

### Step 1: Write the failing Node registry and substance tests

- [ ] Add a `saleSafetyGuideCases` fixture immediately after `augustBuyerGuideCases` in `tests/recommendations.node.mjs` with the exact registry above plus `requiredSources`, `requiredLinks`, `topics`, `platforms`, `deals`, and `workedHeading`.
- [ ] Add a test named `sale-season safety guides use the exact ordered registry and substantive structure` which checks:
  - `posts.slice(-5)` equals the five slugs in order;
  - exact IDs, exact titles, categories, both dates, distinct titles/excerpts, excerpts at most 160 characters;
  - at least 1,000 whitespace-separated words and at least seven `##` headings;
  - the first non-empty paragraph before the first H2 contains a direct answer, not a generic introduction;
  - exact `## How we assessed this guide`, the case-specific worked heading with at least three numbered steps, a case-specific checklist with at least five numbered items, exact `## Limitations and live-policy check`, and exact `## Affiliate disclosure`;
  - at least three FAQs and exact recommendation intent;
  - every required source URL and internal link occurs in the content.
- [ ] Add a test named `sale-season safety guides preserve decision-critical cautions` with focused assertions:
  - 9.9 says the official campaign page currently shows September 1–10, makes the live sale page and checkout authoritative, does not guarantee voucher value/stacking/flash times, and does not recommend borrowing for an advertised installment offer.
  - QR guidance says visual inspection cannot prove legitimacy, Shopee payments stay on-platform, BSP says report first to the bank or e-money issuer, and recovery or reversal is not promised.
  - DTI/BIR guidance states that the DTI FAQ observed 2026-08-09 contains conflicting mandatory/voluntary answers, refuses to resolve that conflict by assumption, says badge absence alone is not proof of fraud, says verification is not product-quality endorsement, and uses the exact BIR domain `https://verify.bir.gov.ph/correspondence/`.
  - COD guidance distinguishes an unordered parcel from a real wrong/damaged order, keeps a household order log and recipient script, does not tell readers to open a prohibited parcel or blame the rider, and does not promise a refund.
  - Temu guidance states there is no reliable fixed PHP minimum, gives no unsupported reason for a threshold, does not use filler-item/cancel workarounds, does not promise support will waive it, and presents `buy nothing today` as valid. It describes ImportTaxPH as an estimate rather than a customs threshold or official assessment.
- [ ] Add a test named `established guides link into the sale-season safety cluster` for these exact pairs:

```js
[
  ["how-to-check-shopee-seller-legit-philippines", "dti-trustmark-bir-registration-seal-online-sellers"],
  ["online-shopping-safety-tips-philippines", "fake-qr-code-payment-scams-philippines"],
  ["online-shopping-safety-tips-philippines", "fake-cod-parcel-scam-philippines"],
  ["unboxing-video-evidence-online-shopping-philippines", "fake-cod-parcel-scam-philippines"],
  ["temu-shopping-guide-philippines", "temu-minimum-order-philippines"],
]
```

- [ ] Add a recommendation test proving each guide returns only active, non-suspicious deals matching its assigned tag and platform; allow an empty result only if the active catalog has no eligible deal.
- [ ] Add all five slugs to `REQUIRED_GROWTH_POSTS` in `scripts/check-links.mjs`, but not yet to `REQUIRED_GROWTH_POST_COVERS`.
- [ ] Run `npm.cmd run test:recommendations` and `npm.cmd run check:links`. Record that the new registry/caution/link tests fail because `post-040` through `post-044` and their reciprocal links do not exist. Do not weaken assertions to obtain red.

### Step 2: Write the failing route-level tests

- [ ] Add a `saleSafetyGuides` fixture in `tests/smoke.spec.ts` containing the five slugs and exact titles.
- [ ] Add a serial `sale-season safety guide routes` describe block. For each slug, visit the route with `waitUntil: "domcontentloaded"` at 390×844 and assert HTTP 200, a document title containing `SulitScan PH` and no more than 65 characters, exact self-canonical, visible H1 with the guide title, visible `About this guide`, `Editorial process`, `Request a correction`, at least three visible FAQ details matching FAQPage JSON-LD count, a visible first link inside the `More shopping guides` region, sitemap inclusion, and no horizontal overflow.
- [ ] Run only that describe block serially:

```powershell
npx.cmd playwright test tests/smoke.spec.ts --grep "sale-season safety guide routes" --workers=1
```

- [ ] Record the expected 404 or missing-H1 failure for the first missing guide. Do not edit production content before this red run.

### Step 3: Add five source-backed articles

- [ ] Append the five `BlogPost` records to `src/data/posts.ts` in exact ID/slug order.
- [ ] Write each article as original prose with a direct first-paragraph answer, at least 1,000 words, at least seven useful H2 sections, the exact assessment/worked/checklist/limitations/disclosure headings, and three distinct FAQs whose answers match the visible article.
- [ ] Use these source and link contracts:

**Shopee 9.9**

- Sources: `https://shopee.ph/m/9-9`
- Links: `/sales-calendar`, `/blog/how-to-stack-shopee-vouchers-philippines`, `/blog/how-to-spot-fake-discounts`, `/blog/why-final-prices-change-at-checkout`, `/tools/checkout-comparison`
- Scope: an event-specific checkout workflow that complements rather than duplicates the sale calendar.

**Fake QR payments**

- Sources: `https://help.shopee.ph/portal/4/article/142074-Safety-exercises-to-protect-yourself-against-each-type-of-scam`, `https://www.bsp.gov.ph/SitePages/FinancialStability/BSPVerifier.aspx`, `https://www.pna.gov.ph/articles/1280220`
- Links: `/blog/online-shopping-safety-tips-philippines`, `/blog/how-to-check-shopee-seller-legit-philippines`, `/blog/dti-trustmark-bir-registration-seal-online-sellers`, `/blog/fake-cod-parcel-scam-philippines`
- Scope: pre-scan checks, stop/report workflow, evidence preservation, and honest limits of visual inspection.

**DTI Trustmark and BIR Registration Seal**

- Sources: `https://trustmark.dti.gov.ph/faqs`, `https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2038-2026%20Digest.pdf`, `https://verify.bir.gov.ph/correspondence/`
- Links: `/blog/how-to-check-shopee-seller-legit-philippines`, `/blog/online-purchase-warranty-guide-philippines`, `/blog/online-product-review-checklist-philippines`, `/blog/fake-qr-code-payment-scams-philippines`
- Scope: disclose the DTI FAQ contradiction exactly as observed; verification is one signal, not a quality or fraud verdict.

**Fake COD parcel**

- Sources: `https://help.shopee.ph/portal/4/article/81483-What-to-do-when-receiving-an-order`, `https://www.ninjavan.co/en-ph/support/consignee-support/parcel-scams-advisory`
- Links: `/blog/unboxing-video-evidence-online-shopping-philippines`, `/blog/shopee-return-refund-guide-philippines`, `/blog/online-shopping-safety-tips-philippines`, `/blog/fake-qr-code-payment-scams-philippines`
- Scope: household log, calm recipient script, rider-safe refusal/escalation steps, and separate handling for a real but wrong/damaged order.

**Temu minimum order**

- Sources: `https://www.temu.com/ph/support/c2/buying-on-temu-f-44.html`
- Links: `/blog/temu-shopping-guide-philippines`, `/blog/why-final-prices-change-at-checkout`, `/tools/checkout-comparison`, `/blog/temu-returns-refunds-price-adjustment-philippines`, `/blog/philippine-import-tax-guide-online-shoppers`, `https://www.importtaxph.com/`
- Scope: needs-first cart comparison, no fixed threshold claim, no workaround, and a clearly limited cross-border landed-cost estimate.

### Step 4: Add contextual reciprocal links

- [ ] Add a compact, grammatical sentence to the existing Shopee seller-legitimacy guide linking to the DTI/BIR guide.
- [ ] Add two compact sentences to the general online-shopping-safety guide linking separately to the QR and COD guides.
- [ ] Add a contextual sentence to the unboxing-evidence guide linking to the COD guide.
- [ ] Add a contextual sentence to the Temu shopping guide linking to the minimum-order guide.
- [ ] In `src/app/sales-calendar/page.tsx`, extend the paragraph immediately below `Twelve double-day planning anchors` with a grammatical `Link` to `/blog/shopee-9-9-sale-philippines-2026-checklist`, describing it as the dated Shopee 9.9 checkout workflow. Preserve the paragraph's warning that the generic calendar does not promise retailer participation or discounts.
- [ ] Extend the reciprocal-link Node test with `readFileSync(resolve("src/app/sales-calendar/page.tsx"), "utf8")` and assert that source contains `href="/blog/shopee-9-9-sale-philippines-2026-checklist"`.

### Step 5: Verify Task 1 and commit

- [ ] Run:

```powershell
npm.cmd run test:recommendations
npm.cmd run check:links
npx.cmd playwright test tests/smoke.spec.ts --grep "sale-season safety guide routes" --workers=1
npm.cmd run lint
npm.cmd run typecheck
git diff --check
```

- [ ] Review every changed paragraph against its cited first-party source, search the five new records for `ApplyReadyCV`, unsupported amounts, guarantees, fixed Temu minimums, workaround instructions, and accidental brand claims, and correct any finding before commit.
- [ ] Commit only Task 1 files:

```powershell
git add src/data/posts.ts src/app/sales-calendar/page.tsx tests/recommendations.node.mjs tests/smoke.spec.ts scripts/check-links.mjs
git commit -m "feat: add sale-season shopping safety guides"
```

If `src/app/sales-calendar/page.tsx` is unchanged because the link is supplied elsewhere, omit it from `git add`.

---

## Task 2: Generate, inspect, normalize, and wire five guide banners

**Files:**

- Modify: `tests/recommendations.node.mjs`
- Modify: `tests/smoke.spec.ts`
- Modify: `scripts/check-links.mjs`
- Modify: `src/data/posts.ts`
- Modify: `public/images/guides/README.md`
- Create: `public/images/guides/shopee-9-9-sale-philippines-2026-checklist.jpg`
- Create: `public/images/guides/fake-qr-code-payment-scams-philippines.jpg`
- Create: `public/images/guides/dti-trustmark-bir-registration-seal-online-sellers.jpg`
- Create: `public/images/guides/fake-cod-parcel-scam-philippines.jpg`
- Create: `public/images/guides/temu-minimum-order-philippines.jpg`

### Step 1: Write the failing exact cover and browser tests

- [ ] Extend `saleSafetyGuideCases` with these exact paths and alts:

```js
{
  coverImage: "/images/guides/shopee-9-9-sale-philippines-2026-checklist.jpg",
  coverImageAlt: "Filipino shopper planning a sale checkout with a blank phone cart, calendar, calculator, and price checklist",
}
{
  coverImage: "/images/guides/fake-qr-code-payment-scams-philippines.jpg",
  coverImageAlt: "Shopper inspecting a non-scannable abstract QR pattern on a phone beside a shield and payment checklist",
}
{
  coverImage: "/images/guides/dti-trustmark-bir-registration-seal-online-sellers.jpg",
  coverImageAlt: "Magnifying glass checking abstract seller verification cards beside a laptop and official-domain checklist",
}
{
  coverImage: "/images/guides/fake-cod-parcel-scam-philippines.jpg",
  coverImageAlt: "Household member comparing an unopened COD parcel with a phone order list before payment",
}
{
  coverImage: "/images/guides/temu-minimum-order-philippines.jpg",
  coverImageAlt: "Shopper comparing an online cart minimum with a calculator and a short needs checklist",
}
```

- [ ] Add a Node test named `sale-season safety guides use five accepted distinct 1600x900 JPEG covers` that checks exact metadata, file existence, JPEG dimensions, one pinned accepted SHA-256 per case, and five unique paths/hashes. Add `coverImageSha256` only after each final visual acceptance so the test pins content to its slug rather than merely checking uniqueness.
- [ ] Extend `saleSafetyGuides` in `tests/smoke.spec.ts` with exact `coverAlt`. For each route, assert an exact-alt image is visible, its `src` contains the exact slug JPEG, `naturalWidth` becomes greater than zero, and a direct request to the exact asset returns 200.
- [ ] Add the five slugs to `REQUIRED_GROWTH_POST_COVERS` in `scripts/check-links.mjs`.
- [ ] Run `npm.cmd run test:recommendations`, `npm.cmd run check:links`, and the focused Playwright describe block. Record failures caused by absent metadata/assets/alts. Do not create temporary stand-in images or weaken exact-alt/hash checks.

### Step 2: Generate five separate original candidates

- [ ] Invoke the built-in image generator once per guide, never as one multi-image request. Include the shared photorealistic-natural, 16:9, wide crop-safe, editorial, no-readable-glyph/no-brand restrictions in every prompt.
- [ ] Use these scene-specific prompts:
  1. A Filipino adult at a bright home desk calmly planning a sale checkout; blank generic phone cart, unnumbered calendar tiles, fully blank calculator keypad/display, receipt-shaped blank checklist, restrained coral/blue accents, people-first consumer-advice mood.
  2. A Filipino shopper inspecting a deliberately abstract, broken-grid, non-scannable black-and-white pattern on a generic phone; protective shield cue and blank payment checklist; the pattern must not be a valid QR code and no payment brand may appear.
  3. A Filipino shopper using a magnifying glass over abstract blank seller-verification cards beside a laptop with a blank screen and an official-domain checklist represented only by lines; no DTI, BIR, Trustmark, government seal, QR, badge imitation, letters, or numbers.
  4. A household member at a doorway comparing one unopened generic COD parcel with a phone order list made only of blank rows; another family order log on a table; calm verification, no confrontation, no courier branding, no label/address details.
  5. A Filipino shopper comparing a generic online cart threshold with a fully blank calculator and a short needs checklist; some optional items set aside; calm stop-or-buy decision, no Temu branding, currency, prices, progress-bar numbers, or text.
- [ ] Record each generated output path and the complete prompt in the task report.

### Step 3: Inspect and accept or regenerate each candidate

- [ ] Open every candidate with `view_image` at original detail.
- [ ] Reject and regenerate any candidate containing readable or pseudo-readable glyphs, realistic QR geometry, logos, trademark colors/UI, barcodes, personal/address data, government/certification imitation, visible calculator symbols, implausible anatomy, distorted parcel/phone geometry, or a composition that fails a centered 16:9 crop.
- [ ] For the QR guide, explicitly verify the abstract pattern is broken/nonfunctional and does not resemble a scannable complete QR symbol.
- [ ] For the DTI/BIR guide, explicitly verify the cards are generic and cannot be mistaken for a government badge, seal, Registration Seal, or Trustmark.
- [ ] Report accepted and rejected candidate decisions; do not silently accept a flawed first result.

### Step 4: Normalize accepted assets and wire metadata

- [ ] Use a project-available image library or a reproducible local conversion command to center-crop/resize each accepted output to exactly 1600×900 and encode a progressive JPEG at quality 88. Mechanical format conversion is allowed; do not use a graphics script to synthesize or edit the creative content.
- [ ] Copy only the five accepted final JPEGs to the exact paths above.
- [ ] Inspect each final JPEG again with `view_image` at original detail after conversion.
- [ ] Compute `Get-FileHash -Algorithm SHA256` for every final JPEG, add each exact lowercase hash to its `saleSafetyGuideCases` fixture, and confirm all five hashes are distinct.
- [ ] Add exact `coverImage` and `coverImageAlt` fields to the matching `BlogPost` records.
- [ ] Add a dated `August sale-season safety banners generated 2026-08-09` table to `public/images/guides/README.md` with filename, concept, accepted built-in output filename, and final SHA-256. Document separate generation calls, visual inspection, rejected/replaced drafts, normalization settings, and the QR/DTI-specific safeguards.

### Step 5: Verify Task 2 and commit

- [ ] Run:

```powershell
npm.cmd run test:recommendations
npm.cmd run check:links
npx.cmd playwright test tests/smoke.spec.ts --grep "sale-season safety guide routes" --workers=1
npm.cmd run lint
npm.cmd run typecheck
git diff --check
```

- [ ] Review the five final JPEGs one last time, compare each visual to its slug/alt rather than relying only on a unique hash, and confirm no accepted file was permuted among paths.
- [ ] Commit only Task 2 files:

```powershell
git add src/data/posts.ts tests/recommendations.node.mjs tests/smoke.spec.ts scripts/check-links.mjs public/images/guides/README.md public/images/guides/shopee-9-9-sale-philippines-2026-checklist.jpg public/images/guides/fake-qr-code-payment-scams-philippines.jpg public/images/guides/dti-trustmark-bir-registration-seal-online-sellers.jpg public/images/guides/fake-cod-parcel-scam-philippines.jpg public/images/guides/temu-minimum-order-philippines.jpg
git commit -m "feat: add sale-season guide banners"
```

---

## Task 3: Record indexing order, publishing cadence, and measurement actions

**Files:**

- Modify: `docs/traffic-growth-checklist.md`

### Step 1: Add the exact August 9 release checklist

- [ ] Add an `August 9 release indexing order` section near the top, after the evergreen deployment checklist, with these exact URLs in order:

```text
https://sulitscan.com/blog/shopee-9-9-sale-philippines-2026-checklist
https://sulitscan.com/blog/fake-qr-code-payment-scams-philippines
https://sulitscan.com/blog/dti-trustmark-bir-registration-seal-online-sellers
https://sulitscan.com/blog/fake-cod-parcel-scam-philippines
https://sulitscan.com/blog/temu-minimum-order-philippines
```

- [ ] State that the user should keep the existing `https://sulitscan.com/sitemap.xml` submission and refresh/resubmit it after verified deployment; do not remove the old sitemap.
- [ ] Add a matching deployment-validation list: HTTP 200, self-canonical, indexable, present in the live sitemap, exact banner loaded, BlogPosting/FAQPage parity, internal links, and 390px overflow check.
- [ ] Do not claim a live sitemap count, deployment, indexing, impressions, clicks, or rankings before production verification.

### Step 2: Replace quantity-first weekly advice with a sustainable cadence

- [ ] Add a `Weekly content operating cadence` section prescribing:
  - two original source-backed guides;
  - one substantial refresh based on changed policy or real Search Console query mismatch;
  - one internal-linking/distribution session;
  - one measurement and quality-review session.
- [ ] Explain that this five-post launch is a cluster batch, not a commitment to five net-new posts every week. Prefer 16 new guides and eight substantial refreshes across the next eight weeks, subject to query evidence and source freshness.
- [ ] Preserve the existing 8–12 week measurement expectations and explicitly compare new, refreshed, and unchanged cohorts. Do not promise rankings or revenue.

### Step 3: Verify Task 3 and commit

- [ ] Run a deterministic URL-count check and document check:

```powershell
$doc = Get-Content docs/traffic-growth-checklist.md -Raw
$urls = @(
  'https://sulitscan.com/blog/shopee-9-9-sale-philippines-2026-checklist',
  'https://sulitscan.com/blog/fake-qr-code-payment-scams-philippines',
  'https://sulitscan.com/blog/dti-trustmark-bir-registration-seal-online-sellers',
  'https://sulitscan.com/blog/fake-cod-parcel-scam-philippines',
  'https://sulitscan.com/blog/temu-minimum-order-philippines'
)
foreach ($url in $urls) { if (($doc.Split($url).Count - 1) -ne 1) { throw "Expected exactly one indexing entry for $url" } }
if ($doc -notmatch 'two original.*guides' -or $doc -notmatch 'one substantial.*refresh') { throw 'Weekly cadence is incomplete' }
if ($doc -match 'remove the old sitemap') { throw 'Checklist must not recommend removing the sitemap' }
```

- [ ] Run `git diff --check`, inspect the rendered Markdown structure, and ensure every new claim is operational rather than presented as a measured result.
- [ ] Commit:

```powershell
git add docs/traffic-growth-checklist.md
git commit -m "docs: add August content release checklist"
```

---

## Task 4: Perform final release review, verification, and promotion to main

**Files:** Review all files changed since `210ac0c`; make only reviewer-approved corrections.

### Step 1: Run an independent final review

- [ ] Generate a review package from `210ac0c` to the current task head.
- [ ] Ask an independent reviewer to inspect factual fidelity, source meaning, originality, non-cannibalization, internal-link context, recommendation eligibility, banner compliance, accessibility, metadata/schema/sitemap behavior, mobile layout, and scope discipline.
- [ ] Treat Critical and Important findings as release blockers. Send confirmed findings to the responsible implementer, require a new focused red test for behavior/fact regressions, rerun focused and full verification, and create a fresh review package for re-review.

### Step 2: Run fresh release gates

- [ ] From the isolated worktree, run:

```powershell
npm.cmd run check
npx.cmd playwright test tests/smoke.spec.ts --grep "sale-season safety guide routes" --workers=1
git diff --check 210ac0c..HEAD
git status --short
```

- [ ] Confirm the standard check reports 44 posts and the build includes all five new static blog routes. Confirm the focused Playwright suite checks five routes, exact loaded local banners, FAQ schema parity, sitemap inclusion, and 390px layout.
- [ ] Inspect the final commit list and net diff. Ensure only approved content, tests, images, provenance, sales-calendar context, and traffic documentation changed; monetization remains untouched.

### Step 3: Fast-forward main and push

- [ ] Confirm `C:\Vercel\sulitscan` main checkout is clean. Fetch `origin`, fast-forward local `main` to `origin/main`, then merge the verified feature branch with `--ff-only`. If main advanced incompatibly, stop and rebase or reconcile in the isolated worktree, then rerun all release gates.
- [ ] Push the verified main branch:

```powershell
git -C C:\Vercel\sulitscan fetch origin
git -C C:\Vercel\sulitscan switch main
git -C C:\Vercel\sulitscan pull --ff-only origin main
git -C C:\Vercel\sulitscan merge --ff-only codex/august-sale-safety-guides
git -C C:\Vercel\sulitscan push origin main
```

- [ ] Verify `git -C C:\Vercel\sulitscan status --short --branch` shows clean `main` aligned with `origin/main`, and report the final pushed commit hash plus the five exact production URLs. Do not claim Google indexing or traffic before external evidence exists.
