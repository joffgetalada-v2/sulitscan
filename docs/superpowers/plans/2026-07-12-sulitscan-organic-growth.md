# SulitScan Organic Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish four distinct commercial-intent shopping guides with original banners while consolidating duplicate content, improving internal recommendations, measuring outbound clicks, and strengthening sitemap and distribution workflows.

**Architecture:** Keep the existing data-driven `BlogPost` model and App Router pages. Add small deterministic recommendation helpers, use a Next.js configuration redirect for the retired article, centralize affiliate and ImportTaxPH click tracking in client link components, and retain server-rendered metadata/schema. The four new articles remain in `src/data/posts.ts` to follow the repository's established content pattern.

**Tech Stack:** Next.js 16.2.7 App Router, React 19.2.4, TypeScript 5, Tailwind CSS 4, `@vercel/analytics` 2.0.1, Playwright 1.60, Next Image, AI image generation.

## Global Constraints

- Read the relevant files under `node_modules/next/dist/docs/` before changing Next.js code; this repository explicitly warns that its Next.js version has breaking changes.
- Keep the commercial focus on Shopee PH, Temu, and Sephora PH; do not add another marketplace or affiliate partner.
- Do not claim that SulitScan physically tested a product.
- Do not publish unverifiable coupon codes, live-price promises, shipping promises, medical claims, or authenticity guarantees.
- Every new article needs a unique, locally hosted 16:9 raster banner with descriptive alt text and no marketplace logo, trademark, price claim, or branded packaging.
- ImportTaxPH links must be useful in context, identify it as a free sister tool, and state that results are estimates rather than official customs assessments.
- Analytics events must not include email addresses, search queries, product titles, full destination URLs, or other personal data.
- Affiliate navigation must still work if analytics fails.
- Preserve `target="_blank"` and `rel="sponsored nofollow noopener noreferrer"` for affiliate links.
- Do not automate Search Console or Bing Webmaster Tools actions without credentials; document the manual post-deploy workflow.
- Use PowerShell syntax in commands and do not use `&&`.
- Commit self-contained tasks; push only after the complete verification gate passes.

## File Map

- `next.config.ts`: permanent redirect from the retired Shopee article.
- `src/data/posts.ts`: consolidate the Shopee article, add four new articles, and export newest-first and related-post helpers.
- `src/lib/blog-recommendations.ts`: score deals against article store, category, budget, and tag signals.
- `src/app/blog/page.tsx`: render and describe articles newest-first.
- `src/app/blog/[slug]/page.tsx`: use relevant article/deal helpers and tracked ImportTaxPH links.
- `src/components/ExternalAffiliateLink.tsx`: send non-blocking `affiliate_click` events.
- `src/components/TrackedSisterSiteLink.tsx`: add ImportTaxPH campaign parameters and send `sister_site_click` events.
- `src/components/ImportTaxCallout.tsx`: use the tracked sister-site link and the Temu-specific calculator when relevant.
- `src/components/DealCard.tsx`: replace the raw outbound affiliate anchor with the shared tracked component.
- `src/app/stores/[slug]/page.tsx`: reuse the tracked affiliate and ImportTaxPH components for store CTAs.
- `src/app/sitemap.ts`: use article review dates and omit misleading build-time dates.
- `public/images/guides/*.jpg`: four generated article banners.
- `scripts/check-links.mjs`: enforce unique post slugs/titles and required local article covers.
- `tests/smoke.spec.ts`: verify redirect, ordering, article assets, recommendations, sitemap, and analytics events.
- `docs/traffic-growth-checklist.md`: deployment, indexing, measurement, and promotion checklist.

---

### Task 1: Consolidate the Duplicate Shopee Seller Guide

**Files:**
- Modify: `tests/smoke.spec.ts`
- Modify: `playwright.config.ts`
- Modify: `next.config.ts`
- Modify: `src/data/posts.ts`

**Interfaces:**
- Consumes: existing `posts: BlogPost[]` and Next.js `NextConfig.redirects()`.
- Produces: one canonical post at `how-to-check-shopee-seller-legit-philippines` and a permanent redirect from `how-to-check-if-shopee-seller-is-legit`.

- [ ] **Step 1: Add the failing redirect test**

Add this `webServer` property to `playwright.config.ts` so focused tests start the app reliably when `BASE_URL` is not supplied:

```ts
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
```

Then append this exact test to `tests/smoke.spec.ts`:

