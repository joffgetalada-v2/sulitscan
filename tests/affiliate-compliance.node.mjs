import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import ts from "typescript"

function loadTypeScriptModule(relativePath) {
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
  const evaluate = new Function("exports", "require", "module", "__filename", "__dirname", outputText)
  evaluate(moduleRecord.exports, () => {
    throw new Error(`Unexpected dependency from ${relativePath}`)
  }, moduleRecord, filename, dirname(filename))
  return moduleRecord.exports
}

const bannersModule = loadTypeScriptModule("src/data/partner-banners.ts")
const dealsModule = loadTypeScriptModule("src/data/deals.ts")

test("only publicly active deals are exposed by slug", () => {
  assert.equal(dealsModule.getDealBySlug("summer-dress-shein"), undefined)
  assert.equal(dealsModule.getDealBySlug("xiaomi-smart-band-9-shopee"), undefined)
  assert.ok(dealsModule.getDealBySlug(dealsModule.getActiveDeals()[0].slug))
})

test("only active partner offers are exposed to public pages", () => {
  assert.ok(Array.isArray(bannersModule.activePartnerBanners), "activePartnerBanners export must exist")
  assert.ok(bannersModule.activePartnerBanners.every((banner) => banner.status === "active"))
  assert.ok(bannersModule.homePartnerBanners.every((banner) => banner.status === "active"))
  assert.ok(!bannersModule.activePartnerBanners.some((banner) => /shein|clnkcce/i.test(`${banner.advertiserName} ${banner.href}`)))
})

test("blocked SHEIN creative is not published as a public asset", () => {
  assert.equal(existsSync(resolve("public/banners/partners/shein.jpg")), false)
})

test("commercial policy pages disclose sponsored advertiser links and affiliate-network tracking", () => {
  const affiliateDisclosure = readFileSync(resolve("src/app/affiliate-disclosure/page.tsx"), "utf8")
  const privacyPolicy = readFileSync(resolve("src/app/privacy-policy/page.tsx"), "utf8")
  const cookiePolicy = readFileSync(resolve("src/app/cookie-policy/page.tsx"), "utf8")

  assert.match(affiliateDisclosure, /Sponsored Advertiser Offers/)
  assert.match(privacyPolicy, /affiliate network/i)
  assert.match(cookiePolicy, /affiliate network/i)
  assert.doesNotMatch(cookiePolicy, /does not currently run display advertising/i)
})
