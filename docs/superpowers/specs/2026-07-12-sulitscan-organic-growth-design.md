# SulitScan Organic Growth and Affiliate Conversion Design

Date: 2026-07-12
Status: Approved for planning

## Objective

Increase qualified organic visits to SulitScan and improve the percentage of those visitors who reach relevant affiliate offers. The work will strengthen existing search coverage, add four distinct commercial-intent guides, improve internal discovery, measure outbound clicks, and link to ImportTaxPH when cross-border costs are genuinely relevant.

## Success Criteria

- Four new, indexable guides target distinct shopping intents supported by SulitScan's current deal inventory.
- Every new guide has a unique, locally hosted 16:9 raster banner with descriptive alternative text.
- Each guide links readers to relevant SulitScan categories, stores, guides, and deal cards.
- ImportTaxPH links appear only in Temu or overseas-order contexts and identify it as a free sister tool that provides estimates, not official customs assessments.
- The two overlapping Shopee seller-legitimacy articles become one stronger canonical article with a permanent redirect from the retired URL.
- Blog discovery is improved by newest-first ordering and relevance-based related content.
- Affiliate and sister-site outbound clicks are recorded as Vercel Analytics custom events without collecting personal information.
- The sitemap reports meaningful article modification dates instead of assigning the build time to every article.
- The complete repository validation suite and browser smoke tests pass before the final push to `main`.

## Non-Goals

- Adding new affiliate partners or marketplaces.
- Claiming SulitScan physically tested products when it did not.
- Publishing coupon codes, shipping promises, or live prices that cannot be maintained accurately.
- Automating Google Search Console actions without account access.
- Redesigning the entire site or replacing the existing content model.

## Selected Approach

Use a balanced content, SEO, conversion, and measurement upgrade. A content-only sprint would leave keyword cannibalization and weak conversion paths unresolved. A larger marketplace expansion would introduce maintenance work without matching affiliate inventory. The selected scope concentrates authority around the three current catalog partners: Shopee PH, Temu, and Sephora PH.

## New Content

All four guides will use the existing `BlogPost` data model, article renderer, metadata generation, BlogPosting schema, FAQ schema, sitemap generation, and newsletter/deal modules.

### 1. Best Home Organization Finds Under ₱500 Philippines

- Primary intent: shoppers comparing inexpensive organizers and practical home products.
- Commercial destinations: `/categories/home-finds`, `/categories/under-500`, Shopee PH, and Temu deal pages.
- Editorial angle: useful product categories, measurements, material checks, seller reviews, shipping, and what to skip.
- ImportTaxPH: include the Temu calculator only in the cross-border cost section.

### 2. Best Gifts Under ₱500 Philippines: Practical Ideas for Every Occasion

- Primary intent: birthday, exchange-gift, thank-you, and small-celebration shopping within a fixed budget.
- Commercial destinations: `/categories/gift-ideas`, `/categories/under-500`, and relevant deal pages.
- Editorial angle: choosing by recipient, total checkout cost, delivery timing, presentation, and avoiding low-quality novelty purchases.
- ImportTaxPH: omit unless an overseas-order subsection is necessary; local and time-sensitive gifting should not be interrupted by an unrelated calculator link.

### 3. Best Work-From-Home Desk Accessories Under ₱1,000 Philippines

- Primary intent: shoppers improving a work or study setup on a budget.
- Commercial destinations: `/categories/tech-deals`, `/categories/home-finds`, `/categories/under-1000`, Shopee PH, and Temu deal pages.
- Editorial angle: stands, organizers, lighting, cable management, ergonomic measurements, electrical-product caution, and compatibility.
- ImportTaxPH: include the Temu calculator where an overseas listing could change the final landed cost.

### 4. Best Beauty Finds Under ₱500 Philippines: What to Check Before Buying

- Primary intent: budget beauty shoppers comparing low-cost skincare, makeup, tools, and travel sizes.
- Commercial destinations: `/categories/beauty`, `/categories/under-500`, Shopee PH, Sephora PH, and relevant deal pages.
- Editorial angle: authenticity signals, ingredients, shades, expiry information, patch testing, seller type, and return restrictions.
- ImportTaxPH: include only if the guide discusses an international Temu listing; it must not distract from local or Sephora PH purchases.

Each guide will include a concise answer near the introduction, a scannable buying checklist, category-specific risks, relevant internal links, a transparent affiliate disclosure, and visible FAQs that match the structured data.

## Banner Images

- Generate one original 16:9 shopping-editorial banner per guide.
- Store optimized JPEG files under `public/images/guides/` using the article slug.
- Avoid marketplace logos, trademarks, price claims, text overlays, and recognizable branded product packaging.
- Use descriptive alt text based on the depicted objects and shopping intent.
- Confirm dimensions, visual quality, and file size before committing.