```ts
test("retired Shopee seller guide permanently redirects to the canonical guide", async ({ request }) => {
  const response = await request.get("/blog/how-to-check-if-shopee-seller-is-legit", {
    maxRedirects: 0,
  })
  expect(response.status()).toBe(308)
  expect(response.headers().location).toBe(
    "/blog/how-to-check-shopee-seller-legit-philippines"
  )
})
```

- [ ] **Step 2: Run the focused test and confirm the failure**

Run:

```powershell
npx playwright test -g "retired Shopee seller guide"
```

Expected: FAIL because the retired URL currently returns `200`.

- [ ] **Step 3: Add the documented Next.js permanent redirect**

Add this method to `nextConfig` in `next.config.ts`, alongside `headers()`:

```ts
  async redirects() {
    return [
      {
        source: "/blog/how-to-check-if-shopee-seller-is-legit",
        destination: "/blog/how-to-check-shopee-seller-legit-philippines",
        permanent: true,
      },
    ]
  },
```

Next.js 16 documents `permanent: true` as a `308` redirect for known URL migrations.

- [ ] **Step 4: Merge the two article records**

Delete the full post object with slug `how-to-check-if-shopee-seller-is-legit`. Keep the object with slug `how-to-check-shopee-seller-legit-philippines`, then make these metadata values exact:

```ts
    id: "post-014",
    slug: "how-to-check-shopee-seller-legit-philippines",
    title: "How to Check If a Shopee Seller Is Legit Before Buying",
    publishedAt: "2026-06-28",
    lastReviewed: "2026-07-12",
```

Merge any unique useful guidance from the retired article into the canonical article under these sections, without duplicating paragraphs:

```md
## Quick seller check
## Seller rating and sales history
## Shopee Mall and Preferred Seller badges
## How to read buyer photo reviews
## Listing and price red flags
## Payment, delivery, and return checks
## One-minute checklist before buying
## Related Shopee PH guides
## Affiliate disclosure
```

Keep the canonical post's five visible FAQs and ensure the content does not claim that a badge guarantees legitimacy.

- [ ] **Step 5: Verify the focused behavior**

Run:

```powershell
npm run typecheck
npx playwright test -g "retired Shopee seller guide"
```

Expected: typecheck PASS; focused Playwright test PASS.

- [ ] **Step 6: Commit the consolidation**

```powershell
git add next.config.ts src/data/posts.ts tests/smoke.spec.ts playwright.config.ts
git commit -m "fix: consolidate Shopee seller guides"
```

---

### Task 2: Add Relevant Blog and Deal Recommendations

**Files:**
- Create: `src/lib/blog-recommendations.ts`
- Modify: `src/data/posts.ts`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/components/BlogCard.tsx`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `getPostsNewestFirst(): BlogPost[]`.
- Produces: `getRelatedPosts(current: BlogPost, count?: number): BlogPost[]`.
- Produces: `getRelatedDealsForPost(post: BlogPost, count?: number): Deal[]`.

- [ ] **Step 1: Add failing blog-discovery tests**

Append:

```ts
test("blog index lists guides newest first", async ({ page }) => {
  await page.goto("/blog")
  const dates = await page.locator('main a[href^="/blog/"] time').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("datetime") ?? "")
  )
  expect(dates.length).toBeGreaterThan(3)
  expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)))
})

test("Shopee seller guide recommends related Shopee content", async ({ page }) => {
  await page.goto("/blog/how-to-check-shopee-seller-legit-philippines")
  const related = page.getByRole("region", { name: "More shopping guides" })
  await expect(related.getByRole("link", { name: /Shopee/i }).first()).toBeVisible()
})
```

Change `BlogCard.tsx`'s date markup during implementation from a `span` to:

```tsx
<time dateTime={post.publishedAt} className="text-xs text-slate-400">
  {formatDate(post.publishedAt)}
</time>
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run:

```powershell
npx playwright test -g "newest first|related Shopee content"
```

Expected: the index-order test fails because `posts` is currently rendered oldest-first; the related-content test fails because the first-three fallback is unrelated.

- [ ] **Step 3: Add deterministic post helpers**

Add to the bottom of `src/data/posts.ts`:

