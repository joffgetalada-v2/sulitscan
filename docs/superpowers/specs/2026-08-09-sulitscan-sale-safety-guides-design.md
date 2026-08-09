# SulitScan Sale-Season Safety Guides Design

**Date:** 2026-08-09

**Status:** Approved by the site owner on 2026-08-09

## Problem

SulitScan has 39 published buyer guides, but publishing five unrelated posts every week would
double the library in eight weeks before Search Console has enough time to show which topics are
earning useful impressions. The next release should therefore be one coherent, time-sensitive
cluster rather than another generic budget-finds batch.

Live search-result and competitor review found a defensible August opportunity around sale
preparation, payment scams, seller verification, unexpected COD parcels, and Temu checkout
minimums. Official information is fragmented across Shopee, BSP, DTI, BIR, courier, and Temu
pages. SulitScan can add value by turning those sources into dated Philippine buyer workflows,
while avoiding unsupported voucher values, fixed checkout thresholds, or claims that a badge
guarantees product quality.

This work is content and discovery work only. The paused payment, direct-revenue, and alternative
monetization work remains out of scope.

## Publishing Cadence

Five new articles is the maximum for this approved launch batch. After release, the sustainable
weekly cadence is five content operations rather than five net-new pages:

1. Two original, source-led new guides.
2. One substantial update to an existing article based on changed policy or Search Console data.
3. One internal-linking and value-first distribution session.
4. One indexing, query, click-through-rate, and quality review.

The site should not increase above two new guides per week until at least the week-eight cohort
review shows that a cluster is earning relevant impressions. Google does not prescribe a weekly
article count; its current guidance prioritizes original people-first value and treats large-scale
low-value publishing as abuse regardless of how it is produced.

## Considered Approaches

### 1. Five evergreen product-fit guides

Clothing measurements, makeup shade selection, USB-C chargers, tumblers, and food-storage
containers align well with the active catalog and can support affiliate conversion. They are less
time-sensitive, but their search results are broader and more competitive. This is the preferred
next cluster after the sale-season release.

### 2. Five separate sale pages

Dedicated 9.9, 10.10, 11.11, 12.12, and payday pages could create short traffic spikes, but they
would overlap the existing `/sales-calendar` hub, require frequent maintenance, and encourage
speculative promotion details. This approach is rejected.

### 3. A sale-season checkout and safety cluster — selected

Publish one timely 9.9 workflow supported by four distinct evergreen buyer problems. The articles
share a clear sale-season context but each serves a separate intent: checkout planning, malicious
QR codes, displayed seller-registration badges, unordered COD parcels, and Temu minimum-order
decisions. The cluster balances immediate discovery with durable safety and checkout usefulness.

## Shared Editorial Contract

All five articles use the existing `BlogPost` registry and rendering pipeline. No new content
schema, component, route, dependency, or CMS is required.

Each article must:

- Use IDs `post-040` through `post-044` in the exact order below.
- Use `publishedAt` and `lastReviewed` values of `2026-08-09`.
- Contain at least 1,000 original words and at least seven meaningful H2 sections.
- Answer the primary query directly near the start.
- Explain how the guide was assessed and name the 2026-08-09 source-review date.
- Include a worked decision, household protocol, or comparison that adds value beyond summarizing
  sources.
- Include a numbered checklist, limitations/live-policy section, affiliate disclosure, and at
  least three visible FAQs that match the emitted FAQ schema.
- Use primary official sources for decision-critical statements. A current secondary source may
  establish timeliness, but never replaces the official operating rule.
- Make the live marketplace, checkout, financial institution, or official verification result
  authoritative when conditions can vary.
- Avoid guaranteed savings, recovery, approval, legitimacy, safety, or product-quality claims.
- Avoid fixed voucher amounts, flash-sale times, QR recipients, Temu peso thresholds, or seller
  eligibility that cannot be verified for the reader's live account.
- Use the current affiliate disclosure and only recommend active, non-suspicious deals matching
  the explicit platform and editorial intent.
- Link contextually into existing guides and reciprocally connect the new cluster without generic
  keyword-stuffed link blocks.

