# SulitScan SEO Growth Round 2 Design

Date: 2026-07-19
Status: Approved under the user's standing authorization to continue with the recommended approach

## Objective

Improve SulitScan's ability to rank and convert organic shopping traffic by fixing confirmed technical weaknesses, strengthening article-level evidence and metadata, and publishing five distinct commercial guides supported by the current affiliate inventory.

## Approaches considered

### Content only

Fastest to publish, but it leaves the heavy client-side deal listing, generic article Twitter cards, duplicate deal descriptions, and uncrawlable deeper results unchanged.

### Technical only

Improves crawl and performance foundations, but does not expand coverage into the strongest unserved product clusters.

### Balanced technical and content release — selected

Pair a focused `/deals` discovery/performance improvement with metadata/schema corrections and five inventory-backed guides. This addresses both the site's ability to be crawled and its ability to match additional commercial searches.

## Success criteria

- `/deals` renders one server-filtered page of products at a time and exposes stable pagination URLs.
- Unfiltered pagination pages self-canonicalize; arbitrary search/filter combinations are `noindex, follow`.
- Deal cards no longer require Framer Motion and the first visible product images receive priority loading.
- Deal metadata is deterministic, product-specific, and avoids the current duplicate description groups.
- Every article has article-specific Twitter/X metadata and BlogPosting `dateModified` based on `lastReviewed`.
- `/categories/digital-tools` remains accessible but is `noindex, follow` until it has real content.
- Five new guides target distinct intent, use current catalog signals, include primary-source links where claims can change, and avoid unsupported testing/ranking claims.
- Every new guide has a unique local 16:9 banner, descriptive alt text, visible FAQs matching FAQ JSON-LD, and a visible assessment-method section.
- ImportTaxPH is used only in a real overseas-order cost context.
- ApplyReadyCV is linked only from the existing work-from-home guide's remote-job application context and is tracked as a sister-site click.
- All repository checks and production browser tests pass before promotion to `main`.

## Technical design

### Server-driven deal discovery

The `/deals` page will parse promised Next.js search parameters on the server. Supported parameters:

- `q`: product, category, or platform search
- `store`: current partner platform
- `category`: deal category
- `sort`: recommended, discount, score, price ascending, or newest
- `page`: positive integer, clamped to the available page count

Filtering and sorting will move into a deterministic pure helper with tests. The page will render 24 deals and standard links for previous, next, and nearby pages. A GET form will preserve accessible search and filter behavior without shipping all deal records to the browser.

The base page and unfiltered `?page=N` pages are indexable and self-canonical. Any non-default `q`, `store`, `category`, or `sort` combination is `noindex, follow` and canonicalizes to `/deals` to prevent index bloat.

`DealCard` will become a CSS-animated component without Framer Motion. It accepts an image-priority flag so only the first visible cards preload remote images.

### Metadata and schema

- Add a pure deal-metadata helper that shortens long product titles at word boundaries and makes descriptions unique by placing the product name first.
- Generate article Twitter/X title, description, and image from the same post data used for Open Graph.
- Add `dateModified={lastReviewed}` and an editorial-policy author URL to BlogPosting JSON-LD.
- Mark unfinished, non-featured categories with zero active deals as `noindex, follow`.

### Sister-site tracking

Generalize `TrackedSisterSiteLink` so the analytics event explicitly identifies `importtaxph` or `applyreadycv`. The article renderer will recognize both domains while leaving unrelated external links untouched. ImportTaxPH continues to use campaign URLs and estimates-only language. ApplyReadyCV receives campaign parameters and appears only in a new remote-job paragraph in the existing work-from-home guide.

## Content design

All guides use an answer-first introduction, purchase decision framework, common failure modes, practical checklist, “How we assessed this guide” section, relevant deal/category/store links, affiliate disclosure, and FAQs.

### 1. Back-to-School Essentials Under ₱500 Philippines: 2026 Buying Checklist

- Slug: `back-to-school-essentials-under-500-philippines`
- Primary intent: assemble a useful low-cost school setup without spending the whole budget on novelty products.
- Inventory: desk organizers, pen holders, laptop desk, backpack, USB desk fan, lunch items, and other student-adjacent products.
- Sources: current DTI school-supply price guide and current platform details where cited.
- Sister sites: none.

