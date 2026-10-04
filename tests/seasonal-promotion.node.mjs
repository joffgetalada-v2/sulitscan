import assert from "node:assert/strict"
import { dirname, resolve } from "node:path"
import { readFileSync } from "node:fs"
import test from "node:test"
import ts from "typescript"

function loadTypeScriptModule(relativePath, dependencies = {}) {
  const filename = resolve(relativePath)
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
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

const { getSeasonalPromotion, getPromotedPosts } = loadTypeScriptModule("src/lib/seasonal-promotion.ts")
const campaigns = [
  {
    name: "10.10",
    before: "2026-10-02T15:59:59.999Z",
    start: "2026-10-02T16:00:00.000Z",
    inside: "2026-10-03T00:00:00.000Z",
    end: "2026-10-10T15:59:59.999Z",
    after: "2026-10-10T16:00:00.000Z",
    promotion: {
      slug: "10-10-sale-philippines-guide",
      href: "/blog/10-10-sale-philippines-guide",
      announcement: "10.10 checkout guide: compare the final total →",
    },
  },
  {
    name: "11.11",
    before: "2026-10-24T15:59:59.999Z",
    start: "2026-10-24T16:00:00.000Z",
    inside: "2026-11-01T04:30:00.000Z",
    end: "2026-11-11T15:59:59.999Z",
    after: "2026-11-11T16:00:00.000Z",
    promotion: {
      slug: "11-11-sale-philippines-cart-building-checklist",
      href: "/blog/11-11-sale-philippines-cart-building-checklist",
      announcement: "11.11 cart checklist: set your baseline first →",
    },
  },
]

const orderedPosts = [
  { id: "newest", slug: "newest-guide" },
  { id: "october", slug: "10-10-sale-philippines-guide" },
  { id: "second", slug: "second-newest-guide" },
  { id: "november", slug: "11-11-sale-philippines-cart-building-checklist" },
  { id: "older", slug: "older-guide" },
]
const slugs = (posts) => posts.map((post) => post.slug)

test("the first configured campaign wins when date parsing supplies overlapping windows", () => {
  const RealDate = Date
  // Keep the production selector real; supply overlapping configuration bounds
  // at module initialization without adding a public test-only campaign API.
  globalThis.Date = class extends RealDate {
    static parse(value) {
      return RealDate.parse(value === "2026-10-24T16:00:00.000Z"
        ? "2026-10-02T16:00:00.000Z" : value)
    }
  }
  try {
    const overlapping = loadTypeScriptModule("src/lib/seasonal-promotion.ts")
    assert.deepEqual(overlapping.getSeasonalPromotion(new RealDate("2026-10-03T00:00:00.000Z")),
      campaigns[0].promotion)
  } finally {
    globalThis.Date = RealDate
  }
})

for (const campaign of campaigns) {
  for (const [label, instant, expected] of [
    ["instant before", campaign.before, undefined],
    ["inclusive start", campaign.start, campaign.promotion],
    ["in-window instant", campaign.inside, campaign.promotion],
    ["inclusive end", campaign.end, campaign.promotion],
    ["instant after", campaign.after, undefined],
  ]) {
    test(`${campaign.name}: ${label} selects the exact campaign`, () => {
      assert.deepEqual(getSeasonalPromotion(new Date(instant)), expected)
    })
  }

  test(`${campaign.name}: campaign returns are distinct and immutable`, () => {
    const first = getSeasonalPromotion(new Date(campaign.inside))
    const second = getSeasonalPromotion(new Date(campaign.inside))
    assert.deepEqual(first, campaign.promotion)
    assert.notEqual(first, second)
    assert.ok(Object.isFrozen(first))
    assert.throws(() => { first.href = "/changed" }, TypeError)
    assert.deepEqual(getSeasonalPromotion(new Date(campaign.inside)), campaign.promotion)
  })

  test(`${campaign.name}: promotes its guide while preserving remaining order`, () => {
    assert.deepEqual(slugs(getPromotedPosts(orderedPosts, new Date(campaign.inside))), campaign.name === "10.10"
      ? ["10-10-sale-philippines-guide", "newest-guide", "second-newest-guide"]
      : ["11-11-sale-philippines-cart-building-checklist", "newest-guide", "10-10-sale-philippines-guide"])
  })

  test(`${campaign.name}: missing guide preserves the ordinary list`, () => {
    const missing = orderedPosts.filter((post) => post.slug !== campaign.promotion.slug)
    assert.deepEqual(getPromotedPosts(missing, new Date(campaign.inside), 99), missing)
  })
}

for (const [label, instant] of [
  ["expired 9.9 campaign", "2026-09-05T04:30:00.000Z"],
  ["gap between campaigns", "2026-10-15T00:00:00.000Z"],
  ["invalid date", "invalid"],
]) {
  test(`${label}: no promotion and ordinary newest-first ordering`, () => {
    const now = new Date(instant)
    assert.equal(getSeasonalPromotion(now), undefined)
    assert.deepEqual(getPromotedPosts(orderedPosts, now, 3), orderedPosts.slice(0, 3))
  })
}

test("post returns deduplicate by slug before counting, keeping the first record", () => {
  const duplicated = [orderedPosts[0], orderedPosts[0], orderedPosts[1],
    { id: "duplicate", slug: orderedPosts[1].slug }, ...orderedPosts.slice(2)]
  const snapshot = structuredClone(duplicated)
  for (const instant of [campaigns[0].inside, campaigns[1].inside, "2026-10-15T00:00:00.000Z"]) {
    const result = getPromotedPosts(duplicated, new Date(instant), 99)
    assert.equal(result.length, 5)
    assert.equal(new Set(slugs(result)).size, 5)
    assert.equal(result.find((post) => post.slug === orderedPosts[1].slug), orderedPosts[1])
    assert.equal(getPromotedPosts(duplicated, new Date(instant), 3).length, 3)
  }
  const missing = duplicated.filter((post) => post.slug !== campaigns[1].promotion.slug)
  assert.deepEqual(slugs(getPromotedPosts(missing, new Date(campaigns[1].inside), 99)),
    ["newest-guide", "10-10-sale-philippines-guide", "second-newest-guide", "older-guide"])
  assert.deepEqual(duplicated, snapshot)
})

test("post returns are distinct arrays and never mutate a frozen source", () => {
  const source = Object.freeze(orderedPosts.map((post) => Object.freeze({ ...post })))
  for (const instant of [campaigns[0].inside, "2026-10-15T00:00:00.000Z", "invalid"]) {
    const first = getPromotedPosts(source, new Date(instant), 99)
    const second = getPromotedPosts(source, new Date(instant), 99)
    assert.notEqual(first, source)
    assert.notEqual(first, second)
    first.pop()
    assert.equal(second.length, 5)
    assert.deepEqual(source, orderedPosts)
  }
})

test("post counts default, clamp, floor, and reject nonfinite values deterministically", () => {
  const now = new Date(campaigns[0].inside)
  for (const count of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0.9]) {
    assert.deepEqual(getPromotedPosts(orderedPosts, now, count), [])
  }
  assert.deepEqual(slugs(getPromotedPosts(orderedPosts, now)),
    ["10-10-sale-philippines-guide", "newest-guide", "second-newest-guide"])
  assert.deepEqual(slugs(getPromotedPosts(orderedPosts, now, 1)), ["10-10-sale-philippines-guide"])
  assert.deepEqual(slugs(getPromotedPosts(orderedPosts, now, 2.9)),
    ["10-10-sale-philippines-guide", "newest-guide"])
  assert.equal(getPromotedPosts(orderedPosts, now, 99).length, 5)
  assert.deepEqual(getPromotedPosts([], now, 99), [])
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
const jsxRuntime = { Fragment: Symbol.for("react.fragment"), jsx: createElement, jsxs: createElement }
const pageModule = loadTypeScriptModule("src/app/page.tsx", {
  "react/jsx-runtime": jsxRuntime,
  "next/link": { default: Link },
  "@/components/Hero": { default: component },
  "@/components/CatalogRefreshNotice": { default: component },
  "@/lib/deal-scanner": loadTypeScriptModule("src/lib/deal-scanner.ts", {
    "@/lib/deal-freshness": loadTypeScriptModule("src/lib/deal-freshness.ts"),
  }),
  "@/components/DealCard": { default: component },
  "@/components/CategoryCard": { default: component },
  "@/components/BlogCard": { default: BlogCard },
  "@/components/SectionHeading": { default: component },
  "@/components/PartnerBanners": { default: component },
  "@/components/newsletter/NewsletterSignup": { default: component },
  "@/components/SeoJsonLd": { ItemListJsonLd: component, FAQJsonLd: component },
  "@/data/partner-banners": { homePartnerBanners: [] },
  "@/data/deals": { getFeaturedDeals: () => [], getActiveDeals: () => [], getDealsByCategory: () => [] },
  "@/data/categories": { categories: [] },
  "@/data/posts": { getPostsNewestFirst: () => orderedPosts },
  "@/lib/seasonal-promotion": { getSeasonalPromotion, getPromotedPosts },
  "@/lib/seo": { siteConfig: { url: "https://sulitscan.example" } },
  "@/lib/deal-freshness": { getFreshnessSafeReason: () => "" },
  "lucide-react": icons,
})

test("homepage renders at request time so campaign boundaries cannot serve stale ISR order", () => {
  assert.equal(pageModule.dynamic, "force-dynamic")
  assert.equal(pageModule.revalidate, undefined)
})

function withClock(instant, run) {
  const RealDate = Date
  globalThis.Date = class extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : [typeof instant === "function" ? instant() : instant]))
    }
  }
  try { return run() } finally { globalThis.Date = RealDate }
}

