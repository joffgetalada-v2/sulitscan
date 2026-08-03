import assert from "node:assert/strict"
import { createHash } from "node:crypto"
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

const postsModule = loadTypeScriptModule("src/data/posts.ts")
const freshnessModule = loadTypeScriptModule("src/lib/deal-freshness.ts")
const dealsModule = loadTypeScriptModule("src/data/deals.ts", {
  "@/lib/deal-freshness": freshnessModule,
})
const recommendationsModule = loadTypeScriptModule("src/lib/blog-recommendations.ts", {
  "@/data/deals": dealsModule,
})

const currentPost = postsModule.getPostBySlug("how-to-check-shopee-seller-legit-philippines")
assert.ok(currentPost, "canonical Shopee seller post fixture must exist")

const broadDealPost = {
  ...currentPost,
  slug: "shopee-home-gift-under-500",
  title: "Shopee home gift ideas under 500",
  tags: ["shopee", "home", "gift", "under-500"],
}

test("getRelatedPosts normalizes count to an integer from zero through three", () => {
  for (const [count, expected] of [
    [-1, 0],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
    [1.9, 1],
    [99, 3],
  ]) {
    assert.equal(postsModule.getRelatedPosts(currentPost, count).length, expected)
  }
})

test("getRelatedDealsForPost normalizes count to an integer from zero through three", () => {
  for (const [count, expected] of [
    [-1, 0],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
    [1.9, 1],
    [99, 3],
  ]) {
    assert.equal(recommendationsModule.getRelatedDealsForPost(broadDealPost, count).length, expected)
  }
})

test("post recommendations are unique and deterministic", () => {
  const first = postsModule.getRelatedPosts(currentPost, 3)
  const second = postsModule.getRelatedPosts(currentPost, 3)
  const ids = first.map((post) => post.id)

  assert.deepEqual(ids, second.map((post) => post.id))
  assert.equal(new Set(ids).size, ids.length)
})

test("deal recommendations are active, non-suspicious, unique, and deterministic", () => {
  const activeDeals = dealsModule.getActiveDeals()
  const activeIds = new Set(activeDeals.map((deal) => deal.id))
  const first = recommendationsModule.getRelatedDealsForPost(broadDealPost, 3)
  const second = recommendationsModule.getRelatedDealsForPost(broadDealPost, 3)
  const ids = first.map((deal) => deal.id)

  assert.ok(activeDeals.some((deal) => dealsModule.isSuspiciousDiscount(deal)))
  assert.ok(first.length > 0)
  assert.ok(first.every((deal) => activeIds.has(deal.id)))
  assert.ok(first.every((deal) => !dealsModule.isSuspiciousDiscount(deal)))
  assert.deepEqual(ids, second.map((deal) => deal.id))
  assert.equal(new Set(ids).size, ids.length)
})

test("deal-detail recommendations stay in-category and use deterministic relevance tie-breakers", () => {
  const current = dealsModule.getDealBySlug("tanle-silicone-foldable-water-bottle-is-leak-proof-a-702052")
  assert.ok(current, "public Home deal fixture must exist")

  const first = dealsModule.getRelatedDealsForDeal(current, 3)
  const second = dealsModule.getRelatedDealsForDeal(current, 3)

  assert.deepEqual(
    first.map((deal) => deal.slug),
    [
      "tumbler-hot-and-cold-thermos-double-wall-vacuum-insu-634012",
      "food-grade-fresh-keeping-box-refrigerator-storage-bo-443059",
      "triangle-coat-rack-floor-bedroom-multi-function-clot-181276",
    ]
  )
  assert.deepEqual(first.map((deal) => deal.slug), second.map((deal) => deal.slug))
  assert.ok(first.every((deal) => deal.category === current.category))
  assert.ok(first.every((deal) => deal.slug !== current.slug))
  assert.ok(first.every((deal) => !dealsModule.isSuspiciousDiscount(deal)))
  assert.equal(new Set(first.map((deal) => deal.id)).size, first.length)
})

test("deal-detail recommendations normalize count to an integer from zero through three", () => {
  const current = dealsModule.getDealBySlug("tanle-silicone-foldable-water-bottle-is-leak-proof-a-702052")
  assert.ok(current, "public Home deal fixture must exist")

  for (const [count, expected] of [
    [-1, 0],
    [0, 0],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
    [1.9, 1],
    [99, 3],
  ]) {
    assert.equal(dealsModule.getRelatedDealsForDeal(current, count).length, expected)
  }
})

test("back-to-school guide cites the current DTI 2026–2027 source instead of the 2025 release", () => {
  const post = postsModule.getPostBySlug("back-to-school-essentials-under-500-philippines")
  const currentDtiSource =
    "https://dtiwebfiles.s3-ap-southeast-1.amazonaws.com/e-Presyo/School%20Supplies/Gabay%20sa%20Pamimili%20ng%20School%20Supplies%20School%20Year%202026-2027%20Price%20Range_SS%20%2824%20x%2033%20in%29.pdf"
  const outdatedDtiSource =
    "https://fairtrade.dti.gov.ph/press-release/dti-secures-divisoria-school-supplies-for-reasonable-prices-as-classes-near/"

  assert.ok(post, "back-to-school guide fixture must exist")
  assert.ok(post.content.includes(currentDtiSource), "guide must cite the current DTI 2026–2027 price guide")
  assert.ok(!post.content.includes(outdatedDtiSource), "guide must not cite the superseded 2025 monitoring release")
})

test("carry-on guide states PAL's individual size and weight maxima", () => {
  const post = postsModule.getPostBySlug("carry-on-luggage-philippines-buying-guide")

  assert.ok(post, "carry-on guide fixture must exist")
  assert.match(post.content, /56 × 36 × 23 cm/)
  assert.match(post.content, /maximum weight of 7 kg/)
  assert.doesNotMatch(post.content, /combined external dimensions of no more than 115 cm/)
})

