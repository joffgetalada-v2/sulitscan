# SulitScan SEO Growth Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve organic discovery and commercial relevance by adding crawlable server-side deal pagination, correcting metadata/schema gaps, integrating two sister sites only in useful contexts, and publishing five inventory-backed guides with original banners.

**Architecture:** Keep the existing Next.js 16 App Router and data-driven post/deal models. Move `/deals` filtering and pagination into a pure server helper, render only the current page, and preserve external click tracking through small client link islands. Add pure metadata helpers and extend the existing article/JSON-LD pipeline rather than adding a CMS or new dependency.

**Tech Stack:** Next.js 16.2.7 App Router, React 19.2.4 Server Components, TypeScript 5, Tailwind CSS 4, Node test runner, Playwright 1.60, Vercel Analytics, Next Image, built-in AI image generation.

## Global Constraints

- Read the relevant files under `node_modules/next/dist/docs/` before changing Next.js code; this repository explicitly warns that its Next.js version has breaking changes.
- `params` and `searchParams` are promises in the installed Next.js version and must be awaited.
- Next.js 16 deprecates the Image `priority` prop; use `loading="eager"` and `fetchPriority="high"` only for the first visible listing images.
- Do not claim that SulitScan physically tested a product or invent author identities, qualifications, statistics, reviews, or prices.
- Do not publish unverifiable coupon codes, live-price promises, shipping promises, medical claims, authenticity guarantees, or fixed airline rules without a current primary-source link.
- Every new guide needs a unique, locally hosted 16:9 raster banner with descriptive alt text and no marketplace logo, trademark, text, price, watermark, or recognizable branded packaging.
- ImportTaxPH links must be useful in context, identify it as a free sister tool, and state that results are estimates rather than official customs assessments.
- ApplyReadyCV may appear only in the existing work-from-home guide's remote-job application context; do not place it in unrelated shopping guides.
- Analytics events must not include email addresses, search queries, product titles, full destination URLs, or other personal data.
- Affiliate and sister-site navigation must still work if analytics fails.
- Preserve `target="_blank"` and the existing affiliate/sister-site security and disclosure attributes.
- Filtered/search result pages are `noindex, follow`; unfiltered numbered `/deals?page=N` pages self-canonicalize.
- Use primary sources for time-sensitive facts and show `lastReviewed: "2026-07-19"` on all new or materially updated guides.
- Use PowerShell syntax in commands and do not use `&&`.
- Commit each reviewed task; push only after the complete verification gate passes.

---

### Task 1: Correct Deal Metadata, Article Sharing Metadata, Schema Freshness, and Thin-Category Indexation

**Files:**
- Create: `src/lib/deal-seo.ts`
- Create: `tests/seo-helpers.node.mjs`
- Modify: `src/app/deals/[slug]/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/categories/[slug]/page.tsx`
- Modify: `src/components/SeoJsonLd.tsx`
- Modify: `package.json`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `buildDealSeoTitle(deal: Deal): string` returning at most 65 characters including `SulitScan PH`.
- Produces: `buildDealSeoDescription(deal: Deal): string` returning product-specific text at most 160 characters.
- Extends: `BlogPostingJsonLd` with required `dateModified: string`.

- [ ] **Step 1: Add failing metadata helper tests**

Create `tests/seo-helpers.node.mjs` using the TypeScript transpile loader pattern already present in `tests/recommendations.node.mjs`. Load `src/data/deals.ts` and the new `src/lib/deal-seo.ts`. The tests must assert:

```js
test("deal SEO titles are unique and no longer than 65 characters", () => {
  const titles = dealsModule.getActiveDeals().map(seoModule.buildDealSeoTitle)
  assert.equal(new Set(titles).size, titles.length)
  assert.ok(titles.every((title) => title.length <= 65))
  assert.ok(titles.every((title) => title.endsWith("| SulitScan PH")))
})

test("deal SEO descriptions are unique product-specific snippets", () => {
  const active = dealsModule.getActiveDeals()
  const descriptions = active.map(seoModule.buildDealSeoDescription)
  assert.equal(new Set(descriptions).size, descriptions.length)
  assert.ok(descriptions.every((description) => description.length <= 160))
  assert.ok(active.every((deal, index) =>
    descriptions[index].toLowerCase().includes(deal.title.split(/\s+/)[0].toLowerCase())
  ))
})
```