for (const campaign of campaigns) {
  test(`homepage gives the live ${campaign.name} guide the first card`, () => {
    withClock(campaign.inside, () => {
      const cards = findElements(pageModule.default(), (element) => element.type === BlogCard)
      assert.deepEqual(cards.map((card) => card.props.post.slug), campaign.name === "10.10"
        ? ["10-10-sale-philippines-guide", "newest-guide", "second-newest-guide"]
        : ["11-11-sale-philippines-cart-building-checklist", "newest-guide", "10-10-sale-philippines-guide"])
    })
  })
}

test("homepage retains ordinary guide ordering between campaign windows", () => {
  withClock("2026-10-15T00:00:00.000Z", () => {
    const cards = findElements(pageModule.default(), (element) => element.type === BlogCard)
    assert.deepEqual(cards.map((card) => card.props.post.slug),
      ["newest-guide", "10-10-sale-philippines-guide", "second-newest-guide"])
  })
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
    useEffect(effect) { effects.push(effect) },
  }
  const headerModule = loadTypeScriptModule("src/components/Header.tsx", {
    "react/jsx-runtime": jsxRuntime,
    react,
    "next/link": { default: Link },
    "lucide-react": icons,
    "@/lib/utils": { cn: (...classes) => classes.filter(Boolean).join(" ") },
    "@/components/Logo": { default: component },
    "@/lib/seasonal-promotion": { getSeasonalPromotion, getPromotedPosts },
  })
  return { effects, render() { stateIndex = 0; return headerModule.default() } }
}