### 2. Cookware Sets Philippines: What to Check Before Buying for a Small Kitchen

- Slug: `cookware-sets-philippines-buying-guide`
- Primary intent: compare materials, set composition, stove compatibility, dimensions, coating care, handles, lids, returns, and final checkout cost.
- Inventory: removable-handle cookware set, pots, pans, bowls, and storage products.
- ImportTaxPH: a single Temu-specific landed-cost callout in the overseas-order section, labeled as an estimate rather than an official assessment.

### 3. Bags Under ₱500 Philippines: Size, Straps, and Seller-Photo Checklist

- Slug: `bags-under-500-philippines-buying-guide`
- Primary intent: select a tote, crossbody, backpack, wallet, or small travel bag based on measurements and construction rather than listing photos alone.
- Inventory: the site's largest unserved Fashion subcluster, with more than twenty relevant active products.
- Sister sites: none.

### 4. Carry-On Luggage Philippines: Size, Weight, and Online-Buying Checklist

- Slug: `carry-on-luggage-philippines-buying-guide`
- Primary intent: compare external dimensions, empty weight, wheel/handle construction, packing needs, and current airline limits.
- Inventory: 20-inch luggage, duffels, backpacks, toiletry bags, pouches, belt bags, and reusable bottles.
- Sources: official airline baggage pages. The guide must state that a “20-inch” label does not guarantee acceptance by every airline.
- Sister sites: none.

### 5. Makeup Brush Sets Philippines: Beginner Guide to Sets vs Individual Brushes

- Slug: `makeup-brush-sets-philippines-beginner-guide`
- Primary intent: choose a useful starter set, understand brush roles, compare fibers and ferrules, avoid redundant pieces, and clean tools safely.
- Inventory: Sephora PH brushes and cleaners plus budget marketplace tools.
- Sources: authorized retailer details and dermatology hygiene guidance where used.
- Sister sites: none.

## Banner design

Generate five original landscape editorial images with the built-in image generation tool. Save optimized JPEG assets under `public/images/guides/` using each article slug.

Shared constraints:

- 16:9 composition suitable for article hero and social preview
- realistic, brand-neutral products
- no people, marketplace logos, trademarks, packaging, text, prices, or watermarks
- clear subject separation, natural lighting, and visual consistency with the existing guide library
- inspect each asset for malformed objects and misleading details before use

## Evidence and authorship

The site will not invent personal expertise or claim that products were physically tested. New guides retain the SulitScan Team byline, link to the editorial policy, state what catalog and primary-source evidence was checked, and show an accurate last-reviewed date. Named-author pages are deferred until the owner provides real author identities and qualifications.

## Error handling

- Invalid deal-listing parameters fall back to documented defaults.
- Page values are clamped so empty out-of-range pages do not become soft 404s.
- If a recommendation signal has no eligible product, the existing related-deal module omits the section rather than returning irrelevant inventory.
- Analytics failures never block sister-site or affiliate navigation.
- Generated images are not referenced until their files exist and pass the asset guard.

## Validation

- Unit tests cover deal filtering, sorting, page normalization, metadata uniqueness/length, and sister-site destination handling.
- Playwright covers deal pagination, query preservation, index/noindex metadata, article Twitter cards, dateModified JSON-LD, five new article routes, banners, FAQs, related deals, ImportTaxPH, ApplyReadyCV, and unfinished-category robots behavior.
- Existing link, affiliate, product-quality, lint, TypeScript, production-build, and complete browser suites remain green.
- Inspect all five banners and representative desktop/mobile pages before release.
- Re-run a targeted live audit after Vercel deploy and verify local `main` matches `origin/main`.

## Out of scope

- Inventing author identities or credentials.
- Product/Offer schema while affiliate prices and availability are not reliably synchronized.
- A site-wide CSP rollout without a dedicated compatibility pass.
- Forcing ApplyReadyCV into unrelated product guides.
- Changing the Vercel `www` redirect from application code; this is a domain-setting task.