- [ ] **Step 2: Add failing rendered metadata/schema tests**

Append Playwright tests that verify:

```ts
test("article uses article-specific Twitter metadata and dateModified", async ({ page }) => {
  await page.goto("/blog/best-shopee-finds-under-500-philippines")
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", /Shopee/i)
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /best-shopee-finds-under-500-philippines/i)
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
  const article = jsonLd.map((value) => JSON.parse(value)).find((value) => value["@type"] === "BlogPosting")
  expect(article.dateModified).toBe("2026-07-12")
  expect(article.author.url).toContain("/editorial-policy")
})

test("unfinished digital tools category is noindex", async ({ page }) => {
  await page.goto("/categories/digital-tools")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
})
```

- [ ] **Step 3: Run the focused tests and confirm red state**

```powershell
node --test tests/seo-helpers.node.mjs
npx playwright test -g "article uses article-specific|unfinished digital tools"
```

Expected: the helper module is missing, Twitter metadata is generic, BlogPosting lacks `dateModified`, and the unfinished category remains indexable.

- [ ] **Step 4: Implement deterministic deal metadata helpers**

Create `src/lib/deal-seo.ts`. Use word-boundary truncation and a short stable hash suffix only if two active products would otherwise collapse to the same title. The public output must follow these shapes:

```ts
export function buildDealSeoTitle(deal: Deal): string {
  // `<distinguishing product phrase> – <platform> | SulitScan PH`, <= 65 chars
}

export function buildDealSeoDescription(deal: Deal): string {
  // `<product title> on <platform>: <buyer note>. Confirm current price...`, <= 160 chars
}
```

Do not include unverified price or discount values in the description. Import these helpers in `src/app/deals/[slug]/page.tsx`; use `title: { absolute: buildDealSeoTitle(deal) }` so the root title template is not applied twice, and use the helper description for normal and Open Graph metadata.

- [ ] **Step 5: Make article sharing metadata specific**

In `src/app/blog/[slug]/page.tsx`, add:

```ts
twitter: {
  card: "summary_large_image",
  title: `${post.title} | SulitScan PH`,
  description: clampMeta(post.excerpt),
  images: [`${siteConfig.url}${post.coverImage ?? DEFAULT_BLOG_COVER}`],
  creator: siteConfig.twitterHandle,
  site: siteConfig.twitterHandle,
},
```

Add `modifiedTime: post.lastReviewed` to `openGraph`.

- [ ] **Step 6: Add truthful BlogPosting freshness and author URL**

Extend `BlogPostingProps` and `BlogPostingJsonLd`:

```ts
interface BlogPostingProps {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified: string
  url: string
  imageUrl?: string
}
```

The schema must emit `dateModified` and `author.url: "https://sulitscan.com/editorial-policy"`. Pass `post.lastReviewed` from the article page. Do not add Product/Offer schema.

- [ ] **Step 7: Noindex unfinished categories**

In category `generateMetadata`, compute active deals and set:

```ts
const indexable = category.featured && getDealsByCategory(slug).length > 0
robots: { index: indexable, follow: true },
```

Do not add the unfinished category to the sitemap.

- [ ] **Step 8: Make the new node tests part of the standard check**

Add `"test:seo": "node --test tests/seo-helpers.node.mjs"` and run it from `npm run check` immediately after `test:recommendations`.

- [ ] **Step 9: Verify and commit Task 1**

```powershell
npm run test:seo
npm run typecheck
npx playwright test -g "article uses article-specific|unfinished digital tools"
git add -- src/lib/deal-seo.ts tests/seo-helpers.node.mjs src/app/deals/[slug]/page.tsx src/app/blog/[slug]/page.tsx src/app/categories/[slug]/page.tsx src/components/SeoJsonLd.tsx package.json tests/smoke.spec.ts
git commit -m "fix: strengthen SEO metadata and article schema"
```

Expected: all focused tests pass.

---

### Task 2: Make Deal Discovery Server-Rendered, Paginated, and Lighter