test("cookware guide uses the production Bureau of Customs importation URL", () => {
  const post = postsModule.getPostBySlug("cookware-sets-philippines-buying-guide")

  assert.ok(post, "cookware guide fixture must exist")
  assert.ok(post.content.includes("https://customs.gov.ph/guidelines-on-importation/"))
  assert.ok(!post.content.includes("https://www2.customs.gov.ph/"))
})

const weeklyGuideCases = [
  {
    id: "post-025",
    slug: "online-shoe-size-guide-philippines",
    title: "Online Shoe Size Guide Philippines: How to Measure Before You Buy",
    category: "Fashion Guides",
    coverImage: "/images/guides/online-shoe-size-guide-philippines.jpg",
    topics: ["shoe-buying", "fashion-buying"],
    expectedPlatforms: ["Temu", "Shopee PH"],
    expectedDeals: {
      categories: ["Fashion"],
      tags: ["shoes", "sandals", "heels", "clogs"],
    },
    platforms: new Set(["Temu", "Shopee PH"]),
    dealCategories: new Set(["Fashion"]),
    dealTags: new Set(["shoes", "sandals", "heels", "clogs"]),
  },
  {
    id: "post-026",
    slug: "unboxing-video-evidence-online-shopping-philippines",
    title: "How to Record Unboxing Evidence for Online Orders in the Philippines",
    category: "Shopping Tips",
    coverImage: "/images/guides/unboxing-video-evidence-online-shopping-philippines.jpg",
    topics: ["shopping-safety", "returns"],
    expectedPlatforms: undefined,
    expectedDeals: undefined,
  },
  {
    id: "post-027",
    slug: "travel-packing-organizers-philippines-buying-guide",
    title: "Travel Packing Organizers Philippines: What to Check Before Buying Online",
    category: "Travel Guides",
    coverImage: "/images/guides/travel-packing-organizers-philippines-buying-guide.jpg",
    topics: ["travel-planning", "bag-buying", "carry-on-luggage"],
    expectedPlatforms: ["Shopee PH"],
    expectedDeals: {
      categories: ["Travel", "Fashion"],
      tags: ["travel", "organizer", "bag", "packing"],
      maxPrice: 500,
    },
    platforms: new Set(["Shopee PH"]),
    dealCategories: new Set(["Travel", "Fashion"]),
    dealTags: new Set(["travel", "organizer", "bag", "packing"]),
    maxPrice: 500,
  },
  {
    id: "post-028",
    slug: "first-apartment-essentials-under-1000-philippines",
    title: "First Apartment Essentials Under ₱1,000 Philippines: Buy the Practical Basics First",
    category: "Home Guides",
    coverImage: "/images/guides/first-apartment-essentials-under-1000-philippines.jpg",
    topics: ["home-organization", "cookware-buying", "first-home"],
    expectedPlatforms: ["Temu", "Shopee PH"],
    expectedDeals: {
      categories: ["Home"],
      tags: ["home", "storage", "kitchen", "organizer", "lighting"],
      maxPrice: 1000,
    },
    platforms: new Set(["Temu", "Shopee PH"]),
    dealCategories: new Set(["Home"]),
    dealTags: new Set(["home", "storage", "kitchen", "organizer", "lighting"]),
    maxPrice: 1000,
  },
  {
    id: "post-029",
    slug: "power-bank-buying-guide-philippines",
    title: "Power Bank Buying Guide Philippines: Capacity, Fast Charging, and Airline Rules",
    category: "Tech Guides",
    coverImage: "/images/guides/power-bank-buying-guide-philippines.jpg",
    topics: ["tech-accessories", "power-bank-buying", "travel-planning"],
    expectedPlatforms: ["Temu", "Shopee PH"],
    expectedDeals: {
      categories: ["Electronics"],
      tags: ["power-bank", "usb-c", "charger"],
      maxPrice: 1000,
    },
    platforms: new Set(["Temu", "Shopee PH"]),
    dealCategories: new Set(["Electronics"]),
    dealTags: new Set(["power-bank", "usb-c", "charger"]),
    maxPrice: 1000,
  },
]

