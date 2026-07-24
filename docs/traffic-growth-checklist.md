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

## July 23 release external actions

- In Vercel domain settings, change the `www.sulitscan.com` redirect to a permanent 301 or 308 to
  `https://sulitscan.com`; verify the homepage and a deep path after the change. Repository
  middleware does not prove this domain-level action is complete.
- Re-run PageSpeed Insights after deployment. The audit request was rate-limited with HTTP 429, so
  do not publish a current performance score until a dated run succeeds.
- Verify `https://sulitscan.com/deals/summer-dress-shein` and
  `https://sulitscan.com/deals/xiaomi-smart-band-9-shopee` return 404 and are not in the sitemap.

## Weekly measurements

- Search impressions, clicks, click-through rate, and average position per guide.
- Landing-page visitors and engaged visits in Vercel Analytics.
- `affiliate_click` events by platform, placement, and source.
- `sister_site_click` events by placement and source.
- Articles that receive impressions but low CTR: improve title and description before adding more content.
- Articles that receive visits but few deal clicks: improve matching and calls to action.

## Distribution

- Share a useful summary or checklist first; include the article only when it answers the community's question.
- Avoid link-only posts, duplicate promotional messages, fake urgency, or unsupported savings claims.
- Refresh articles when store policies, customs rules, product coverage, or buyer guidance materially change.