```ts
export function getPostsNewestFirst(): BlogPost[] {
  return [...posts].sort((a, b) => {
    const byDate = b.publishedAt.localeCompare(a.publishedAt)
    return byDate !== 0 ? byDate : b.id.localeCompare(a.id)
  })
}

export function getRelatedPosts(current: BlogPost, count = 3): BlogPost[] {
  const currentTags = new Set(current.tags)
  return posts
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => ({
      candidate,
      score:
        candidate.tags.filter((tag) => currentTags.has(tag)).length * 3 +
        (candidate.category === current.category ? 2 : 0),
    }))
    .sort((a, b) =>
      b.score - a.score ||
      b.candidate.publishedAt.localeCompare(a.candidate.publishedAt) ||
      b.candidate.id.localeCompare(a.candidate.id)
    )
    .slice(0, count)
    .map(({ candidate }) => candidate)
}
```

Replace the existing `getRecentPosts` implementation with:

```ts
export function getRecentPosts(count = 6): BlogPost[] {
  return getPostsNewestFirst().slice(0, count)
}
```

- [ ] **Step 4: Add the focused deal scorer**

Create `src/lib/blog-recommendations.ts` with this implementation:

```ts
import type { BlogPost } from "@/data/posts"
import type { Deal } from "@/data/deals"
import { getActiveDeals, isSuspiciousDiscount } from "@/data/deals"

const categorySignals: Array<{ pattern: RegExp; categories: string[] }> = [
  { pattern: /home|organization|desk|work-from-home/, categories: ["Home", "Outdoor"] },
  { pattern: /beauty|skincare|makeup/, categories: ["Beauty", "Skincare"] },
  { pattern: /phone|tech|charger|accessor/, categories: ["Electronics"] },
  { pattern: /gift/, categories: ["Home", "Beauty", "Skincare", "Fashion"] },
]

export function getRelatedDealsForPost(post: BlogPost, count = 3): Deal[] {
  const topic = `${post.slug} ${post.title} ${post.tags.join(" ")}`.toLowerCase()
  const postTags = new Set(post.tags.map((tag) => tag.toLowerCase()))

  return getActiveDeals()
    .filter((deal) => !isSuspiciousDiscount(deal))
    .map((deal) => {
      let score = deal.tags.filter((tag) => postTags.has(tag.toLowerCase())).length * 3
      for (const signal of categorySignals) {
        if (signal.pattern.test(topic) && signal.categories.includes(deal.category)) score += 4
      }
      if (/under-500/.test(topic) && deal.salePrice < 500) score += 5
      if (/under-1000/.test(topic) && deal.salePrice < 1000) score += 5
      if (/shopee/.test(topic) && deal.platform === "Shopee PH") score += 3
      if (/temu/.test(topic) && deal.platform === "Temu") score += 3
      if (/sephora/.test(topic) && deal.platform === "Sephora PH") score += 3
      if (/gift/.test(topic) && deal.sulitScore >= 8) score += 2
      return { deal, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) =>
      b.score - a.score ||
      b.deal.sulitScore - a.deal.sulitScore ||
      a.deal.salePrice - b.deal.salePrice
    )
    .slice(0, count)
    .map(({ deal }) => deal)
}
```

- [ ] **Step 5: Wire the helpers into the pages**

In `src/app/blog/page.tsx`, create `const orderedPosts = getPostsNewestFirst()` and use it for the ItemList schema, guide count, and card grid.

In `src/app/blog/[slug]/page.tsx`, replace the current `relatedPosts` and conditional deal selection with:

```ts
const relatedPosts = getRelatedPosts(post)
const relatedDeals = getRelatedDealsForPost(post)
```

Add `aria-label="More shopping guides"` to the related-posts `<section>` so the accessibility test has a stable region name.

- [ ] **Step 6: Run focused and static checks**

```powershell
npm run typecheck
npm run check:links
npx playwright test -g "newest first|related Shopee content"
```

Expected: all commands PASS.

- [ ] **Step 7: Commit recommendation improvements**

```powershell
git add src/data/posts.ts src/lib/blog-recommendations.ts src/app/blog/page.tsx src/app/blog/[slug]/page.tsx src/components/BlogCard.tsx tests/smoke.spec.ts
git commit -m "feat: improve blog and deal recommendations"
```

---

### Task 3: Add Four Guarded Articles and Their Banners

**Files:**
- Modify: `scripts/check-links.mjs`
- Modify: `src/data/posts.ts`
- Modify: `tests/smoke.spec.ts`
- Create: `public/images/guides/best-home-organization-finds-under-500-philippines.jpg`
- Create: `public/images/guides/best-gifts-under-500-philippines.jpg`
- Create: `public/images/guides/best-work-from-home-desk-accessories-under-1000-philippines.jpg`
- Create: `public/images/guides/best-beauty-finds-under-500-philippines.jpg`

