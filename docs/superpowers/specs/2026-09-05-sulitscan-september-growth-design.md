# SulitScan September Growth Release Design

## Outcome

Publish a trustworthy September growth release that gives purchase-intent visitors five new reasons to discover SulitScan, routes current 9.9 traffic to an existing high-intent guide, and prevents expired catalog records from emitting stale price structured data.

## Evidence from the audit

- Production and the current repository intentionally expose 169 active listings but index only the 40 with unique editorial descriptions. The 129 thin pages remain browsable with `noindex`; this is working as designed and must not be reversed.
- All 169 public listings are in `reference` state on 2026-09-05. Shopee's exact June 27 checks reach the 90-day expiry threshold on September 26; June datafeed records reach it after September 29. Dates must never be advanced without a real partner-page or affiliate-feed verification.
- An expired deal is removed from discovery and receives `noindex`, but a direct request still renders price-bearing Product/Offer JSON-LD. The page may remain browseable, but expired price schema must be suppressed.
- The homepage currently selects the three newest guides mechanically. During the September 1-10 campaign window, this hides the existing 9.9 checkout guide beneath later 10.10/11.11 content.
- Competitors win with named authors, hands-on testing, and product-specific roundups. SulitScan cannot claim hands-on testing it did not perform, so its differentiator remains source-backed decision checklists, exact limitations, live-policy reminders, and disclosed affiliate links.
- `npm audit` currently reports one high-severity transitive `browserslist` advisory. A patched lockfile version is available.
- Root-level ESLint scans generated files in ignored linked worktrees. ESLint must explicitly ignore `.worktrees/**` so the documented full check works from the primary checkout.

## Scope

### 1. Expired-deal schema safety

Keep expired direct URLs browseable and `noindex` so old links do not become abrupt 404s. Continue showing a generic “check live price” action, but render Product/Offer JSON-LD only for `current` or `reference` records. Put the policy in a pure exported helper and cover it at the exact `reference`/`expired` boundary.

### 2. Automatic 9.9 discovery spotlight

Create a pure seasonal-promotion helper with an inclusive Philippine campaign window represented as UTC instants: 2026-09-01 00:00 PHT through 2026-09-10 23:59:59 PHT (`2026-08-31T16:00:00.000Z` through `2026-09-10T15:59:59.999Z`). During the window:

- Header announcement: `9.9 checkout checklist: compare the final total →`
- Destination: `/blog/shopee-9-9-sale-philippines-2026-checklist`
- Homepage guide grid: put that post first, then the two newest different posts.

Outside the window, preserve the generic weekly-guides announcement and the normal three newest posts. The client header must use a hydration-safe generic initial state and calculate the temporary promotion after mount; the homepage may calculate it during its daily server render.

### 3. Five September 5 buyer guides

Publish these exact new posts, in this order, as `post-055` through `post-059`:

1. `shopee-mall-vs-preferred-seller-philippines` — service/performance badge versus Mall authenticity/accountability; Shopee PH only.
2. `portable-fan-buying-guide-philippines` — fan format, exact specifications, charging and mounting, and the important DTI-BPS certification-scope distinction.
3. `insulated-tumbler-buying-guide-philippines` — capacity, base fit, lid spill risk, cleaning access, and evidence behind material/retention claims.
4. `wireless-earbuds-buying-guide-philippines` — fit, phone compatibility, calls, charging case, exact-model NTC evidence, warranty, and safe listening.
5. `online-foundation-shade-match-philippines` — depth, undertone, finish, virtual try-on limits, exact FDA notification/variant check, and mismatch risk.

| ID | Title | Category | Read time | Tags | Recommendation intent |
|---|---|---|---:|---|---|
| `post-055` | `Shopee Mall vs Preferred Seller Philippines: Badge Guide` | Platform Guides | 11 | `shopee`, `shopee-mall`, `preferred-seller`, `seller-checking`, `authenticity`, `philippines` | topics `seller-checking`, `shopee-shopping`, `marketplace-badges`; platform `Shopee PH`; deal tag `shopee` |
| `post-056` | `Portable Fan Buying Guide Philippines: USB, Battery, Safety` | Tech Guides | 12 | `portable-fan`, `usb-fan`, `fan-buying`, `electrical-safety`, `under-500`, `philippines` | topics `tech-accessories`, `electrical-safety`, `fan-buying`; platform `Temu`; category `Electronics`; deal tags `fan`, `portable`, `usb` |
| `post-057` | `Insulated Tumbler Buying Guide Philippines: Size, Lid, Care` | Home Guides | 11 | `insulated-tumbler`, `drinkware`, `kitchen`, `product-checklist`, `under-500`, `philippines` | topics `home-buying`, `product-review`, `tumbler-buying`; platforms `Temu`, `Shopee PH`; category `Home`; deal tags `tumbler`, `drinkware` |
| `post-058` | `Wireless Earbuds Buying Guide Philippines: Fit, Calls, Battery` | Tech Guides | 12 | `wireless-earbuds`, `bluetooth`, `audio`, `safe-listening`, `under-500`, `philippines` | topics `tech-accessories`, `product-review`, `earbuds-buying`; platform `Temu`; category `Electronics`; deal tags `earbuds`, `wireless` |
| `post-059` | `Foundation Shade Match Online Philippines: A Practical Guide` | Beauty Guides | 12 | `foundation`, `shade-match`, `makeup`, `undertone`, `sephora`, `philippines` | topics `cosmetic-authenticity`, `sephora-shopping`, `makeup-buying`; platform `Sephora PH`; categories `Beauty`, `Skincare`; deal tags `makeup`, `face`, `concealer`, `powder` |

All five use `publishedAt: "2026-09-05"` and `lastReviewed: "2026-09-05"`. Their exact covers and alternative text are:

| Slug | Cover | Alt text | SHA-256 |
|---|---|---|---|
| `shopee-mall-vs-preferred-seller-philippines` | `/images/guides/shopee-mall-vs-preferred-seller-philippines.jpg` | `Marketplace seller comparison with two abstract profile cards, storefront and trust badges, magnifying glass, parcel, and checklist` | `d1dad09c2aa71b9760860c83e624d87c555b8d6259bd2f74e79a07d028600c83` |
| `portable-fan-buying-guide-philippines` | `/images/guides/portable-fan-buying-guide-philippines.jpg` | `Portable fan buying guide with handheld, desktop, and clip-on fans beside a charging cable, ruler, and battery gauge` | `c225b99923aaff9df9d581944414d9951dc3f815c05fa1336b22caa972f9bb78` |
| `insulated-tumbler-buying-guide-philippines` | `/images/guides/insulated-tumbler-buying-guide-philippines.jpg` | `Insulated tumbler buying guide with three lid styles, cup-holder ring, measuring tape, removable parts, cleaning brush, and leak-check droplet` | `8b7d172713bb612769be67156c13aa18d8eb1e213c345e66b93615d00bd4f573` |
| `wireless-earbuds-buying-guide-philippines` | `/images/guides/wireless-earbuds-buying-guide-philippines.jpg` | `Wireless earbuds buying guide comparing unbranded earbud shapes, charging cases, fit, microphone, compatibility, battery, and warranty symbols` | `e43a6cd8700fd240bc28836ee095e1661824b0e48eff103b3b84d837f826dc88` |
| `online-foundation-shade-match-philippines` | `/images/guides/online-foundation-shade-match-philippines.jpg` | `Online foundation shade matching guide with inclusive swatches, unbranded bottle, abstract virtual try-on screen, daylight symbol, and mirror` | `ecfbe43821896ada3755aa5a76c26d09a57c6e5647aaac4ee61f4b56313601db` |

Every post must:

- use `publishedAt` and `lastReviewed` of `2026-09-05`;
- answer the main query in the opening paragraph;
- include `## How we assessed this guide`, at least five additional useful H2 sections, `## Limitations and live-policy check`, and `## Affiliate disclosure`;
- include at least three contextual internal links, three concise FAQs, a unique six-tag set, a recommendation intent, and an honest browse/deal CTA;
- avoid fixed prices, unverified performance claims, “FDA-approved” cosmetics/tumblers, universal PS/ICC claims, or assurances that a badge/technology guarantees safety, authenticity, fit, sound quality, or a refund;
- never claim SulitScan bought, tested, measured, wore, used, or authenticated a product;
- use an exact current primary source for any platform, regulatory, health, or technical policy claim.

The foundation article may route to Sephora PH and general makeup results, but must not imply SulitScan currently lists a foundation product. ImportTaxPH and ApplyReadyCV are intentionally excluded because none of these five decisions has a natural customs or CV step.

### 4. Five original banners

Use the generated flat editorial assets in `public/images/guides/`, one per post. Each final must be a distinct 1600×900 progressive JPEG with no text, logo, trademark, price, or watermark. Record dimensions, SHA-256, alt text, and generation method in the guide image README.

## Source set

- Shopee Preferred Sellers: `https://help.shopee.ph/portal/4/article/130672`
- Shopee Mall terms: `https://help.shopee.ph/portal/4/article/77281-Shopee-Mall-Terms-of-Service`
- Shopee Mall counterfeit guarantee: `https://help.shopee.ph/portal/4/article/148331-What-is-Shopee-Mall-3x-Money-Back-Guarantee`
- DTI-BPS electric-fan scope: `https://bps.dti.gov.ph/component/content/article?Itemid=111&id=11`
- DTI-BPS PS/ICC marks: `https://bps.dti.gov.ph/product-certification/ps-and-icc-marks`
- Philippine FDA food-contact suitability service: `https://www.fda.gov.ph/wp-content/uploads/2022/04/FDA-Citizens-Charter-CSL-31-March-2022-1.pdf`
- NTC Region 7 FAQ: `https://region7.ntc.gov.ph/faqs/`
- NTC equipment register: `https://ntc.gov.ph/wp-content/uploads/2025/TYPE_APPROVED/RCE_1986_SEP_2025.pdf`
- WHO safe listening: `https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening`
- Sephora PH shade finder: `https://www.sephora.ph/pages/perfect-shade-for-you`
- Sephora PH Virtual Artist: `https://www.sephora.ph/pages/virtual-artist`
- Philippine FDA cosmetic e-notification manual: `https://www.fda.gov.ph/wp-content/uploads/2021/03/Cosmetic-e-Notification-v.2.0-User-Manual-for-Applicants.pdf`
- Philippine FDA verification portal: `https://verification.fda.gov.ph`

## Out of scope

- No fabricated or bulk-bumped `lastChecked` values.
- No affiliate URL or advertiser relationship changes.
- No AdSense/ad-network activation, publisher ID, CMP configuration, or BIR/DTI identity claim.
- No new sister-site link where it is not part of the reader's decision.
- No reversal of the 40-page unique-content index gate.
- No named human author until the owner chooses a truthful public identity.

## Verification

- Observe test-first failures for the schema policy, seasonal boundaries, and five-post registry before implementation.
- Run focused unit/contract suites after each task.
- Validate all five image dimensions, formats, uniqueness, and hashes.
- Run `npm audit`, `npm run check`, then the serial Playwright suite.
- After merging and pushing `main`, verify production pages, images, canonicals, BlogPosting/FAQ schema, sitemap membership, 9.9 homepage/header placement, and absence of Product JSON-LD on an expired fixture through automated tests.