**Files:**
- Create: `src/lib/deal-listing.ts`
- Modify: `tests/seo-helpers.node.mjs`
- Modify: `src/app/deals/page.tsx`
- Modify: `src/components/DealsGrid.tsx`
- Modify: `src/components/DealCard.tsx`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `DEALS_PAGE_SIZE = 24`.
- Produces: `resolveDealListing(deals: Deal[], raw: DealSearchParams): DealListingResult`.
- Produces: `buildDealsHref(current: NormalizedDealFilters, overrides: Partial<NormalizedDealFilters>): string`.
- `DealCard` gains `imagePriority?: boolean` and remains compatible with existing callers.

- [ ] **Step 1: Add failing pure listing tests**

Extend `tests/seo-helpers.node.mjs` to cover:

```js
test("deal listing clamps invalid pages and returns 24 products", () => {
  const result = listingModule.resolveDealListing(dealsModule.getActiveDeals(), { page: "9999" })
  assert.equal(result.page, result.pageCount)
  assert.ok(result.items.length > 0 && result.items.length <= 24)
})

test("deal listing filters and sorts deterministically", () => {
  const result = listingModule.resolveDealListing(dealsModule.getActiveDeals(), {
    q: "brush", store: "Sephora PH", sort: "price-asc", page: "1",
  })
  assert.ok(result.items.every((deal) => deal.platform === "Sephora PH"))
  assert.ok(result.items.every((deal) => /brush/i.test(`${deal.title} ${deal.category} ${deal.tags.join(" ")}`)))
  assert.deepEqual(result.items.map((deal) => deal.salePrice), [...result.items.map((deal) => deal.salePrice)].sort((a, b) => a - b))
  assert.equal(result.isFiltered, true)
})

test("deal pagination URLs preserve filters without empty defaults", () => {
  const href = listingModule.buildDealsHref(
    { q: "brush", store: "Sephora PH", category: "All", sort: "recommended", page: 1 },
    { page: 2 }
  )
  assert.equal(href, "/deals?q=brush&store=Sephora+PH&page=2")
})
```

- [ ] **Step 2: Add failing pagination and robots tests**

Append Playwright tests:

```ts
test("deals page exposes crawlable server pagination", async ({ page }) => {
  await page.goto("/deals?page=2")
  await expect(page.getByText("Page 2 of", { exact: false })).toBeVisible()
  await expect(page.getByRole("link", { name: "Previous page" })).toHaveAttribute("href", "/deals")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://sulitscan.com/deals?page=2")
  expect(await page.locator("main article").count()).toBeLessThanOrEqual(24)
})

test("filtered deals are noindex and preserve URL state", async ({ page }) => {
  await page.goto("/deals?q=brush&store=Sephora+PH")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  await expect(page.locator('input[name="q"]')).toHaveValue("brush")
  await expect(page.locator('select[name="store"]')).toHaveValue("Sephora PH")
})
```

- [ ] **Step 3: Run focused tests and confirm they fail**

```powershell
npm run test:seo
npx playwright test -g "crawlable server pagination|filtered deals"
```

- [ ] **Step 4: Implement `src/lib/deal-listing.ts`**

Define the exact public types:

```ts
export type DealSortKey = "recommended" | "discount" | "score" | "price-asc" | "newest"
export interface DealSearchParams {
  q?: string | string[]
  store?: string | string[]
  category?: string | string[]
  sort?: string | string[]
  page?: string | string[]
}
export interface NormalizedDealFilters {
  q: string
  store: string
  category: string
  sort: DealSortKey
  page: number
}
export interface DealListingResult extends NormalizedDealFilters {
  items: Deal[]
  total: number
  pageCount: number
  isFiltered: boolean
}
export const DEALS_PAGE_SIZE = 24
```

Use the same sort semantics as the existing client component. Normalize arrays by taking the first value, trim `q`, validate store/category values from the actual deal data, clamp `page` to `1..pageCount`, and make empty results report `page = 1`, `pageCount = 1`.

- [ ] **Step 5: Convert `/deals` to an async Server Component**

`DealsPage` and `generateMetadata` must both await `searchParams`. Replace the static metadata export with:

```ts
export async function generateMetadata({ searchParams }: { searchParams: Promise<DealSearchParams> }): Promise<Metadata> {
  const listing = resolveDealListing(getActiveDeals(), await searchParams)
  const canonical = listing.isFiltered || listing.page === 1
    ? `${siteConfig.url}/deals`
    : `${siteConfig.url}/deals?page=${listing.page}`
  return {
    title: listing.page > 1 && !listing.isFiltered
      ? `Latest Online Deals Philippines — Page ${listing.page}`
      : "Latest Online Deals Philippines",
    description: "Browse curated online deals from Temu, Shopee PH, and Sephora PH with buyer notes on every listing.",
    alternates: { canonical },
    robots: { index: !listing.isFiltered, follow: true },
  }
}
```

Render ItemList JSON-LD only for `listing.items`, with positions offset by page. Pass the listing into the server DealsGrid.

- [ ] **Step 6: Replace client-only load-more UI with an accessible GET form and links**

Remove `"use client"`, hooks, and event handlers from `DealsGrid.tsx`. Render:

- `input name="q" defaultValue={listing.q}`
- `select name="store" defaultValue={listing.store}`
- `select name="category" defaultValue={listing.category}`
- `select name="sort" defaultValue={listing.sort}`
- submit button “Apply filters” and a `/deals` clear link
- exactly `listing.items` cards
- previous/next and nearby page links built by `buildDealsHref`
- visible `Page N of M` and result count

Use semantic navigation with `aria-label="Deals pagination"`; label each numbered link `Page N` and use `aria-current="page"` for the current number.

- [ ] **Step 7: Remove Framer Motion from DealCard and prioritize only first images**

Remove `"use client"`, `motion`, and animation props from `DealCard.tsx`. Use `<article>` with the existing Tailwind hover transitions. Add:

```ts
interface DealCardProps {
  deal: Deal
  imagePriority?: boolean
}
```

For `Image`, use:

```tsx
loading={imagePriority ? "eager" : "lazy"}
fetchPriority={imagePriority ? "high" : "auto"}
```

Do not use the deprecated Next.js 16 `priority` prop. In DealsGrid, pass `imagePriority={index < 4}`. Existing callers omit the prop.

- [ ] **Step 8: Verify payload behavior and commit Task 2**

```powershell
npm run test:seo
npm run typecheck
npx playwright test -g "crawlable server pagination|filtered deals|affiliate_click|affiliate links"
npm run build
git add -- src/lib/deal-listing.ts tests/seo-helpers.node.mjs src/app/deals/page.tsx src/components/DealsGrid.tsx src/components/DealCard.tsx tests/smoke.spec.ts
git commit -m "feat: add crawlable server deal pagination"
```

Record the final `/deals` HTML size and first-load route chunks in the task report for comparison with the live audit baseline.

---

### Task 3: Add a Natural, Tracked ApplyReadyCV Connection

**Files:**
- Modify: `src/components/TrackedSisterSiteLink.tsx`
- Modify: `src/components/ImportTaxCallout.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/data/posts.ts`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- `TrackedSisterSiteLink` gains `destination: "importtaxph" | "applyreadycv"`.
- Article inline rendering recognizes both `importtaxph.com` and `applyreadycv.com` (including `www`).

- [ ] **Step 1: Add a failing ApplyReadyCV tracking test**

```ts
test("work-from-home guide links naturally to ApplyReadyCV and tracks the destination", async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/blog/best-work-from-home-desk-accessories-under-1000-philippines")
  const link = page.getByRole("link", { name: /ApplyReadyCV/i })
  const href = new URL((await link.getAttribute("href")) as string)
  expect(href.hostname).toBe("applyreadycv.com")
  expect(href.searchParams.get("utm_source")).toBe("sulitscan")
  const popupPromise = page.waitForEvent("popup")
  await link.click()
  const popup = await popupPromise
  await popup.close()
  const events = await page.evaluate(() =>
    (window as typeof window & { __events: Array<{ payload: { name?: string; data?: Record<string, unknown> } }> }).__events
  )
  expect(events.find((event) => event.payload.name === "sister_site_click")?.payload.data).toMatchObject({
    destination: "applyreadycv",
    source: "best-work-from-home-desk-accessories-under-1000-philippines",
  })
})
```

- [ ] **Step 2: Confirm the test fails**

```powershell
npx playwright test -g "links naturally to ApplyReadyCV"
```

- [ ] **Step 3: Generalize the tracked sister-site component**

Add the destination prop, use it in the `sister_site_click` event, and retain the same four UTM fields. Update every existing ImportTaxPH caller to pass `destination="importtaxph"`.

