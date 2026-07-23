# SulitScan Weekly Growth Release Design

**Date:** 2026-07-23  
**Status:** Selected under the user's standing authorization to proceed with the recommended approach and push verified work to `main`.

## Goal

Improve SulitScan's search visibility, affiliate-conversion path, and trustworthiness by fixing confirmed crawl/compliance defects, adding one useful comparison tool, and publishing five non-duplicate shopping guides with original banners.

## Evidence Summary

- The clean baseline contains 169 active deals, 24 guides, 8 featured category hubs, and 3 active store hubs.
- Direct routes currently expose inactive demo deals that listings intentionally hide. This includes an old SHEIN demo URL, so public deal lookup must use the same active-offer eligibility rule as every listing.
- Category and store pages render only their first 24 deals in server HTML, with the remainder behind client-side “Load more” controls. Deeper inventory therefore lacks crawlable page URLs.
- `npm audit --omit=dev` identifies a non-breaking Next.js security patch at 16.2.11 for the current 16.2.7 installation.
- Competitors such as PriceMe emphasize comparison utility; iPrice, ShopBack, and Saleduck emphasize structured terms and discovery paths. SulitScan should not claim live price comparison or verified coupons without matching data. A user-entered final-checkout comparison is a truthful alternative.
- Existing content is already strong in broad Temu, Sephora, generic safety, voucher, checkout-price, import-tax, and under-₱500 topics. The new guides must use narrower, catalog-supported search intents.

## Considered Approaches

### A. Content-only sprint

Publish five guides and banners without changing product behavior.

**Trade-off:** Fastest, but leaves indexable demo offers, SHEIN exposure, and uncrawlable category/store inventory unresolved.

### B. Technical-only cleanup

Fix deal eligibility, pagination, sharing metadata, and dependencies.

**Trade-off:** Strong foundation, but does not meet the user's explicit request for at least five new articles this week.

### C. Balanced growth release — selected

Fix the confirmed defects, add an honest comparison tool, and publish five tightly scoped guides with banners and internal links.

**Why selected:** It meets the content requirement without trading away compliance or crawlability, and it adds a link-worthy utility competitors demonstrate users value.

## Release Scope

### 1. Public deal eligibility

- A deal detail route may render only an active, published deal with a valid current partner relationship.
- Hidden, inactive, demo, or blocked-offer slugs must return the existing 404 experience and must not emit indexable metadata.
- Regression coverage must include `summer-dress-shein` and another inactive/demo slug.
- Sitemap and recommendations must remain limited to active deals.

### 2. Crawlable category and store pagination

- Category and store detail pages will use server-side URL pagination with 24 deals per page.
- Page 1 keeps the clean canonical URL; page 2+ self-canonicalizes with `?page=N` and receives a page-specific title.
- Invalid page values clamp safely. Empty or out-of-range states must not create broken pages.
- Visible previous/next and numbered page links must work without JavaScript.
- Client-only “Load more” controls will be removed from these two entity pages.
- Sitemap will include valid category/store page 2+ URLs so deeper active inventory is discoverable.

### 3. Entity social metadata

- Deal, category, and store pages will have page-specific Open Graph and Twitter title, description, URL, and image values.
- Existing static imagery may be used when a deal has no safe share image.
- Metadata must not inherit the homepage Twitter title.

### 4. Final checkout comparison tool

- Publish at `/tools/checkout-comparison` with the primary intent “online shopping final price comparison calculator Philippines.”
- Compare two offers using user-entered item price, quantity, shipping, voucher amount, payment discount, other fees, and possible import cost.
- Calculate final total and per-unit total locally; negative monetary inputs clamp to zero and quantity normalizes to at least one.
- Show the lower final total and difference only when both offers contain usable values. Never call an offer the market's “lowest price.”
- Explain that users must copy actual checkout amounts and confirm store terms.
- Link contextually to ImportTaxPH for cross-border import-cost estimation. Do not add an unrelated ApplyReadyCV link.
- Track a privacy-safe completion event without recording entered prices or labels.
- Link the tool from site navigation, the homepage, and relevant existing checkout/import guides.

### 5. Five guides for the week