**Interfaces:**
- Consumes: existing `BlogPost` fields and Markdown-like renderer.
- Produces: four new slugs, visible FAQs, internal links, and cover-image paths.

- [ ] **Step 1: Load editorial skills before drafting**

Read and follow `content-strategy`, `copywriting`, and `copy-editing`. Use the SEO audit findings already captured in the design. Do not introduce unsupported current-price or delivery claims.

- [ ] **Step 2: Extend the static content guard first**

In `scripts/check-links.mjs`, move `const postsSrc = read("src/data/posts.ts")` to immediately before the existing `postSlugs` declaration, delete its later duplicate declaration, and then add:

```js
const postSlugList = slugsOf("src/data/posts.ts")
const postTitles = [...postsSrc.matchAll(/^\s+title:\s*"([^"]+)"/gm)].map((m) => m[1])

for (const [label, values] of [["post slug", postSlugList], ["post title", postTitles]]) {
  const seenValues = new Set()
  for (const value of values) {
    if (seenValues.has(value)) errors.push(`Duplicate ${label}: "${value}"`)
    seenValues.add(value)
  }
}

for (const match of postsSrc.matchAll(/coverImage:\s*"(\/images\/guides\/[^"]+)"/g)) {
  if (!existsSync(join(ROOT, "public", match[1].replace(/^\//, "")))) {
    errors.push(`posts.ts: missing cover image public${match[1]}`)
  }
}
```

Add the four required slugs to a set and fail when any slug or corresponding `coverImage` entry is missing:

```js
const REQUIRED_GROWTH_POSTS = new Set([
  "best-home-organization-finds-under-500-philippines",
  "best-gifts-under-500-philippines",
  "best-work-from-home-desk-accessories-under-1000-philippines",
  "best-beauty-finds-under-500-philippines",
])
for (const slug of REQUIRED_GROWTH_POSTS) {
  if (!postSlugs.has(slug)) errors.push(`Missing required growth post: "${slug}"`)
  const expectedCover = `coverImage: "/images/guides/${slug}.jpg"`
  if (!postsSrc.includes(expectedCover)) errors.push(`Missing required cover entry for: "${slug}"`)
}
```

- [ ] **Step 3: Run the guard and confirm it fails**

Run `npm run check:links`.

Expected: FAIL listing the four missing growth posts and covers.

- [ ] **Step 4: Draft the four complete post objects**

Append IDs `post-017` through `post-020` to `posts`. Use `publishedAt: "2026-07-12"`, `lastReviewed: "2026-07-12"`, `author: "SulitScan Team"`, and these exact metadata values:

```ts
{
  id: "post-017",
  slug: "best-home-organization-finds-under-500-philippines",
  title: "Best Home Organization Finds Under ₱500 Philippines",
  category: "Budget Finds",
  readTime: 9,
  tags: ["home-organization", "home-finds", "under-500", "shopee", "temu", "philippines"],
  coverImage: "/images/guides/best-home-organization-finds-under-500-philippines.jpg",
}
{
  id: "post-018",
  slug: "best-gifts-under-500-philippines",
  title: "Best Gifts Under ₱500 Philippines: Practical Ideas for Every Occasion",
  category: "Gift Guides",
  readTime: 9,
  tags: ["gift-ideas", "under-500", "shopee", "temu", "sephora", "philippines"],
  coverImage: "/images/guides/best-gifts-under-500-philippines.jpg",
}
{
  id: "post-019",
  slug: "best-work-from-home-desk-accessories-under-1000-philippines",
  title: "Best Work-From-Home Desk Accessories Under ₱1,000 Philippines",
  category: "Tech Guides",
  readTime: 10,
  tags: ["work-from-home", "desk-accessories", "tech-deals", "home-finds", "under-1000", "shopee", "temu", "philippines"],
  coverImage: "/images/guides/best-work-from-home-desk-accessories-under-1000-philippines.jpg",
}
{
  id: "post-020",
  slug: "best-beauty-finds-under-500-philippines",
  title: "Best Beauty Finds Under ₱500 Philippines: What to Check Before Buying",
  category: "Beauty Guides",
  readTime: 10,
  tags: ["beauty", "skincare", "makeup", "under-500", "shopee", "sephora", "philippines"],
  coverImage: "/images/guides/best-beauty-finds-under-500-philippines.jpg",
}
```

For each object, also supply an original `excerpt`, `content`, `coverGradient`, `coverImageAlt`, and four or five FAQs. The `content` must fully answer the query using these exact section routes:

