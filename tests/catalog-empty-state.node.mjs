import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import ts from "typescript"

const require = createRequire(import.meta.url)
function createLoader(dependencies = {}) {
  const cache = new Map()
  return function load(relativePath) {
    const filename = resolve(relativePath)
    if (cache.has(filename)) return cache.get(filename)
    const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
    })
    const record = { exports: {} }
    const localRequire = (specifier) => {
      if (Object.hasOwn(dependencies, specifier)) return dependencies[specifier]
      if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return require(specifier)
      const base = specifier.startsWith("@/") ? resolve("src", specifier.slice(2))
        : resolve(filename, "..", specifier)
      return load([base, `${base}.ts`, `${base}.tsx`].find(existsSync))
    }
    new Function("exports", "require", "module", outputText)(record.exports, localRequire, record)
    cache.set(filename, record.exports)
    return record.exports
  }
}
const load = createLoader()
const deals = load("src/data/deals.ts")
const listing = load("src/lib/deal-listing.ts")
const october = new Date("2026-10-03T00:00:00.000Z")
const historical = new Date("2026-09-05T00:00:00.000Z")
const { ImageConfigContext } = require("next/dist/shared/lib/image-config-context.shared-runtime")
const { imageConfigDefault } = require("next/dist/shared/lib/image-config")
const imageConfig = { ...imageConfigDefault, ...load("next.config.ts").default.images }
const render = (Component, props) => renderToStaticMarkup(React.createElement(
  ImageConfigContext.Provider, { value: imageConfig }, React.createElement(Component, props)))
const scannerHelper = existsSync(resolve("src/lib/deal-scanner.ts"))
  ? load("src/lib/deal-scanner.ts") : {}
function slidesFor(records, limit, now = historical) {
  assert.equal(typeof scannerHelper.getDealScannerSlides, "function", "server slide selector must exist")
  return scannerHelper.getDealScannerSlides(records, limit, now)
}

