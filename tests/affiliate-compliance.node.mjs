import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
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

const bannersModule = loadTypeScriptModule("src/data/partner-banners.ts")
const freshnessModule = loadTypeScriptModule("src/lib/deal-freshness.ts")
const dealsModule = loadTypeScriptModule("src/data/deals.ts", {
  "@/lib/deal-freshness": freshnessModule,
})
const storesModule = loadTypeScriptModule("src/data/stores.ts")

const OCTOBER_SHOPEE_FEED_SLUGS = [
  "babyflo-oatmeal-bath-500ml-shopee",
  "ugreen-iphone-screen-protector-2-pack-shopee",
  "shigetsu-mens-leather-sling-bag-shopee",
  "ugreen-45w-20000mah-power-bank-shopee",
  "tiny-buds-baby-cotton-buds-3-pack-shopee",
  "play-doh-four-tub-color-set-shopee",
  "energizer-maxi-aa-aaa-battery-charger-shopee",
  "nakd-cameron-cotton-linen-top-shopee",
  "bamboo-outdoor-roller-blinds-shopee",
  "under-desk-cable-management-tray-shopee",
  "nordic-wooden-picture-frame-shopee",
  "retractable-ceiling-cleaning-brush-shopee",
  "aquaflask-accessories-tote-bag-shopee",
  "aquaflask-22oz-wide-mouth-bottle-shopee",
  "bobson-mens-slim-straight-jeans-shopee",
  "momcozy-white-noise-night-light-shopee",
  "nonstick-springform-cake-pan-set-shopee",
  "3d-tower-fan-tf10ss-shopee",
]

test("only publicly active deals are exposed by slug", () => {
  assert.equal(dealsModule.getDealBySlug("summer-dress-shein"), undefined)
  assert.equal(dealsModule.getDealBySlug("xiaomi-smart-band-9-shopee"), undefined)
  assert.ok(dealsModule.getDealBySlug(dealsModule.getActiveDeals(new Date("2026-09-05T00:00:00.000Z"))[0].slug))
})

test("only active partner offers are exposed to public pages", () => {
  assert.ok(Array.isArray(bannersModule.activePartnerBanners), "activePartnerBanners export must exist")
  assert.ok(bannersModule.activePartnerBanners.every((banner) => banner.status === "active"))
  assert.ok(bannersModule.homePartnerBanners.every((banner) => banner.status === "active"))
  assert.ok(!bannersModule.activePartnerBanners.some((banner) => /shein|clnkcce/i.test(`${banner.advertiserName} ${banner.href}`)))
})

test("active stores use the approved tracked affiliate destinations", () => {
  assert.deepEqual(
    Object.fromEntries(storesModule.stores.map((store) => [store.name, store.affiliateLink])),
    {
      "Shopee PH": "https://invl.me/clnkccq",
      "Sephora PH": "https://invl.me/clnkccv",
    }
  )
})

test("October Shopee refresh publishes only reviewed, current feed records", () => {
  const refreshed = OCTOBER_SHOPEE_FEED_SLUGS.map((slug) => dealsModule.getDealBySlug(slug))
  assert.ok(refreshed.every(Boolean), "every reviewed Shopee feed slug must be public")

  for (const deal of refreshed) {
    assert.equal(deal.platform, "Shopee PH")
    assert.equal(deal.lastChecked, "Checked October 12, 2026")
    assert.equal(deal.isDemo, false)
    assert.ok(deal.description?.trim(), `${deal.slug}: requires original buyer guidance`)
    assert.match(deal.affiliateLink, /^https:\/\/invol\.co\/aff_m\?offer_id=103880&aff_id=1060158&source=feed&url=/)
    assert.match(new URL(deal.affiliateLink).searchParams.get("url"), /^https:\/\/shope\.ee\/an_redir\?origin_link=/)
    assert.match(deal.imageUrl, /^https:\/\/cf\.shopee\.ph\/file\//)
    assert.match(deal.sourceSellerStatus, /^(Official|Preferred) shop$/)
    assert.ok(deal.sourceItemRating >= 4.8, `${deal.slug}: item rating below the editorial floor`)
    assert.ok(deal.sourceShopRating >= 4.8, `${deal.slug}: shop rating below the editorial floor`)
    assert.ok(deal.sourceUnitsSold >= 10, `${deal.slug}: insufficient feed sales history`)
    assert.ok(deal.sourceStock > 0, `${deal.slug}: feed stock must be positive`)
  }

  const activeShopee = dealsModule.getActiveDeals(new Date("2026-10-12T00:00:00.000Z"))
    .filter((deal) => deal.platform === "Shopee PH")
  assert.deepEqual(activeShopee.map((deal) => deal.slug).sort(), [...OCTOBER_SHOPEE_FEED_SLUGS].sort())
  assert.equal(new Set(activeShopee.map((deal) => deal.sourceItemId)).size, OCTOBER_SHOPEE_FEED_SLUGS.length)
})

test("Shoplinks stays disabled until its eligibility list includes Philippine advertisers", () => {
  const layout = readFileSync(resolve("src/app/layout.tsx"), "utf8")
  assert.doesNotMatch(layout, /xhr\.invl\.co\/magic\/1060158\/auto\.js/i)
})

test("terminated Temu affiliate inventory is fully retired", () => {
  assert.equal(dealsModule.deals.some((deal) => deal.platform === "Temu"), false)
  assert.equal(storesModule.stores.some((store) => store.name === "Temu" || store.slug === "temu"), false)

  const deployableSource = [
    "src/data/deals.ts",
    "src/data/stores.ts",
    "src/app/affiliate-disclosure/page.tsx",
  ].map((path) => readFileSync(resolve(path), "utf8")).join("\n")

  assert.doesNotMatch(deployableSource, /temu\.to\//i)
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
  assert.doesNotMatch(publicPartnerUi, /Lazada|AliExpress|Temu/i)
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