```text
Home: Quick answer; Best categories; Measurements and materials; Seller reviews; Shopee vs Temu final cost; What to skip; Checklist; Related SulitScan guides; Affiliate disclosure.
Gifts: Quick answer; Choose by recipient; Practical categories; Birthday and thank-you ideas; Exchange gifts; Delivery and presentation; What to skip; Checklist; Related deals; Affiliate disclosure.
Desk: Quick answer; Stands; Lighting; Cable management; Organizers; Electrical accessory caution; Ergonomic measurements; Shopee vs Temu; Checklist; Related deals; Affiliate disclosure.
Beauty: Quick answer; Tools and low-risk basics; Skincare checks; Makeup shades; Authenticity signals; Expiry and returns; Shopee vs Sephora PH; What to skip; Checklist; Related deals; Affiliate disclosure.
```

Required internal links:

```text
Home -> /categories/home-finds, /categories/under-500, /stores/shopee-ph, /stores/temu
Gifts -> /categories/gift-ideas, /categories/under-500, /blog/voucher-shipping-return-checklist
Desk -> /categories/tech-deals, /categories/home-finds, /categories/under-1000, /blog/best-phone-accessories-under-500-philippines
Beauty -> /categories/beauty, /categories/under-500, /stores/shopee-ph, /stores/sephora-ph, /blog/sephora-ph-beauty-guide
```

The prose must say products are “worth checking” or “practical categories,” not “tested,” “the best,” or “guaranteed” except where “best” appears naturally in the search-focused title. Add price-change, seller-review, and return reminders where applicable.

- [ ] **Step 5: Add route-level article tests**

Append:

```ts
const growthPosts = [
  "best-home-organization-finds-under-500-philippines",
  "best-gifts-under-500-philippines",
  "best-work-from-home-desk-accessories-under-1000-philippines",
  "best-beauty-finds-under-500-philippines",
]

for (const slug of growthPosts) {
  test(`${slug} renders a unique cover, related deals, and disclosure`, async ({ page }) => {
    await page.goto(`/blog/${slug}`)
    await expect(page.locator(`img[src*="${slug}"]`).first()).toBeVisible()
    await expect(page.getByRole("heading", { name: "Related deals to check" })).toBeVisible()
    await expect(page.getByText("Affiliate Disclosure:", { exact: false })).toBeVisible()
  })
}
```

These tests remain red until Steps 7–12 create and verify the banner files.

- [ ] **Step 6: Run typecheck and content guards**

Expected now: `npm run typecheck` PASS; `npm run check:links` fails only for the four missing physical images.

- [ ] **Step 7: Read and follow the image-generation skill**

Use the `imagegen` skill and the image-generation tool. Do not fabricate the assets with CSS, SVG placeholders, or a Python drawing script.

- [ ] **Step 8: Generate the home-organization banner**

Use this exact prompt and save the result to the required path:

```text
Create a polished 16:9 editorial website banner for a Filipino smart-shopping guide about home organization finds under 500 pesos. Bright contemporary apartment shelf and desk scene with neutral storage bins, drawer organizers, cable clips, a compact spice rack, and a measuring tape. Warm daylight, clean green and cream palette with subtle orange accents, realistic but brand-neutral products, generous negative space, premium commercial photography, no people, no logos, no trademarks, no text, no price labels, no product packaging. Target 1600x900 landscape composition.
```

- [ ] **Step 9: Generate the gift-guide banner**

```text
Create a polished 16:9 editorial website banner for a Philippine gift ideas under 500 pesos guide. Tasteful flat-lay of practical small gifts: insulated tumbler, travel pouch, notebook, simple beauty pouch, cable organizer, and a neatly wrapped box with ribbon. Festive but evergreen, warm coral, green, cream, and gold palette, natural shadows, brand-neutral objects, premium commercial photography, no people, no logos, no trademarks, no text, no price labels, no recognizable packaging. Target 1600x900 landscape composition.
```

- [ ] **Step 10: Generate the work-from-home banner**

```text
Create a polished 16:9 editorial website banner for a Filipino work-from-home desk accessories under 1000 pesos guide. Organized compact desk with laptop stand, warm task lamp, cable clips, desk mat, phone stand, small drawer organizer, and ergonomic measuring cues. Modern apartment workspace, deep slate, green, and warm wood palette, realistic brand-neutral objects, premium commercial photography, no people, no logos, no trademarks, no text, no prices, no recognizable packaging. Target 1600x900 landscape composition.
```

- [ ] **Step 11: Generate the beauty banner**

