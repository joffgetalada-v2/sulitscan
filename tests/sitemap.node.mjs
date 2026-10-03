import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import ts from "typescript"

function loadTypeScriptModule(relativePath, dependencies = {}) {
  const filename = resolve(relativePath)
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  })
  const moduleRecord = { exports: {} }
  const localRequire = (specifier) => {
    if (Object.hasOwn(dependencies, specifier)) return dependencies[specifier]
    throw new Error(`Unexpected dependency ${specifier} from ${relativePath}`)
  }
  new Function("exports", "require", "module", "__filename", "__dirname", outputText)(
    moduleRecord.exports, localRequire, moduleRecord, filename, dirname(filename)
  )
  return moduleRecord.exports
}

const freshness = loadTypeScriptModule("src/lib/deal-freshness.ts")
const deals = loadTypeScriptModule("src/data/deals.ts", { "@/lib/deal-freshness": freshness })
const categories = loadTypeScriptModule("src/data/categories.ts")
const stores = loadTypeScriptModule("src/data/stores.ts")
const posts = loadTypeScriptModule("src/data/posts.ts")
const listing = loadTypeScriptModule("src/lib/deal-listing.ts", { "@/data/deals": deals })
const entityListing = loadTypeScriptModule("src/lib/entity-deal-listing.ts")
const seo = loadTypeScriptModule("src/lib/deal-seo.ts", {
  "@/data/deals": deals, "@/lib/deal-freshness": freshness,
})
const site = loadTypeScriptModule("src/lib/seo.ts")
const dependencies = {
  "@/data/deals": deals, "@/data/categories": categories, "@/data/stores": stores,
  "@/data/posts": posts, "@/lib/deal-listing": listing,
  "@/lib/entity-deal-listing": entityListing, "@/lib/deal-freshness": freshness,
  "@/lib/deal-seo": seo, "@/lib/seo": site,
}
const builder = existsSync(resolve("src/lib/sitemap-builder.ts"))
  ? loadTypeScriptModule("src/lib/sitemap-builder.ts", dependencies) : {}
const permanentPaths = [
  "", "/deals", "/categories", "/stores", "/blog", "/tools/checkout-comparison",
  "/sales-calendar", "/about", "/contact", "/affiliate-disclosure", "/privacy-policy",
  "/terms", "/cookie-policy", "/editorial-policy",
]

function entriesAt(now) {
  assert.equal(typeof builder.buildSitemapEntries, "function", "buildSitemapEntries should be exported")
  return builder.buildSitemapEntries(now)
}

test("October empty catalog emits only permanent routes and published blog routes", () => {
  const entries = entriesAt(new Date("2026-10-03T00:00:00.000Z"))
  const expected = [...permanentPaths, ...posts.posts.map((post) => `/blog/${post.slug}`)]
    .map((path) => `${site.siteConfig.url}${path}`)
  assert.equal(entries.length, 14 + posts.posts.length)
  assert.deepEqual(entries.map((entry) => entry.url).sort(), expected.sort())
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length)
  assert.ok(entries.every((entry) => !entry.url.includes("?")))
})

test("historical sitemap emits active editorial deals and only populated canonical pagination", () => {
  const now = new Date("2026-09-05T00:00:00.000Z")
  const entries = entriesAt(now)
  const urls = new Set(entries.map((entry) => entry.url))
  assert.equal(urls.size, entries.length)
  const active = deals.getActiveDeals(now)
  assert.equal(active.length, 169)
  let editorialCount = 0
  for (const deal of deals.deals) {
    const expected = deals.isPublicDeal(deal) && !freshness.isDealExpired(deal, now)
      && !deal.noindex && typeof deal.description === "string" && deal.description.trim().length > 0
    assert.equal(urls.has(`${site.siteConfig.url}/deals/${deal.slug}`), expected, deal.slug)
    if (expected) editorialCount += 1
  }
  assert.ok(editorialCount > 0, "fixture must exercise editorial indexability")
  const expectedPaths = [...permanentPaths, ...posts.posts.map((post) => `/blog/${post.slug}`),
    ...active.filter((deal) => !deal.noindex && deal.description?.trim()).map((deal) => `/deals/${deal.slug}`)]
  for (let page = 2; (page - 1) * 24 < active.length; page += 1) expectedPaths.push(`/deals?page=${page}`)
  const entities = [
    ...categories.categories.filter((category) => category.featured).map((category) => ({
      path: `/categories/${category.slug}`, records: deals.getDealsByCategory(category.slug, now),
    })),
    ...stores.stores.map((store) => ({
      path: `/stores/${store.slug}`, records: deals.getDealsByPlatform(store.name, now),
    })),
  ]
  for (const entity of entities) {
    for (let page = 1; (page - 1) * 24 < entity.records.length; page += 1) {
      expectedPaths.push(`${entity.path}${page > 1 ? `?page=${page}` : ""}`)
    }
  }
  assert.deepEqual([...urls].sort(), expectedPaths.map((path) => `${site.siteConfig.url}${path}`).sort())
  for (const entry of entries) {
    const url = new URL(entry.url)
    assert.equal(url.origin, site.siteConfig.url)
    assert.equal(url.hash, "")
    if (!url.search) continue
    const raw = url.searchParams.get("page")
    assert.equal(url.search, `?page=${Number(raw)}`)
    assert.ok(Number(raw) >= 2)
    const result = url.pathname === "/deals"
      ? listing.resolveDealListing(active, { page: raw })
      : entityListing.resolveEntityDealListing(entities.find((entity) => entity.path === url.pathname).records, raw)
    assert.equal(result.isCanonical, true)
    assert.ok(result.items.length > 0)
  }
})

test("sitemap route uses request-time configuration and one captured clock", () => {
  const captured = []
  const result = [{ url: site.siteConfig.url }]
  const route = loadTypeScriptModule("src/app/sitemap.ts", {
    ...dependencies,
    "@/lib/sitemap-builder": { buildSitemapEntries: (now) => { captured.push(now); return result } },
  })
  assert.equal(route.dynamic, "force-dynamic")
  assert.equal(route.default(), result)
  assert.equal(captured.length, 1)
  assert.ok(captured[0] instanceof Date)
  assert.ok(Number.isFinite(captured[0].getTime()))
})
