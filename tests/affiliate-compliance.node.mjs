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

test("AdSense disclosures cover Google advertising data and consent controls", () => {
  const privacyPolicy = readFileSync(resolve("src/app/privacy-policy/page.tsx"), "utf8")
  const cookiePolicy = readFileSync(resolve("src/app/cookie-policy/page.tsx"), "utf8")
  const editorialPolicy = readFileSync(resolve("src/app/editorial-policy/page.tsx"), "utf8")
  const readinessGuide = readFileSync(resolve("docs/adsense-readiness.md"), "utf8")

  assert.match(privacyPolicy, /Google AdSense/i)
  assert.match(privacyPolicy, /web beacon/i)
  assert.match(privacyPolicy, /IP address/i)
  assert.match(privacyPolicy, /Ad Settings/i)
  assert.match(cookiePolicy, /Google-certified consent\s+management platform/i)
  assert.match(cookiePolicy, /personalized ads/i)
  assert.doesNotMatch(privacyPolicy, /Analytics cookies/i)
  assert.doesNotMatch(cookiePolicy, />Analytics Cookies</i)
  assert.match(cookiePolicy, /Vercel Analytics.*does not use cookies/is)
  assert.match(cookiePolicy, /will not enable AdSense serving.*until.*Google-certified/is)
  assert.match(editorialPolicy, /never ask visitors to click ads/i)
  assert.match(editorialPolicy, /more advertising than publisher content/i)
  assert.doesNotMatch(`${privacyPolicy}\n${cookiePolicy}`, /preparing to (use|enable).*AdSense/i)
  assert.doesNotMatch(cookiePolicy, /Session and preference cookies required/i)
  assert.match(readinessGuide, /Auto ads/i)
  assert.match(readinessGuide, /low ad load/i)
})

test("public partner UI contains active coverage instead of unfinished store promotions", () => {
  const storesPage = readFileSync(resolve("src/app/stores/page.tsx"), "utf8")
  const affiliateDisclosure = readFileSync(resolve("src/app/affiliate-disclosure/page.tsx"), "utf8")
  const footer = readFileSync(resolve("src/components/Footer.tsx"), "utf8")
  const publicPartnerUi = `${storesPage}\n${affiliateDisclosure}\n${footer}`

  assert.doesNotMatch(publicPartnerUi, /Coming Soon/i)
  assert.doesNotMatch(publicPartnerUi, /Lazada|AliExpress/i)
  assert.match(publicPartnerUi, /Temu/)
  assert.match(publicPartnerUi, /Shopee PH/)
  assert.match(publicPartnerUi, /Sephora PH/)
})

test("article trust panel exposes the publisher process and correction paths", () => {
  const articlePage = readFileSync(resolve("src/app/blog/[slug]/page.tsx"), "utf8")
  const trustPanel = readFileSync(resolve("src/components/ArticleTrustPanel.tsx"), "utf8")

  assert.match(articlePage, /ArticleTrustPanel/)
  assert.match(trustPanel, /desk-researched/i)
  assert.match(trustPanel, /hands-on testing/i)
  assert.match(trustPanel, /href="\/about"/)
  assert.match(trustPanel, /href="\/editorial-policy"/)
  assert.match(trustPanel, /href="\/contact"/)
})
