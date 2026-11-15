# SulitScan November Growth Refresh Design

## Goal

Refresh stale commercial guidance, add five distinct buyer-help guides with original banners, and leave the live site in a stronger state for search growth and a future AdSense review without claiming that content volume guarantees approval.

## Audit findings

- The live site is crawlable and indexable: the homepage, sitemap, robots file, category pages, store pages, and recent guides return indexable canonical pages.
- The current sitemap contains 105 URLs, including 64 blog posts and 18 active deal routes.
- The most recent article release was October 3, 2026, so the editorial calendar has been quiet for roughly six weeks.
- Core trust and policy infrastructure already exists: About, contact, editorial policy, affiliate disclosure, privacy, cookies, article trust panels, structured data, sitemap, and canonical metadata.
- The highest-priority on-site defect is stale Temu copy on indexable category pages. Temu affiliate inventory was retired, but seven category guides still recommend Temu and their long introductions are reused as search descriptions.
- AdSense code is already safely implemented, but the live homepage does not expose a `google-adsense-account` meta tag and live `/ads.txt` says the publisher ID is not configured. This is an account/deployment step, not a content defect.

## Implementation

### Category trust refresh

Rewrite all affected category guidance around current Shopee PH and Sephora PH coverage. Remove fixed shipping and return claims that can change, replace merchant-specific assumptions with checks buyers can perform on the live listing, and add a dedicated concise metadata description to every category.

Add a regression test that loads the same category data used by public pages and proves that current category guidance contains no Temu references, every featured category has a unique metadata description, and descriptions remain within a search-friendly length.

### Five-guide cluster

Publish five non-overlapping guides dated November 16, 2026:

1. `shopee-12-12-sale-philippines-2026-checklist` — cart, voucher, seller, delivery, and cross-border checks for the current campaign.
2. `online-shopping-complaint-dti-philippines` — platform escalation, evidence package, DTI mediation, and when an unknown seller belongs with PNP/NBI instead.
3. `holiday-online-shopping-delivery-checklist-philippines` — Days to Ship, Estimated Delivery Date, tracking, receiving, and Return to Seller planning.
4. `bundle-vs-single-item-unit-price-guide-philippines` — delivered-cost and usable-unit calculations with worked examples and the existing checkout comparison tool.
5. `online-shopping-warranty-checklist-philippines` — express-warranty terms, documents, product identity, claim steps, and realistic limits.

Each guide must include a direct answer, methodology/sources, a worked decision, a practical checklist, limitations, affiliate disclosure, at least three FAQs, contextual internal links, and a matching original 16:9 banner. ImportTaxPH is linked only in cross-border cost contexts. ApplyReadyCV is intentionally omitted because it is not relevant to these buyer tasks.

### Visual direction

Use original photorealistic editorial scenes matching the October guide collection: warm Filipino-home settings, useful objects arranged clearly, no people, no retailer or government logos, no readable personal data, no promotional text, and no watermarks. Save optimized 1600×900 JPEG files under `public/images/guides/`.

### AdSense boundary

Do not add more ad code or enable serving. The owner must add the real `NEXT_PUBLIC_ADSENSE_CLIENT_ID` in Vercel, keep `NEXT_PUBLIC_ADSENSE_ADS_ENABLED=false` during review, redeploy, verify the homepage meta tag and matching `/ads.txt`, then request review in AdSense. Google alone decides approval.

## Verification

- New regression tests fail before the data/content work and pass afterward.
- `npm run check` completes with no failures.
- A production build renders all five new routes and category metadata.
- Every new banner exists at 1600×900 and is referenced by exactly one guide.
- The sitemap includes all five new canonical routes.
- No tracked source change touches unrelated `output/` or `tmp/` files.