In the article renderer, map hostnames as follows:

```ts
function getSisterSiteDestination(href: string): "importtaxph" | "applyreadycv" | null {
  const hostname = new URL(href).hostname.toLowerCase().replace(/^www\./, "")
  if (hostname === "importtaxph.com") return "importtaxph"
  if (hostname === "applyreadycv.com") return "applyreadycv"
  return null
}
```

Keep invalid URL handling safe and leave unrelated external links as normal `noopener noreferrer` anchors.

- [ ] **Step 4: Add one contextual ApplyReadyCV paragraph**

Update the existing work-from-home guide, not the five new product guides. Add a final section titled `## Using the setup for remote job applications?` with this meaning in natural prose:

- good lighting, clear audio, and a stable desk help during online interviews;
- equipment does not replace a clear, role-specific CV;
- readers can use `[ApplyReadyCV](https://applyreadycv.com/)` to check whether their CV is readable by applicant-tracking systems before sending it;
- ApplyReadyCV is identified as SulitScan's sister site, not an affiliate product.

Set that post's `lastReviewed` to `2026-07-19`. Do not add ApplyReadyCV to unrelated posts or recommendation signals.

- [ ] **Step 5: Verify and commit Task 3**

```powershell
npm run typecheck
npx playwright test -g "ApplyReadyCV|ImportTaxPH|sister_site_click|analytics failure"
git add -- src/components/TrackedSisterSiteLink.tsx src/components/ImportTaxCallout.tsx src/app/blog/[slug]/page.tsx src/data/posts.ts tests/smoke.spec.ts
git commit -m "feat: track contextual ApplyReadyCV referrals"
```

---

### Task 4: Publish Five Evidence-Led Shopping Guides

**Files:**
- Modify: `src/data/posts.ts`
- Modify: `tests/recommendations.node.mjs`
- Modify: `scripts/check-links.mjs`

**Interfaces:**
- Adds posts `post-021` through `post-025` with `publishedAt` and `lastReviewed` equal to `2026-07-19`.
- Each post has explicit `recommendationIntent` and at least four visible FAQs.

- [ ] **Step 1: Add failing recommendation/content guard cases**

Add the five slugs to the recommendation test table with exact eligible signals:

| Slug | Allowed categories | Required tags/signals | Required related guide |
|---|---|---|---|
| `back-to-school-essentials-under-500-philippines` | Home, Electronics, Fashion | desk, office, organizer, bag, school, study, lunch | work-from-home desk guide |
| `cookware-sets-philippines-buying-guide` | Home | cookware, kitchen, pan, pot, storage | home-organization guide |
| `bags-under-500-philippines-buying-guide` | Fashion | bag, tote, wallet, backpack, travel | gifts-under-500 guide |
| `carry-on-luggage-philippines-buying-guide` | Fashion, Travel | luggage, travel, bag, organizer | bags-under-500 guide |
| `makeup-brush-sets-philippines-beginner-guide` | Beauty, Skincare | brush, tools, makeup, beauty | Sephora beauty guide |

Require 1–3 unique, active, non-suspicious related deals and reject unrelated topics. Update the link guard's expected minimum post count from 19 to 24 while retaining unique slug/title and cover-file checks.

- [ ] **Step 2: Confirm the guards fail**

```powershell
npm run test:recommendations
npm run check:links
```

Expected: the five post fixtures and cover assets do not exist.

- [ ] **Step 3: Add the back-to-school guide as `post-021`**

Use the exact title and slug from the spec. The article must contain these sections:

1. a concise answer that prioritizes required classroom items before optional desk accessories;
2. `How to plan a ₱500 school basket` with a written budget method, not invented current prices;
3. `What to check by item type` covering notebooks/writing tools, bag/lunch storage, desk/study accessories, and small electronics;
4. delivery timing and seller-photo checks;
5. a linked DTI school-supply guide or current DTI consumer advisory;
6. `How we assessed this guide` linking `/editorial-policy` and naming the catalog/category signals reviewed;
7. a final checklist and at least four FAQs.

Use internal links to `/categories/under-500`, `/categories/tech-deals`, `/categories/fashion`, `/stores/shopee-ph`, and the work-from-home guide. Do not link either sister site.

- [ ] **Step 4: Add the cookware guide as `post-022`**