## Article Specifications

### 1. Shopee 9.9 Sale Philippines 2026: Smart Checkout Checklist

- **ID:** `post-040`
- **Slug:** `shopee-9-9-sale-philippines-2026-checklist`
- **Category:** `Shopping Tips`
- **Primary intent:** prepare a real cart for the current Shopee 9.9 event without treating a
  promotional headline as the payable total.
- **Core source:** the current [official Shopee 9.9 page](https://shopee.ph/m/9-9), observed on
  2026-08-09, says its campaign runs September 1 through 10. The article must state that campaign
  details can change and readers must recheck the live page and checkout.
- **Distinct value:** a three-snapshot comparison: baseline before the campaign, best eligible
  live checkout configuration, and post-purchase order breakdown. The workflow compares final
  payable totals and needed items rather than claimed percentage savings.
- **Required internal links:** `/sales-calendar`,
  `/blog/how-to-stack-shopee-vouchers-philippines`, `/blog/how-to-spot-fake-discounts`,
  `/blog/why-final-prices-change-at-checkout`, and `/tools/checkout-comparison`.
- **Recommendation intent:** topics `sale-planning`, `checkout-checklist`, and `shopee-shopping`;
  platform `Shopee PH`; deal tags limited to `shopee`.
- **Required caution:** the dedicated page does not duplicate the year-round calendar. It is a
  checkout workflow, contains no guaranteed voucher stack, and does not recommend borrowing merely
  because a campaign advertises an installment offer.

### 2. Fake QR Code Payment Scams Philippines: Checks Before You Scan

- **ID:** `post-041`
- **Slug:** `fake-qr-code-payment-scams-philippines`
- **Category:** `Shopping Safety`
- **Primary intent:** decide whether an online-selling QR code or QR-linked page is safe enough to
  proceed with, and respond quickly after a suspicious scan or payment.
- **Core sources:** [Shopee's current scam guidance](https://help.shopee.ph/portal/4/article/142074-Safety-exercises-to-protect-yourself-against-each-type-of-scam)
  says not to scan QR codes or pay outside the app; the
  [BSP Verifier](https://www.bsp.gov.ph/SitePages/FinancialStability/BSPVerifier.aspx) defines
  quishing and says suspicious transactions should first be reported to the bank or e-money
  issuer. A [July 2026 PNA report](https://www.pna.gov.ph/articles/1280220) may establish current
  public-warning context but not operating rules.
- **Distinct value:** a seven-check sequence covering source, destination preview, recipient name,
  requested amount, platform order state, requested credentials, and independent confirmation.
  Include a separate immediate-response sequence for scans without payment, credential exposure,
  and completed transfers.
- **Required internal links:** `/blog/online-shopping-safety-tips-philippines`,
  `/blog/how-to-check-shopee-seller-legit-philippines`, the new seller-badge guide, and the new COD
  guide.
- **Recommendation intent:** topics `qr-scam`, `payment-safety`, and `shopping-safety`; platform
  `Shopee PH`; deal tags limited to `shopee`.
- **Required caution:** the banner QR motif must be abstract and non-scannable. The article must not
  tell a reader that visual inspection alone proves a QR code or recipient is legitimate, and it
  must not promise that a transfer can be reversed.

### 3. DTI Trustmark and BIR Registration Seal: Verify Online Sellers

- **ID:** `post-042`
- **Slug:** `dti-trustmark-bir-registration-seal-online-sellers`
- **Category:** `Shopping Safety`
- **Primary intent:** verify a displayed DTI Trustmark or BIR Registration Seal through the correct
  official domain and understand what the result does and does not prove.
- **Core sources:** the current [DTI Trustmark FAQ](https://trustmark.dti.gov.ph/faqs) describes
  verification through `trustmark.dti.gov.ph`; the
  [BIR RMC No. 38-2026 digest](https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2038-2026%20Digest.pdf)
  says the BIR QR result must use `https://verify.bir.gov.ph/correspondence/`.
- **Distinct value:** a side-by-side verification matrix separating government registration,
  marketplace performance badges, seller identity, product authenticity, warranty, and complaint
  responsiveness.
- **Required internal links:** `/blog/how-to-check-shopee-seller-legit-philippines`,
  `/blog/online-purchase-warranty-guide-philippines`, `/blog/online-product-review-checklist-philippines`,
  and the new QR-scam guide.
- **Recommendation intent:** topics `seller-verification`, `business-registration`, and
  `shopping-safety`; platform `Shopee PH`; deal tags limited to `shopee`.
- **Required caution:** the DTI FAQ observed on 2026-08-09 is internally inconsistent: one answer
  says covered merchants must be registered, while another says Trustmark application is
  voluntary. The article must disclose this conflict, must not resolve it by assumption, and must
  say that absence of a Trustmark alone does not prove a seller is fraudulent. A verified badge is
  not a DTI or BIR endorsement of product quality.

### 4. Fake COD Parcel Scam Philippines: What to Do Before Paying

- **ID:** `post-043`
- **Slug:** `fake-cod-parcel-scam-philippines`
- **Category:** `Shopping Safety`
- **Primary intent:** help a buyer, relative, guard, or helper decide what to do when an unexpected
  COD parcel arrives.
- **Core sources:** [Shopee receiving guidance](https://help.shopee.ph/portal/4/article/81483-What-to-do-when-receiving-an-order),
  [Shopee scam guidance](https://help.shopee.ph/portal/4/article/142074-Safety-exercises-to-protect-yourself-against-each-type-of-scam),
  and [Ninja Van Philippines' parcel advisory](https://www.ninjavan.co/en-ph/support/consignee-support/parcel-scams-advisory).
- **Distinct value:** a household parcel log and a short recipient script: check the exact order
  history, buyer name, amount, seller/platform, and airway-bill details before money changes hands.
  Separate an unordered parcel from a real order containing a wrong or damaged item, which follows
  the platform's return/refund route rather than being opened at the door.
- **Required internal links:** `/blog/unboxing-video-evidence-online-shopping-philippines`,
  `/blog/shopee-return-refund-guide-philippines`, `/blog/online-shopping-safety-tips-philippines`,
  and the new QR-scam guide.
- **Recommendation intent:** topics `cod-scam`, `parcel-safety`, and `shopping-safety`; platform
  `Shopee PH`; deal tags limited to `shopee`.
- **Required caution:** courier and marketplace refusal rules can differ. The article must not tell
  readers to open a COD parcel before payment when the current carrier/platform rule prohibits it,
  must not blame a delivery rider, and must not promise a courier refund.

### 5. Temu Minimum Order Philippines: Checkout Without Overspending

- **ID:** `post-044`
- **Slug:** `temu-minimum-order-philippines`
- **Category:** `Platform Guides`
- **Primary intent:** respond to a live Temu minimum-order message without adding unwanted filler
  that costs more than the intended purchase.
- **Core source:** Temu PH currently exposes a
  [Minimum Order Value entry in its buying support](https://www.temu.com/ph/support/c2/buying-on-temu-f-44.html),
  but no single public peso amount should be treated as universal. The exact account, item, and
  checkout message is authoritative.
- **Distinct value:** a stop/continue comparison using only user-entered live values: intended-item
  cost, gap to the displayed minimum, cost and usefulness of any extra item, voucher effect, and
  final payable total. “Buy nothing today” must remain an explicit valid result.
- **Required internal links:** `/blog/temu-shopping-guide-philippines`,
  `/blog/why-final-prices-change-at-checkout`, `/tools/checkout-comparison`,
  `/blog/temu-returns-refunds-price-adjustment-philippines`, and
  `/blog/philippine-import-tax-guide-online-shoppers`.
- **Contextual sister-site link:** `https://www.importtaxph.com/` may appear only in a clearly
  separated cross-border landed-cost explanation. It must explain that a marketplace checkout
  minimum is not a Philippine customs threshold and that the sister-site result is an estimate,
  not an official assessment.
- **Recommendation intent:** topics `temu-checkout`, `minimum-order`, and `checkout-value`; platform
  `Temu`; deal tags limited to `temu`.
- **Required caution:** do not publish a fixed Philippine minimum, claim why Temu assigned a
  threshold, describe a workaround, recommend canceling filler after checkout, or imply that
  customer support must waive a minimum.

## Reciprocal Linking

The implementation updates only the most relevant established articles:

- `/sales-calendar` points to the dedicated 9.9 checkout workflow.
- The Shopee seller-legitimacy guide points to the DTI/BIR verification workflow.
- The general online-shopping-safety guide points to the QR and COD workflows.
- The unboxing-evidence guide points to the COD household protocol.
- The Temu shopping guide points to the minimum-order decision.

Related-post topics must keep intent specific. The QR and COD guides can relate to each other, but
the recommendation tests must prevent the Temu minimum-order guide from being displaced by generic
returns content and must prevent every safety article from producing the same related-post order.

## Banner Design

Generate five separate original images with the built-in image generator. Each accepted project
asset is center-cropped/resized to an exact 1600×900 progressive JPEG, visually inspected at
original detail, and recorded in `public/images/guides/README.md` with its accepted source and final
SHA-256.

Exact files and alternative text:

1. `/images/guides/shopee-9-9-sale-philippines-2026-checklist.jpg` — “Filipino shopper planning a sale checkout with a blank phone cart, calendar, calculator, and price checklist”.
2. `/images/guides/fake-qr-code-payment-scams-philippines.jpg` — “Shopper inspecting a non-scannable abstract QR pattern on a phone beside a shield and payment checklist”.
3. `/images/guides/dti-trustmark-bir-registration-seal-online-sellers.jpg` — “Magnifying glass checking abstract seller verification cards beside a laptop and official-domain checklist”.
4. `/images/guides/fake-cod-parcel-scam-philippines.jpg` — “Household member comparing an unopened COD parcel with a phone order list before payment”.
5. `/images/guides/temu-minimum-order-philippines.jpg` — “Shopper comparing an online cart minimum with a calculator and a short needs checklist”.

All prompts use the `photorealistic-natural` taxonomy and a wide crop-safe editorial composition.
They prohibit readable text, letters, numbers, logos, trademarks, marketplace interfaces,
barcodes, watermarks, real or scannable QR codes, government seals, certification marks, currency
account numbers, and realistic personal information. The seller-verification banner uses only
abstract card shapes; it must not imitate the DTI Trustmark or BIR Registration Seal. The QR banner
uses an obviously decorative nonfunctional geometric pattern rather than a decodable code.

## Testing and Verification

Follow strict red-green TDD before changing the post registry or link guard:

1. Extend the recommendation suite with the exact five-entry registry contract, dated metadata,
   source URLs, required cautions, word/H2/FAQ structure, reciprocal links, recommendation intent,
   exact cover paths and alternative text, unique hashes, JPEG signatures, and 1600×900 dimensions.
2. Add link-guard expectations for the five slugs and covers, then record the expected RED result
   before adding posts or images.
3. Implement the five articles and reciprocal links until the focused Node and link suites pass.
4. Generate and inspect each banner separately, copy accepted outputs into the worktree, normalize
   them mechanically, pin the final hashes, and rerun the focused suite.
5. Extend the serial Playwright article table to verify all five routes, loaded local banners,
   canonical URLs, concise titles, trust panel, FAQ JSON-LD parity, related guides, sitemap
   membership, and 390-pixel mobile overflow.
6. Update the traffic checklist with the five canonical indexing URLs and the two-new-guides weekly
   cadence.
7. Run `npm run check`, the complete Playwright suite, `npm audit --omit=dev`, `git diff --check`,
   and independent task plus whole-branch reviews before promotion to `main`.

## Release Boundary

The feature branch may be promoted only after the final whole-branch review has no unresolved
Critical or Important finding and all fresh verification commands pass. After the commit reaches
`main`, push `main` to `origin`, verify the live deployment and all five image URLs, refresh the
existing sitemap submission, and request indexing for the five new canonical article URLs. Do not
claim production deployment or indexing until those live checks actually succeed.
