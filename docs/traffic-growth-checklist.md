# SulitScan Traffic Growth Checklist

## After every content deployment

1. Confirm each new URL returns HTTP 200 and its canonical points to itself.
2. Confirm `https://sulitscan.com/sitemap.xml` contains only canonical, indexable URLs.
3. Submit or refresh the sitemap in Google Search Console and Bing Webmaster Tools.
4. Use URL Inspection to request indexing for new or materially updated guides.
5. Confirm retired URLs return a permanent redirect and are absent from the sitemap.

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
