# SulitScan October Growth and Freshness Recovery Design

## Outcome

Publish an October growth release that remains truthful while the product catalog is being refreshed, gives visitors useful paths to current buyer guides and active affiliate stores, fixes indexability drift, and adds five source-backed guides with original banners. The release must improve discovery and conversion without changing any deal verification date, inventing availability, or implying hands-on testing.

## Confirmed audit evidence

- `main` and `origin/main` were synchronized at `b03f646748fb911256cf83bd47211613592a8916` before this work began.
- The repository contains 169 public deal records, but every record is now older than the 90-day reference window. On 2026-10-03, `getActiveDeals()` correctly returns zero.
- The live homepage and `/deals` expose a zero-inventory dead end. `/deals` says that no deals match the visitor's filters even when no filter is active, then offers a meaningless “Clear all filters” action.
- The live sitemap contains 157 URLs, including 84 pages that emit `noindex` and 33 URLs whose canonical points elsewhere. It is being served from an old cache even though time-based deal expiry has changed the eligible route set.
- Category and store detail pages correctly emit `noindex` when they have zero current listings, but the sitemap currently emits their first page unconditionally and also manufactures a first pagination page through `Math.max(1, ...)`.
- Blog detail pages are statically generated and have no revalidation setting. This can preserve related deal cards beyond their expiry boundary until a deployment.
- The home scanner is a client component that imports the complete catalog. The production homepage currently transfers about 1 MB of uncompressed JavaScript, and a roughly 274 KB chunk contains catalog/demo data.
- The contact endpoint can return success when Resend returns an `{ error }` result, and non-string JSON fields can throw before the guarded send block.
- The Node suite has 21 failures caused by real-clock assumptions after the catalog crossed its expiry boundary. Lint and TypeScript checks pass. Production expiry behavior is correct and must not be weakened to make the tests pass.
- The blog has 59 guides in one chronological grid with no search or topic filter. Competitor research found stronger search/category discovery and earlier decision support, while SulitScan already has clearer source attribution, review dates, correction paths, and desk-research limitations than the sampled competitors.

## Product principles

1. **Freshness before inventory count.** Never advance `lastChecked`, show an expired record as active, or preserve price-bearing recommendations merely to make the site look full.
2. **Useful zero state.** When no verified listings are active, explain that the catalog is being refreshed and route visitors to decision guides, the checkout comparison tool, and store-level affiliate destinations that remain valid.
3. **Index only what the page itself declares indexable.** A sitemap URL must be self-canonical and indexable under the same catalog state used to generate the sitemap.
4. **Research, not fake testing.** Articles may summarize official sources and model-specific specifications, but SulitScan must not claim to have bought, used, measured, authenticated, or tested a product.
5. **Contextual sister-site links only.** ImportTaxPH belongs only in a substantive cross-border cost section. ApplyReadyCV belongs only in the phone-tripod guide's online-interview use case. Neither link may promise an outcome.

## Scope

### 1. Deterministic freshness and sitemap correctness

Make the current time an optional dependency of catalog selector functions while retaining `new Date()` as the production default. Tests must use an explicit fixed instant before the June records expire when they need nonempty fixtures, and an explicit 2026-10-03 instant when they verify the real empty-catalog state.

Build the sitemap from one captured `now` value and only include:

- the permanent, indexable static routes;
- active and editorially indexable deal detail routes;
- canonical pagination URLs whose page contains active records;
- category and store detail routes only when the corresponding metadata policy would mark them indexable;
- all published blog routes.

Set the sitemap metadata route to `dynamic = "force-dynamic"`. Current Next.js 16.3.4 documentation confirms that metadata routes are cached by default unless they use a request-time API or dynamic configuration. A request-time sitemap is required because deal eligibility changes as the clock advances even without a deployment.

With the present zero-active-deal catalog and the five new posts, the expected sitemap is 78 URLs: 14 permanent routes and 64 blog routes. No expired deal, zero-result entity page, query string, duplicate canonical, or pagination placeholder may appear.

### 2. Useful zero-inventory experience and smaller client payload

Add a shared zero-catalog presentation that clearly says verified listings are being refreshed and that visitors should confirm live prices and terms at the partner store. It must offer useful choices rather than a retry loop:

- browse current buyer guides;
- compare a cart with the checkout comparison tool;
- choose among Temu, Shopee PH, and Sephora PH store pages;
- join the existing newsletter where that placement already makes sense.

Use the shared treatment on the homepage and unfiltered `/deals`. A genuinely filtered no-result view should keep filter-specific wording and a clear reset action. Category and store empty states must link to their relevant guide content; store pages may retain the existing disclosed store-level affiliate action.