```text
Create a polished 16:9 editorial website banner for a Philippine budget beauty finds under 500 pesos guide. Clean vanity flat-lay with makeup brushes, compact mirror, lip tint tube, neutral eyeshadow palette, travel-size skincare bottles, patch-test card, and a small magnifying glass suggesting authenticity checks. Soft pink, cream, sage green, and warm neutral palette, realistic but entirely brand-neutral, premium commercial photography, no people, no logos, no trademarks, no text, no prices, no recognizable packaging. Target 1600x900 landscape composition.
```

- [ ] **Step 12: Inspect every generated image**

Use the local image viewer on each file. Reject and regenerate an asset if it contains garbled text, logos, recognizable branded packaging, distorted objects, unsafe imagery, or an obviously non-landscape composition.

- [ ] **Step 13: Verify banner ratios and run route checks**

```powershell
Add-Type -AssemblyName System.Drawing
$names = @(
  "best-home-organization-finds-under-500-philippines.jpg",
  "best-gifts-under-500-philippines.jpg",
  "best-work-from-home-desk-accessories-under-1000-philippines.jpg",
  "best-beauty-finds-under-500-philippines.jpg"
)
$files = Get-ChildItem public/images/guides/*.jpg | Where-Object { $_.Name -in $names }
if ($files.Count -ne 4) { throw "Expected four generated guide banners" }
foreach ($file in $files) {
  $image = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    $ratio = $image.Width / $image.Height
    if ([Math]::Abs($ratio - (16 / 9)) -gt 0.09) { throw "$($file.Name) is not 16:9" }
  } finally { $image.Dispose() }
}
```

```powershell
npm run check:links
npx playwright test -g "renders a unique cover"
```

Expected: both commands PASS.

- [ ] **Step 14: Commit the complete article deliverable**

```powershell
git add src/data/posts.ts scripts/check-links.mjs tests/smoke.spec.ts public/images/guides
git commit -m "feat: add four illustrated shopping guides"
```

---

### Task 4: Track Affiliate and ImportTaxPH Clicks

**Files:**
- Create: `src/components/TrackedSisterSiteLink.tsx`
- Modify: `src/components/ExternalAffiliateLink.tsx`
- Modify: `src/components/ImportTaxCallout.tsx`
- Modify: `src/components/DealCard.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/stores/[slug]/page.tsx`
- Modify: `scripts/check-links.mjs`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `ExternalAffiliateLink` with optional `placement?: string`.
- Produces: `TrackedSisterSiteLink({ href, sourceSlug, placement, children, className })`.
- Produces: `ImportTaxCallout({ sourceSlug, platform?, placement? })`.
- Emits: `affiliate_click` and `sister_site_click` using `track` from `@vercel/analytics/react`.

- [ ] **Step 1: Add failing event tests**

Append tests that stub `window.va`, click without blocking navigation, and inspect the captured event:

```ts
test("deal card emits an affiliate_click event", async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/deals")
  const popupPromise = page.waitForEvent("popup")
  await page.locator('a[rel*="sponsored"]').first().click()
  const popup = await popupPromise
  await popup.close()
  const events = await page.evaluate(() =>
    (window as typeof window & { __events: Array<{ type: string; payload: { name?: string } }> }).__events
  )
  expect(events.some((event) => event.type === "event" && event.payload.name === "affiliate_click")).toBe(true)
})

test("Temu guide links to the tracked Temu ImportTaxPH calculator", async ({ page }) => {
  await page.goto("/blog/temu-shopping-guide-philippines")
  const link = page.getByRole("link", { name: /ImportTaxPH/i }).first()
  await expect(link).toHaveAttribute("href", /importtaxph\.com\/temu-import-tax/)
  await expect(link).toHaveAttribute("href", /utm_source=sulitscan/)
})
```

- [ ] **Step 2: Run both tests and confirm they fail**

```powershell
npx playwright test -g "affiliate_click|tracked Temu ImportTaxPH"
```

Expected: no custom event is captured; ImportTaxPH still points to the untracked homepage.

- [ ] **Step 3: Make affiliate tracking non-blocking**

Add `"use client"`, import `track` from `@vercel/analytics/react`, add `placement?: string`, and compose the caller's `onClick`:

```tsx
const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (event) => {
  try {
    const source = window.location.pathname.split("/").filter(Boolean).pop() ?? "home"
    track("affiliate_click", {
      platform,
      placement: placement ?? "affiliate-link",
      source,
    })
  } catch {
    // Analytics must never prevent outbound navigation.
  }
  onClick?.(event)
}
```

