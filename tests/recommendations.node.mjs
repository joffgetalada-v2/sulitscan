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