function getAnnouncementLink(tree) {
  return findElements(tree, (element) => element.type === Link &&
    element.props.className?.includes("font-bold underline"))[0]
}

function withHeaderWindow(run) {
  const previousWindow = globalThis.window
  const frames = []
  const cancelled = []
  globalThis.window = {
    addEventListener() {}, removeEventListener() {}, scrollY: 0,
    cancelAnimationFrame(id) { cancelled.push(id) },
    requestAnimationFrame(callback) { frames.push(callback); return frames.length },
  }
  try { return run(frames, cancelled) } finally { globalThis.window = previousWindow }
}

function assertAnnouncement(tree, promotion) {
  const link = getAnnouncementLink(tree)
  assert.equal(link.props.href, promotion?.href ?? "/blog")
  assert.equal(link.props.children, promotion?.announcement ?? "Browse what's fresh →")
}

for (const campaign of campaigns) {
  test(`header starts generic, then shows the exact ${campaign.name} destination and copy`, () => {
    withClock(campaign.inside, () => withHeaderWindow((frames, cancelled) => {
      const header = createHeaderModule()
      assertAnnouncement(header.render(), undefined)
      const cleanup = header.effects.map((effect) => effect())
      assertAnnouncement(header.render(), undefined)
      assert.equal(frames.length, 1)
      frames[0]()
      assertAnnouncement(header.render(), campaign.promotion)
      cleanup.forEach((effect) => effect())
      assert.deepEqual(cancelled, [1])
    }))
  })

  for (const [label, initial, next, expected] of [
    ["inclusive start", campaign.before, campaign.start, campaign.promotion],
    ["instant after inclusive end", campaign.end, campaign.after, undefined],
  ]) {
    test(`header evaluates ${campaign.name} at the held frame's ${label}`, () => {
      let now = initial
      withClock(() => now, () => withHeaderWindow((frames) => {
        const header = createHeaderModule()
        assertAnnouncement(header.render(), undefined)
        header.effects.forEach((effect) => effect())
        assert.equal(frames.length, 1)
        now = next
        frames[0]()
        assertAnnouncement(header.render(), expected)
      }))
    })
  }
}

test("header remains generic after mount between campaign windows", () => {
  withClock("2026-10-15T00:00:00.000Z", () => withHeaderWindow((frames) => {
    const header = createHeaderModule()
    assertAnnouncement(header.render(), undefined)
    header.effects.forEach((effect) => effect())
    frames[0]()
    assertAnnouncement(header.render(), undefined)
  }))
})