Pass `onClick={handleClick}` to the anchor. Do not include the destination URL or product title in event properties.

- [ ] **Step 4: Add the tracked sister-site link**

Create `src/components/TrackedSisterSiteLink.tsx`:

```tsx
"use client"

import type { AnchorHTMLAttributes } from "react"
import { track } from "@vercel/analytics/react"

interface TrackedSisterSiteLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  sourceSlug: string
  placement: string
}

export default function TrackedSisterSiteLink({
  href,
  sourceSlug,
  placement,
  children,
  onClick,
  ...rest
}: TrackedSisterSiteLinkProps) {
  const url = new URL(href)
  url.searchParams.set("utm_source", "sulitscan")
  url.searchParams.set("utm_medium", "referral")
  url.searchParams.set("utm_campaign", "cross_site")
  url.searchParams.set("utm_content", `${sourceSlug}:${placement}`)

  return (
    <a
      {...rest}
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        try {
          track("sister_site_click", {
            destination: "importtaxph",
            placement,
            source: sourceSlug,
          })
        } catch {
          // Analytics must never prevent outbound navigation.
        }
        onClick?.(event)
      }}
    >
      {children}
    </a>
  )
}
```

- [ ] **Step 5: Update the ImportTaxPH callout**

Change the component signature to:

```ts
interface ImportTaxCalloutProps {
  sourceSlug: string
  platform?: "temu" | "general"
  placement?: string
}
```

Use `https://importtaxph.com/temu-import-tax` when `platform === "temu"`; otherwise use `https://importtaxph.com/`. Render the link through `TrackedSisterSiteLink` and preserve the estimate disclaimer.

- [ ] **Step 6: Use the tracked components consistently**

- Replace `DealCard`'s raw `deal.affiliateLink` anchor with `ExternalAffiliateLink` and `placement="deal-card"`.
- Add `placement="deal-detail-primary"` to the existing deal-detail component use.
- Replace the three affiliate store CTAs touched in `src/app/stores/[slug]/page.tsx` with `ExternalAffiliateLink` and placements `store-hero`, `store-hero-gradient`, and `store-sidebar`.
- Keep one Temu store ImportTaxPH block in the main column as `ImportTaxCallout sourceSlug="store-temu" platform="temu" placement="store-main"` and delete the duplicate sidebar block.
- In the blog page, render `ImportTaxCallout sourceSlug={slug} platform="temu" placement="blog-article"` for Temu/overseas guides.
- In `renderInline`, render `TrackedSisterSiteLink` for external URLs whose hostname is `importtaxph.com` or `www.importtaxph.com`, passing the current post slug and `placement="inline-article"`; keep ordinary external links unchanged.
- In `scripts/check-links.mjs`, remove `src/components/DealCard.tsx` from the files that must directly contain the `rel` string, then require `DealCard.tsx` to contain `<ExternalAffiliateLink` so the centralized guard remains meaningful.

- [ ] **Step 7: Run focused tests and typecheck**

```powershell
npm run typecheck
npx playwright test -g "affiliate_click|tracked Temu ImportTaxPH|affiliate links have correct rel"
```

Expected: both commands PASS.

- [ ] **Step 8: Commit analytics and sister-site integration**

```powershell
git add src/components/ExternalAffiliateLink.tsx src/components/TrackedSisterSiteLink.tsx src/components/ImportTaxCallout.tsx src/components/DealCard.tsx src/app/blog/[slug]/page.tsx src/app/stores/[slug]/page.tsx scripts/check-links.mjs tests/smoke.spec.ts
git commit -m "feat: track affiliate and sister-site clicks"
```

---

### Task 5: Correct Sitemap Dates and Add the Distribution Checklist