test("scanner client does not pull the catalog or freshness calculation across the boundary", () => {
  const source = readFileSync("src/components/DealScannerVisual.tsx", "utf8")
  assert.doesNotMatch(source, /from\s+["']@\/data\/deals["']/)
  assert.doesNotMatch(source, /getDealFreshness|getActiveDeals/)
})

test("server slides deduplicate categories, cap payload, and serialize display fields only", () => {
  const active = deals.getActiveDeals(historical)
  const slides = slidesFor(active, 2)
  assert.equal(slides.length, 2)
  assert.equal(new Set(slides.map((slide) => slide.category)).size, 2)
  assert.equal(slides[0].slug, active[0].slug)
  assert.deepEqual(JSON.parse(JSON.stringify(slides)), slides)
  for (const slide of slides) {
    assert.deepEqual(Object.keys(slide).sort(), ["category", "discount", "freshnessStatus", "imageGradient",
      "imageUrl", "originalPrice", "salePrice", "slug", "sulitScore", "title"].sort())
    assert.equal(slide.freshnessStatus, "reference")
  }
  assert.ok(slidesFor(active, 100).length <= 6)
  assert.equal(slidesFor(active, 0).length, 0)
  assert.equal(slidesFor(active, -1).length, 0)
  assert.ok(slidesFor(active, Number.NaN).length <= 6)
  assert.deepEqual(slidesFor(deals.getActiveDeals(october)), [])
})

test("empty unfiltered deals offer refresh paths with no meaningless reset action", () => {
  const grid = load("src/components/DealsGrid.tsx").default
  const html = render(grid, { listing: listing.resolveDealListing(deals.getActiveDeals(october), {}),
    categories: ["All"], stores: ["All"] })
  assert.match(html, /listings are being refreshed/i)
  assert.doesNotMatch(html, /Clear (?:all )?filters|No deals match/)
  for (const path of ["/blog", "/tools/checkout-comparison", "/stores/temu", "/stores/shopee-ph", "/stores/sephora-ph"]) {
    assert.ok(html.includes(`href="${path}"`), path)
  }
})

test("filtered no-match deals preserve specific guidance and a reset action", () => {
  const grid = load("src/components/DealsGrid.tsx").default
  const html = render(grid, { listing: listing.resolveDealListing(deals.getActiveDeals(october), { q: "tripod" }),
    categories: ["All"], stores: ["All"] })
  assert.match(html, /No deals match your current filters/)
  assert.match(html, /Clear all filters/)
})

test("empty scanner provides a price-free buyer checklist with useful destinations", () => {
  const html = render(load("src/components/DealScannerVisual.tsx").default, { slides: [] })
  assert.match(html, /Before you buy/)
  assert.ok(html.includes('href="/blog"'))
  assert.ok(html.includes('href="/tools/checkout-comparison"'))
  assert.doesNotMatch(html, /₱|%|Saved|OFF|Pause deal preview/)
})

test("historical scanner retains reference treatment and accessible slide controls", () => {
  const html = render(load("src/components/DealScannerVisual.tsx").default,
    { slides: slidesFor(deals.getActiveDeals(historical)) })
  assert.match(html, /Reference price/)
  assert.match(html, /Foldable Silicone Water Bottle \(Leak-Proof, Reusable\)/)
  assert.match(html, /₱107/)
  assert.doesNotMatch(html, /₱289|63%/)
  assert.match(html, /Show slide 1/)
  assert.match(html, /Pause deal preview/)
  assert.doesNotMatch(html, /Saved|% OFF/)
})

test("zero-inventory hero sends visitors to guides", () => {
  const html = render(load("src/components/Hero.tsx").default, { activeDealCount: 0, scannerSlides: [] })
  assert.match(html, /href="\/blog"[^>]*>[\s\S]*?Browse Guides/)
  assert.doesNotMatch(html, /0\+ curated deal notes/)
})

test("blog details regenerate time-sensitive recommendations daily", () => {
  assert.equal(load("src/app/blog/[slug]/page.tsx").revalidate, 86400)
})

async function renderBlogAt(slug, now) {
  const freshness = load("src/lib/deal-freshness.ts")
  // Inject the historical clock into real selectors/card freshness, without
  // mutating global Date or any catalog record. Render the actual route and cards.
  const isolatedLoad = createLoader({
    "@/data/deals": { ...deals, getActiveDeals: () => deals.getActiveDeals(now) },
    "@/lib/deal-freshness": {
      ...freshness,
      getDealFreshness: (label) => freshness.getDealFreshness(label, now),
      getFreshnessSafeReason: (deal, _clock, state) => freshness.getFreshnessSafeReason(deal, now, state),
    },
  })
  const post = isolatedLoad("src/data/posts.ts").getPostBySlug(slug)
  assert.ok(post)
  const expected = isolatedLoad("src/lib/blog-recommendations.ts").getRelatedDealsForPost(post)
  const route = isolatedLoad("src/app/blog/[slug]/page.tsx").default
  const tree = await route({ params: Promise.resolve({ slug }) })
  const html = renderToStaticMarkup(React.createElement(ImageConfigContext.Provider, { value: imageConfig }, tree))
  const region = html.match(/<section[^>]*aria-labelledby="related-deals-heading"[^>]*>[\s\S]*?<\/section>/)?.[0]
  return { html, region, expected }
}

for (const slug of ["best-home-organization-finds-under-500-philippines", "cookware-sets-philippines-buying-guide"]) {
  test(`${slug} renders the real positive recommendation block and cards at the historical clock`, async () => {
    const { region, expected } = await renderBlogAt(slug, historical)
    assert.equal(expected.length, 3, "historical fixture must supply three eligible active products")
    assert.ok(region, "the real route must render its recommendations section")
    assert.match(region, /<h2[^>]*id="related-deals-heading"[^>]*>Related deals to check<\/h2>/)
    assert.equal((region.match(/<article\b/g) ?? []).length, expected.length)
    for (const deal of expected) {
      assert.ok(region.includes(`href="/deals/${deal.slug}"`), deal.slug)
      const escapedTitle = renderToStaticMarkup(React.createElement("span", null, deal.title)).slice(6, -7)
      assert.ok(region.includes(escapedTitle), deal.title)
    }
    assert.match(region, /Reference price/)
    assert.doesNotMatch(region, /\d+% OFF|Saved/)
  })

  test(`${slug} omits the real recommendation block once the same catalog is expired`, async () => {
    const { html, region, expected } = await renderBlogAt(slug, october)
    assert.deepEqual(expected, [])
    assert.equal(region, undefined)
    assert.doesNotMatch(html, /related-deals-heading|Related deals to check/)
    assert.match(html, /More shopping guides/)
  })
}