All posts publish on 2026-07-23, include a unique cover image and alt text, contain clear first-paragraph intent, practical checklists, internal links, transparent affiliate language, and only supported claims.

1. `online-shoe-size-guide-philippines`
   - **Title:** Online Shoe Size Guide Philippines: How to Measure Before You Buy
   - Covers foot length/width, both feet, chart matching, shoe-type fit, buyer photos, and returns.
   - Uses current fashion/shoe deal tags.

2. `unboxing-video-evidence-online-shopping-philippines`
   - **Title:** How to Record Unboxing Evidence for Online Orders in the Philippines
   - Covers optional evidence capture, parcel condition, one-take sequence, defect photos, claims, storage, and privacy.
   - Must not claim an unboxing video is legally or universally required; platform rules control.

3. `travel-packing-organizers-philippines-buying-guide`
   - **Title:** Travel Packing Organizers Philippines: What to Check Before Buying Online
   - Covers organizer types, measured capacity, zippers/lining/hooks, water-resistance claims, buyer photos, and delivery timing.
   - Uses current Travel/Shopee PH deal eligibility.

4. `first-apartment-essentials-under-1000-philippines`
   - **Title:** First Apartment Essentials Under ₱1,000 Philippines: Buy the Practical Basics First
   - Covers must-have prioritization, space measurements, kitchen/storage/cleaning/lighting, and a staged budget.
   - Uses current Home and under-₱1,000 catalog signals.

5. `power-bank-buying-guide-philippines`
   - **Title:** Power Bank Buying Guide Philippines: Capacity, Fast Charging, and Airline Rules
   - Covers realistic usable capacity, ports/protocols, device compatibility, seller/warranty evidence, warning signs, and travel handling.
   - Airline content must cite current IATA guidance, tell readers to confirm their carrier's current rules, and avoid presenting a marketplace listing as safety certification.

### 6. Original guide banners

- Generate five brand-neutral 16:9 raster banners, one per new guide.
- No third-party logos, trademarked interfaces, fake ratings, fake prices, or text that must be read to understand the image.
- Save final project assets under `public/images/guides/` using each post slug as the filename stem.
- Inspect every final image for subject accuracy, visual defects, accidental marks/text, and suitable crop behavior before use.

### 7. Dependency and framework cleanup

- Upgrade `next` and `eslint-config-next` together from 16.2.7 to 16.2.11.
- Replace deprecated Next.js 16 `Image` `priority` props with the documented `preload` prop where the image is intentionally above the fold.
- Do not broaden dependencies or perform unrelated framework refactors.

### 8. Audit and release documentation

- Add a dated full SEO/competitor audit with evidence, implemented changes, deferred actions, weekly measurements, and exact indexing-request URLs.
- Document the permanent `www` 301/308 redirect as an external Vercel-domain action if it cannot be changed in repository code.
- Do not recommend removing a previously submitted sitemap; refresh the existing sitemap submission after deployment.

## Quality and Safety Constraints

- Do not publish or link SHEIN anywhere in public promotional content while offer access is blocked.
- Do not invent coupons, live prices, stock, usage totals, reviews, testing, or “best/lowest price” claims.
- Keep sister-site links contextual: ImportTaxPH only for landed-cost tasks; ApplyReadyCV remains limited to genuine job/CV context already present elsewhere.
- Preserve the existing affiliate, sponsored-link, analytics-failure, and recommendation safeguards.
- Follow the current Next.js 16.2 docs in `node_modules/next/dist/docs/` for metadata, dynamic params, sitemaps, and images.
- All new behavior follows test-first red/green/refactor. Content/data guards may be extended before adding the posts they validate.

## Verification

- Fresh `npm audit --omit=dev` with no known production vulnerabilities.
- Full `npm run check` succeeds.
- Full Playwright suite succeeds against the production build.
- Browser checks cover inactive demo 404s, category/store page 2 links, calculator behavior, five new routes, images, canonical/robots tags, and JSON-LD.
- Desktop and mobile visual inspection covers the calculator, pagination, blog index, and all five guide heroes.
- Final independent review reports both spec compliance and code quality approval before promotion to `main`.