## Content Consolidation

The canonical Shopee seller guide will be:

`/blog/how-to-check-shopee-seller-legit-philippines`

The retired URL will permanently redirect to it:

`/blog/how-to-check-if-shopee-seller-is-legit`

The canonical article will retain the best unique sections and FAQs from both versions, use the original 2026-06-28 publication date, and use 2026-07-12 as the review date. The retired post will be removed from the content array and sitemap so search engines receive one clear ranking target.

## Internal Discovery and Affiliate Flow

### Blog index

- Sort guides by publication date descending so new work is visible immediately.
- Keep the existing grid and newsletter placement to avoid unnecessary interface changes.

### Related guides

- Replace the current first-three fallback with a deterministic relevance score.
- Score shared tags first, then shared category, with recency as a tie-breaker.
- Exclude the current article and return at most three unique guides.

### Related deals

- Match article topics to deal category, store, budget, and product tags.
- Prefer products satisfying more than one signal, such as both `home-finds` and `under-500`.
- Continue filtering suspicious discount claims and limiting the module to three deal cards.
- Keep price-confirmation reminders immediately beside affiliate calls to action.

## ImportTaxPH Integration

- Use the platform-specific URL `https://importtaxph.com/temu-import-tax` for Temu-focused sections.
- Use `https://importtaxph.com/` only for general cross-border comparisons.
- Add campaign parameters identifying SulitScan, the article slug, and the placement so referral traffic can be measured on ImportTaxPH.
- Continue labeling ImportTaxPH as a free sister tool and an estimate for planning purposes only.
- Update the shared import-tax callout to accept article/placement context rather than duplicating tracking-link logic in article copy.

## Analytics

The outbound affiliate component will become the single tracked path for affiliate buttons where practical. It will send a Vercel Analytics event before normal navigation. Existing browser behavior remains unchanged: links open in a new tab and retain `sponsored`, `nofollow`, `noopener`, and `noreferrer` attributes.

Events:

- `affiliate_click`: platform, placement, and source page slug.
- `sister_site_click`: destination (`importtaxph`), placement, and source page slug.

No email address, query text, full URL, product title, or other personal data will be included in event properties. Raw affiliate anchors touched by this scope will be migrated to the shared component so the event coverage is consistent.

## Technical SEO

- Preserve unique titles, descriptions, self-referencing canonicals, Open Graph article metadata, and existing BlogPosting and FAQ schema.
- Add the new article URLs through the existing data-driven sitemap.
- Use `lastReviewed` for each article's sitemap `lastModified` value.
- Use the newest article review date for the blog-index sitemap entry.
- Do not assign the current build time to stable legal and informational pages when no meaningful modification date exists.
- Keep robots.txt open to public pages and continue blocking API endpoints.

## Post-Publishing Distribution

Add a short repository checklist documenting the manual actions that remain after deployment:

1. Confirm the deployment and each new URL returns HTTP 200.
2. Submit or refresh `https://sulitscan.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
3. Request indexing for the four new canonical URLs and the consolidated Shopee article.
4. Verify the old Shopee URL returns a permanent redirect to the canonical article.
5. Track impressions, clicks, average position, article-to-deal clicks, and affiliate-click events weekly.
6. Share useful article summaries in relevant communities without link-only promotion or unsupported claims.

## Error Handling and Fallbacks

- Posts without a generated banner continue to use the existing default image, although every new post must pass an asset-existence check before release.
- Related-content helpers return an empty list rather than failing rendering when no relevant match exists.
- Analytics failures never prevent outbound navigation.
- ImportTaxPH remains a normal external link if analytics is unavailable.
- The permanent redirect remains independent of article rendering so the retired URL cannot produce a soft 404.

## Validation

- Run lint and TypeScript checks.
- Run internal-link, affiliate-product, and product-quality checks.
- Build the production application using the repository's installed Next.js version.
- Run Playwright smoke tests against the production build or the test configuration's expected server.
- Confirm all four banners render with correct alt text and stable dimensions.
- Confirm new articles appear newest-first, related guides are relevant, and related deals match their article intent.
- Confirm affiliate and ImportTaxPH links preserve disclosure and security attributes.
- Confirm the duplicate Shopee URL redirects permanently and is absent from the sitemap.
- Review the final diff for unrelated changes before committing and pushing to `main`.

## Delivery

The design specification is committed separately before implementation. After the user reviews this written specification, a detailed implementation plan will be created. Implementation will then be verified, committed, and pushed directly to `main` as requested.