Blog detail pages must revalidate daily so time-dependent related deals disappear without waiting for a new deployment.

Move scanner deal selection to the server. `DealScannerVisual` must receive a small, serializable slide array and must not import `@/data/deals`. When there are no active deal slides, it should render a guide/checklist-oriented scanner sequence rather than old product data. No full catalog may be shipped through the scanner client chunk.

### 3. Contact endpoint reliability

Validate that the JSON body is a plain object and that `name`, `email`, `message`, and optional `subject` are strings before trimming. Apply conservative field length limits and return a stable 4xx response for malformed or excessive input. Escape every user-controlled field included in HTML or the email subject.

Treat both a thrown Resend exception and a resolved Resend `{ error }` result as a send failure. Return success only when the provider result has no error. Tests must mock the provider; verification must not send a real email.

### 4. October and November seasonal discovery

Replace the single expired 9.9 campaign constant with an ordered, data-driven campaign list. Campaigns use exact Philippine-time windows encoded as UTC instants:

| Campaign | Start, inclusive | End, inclusive | Guide | Announcement |
|---|---|---|---|---|
| 10.10 | `2026-10-02T16:00:00.000Z` | `2026-10-10T15:59:59.999Z` | `/blog/10-10-sale-philippines-guide` | `10.10 checkout guide: compare the final total →` |
| 11.11 | `2026-10-24T16:00:00.000Z` | `2026-11-11T15:59:59.999Z` | `/blog/11-11-sale-philippines-cart-building-checklist` | `11.11 cart checklist: set your baseline first →` |

During a campaign, the header and homepage guide row promote the matching guide. Outside either window they preserve the generic announcement and normal newest-first guide order. Boundary, overlap, missing-guide, invalid-date, and count-clamping behavior must remain pure and deterministic.

### 5. Searchable blog guide explorer

Add a server-rendered GET search and category filter to `/blog` using the Next.js 16 asynchronous `searchParams` page interface. The filter helper must:

- normalize a scalar or repeated `q` and `category` value;
- trim and collapse whitespace, cap the query at 80 characters, and compare case-insensitively;
- search title, excerpt, category, and tags;
- accept only categories present in the post registry;
- preserve newest-first ordering;
- provide an explicit no-result state and a reset link.

The unfiltered `/blog` remains indexable and self-canonical. Any query/filter result must canonicalize to `/blog` and emit `noindex,follow` so search combinations do not create index bloat. ItemList structured data must describe only the visible results. The experience should work without client JavaScript.

### 6. Five October 3 buyer guides

Publish these exact posts as `post-060` through `post-064`, all with `publishedAt` and `lastReviewed` set to `2026-10-03`:

| ID | Slug | Title | Category | Read time | Sister-site context |
|---|---|---|---|---:|---|
| `post-060` | `food-storage-containers-buying-guide-philippines` | `Food Storage Containers Philippines: Glass, Plastic or Stainless?` | Home Guides | 12 | ImportTaxPH only in a substantive cross-border landed-cost section |
| `post-061` | `sephora-ph-minis-vs-full-size-value-sets` | `Sephora PH Minis vs Full Size: Are Beauty Sets Worth It?` | Beauty Guides | 11 | None |
| `post-062` | `mattress-protector-buying-guide-philippines` | `Mattress Protector Buying Guide PH: Size, Depth and Water Resistance` | Home Guides | 11 | None |
| `post-063` | `phone-tripod-buying-guide-philippines` | `Phone Tripod Buying Guide Philippines: Fit, Stability and Video Calls` | Tech Guides | 11 | ApplyReadyCV only in an online-interview preparation paragraph |
| `post-064` | `christmas-lights-buying-guide-philippines` | `Christmas Lights Buying Guide PH: Plug-In, Solar or Battery?` | Home Guides | 12 | None |

Every post must:

- answer the main query in the opening paragraph;
- include `## How we assessed this guide`, at least five additional useful H2 sections, `## Limitations and live-policy check`, and `## Affiliate disclosure`;
- contain at least three contextual internal links, exactly six useful tags, a recommendation intent, and three concise visible FAQs;
- link to current store/category/tool pages without asserting that SulitScan has an active matching product;
- distinguish general or foreign safety guidance from Philippine requirements;
- avoid fixed prices, guaranteed discounts, “FDA-approved” shorthand, universal certification claims, and unverified durability, safety, fit, waterproofing, or performance claims;
- never claim hands-on testing or imply that an affiliate relationship influenced the assessment.

Specific safeguards:

