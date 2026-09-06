import assert from "node:assert/strict"
import { dirname, resolve } from "node:path"
import { readFileSync } from "node:fs"
import test from "node:test"
import ts from "typescript"

function loadTypeScriptModule(relativePath, dependencies = {}) {
  const filename = resolve(relativePath)
  const source = readFileSync(filename, "utf8")
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: filename,
  })
  const moduleRecord = { exports: {} }
  const evaluate = new Function("exports", "require", "module", "__filename", "__dirname", outputText)
  evaluate(moduleRecord.exports, (specifier) => {
    if (Object.hasOwn(dependencies, specifier)) return dependencies[specifier]
    throw new Error(`Unexpected dependency ${specifier} from ${relativePath}`)
  }, moduleRecord, filename, dirname(filename))
  return moduleRecord.exports
}

const seasonalPromotion = loadTypeScriptModule("src/lib/seasonal-promotion.ts")

function requireFunction(exportName) {
  assert.equal(typeof seasonalPromotion[exportName], "function", `${exportName} should be exported`)
  return seasonalPromotion[exportName]
}

const promotionCases = [
  ["the instant before the 9.9 window", "2026-08-31T15:59:59.999Z", undefined],
  ["the inclusive start of the 9.9 window", "2026-08-31T16:00:00.000Z", {
    slug: "shopee-9-9-sale-philippines-2026-checklist",
    href: "/blog/shopee-9-9-sale-philippines-2026-checklist",
    announcement: "9.9 checkout checklist: compare the final total →",
  }],
  ["an in-window 9.9 instant", "2026-09-05T04:30:00.000Z", {
    slug: "shopee-9-9-sale-philippines-2026-checklist",
    href: "/blog/shopee-9-9-sale-philippines-2026-checklist",
    announcement: "9.9 checkout checklist: compare the final total →",
  }],
  ["the inclusive end of the 9.9 window", "2026-09-10T15:59:59.999Z", {
    slug: "shopee-9-9-sale-philippines-2026-checklist",
    href: "/blog/shopee-9-9-sale-philippines-2026-checklist",
    announcement: "9.9 checkout checklist: compare the final total →",
  }],
  ["the instant after the 9.9 window", "2026-09-10T16:00:00.000Z", undefined],
]

for (const [description, instant, expected] of promotionCases) {
  test(`getSeasonalPromotion returns the expected campaign for ${description}`, () => {
    const getSeasonalPromotion = requireFunction("getSeasonalPromotion")

    assert.deepEqual(getSeasonalPromotion(new Date(instant)), expected)
  })
}

test("getSeasonalPromotion returns a distinct immutable campaign copy", () => {
  const getSeasonalPromotion = requireFunction("getSeasonalPromotion")
  const first = getSeasonalPromotion(new Date("2026-09-05T04:30:00.000Z"))
  const second = getSeasonalPromotion(new Date("2026-09-05T04:30:00.000Z"))

  assert.notEqual(first, second)
  assert.ok(Object.isFrozen(first))
})

const orderedPosts = [
  { slug: "newest-guide" },
  { slug: "shopee-9-9-sale-philippines-2026-checklist" },
  { slug: "second-newest-guide" },
  { slug: "older-guide" },
]

test("getPromotedPosts puts the 9.9 guide first without duplicating it", () => {
  const getPromotedPosts = requireFunction("getPromotedPosts")

  assert.deepEqual(
    getPromotedPosts(orderedPosts, new Date("2026-09-05T04:30:00.000Z"), 3).map((post) => post.slug),
    ["shopee-9-9-sale-philippines-2026-checklist", "newest-guide", "second-newest-guide"]
  )
})

test("getPromotedPosts preserves newest-first ordering outside the 9.9 window", () => {
  const getPromotedPosts = requireFunction("getPromotedPosts")

  assert.deepEqual(
    getPromotedPosts(orderedPosts, new Date("2026-09-10T16:00:00.000Z"), 3).map((post) => post.slug),
    ["newest-guide", "shopee-9-9-sale-philippines-2026-checklist", "second-newest-guide"]
  )
})

test("getPromotedPosts keeps the normal list when the promoted guide is missing", () => {
  const getPromotedPosts = requireFunction("getPromotedPosts")
  const postsWithoutPromotion = orderedPosts.filter(
    (post) => post.slug !== "shopee-9-9-sale-philippines-2026-checklist"
  )

  assert.deepEqual(
    getPromotedPosts(postsWithoutPromotion, new Date("2026-09-05T04:30:00.000Z"), 3).map((post) => post.slug),
    ["newest-guide", "second-newest-guide", "older-guide"]
  )
})

test("getPromotedPosts clamps requested counts from zero through the available list", () => {
  const getPromotedPosts = requireFunction("getPromotedPosts")
  const now = new Date("2026-09-05T04:30:00.000Z")

  assert.deepEqual(getPromotedPosts(orderedPosts, now, 0), [])
  assert.deepEqual(getPromotedPosts(orderedPosts, now, 1).map((post) => post.slug), [
    "shopee-9-9-sale-philippines-2026-checklist",
  ])
  assert.deepEqual(getPromotedPosts(orderedPosts, now, 2).map((post) => post.slug), [
    "shopee-9-9-sale-philippines-2026-checklist",
    "newest-guide",
  ])
  assert.deepEqual(getPromotedPosts(orderedPosts, now, 3).map((post) => post.slug), [
    "shopee-9-9-sale-philippines-2026-checklist",
    "newest-guide",
    "second-newest-guide",
  ])
  assert.deepEqual(getPromotedPosts(orderedPosts, now, 99).map((post) => post.slug), [
    "shopee-9-9-sale-philippines-2026-checklist",
    "newest-guide",
    "second-newest-guide",
    "older-guide",
  ])
  assert.deepEqual(getPromotedPosts(orderedPosts, now, Number.NaN), [])
  assert.deepEqual(getPromotedPosts(orderedPosts, now, Number.POSITIVE_INFINITY), [])
  assert.deepEqual(getPromotedPosts(orderedPosts, now, -1), [])
  assert.deepEqual(getPromotedPosts(orderedPosts, now, 2.9).map((post) => post.slug), [
    "shopee-9-9-sale-philippines-2026-checklist",
    "newest-guide",
  ])
})

