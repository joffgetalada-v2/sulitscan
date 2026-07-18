import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import ts from "typescript"

function loadTypeScriptModule(relativePath, dependencies = {}) {
  const filename = resolve(relativePath)
  const source = readFileSync(filename, "utf8")
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  })
  const moduleRecord = { exports: {} }
  const localRequire = (specifier) => {
    if (Object.hasOwn(dependencies, specifier)) return dependencies[specifier]
    throw new Error(`Unexpected dependency ${specifier} from ${relativePath}`)
  }
  const evaluate = new Function("exports", "require", "module", "__filename", "__dirname", outputText)
  evaluate(moduleRecord.exports, localRequire, moduleRecord, filename, dirname(filename))
  return moduleRecord.exports
}

const dealsModule = loadTypeScriptModule("src/data/deals.ts")
const seoModule = loadTypeScriptModule("src/lib/deal-seo.ts", {
  "@/data/deals": dealsModule,
})
const listingModule = loadTypeScriptModule("src/lib/deal-listing.ts", {
  "@/data/deals": dealsModule,
})

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

function loadSeoModuleForDeals(activeDeals) {
  return loadTypeScriptModule("src/lib/deal-seo.ts", {
    "@/data/deals": { getActiveDeals: () => activeDeals },
  })
}

test("deal SEO title skips an overlong first token without splitting it", () => {
  const longFirstToken = "UninterruptedProductIdentifierThatExceedsTheAvailableTitlePhraseLength"
  const deal = {
    slug: "long-token-desk-organizer",
    title: `${longFirstToken} Desk Organizer`,
    platform: "Shopee PH",
    category: "Home",
  }
  const fixtureSeoModule = loadSeoModuleForDeals([deal])

  const title = fixtureSeoModule.buildDealSeoTitle(deal)

  assert.equal(title, "Desk Organizer – Shopee PH | SulitScan PH")
  assert.ok(!title.includes(longFirstToken.slice(0, 20)))
})

test("deal SEO titles add stable hashes when truncated product phrases collide", () => {
  const dealsWithCollidingTitles = [
    {
      slug: "portable-organizer-bedroom-a",
      title: "Portable Multi-Function Organizer Storage Basket for Bedroom A",
      platform: "Shopee PH",
      category: "Home",
    },
    {
      slug: "portable-organizer-bedroom-b",
      title: "Portable Multi-Function Organizer Storage Basket for Bedroom B",
      platform: "Shopee PH",
      category: "Home",
    },
  ]
  const fixtureSeoModule = loadSeoModuleForDeals(dealsWithCollidingTitles)
  const titles = dealsWithCollidingTitles.map(fixtureSeoModule.buildDealSeoTitle)

  assert.notEqual(titles[0], titles[1])
  assert.ok(titles.every((title) => / #\w+ – Shopee PH \| SulitScan PH$/.test(title)))
  assert.ok(titles.every((title) => title.length <= 65))
})

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
