import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"
import ts from "typescript"

const filename = resolve("src/lib/blog-listing.ts")
const moduleRecord = { exports: {} }
if (existsSync(filename)) {
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  })
  new Function("exports", "module", outputText)(moduleRecord.exports, moduleRecord)
}

function resolveListing(raw = {}, input = posts) {
  assert.equal(typeof moduleRecord.exports.resolveBlogListing, "function", "resolveBlogListing should be exported")
  return moduleRecord.exports.resolveBlogListing(input, raw)
}

function href(filters) {
  assert.equal(typeof moduleRecord.exports.buildBlogHref, "function", "buildBlogHref should be exported")
  return moduleRecord.exports.buildBlogHref(filters)
}

const posts = [
  { id: "newest", slug: "phone", title: "Phone Tripod", excerpt: "Stable video calls", category: "Tech Guides", tags: ["camera", "desk setup"], content: "BodyOnlySecret", publishedAt: "2026-10-03", lastReviewed: "2026-10-03", author: "SulitScan PH", readTime: 5, coverGradient: "from-green-100" },
  { id: "middle", slug: "glass", title: "Glass Storage", excerpt: "Food storage checklist", category: "Home Guides", tags: ["containers", "kitchen"], content: "BodyOnlySecret", publishedAt: "2026-10-02", lastReviewed: "2026-10-02", author: "SulitScan PH", readTime: 5, coverGradient: "from-green-100" },
  { id: "oldest", slug: "calls", title: "Video Calls", excerpt: "Tripod setup checklist", category: "Tech Guides", tags: ["interview"], content: "BodyOnlySecret", publishedAt: "2026-10-01", lastReviewed: "2026-10-01", author: "SulitScan PH", readTime: 5, coverGradient: "from-green-100" },
]

test("normalization uses first repeated values and collapses whitespace", () => {
  const result = resolveListing({ q: ["  VIDEO\t  calls\n", "storage"], category: ["  Tech   Guides ", "Home Guides"] })
  assert.equal(result.q, "VIDEO calls")
  assert.equal(result.category, "Tech Guides")
  assert.deepEqual(result.items.map((post) => post.id), ["newest", "oldest"])
  assert.equal(resolveListing({ category: "tech guides" }).category, "Tech Guides")
})

test("queries are capped at 80 characters after whitespace normalization", () => {
  assert.equal(resolveListing({ q: `  ${"a".repeat(81)}  ` }).q, "a".repeat(80))
})

test("unknown categories normalize to All without hiding posts", () => {
  const result = resolveListing({ category: "Unknown", q: ["", "storage"] })
  assert.equal(result.category, "All")
  assert.equal(result.q, "")
  assert.deepEqual(result.items, posts)
  assert.equal(result.isFiltered, false)
})

test("category options remain complete, deduplicated, and deterministic while searching", () => {
  assert.deepEqual(resolveListing({ q: "phone" }).categories, ["All", "Home Guides", "Tech Guides"])
})

for (const [q, ids] of [
  ["PHONE", ["newest"]],
  ["FOOD STORAGE", ["middle"]],
  ["TECH GUIDES", ["newest", "oldest"]],
  ["INTERVIEW", ["oldest"]],
  ["BodyOnlySecret", []],
]) {
  test(`query ${q} searches only title, excerpt, category, and tags case-insensitively`, () => {
    assert.deepEqual(resolveListing({ q }).items.map((post) => post.id), ids)
  })
}

test("category and query intersect while preserving input order and input data", () => {
  const frozenPosts = Object.freeze(posts.map((post) => Object.freeze({ ...post, tags: Object.freeze([...post.tags]) })))
  const result = resolveListing({ q: "checklist", category: "Tech Guides" }, frozenPosts)
  assert.deepEqual(result.items.map((post) => post.id), ["oldest"])
  assert.equal(result.total, 1)
  assert.equal(result.isFiltered, true)
  assert.equal(result.noResults, false)
  assert.deepEqual(resolveListing({ category: "Tech Guides" }).items.map((post) => post.id), ["newest", "oldest"])
})

test("default, whitespace, and empty-array filters return all guides", () => {
  for (const raw of [{}, { q: " \n " }, { category: "All" }, { q: [], category: [] }]) {
    const result = resolveListing(raw)
    assert.deepEqual(result.items, posts)
    assert.equal(result.total, 3)
    assert.equal(result.isFiltered, false)
    assert.equal(result.noResults, false)
  }
})

test("no matches and an empty registry return an explicit no-results state", () => {
  const result = resolveListing({ q: "nonexistent" })
  assert.deepEqual(result.items, [])
  assert.equal(result.total, 0)
  assert.equal(result.noResults, true)
  assert.equal(result.isFiltered, true)
  assert.deepEqual(resolveListing({}, []).categories, ["All"])
  assert.equal(resolveListing({}, []).noResults, true)
})

test("blog hrefs normalize, encode deterministically, and omit defaults", () => {
  assert.equal(href({}), "/blog")
  assert.equal(href({ q: " \n ", category: "All" }), "/blog")
  assert.equal(href({ category: "  Tech   Guides ", q: " phone & video / calls " }), "/blog?q=phone+%26+video+%2F+calls&category=Tech+Guides")
  assert.equal(href({ q: "a".repeat(81), category: "" }), `/blog?q=${"a".repeat(80)}`)
})