function createElement(type, props, key) {
  return { type, key, props: props ?? {} }
}

function findElements(node, predicate, results = []) {
  if (Array.isArray(node)) {
    for (const child of node) findElements(child, predicate, results)
    return results
  }
  if (!node || typeof node !== "object") return results
  if (predicate(node)) results.push(node)
  findElements(node.props?.children, predicate, results)
  return results
}

const Link = () => null
const BlogCard = () => null
const component = () => null
const icons = new Proxy({}, { get: () => component })
const jsxRuntime = {
  Fragment: Symbol.for("react.fragment"),
  jsx: createElement,
  jsxs: createElement,
}
const homepagePosts = [
  { id: "newest", slug: "newest-guide" },
  { id: "promotion", slug: "shopee-9-9-sale-philippines-2026-checklist" },
  { id: "second", slug: "second-newest-guide" },
  { id: "older", slug: "older-guide" },
]

const pageModule = loadTypeScriptModule("src/app/page.tsx", {
  "react/jsx-runtime": jsxRuntime,
  "next/link": { default: Link },
  "@/components/Hero": { default: component },
  "@/components/DealCard": { default: component },
  "@/components/CategoryCard": { default: component },
  "@/components/BlogCard": { default: BlogCard },
  "@/components/SectionHeading": { default: component },
  "@/components/PartnerBanners": { default: component },
  "@/components/newsletter/NewsletterSignup": { default: component },
  "@/components/SeoJsonLd": { ItemListJsonLd: component, FAQJsonLd: component },
  "@/data/partner-banners": { homePartnerBanners: [] },
  "@/data/deals": {
    getFeaturedDeals: () => [],
    getActiveDeals: () => [],
    getDealsByCategory: () => [],
  },
  "@/data/categories": { categories: [] },
  "@/data/posts": {
    getRecentPosts: () => homepagePosts.slice(0, 3),
    getPostsNewestFirst: () => homepagePosts,
  },
  "@/lib/seasonal-promotion": seasonalPromotion,
  "@/lib/seo": { siteConfig: { url: "https://sulitscan.example" } },
  "@/lib/deal-freshness": { getFreshnessSafeReason: () => "" },
  "lucide-react": icons,
})

test("the homepage gives the live 9.9 guide the first card", () => {
  const RealDate = Date
  globalThis.Date = class extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : ["2026-09-05T04:30:00.000Z"]))
    }
  }

  try {
    const tree = pageModule.default()
    const cards = findElements(tree, (element) => element.type === BlogCard)
    assert.deepEqual(cards.map((card) => card.props.post.slug), [
      "shopee-9-9-sale-philippines-2026-checklist",
      "newest-guide",
      "second-newest-guide",
    ])
  } finally {
    globalThis.Date = RealDate
  }
})

function createHeaderModule() {
  const state = []
  const effects = []
  let stateIndex = 0
  const react = {
    useState(initialValue) {
      const index = stateIndex++
      if (state.length === index) state.push(initialValue)
      return [state[index], (nextValue) => {
        state[index] = typeof nextValue === "function" ? nextValue(state[index]) : nextValue
      }]
    },
    useEffect(effect) {
      effects.push(effect)
    },
  }
  const headerModule = loadTypeScriptModule("src/components/Header.tsx", {
    "react/jsx-runtime": jsxRuntime,
    react,
    "next/link": { default: Link },
    "lucide-react": icons,
    "@/lib/utils": { cn: (...classes) => classes.filter(Boolean).join(" ") },
    "@/components/Logo": { default: component },
    "@/lib/seasonal-promotion": seasonalPromotion,
  })

  return {
    effects,
    render() {
      stateIndex = 0
      return headerModule.default()
    },
  }
}

function getAnnouncementLink(tree) {
  const [link] = findElements(
    tree,
    (element) => element.type === Link && element.props.className?.includes("font-bold underline")
  )
  return link
}

test("the header starts generic, then shows the 9.9 announcement after mount", () => {
  const previousWindow = globalThis.window
  const RealDate = Date
  globalThis.window = {
    addEventListener() {},
    cancelAnimationFrame() {},
    removeEventListener() {},
    requestAnimationFrame(callback) {
      callback()
      return 1
    },
    scrollY: 0,
  }
  globalThis.Date = class extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : ["2026-09-05T04:30:00.000Z"]))
    }
  }
  const header = createHeaderModule()

  try {
    const initialLink = getAnnouncementLink(header.render())
    assert.equal(initialLink.props.href, "/blog")
    assert.equal(initialLink.props.children, "Browse what's fresh →")

    for (const effect of header.effects) effect()
    const mountedLink = getAnnouncementLink(header.render())
    assert.equal(mountedLink.props.href, "/blog/shopee-9-9-sale-philippines-2026-checklist")
    assert.equal(mountedLink.props.children, "9.9 checkout checklist: compare the final total →")
  } finally {
    globalThis.Date = RealDate
    globalThis.window = previousWindow
  }
})
