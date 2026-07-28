# SulitScan AdSense Readiness and Buyer Evidence Guides Design

**Date:** 2026-07-28

## Objective

Prepare SulitScan for a Google AdSense site review without weakening its affiliate-conversion model, and publish five original buyer guides that add information value beyond deal listings.

AdSense approval cannot be guaranteed because Google makes the final decision. This release will remove avoidable policy risks, provide a correct ownership-verification path, improve publisher transparency, and keep advertising isolated from affiliate-heavy and low-content routes.

## Audit findings

- Production is crawlable over HTTPS, returns indexable canonical pages, exposes a 248-URL sitemap, and allows Google crawlers in `robots.txt`.
- The live `/ads.txt` is comment-only because no real AdSense publisher ID is configured.
- Privacy and cookie policies still describe display advertising only as a possible future use and do not yet contain the disclosures Google requires when advertising is enabled.
- Public store and footer content advertise unfinished Lazada and AliExpress coverage. Removing this avoids an unnecessary under-construction signal.
- Articles have dates and organization author schema, but the visible byline does not explain who prepares the guide, whether products were tested, or how corrections are handled.
- The site already has 29 substantive guides; the new content must occupy distinct buyer-information gaps rather than repeat the existing platform, voucher, return, sizing, travel, beauty, or budget-list articles.
- The canonical `www` host still redirects temporarily with HTTP 307. This is a Vercel domain-setting issue outside the repository and should later be changed to a permanent redirect.

## AdSense architecture

Use one public environment variable, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, in the exact form `ca-pub-0000000000000000`.

- The root layout emits Google's supported `google-adsense-account` ownership meta tag only when the ID is valid.
- `/ads.txt` derives the matching `pub-0000000000000000` value from the same public client ID used by verification and article serving, preventing mismatched publisher records.
- Article ad code remains separately gated by `NEXT_PUBLIC_ADSENSE_ADS_ENABLED=true`. It is loaded only on full blog-article routes, never on deal pages, categories, stores, tools, legal pages, or navigation-only pages.
- During review, set the client ID but leave ads disabled. After the site is marked Ready, configure a Google-certified consent management platform and then enable article ads.
- Never insert placeholder publisher IDs or visible blank ad boxes.

## Trust and policy changes

- Update privacy and cookie policies with Google advertising-cookie, web-beacon, IP-address, personalization, opt-out, and consent-management disclosures.
- Add an advertising-standard section to the editorial policy: ads are labeled, never disguised as buttons, never accompanied by click encouragement, and never allowed to outnumber publisher content.
- Add an article trust panel that links to About, Editorial Policy, and Contact, and clearly states that guides are desk-researched unless hands-on testing is explicitly stated.
- Remove all public “Coming Soon” partner promotions while retaining only Temu, Shopee PH, Sephora PH, and currently active sponsored advertiser offers.
- Add a deployment checklist covering publisher ID, AdSense Sites review, ads.txt validation, CMP setup, low initial ad load, and post-launch monitoring.

## Five-guide content cluster

1. `online-product-review-checklist-philippines` — how to separate useful review patterns from star averages, copied comments, variant mismatch, and recency bias.
2. `refurbished-vs-used-vs-open-box-philippines` — a condition, battery, serial-number, warranty, return-window, and landed-cost checklist; one contextual ImportTaxPH link is appropriate for imported devices.
3. `online-furniture-measurement-guide-philippines` — a room, doorway, stair/elevator, packaging, clearance, assembly, and delivery-route measurement workflow.
4. `online-purchase-warranty-guide-philippines` — what warranty evidence to save before checkout, on delivery, during a claim, and when escalating a dispute.
5. `energy-efficient-appliance-buying-guide-philippines` — how to read DOE Philippine Energy Labels, compare model-specific consumption, calculate running cost, and verify fit, electrical, delivery, and warranty details.

Each guide must have a distinct 1600x900 JPEG banner, at least five H2 sections, a “How we assessed this guide” section, visible FAQs with matching FAQ schema, reciprocal internal links, an affiliate disclosure, and conservative claims backed by primary Philippine government sources where applicable.

## Success criteria

- 34 unique published guides and 253 sitemap URLs, assuming the deal/catalog route count is unchanged.
- No public “Coming Soon”, Lazada, AliExpress, or SHEIN promotion in active UI or the five new guides.
- Valid AdSense IDs produce matching meta, script, and ads.txt values; invalid or missing IDs produce no executable ad code and no invalid ads.txt record.
- Five distinct 1600x900 JPEG covers exist and render without mobile overflow.
- Full static checks, unit tests, production build, Playwright suite, dependency audit, live deployment checks, and git diff checks pass before push.