Required sections:

1. concise answer on material, useful piece count, stove compatibility, dimensions, and return terms;
2. set-versus-individual-piece decision table written as bullets/headings supported by the renderer;
3. small-kitchen measurements and removable-handle trade-offs;
4. coating/handle/lid care framed as “follow the maker's current instructions,” without medical or chemical safety claims;
5. an overseas-order section explaining checkout total, shipping, and possible import charges, linking `[ImportTaxPH](https://importtaxph.com/temu-import-tax)` as a free sister-tool estimate;
6. `How we assessed this guide`, checklist, and at least four FAQs.

Set `importTaxContext: "temu"`. Link Home Finds, Under ₱1,000, Temu, Shopee PH, and the home-organization guide.

- [ ] **Step 5: Add the bags-under-500 guide as `post-023`**

Required sections:

1. concise answer organized by school, commute, event, and light travel use;
2. measurement method comparing listing dimensions with an item the reader already owns;
3. strap attachment, zipper, lining, seam, base, and hardware checks;
4. seller-photo and recent-review evaluation without claiming authenticity guarantees;
5. returns and color/material expectation notes;
6. `How we assessed this guide`, checklist, and at least four FAQs.

Link Fashion, Under ₱500, Shopee PH, Temu, the gifts guide, and the carry-on guide. Do not link a sister site.

- [ ] **Step 6: Add the carry-on luggage guide as `post-024`**

Required sections:

1. concise answer explaining that the listing's “20-inch” label is insufficient;
2. a measure-first method using external length, width, height, empty weight, wheels, and handles;
3. official airline examples with links to current Philippine Airlines and Cebu Pacific baggage pages and a warning to recheck the booked carrier/fare;
4. shell, zipper, wheel, telescoping handle, lock, and warranty/returns checks;
5. packing organizers as optional, not a reason to exceed airline limits;
6. `How we assessed this guide`, a preflight checklist, and at least four FAQs.

Link Travel, Fashion, Under ₱1,000, Temu, Shopee PH, and the bags guide. Do not use ImportTaxPH for airline baggage rules.

- [ ] **Step 7: Add the makeup brush guide as `post-025`**

Required sections:

1. concise answer recommending a small useful set over a large redundant set;
2. face-versus-eye brush roles, fibers, ferrule, handle, shedding, and shape checks;
3. set-versus-individual purchase decision;
4. hygiene guidance linked to the American Academy of Dermatology page `https://www.aad.org/public/everyday-care/skin-care-secrets/routine/clean-your-makeup-brushes`, accurately paraphrasing its current guidance;
5. authorized-retailer versus marketplace context without making counterfeit guarantees;
6. `How we assessed this guide`, cleaning/checklist section, and at least four FAQs.

Link Beauty, Sephora PH, Shopee PH, the beauty-under-500 guide, and Sephora beauty guide. Do not link either sister site.

- [ ] **Step 8: Copy-edit all five drafts**

Use the copy-editing skill. Remove repetitive AI-writing patterns, filler, fake certainty, unsupported superlatives, templated section openings, and statements that imply physical testing. Ensure each guide has a distinct decision framework and places its primary keyword naturally in the title, H1, first paragraph, and at least one H2.

- [ ] **Step 9: Run content and recommendation tests**

```powershell
npm run typecheck
npm run test:recommendations
```

Expected: recommendation tests pass; `check:links` may still fail only because Task 5 has not created five image files.

- [ ] **Step 10: Commit Task 4**

```powershell
git add -- src/data/posts.ts tests/recommendations.node.mjs scripts/check-links.mjs
git commit -m "feat: add five evidence-led shopping guides"
```

---

### Task 5: Generate, Validate, and Wire Five Original Guide Banners

**Files:**
- Create: `public/images/guides/back-to-school-essentials-under-500-philippines.jpg`
- Create: `public/images/guides/cookware-sets-philippines-buying-guide.jpg`
- Create: `public/images/guides/bags-under-500-philippines-buying-guide.jpg`
- Create: `public/images/guides/carry-on-luggage-philippines-buying-guide.jpg`
- Create: `public/images/guides/makeup-brush-sets-philippines-beginner-guide.jpg`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Every `coverImage` path added in Task 4 must resolve to one of these assets.