const adsenseBuyerGuideCases = [
  {
    id: "post-030",
    slug: "online-product-review-checklist-philippines",
    title: "How to Read Online Product Reviews: PH Buyer Checklist",
    category: "Shopping Safety",
    coverImage: "/images/guides/online-product-review-checklist-philippines.jpg",
    topics: ["review-checking", "shopping-safety", "seller-checking"],
    requiredSources: [
      "https://bps.dti.gov.ph/press-releases/28-2021/259-dti-issues-national-standard-guidelines-for-e-commerce-transactions",
    ],
    requiredLinks: [
      "/blog/how-to-check-shopee-seller-legit-philippines",
      "/blog/how-to-spot-fake-discounts",
    ],
  },
  {
    id: "post-031",
    slug: "refurbished-vs-used-vs-open-box-philippines",
    title: "Refurbished vs Used vs Open-Box: PH Buyer Guide",
    category: "Tech Guides",
    coverImage: "/images/guides/refurbished-vs-used-vs-open-box-philippines.jpg",
    topics: ["refurbished-buying", "tech-accessories", "shopping-safety"],
    requiredSources: [
      "https://bps.dti.gov.ph/press-releases/28-2021/259-dti-issues-national-standard-guidelines-for-e-commerce-transactions",
      "https://www.importtaxph.com/",
    ],
    requiredLinks: [
      "/blog/online-product-review-checklist-philippines",
      "/blog/online-purchase-warranty-guide-philippines",
    ],
    allowsImportTaxPh: true,
  },
  {
    id: "post-032",
    slug: "online-furniture-measurement-guide-philippines",
    title: "Online Furniture Measurement Guide for Filipino Buyers",
    category: "Home Guides",
    coverImage: "/images/guides/online-furniture-measurement-guide-philippines.jpg",
    topics: ["furniture-buying", "home-organization", "first-home"],
    platforms: ["Temu", "Shopee PH"],
    deals: {
      categories: ["Home"],
      tags: ["furniture", "sofa", "desk", "storage", "organizer"],
    },
    requiredSources: [
      "https://bps.dti.gov.ph/press-releases/28-2021/259-dti-issues-national-standard-guidelines-for-e-commerce-transactions",
    ],
    requiredLinks: [
      "/blog/first-apartment-essentials-under-1000-philippines",
      "/blog/unboxing-video-evidence-online-shopping-philippines",
    ],
  },
  {
    id: "post-033",
    slug: "online-purchase-warranty-guide-philippines",
    title: "Online Purchase Warranty Guide for Filipino Buyers",
    category: "Shopping Safety",
    coverImage: "/images/guides/online-purchase-warranty-guide-philippines.jpg",
    topics: ["warranty", "returns", "shopping-safety"],
    requiredSources: [
      "https://ecommerce.dti.gov.ph/faqs/",
      "https://ecommerce.dti.gov.ph/wp-content/uploads/2024/06/Joint-Administrative-Order-No.-24-03.pdf",
    ],
    requiredLinks: [
      "/blog/unboxing-video-evidence-online-shopping-philippines",
      "/blog/voucher-shipping-return-checklist",
    ],
  },
  {
    id: "post-034",
    slug: "energy-efficient-appliance-buying-guide-philippines",
    title: "Energy-Efficient Appliance Buying Guide Philippines",
    category: "Home Guides",
    coverImage: "/images/guides/energy-efficient-appliance-buying-guide-philippines.jpg",
    topics: ["appliance-buying", "energy-efficiency", "first-home"],
    requiredSources: [
      "https://legacy.doe.gov.ph/pelp/philippine-energy-label",
      "https://pelp.doe.gov.ph/",
    ],
    requiredLinks: [
      "/blog/first-apartment-essentials-under-1000-philippines",
      "/blog/cookware-sets-philippines-buying-guide",
    ],
  },
]

const augustBuyerGuideCases = [
  {
    id: "post-035",
    slug: "how-to-stack-shopee-vouchers-philippines",
    coverImage: "/images/guides/how-to-stack-shopee-vouchers-philippines.jpg",
    coverImageAlt: "Philippine shopper comparing a generic phone checkout with blank voucher cards, a calculator, and a receipt",
    titlePattern: /stack shopee vouchers/i,
    workedHeading: "## Worked voucher-stack example",
    topics: ["voucher-stacking", "checkout-checklist", "shopee-shopping"],
    platforms: ["Shopee PH"],
    deals: { tags: ["shopee"], maxPrice: 1000 },
    requiredSources: [
      "https://help.shopee.ph/portal/4/article/81188-How-do-I-use-saved-Vouchers-during-checkout",
      "https://help.shopee.ph/portal/4/article/82304-%5BVouchers%5D-How-are-voucher-promotions-calculated-at-checkout",
      "https://help.shopee.ph/portal/4/article/81532-Other-FAQs-related-to-voucher-codes",
    ],
    requiredLinks: [
      "/blog/why-final-prices-change-at-checkout",
      "/blog/voucher-shipping-return-checklist",
      "/blog/shopee-return-refund-guide-philippines",
    ],
  },
  {
    id: "post-036",
    slug: "shopee-return-refund-guide-philippines",
    coverImage: "/images/guides/shopee-return-refund-guide-philippines.jpg",
    coverImageAlt: "Parcel return evidence scene with a phone, sealed box, receipt, and organized photo documentation",
    titlePattern: /shopee return.*refund/i,
    workedHeading: "## Worked return-request example",
    topics: ["returns", "shopping-safety", "shopee-shopping"],
    platforms: ["Shopee PH"],
    deals: undefined,
    requiredSources: [
      "https://help.shopee.ph/portal/4/article/81231?seo=1",
      "https://help.shopee.ph/portal/4/article/81183-%5BReturn-Refund%5D-What-are-the-effective-supporting-documents-I-can-submit-as-evidence-for-my-refund%2Freturn-request%3F-%28ENG%29",
      "https://lawphil.net/statutes/repacts/ra2023/ra_11967_2023.html",
    ],
    requiredLinks: [
      "/blog/unboxing-video-evidence-online-shopping-philippines",
      "/blog/online-purchase-warranty-guide-philippines",
      "/blog/how-to-check-shopee-seller-legit-philippines",
    ],
  },
  {
    id: "post-037",
    slug: "temu-returns-refunds-price-adjustment-philippines",
    coverImage: "/images/guides/temu-returns-refunds-price-adjustment-philippines.jpg",
    coverImageAlt: "Brand-neutral cross-border parcel with blank return and price-comparison cards beside a calculator",
    titlePattern: /temu returns.*refunds.*price adjustment/i,
    workedHeading: "## Worked remedy decision",
    topics: ["returns", "shopping-safety", "temu-buying"],
    platforms: ["Temu"],
    deals: undefined,
    requiredSources: [
      "https://www.temu.com/ph/return-and-refund-policy.html",
      "https://www.temu.com/ph/support/c3/what-is--price-adjustment--f-60-s-945.html",
      "https://www.temu.com/ph/support/c3/support-f-50-s-199.html",
    ],
    requiredLinks: [
      "/blog/temu-shopping-guide-philippines",
      "/blog/unboxing-video-evidence-online-shopping-philippines",
      "/blog/online-purchase-warranty-guide-philippines",
    ],
  },
  {
    id: "post-038",
    slug: "how-to-check-skincare-makeup-legit-philippines",
    coverImage: "/images/guides/how-to-check-skincare-makeup-legit-philippines.jpg",
    coverImageAlt: "Skincare and makeup verification desk with generic products, magnifier, laptop search, batch, and seal clues",
    titlePattern: /check.*skincare.*makeup.*legit/i,
    workedHeading: "## Worked cosmetic-check decision",
    topics: ["cosmetic-authenticity", "seller-checking"],
    platforms: ["Shopee PH", "Sephora PH"],
    deals: { categories: ["Beauty", "Skincare"], tags: ["beauty", "skincare", "makeup"] },
    requiredSources: [
      "https://verification.fda.gov.ph/cosmetic_product_notificationsrch.php",
      "https://www.fda.gov.ph/fda-advisory-no-2023-2238-utilization-of-the-food-and-drug-administration-fda-verification-portal/",
      "https://www.fda.gov.ph/wp-content/uploads/2021/03/FAQ_Notification.pdf",
    ],
    requiredLinks: [
      "/blog/online-product-review-checklist-philippines",
      "/blog/how-to-check-shopee-seller-legit-philippines",
      "/blog/sephora-ph-beauty-guide",
    ],
  },
  {
    id: "post-039",
    slug: "online-electrical-appliance-safety-ps-icc-philippines",
    coverImage: "/images/guides/online-electrical-appliance-safety-ps-icc-philippines.jpg",
    coverImageAlt: "Shopper inspecting a generic charger and small appliance with a magnifier, voltage shapes, and safety checklist",
    titlePattern: /electrical appliance.*ps.*icc/i,
    workedHeading: "## Worked PS-or-ICC decision",
    topics: ["appliance-buying", "electrical-safety"],
    platforms: undefined,
    deals: undefined,
    requiredSources: [
      "https://bps.dti.gov.ph/index.php/product-certification/list-of-products-under-mandatory-certification",
      "https://bps.dti.gov.ph/index.php/product-certification/ps-and-icc-marks",
      "https://bps.dti.gov.ph/index.php/product-certification/certified-products",
    ],
    requiredLinks: [
      "/blog/energy-efficient-appliance-buying-guide-philippines",
      "/blog/online-purchase-warranty-guide-philippines",
      "/blog/online-product-review-checklist-philippines",
    ],
  },
]

