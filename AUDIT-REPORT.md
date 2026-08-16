# SulitScan PH — Audit Report (August 16, 2026)

Full audit and remediation pass across content, technical SEO, conversion, and editorial growth. Baseline: ~2 months old, 169 live deal listings, zero sales, very low traffic. Diagnosis in one sentence: **Google was being shown 169 near-duplicate templated pages with almost no unique text, so the site had no reason to rank; and the few visitors who arrived met a CTA below the fold on mobile.**

## What was fixed (all committed)

### Phase 0 — Thin/duplicate content (the ranking blocker)

Full analysis in [thin-content-report.md](thin-content-report.md).

- **Found:** 44 of 169 deal pages shared 8 identical boilerplate `reason` strings (bulk Shopee import); 94 pages rendered an identical freshness-fallback sentence because every deal is past the 14-day "current" window; all 169 meta titles and descriptions came from one template each.
- **Rewrote the top 40 deals** (highest SulitScore, safest ordering, all three platforms) with unique 100–200-word "Editor's notes" (what it is, who it's for, what to check, why the score), unique hand-written meta titles and meta descriptions, and unique short reasons where boilerplate existed. Tone matches the existing hand-written deals; no invented specifics; no price claims that go stale.
- **Automatic noindex for thin pages:** a deal page is now indexed only when it has unique editorial content (`isDealIndexable()` in `src/lib/deal-seo.ts`). The other 129 pages stay fully browsable and internally linked but send `noindex` and are excluded from the sitemap. **Reversal is per page: write a `description` and the page re-indexes on its own; `noindex: true` force-excludes.** New bulk imports default to noindex, so this problem cannot recur.
- **Prevention:** [deal-content-guide.md](deal-content-guide.md) — the checklist for every future listing.

### Phase 1 — Technical SEO

- **Verified healthy (no change needed):** sitemap covers deals/blog/categories/stores with pagination; robots.txt correct (blocks only /api/, references sitemap); canonicals present on every page type; Organization + WebSite JSON-LD site-wide; BreadcrumbList on all major pages; BlogPosting + FAQ schema on posts; category/store pages have sensible index/noindex pagination logic.
- **Added:** Product + Offer JSON-LD on every deal page (deliberately without `aggregateRating` — SulitScore is editorial, not user reviews — and without an unverified availability claim; honest schema avoids rich-result penalties).
- **Added:** "Guides worth reading first" section on deal pages — every deal now links to 2 matched guides (driven by each guide's existing `recommendationIntent`, with evergreen fallbacks; verified 0 of 169 deals ends up without guides). Blog→deals, deals→related deals, and blog→blog linking already existed, closing the internal-link loop.
- **Core Web Vitals:** capped `next/image` `deviceSizes` at 1920 — partner CDN sources are ~500–1600px, so the default 2048/3840 srcset entries only generated oversized image requests (the `w=3840` problem). Lazy loading below the fold and eager+high-priority first card were already correct; fonts already use `next/font` with `display: swap`. Enriched thin tags on the rewritten Shopee deals so related-deal/guide matching works better.

### Phase 2 — Conversion

- **Mobile CTA above the fold:** deal pages now have a mobile-only sticky bottom bar (price context + "Check Price on {store}") — previously the square product image pushed the CTA 2+ screens down. Same honest labeling and affiliate disclosure; no dark patterns.
- **Click tracking already exists and is good:** every affiliate CTA runs through `ExternalAffiliateLink`, which fires a Vercel Analytics `affiliate_click` event with platform, placement, source page, offerId, and position. The new sticky bar reports `placement=deal-detail-sticky-mobile`, so you can compare it against `deal-detail-primary` and `deal-card`. **View: Vercel dashboard → Analytics → Events.** (GA4 is not installed; adding it would need a measurement ID — see manual actions.)
- **Email signup:** the flow is real and well-built (Resend contacts API via `/api/newsletter`, honeypot, consent gate, graceful 503 when unconfigured). Whether it works in production depends on `RESEND_API_KEY` being set in your deployment environment — verify (manual action below).

### Phase 3 — Content for traffic

- **5 new SEO guides** (all with FAQ schema, 3+ internal links to deals/categories/stores, related-guide links, ending CTA, house-style honesty sections). Topics were adjusted from the original brief because several suggested topics already existed (9.9 checklist, fake discounts, Shopee under-₱500, Sephora sale guide) — duplicating them would cannibalize:
  1. `temu-vs-shopee-philippines` — head-to-head price/shipping/returns comparison
  2. `sephora-beauty-pass-philippines-guide` — loyalty program explainer
  3. `safest-payment-methods-online-shopping-philippines` — GCash/card/COD safety
  4. `shopee-coins-guide-philippines` — coins earn/use/expiry
  5. `shopee-9-9-vs-11-11-vs-12-12-which-sale-cheapest` — sale-date comparison
- **[content-calendar.md](content-calendar.md):** 12 more articles mapped to 9.9/10.10/11.11/12.12/Christmas/payday with publish-by dates and link targets.

## What needs your manual action

1. **Google Search Console (highest priority).** Verify sulitscan.com, submit `https://sulitscan.com/sitemap.xml`, then use URL Inspection → "Request indexing" for: the homepage, /deals, the 40 rewritten deal URLs (list = deals with `description` in `src/data/deals.ts`), and the 5 new blog URLs. Watch Pages → "Crawled – currently not indexed" shrink over 2–6 weeks.
2. **Verify the newsletter works in production.** Check `RESEND_API_KEY` is set in your hosting env (Vercel → Settings → Environment Variables — never commit it), then submit a test signup on the live site and confirm the contact appears in Resend. If you see `[newsletter-signup-failure] missing_configuration` in function logs, the key is absent.
3. **Bing Webmaster Tools** — import from GSC (one click) for free Bing/Copilot traffic.
4. **Optional GA4:** click tracking already works via Vercel Analytics events. If you want GA4 anyway, create a property and I can wire the event forwarding in a follow-up (needs your measurement ID, which is public-safe).
5. **Social distribution** (traffic won't start from SEO alone in month 1): share each new guide to PH-focused Facebook groups (budol/finds groups), TikTok/Reels product walk-throughs for top deals, Pinterest pins for gift/home lists. Facebook is the highest-leverage channel for PH shopping content.
6. **Refresh `lastChecked` dates** on the 40 rewritten deals whenever you re-verify prices (≤14 days keeps them in "current" freshness so their full reasons and discount badges display).
7. **Affiliate program hygiene:** confirm your Shopee/Involve Asia links still resolve after their next program migration; run `npm run check:links` monthly.

## 30-day action plan toward first sales

**Week 1 (highest impact):** GSC setup + sitemap + request indexing for the 45 priority URLs (action 1). Verify newsletter (action 2). Deploy this branch.
**Week 2:** Publish content-calendar articles #1–2 (9.9 is Sep 1–10 — the single biggest near-term traffic window). Share the 9.9 checklist + worth-buying guides to 3–5 PH Facebook groups; note which drive clicks in Vercel Analytics.
**Week 3:** Write descriptions for 10 more deals (promote them out of noindex) — prioritize whatever `affiliate_click` events show people actually click. Post 2–3 short-form videos (top Temu/Shopee finds) linking to deal pages.
**Week 4:** Review GSC queries + Vercel `affiliate_click` data: double down on the pages earning impressions; refresh `lastChecked` on clicked deals; queue 10.10/payday content from the calendar.
**Measure of success by day 30:** indexed page count rising in GSC, first non-brand impressions/clicks in GSC, `affiliate_click` events trending up week-over-week. Commissions follow clicks; clicks follow indexed pages that answer real queries.

## Verification

- `npm run build` — clean before (baseline) and after all changes; all 169 deal pages and 49 blog pages still generate.
- Built sitemap verified: exactly the 40 indexable deal URLs (noindexed pages excluded) plus all blog/category/store routes including the 5 new guides.
- All test suites green after contract updates (recommendation "exact registry" contracts updated to reflect the new content, per the repo's own convention): seo-helpers + recommendations 66/66; deal-freshness, affiliate-compliance, checkout-comparison, newsletter, adsense 50/50; ESLint clean; `check-product-quality` and `check-affiliate-products` pass (169 published deals validated).
- No environment variables, API keys, or affiliate IDs were modified or exposed. No pages deleted; noindexed pages remain fully browsable.