- [ ] **Step 1: Read and follow the built-in image-generation skill**

Use the built-in image tool, one generation call per distinct banner. Do not use SVG, CSS art, stock photos, or Python-drawn substitutes.

- [ ] **Step 2: Generate the back-to-school banner**

```text
Use case: photorealistic-natural
Asset type: 16:9 editorial blog hero
Primary request: Filipino back-to-school essentials under 500 pesos buying checklist
Scene/backdrop: bright compact study desk in a contemporary Philippine home
Subject: plain notebooks, pencils and pens, a neutral backpack, lunch container, desktop organizer, small desk fan, and measuring tape arranged as a practical school kit
Style/medium: premium natural commercial photography, brand-neutral
Composition/framing: wide landscape, clear central grouping, room for responsive crop
Lighting/mood: warm daylight, prepared and practical
Color palette: green, cream, warm wood, muted blue accents
Constraints: no people, logos, trademarks, packaging, text, numbers, prices, school emblems, or watermark
```

- [ ] **Step 3: Generate the cookware banner**

```text
Use case: photorealistic-natural
Asset type: 16:9 editorial blog hero
Primary request: cookware-set buying guide for a small Philippine kitchen
Scene/backdrop: tidy compact apartment kitchen counter with induction hob visible but switched off
Subject: nested saucepans and frying pans, removable handle, lids, measuring tape, cabinet shelf, and soft cloth care items
Style/medium: premium brand-neutral commercial photography
Composition/framing: wide landscape, realistic scale and intact handles/lids
Lighting/mood: warm natural window light, calm and practical
Color palette: slate, cream, stainless steel, warm wood, green accents
Constraints: no food claims, flames, people, logos, trademarks, packaging, text, prices, or watermark
```

- [ ] **Step 4: Generate the bags banner**

```text
Use case: photorealistic-natural
Asset type: 16:9 editorial blog hero
Primary request: bags under 500 pesos size and construction checklist
Scene/backdrop: clean neutral tabletop and bench
Subject: brand-neutral tote, crossbody, small backpack, wallet, measuring tape, strap detail, zipper, and everyday objects used to show scale
Style/medium: premium editorial product photography
Composition/framing: wide landscape with distinct, undistorted bags and visible construction details
Lighting/mood: soft daylight, practical fashion mood
Color palette: olive, tan, black, cream, muted coral
Constraints: no people, logos, monograms, trademarks, packaging, text, prices, or watermark
```

- [ ] **Step 5: Generate the carry-on banner**

```text
Use case: photorealistic-natural
Asset type: 16:9 editorial blog hero
Primary request: carry-on luggage size, weight, and online-buying checklist for Philippine travelers
Scene/backdrop: bright home packing area, not an airport
Subject: plain hard-shell cabin suitcase, measuring tape along three dimensions, small digital luggage scale, packing cubes, toiletry pouch, and backpack
Style/medium: premium realistic travel editorial photography, brand-neutral
Composition/framing: wide landscape, full suitcase visible with realistic wheels and telescoping handle
Lighting/mood: clear daylight, organized and ready
Color palette: deep green, cream, charcoal, warm orange accents
Constraints: no airline branding, people, passports, logos, text, size labels, prices, or watermark
```

- [ ] **Step 6: Generate the makeup-brush banner**

```text
Use case: photorealistic-natural
Asset type: 16:9 editorial blog hero
Primary request: beginner makeup brush sets versus individual brushes buying guide
Scene/backdrop: clean vanity surface with a washable mat
Subject: small intentional set of face and eye brushes, one individual brush, brush cup, gentle cleaning bowl, towel, ferrule and bristle detail
Style/medium: premium brand-neutral beauty editorial photography
Composition/framing: wide landscape, anatomically plausible brushes with clean separated shapes
Lighting/mood: soft bright daylight, hygienic and approachable
Color palette: blush, cream, sage, warm neutral, small black accents
Constraints: no people, makeup application, logos, trademarks, packaging, text, prices, or watermark
```

- [ ] **Step 7: Save project-bound files and inspect each asset**

Copy the selected built-in outputs into the five exact workspace paths. Convert to optimized JPEG only if the generated output is not already a suitable JPEG. Use the local image viewer on every file. Reject and regenerate any image with text fragments, logos, distorted handles/wheels/brushes, misleading scale marks, broken perspective, or a non-landscape composition.