test("August buyer guides declare the exact cover registry contract", () => {
  for (const guideCase of augustBuyerGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    assert.equal(post.coverImage, guideCase.coverImage)
    assert.equal(post.coverImageAlt, guideCase.coverImageAlt)
  }
})

test("August buyer guides use the exact ordered registry contract and substantive structure", () => {
  assert.deepEqual(
    postsModule.posts.slice(-augustBuyerGuideCases.length).map((post) => post.slug),
    augustBuyerGuideCases.map((guideCase) => guideCase.slug)
  )

  const titles = []
  const excerpts = []

  for (const guideCase of augustBuyerGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    assert.equal(post.id, guideCase.id)
    assert.match(post.title, guideCase.titlePattern)
    assert.equal(post.publishedAt, "2026-08-03")
    assert.equal(post.lastReviewed, "2026-08-03")
    assert.ok(post.excerpt.length <= 160, `${guideCase.slug} excerpt is too long`)
    assert.ok(post.content.split(/\s+/).length >= 800, `${guideCase.slug} must contain at least 800 words`)
    assert.ok((post.content.match(/^## /gm) ?? []).length >= 5, `${guideCase.slug} needs at least five H2 sections`)
    assert.match(post.content, /^## How we assessed this guide$/im)
    assert.ok(post.content.includes(guideCase.workedHeading), `${guideCase.slug} needs its worked decision section`)
    const workedBlock = post.content.split(guideCase.workedHeading)[1]?.split("\n\n## ")[0] ?? ""
    assert.ok((workedBlock.match(/^\d+\. /gm) ?? []).length >= 3, `${guideCase.slug} worked section needs a numbered workflow`)
    assert.match(post.content, /^## .*checklist$/im)
    assert.match(post.content, /^## Limitations and live-policy check$/im)
    assert.match(post.content, /^## Affiliate disclosure$/im)
    assert.ok(post.faqs?.length >= 3, `${guideCase.slug} needs at least three visible FAQs`)
    assert.deepEqual(post.recommendationIntent?.topics, guideCase.topics)
    assert.deepEqual(post.recommendationIntent?.platforms, guideCase.platforms)
    assert.deepEqual(post.recommendationIntent?.deals, guideCase.deals)

    for (const source of guideCase.requiredSources) {
      assert.ok(post.content.includes(source), `${guideCase.slug} must cite ${source}`)
    }
    for (const link of guideCase.requiredLinks) {
      assert.ok(post.content.includes(link), `${guideCase.slug} must link to ${link}`)
    }

    assert.doesNotMatch(`${post.content} ${post.excerpt}`, /shein|lazada|aliexpress|importtaxph|applyreadycv/i)
    titles.push(post.title)
    excerpts.push(post.excerpt)
  }

  assert.equal(new Set(titles).size, augustBuyerGuideCases.length, "August guide titles must be distinct")
  assert.equal(new Set(excerpts).size, augustBuyerGuideCases.length, "August guide excerpts must be distinct")
})

test("August buyer guides preserve the fact sheet's decision-critical cautions", () => {
  const voucher = postsModule.getPostBySlug("how-to-stack-shopee-vouchers-philippines")
  const shopeeReturn = postsModule.getPostBySlug("shopee-return-refund-guide-philippines")
  const temuReturn = postsModule.getPostBySlug("temu-returns-refunds-price-adjustment-philippines")
  const cosmetics = postsModule.getPostBySlug("how-to-check-skincare-makeup-legit-philippines")
  const electrical = postsModule.getPostBySlug("online-electrical-appliance-safety-ps-icc-philippines")

  assert.ok(voucher && shopeeReturn && temuReturn && cosmetics && electrical)
  assert.match(voucher.content, /one eligible Shop Voucher per shop/i)
  assert.match(voucher.content, /one Shopee platform voucher/i)
  assert.match(voucher.content, /minimum spend/i)
  assert.match(voucher.content, /discount cap/i)
  assert.match(voucher.content, /Shopee Coins.*separate/i)

  assert.match(shopeeReturn.content, /deadline shown.*live order/i)
  assert.match(shopeeReturn.content, /video.*not.*every (?:request|case|claim)/i)
  assert.match(shopeeReturn.content, /direct exchange.*not (?:available|offered)/i)

  assert.match(temuReturn.content, /updated (?:on )?2026-03-23/i)
  assert.match(temuReturn.content, /45.*60.*90-day/i)
  assert.match(temuReturn.content, /postmarked within 14 days/i)
  assert.match(temuReturn.content, /30-day price adjustment/i)
  assert.match(temuReturn.content, /(?:PHP|₱)\s?75/i)

  assert.match(cosmetics.content, /FDA-notified/i)
  assert.match(cosmetics.content, /not FDA-approved/i)
  assert.match(cosmetics.content, /not.*proof of authenticity/i)
  assert.match(cosmetics.content, /no result.*not automatically/i)

  assert.match(electrical.content, /only product types.*mandatory certification/i)
  assert.match(electrical.content, /official DTI-BPS.*verification app/i)
  assert.match(electrical.content, /visible (?:mark|sticker).*not (?:proof|conclusive)/i)
  assert.match(electrical.content, /voltage/i)
})

test("established guides link contextually into the August buyer-workflow cluster", () => {
  for (const [sourceSlug, targetSlug] of [
    ["why-final-prices-change-at-checkout", "how-to-stack-shopee-vouchers-philippines"],
    ["how-to-check-shopee-seller-legit-philippines", "shopee-return-refund-guide-philippines"],
    ["temu-shopping-guide-philippines", "temu-returns-refunds-price-adjustment-philippines"],
    ["best-beauty-finds-under-500-philippines", "how-to-check-skincare-makeup-legit-philippines"],
    ["energy-efficient-appliance-buying-guide-philippines", "online-electrical-appliance-safety-ps-icc-philippines"],
  ]) {
    const post = postsModule.getPostBySlug(sourceSlug)
    assert.ok(post, `${sourceSlug} fixture must exist`)
    assert.ok(post.content.includes(`/blog/${targetSlug}`), `${sourceSlug} must link to ${targetSlug}`)
  }
})

test("checkout-price guidance preserves Temu's separate conditional adjustment route", () => {
  const post = postsModule.getPostBySlug("why-final-prices-change-at-checkout")
  assert.ok(post, "checkout-price guide fixture must exist")
  assert.doesNotMatch(post.content, /subsequent price drops.*do not retroactively apply/i)
  assert.ok(post.content.includes("/blog/temu-returns-refunds-price-adjustment-philippines"))
})

test("August guide deal recommendations match assigned editorial eligibility", () => {
  const activeIds = new Set(dealsModule.getActiveDeals().map((deal) => deal.id))

  for (const guideCase of augustBuyerGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    const relatedDeals = recommendationsModule.getRelatedDealsForPost(post, 3)

    if (!guideCase.deals) {
      assert.deepEqual(relatedDeals, [], `${guideCase.slug} must not recommend product deals`)
      continue
    }

    assert.ok(relatedDeals.length > 0 && relatedDeals.length <= 3)
    assert.ok(relatedDeals.every((deal) => activeIds.has(deal.id)))
    assert.ok(relatedDeals.every((deal) => !dealsModule.isSuspiciousDiscount(deal)))
    assert.ok(relatedDeals.every((deal) => guideCase.platforms.includes(deal.platform)))
    if (guideCase.deals.categories) {
      assert.ok(relatedDeals.every((deal) => guideCase.deals.categories.includes(deal.category)))
    }
    assert.ok(relatedDeals.every((deal) => deal.tags.some((tag) => guideCase.deals.tags.includes(tag.toLowerCase()))))
  }
})

test("August guide-to-guide recommendations stay specific to each workflow", () => {
  for (const guideCase of [
    {
      slug: "how-to-stack-shopee-vouchers-philippines",
      required: ["why-final-prices-change-at-checkout"],
      rejected: [],
    },
    {
      slug: "shopee-return-refund-guide-philippines",
      required: ["online-purchase-warranty-guide-philippines", "unboxing-video-evidence-online-shopping-philippines"],
      rejected: ["temu-returns-refunds-price-adjustment-philippines"],
    },
    {
      slug: "temu-returns-refunds-price-adjustment-philippines",
      required: ["online-purchase-warranty-guide-philippines", "unboxing-video-evidence-online-shopping-philippines"],
      rejected: ["shopee-return-refund-guide-philippines"],
    },
    {
      slug: "how-to-check-skincare-makeup-legit-philippines",
      required: ["online-product-review-checklist-philippines"],
      rejected: ["shopee-return-refund-guide-philippines", "temu-returns-refunds-price-adjustment-philippines"],
    },
    {
      slug: "online-electrical-appliance-safety-ps-icc-philippines",
      required: ["energy-efficient-appliance-buying-guide-philippines"],
      rejected: ["shopee-return-refund-guide-philippines", "temu-returns-refunds-price-adjustment-philippines"],
    },
  ]) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    const relatedSlugs = new Set(postsModule.getRelatedPosts(post, 3).map((candidate) => candidate.slug))

    for (const requiredSlug of guideCase.required) {
      assert.ok(relatedSlugs.has(requiredSlug), `${guideCase.slug} must recommend ${requiredSlug}`)
    }
    for (const rejectedSlug of guideCase.rejected) {
      assert.ok(!relatedSlugs.has(rejectedSlug), `${guideCase.slug} must not recommend ${rejectedSlug}`)
    }
  }
})

function readJpegDimensions(buffer) {
  assert.equal(buffer.readUInt16BE(0), 0xffd8, "asset must have a JPEG file signature")

  let offset = 2
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }

    const marker = buffer[offset + 1]
    offset += 2
    if (marker === 0xd8 || marker === 0xd9) continue
    if (marker === 0xda) break

    const segmentLength = buffer.readUInt16BE(offset)
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    if (isStartOfFrame) {
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3),
      }
    }
    offset += segmentLength
  }

  assert.fail("asset must contain readable JPEG dimensions")
}

test("AdSense-readiness buyer guides are substantial, sourced, distinct, and correctly cross-linked", () => {
  const excerpts = []

  for (const guideCase of adsenseBuyerGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, guideCase.slug + " fixture must exist")
    assert.equal(post.id, guideCase.id)
    assert.equal(post.title, guideCase.title)
    assert.ok(post.title.length <= 60, guideCase.slug + " title should remain concise for search results")
    assert.equal(post.category, guideCase.category)
    assert.equal(post.coverImage, guideCase.coverImage)
    assert.equal(post.publishedAt, "2026-07-28")
    assert.equal(post.lastReviewed, "2026-07-28")
    assert.deepEqual(post.recommendationIntent?.topics, guideCase.topics)
    assert.deepEqual(post.recommendationIntent?.platforms, guideCase.platforms)
    assert.deepEqual(post.recommendationIntent?.deals, guideCase.deals)
    assert.ok(post.excerpt.length <= 160, guideCase.slug + " excerpt is too long")
    assert.ok(post.content.split(/\s+/).length >= 750, guideCase.slug + " must contain at least 750 words")
    assert.ok((post.content.match(/^## /gm) ?? []).length >= 5, guideCase.slug + " needs at least five H2 sections")
    assert.match(post.content, /^## How we assessed this guide$/im)
    assert.match(post.content, /^## Affiliate disclosure$/im)
    assert.ok(post.faqs?.length >= 3, guideCase.slug + " needs at least three visible FAQs")

    for (const source of guideCase.requiredSources) {
      assert.ok(post.content.includes(source), guideCase.slug + " must cite " + source)
    }
    for (const link of guideCase.requiredLinks) {
      assert.ok(post.content.includes(link), guideCase.slug + " must link to " + link)
    }

    const sisterSites = post.content + " " + post.excerpt
    assert.doesNotMatch(sisterSites, /shein|applyreadycv|lazada|aliexpress/i)
    if (guideCase.allowsImportTaxPh) {
      assert.equal((sisterSites.match(/https:\/\/www\.importtaxph\.com\//gi) ?? []).length, 1)
    } else {
      assert.doesNotMatch(sisterSites, /importtaxph/i)
    }
    excerpts.push(post.excerpt)
  }

  assert.equal(new Set(excerpts).size, adsenseBuyerGuideCases.length)
})

test("established guides point readers into the new buyer-evidence cluster", () => {
  for (const [sourceSlug, targetSlug] of [
    ["how-to-check-shopee-seller-legit-philippines", "online-product-review-checklist-philippines"],
    ["best-phone-accessories-under-500-philippines", "refurbished-vs-used-vs-open-box-philippines"],
    ["first-apartment-essentials-under-1000-philippines", "online-furniture-measurement-guide-philippines"],
    ["voucher-shipping-return-checklist", "online-purchase-warranty-guide-philippines"],
    ["cookware-sets-philippines-buying-guide", "energy-efficient-appliance-buying-guide-philippines"],
  ]) {
    const post = postsModule.getPostBySlug(sourceSlug)
    assert.ok(post, sourceSlug + " fixture must exist")
    assert.ok(post.content.includes("/blog/" + targetSlug), sourceSlug + " must link to " + targetSlug)
  }
})

test("weekly guides use five distinct 1600x900 JPEG cover assets", () => {
  const coverPaths = []
  const contentHashes = []

  for (const guideCase of weeklyGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    assert.equal(post.coverImage, guideCase.coverImage)
    assert.match(post.coverImage, /\.jpg$/i)

    const assetPath = resolve("public", post.coverImage.replace(/^\/+/, ""))
    assert.ok(existsSync(assetPath), `${post.coverImage} must exist under public/`)
    const asset = readFileSync(assetPath)
    assert.deepEqual(readJpegDimensions(asset), { width: 1600, height: 900 })
    coverPaths.push(post.coverImage)
    contentHashes.push(createHash("sha256").update(asset).digest("hex"))
  }

  assert.equal(new Set(coverPaths).size, weeklyGuideCases.length)
  assert.equal(new Set(contentHashes).size, weeklyGuideCases.length)
})

test("AdSense-readiness buyer guides use five distinct 1600x900 JPEG cover assets", () => {
  const coverPaths = []
  const contentHashes = []

  for (const guideCase of adsenseBuyerGuideCases) {
    const assetPath = resolve("public", guideCase.coverImage.replace(/^\/+/, ""))
    assert.ok(existsSync(assetPath), guideCase.coverImage + " must exist under public/")
    const asset = readFileSync(assetPath)
    assert.deepEqual(readJpegDimensions(asset), { width: 1600, height: 900 })
    coverPaths.push(guideCase.coverImage)
    contentHashes.push(createHash("sha256").update(asset).digest("hex"))
  }

  assert.equal(new Set(coverPaths).size, adsenseBuyerGuideCases.length)
  assert.equal(new Set(contentHashes).size, adsenseBuyerGuideCases.length)
})

test("August buyer guides use five distinct 1600x900 JPEG cover assets", () => {
  const coverPaths = []
  const contentHashes = []

  for (const guideCase of augustBuyerGuideCases) {
    const assetPath = resolve("public", guideCase.coverImage.replace(/^\/+/, ""))
    assert.ok(existsSync(assetPath), `${guideCase.coverImage} must exist under public/`)
    const asset = readFileSync(assetPath)
    assert.deepEqual(readJpegDimensions(asset), { width: 1600, height: 900 })
    coverPaths.push(guideCase.coverImage)
    contentHashes.push(createHash("sha256").update(asset).digest("hex"))
  }

  assert.equal(new Set(coverPaths).size, augustBuyerGuideCases.length)
  assert.equal(new Set(contentHashes).size, augustBuyerGuideCases.length)
})

test("weekly search-led guides use the required registry metadata and editorial structure", () => {
  const excerpts = []

  for (const guideCase of weeklyGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    assert.equal(post.id, guideCase.id)
    assert.equal(post.title, guideCase.title)
    assert.equal(post.category, guideCase.category)
    assert.deepEqual(post.recommendationIntent?.topics, guideCase.topics)
    assert.deepEqual(post.recommendationIntent?.platforms, guideCase.expectedPlatforms)
    assert.deepEqual(post.recommendationIntent?.deals, guideCase.expectedDeals)
    assert.equal(post.publishedAt, "2026-07-23")
    assert.equal(post.lastReviewed, "2026-07-23")
    assert.ok(post.excerpt.length <= 160, `${guideCase.slug} excerpt is ${post.excerpt.length} characters`)
    assert.ok((post.content.match(/^## /gm) ?? []).length >= 5, `${guideCase.slug} needs four H2 sections plus disclosure`)
    assert.match(post.content, /^## Affiliate disclosure$/im)
    assert.doesNotMatch(`${post.content} ${post.excerpt}`, /shein|applyreadycv|importtaxph/i)
    excerpts.push(post.excerpt)
  }

  assert.equal(new Set(excerpts).size, weeklyGuideCases.length, "weekly guide excerpts must be unique")
})

test("weekly guide deal recommendations remain deterministic and editorially eligible", () => {
  const activeIds = new Set(dealsModule.getActiveDeals().map((deal) => deal.id))

  for (const guideCase of weeklyGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    const first = recommendationsModule.getRelatedDealsForPost(post, 3)
    const second = recommendationsModule.getRelatedDealsForPost(post, 3)

    assert.deepEqual(first.map((deal) => deal.id), second.map((deal) => deal.id))
    assert.equal(new Set(first.map((deal) => deal.id)).size, first.length)
    assert.ok(first.every((deal) => activeIds.has(deal.id)))
    assert.ok(first.every((deal) => !dealsModule.isSuspiciousDiscount(deal)))

    if (!guideCase.dealCategories) {
      assert.deepEqual(first, [], `${guideCase.slug} must not have product-deal recommendations`)
      continue
    }

    assert.ok(first.length > 0 && first.length <= 3)
    assert.ok(first.every((deal) => guideCase.platforms.has(deal.platform)))
    assert.ok(first.every((deal) => guideCase.dealCategories.has(deal.category)))
    assert.ok(first.every((deal) => deal.tags.some((tag) => guideCase.dealTags.has(tag.toLowerCase()))))
    if (guideCase.maxPrice !== undefined) {
      assert.ok(first.every((deal) => deal.salePrice <= guideCase.maxPrice))
    }
  }
})

test("unboxing guide treats video as optional supporting evidence with platform-specific requirements", () => {
  const post = postsModule.getPostBySlug("unboxing-video-evidence-online-shopping-philippines")
  assert.ok(post, "unboxing guide fixture must exist")
  assert.match(post.content, /requirements vary by platform/i)
  assert.match(post.content, /optional supporting evidence/i)
  assert.match(post.content, /not a universal legal requirement/i)
  assert.ok(post.content.includes("https://bps.dti.gov.ph/press-releases/28-2021/259-dti-issues-national-standard-guidelines-for-e-commerce-transactions"))
})

test("power-bank guide cites IATA and requires a carrier-policy recheck", () => {
  const post = postsModule.getPostBySlug("power-bank-buying-guide-philippines")
  assert.ok(post, "power-bank guide fixture must exist")
  assert.match(post.content, /https:\/\/www\.iata\.org\//)
  assert.match(post.content, /recheck (?:your|the) (?:airline|carrier)(?:'s)? (?:current )?policy/i)
})

test("established guides link reciprocally to the new weekly guides", () => {
  for (const [sourceSlug, targetSlug] of [
    ["best-phone-accessories-under-500-philippines", "power-bank-buying-guide-philippines"],
    ["carry-on-luggage-philippines-buying-guide", "travel-packing-organizers-philippines-buying-guide"],
    ["bags-under-500-philippines-buying-guide", "online-shoe-size-guide-philippines"],
    ["voucher-shipping-return-checklist", "unboxing-video-evidence-online-shopping-philippines"],
  ]) {
    const post = postsModule.getPostBySlug(sourceSlug)
    assert.ok(post, `${sourceSlug} fixture must exist`)
    assert.ok(post.content.includes(`/blog/${targetSlug}`), `${sourceSlug} must link to ${targetSlug}`)
  }
})

const finalCatalogCases = [
  {
    slug: "best-home-organization-finds-under-500-philippines",
    allowedCategories: new Set(["Home"]),
    requiredDealTags: new Set(["storage", "organizer"]),
    requiredRelatedSlug: "online-furniture-measurement-guide-philippines",
    rejectedRelatedSlugs: new Set([
      "best-beauty-finds-under-500-philippines",
      "best-phone-accessories-under-500-philippines",
    ]),
  },
  {
    slug: "best-gifts-under-500-philippines",
    allowedCategories: new Set(["Home", "Beauty", "Skincare", "Fashion"]),
    requiredDealTags: new Set(["gift"]),
    requiredRelatedSlug: "voucher-shipping-return-checklist",
    rejectedRelatedSlugs: new Set(["how-to-check-shopee-seller-legit-philippines"]),
  },
  {
    slug: "best-work-from-home-desk-accessories-under-1000-philippines",
    allowedCategories: new Set(["Home", "Electronics"]),
    requiredDealTags: new Set(["desk", "office", "wfh"]),
    requiredRelatedSlug: "best-phone-accessories-under-500-philippines",
    rejectedRelatedSlugs: new Set([
      "best-beauty-finds-under-500-philippines",
      "best-gifts-under-500-philippines",
    ]),
  },
  {
    slug: "best-beauty-finds-under-500-philippines",
    allowedCategories: new Set(["Beauty", "Skincare"]),
    requiredDealTags: new Set(["beauty", "skincare", "makeup", "tools"]),
    requiredRelatedSlug: "sephora-ph-beauty-guide",
    rejectedRelatedSlugs: new Set([
      "best-home-organization-finds-under-500-philippines",
      "best-work-from-home-desk-accessories-under-1000-philippines",
    ]),
  },
  {
    slug: "back-to-school-essentials-under-500-philippines",
    allowedCategories: new Set(["Home", "Electronics", "Fashion"]),
    requiredDealTags: new Set(["desk", "office", "organizer", "bag", "school", "study", "lunch"]),
    requiredRelatedSlug: "best-work-from-home-desk-accessories-under-1000-philippines",
    rejectedRelatedSlugs: new Set([
      "best-beauty-finds-under-500-philippines",
      "sephora-ph-beauty-guide",
    ]),
  },
  {
    slug: "cookware-sets-philippines-buying-guide",
    allowedCategories: new Set(["Home"]),
    requiredDealTags: new Set(["cookware", "kitchen", "pan", "pot", "storage"]),
    requiredRelatedSlug: "best-home-organization-finds-under-500-philippines",
    rejectedRelatedSlugs: new Set([
      "best-beauty-finds-under-500-philippines",
      "best-phone-accessories-under-500-philippines",
    ]),
  },
  {
    slug: "bags-under-500-philippines-buying-guide",
    allowedCategories: new Set(["Fashion"]),
    requiredDealTags: new Set(["bag", "tote", "wallet", "backpack", "travel"]),
    requiredRelatedSlug: "best-gifts-under-500-philippines",
    rejectedRelatedSlugs: new Set([
      "best-home-organization-finds-under-500-philippines",
      "best-beauty-finds-under-500-philippines",
    ]),
  },
  {
    slug: "carry-on-luggage-philippines-buying-guide",
    allowedCategories: new Set(["Fashion", "Travel"]),
    requiredDealTags: new Set(["luggage", "travel", "bag", "organizer"]),
    requiredRelatedSlug: "bags-under-500-philippines-buying-guide",
    rejectedRelatedSlugs: new Set([
      "best-home-organization-finds-under-500-philippines",
      "best-beauty-finds-under-500-philippines",
    ]),
  },
  {
    slug: "makeup-brush-sets-philippines-beginner-guide",
    allowedCategories: new Set(["Beauty", "Skincare"]),
    requiredDealTags: new Set(["brush", "tools", "makeup", "beauty"]),
    requiredRelatedSlug: "sephora-ph-beauty-guide",
    rejectedRelatedSlugs: new Set([
      "best-home-organization-finds-under-500-philippines",
      "best-work-from-home-desk-accessories-under-1000-philippines",
    ]),
  },
]

for (const catalogCase of finalCatalogCases) {
  test(`${catalogCase.slug} recommends only editorially eligible final-catalog content`, () => {
    const post = postsModule.getPostBySlug(catalogCase.slug)
    assert.ok(post, `${catalogCase.slug} fixture must exist`)

    const relatedPosts = postsModule.getRelatedPosts(post, 3)
    const relatedSlugs = new Set(relatedPosts.map((candidate) => candidate.slug))
    assert.ok(relatedSlugs.has(catalogCase.requiredRelatedSlug))
    assert.ok(
      relatedPosts.every((candidate) => !catalogCase.rejectedRelatedSlugs.has(candidate.slug)),
      `unrelated guide returned for ${catalogCase.slug}: ${relatedPosts.map((candidate) => candidate.slug).join(", ")}`
    )

    const relatedDeals = recommendationsModule.getRelatedDealsForPost(post, 3)
    assert.ok(relatedDeals.length > 0 && relatedDeals.length <= 3)
    const activeDealIds = new Set(dealsModule.getActiveDeals().map((deal) => deal.id))
    assert.equal(new Set(relatedDeals.map((deal) => deal.id)).size, relatedDeals.length)
    assert.ok(relatedDeals.every((deal) => activeDealIds.has(deal.id)))
    assert.ok(relatedDeals.every((deal) => !dealsModule.isSuspiciousDiscount(deal)))
    assert.ok(
      relatedDeals.every((deal) => catalogCase.allowedCategories.has(deal.category)),
      `unrelated category returned for ${catalogCase.slug}: ${relatedDeals.map((deal) => deal.category).join(", ")}`
    )
    assert.ok(
      relatedDeals.every((deal) => deal.tags.some((tag) => catalogCase.requiredDealTags.has(tag.toLowerCase()))),
      `deal without a topic-specific tag returned for ${catalogCase.slug}: ${relatedDeals.map((deal) => deal.title).join(", ")}`
    )
  })
}

test("canonical Shopee seller guide keeps Shopee-specific guides and deals", () => {
  const relatedPosts = postsModule.getRelatedPosts(currentPost, 3)
  const shopeeNamedPosts = relatedPosts.filter((post) => /shopee/i.test(`${post.slug} ${post.title}`))
  assert.ok(
    shopeeNamedPosts.length >= 2,
    `expected at least two Shopee-named guides, received ${relatedPosts.map((post) => post.slug).join(", ")}`
  )

  const relatedDeals = recommendationsModule.getRelatedDealsForPost(currentPost, 3)
  assert.equal(relatedDeals.length, 3)
  assert.ok(relatedDeals.every((deal) => deal.platform === "Shopee PH"))
  assert.ok(relatedDeals.every((deal) => deal.tags.includes("shopee")))
})