- Food containers: identify FDA and USDA material as United States guidance; do not present it as Philippine certification. Explain that imported checkout totals can differ, then link naturally to ImportTaxPH.
- Beauty sets: use the exact current Sephora PH set/size presentation and United States FDA cosmetic shelf-life guidance only for the proposition each source supports. Do not use an unavailable or blank-image product as evidence.
- Mattress protectors: separate protector type, exact mattress depth, attachment, wash care, and model-specific waterproof claims. Do not generalize one Uratex or IKEA specification to all protectors.
- Phone tripods: separate clamp range, load/stability, orientation, desk height, and device compatibility. The ApplyReadyCV link may help a reader prepare application materials before an online interview, but cannot promise hiring or interview success.
- Christmas lights: describe the current DTI-BPS regulated-product scope precisely. Explicitly state that listed exclusions do not mean an item is safe and do not justify calling every solar, battery, outdoor, rope, or adapter-powered set PS/ICC-covered.

### 7. Five original editorial banners

Create one distinct banner per guide in `public/images/guides/`. Each final asset must be a visually inspected 1600×900 progressive JPEG with no readable text, logo, trademark, price, product claim, or watermark. Use a coherent flat editorial style while giving each guide a distinct color palette and object composition.

Record the generation prompt summary, dimensions, format, alternative text, and SHA-256 in `public/images/guides/README.md`. The article registry and tests must use the recorded paths and alt text. Do not use remote hotlinked art.

### 8. Audit record and content calendar

Create `docs/seo-audit-2026-10-03.md` with the measured findings, the changes made, remaining owner-dependent work, and a recommended publishing cadence. Update `content-calendar.md` with the five October posts and the next research queue.

The recommended sustainable cadence is five high-quality guides per week only when each can be source-backed and internally linked. Publishing more thin or repetitive posts is explicitly not recommended. Future priorities should come from Search Console query/impression data, not fabricated keyword-volume claims.

## Primary source set

- United States FDA, microwave and food-container guidance: `https://www.fda.gov/consumers/consumer-updates/5-tips-using-your-microwave-oven-safely`
- United States USDA, leftovers and food safety: `https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety`
- Sephora Philippines skincare/value sets: `https://www.sephora.ph/categories/skincare/skincare-sets`
- United States FDA, cosmetic shelf life: `https://www.fda.gov/cosmetics/cosmetics-labeling-claims/shelf-life-and-expiration-dating-cosmetics`
- Uratex mattress protector product information: `https://uratex.com.ph/products/premium-mattress-protector`
- IKEA mattress protector product information: use the exact current model page cited in the article and attribute specifications only to that model.
- Manfrotto smartphone clamp specifications: `https://www.manfrotto.com/global/pixi-clamp-for-smartphone-mcpixi/`
- Apple Continuity Camera mounting guidance: `https://support.apple.com/en-ph/102546`
- Zoom physical setup guidance may be used only where the cited document directly supports camera placement or framing.
- DTI-BPS regulated products: `https://bps.dti.gov.ph/product-certification/list-of-products-under-mandatory-certification`
- DTI-BPS holiday-light safety reminder: identify its 2021 publication date and use it as historical safety guidance, not a statement of a 2026 campaign.
- IKEA light-set instructions: cite only exact model features and limitations.

All URLs must be rechecked while authoring. If a source has moved, use the current official equivalent and record it in the post contract test.

## Out of scope

- No fabricated or bulk-updated deal verification dates, prices, discounts, inventory, reviews, or advertiser status.
- No new product-level affiliate deal unless it is independently verified through the current feed or partner page.
- No AdSense/ad-network activation, publisher ID, CMP configuration, Payhip/Xendit account, DTI/BIR status, or legal-registration claim.
- No changes to affiliate relationships or tracking destinations beyond using existing disclosed store links.
- No named human author or first-person testing claim.
- No speculative backlink buying, automated directory spam, or fake traffic.
- No browser checklist/local-storage tool in this release; it remains a future differentiated feature after the freshness and discovery foundations are stable.

## Verification

- Observe focused test failures before behavior changes, then pass them with fixed-time inputs.
- Verify both a populated historical catalog and the actual empty catalog state.
- Validate sitemap count, uniqueness, self-canonical/indexability contract, and absence of expired/entity-placeholder/query URLs.
- Verify malformed contact bodies and simulated Resend failures without sending mail.
- Validate seasonal campaign boundaries and blog filter normalization/metadata.
- Validate each article contract, source URL, internal link, sister-site placement, FAQ, and recommendation intent.
- Inspect all five final banners and verify dimensions, progressive JPEG encoding, hashes, and uniqueness.
- Run `npm audit --audit-level=high`, `npm run check`, and `npx playwright test --workers=1`.
- Run a whole-branch review before promotion.
- After pushing `main`, verify the deployed homepage, blog explorer, all five posts and images, canonicals/robots/schema, sitemap membership, zero-catalog messaging, and 10.10 promotion.
