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
  "@/data/posts": postsModule,
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
    coverImageSha256: "9c865c5866dc2344275f32a8651d567b1efc787596a91c04270475e6581ec7f5",
    titlePattern: /stack shopee vouchers/i,
    workedHeading: "## Worked voucher-stack example",
    topics: ["voucher-stacking", "checkout-checklist", "shopee-shopping"],
    platforms: ["Shopee PH"],
    deals: { tags: ["shopee"], maxPrice: 1000 },
    lastReviewed: "2026-08-09",
    requiredSources: [
      "https://help.shopee.ph/portal/4/article/81188-How-do-I-use-saved-Vouchers-during-checkout",
      "https://help.shopee.ph/portal/4/article/81031-%5BVouchers%5D-What-vouchers-are-there-on-Shopee%3F-%28ENG%29",
      "https://help.shopee.ph/portal/4/article/82323-%5BVouchers%5D-How-do-I-apply-vouchers-at-checkout",
      "https://help.shopee.ph/portal/4/article/82304-%5BVouchers%5D-How-are-voucher-promotions-calculated-at-checkout",
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
    coverImageSha256: "e040e1a69abbdda42ec381ae9ee3c85fc5fabcdaa11117b5d90847964d956933",
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
    coverImageAlt: "Unbranded parcel with blank comparison cards, plain coins, and an unmarked calculator on a home desk",
    coverImageSha256: "123745875851f1190a96cb2a9d4a1cc1e94e32f41dd030a7245689417a0d28a3",
    titlePattern: /temu returns.*refunds.*price adjustment/i,
    workedHeading: "## Worked remedy decision",
    topics: ["returns", "shopping-safety", "temu-buying"],
    platforms: ["Temu"],
    deals: undefined,
    lastReviewed: "2026-08-09",
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
    coverImageAlt: "Shopper inspecting blank skincare and makeup packaging with a magnifying glass beside an abstract registry screen",
    coverImageSha256: "df62c6cc8acc2cbd6ef335168dd69562ba3a40f704bdf5daeab8edfe601f80e9",
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
    coverImageAlt: "Shopper inspecting an unplugged cord housing with a magnifying glass beside a charger, fan, and blank checklist",
    coverImageSha256: "cbf53b711f374bf29035871066e8d01f29ec45b36ce2e0f36cefc905ec3380f8",
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

const saleSafetyGuideCases = [
  {
    id: "post-040",
    slug: "shopee-9-9-sale-philippines-2026-checklist",
    title: "Shopee 9.9 Sale Philippines 2026: Smart Checkout Checklist",
    category: "Shopping Tips",
    readTime: 11,
    tags: ["shopee", "9-9-sale", "sale-planning", "checkout-checklist", "price-comparison", "philippines"],
    coverGradient: "from-amber-400 to-orange-500",
    workedHeading: "## Worked 9.9 checkout decision",
    checklistHeading: "## 9.9 checkout checklist",
    directAnswerPattern: /prepare.*cart|record.*baseline|compare.*final payable/i,
    requiredSources: ["https://shopee.ph/m/9-9"],
    requiredLinks: [
      "/sales-calendar",
      "/blog/how-to-stack-shopee-vouchers-philippines",
      "/blog/how-to-spot-fake-discounts",
      "/blog/why-final-prices-change-at-checkout",
      "/tools/checkout-comparison",
    ],
    topics: ["sale-planning", "checkout-checklist", "shopee-shopping"],
    platforms: ["Shopee PH"],
    deals: { tags: ["shopee"] },
    coverImage: "/images/guides/shopee-9-9-sale-philippines-2026-checklist.jpg",
    coverImageAlt:
      "Filipino shopper planning a sale checkout with a blank phone cart, calendar, calculator, and price checklist",
    coverImageSha256: "58e7f951d9c9ab97abb754f5a8ecf591692a732ba40a9b340e9fb6a45bca232b",
    expectedRelatedSlugs: [
      "how-to-stack-shopee-vouchers-philippines",
      "shopee-return-refund-guide-philippines",
      "best-gifts-under-500-philippines",
    ],
  },
  {
    id: "post-041",
    slug: "fake-qr-code-payment-scams-philippines",
    title: "Fake QR Code Payment Scams Philippines: Checks Before You Scan",
    category: "Shopping Safety",
    readTime: 12,
    tags: ["qr-scam", "quishing", "payment-safety", "shopee", "fraud-response", "philippines"],
    coverGradient: "from-blue-700 to-cyan-400",
    workedHeading: "## Worked suspicious-QR response",
    checklistHeading: "## QR payment safety checklist",
    directAnswerPattern: /do not scan|stop before scanning|keep.*payment.*platform/i,
    requiredSources: [
      "https://help.shopee.ph/portal/4/article/142074-Safety-exercises-to-protect-yourself-against-each-type-of-scam",
      "https://www.bsp.gov.ph/SitePages/FinancialStability/BSPVerifier.aspx",
      "https://www.pna.gov.ph/articles/1280220",
    ],
    requiredLinks: [
      "/blog/online-shopping-safety-tips-philippines",
      "/blog/how-to-check-shopee-seller-legit-philippines",
      "/blog/dti-trustmark-bir-registration-seal-online-sellers",
      "/blog/fake-cod-parcel-scam-philippines",
    ],
    topics: ["qr-scam", "payment-safety", "shopping-safety"],
    platforms: ["Shopee PH"],
    deals: { tags: ["shopee"] },
    coverImage: "/images/guides/fake-qr-code-payment-scams-philippines.jpg",
    coverImageAlt:
      "Shopper inspecting a non-scannable abstract QR pattern on a phone beside a shield and payment checklist",
    coverImageSha256: "76fa03a5ee79098c8518623a776ee67d5a73fd321c7862448d297a758791826d",
    expectedRelatedSlugs: [
      "fake-cod-parcel-scam-philippines",
      "dti-trustmark-bir-registration-seal-online-sellers",
      "shopee-return-refund-guide-philippines",
    ],
  },
  {
    id: "post-042",
    slug: "dti-trustmark-bir-registration-seal-online-sellers",
    title: "DTI Trustmark and BIR Registration Seal: Verify Online Sellers",
    category: "Shopping Safety",
    readTime: 13,
    tags: ["dti-trustmark", "bir-registration-seal", "seller-verification", "business-registration", "shopee", "philippines"],
    coverGradient: "from-emerald-900 to-amber-200",
    workedHeading: "## Worked seller-verification decision",
    checklistHeading: "## Seller verification checklist",
    directAnswerPattern: /verify.*official|check.*official.*domain|badge.*one signal/i,
    requiredSources: [
      "https://trustmark.dti.gov.ph/faqs",
      "https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2038-2026%20Digest.pdf",
      "https://verify.bir.gov.ph/correspondence/",
    ],
    requiredLinks: [
      "/blog/how-to-check-shopee-seller-legit-philippines",
      "/blog/online-purchase-warranty-guide-philippines",
      "/blog/online-product-review-checklist-philippines",
      "/blog/fake-qr-code-payment-scams-philippines",
    ],
    topics: ["seller-verification", "business-registration", "shopping-safety"],
    platforms: ["Shopee PH"],
    deals: { tags: ["shopee"] },
    coverImage: "/images/guides/dti-trustmark-bir-registration-seal-online-sellers.jpg",
    coverImageAlt:
      "Magnifying glass checking abstract seller verification cards beside a laptop and official-domain checklist",
    coverImageSha256: "94f0d4082bed2f38f40d5a35cd4625b170f3e8ea6b68d86282e4e15415912147",
    expectedRelatedSlugs: [
      "fake-cod-parcel-scam-philippines",
      "fake-qr-code-payment-scams-philippines",
      "shopee-return-refund-guide-philippines",
    ],
  },
  {
    id: "post-043",
    slug: "fake-cod-parcel-scam-philippines",
    title: "Fake COD Parcel Scam Philippines: What to Do Before Paying",
    category: "Shopping Safety",
    readTime: 12,
    tags: ["cod-scam", "parcel-safety", "cash-on-delivery", "household-protocol", "shopee", "philippines"],
    coverGradient: "from-orange-500 to-slate-600",
    workedHeading: "## Worked COD doorstep decision",
    checklistHeading: "## COD parcel checklist",
    directAnswerPattern: /do not pay|check.*order history|refuse.*unordered/i,
    requiredSources: [
      "https://help.shopee.ph/portal/4/article/81483-What-to-do-when-receiving-an-order",
      "https://www.ninjavan.co/en-ph/support/consignee-support/parcel-scams-advisory",
      "https://help.shopee.ph/portal/4/article/142074-Safety-exercises-to-protect-yourself-against-each-type-of-scam",
    ],
    requiredLinks: [
      "/blog/unboxing-video-evidence-online-shopping-philippines",
      "/blog/shopee-return-refund-guide-philippines",
      "/blog/online-shopping-safety-tips-philippines",
      "/blog/fake-qr-code-payment-scams-philippines",
    ],
    topics: ["cod-scam", "parcel-safety", "shopping-safety"],
    platforms: ["Shopee PH"],
    deals: { tags: ["shopee"] },
    coverImage: "/images/guides/fake-cod-parcel-scam-philippines.jpg",
    coverImageAlt:
      "Household member comparing an unopened COD parcel with a phone order list before payment",
    coverImageSha256: "0ffced5a9af02110cf2d03d793fb6999eb77385599b8692af8bd244025aecef9",
    expectedRelatedSlugs: [
      "dti-trustmark-bir-registration-seal-online-sellers",
      "fake-qr-code-payment-scams-philippines",
      "shopee-return-refund-guide-philippines",
    ],
  },
  {
    id: "post-044",
    slug: "temu-minimum-order-philippines",
    title: "Temu Minimum Order Philippines: Checkout Without Overspending",
    category: "Shopping Tips",
    readTime: 12,
    tags: ["temu", "minimum-order", "checkout-value", "cart-planning", "cross-border", "philippines"],
    coverGradient: "from-indigo-500 to-violet-600",
    workedHeading: "## Worked Temu cart decision",
    checklistHeading: "## Minimum-order checkout checklist",
    directAnswerPattern: /no reliable fixed PHP minimum|buy nothing today|do not add.*unwanted/i,
    requiredSources: ["https://www.temu.com/ph/support/c2/buying-on-temu-f-44.html"],
    requiredLinks: [
      "/blog/temu-shopping-guide-philippines",
      "/blog/why-final-prices-change-at-checkout",
      "/tools/checkout-comparison",
      "/blog/temu-returns-refunds-price-adjustment-philippines",
      "/blog/philippine-import-tax-guide-online-shoppers",
      "https://www.importtaxph.com/",
    ],
    topics: ["temu-checkout", "minimum-order", "checkout-value"],
    platforms: ["Temu"],
    deals: { tags: ["temu"] },
    coverImage: "/images/guides/temu-minimum-order-philippines.jpg",
    coverImageAlt:
      "Shopper comparing an online cart minimum with a calculator and a short needs checklist",
    coverImageSha256: "ad3aecda2df5738c548ff3117921cae4b28203eadf6c5434511310ec73fdf630",
    expectedRelatedSlugs: ["temu-shopping-guide-philippines"],
  },
]

test("sale-season safety guides use the exact ordered registry and substantive structure", () => {
  assert.deepEqual(
    postsModule.posts.slice(-saleSafetyGuideCases.length).map((post) => post.slug),
    saleSafetyGuideCases.map((guideCase) => guideCase.slug)
  )

  const titles = []
  const excerpts = []
  const coverGradients = []

  for (const guideCase of saleSafetyGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    assert.equal(post.id, guideCase.id)
    assert.equal(post.title, guideCase.title)
    assert.equal(post.category, guideCase.category)
    assert.equal(post.readTime, guideCase.readTime)
    assert.deepEqual(post.tags, guideCase.tags)
    assert.equal(new Set(post.tags).size, post.tags.length, `${guideCase.slug} tags must be distinct`)
    assert.equal(post.coverGradient, guideCase.coverGradient)
    assert.equal(post.coverImage, guideCase.coverImage)
    assert.equal(post.coverImageAlt, guideCase.coverImageAlt)
    assert.equal(post.publishedAt, "2026-08-09")
    assert.equal(post.lastReviewed, "2026-08-09")
    assert.ok(post.excerpt.length <= 160, `${guideCase.slug} excerpt is too long`)
    assert.ok(post.content.split(/\s+/).length >= 1000, `${guideCase.slug} must contain at least 1,000 words`)
    assert.ok((post.content.match(/^## /gm) ?? []).length >= 7, `${guideCase.slug} needs at least seven H2 sections`)

    const introduction = post.content.split(/^## /m)[0].trim()
    const firstParagraph = introduction.split(/\n\s*\n/).find((paragraph) => paragraph.trim()) ?? ""
    assert.ok(firstParagraph.length >= 60, `${guideCase.slug} must open with a useful direct answer`)
    assert.match(firstParagraph, guideCase.directAnswerPattern)
    assert.doesNotMatch(firstParagraph, /^(?:welcome|online shopping (?:is|has become)|in this guide)/i)

    assert.match(post.content, /^## How we assessed this guide$/im)
    assert.ok(post.content.includes(guideCase.workedHeading), `${guideCase.slug} needs its worked decision section`)
    const workedBlock = post.content.split(guideCase.workedHeading)[1]?.split("\n\n## ")[0] ?? ""
    assert.ok((workedBlock.match(/^\d+\. /gm) ?? []).length >= 3, `${guideCase.slug} worked section needs at least three numbered steps`)
    assert.ok(post.content.includes(guideCase.checklistHeading), `${guideCase.slug} needs its exact checklist heading`)
    const checklistBlock = post.content.split(guideCase.checklistHeading)[1]?.split("\n\n## ")[0] ?? ""
    assert.ok((checklistBlock.match(/^\d+\. /gm) ?? []).length >= 5, `${guideCase.slug} checklist needs at least five numbered items`)
    assert.match(post.content, /^## Limitations and live-policy check$/im)
    assert.match(post.content, /^## Affiliate disclosure$/im)
    assert.ok(post.faqs?.length >= 3, `${guideCase.slug} needs at least three visible FAQs`)
    const normalizedQuestions = post.faqs.map(({ question }) =>
      question.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase()
    )
    const normalizedAnswers = post.faqs.map(({ answer }) =>
      answer.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase()
    )
    assert.ok(normalizedQuestions.every(Boolean), `${guideCase.slug} FAQ questions must be non-empty`)
    assert.ok(normalizedAnswers.every(Boolean), `${guideCase.slug} FAQ answers must be non-empty`)
    assert.equal(new Set(normalizedQuestions).size, post.faqs.length, `${guideCase.slug} FAQ questions must be distinct`)
    assert.equal(new Set(normalizedAnswers).size, post.faqs.length, `${guideCase.slug} FAQ answers must be distinct`)
    assert.deepEqual(post.recommendationIntent?.topics, guideCase.topics)
    assert.deepEqual(post.recommendationIntent?.platforms, guideCase.platforms)
    assert.deepEqual(post.recommendationIntent?.deals, guideCase.deals)

    for (const source of guideCase.requiredSources) {
      assert.ok(post.content.includes(`](${source})`), `${guideCase.slug} must cite the exact link target ${source}`)
    }
    for (const link of guideCase.requiredLinks) {
      assert.ok(post.content.includes(link), `${guideCase.slug} must link to ${link}`)
    }

    titles.push(post.title)
    excerpts.push(post.excerpt)
    coverGradients.push(post.coverGradient)
  }

  assert.equal(new Set(titles).size, saleSafetyGuideCases.length, "sale-safety guide titles must be distinct")
  assert.equal(new Set(excerpts).size, saleSafetyGuideCases.length, "sale-safety guide excerpts must be distinct")
  assert.equal(new Set(coverGradients).size, saleSafetyGuideCases.length, "sale-safety guide gradients must be distinct")
})

test("sale-season safety guides return exact compatible related-guide sets", () => {
  const safetyRelatedOrders = []

  for (const guideCase of saleSafetyGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)

    const relatedPosts = postsModule.getRelatedPosts(post, 3)
    const relatedSlugs = relatedPosts.map((relatedPost) => relatedPost.slug)
    assert.ok(relatedSlugs.length > 0, `${guideCase.slug} must return at least one related guide`)
    assert.ok(relatedSlugs.length <= 3, `${guideCase.slug} must return no more than three related guides`)
    assert.equal(new Set(relatedSlugs).size, relatedSlugs.length, `${guideCase.slug} related guides must be unique`)
    assert.deepEqual(relatedSlugs, guideCase.expectedRelatedSlugs, `${guideCase.slug} related-guide order changed`)

    for (const relatedPost of relatedPosts) {
      const sharedTopics = relatedPost.recommendationIntent?.topics.filter((topic) => guideCase.topics.includes(topic)) ?? []
      assert.ok(sharedTopics.length > 0, `${guideCase.slug} returned ${relatedPost.slug} without a compatible topic`)

      const relatedPlatforms = relatedPost.recommendationIntent?.platforms ?? []
      if (guideCase.platforms.length > 0 && relatedPlatforms.length > 0) {
        assert.ok(
          relatedPlatforms.some((platform) => guideCase.platforms.includes(platform)),
          `${guideCase.slug} returned ${relatedPost.slug} without a compatible platform`
        )
      }
    }

    if (guideCase.category === "Shopping Safety") safetyRelatedOrders.push(relatedSlugs)
  }

  assert.equal(
    new Set(safetyRelatedOrders.map((slugs) => JSON.stringify(slugs))).size,
    safetyRelatedOrders.length,
    "the three safety guides must not collapse to the same related-guide order"
  )

  const temuCase = saleSafetyGuideCases.find(({ slug }) => slug === "temu-minimum-order-philippines")
  assert.ok(temuCase)
  assert.deepEqual(temuCase.expectedRelatedSlugs, ["temu-shopping-guide-philippines"])
})

test("sale-season safety guides preserve decision-critical cautions", () => {
  const sale = postsModule.getPostBySlug("shopee-9-9-sale-philippines-2026-checklist")
  const qr = postsModule.getPostBySlug("fake-qr-code-payment-scams-philippines")
  const verification = postsModule.getPostBySlug("dti-trustmark-bir-registration-seal-online-sellers")
  const cod = postsModule.getPostBySlug("fake-cod-parcel-scam-philippines")
  const temu = postsModule.getPostBySlug("temu-minimum-order-philippines")

  assert.ok(sale && qr && verification && cod && temu)

  assert.match(sale.content, /official campaign page.*September 1 (?:through|to|–) 10/i)
  assert.match(sale.content, /live (?:sale|campaign) page and (?:the )?checkout (?:are|remain) authoritative/i)
  assert.match(sale.content, /does not guarantee.*voucher value.*stacking.*flash-sale times/i)
  assert.match(sale.content, /does not recommend borrowing.*installment offer/i)

  assert.match(qr.content, /visual inspection (?:alone )?cannot prove.*legitim/i)
  assert.match(qr.content, /Shopee payments.*(?:stay|remain|complete).*on-platform/i)
  assert.match(qr.content, /BSP.*report first.*bank or e-money issuer/i)
  assert.match(qr.content, /(?:recovery|reversal).*not (?:promised|guaranteed)/i)

  assert.match(verification.content, /DTI FAQ.*observed.*2026-08-09.*conflict/is)
  assert.match(verification.content, /mandatory.*voluntary|voluntary.*mandatory/i)
  assert.match(verification.content, /do not resolve.*(?:conflict|contradiction).*assumption/i)
  assert.match(verification.content, /absence.*(?:badge|Trustmark).*not proof of fraud/i)
  assert.match(verification.content, /not.*(?:endorsement|certification) of (?:product )?quality/i)
  assert.ok(verification.content.includes("https://verify.bir.gov.ph/correspondence/"))
  assert.match(verification.content, /bare BIR (?:URL|path).*not (?:a )?(?:general )?seller lookup/is)
  assert.match(verification.content, /without QR-supplied correspondence data.*invalid-result state/is)
  assert.match(verification.content, /QR-supplied result.*match(?:ing)? business details/is)
  assert.match(
    verification.content,
    /correct (?:host(?:name)?|domain)(?: and path)? alone.*(?:does not|cannot).*(?:validate|verify|prove).*(?:badge|seller)/is
  )

  assert.match(cod.content, /unordered parcel.*(?:real|genuine).*(?:wrong|damaged) order|(?:real|genuine).*(?:wrong|damaged) order.*unordered parcel/is)
  assert.match(cod.content, /household order log/i)
  assert.match(cod.content, /recipient script/i)
  assert.match(cod.content, /do not open.*(?:prohibit|before payment)/i)
  assert.match(cod.content, /do not blame.*rider/i)
  assert.match(cod.content, /(?:refund|reimbursement).*not (?:promised|guaranteed)/i)

  assert.match(temu.content, /no reliable fixed PHP minimum/i)
  assert.match(temu.content, /do not assume.*(?:why|reason).*threshold/i)
  assert.match(temu.content, /does not recommend.*(?:filler|cancel)/i)
  assert.match(temu.content, /does not promise.*support.*waive/i)
  assert.match(temu.content, /buy nothing today.*valid/i)
  assert.match(temu.content, /ImportTaxPH.*estimate.*not.*customs threshold.*official assessment/is)
})

test("established guides link into the sale-season safety cluster", () => {
  for (const [sourceSlug, targetSlug] of [
    ["how-to-check-shopee-seller-legit-philippines", "dti-trustmark-bir-registration-seal-online-sellers"],
    ["online-shopping-safety-tips-philippines", "fake-qr-code-payment-scams-philippines"],
    ["online-shopping-safety-tips-philippines", "fake-cod-parcel-scam-philippines"],
    ["unboxing-video-evidence-online-shopping-philippines", "fake-cod-parcel-scam-philippines"],
    ["temu-shopping-guide-philippines", "temu-minimum-order-philippines"],
  ]) {
    const post = postsModule.getPostBySlug(sourceSlug)
    assert.ok(post, `${sourceSlug} fixture must exist`)
    assert.ok(post.content.includes(`/blog/${targetSlug}`), `${sourceSlug} must link to ${targetSlug}`)
  }

  const salesCalendarSource = readFileSync(resolve("src/app/sales-calendar/page.tsx"), "utf8")
  assert.ok(
    salesCalendarSource.includes('href="/blog/shopee-9-9-sale-philippines-2026-checklist"'),
    "sales calendar must link to the dated Shopee 9.9 checkout workflow"
  )
})

test("sale-season safety guide deal recommendations match assigned tags and platforms", () => {
  const activeDeals = dealsModule.getActiveDeals()
  const activeIds = new Set(activeDeals.map((deal) => deal.id))

  for (const guideCase of saleSafetyGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    const relatedDeals = recommendationsModule.getRelatedDealsForPost(post, 3)
    const eligibleDeals = activeDeals.filter(
      (deal) =>
        !dealsModule.isSuspiciousDiscount(deal) &&
        guideCase.platforms.includes(deal.platform) &&
        deal.tags.some((tag) => guideCase.deals.tags.includes(tag.toLowerCase()))
    )

    if (eligibleDeals.length > 0) {
      assert.ok(relatedDeals.length > 0, `${guideCase.slug} must return an eligible deal when one exists`)
    } else {
      assert.deepEqual(relatedDeals, [], `${guideCase.slug} may be empty only when the catalog has no eligible deal`)
    }
    assert.ok(relatedDeals.every((deal) => activeIds.has(deal.id)))
    assert.ok(relatedDeals.every((deal) => !dealsModule.isSuspiciousDiscount(deal)))
    assert.ok(relatedDeals.every((deal) => guideCase.platforms.includes(deal.platform)))
    assert.ok(relatedDeals.every((deal) => deal.tags.some((tag) => guideCase.deals.tags.includes(tag.toLowerCase()))))
  }
})

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
    postsModule.posts
      .slice(-(augustBuyerGuideCases.length + saleSafetyGuideCases.length), -saleSafetyGuideCases.length)
      .map((post) => post.slug),
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
    assert.equal(post.lastReviewed, guideCase.lastReviewed ?? "2026-08-03")
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
  assert.match(voucher.content, /official Shopee help pages currently conflict/i)
  assert.match(voucher.content, /live checkout is authoritative/i)
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

test("Shopee voucher guidance exposes the official stacking conflict and defers to live checkout", () => {
  const post = postsModule.getPostBySlug("how-to-stack-shopee-vouchers-philippines")
  assert.ok(post)

  for (const source of [
    "https://help.shopee.ph/portal/4/article/81188-How-do-I-use-saved-Vouchers-during-checkout",
    "https://help.shopee.ph/portal/4/article/81031-%5BVouchers%5D-What-vouchers-are-there-on-Shopee%3F-%28ENG%29",
    "https://help.shopee.ph/portal/4/article/82323-%5BVouchers%5D-How-do-I-apply-vouchers-at-checkout",
  ]) {
    assert.ok(post.content.includes(source), `voucher guide must cite ${source}`)
  }

  assert.equal(post.lastReviewed, "2026-08-09")
  assert.match(post.content, /official Shopee help pages currently conflict/i)
  assert.match(post.content, /up to 2 voucher types/i)
  assert.match(post.content, /up to 3 vouchers/i)
  assert.match(post.content, /live checkout is authoritative/i)
  assert.match(
    post.content,
    /when both controls appear, test an eligible Free Shipping voucher together with an eligible Discount or Coins Cashback voucher/i
  )
  assert.match(post.content, /compare each voucher alone with the accepted combination/i)
  assert.match(post.content, /does not promise that a three-voucher stack will be eligible/i)
  assert.doesNotMatch(post.content, /one Shopee platform voucher/i)

  const stackFaq = post.faqs?.find((faq) => /Free Shipping.*Discount.*Cashback/i.test(faq.question))
  assert.ok(stackFaq, "voucher guide must keep a visible platform-voucher stacking FAQ")
  assert.match(stackFaq.answer, /official help pages conflict/i)
  assert.match(stackFaq.answer, /test.*together/i)
  assert.match(stackFaq.answer, /not a guarantee/i)
})

test("Temu return guidance preserves category qualifiers and separates inspection from fault", () => {
  const post = postsModule.getPostBySlug("temu-returns-refunds-price-adjustment-philippines")
  assert.ok(post)

  assert.equal(post.lastReviewed, "2026-08-09")
  assert.match(post.content, /clothing-specific exclusion/i)
  assert.match(post.content, /some health and personal-care items/i)
  assert.match(post.content, /some free gifts/i)
  assert.match(post.content, /some customized products/i)
  assert.match(post.content, /some underwear orders/i)
  assert.match(post.content, /separate quality-inspection and reduced-refund rule/i)
  assert.match(post.content, /not due to Temu or the seller/i)
  assert.match(post.content, /arrived damaged.*buyer-caused damage/is)
  assert.match(post.content, /improper return packaging.*Temu- or seller-caused damage/is)

  const exclusionsFaq = post.faqs?.find((faq) => /return exclusions/i.test(faq.question))
  assert.ok(exclusionsFaq, "Temu guide must expose a visible exclusions FAQ")
  assert.match(exclusionsFaq.answer, /clothing/i)
  assert.match(exclusionsFaq.answer, /some health and personal-care, free-gift, customized, and underwear/i)
  assert.match(exclusionsFaq.answer, /live product and order terms control/i)
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
    const contentHash = createHash("sha256").update(asset).digest("hex")
    assert.equal(contentHash, guideCase.coverImageSha256, `${guideCase.coverImage} must match its accepted SHA-256`)
    contentHashes.push(contentHash)
  }

  assert.equal(new Set(coverPaths).size, augustBuyerGuideCases.length)
  assert.equal(new Set(contentHashes).size, augustBuyerGuideCases.length)
})

test("sale-season safety guides use five accepted distinct 1600x900 JPEG covers", () => {
  const coverPaths = []
  const contentHashes = []

  for (const guideCase of saleSafetyGuideCases) {
    const post = postsModule.getPostBySlug(guideCase.slug)
    assert.ok(post, `${guideCase.slug} fixture must exist`)
    assert.equal(post.coverImage, guideCase.coverImage)
    assert.equal(post.coverImageAlt, guideCase.coverImageAlt)
    assert.match(post.coverImage, /\.jpg$/i)

    const assetPath = resolve("public", post.coverImage.replace(/^\/+/, ""))
    assert.ok(existsSync(assetPath), `${post.coverImage} must exist under public/`)
    const asset = readFileSync(assetPath)
    assert.deepEqual(readJpegDimensions(asset), { width: 1600, height: 900 })
    coverPaths.push(post.coverImage)
    const contentHash = createHash("sha256").update(asset).digest("hex")
    assert.equal(contentHash, guideCase.coverImageSha256, `${post.coverImage} must match its accepted SHA-256`)
    contentHashes.push(contentHash)
  }

  assert.equal(new Set(coverPaths).size, saleSafetyGuideCases.length)
  assert.equal(new Set(contentHashes).size, saleSafetyGuideCases.length)
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
  assert.equal(relatedPosts.length, 3, "canonical Shopee seller guide must return three related guides")
  assert.ok(
    relatedPosts.every((post) => post.recommendationIntent?.platforms?.includes("Shopee PH")),
    `expected Shopee-specific guide intents, received ${relatedPosts.map((post) => post.slug).join(", ")}`
  )

  const relatedDeals = recommendationsModule.getRelatedDealsForPost(currentPost, 3)
  assert.equal(relatedDeals.length, 3)
  assert.ok(relatedDeals.every((deal) => deal.platform === "Shopee PH"))
  assert.ok(relatedDeals.every((deal) => deal.tags.includes("shopee")))
})
