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
const dealsModule = loadTypeScriptModule("src/data/deals.ts")
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
    requiredRelatedSlug: "best-shopee-finds-under-500-philippines",
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