- [ ] **Step 8: Validate dimensions and size**

```powershell
Add-Type -AssemblyName System.Drawing
$names = @(
  "back-to-school-essentials-under-500-philippines.jpg",
  "cookware-sets-philippines-buying-guide.jpg",
  "bags-under-500-philippines-buying-guide.jpg",
  "carry-on-luggage-philippines-buying-guide.jpg",
  "makeup-brush-sets-philippines-beginner-guide.jpg"
)
foreach ($name in $names) {
  $path = Join-Path "public/images/guides" $name
  if (-not (Test-Path $path)) { throw "Missing $path" }
  $image = [System.Drawing.Image]::FromFile((Resolve-Path $path))
  try {
    $ratio = $image.Width / $image.Height
    if ([Math]::Abs($ratio - (16 / 9)) -gt 0.09) { throw "$name is not approximately 16:9" }
  } finally { $image.Dispose() }
}
```

- [ ] **Step 9: Add route-level banner/content tests**

Add the five slugs to a table and assert that each route returns 200, renders its matching image, visible “How we assessed this guide” and FAQ headings, at least one relevant related deal, affiliate disclosure, and a self-canonical. Add focused assertions that only the cookware guide renders the new ImportTaxPH callout.

- [ ] **Step 10: Verify and commit Task 5**

```powershell
npm run check:links
npx playwright test -g "evidence-led guide|cookware guide"
git add -- public/images/guides tests/smoke.spec.ts
git commit -m "feat: add five original guide banners"
```

---

### Task 6: Full Review, Verification, Promotion, and Production Check

**Files:**
- Review: every change since `d4b6b0c`.
- Update if needed: `docs/traffic-growth-checklist.md`.

- [ ] **Step 1: Run task-scoped and whole-branch reviews**

Use the subagent-driven development review package after every task. After Task 5, dispatch a fresh whole-branch reviewer using the requesting-code-review template. Resolve every Critical or Important finding in one fix wave and re-review.

- [ ] **Step 2: Run the exact final repository suite**

```powershell
npm run check
```

Expected: lint, TypeScript, recommendation tests, SEO helper tests, link/affiliate/product guards, quality checks, and production build all pass.

- [ ] **Step 3: Run Playwright against the production build on an isolated port**

Use one port source for both server and browser configuration. Start `npm run start` in a hidden window, set `BASE_URL`, run the complete Playwright suite with one worker if needed for stability, then stop only the process started by this task. Expected: zero failures.

- [ ] **Step 4: Re-run technical evidence checks**

Confirm:

- all five new URLs and their banner assets return 200 locally;
- `/deals?page=2` is crawlable and self-canonical;
- filtered deal URLs are `noindex, follow`;
- only 24 deal cards are included per server response;
- article Twitter metadata is specific;
- BlogPosting JSON-LD includes correct `dateModified`;
- `/categories/digital-tools` is noindex;
- ImportTaxPH and ApplyReadyCV links contain UTMs and emit the correct private destination property;
- no deprecated `priority` prop was added in the files touched by this release.

- [ ] **Step 5: Inspect visuals at desktop and mobile widths**

Inspect `/deals`, `/deals?page=2`, `/blog`, all five new guides, and the updated work-from-home guide. Check overflow, focus labels, pagination state, image crops, heading hierarchy, citations, sister-site wording, related-deal relevance, and affiliate disclosure.

- [ ] **Step 6: Review final repository state**

```powershell
git diff d4b6b0c..HEAD --check
git diff d4b6b0c..HEAD --stat
git log --oneline d4b6b0c..HEAD
git status --short --branch
```

No temporary crawl output, Playwright artifacts, generated variants, or worktree files may be tracked.

- [ ] **Step 7: Promote verified commits to main and push**

Fast-forward or cherry-pick the reviewed worktree commits onto the clean main checkout, run a final `git diff --check`, then:

```powershell
git push origin main
```

Verify local `main` and `origin/main` resolve to the same commit.

- [ ] **Step 8: Verify production after Vercel deploy**

Check all five new article URLs, `/deals?page=2`, the sitemap, the digital-tools robots tag, and both sister-site links on `https://sulitscan.com`. Record that `www` remains a separate Vercel domain-setting action if it still returns 307.