**Files:**
- Modify: `src/app/sitemap.ts`
- Create: `docs/traffic-growth-checklist.md`
- Modify: `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: `posts[].lastReviewed` and the canonical post list.
- Produces: meaningful article `lastmod` values and a manual operational checklist.

- [ ] **Step 1: Add the failing sitemap test**

```ts
test("sitemap contains reviewed canonical guides and excludes the retired guide", async ({ request }) => {
  const response = await request.get("/sitemap.xml")
  expect(response.status()).toBe(200)
  const xml = await response.text()
  expect(xml).toContain("/blog/best-home-organization-finds-under-500-philippines")
  expect(xml).toMatch(
    /<loc>https:\/\/sulitscan\.com\/blog\/how-to-check-shopee-seller-legit-philippines<\/loc>\s*<lastmod>2026-07-12/
  )
  expect(xml).not.toContain("/blog/how-to-check-if-shopee-seller-is-legit")
})
```

- [ ] **Step 2: Run the test and confirm it fails**

```powershell
npx playwright test -g "sitemap contains reviewed canonical guides"
```

Expected: FAIL because the consolidated article still uses its older publication date for `lastmod`.

- [ ] **Step 3: Make sitemap dates truthful**

In `src/app/sitemap.ts`, compute:

```ts
const newestPostReview = posts.reduce(
  (latest, post) => post.lastReviewed > latest ? post.lastReviewed : latest,
  posts[0]?.lastReviewed ?? "2026-07-12"
)
```

Set only the `/blog` static route's `lastModified` to `new Date(newestPostReview)`. Remove `lastModified: new Date()` from stable static routes, deals, categories, and stores because the data model does not carry a reliable modification date. Change each article route to:

```ts
lastModified: new Date(post.lastReviewed),
```

Keep the current priorities and change frequencies.

- [ ] **Step 4: Write the exact post-publishing checklist**

Create `docs/traffic-growth-checklist.md` with:

```md
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
```

- [ ] **Step 5: Run sitemap and static checks**

```powershell
npx playwright test -g "sitemap contains reviewed canonical guides"
npm run check:links
```

Expected: both commands PASS.

- [ ] **Step 6: Commit technical SEO and operations documentation**

```powershell
git add src/app/sitemap.ts docs/traffic-growth-checklist.md tests/smoke.spec.ts
git commit -m "feat: improve sitemap and publishing workflow"
```

---

### Task 6: Full Verification, Final Review, and Push

**Files:**
- Review: all files changed since commit `945375a`.

**Interfaces:**
- Consumes: all implementation tasks.
- Produces: a verified `main` branch pushed to `origin/main`.

- [ ] **Step 1: Read and follow verification-before-completion**

Do not claim completion based on earlier partial checks. Gather fresh evidence from the exact final tree.

- [ ] **Step 2: Run the repository validation suite**

```powershell
npm run check
```

Expected: lint, typecheck, link guard, affiliate-product guard, product-quality guard, and production build all PASS.

- [ ] **Step 3: Run Playwright against the production build**

```powershell
$server = Start-Process -FilePath "npm.cmd" -ArgumentList "run","start" -WorkingDirectory $PWD -WindowStyle Hidden -PassThru
$env:BASE_URL = "http://localhost:3000"
try { npx playwright test } finally { Stop-Process -Id $server.Id -Force; Remove-Item Env:BASE_URL }
```

Expected: all Chromium tests PASS with zero failures.

- [ ] **Step 4: Inspect every banner and key page**

Use the local image viewer for all four images. Then inspect `/blog`, each new article, the consolidated Shopee article, `/stores/temu`, and one deal page at desktop and mobile widths. Confirm no missing image, overflow, duplicate heading, broken link, irrelevant related content, or affiliate disclosure regression.

- [ ] **Step 5: Review the final diff and repository state**

```powershell
git status --short --branch
git diff 945375a..HEAD --stat
git log --oneline 945375a..HEAD
```

Expected: only approved files changed; no temporary files, screenshots, generated traces, or test artifacts are tracked.

- [ ] **Step 6: Commit any verified final corrections**

If the review required changes, rerun the affected checks and commit only those corrections:

```powershell
git add -- next.config.ts src/data/posts.ts src/lib/blog-recommendations.ts src/app/blog/page.tsx src/app/blog/[slug]/page.tsx src/app/stores/[slug]/page.tsx src/app/sitemap.ts src/components/BlogCard.tsx src/components/DealCard.tsx src/components/ExternalAffiliateLink.tsx src/components/ImportTaxCallout.tsx src/components/TrackedSisterSiteLink.tsx scripts/check-links.mjs tests/smoke.spec.ts docs/traffic-growth-checklist.md public/images/guides
git commit -m "fix: address final growth review"
```

If no corrections were needed, do not create an empty commit.

- [ ] **Step 7: Push directly to main**

```powershell
git push origin main
```

Expected: push succeeds and local `main` matches `origin/main`.

- [ ] **Step 8: Report the outcome**

Summarize the four article URLs, banners, duplicate redirect, recommendation changes, analytics events, ImportTaxPH integration, sitemap behavior, test evidence, commit IDs, and successful push. Explicitly list the Search Console and Bing steps that remain manual.
