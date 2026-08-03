# SulitScan Traffic Growth Checklist

## After every content deployment

1. Confirm each new URL returns HTTP 200 and its canonical points to itself.
2. Confirm `https://sulitscan.com/sitemap.xml` contains only canonical, indexable URLs.
3. Keep the existing sitemap submission in Google Search Console and Bing Webmaster Tools; refresh
   or resubmit it after deployment rather than removing it.
4. Use URL Inspection for a small priority set of new or materially updated pages; let sitemap
   discovery handle pagination URLs unless request quota remains.
5. Confirm deliberately retired pages use the intended permanent redirect and are absent from the
   sitemap; confirm inactive/demo deal records return a real 404.
6. Confirm production Open Graph, Twitter, canonical, robots, and JSON-LD output in a rendered
   browser, not from a text-only fetch.

## August 3 release indexing order

Do not request indexing until the production deployment is verified. Then request these exact URLs
in order:

1. `https://sulitscan.com/blog/how-to-stack-shopee-vouchers-philippines`
2. `https://sulitscan.com/blog/shopee-return-refund-guide-philippines`
3. `https://sulitscan.com/blog/temu-returns-refunds-price-adjustment-philippines`
4. `https://sulitscan.com/blog/how-to-check-skincare-makeup-legit-philippines`
5. `https://sulitscan.com/blog/online-electrical-appliance-safety-ps-icc-philippines`

Keep `https://sulitscan.com/sitemap.xml` submitted in Google Search Console and Bing Webmaster
Tools. Refresh or resubmit that same sitemap after deployment; **do not remove it**. The branch is
expected to add five URLs to the observed 261-URL production baseline, but record 266 only after the
live sitemap has been counted.

After the five requests, inspect `/blog` and the homepage only if Search Console has not recrawled
their new links naturally. Do not use manual-request quota on every sitemap URL.

## August 3 deployment validation

- Confirm all five new routes return 200, self-canonicalize, remain indexable, and appear in the
  production sitemap.
- Confirm every guide's concise title, local banner, trust panel, BlogPosting/FAQPage output,
  related content, and mobile layout in a rendered browser.
- Confirm canonical `/deals` pages 2–8 have distinct `Page N` descriptions; check filtered views
  still use page-one description semantics.
- Confirm the homepage scanner links to an internal deal detail, stays stable during keyboard focus,
  and says “No automatic redirects”; confirm the announcement points to `/blog`.
- Record the live sitemap total and deployment timestamp. Until this is done, describe all five
  guides and metadata changes as branch implementation, not live production.

## Affiliate feed deadlines

- On 2026-08-03, production exposed 169 reference-price deals: 95 Temu, 45 Shopee PH, and 29
  Sephora PH. None was in current-price state.
- Import and review an approved Shopee PH replacement feed by **2026-09-25 UTC**; records checked
  June 27 expire at 2026-09-26 00:00 UTC.
- Import and review approved Temu and Sephora PH replacement feeds by **2026-09-28 UTC**; June
  month-only records expire at 2026-09-29 00:00 UTC.
- Use an earlier internal review SLA. Validate partner, destination, price/availability wording,
  freshness label, and public eligibility before deployment; never promise a live price from the
  reference catalog.

## AdSense account and consent work

1. Add `sulitscan.com` to the real AdSense account and obtain its actual `ca-pub-` ID. Never use a
   sample or another publisher's ID.
2. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` in Vercel for Production, Preview, and Development. Keep
   `NEXT_PUBLIC_ADSENSE_ADS_ENABLED` unset or `false`, redeploy, and verify the root account meta
   tag plus the matching `/ads.txt` DIRECT record.
3. Verify the site and request review in AdSense. Approval is not guaranteed, so keep serving off
   until the site status is Ready.
4. Configure Google or another certified CMP for required regions before enabling ads.
5. After approval/CMP setup, enable a low article-only load in AdSense, set
   `NEXT_PUBLIC_ADSENSE_ADS_ENABLED=true` in Production, redeploy, and inspect mobile and desktop
   articles. Keep ads off deals, categories, stores, tools, legal pages, and navigation-only pages.

## July 23 release indexing order

Request indexing manually for these exact URLs after production verification:

1. `https://sulitscan.com/blog/online-shoe-size-guide-philippines`
2. `https://sulitscan.com/blog/unboxing-video-evidence-online-shopping-philippines`
3. `https://sulitscan.com/blog/travel-packing-organizers-philippines-buying-guide`
4. `https://sulitscan.com/blog/first-apartment-essentials-under-1000-philippines`
5. `https://sulitscan.com/blog/power-bank-buying-guide-philippines`
6. `https://sulitscan.com/tools/checkout-comparison`

Then refresh `https://sulitscan.com/sitemap.xml`. Let the sitemap cover the new category/store
page-2+ URLs. If manual quota remains, inspect the materially updated guides listed in
[`seo-audit-2026-07-23.md`](./seo-audit-2026-07-23.md).

## July 23 release follow-up

- HTTP, `www`, and the Vercel hostname were observed redirecting permanently to the apex on
  2026-08-03. Recheck after future domain changes.
- Re-run PageSpeed Insights after deployment. The audit request was rate-limited with HTTP 429, so
  do not publish a current performance score until a dated run succeeds.
- Verify `https://sulitscan.com/deals/summer-dress-shein` and
  `https://sulitscan.com/deals/xiaomi-smart-band-9-shopee` return 404 and are not in the sitemap.

## Weekly measurements for 8–12 weeks

- Record indexed state, impressions, clicks, click-through rate, average position, and query
  coverage for each of the five August guides.
- Record landing-page visitors and engaged visits available in Vercel Analytics.
- The current Vercel Hobby plan does not expose custom-event reporting. Do not report tested
  `affiliate_click`, `sister_site_click`, or newsletter events as dashboard results.
- Maintain a manual weekly sheet using affiliate-network clicks, orders, and commission by partner
  and landing page where available, plus newsletter totals. Record zero or unavailable honestly.
- Articles that receive impressions but low CTR: improve title and description before adding more content.
- Articles that receive visits but few deal clicks: improve matching and calls to action.
- Compare week 4 with the first three weeks, week 8 with the prior four weeks, and close the initial
  review at week 12. Do not guarantee rankings, orders, or commission.

## Distribution

- Weeks 1–3: share one useful artifact at a time—a voucher-cap example, return-evidence checklist,
  Temu remedy decision, cosmetics verification sequence, or PS/ICC safety checklist—through a
  relevant Philippine shopping community, newsletter, or social post.
- Include the article only when it answers the community's question and the community rules allow
  links. Record channel, date, useful excerpt, link, and response in the weekly sheet.
- Weeks 4 and 8: use Search Console and referral evidence to refine the snippet or distribution
  angle; refresh the guide only when source policy or buyer guidance materially changes.
- Avoid link-only posts, duplicate promotional messages, fake urgency, or unsupported savings claims.
- Refresh articles when store policies, customs rules, product coverage, or buyer guidance materially change.
