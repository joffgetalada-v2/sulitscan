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

const freshnessModule = loadTypeScriptModule("src/lib/deal-freshness.ts")
const dealsModule = loadTypeScriptModule("src/data/deals.ts", {
  "@/lib/deal-freshness": freshnessModule,
})
const searchModule = loadTypeScriptModule("src/lib/assistant/deal-search.ts", {
  "@/data/deals": dealsModule,
})
const rateLimitModule = loadTypeScriptModule("src/lib/assistant/rate-limit.ts")

const activeDeals = dealsModule.getActiveDeals()

test("query parser extracts max price from English and Taglish phrasing", () => {
  assert.equal(searchModule.parseDealQuery("gift for mom under 500 pesos").maxPrice, 500)
  assert.equal(searchModule.parseDealQuery("hanggang 1,000 lang budget ko").maxPrice, 1000)
  assert.equal(searchModule.parseDealQuery("500 pesos pababa na organizer").maxPrice, 500)
  assert.equal(searchModule.parseDealQuery("below ₱300").maxPrice, 300)
  assert.equal(searchModule.parseDealQuery("may sulit ba na tumbler?").maxPrice, undefined)
})

test("query parser extracts keyword tokens and Taglish synonyms", () => {
  const query = searchModule.parseDealQuery("regalo para kay mama, mura lang")
  assert.ok(query.tokens.includes("gift"), "regalo must map to gift")
  const kitchen = searchModule.parseDealQuery("pang-kusina na gamit")
  assert.ok(kitchen.tokens.includes("kusina") || kitchen.tokens.includes("kitchen"))
})

test("search respects the price ceiling as a hard constraint", () => {
  const results = searchModule.searchDeals(activeDeals, "gift ideas under 500 pesos")
  assert.ok(results.length > 0, "catalog should have gift matches under 500")
  for (const { deal } of results) {
    assert.ok(deal.salePrice <= 500, `${deal.slug} exceeds the ₱500 ceiling`)
  }
})

test("search returns at most the context cap and never suspicious discounts", () => {
  const results = searchModule.searchDeals(activeDeals, "home kitchen organizer storage finds")
  assert.ok(results.length <= searchModule.MAX_CONTEXT_DEALS)
  assert.ok(results.length > 0)
  for (const { deal } of results) {
    assert.ok(!dealsModule.isSuspiciousDiscount(deal), `${deal.slug} is a suspicious-discount listing`)
  }
})

test("taglish tumbler question finds the real tumbler listing", () => {
  const results = searchModule.searchDeals(activeDeals, "may sulit ba na tumbler?")
  assert.ok(
    results.some(({ deal }) => deal.title.toLowerCase().includes("tumbler")),
    "expected a tumbler deal in results"
  )
})

test("price-only questions fall back to top-scored deals inside the ceiling", () => {
  const results = searchModule.searchDeals(activeDeals, "may sulit ba under 300?")
  assert.ok(results.length > 0)
  for (const { deal } of results) assert.ok(deal.salePrice <= 300)
})

test("nonsense questions return no matches instead of padding", () => {
  const results = searchModule.searchDeals(activeDeals, "zzzz qqqq xyzzy")
  assert.deepEqual(results, [])
})

test("context lines expose only safe fields with an internal url", () => {
  const [first] = searchModule.searchDeals(activeDeals, "kitchen")
  const parsed = JSON.parse(searchModule.dealToContextLine(first.deal))
  assert.deepEqual(
    Object.keys(parsed).sort(),
    ["category", "note", "referencePricePhp", "sulitScore", "store", "title", "url"].sort()
  )
  assert.match(parsed.url, /^\/deals\/[a-z0-9-]+$/)
  assert.ok(!("affiliateLink" in parsed), "affiliate links must not be sent to the model")
})

test("rate limiter allows a burst then blocks within the window", () => {
  rateLimitModule.resetRateLimiter()
  const now = 1_000_000
  for (let i = 0; i < 10; i++) {
    assert.equal(rateLimitModule.isRateLimited("1.2.3.4", now + i * 100), false, `request ${i} should pass`)
  }
  assert.equal(rateLimitModule.isRateLimited("1.2.3.4", now + 2_000), true, "11th request must be blocked")
  assert.equal(rateLimitModule.isRateLimited("5.6.7.8", now + 2_000), false, "other visitors unaffected")
  assert.equal(rateLimitModule.isRateLimited("1.2.3.4", now + 61_100), false, "window must slide open again")
  rateLimitModule.resetRateLimiter()
})

test("assistant route file keeps the key server-side and the model current", () => {
  const routeSource = readFileSync(resolve("src/app/api/assistant/route.ts"), "utf8")
  assert.match(routeSource, /claude-haiku-4-5/, "route must use the fast low-cost model")
  assert.match(routeSource, /process\.env\.ANTHROPIC_API_KEY/, "route must gate on the env key")
  assert.doesNotMatch(routeSource, /sk-ant/, "no literal API key material in the route")

  const widgetSource = readFileSync(resolve("src/components/assistant/SulitAssistant.tsx"), "utf8")
  assert.doesNotMatch(widgetSource, /ANTHROPIC|sk-ant|apiKey/i, "client component must not touch API credentials")
  const layoutSource = readFileSync(resolve("src/app/layout.tsx"), "utf8")
  assert.match(layoutSource, /SulitAssistant/, "widget must be mounted in the root layout")
})
