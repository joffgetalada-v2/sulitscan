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

const freshness = loadTypeScriptModule("src/lib/deal-freshness.ts")
const dealsModule = loadTypeScriptModule("src/data/deals.ts", {
  "@/lib/deal-freshness": freshness,
})

test("exact checked dates transition from current through reference to expired at UTC day boundaries", () => {
  const label = "Checked June 27, 2026"

  assert.equal(freshness.getDealFreshness(label, new Date("2026-07-11T23:59:59Z")).status, "current")
  assert.equal(freshness.getDealFreshness(label, new Date("2026-07-12T00:00:00Z")).status, "reference")
  assert.equal(freshness.getDealFreshness(label, new Date("2026-09-25T23:59:59Z")).status, "reference")
  assert.equal(freshness.getDealFreshness(label, new Date("2026-09-26T00:00:00Z")).status, "expired")
})

test("month-only datafeed periods remain reference through 90 days after their final UTC day", () => {
  const label = "Affiliate datafeed price, June 2026. Confirm current price on Temu before buying."

  assert.equal(freshness.getDealFreshness(label, new Date("2026-06-01T00:00:00Z")).status, "reference")
  assert.equal(freshness.getDealFreshness(label, new Date("2026-09-28T23:59:59Z")).status, "reference")
  assert.equal(freshness.getDealFreshness(label, new Date("2026-09-29T00:00:00Z")).status, "expired")
})

test("month-only parsing uses the correct leap-year month end", () => {
  const label = "Affiliate datafeed price, February 2024. Confirm current price on Temu before buying."

  assert.equal(freshness.getDealFreshness(label, new Date("2024-05-29T23:59:59Z")).status, "reference")
  assert.equal(freshness.getDealFreshness(label, new Date("2024-05-30T00:00:00Z")).status, "expired")
})

test("future and malformed source periods are expired", () => {
  assert.equal(freshness.getDealFreshness("Checked August 1, 2026", new Date("2026-07-31T12:00:00Z")).status, "expired")
  assert.equal(freshness.getDealFreshness("Affiliate datafeed price, August 2026", new Date("2026-07-31T12:00:00Z")).status, "expired")
  assert.equal(freshness.getDealFreshness("Verified sometime recently", new Date("2026-07-31T12:00:00Z")).status, "expired")
})

test("only complete trimmed catalog freshness labels are accepted", () => {
  const now = new Date("2026-07-31T12:00:00Z")

  assert.equal(freshness.getDealFreshness("  Checked June 27, 2026  ", now).status, "reference")
  assert.equal(
    freshness.getDealFreshness("Affiliate datafeed price, June 2026. Confirm current price on Temu before buying.", now).status,
    "reference"
  )

  for (const label of [
    "Unverified marketing copy: June 2026",
    "Last checked sample, June 2026",
    "status checked June 27, 2026",
  ]) {
    assert.equal(freshness.getDealFreshness(label, now).status, "expired")
  }
})

test("the parser distinguishes exact and month-only catalog labels", () => {
  assert.deepEqual(freshness.parseDealLastChecked("Checked June 27, 2026"), {
    kind: "exact",
    date: new Date("2026-06-27T00:00:00Z"),
  })
  assert.deepEqual(freshness.parseDealLastChecked("Affiliate datafeed price, June 2026. Confirm current price on Temu before buying."), {
    kind: "month",
    year: 2026,
    month: 5,
  })
  assert.equal(freshness.parseDealLastChecked("not a catalog label"), undefined)
})

test("expired public deals leave active lists but remain available by direct slug", () => {
  const activeFixture = dealsModule.getActiveDeals()[0]
  const expiredFixture = {
    ...activeFixture,
    id: "freshness-test-expired-public-deal",
    slug: "freshness-test-expired-public-deal",
    lastChecked: "Checked January 1, 2000",
  }

  dealsModule.deals.push(expiredFixture)
  try {
    assert.ok(!dealsModule.getActiveDeals().some((deal) => deal.slug === expiredFixture.slug))
    assert.equal(dealsModule.getDealBySlug(expiredFixture.slug), expiredFixture)
  } finally {
    dealsModule.deals.pop()
  }
})

test("only noncurrent price-sensitive reasons are neutralized", () => {
  const staleDeal = {
    lastChecked: "Checked June 27, 2026",
    category: "Home",
    platform: "Shopee PH",
  }
  const now = new Date("2026-07-12T00:00:00Z")
  const neutral = "Explore Home options from Shopee PH and review the live listing, seller details, and delivery terms before buying."

  for (const reason of [
    "Only ₱499 today.",
    "30% off while stock lasts.",
    "PHP 499 today.",
    "499 pesos today.",
    "A low price for this category.",
    "Discount applies at checkout.",
    "Save on a bundle.",
    "Cost is lower than usual.",
  ]) {
    assert.equal(freshness.getFreshnessSafeReason({ ...staleDeal, reason }, now), neutral)
  }

  const qualitative = "Compact organizer with a washable lining; review the size chart before ordering."
  assert.equal(freshness.getFreshnessSafeReason({ ...staleDeal, reason: qualitative }, now), qualitative)
  assert.equal(
    freshness.getFreshnessSafeReason({ ...staleDeal, reason: "Only ₱499 today." }, new Date("2026-07-11T00:00:00Z")),
    "Only ₱499 today."
  )
})
