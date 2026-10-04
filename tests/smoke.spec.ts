import { test, expect, type Page } from "@playwright/test"
import { getActiveDeals, getDealBySlug, getDealsByCategory, getDealsByPlatform } from "../src/data/deals"
import { getPostBySlug } from "../src/data/posts"
import { getRelatedDealsForPost } from "../src/lib/blog-recommendations"
import { getDealScannerSlides } from "../src/lib/deal-scanner"
import { getSeasonalPromotion } from "../src/lib/seasonal-promotion"
import { getDealFreshness } from "../src/lib/deal-freshness"
import { isDealIndexable } from "../src/lib/deal-seo"
import { DEALS_PAGE_SIZE, resolveDealListing } from "../src/lib/deal-listing"
import { ENTITY_DEALS_PAGE_SIZE } from "../src/lib/entity-deal-listing"
import { formatPrice } from "../src/lib/utils"

// Inspect genuine inventory at one clock instant; never edit freshness dates to
// make a browser scenario applicable. Frozen historical rendering is tested in Node.
const inventoryNow = new Date()
const activeDeals = getActiveDeals(inventoryNow)
const scannerSlides = getDealScannerSlides(activeDeals, 6, inventoryNow)
const allDealsListing = resolveDealListing(activeDeals, {})
function entityDeals(path: string) {
  if (path.startsWith("/categories/")) return getDealsByCategory(path.split("/").at(-1)!, inventoryNow)
  return getDealsByPlatform("Temu", inventoryNow)
}

async function expectRelatedDealRendering(page: Page, slug: string) {
  const post = getPostBySlug(slug)
  expect(post).toBeDefined()
  const expected = getRelatedDealsForPost(post!)
  const region = page.getByRole("region", { name: "Related deals to check" })
  if (expected.length === 0) {
    await expect(region).toHaveCount(0)
    await expect(page.getByRole("heading", { name: "Related deals to check", exact: true })).toHaveCount(0)
    return
  }
  await expect(region).toBeVisible()
  await expect(region.getByRole("heading", { name: "Related deals to check", exact: true })).toBeVisible()
  const cards = region.locator("article")
  await expect(cards).toHaveCount(expected.length)
  for (const [index, deal] of expected.entries()) {
    await expect(cards.nth(index).getByRole("heading", { name: deal.title, exact: true })).toBeVisible()
    await expect(cards.nth(index).locator(`a[href="/deals/${deal.slug}"]`).first()).toHaveAttribute("href", `/deals/${deal.slug}`)
  }
}

async function installAnalyticsCapture(page: Page) {
  await page.evaluate(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    const capture: NonNullable<typeof window.va> = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
    Object.defineProperty(window, "va", {
      configurable: true,
      get: () => capture,
      set: () => undefined,
    })
  })
}

async function newsletterEvents(page: Page) {
  return page.evaluate(() =>
    (window as typeof window & {
      __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
    }).__events.filter(
      (event) => event.type === "event" && event.payload.name?.startsWith("newsletter_signup")
    )
  )
}

async function getAllDealsPageCount(page: Page) {
  await page.goto("/deals", { waitUntil: "domcontentloaded" })
  const pageCount = Number((await page.locator("p").filter({ hasText: /^Page \d+ of \d+$/ }).textContent())?.match(/of (\d+)/)?.[1])
  expect(pageCount).toBeGreaterThanOrEqual(1)
  return pageCount
}

const routes = [
  { path: "/",                     title: "SulitScan PH" },
  { path: "/tools/checkout-comparison", title: "Checkout Price Comparison" },
  { path: "/deals",                title: "Deals" },
  { path: "/categories",           title: "Categories" },
  { path: "/stores",               title: "Stores" },
  { path: "/blog",                 title: "Smart Shopping Guides" },
  { path: "/about",                title: "About" },
  { path: "/contact",              title: "Contact" },
  { path: "/affiliate-disclosure", title: "Affiliate" },
  { path: "/privacy-policy",       title: "Privacy" },
  { path: "/terms",                title: "Terms" },
  { path: "/cookie-policy",        title: "Cookie" },
  { path: "/editorial-policy",     title: "Editorial" },
]

test("empty catalog offers guides, checkout comparison, and partner store paths", async ({ page }) => {
  test.skip(activeDeals.length > 0, "Requires an empty verified catalog")
  test.slow()
  for (const route of ["/", "/deals"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" })
    const notice = page.getByRole("region", { name: "Verified listings are being refreshed" })
    await expect(notice).toBeVisible()
    for (const href of ["/blog", "/tools/checkout-comparison", "/stores/temu", "/stores/shopee-ph", "/stores/sephora-ph"]) {
      const link = notice.locator(`a[href="${href}"]`)
      await expect(link).toBeVisible()
      await link.click()
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      await page.goto(route, { waitUntil: "domcontentloaded" })
    }
    await expect(page.getByRole("main")).not.toContainText("0+ curated deal notes")
    await expect(page.getByRole("link", { name: "Clear all filters", exact: true })).toHaveCount(0)
  }
  await page.goto("/deals?q=tripod")
  await expect(page.getByText("No deals match your current filters.")).toBeVisible()
  await expect(page.getByRole("link", { name: "Clear all filters", exact: true })).toHaveAttribute("href", "/deals")
  for (const route of ["/categories/home-finds", "/stores/temu"]) {
    await page.goto(route)
    const notice = page.getByRole("region", { name: /listings are being refreshed/i })
    await expect(notice).toBeVisible()
    await expect(notice.locator('a[href^="/blog/"]').first()).toBeVisible()
    await expect(notice.locator('a[href="/tools/checkout-comparison"]')).toBeVisible()
    await expect(notice.locator('a[href="/deals"]')).toHaveCount(0)
  }
})

test("sales calendar exposes indexable metadata, buyer guidance, image, and structured data", async ({ page }) => {
  test.slow()
  const response = await page.goto("/sales-calendar", { waitUntil: "domcontentloaded" })
  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle("Philippines Online Shopping Sale Calendar 2026")

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://sulitscan.com/sales-calendar"
  )
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Philippines Online Shopping Sale Calendar 2026"
  )
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Philippines Online Shopping Sale Calendar 2026"
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://sulitscan.com/images/guides/shopping-sale-calendar-philippines.webp"
  )
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    "Philippines Online Shopping Sale Calendar 2026"
  )
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    "https://sulitscan.com/images/guides/shopping-sale-calendar-philippines.webp"
  )

  const heroImage = page.getByAltText("Calendar planning for common Philippine online shopping sale dates")
  await expect(heroImage).toHaveAttribute("src", /^\/_next\/image\?url=/)
  await expect.poll(() => heroImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)

  await expect(page.getByText(/sale dates, vouchers, stock, prices, eligibility, and merchant participation can change/i)).toBeVisible()
  await expect(page.locator('ol[aria-label="Common double-day dates"] > li > span:first-child')).toHaveText([
    "1.1", "2.2", "3.3", "4.4", "5.5", "6.6", "7.7", "8.8", "9.9", "10.10", "11.11", "12.12",
  ])
  for (const href of ["/deals", "/stores", "/blog", "/tools/checkout-comparison"]) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible()
  }

  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? "{}"))
  )
  const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList")
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage")
  expect(breadcrumb?.itemListElement).toEqual([
    expect.objectContaining({ position: 1, name: "Home", item: "https://sulitscan.com" }),
    expect.objectContaining({ position: 2, item: "https://sulitscan.com/sales-calendar" }),
  ])
  expect(faq?.mainEntity).toHaveLength(4)
  const visibleFaqs = page.locator("details")
  await expect(visibleFaqs).toHaveCount(4)
  for (const [index, item] of (faq?.mainEntity ?? []).entries()) {
    const visibleFaq = visibleFaqs.nth(index)
    await expect(visibleFaq.locator("summary")).toHaveText(item.name)
    await visibleFaq.locator("summary").click()
    await expect(visibleFaq.locator("p")).toHaveText(item.acceptedAnswer.text)
    await expect(visibleFaq.locator("p")).toBeVisible()
  }
})

test("sales calendar partner CTAs use approved affiliate destinations and privacy-safe events", async ({ page }) => {
  await page.goto("/sales-calendar", { waitUntil: "domcontentloaded" })
  await installAnalyticsCapture(page)
  await page.waitForTimeout(1500)

  const partners = [
    { name: "Temu", href: "https://temu.to/k/ge7hcjmmrb4", offerId: "temu" },
    { name: "Shopee PH", href: "https://invl.me/clnkccq", offerId: "shopee-ph" },
    { name: "Sephora PH", href: "https://invl.me/clnkccv", offerId: "sephora-ph" },
  ]

  for (const [index, partner] of partners.entries()) {
    const link = page.locator(`a[href="${partner.href}"]`)
    await expect(link).toHaveAttribute("href", partner.href)
    await expect(link).toHaveAccessibleName(`Check ${partner.name} current terms (affiliate link, new tab)`)
    await expect(link).toHaveAttribute("rel", "sponsored nofollow noopener noreferrer")
    await link.evaluate((element) => element.addEventListener("click", (event) => event.preventDefault()))
    await link.click()
    await expect.poll(() => page.evaluate(() =>
      (window as typeof window & {
        __events: Array<{ type: string; payload: { name?: string } }>
      }).__events.filter((event) => event.type === "event" && event.payload.name === "affiliate_click").length
    )).toBe(index + 1)
  }

  const affiliateEvents = await page.evaluate(() =>
    (window as typeof window & {
      __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
    }).__events.filter((event) => event.type === "event" && event.payload.name === "affiliate_click")
  )
  expect(affiliateEvents).toHaveLength(3)
  for (const event of affiliateEvents) {
    expect(event.payload.data).toMatchObject({ placement: "sales-calendar-store", source: "sales-calendar" })
    expect(Object.keys(event.payload.data ?? {}).sort()).toEqual(["offerId", "placement", "platform", "source"])
  }
  expect(affiliateEvents.map((event) => event.payload.data?.offerId).sort()).toEqual(["sephora-ph", "shopee-ph", "temu"])
})

test("sales calendar is discoverable from navigation, homepage, and sitemap", async ({ page, request }) => {
  await page.goto("/")
  await expect(page.getByRole("banner").getByRole("link", { name: "Sale Calendar" })).toBeVisible()
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Sale Calendar" })).toBeVisible()
  await expect(page.getByRole("main").getByRole("link", { name: /plan around common sale dates/i })).toHaveAttribute("href", "/sales-calendar")

  const sitemapResponse = await request.get("/sitemap.xml")
  const sitemap = await sitemapResponse.text()
  expect(sitemap).toContain("<loc>https://sulitscan.com/sales-calendar</loc>")
  expect(sitemap).toContain("<lastmod>2026-07-31</lastmod>")
  expect(sitemap).toContain("<changefreq>weekly</changefreq>")
  expect(sitemap).toContain("<priority>0.8</priority>")
  expect(sitemap).toContain("<image:loc>https://sulitscan.com/images/guides/shopping-sale-calendar-philippines.webp</image:loc>")
})

test("homepage describes reference listings and buyer checks without live-price claims", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const main = page.getByRole("main")
  await expect(main).toContainText(/affiliate-datafeed listings/i)
  await expect(main).toContainText(/Reference Listings/i)
  await expect(main).toContainText(/Confirm live store price/i)
  await expect(main).toContainText("After Source Date/Period")
  await expect(main).toContainText("Then retired automatically")
  await expect(main).toContainText(/vouchers, sizing, seller evidence, shipping, returns, and quality/i)
  await expect(main).not.toContainText("We monitor")
  await expect(main).not.toContainText("shipping estimates")
  await expect(main).not.toContainText("30–75%")
  await expect(main).not.toContainText("Discounts shown")
  await expect(main).not.toContainText("Maximum Reference Age")
})

test("homepage empty scanner offers a price-free checklist and guide destinations", async ({ page }) => {
  test.skip(scannerSlides.length > 0, "Requires no eligible scanner slides")
  await page.goto("/", { waitUntil: "domcontentloaded" })
  const preview = page.getByRole("region", { name: "Buyer checklist" })
  await expect(preview).toContainText("Before you buy")
  await expect(preview).not.toContainText(/₱|%|Saved|OFF/)
  await expect(preview.getByRole("button")).toHaveCount(0)
  await expect(preview.getByRole("link", { name: "Read buyer guides →" })).toHaveAttribute("href", "/blog")
  await expect(preview.getByRole("link", { name: "Compare checkout totals →" })).toHaveAttribute("href", "/tools/checkout-comparison")
})

test("homepage empty scanner keeps its focused guide link stable", async ({ page }) => {
  test.skip(scannerSlides.length > 0, "Requires no eligible scanner slides")
  await page.goto("/", { waitUntil: "domcontentloaded" })
  const preview = page.getByRole("region", { name: "Buyer checklist" })
  const guide = preview.getByRole("link", { name: "Read buyer guides →" })
  await guide.focus()
  await page.waitForTimeout(4500)
  await expect(guide).toBeFocused()
  await expect(guide).toHaveAttribute("href", "/blog")
})

test("homepage empty scanner remains motion-free and bounded on mobile", async ({ page }) => {
  test.skip(scannerSlides.length > 0, "Requires no eligible scanner slides")
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/", { waitUntil: "domcontentloaded" })
  const preview = page.getByRole("region", { name: "Buyer checklist" })
  await expect(preview).toHaveAttribute("data-decorative-motion", "off")
  await expect.poll(() => preview.locator("[data-scanner-card]").evaluate(
    (card) => card.scrollWidth <= card.clientWidth
  )).toBe(true)
  await expect.poll(() => page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth
  )).toBe(true)
})

for (const [label, now] of [
  ["current clock", inventoryNow],
  ["10.10 window", new Date("2026-10-03T00:00:00.000Z")],
  ["11.11 window", new Date("2026-11-01T00:00:00.000Z")],
  ["between campaigns", new Date("2026-10-15T00:00:00.000Z")],
] as const) {
  test(`header guide announcement links to the blog at ${label}`, async ({ page }) => {
    const promotion = getSeasonalPromotion(now)
    // Fix browser Date only; animation frames still run normally after mount.
    await page.clock.setFixedTime(now)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    // A real stateful interaction establishes hydration before checking the
    // mounted announcement, rather than accepting the generic prerender.
    await page.getByRole("button", { name: "Open menu" }).click()
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible()

    await expect(page.getByRole("banner").getByRole("link", {
      name: promotion?.announcement ?? "Browse what's fresh →", exact: true,
    })).toHaveAttribute("href", promotion?.href ?? "/blog")
  })
}

test("homepage trust signals promise no automatic redirects", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const hero = page.getByRole("region", { name: /Check deals before you click buy/i })
  await expect(hero).toContainText("No checkout. No automatic redirects.")
  await expect(
    page.locator('main section[aria-label="Trust signals"]')
  ).toContainText("No automatic redirects")
})

test("homepage hero reports the server-computed active listing count", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const hero = page.getByRole("region", { name: /Check deals before you click buy/i })
  const activeListingStat = hero.getByText("Active Listings", { exact: true }).locator("..")
  await expect(activeListingStat.getByText(String(activeDeals.length), { exact: true })).toBeVisible()
  await expect(hero.getByText("Active Listings", { exact: true })).toBeVisible()
  await expect(hero).not.toContainText("100+")
})

test.describe("sales calendar mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("opens the menu and navigates to the sale calendar", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.getByRole("button", { name: "Open menu" }).click()

    const saleCalendarLink = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Sale Calendar" })
    await expect(saleCalendarLink).toBeVisible()
    await expect(saleCalendarLink).toHaveAttribute("href", "/sales-calendar")
    await saleCalendarLink.click()
    await expect(page).toHaveURL(/\/sales-calendar$/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Philippines Online Shopping Sale Calendar 2026")
  })
})

test("newsletter signup requires consent before it sends a request", async ({ page }) => {
  let newsletterRequests = 0
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/newsletter") newsletterRequests += 1
  })

  await page.goto("/")
  const signup = page.getByRole("form", { name: "Newsletter signup" })
  await signup.getByLabel("Email address").fill("member@example.com")
  await signup.getByRole("button", { name: "Join Free Deal Alerts" }).click()

  await expect(signup.getByRole("alert")).toContainText("Please check the consent box to continue.")
  expect(newsletterRequests).toBe(0)
})

test("newsletter signup tracks one request completion after an API-confirmed success", async ({ page }) => {
  await page.route("**/api/newsletter", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    })
  )
  await page.goto("/")
  await installAnalyticsCapture(page)

  const signup = page.getByRole("form", { name: "Newsletter signup" })
  await signup.getByLabel("Email address").fill("member@example.com")
  await signup.getByLabel(/I agree to receive SulitScan deal alerts/i).check()
  await signup.getByRole("button", { name: "Join Free Deal Alerts" }).click()

  await expect(page.getByText("Request received", { exact: true })).toBeVisible()
  await expect(page.getByText("Thanks for your interest in SulitScan deal alerts.", { exact: true })).toBeVisible()
  const events = await newsletterEvents(page)
  expect(events).toHaveLength(1)
  expect(events[0]?.payload.name).toBe("newsletter_signup_request_completed")
  expect(events[0]?.payload.data).toEqual({ source: "homepage" })
})

test("newsletter signup shows an API error without tracking a completion", async ({ page }) => {
  await page.route("**/api/newsletter", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Service unavailable. Please try again." }),
    })
  )
  await page.goto("/")
  await installAnalyticsCapture(page)

  const signup = page.getByRole("form", { name: "Newsletter signup" })
  await signup.getByLabel("Email address").fill("member@example.com")
  await signup.getByLabel(/I agree to receive SulitScan deal alerts/i).check()
  await signup.getByRole("button", { name: "Join Free Deal Alerts" }).click()

  await expect(signup.getByRole("alert")).toContainText("Service unavailable. Please try again.")
  expect(await newsletterEvents(page)).toHaveLength(0)
})

test("checkout comparison identifies the cheaper final total without tracking entered values", async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/tools/checkout-comparison")

  const offerA = page.getByRole("group", { name: "Offer A" })
  for (const label of [
    "Item price",
    "Shipping",
    "Voucher discount",
    "Payment discount",
    "Other fees",
    "Import cost estimate",
  ]) {
    await expect(offerA.getByLabel(label)).toHaveAccessibleDescription(/Philippine pesos \(PHP\)/i)
  }
  await expect(offerA.getByLabel("Quantity")).toHaveAccessibleDescription("")
  await offerA.getByLabel("Item price").fill("250")
  await offerA.getByLabel("Quantity").fill("2")
  await offerA.getByLabel("Shipping").fill("50")
  await offerA.getByLabel("Voucher discount").fill("75")
  await offerA.getByLabel("Payment discount").fill("25")
  await offerA.getByLabel("Other fees").fill("10")
  await offerA.getByLabel("Import cost estimate").fill("40")

  const offerB = page.getByRole("group", { name: "Offer B" })
  await offerB.getByLabel("Item price").fill("260")
  await offerB.getByLabel("Quantity").fill("2")
  await offerB.getByLabel("Shipping").fill("40")
  await offerB.getByLabel("Voucher discount").fill("10")
  await offerB.getByLabel("Payment discount").fill("0")
  await offerB.getByLabel("Other fees").fill("5")
  await offerB.getByLabel("Import cost estimate").fill("0")

  await installAnalyticsCapture(page)
  await page.getByRole("button", { name: "Compare final totals" }).click()

  const result = page.getByRole("status")
  await expect(result).toContainText("Offer A costs ₱55.00 less")
  await expect(result).toContainText("₱250.00 per unit")
  await expect(result).toContainText("₱277.50 per unit")

  const events = await page.evaluate(() =>
    (window as typeof window & {
      __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
    }).__events
  )
  const event = events.find((candidate) =>
    candidate.type === "event" && candidate.payload.name === "checkout_comparison_completed"
  )
  expect(event?.payload.data).toEqual({ source: "checkout-comparison-tool" })
})

test("checkout comparison exposes canonical, social, and structured metadata without nested main landmarks", async ({
  page,
}) => {
  await page.goto("/tools/checkout-comparison")

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://sulitscan.com/tools/checkout-comparison"
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://sulitscan.com/tools/checkout-comparison"
  )
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /Checkout Price Comparison Tool Philippines/
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image"
  )
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    /Checkout Price Comparison Tool Philippines/
  )
  await expect(page.locator("main")).toHaveCount(1)

  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? "{}"))
  )
  const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList")
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage")
  expect(breadcrumb?.itemListElement).toEqual([
    expect.objectContaining({ position: 1, name: "Home", item: "https://sulitscan.com" }),
    expect.objectContaining({
      position: 2,
      name: "Checkout comparison tool",
      item: "https://sulitscan.com/tools/checkout-comparison",
    }),
  ])
  expect(faq?.mainEntity).toHaveLength(4)
})

test("checkout comparison ImportTaxPH link uses tracked privacy-safe attribution", async ({
  page,
}) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/tools/checkout-comparison")
  await page.getByRole("group", { name: "Offer A" }).getByLabel("Item price").fill("918273.45")

  const link = page.getByRole("link", { name: "ImportTaxPH", exact: true })
  const href = await link.getAttribute("href")
  expect(href).not.toBeNull()
  const url = new URL(href as string)
  expect(url.origin).toBe("https://www.importtaxph.com")
  expect(url.searchParams.get("utm_source")).toBe("sulitscan")
  expect(url.searchParams.get("utm_medium")).toBe("referral")
  expect(url.searchParams.get("utm_campaign")).toBe("cross_site")
  expect(url.searchParams.get("utm_content")).toBe(
    "checkout-comparison-tool:checkout-comparison"
  )

  await link.evaluate((element) =>
    element.addEventListener("click", (event) => event.preventDefault())
  )
  await installAnalyticsCapture(page)
  await link.click()
  const events = await page.evaluate(() =>
    (window as typeof window & {
      __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
    }).__events
  )
  const event = events.find((candidate) =>
    candidate.type === "event" && candidate.payload.name === "sister_site_click"
  )
  expect(event?.payload.data).toEqual({
    destination: "importtaxph",
    placement: "checkout-comparison",
    source: "checkout-comparison-tool",
  })
  expect(JSON.stringify(event)).not.toContain("918273.45")
})

test("checkout comparison is discoverable from site navigation and the homepage", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("banner").getByRole("link", { name: "Compare Prices" })).toBeVisible()
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Checkout Comparison" })).toBeVisible()
  const comparisonLinks = page.getByRole("main").getByRole("link", { name: /Compare checkout totals/i })
  await expect(comparisonLinks.first()).toBeVisible()
  for (const link of await comparisonLinks.all()) {
    await expect(link).toHaveAttribute("href", "/tools/checkout-comparison")
  }
})

test("checkout comparison is included in the sitemap and relevant guides", async ({ page, request }) => {
  const sitemapResponse = await request.get("/sitemap.xml")
  expect(await sitemapResponse.text()).toContain(
    "<loc>https://sulitscan.com/tools/checkout-comparison</loc>"
  )

  for (const slug of [
    "why-final-prices-change-at-checkout",
    "philippine-import-tax-guide-online-shoppers",
  ]) {
    await page.goto(`/blog/${slug}`)
    await expect(
      page.getByRole("link", { name: /compare (two )?checkout totals/i })
    ).toHaveAttribute("href", "/tools/checkout-comparison")
  }
})

for (const route of routes) {
  test(`${route.path} loads with 200 and contains title`, async ({ page }) => {
    const response = await page.goto(route.path)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(new RegExp(route.title, "i"))
  })
}

test("404 page shows not-found content", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist-xyz")
  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible()
})

for (const slug of ["summer-dress-shein", "xiaomi-smart-band-9-shopee"]) {
  test(`inactive deal ${slug} returns 404 and is noindex`, async ({ page }) => {
    const response = await page.goto(`/deals/${slug}`)
    expect(response?.status()).toBe(404)
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1)
  })
}

test("store affiliate links retain complete sponsored and security attributes", async ({ page }) => {
  await page.goto("/stores/temu")
  const affiliateLinks = page.locator('a[rel*="sponsored"]')
  expect(await affiliateLinks.count()).toBeGreaterThan(0)
  for (const link of await affiliateLinks.all()) {
    await expect(link).toHaveAttribute("rel", "sponsored nofollow noopener noreferrer")
    await expect(link).toHaveAttribute("target", "_blank")
  }
})

test("empty catalog does not render stale product cards or product affiliate links", async ({ page }) => {
  test.skip(activeDeals.length > 0, "Requires an empty verified catalog")
  for (const route of ["/deals", "/categories/under-1000", "/stores/temu"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" })
    await expect(page.locator("main article")).toHaveCount(0)
    await expect(page.getByRole("region", { name: /listings are being refreshed/i })).toBeVisible()
  }
  await page.goto("/deals")
  await expect(page.locator('main a[rel*="sponsored"]')).toHaveCount(0)
})

test("empty scanner checklist is server discoverable without a stale product image", async ({ page, request }) => {
  test.skip(scannerSlides.length > 0, "Requires no eligible scanner slides")
  const response = await request.get("/")
  expect(response.status()).toBe(200)
  const html = await response.text()
  const scannerRegion = html.match(/<section[^>]*aria-label="Buyer checklist"[^>]*>[\s\S]*?<\/section>/)?.[0]
  expect(scannerRegion).toContain("Before you buy")
  expect(scannerRegion).toContain('href="/blog"')
  expect(scannerRegion).not.toContain("<img")
  await page.goto("/")
  await expect(page.getByRole("region", { name: "Buyer checklist" })).toBeVisible()
})

test("store affiliate click reports public context without private data", async ({ page }) => {
  await page.goto("/stores/temu")
  await installAnalyticsCapture(page)
  const link = page.locator('a[rel*="sponsored"]').first()
  await link.evaluate((element) => element.addEventListener("click", (event) => event.preventDefault()))
  await link.click()
  const events = await page.evaluate(() => (window as typeof window & {
    __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
  }).__events)
  const event = events.find((candidate) => candidate.type === "event" && candidate.payload.name === "affiliate_click")
  expect(event).toBeDefined()
  expect(event?.payload.data?.platform).toBe("Temu")
  for (const privateProperty of ["href", "url", "query", "title", "email"]) {
    expect(event?.payload.data).not.toHaveProperty(privateProperty)
  }
})

test("expired deal detail remains reachable but excludes old prices and indexing", async ({ page }) => {
  const fixture = getDealBySlug("tanle-silicone-foldable-water-bottle-is-leak-proof-a-702052")
  test.skip(!fixture || getDealFreshness(fixture.lastChecked, inventoryNow).status !== "expired", "Requires the public water-bottle fixture to be expired")
  const response = await page.goto("/deals/tanle-silicone-foldable-water-bottle-is-leak-proof-a-702052")
  expect(response?.status()).toBe(200)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  await expect(page.getByRole("region", { name: "Price information" })).not.toContainText(/₱|%|Saved/)
})

test("expired Temu product no longer exposes old prices or structured offers", async ({ page }) => {
  const fixture = getDealBySlug("jockmail-padded-boxer-briefs-temu")
  test.skip(!fixture || getDealFreshness(fixture.lastChecked, inventoryNow).status !== "expired", "Requires an expired public Temu fixture")
  const search = resolveDealListing(activeDeals, { q: "jockmail" })
  await page.goto("/deals?q=jockmail", { waitUntil: "domcontentloaded" })
  await expect(page.locator("main article")).toHaveCount(search.items.length)
  await expect(page.locator("main article").filter({ has: page.getByRole("heading", { name: fixture!.title, exact: true }) })).toHaveCount(0)
  if (search.total === 0) await expect(page.getByText("No deals match your current filters.")).toBeVisible()
  const response = await page.goto("/deals/jockmail-padded-boxer-briefs-temu", { waitUntil: "domcontentloaded" })
  expect(response?.status()).toBe(200)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  await expect(page.getByRole("region", { name: "Price information" })).not.toContainText(/₱|\d+%|Saved/)
  const products = (await page.locator('script[type="application/ld+json"]').allTextContents())
    .map((value) => JSON.parse(value)).filter((value) => value["@type"] === "Product")
  for (const product of products) expect(product).not.toHaveProperty("offers")
})

test("homepage partner banner emits an affiliate_click event with its public offer ID", async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/")
  await installAnalyticsCapture(page)
  const popupPromise = page.waitForEvent("popup")
  await page.getByRole("link", { name: /sponsored partner/i }).first().click()
  const popup = await popupPromise
  await popup.close()
  const events = await page.evaluate(() =>
    (window as typeof window & {
      __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
    }).__events
  )
  const event = events.find((candidate) =>
    candidate.type === "event" && candidate.payload.name === "affiliate_click"
  )
  expect(event?.payload.data).toEqual({
    offerId: "partner-shopee",
    platform: "Shopee",
    placement: "partner-banner",
    source: "home",
  })
  for (const privateProperty of ["href", "url", "query", "title", "email"]) {
    expect(event?.payload.data).not.toHaveProperty(privateProperty)
  }
})

test("store-index affiliate link emits a private affiliate_click event", async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/stores")
  await installAnalyticsCapture(page)
  const popupPromise = page.waitForEvent("popup")
  await page.getByRole("link", { name: /Visit Temu \(affiliate link/i }).click()
  const popup = await popupPromise
  await popup.close()
  const events = await page.evaluate(() =>
    (window as typeof window & {
      __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
    }).__events
  )
  const event = events.find((candidate) =>
    candidate.type === "event" && candidate.payload.name === "affiliate_click"
  )
  expect(event?.payload.data).toEqual({
    platform: "Temu",
    placement: "store-index",
    source: "stores",
  })
})

test("Temu guide links to the tracked Temu ImportTaxPH calculator", async ({ page }) => {
  await page.goto("/blog/temu-shopping-guide-philippines")
  const link = page.getByRole("link", { name: /ImportTaxPH/i }).first()
  const href = await link.getAttribute("href")
  expect(href).not.toBeNull()
  const url = new URL(href as string)
  expect(url.pathname).toBe("/temu-import-tax")
  expect(url.searchParams.get("utm_source")).toBe("sulitscan")
  expect(url.searchParams.get("utm_medium")).toBe("referral")
  expect(url.searchParams.get("utm_campaign")).toBe("cross_site")
  expect(url.searchParams.get("utm_content")).toBe(
    "temu-shopping-guide-philippines:inline-article"
  )
})

test("generic shipping guide links its ImportTaxPH callout to the homepage", async ({ page }) => {
  await page.goto("/blog/voucher-shipping-return-checklist")
  const callout = page.getByText("Ordering from overseas?", { exact: true }).locator("..")
  const href = await callout.getByRole("link", { name: "ImportTaxPH" }).getAttribute("href")
  expect(href).not.toBeNull()
  expect(new URL(href as string).pathname).toBe("/")
})

test("gift and beauty guides omit the ImportTaxPH callout", async ({ page }) => {
  for (const slug of [
    "best-gifts-under-500-philippines",
    "best-beauty-finds-under-500-philippines",
  ]) {
    await page.goto(`/blog/${slug}`)
    await expect(page.getByText("Ordering from overseas?", { exact: true })).toHaveCount(0)
  }
})

test("tracked Temu ImportTaxPH link emits a sister_site_click event", async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/blog/temu-shopping-guide-philippines")
  const popupPromise = page.waitForEvent("popup")
  await page.getByRole("link", { name: /ImportTaxPH/i }).first().click()
  const popup = await popupPromise
  await popup.close()
  const events = await page.evaluate(() =>
    (window as typeof window & {
      __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
    }).__events
  )
  const event = events.find((candidate) =>
    candidate.type === "event" && candidate.payload.name === "sister_site_click"
  )
  expect(event).toBeDefined()
  expect(Object.keys(event?.payload.data ?? {}).sort()).toEqual(["destination", "placement", "source"])
  expect(event?.payload.data).toEqual({
    destination: "importtaxph",
    placement: "inline-article",
    source: "temu-shopping-guide-philippines",
  })
})

test("work-from-home guide links naturally to ApplyReadyCV and tracks the destination", async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/blog/best-work-from-home-desk-accessories-under-1000-philippines")
  const link = page.getByRole("link", { name: /ApplyReadyCV/i })
  const href = new URL((await link.getAttribute("href")) as string)
  expect(href.hostname).toBe("applyreadycv.com")
  expect(href.searchParams.get("utm_source")).toBe("sulitscan")
  const popupPromise = page.waitForEvent("popup")
  await link.click()
  const popup = await popupPromise
  await popup.close()
  const events = await page.evaluate(() =>
    (window as typeof window & { __events: Array<{ payload: { name?: string; data?: Record<string, unknown> } }> }).__events
  )
  expect(events.find((event) => event.payload.name === "sister_site_click")?.payload.data).toMatchObject({
    destination: "applyreadycv",
    source: "best-work-from-home-desk-accessories-under-1000-philippines",
  })
})

test("analytics failure does not block affiliate navigation", async ({ page }) => {
  await page.addInitScript(() => {
    window.va = (type) => {
      if (type === "event") throw new Error("analytics unavailable")
    }
  })
  await page.goto("/stores/temu")
  const popupPromise = page.waitForEvent("popup")
  await page.locator('a[rel*="sponsored"]').first().click()
  const popup = await popupPromise
  await popup.close()
})

test("analytics failure does not block sister-site navigation", async ({ page }) => {
  await page.addInitScript(() => {
    window.va = (type) => {
      if (type === "event") throw new Error("analytics unavailable")
    }
  })
  await page.goto("/blog/temu-shopping-guide-philippines")
  const popupPromise = page.waitForEvent("popup")
  await page.getByRole("link", { name: /ImportTaxPH/i }).first().click()
  const popup = await popupPromise
  await popup.close()
})

test("skip-to-content link is present", async ({ page }) => {
  await page.goto("/")
  const skipLink = page.locator('a[href="#main-content"]')
  await expect(skipLink).toBeAttached()
})

test("retired Shopee seller guide permanently redirects to the canonical guide", async ({ request }) => {
  const response = await request.get("/blog/how-to-check-if-shopee-seller-is-legit", {
    maxRedirects: 0,
  })
  expect(response.status()).toBe(308)
  expect(response.headers().location).toBe(
    "/blog/how-to-check-shopee-seller-legit-philippines"
  )
})

test("sitemap contains reviewed canonical guides and excludes the retired guide", async ({ request }) => {
  const response = await request.get("/sitemap.xml")
  expect(response.status()).toBe(200)
  const xml = await response.text()
  expect(xml).toContain("/blog/best-home-organization-finds-under-500-philippines")
  expect(xml).toMatch(
    /<loc>https:\/\/sulitscan\.com\/blog\/how-to-check-shopee-seller-legit-philippines<\/loc>\s*<lastmod>2026-07-12/
  )
  expect(xml).not.toContain("/blog/how-to-check-if-shopee-seller-is-legit")
  for (const path of ["/categories/under-1000", "/stores/temu"]) {
    expect(xml.includes(`<loc>https://sulitscan.com${path}</loc>`)).toBe(entityDeals(path).length > 0)
  }
  expect(xml).not.toContain("?page=1")
})

test("blog index lists guides newest first", async ({ page }) => {
  await page.goto("/blog")
  const dates = await page.locator('main a[href^="/blog/"] time').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("datetime") ?? "")
  )
  expect(dates.length).toBeGreaterThan(3)
  expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)))
})

test("Shopee seller guide renders the exact ordered related guides", async ({ page }) => {
  await page.goto("/blog/how-to-check-shopee-seller-legit-philippines", { waitUntil: "domcontentloaded" })
  const related = page.getByRole("region", { name: "More shopping guides" })
  const relatedLinks = related.getByRole("link")
  const expectedHrefs = [
    "/blog/fake-cod-parcel-scam-philippines",
    "/blog/dti-trustmark-bir-registration-seal-online-sellers",
    "/blog/fake-qr-code-payment-scams-philippines",
  ]

  await expect(relatedLinks).toHaveCount(expectedHrefs.length)
  for (const [index, href] of expectedHrefs.entries()) {
    await expect(relatedLinks.nth(index)).toBeVisible()
    await expect(relatedLinks.nth(index)).toHaveAttribute("href", href)
  }
})

test("empty deals pagination normalizes to the first page and is noindex", async ({ page }) => {
  test.skip(activeDeals.length > 0, "Requires an empty verified catalog")
  await page.goto("/deals?page=2")
  await expect(page.getByText("Page 1 of 1", { exact: true })).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Deals pagination" })).toHaveCount(0)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://sulitscan.com/deals")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  await expect(page.locator("main article")).toHaveCount(0)
})

test("out-of-range deal pages retain their normalized canonical but are noindex", async ({ page }) => {
  const pageCount = await getAllDealsPageCount(page)
  const outOfRangePage = pageCount + 1
  await page.goto(`/deals?page=${outOfRangePage}`, { waitUntil: "domcontentloaded" })

  await expect(page.locator("p").filter({ hasText: /^Page \d+ of \d+$/ })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).not.toHaveAttribute(
    "href",
    `https://sulitscan.com/deals?page=${outOfRangePage}`
  )
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
})

test("sitemap contains each canonical unfiltered all-deals page", async ({ page, request }) => {
  const pageCount = await getAllDealsPageCount(page)
  const outOfRangePage = pageCount + 1
  await page.goto(`/deals?page=${outOfRangePage}`, { waitUntil: "domcontentloaded" })

  const xml = await (await request.get("/sitemap.xml")).text()
  const pages = [...xml.matchAll(/<loc>https:\/\/sulitscan\.com\/deals\?page=(\d+)<\/loc>/g)]
    .map((match) => Number(match[1]))
    .sort((a, b) => a - b)

  expect(pages).toEqual(Array.from({ length: pageCount - 1 }, (_, index) => index + 2))
  expect(xml).not.toContain(`/deals?page=${outOfRangePage}`)
})

test("filtered deals are noindex and preserve URL state", async ({ page }) => {
  await page.goto("/deals?q=brush&store=Sephora+PH")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  await expect(page.locator('input[name="q"]')).toHaveValue("brush")
  await expect(page.locator('select[name="store"]')).toHaveValue(
    resolveDealListing(activeDeals, { q: "brush", store: "Sephora PH" }).store
  )
})

test("filtered and noncanonical later deal URLs keep the page-one description", async ({ page }) => {
  const pageOneDescription = "Browse curated online deals from Temu, Shopee PH, and Sephora PH with buyer notes on every listing."

  for (const path of ["/deals?store=Temu&page=2", "/deals?page=02"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" })
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      pageOneDescription
    )
  }
})

test("invalid deal filters normalize visibly but remain noindex", async ({ page }) => {
  await page.goto("/deals?store=garbage&category=garbage&sort=garbage")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  await expect(page.locator('select[name="store"]')).toHaveValue("All")
  await expect(page.locator('select[name="category"]')).toHaveValue("All")
  await expect(page.locator('select[name="sort"]')).toHaveValue("recommended")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://sulitscan.com/deals")
})

test.describe("empty entity pagination", () => {
  for (const entityPath of ["/categories/under-1000", "/stores/temu"]) {
    for (const query of ["", "?page=2", "?page=garbage", "?page=2&page=3"]) {
      test(`${entityPath}${query} exposes a canonical refresh path without placeholder pagination`, async ({ page }) => {
        test.skip(entityDeals(entityPath).length > 0, "Requires this entity's verified inventory to be empty")
        const response = await page.goto(`${entityPath}${query}`, { waitUntil: "domcontentloaded" })
        expect(response?.status()).toBe(200)
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://sulitscan.com${entityPath}`)
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
        await expect(page.locator("main article")).toHaveCount(0)
        await expect(page.getByRole("navigation", { name: "Deals pagination" })).toHaveCount(0)
        await expect(page.getByRole("region", { name: /listings are being refreshed/i })).toBeVisible()
      })
    }
  }
})

test("article uses article-specific Twitter metadata and dateModified", async ({ page }) => {
  await page.goto("/blog/best-shopee-finds-under-500-philippines")
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", /Shopee/i)
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /best-shopee-finds-under-500-philippines/i)
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
  const article = jsonLd.map((value) => JSON.parse(value)).find((value) => value["@type"] === "BlogPosting")
  expect(article.dateModified).toBe("2026-06-27")
  expect(article.author.url).toContain("/editorial-policy")
})

test("unfinished digital tools category is noindex", async ({ page }) => {
  await page.goto("/categories/digital-tools")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
})

const growthPosts = [
  {
    slug: "best-home-organization-finds-under-500-philippines",
    faqQuestion: "What home organizers under 500 pesos are worth checking?",
  },
  {
    slug: "best-gifts-under-500-philippines",
    faqQuestion: "What practical gifts under 500 pesos are worth checking?",
  },
  {
    slug: "best-work-from-home-desk-accessories-under-1000-philippines",
    faqQuestion: "What desk accessories under 1,000 pesos are worth checking?",
  },
  {
    slug: "best-beauty-finds-under-500-philippines",
    faqQuestion: "What beauty finds under 500 pesos are lower-risk?",
  },
]

for (const { slug, faqQuestion } of growthPosts) {
  test(`${slug} renders a unique cover, FAQs, disclosure, and eligible recommendations`, async ({ page }) => {
    await page.goto(`/blog/${slug}`)
    await expect(page.locator(`img[src*="${slug}"]`).first()).toBeVisible()
    await expect(page.getByRole("heading", { name: "Frequently asked questions", exact: true })).toBeVisible()
    await expect(page.locator("summary").filter({ hasText: faqQuestion })).toBeVisible()
    await expectRelatedDealRendering(page, slug)
    await expect(page.locator("main").getByText("Affiliate Disclosure:", { exact: false })).toBeVisible()
  })
}

const evidenceLedGuides = [
  "back-to-school-essentials-under-500-philippines",
  "cookware-sets-philippines-buying-guide",
  "bags-under-500-philippines-buying-guide",
  "carry-on-luggage-philippines-buying-guide",
  "makeup-brush-sets-philippines-beginner-guide",
]

const weeklyGrowthGuides = [
  "online-shoe-size-guide-philippines",
  "unboxing-video-evidence-online-shopping-philippines",
  "travel-packing-organizers-philippines-buying-guide",
  "first-apartment-essentials-under-1000-philippines",
  "power-bank-buying-guide-philippines",
]

const adsenseReadinessGuides = [
  "online-product-review-checklist-philippines",
  "refurbished-vs-used-vs-open-box-philippines",
  "online-furniture-measurement-guide-philippines",
  "online-purchase-warranty-guide-philippines",
  "energy-efficient-appliance-buying-guide-philippines",
]

const augustBuyerGuides = [
  {
    slug: "how-to-stack-shopee-vouchers-philippines",
    coverAlt: "Philippine shopper comparing a generic phone checkout with blank voucher cards, a calculator, and a receipt",
  },
  {
    slug: "shopee-return-refund-guide-philippines",
    coverAlt: "Parcel return evidence scene with a phone, sealed box, receipt, and organized photo documentation",
  },
  {
    slug: "temu-returns-refunds-price-adjustment-philippines",
    coverAlt: "Unbranded parcel with blank comparison cards, plain coins, and an unmarked calculator on a home desk",
  },
  {
    slug: "how-to-check-skincare-makeup-legit-philippines",
    coverAlt: "Shopper inspecting blank skincare and makeup packaging with a magnifying glass beside an abstract registry screen",
  },
  {
    slug: "online-electrical-appliance-safety-ps-icc-philippines",
    coverAlt: "Shopper inspecting an unplugged cord housing with a magnifying glass beside a charger, fan, and blank checklist",
  },
]

const saleSafetyGuides = [
  {
    slug: "shopee-9-9-sale-philippines-2026-checklist",
    title: "Shopee 9.9 Sale Philippines 2026: Smart Checkout Checklist",
    coverAlt: "Filipino shopper planning a sale checkout with a blank phone cart, calendar, calculator, and price checklist",
    expectedRelatedSlugs: [
      // Current campaign-window guides intentionally rank first by editorial relevance and freshness.
      "11-11-sale-philippines-cart-building-checklist",
      "10-10-sale-philippines-guide",
      "shopee-9-9-vs-11-11-vs-12-12-which-sale-cheapest",
    ],
  },
  {
    slug: "fake-qr-code-payment-scams-philippines",
    title: "Fake QR Code Payment Scams Philippines: Checks Before You Scan",
    coverAlt: "Shopper inspecting a non-scannable abstract QR pattern on a phone beside a shield and payment checklist",
    expectedRelatedSlugs: [
      // Payment-safety coverage ranks first by its two shared editorial topics.
      "safest-payment-methods-online-shopping-philippines",
      "fake-cod-parcel-scam-philippines",
      "dti-trustmark-bir-registration-seal-online-sellers",
    ],
  },
  {
    slug: "dti-trustmark-bir-registration-seal-online-sellers",
    title: "DTI Trustmark and BIR Registration Seal: Verify Online Sellers",
    coverAlt: "Magnifying glass checking abstract seller verification cards beside a laptop and official-domain checklist",
    expectedRelatedSlugs: [
      "fake-cod-parcel-scam-philippines",
      "fake-qr-code-payment-scams-philippines",
      "shopee-return-refund-guide-philippines",
    ],
  },
  {
    slug: "fake-cod-parcel-scam-philippines",
    title: "Fake COD Parcel Scam Philippines: What to Do Before Paying",
    coverAlt: "Household member comparing an unopened COD parcel with a phone order list before payment",
    expectedRelatedSlugs: [
      "dti-trustmark-bir-registration-seal-online-sellers",
      "fake-qr-code-payment-scams-philippines",
      "shopee-return-refund-guide-philippines",
    ],
  },
  {
    slug: "temu-minimum-order-philippines",
    title: "Temu Minimum Order Philippines: Checkout Without Overspending",
    coverAlt: "Shopper comparing an online cart minimum with a calculator and a short needs checklist",
    expectedRelatedSlugs: ["temu-shopping-guide-philippines"],
  },
]

test("weekly growth guides fit narrow mobile viewports", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  for (const slug of weeklyGrowthGuides) {
    await page.goto(`/blog/${slug}`)
    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    expect(layout.scrollWidth, `${slug} should not overflow horizontally`).toBe(
      layout.clientWidth
    )
  }
})

test.describe("evidence-led guide routes", () => {
  test.describe.configure({ mode: "serial" })

  for (const slug of evidenceLedGuides) {
    test(`${slug} evidence-led guide renders its banner and trust signals`, async ({ page, request }) => {
      const response = await page.goto(`/blog/${slug}`)
      expect(response?.status()).toBe(200)

      const bannerPath = `/images/guides/${slug}.jpg`
      await expect(page.locator(`img[src*="${slug}.jpg"]`).first()).toBeVisible()
      expect((await request.get(bannerPath)).status()).toBe(200)
      await expect(page.getByRole("heading", { name: "How we assessed this guide", exact: true })).toBeVisible()
      await expect(page.getByRole("heading", { name: "Frequently asked questions", exact: true })).toBeVisible()

      await expectRelatedDealRendering(page, slug)
      await expect(page.locator("main").getByText("Affiliate Disclosure:", { exact: false })).toBeVisible()
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://sulitscan.com/blog/${slug}`
      )
    })
  }
})

test("article navigation and category are visually separated", async ({ page }) => {
  await page.goto("/blog/online-product-review-checklist-philippines", {
    waitUntil: "domcontentloaded",
  })
  const backLink = page.getByRole("link", { name: "Back to Blog", exact: true })
  const category = page.getByText("Shopping Safety", { exact: true }).first()
  const backBox = await backLink.boundingBox()
  const categoryBox = await category.boundingBox()

  expect(backBox).not.toBeNull()
  expect(categoryBox).not.toBeNull()
  expect(categoryBox!.y).toBeGreaterThan(backBox!.y + backBox!.height)
})

test.describe("AdSense-readiness buyer guides", () => {
  test.describe.configure({ mode: "serial" })

  for (const slug of adsenseReadinessGuides) {
    test(`${slug} renders original media and transparent trust signals`, async ({ page, request }) => {
      test.slow()
      const response = await page.goto(`/blog/${slug}`, { waitUntil: "domcontentloaded" })
      expect(response?.status()).toBe(200)

      await expect(page.locator(`img[src*="${slug}.jpg"]`).first()).toBeVisible()
      expect((await request.get(`/images/guides/${slug}.jpg`)).status()).toBe(200)
      await expect(page.getByRole("heading", { name: "About this guide", exact: true })).toBeVisible()
      await expect(page.getByRole("link", { name: "Editorial process", exact: true })).toHaveAttribute(
        "href",
        "/editorial-policy"
      )
      await expect(page.getByRole("link", { name: "Request a correction", exact: true })).toHaveAttribute(
        "href",
        "/contact"
      )
      await expect(page.getByRole("heading", { name: "How we assessed this guide", exact: true })).toBeVisible()
      await expect(page.getByRole("heading", { name: "Frequently asked questions", exact: true })).toBeVisible()
      expect(await page.locator("summary").count()).toBeGreaterThanOrEqual(3)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://sulitscan.com/blog/${slug}`
      )
      await expect(page.locator('script[src*="pagead2.googlesyndication.com"]')).toHaveCount(0)
    })
  }

  test("new guides are in the sitemap and remain usable on mobile", async ({ page, request }) => {
    test.slow()
    const sitemap = await (await request.get("/sitemap.xml")).text()
    for (const slug of adsenseReadinessGuides) {
      expect(sitemap).toContain(`<loc>https://sulitscan.com/blog/${slug}</loc>`)
    }

    await page.setViewportSize({ width: 390, height: 844 })
    for (const slug of adsenseReadinessGuides) {
      await page.goto(`/blog/${slug}`, { waitUntil: "domcontentloaded" })
      const layout = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      expect(layout.scrollWidth, `${slug} should not overflow horizontally`).toBe(layout.clientWidth)
    }
  })
})

test.describe("August buyer guide routes", () => {
  test.describe.configure({ mode: "serial" })

  for (const { slug, coverAlt } of augustBuyerGuides) {
    test(`August buyer guide ${slug} protects media, trust, schema, discovery, and mobile layout`, async ({
      page,
      request,
    }) => {
      test.slow()
      await page.setViewportSize({ width: 390, height: 844 })

      const response = await page.goto(`/blog/${slug}`, { waitUntil: "domcontentloaded" })
      expect(response?.status()).toBe(200)

      const documentTitle = await page.title()
      expect(documentTitle).toContain("SulitScan PH")
      expect(documentTitle.length).toBeLessThanOrEqual(65)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://sulitscan.com/blog/${slug}`
      )

      const bannerPath = `/images/guides/${slug}.jpg`
      const banner = page.getByAltText(coverAlt, { exact: true }).first()
      await expect(banner).toBeVisible()
      await expect(banner).toHaveAttribute("src", new RegExp(`${slug}\\.jpg`))
      await expect.poll(() =>
        banner.evaluate((image) => (image as HTMLImageElement).naturalWidth)
      ).toBeGreaterThan(0)
      expect((await request.get(bannerPath)).status()).toBe(200)

      await expect(page.getByRole("heading", { name: "About this guide", exact: true })).toBeVisible()
      await expect(page.getByRole("link", { name: "Editorial process", exact: true })).toHaveAttribute(
        "href",
        "/editorial-policy"
      )
      await expect(page.getByRole("link", { name: "Request a correction", exact: true })).toHaveAttribute(
        "href",
        "/contact"
      )

      const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent ?? "{}"))
      )
      const faqSchema = schemas.find((schema) => schema["@type"] === "FAQPage")
      expect(faqSchema?.mainEntity.length).toBeGreaterThanOrEqual(3)
      expect(await page.locator("details").count()).toBe(faqSchema.mainEntity.length)

      const relatedGuides = page.getByRole("region", { name: "More shopping guides" })
      await expect(relatedGuides.getByRole("link").first()).toBeVisible()

      const sitemap = await (await request.get("/sitemap.xml")).text()
      expect(sitemap).toContain(`<loc>https://sulitscan.com/blog/${slug}</loc>`)

      const layout = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      expect(layout.scrollWidth, `${slug} should not overflow horizontally`).toBe(layout.clientWidth)
    })
  }
})

test.describe("sale-season safety guide routes", () => {
  test.describe.configure({ mode: "serial" })

  for (const { slug, title, coverAlt, expectedRelatedSlugs } of saleSafetyGuides) {
    test(`${slug} protects metadata, trust, schema, discovery, and mobile layout`, async ({ page, request }) => {
      test.slow()
      await page.setViewportSize({ width: 390, height: 844 })

      const response = await page.goto(`/blog/${slug}`, { waitUntil: "domcontentloaded" })
      expect(response?.status()).toBe(200)

      const documentTitle = await page.title()
      expect(documentTitle).toContain("SulitScan PH")
      expect(documentTitle.length).toBeLessThanOrEqual(65)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://sulitscan.com/blog/${slug}`
      )
      await expect(page.getByRole("heading", { level: 1, name: title, exact: true })).toBeVisible()

      const coverImage = page.getByRole("img", { name: coverAlt, exact: true }).first()
      await expect(coverImage).toBeVisible()
      await expect(coverImage).toHaveAttribute("src", new RegExp(`${slug}\\.jpg`))
      await expect.poll(() => coverImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
      const coverResponse = await request.get(`/images/guides/${slug}.jpg`)
      expect(coverResponse.status()).toBe(200)

      const trustPanel = page.locator('section[aria-labelledby="about-this-guide"]')
      await expect(trustPanel.getByRole("heading", { name: "About this guide", exact: true })).toBeVisible()
      const editorialProcessLink = trustPanel.getByRole("link", { name: "Editorial process", exact: true })
      const correctionLink = trustPanel.getByRole("link", { name: "Request a correction", exact: true })
      await expect(editorialProcessLink).toBeVisible()
      await expect(editorialProcessLink).toHaveAttribute("href", "/editorial-policy")
      await expect(correctionLink).toBeVisible()
      await expect(correctionLink).toHaveAttribute("href", "/contact")

      const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent ?? "{}"))
      )
      const faqSchema = schemas.find((schema) => schema["@type"] === "FAQPage")
      expect(faqSchema?.mainEntity.length).toBeGreaterThanOrEqual(3)

      const normalizeFaqText = (value: string) => value.trim().replace(/\s+/g, " ")
      const faqSection = page.locator('section[aria-labelledby="post-faq-heading"]')
      await expect(faqSection).toBeVisible()
      const faqDetails = faqSection.locator("details")
      await expect(faqDetails).toHaveCount(faqSchema.mainEntity.length)

      const visibleFaqPairs: Array<{ question: string; answer: string }> = []
      for (let index = 0; index < (await faqDetails.count()); index += 1) {
        const detail = faqDetails.nth(index)
        const question = detail.locator("summary")
        const answer = detail.locator("p")
        await expect(question).toBeVisible()
        await question.click()
        await expect(answer).toBeVisible()
        const visibleQuestionText = await question.evaluate((summary) => {
          const visibleText = summary.cloneNode(true) as HTMLElement
          visibleText.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove())
          return visibleText.textContent ?? ""
        })
        visibleFaqPairs.push({
          question: normalizeFaqText(visibleQuestionText),
          answer: normalizeFaqText(await answer.innerText()),
        })
      }

      const schemaFaqPairs = faqSchema.mainEntity.map(
        (entity: { name: string; acceptedAnswer: { text: string } }) => ({
          question: normalizeFaqText(entity.name),
          answer: normalizeFaqText(entity.acceptedAnswer.text),
        })
      )
      expect(visibleFaqPairs).toEqual(schemaFaqPairs)

      const relatedGuides = page.getByRole("region", { name: "More shopping guides" })
      const relatedGuideLinks = relatedGuides.getByRole("link")
      await expect(relatedGuideLinks).toHaveCount(expectedRelatedSlugs.length)
      for (let index = 0; index < expectedRelatedSlugs.length; index += 1) {
        const relatedLink = relatedGuideLinks.nth(index)
        await expect(relatedLink).toBeVisible()
        await expect(relatedLink).toHaveAttribute("href", `/blog/${expectedRelatedSlugs[index]}`)
      }

      const sitemap = await (await request.get("/sitemap.xml")).text()
      expect(sitemap).toContain(`<loc>https://sulitscan.com/blog/${slug}</loc>`)

      const layout = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      expect(layout.scrollWidth, `${slug} should not overflow horizontally`).toBe(layout.clientWidth)
    })
  }
})

test("AdSense configuration stays consistent and article-only", async ({ page, request }) => {
  const configuredId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim()
  const normalizedClientId = /^ca-pub-\d{16}$/.test(configuredId ?? "")
    ? configuredId
    : /^pub-\d{16}$/.test(configuredId ?? "")
      ? `ca-${configuredId}`
      : undefined
  const servingEnabled =
    Boolean(normalizedClientId) && process.env.NEXT_PUBLIC_ADSENSE_ADS_ENABLED?.trim() === "true"

  await page.goto("/", { waitUntil: "domcontentloaded" })
  const verification = page.locator('meta[name="google-adsense-account"]')
  if (normalizedClientId) {
    await expect(verification).toHaveAttribute("content", normalizedClientId)
  } else {
    await expect(verification).toHaveCount(0)
  }
  await expect(page.locator('script[src*="pagead2.googlesyndication.com"]')).toHaveCount(0)

  const adsText = await (await request.get("/ads.txt")).text()
  if (normalizedClientId) {
    expect(adsText).toBe(`google.com, ${normalizedClientId.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`)
  } else {
    expect(adsText).toContain("Google AdSense is not configured")
    expect(adsText).not.toContain("DIRECT")
  }

  await page.goto("/blog/online-product-review-checklist-philippines", {
    waitUntil: "domcontentloaded",
  })
  const articleAdScript = page.locator('script[src*="pagead2.googlesyndication.com"]')
  await expect(articleAdScript).toHaveCount(servingEnabled ? 1 : 0)
  if (servingEnabled) {
    await expect(articleAdScript).toHaveAttribute("src", new RegExp(`client=${normalizedClientId}$`))
  }

  await page.goto("/privacy-policy", { waitUntil: "domcontentloaded" })
  await expect(page.getByText("Google AdSense", { exact: false }).first()).toBeVisible()
  await page.goto("/cookie-policy", { waitUntil: "domcontentloaded" })
  await expect(page.getByText("Google-certified Consent Management Platform", { exact: false }).first()).toBeVisible()
  await page.goto("/editorial-policy", { waitUntil: "domcontentloaded" })
  await expect(page.getByRole("heading", { name: "Advertising standards", exact: true })).toBeVisible()
})

test("cookware guide keeps one contextual ImportTaxPH link without a duplicate callout", async ({ page }) => {
  for (const slug of evidenceLedGuides) {
    await page.goto(`/blog/${slug}`)
    const callout = page.getByText("Ordering from overseas?", { exact: true })
    if (slug === "cookware-sets-philippines-buying-guide") {
      await expect(callout).toHaveCount(0)
      const links = page.getByRole("link", { name: "ImportTaxPH", exact: true })
      await expect(links).toHaveCount(1)
      const href = await links.getAttribute("href")
      expect(href).not.toBeNull()
      const url = new URL(href as string)
      expect(url.hostname).toBe("importtaxph.com")
      expect(url.searchParams.get("utm_content")).toBe(
        "cookware-sets-philippines-buying-guide:inline-article"
      )
    } else {
      await expect(callout).toHaveCount(0)
    }
  }
})

test.describe("active catalog scanner regressions", () => {
  // Keep the original nonempty-inventory assertions; expired records must never
  // be revived just to exercise browser tests. Empty-state coverage runs above.
  test.skip(scannerSlides.length === 0, "Requires at least one eligible scanner slide")

test("homepage deal preview applies the first verified slide's freshness treatment", async ({ page }) => {
  const first = scannerSlides[0]
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const preview = page.getByRole("region", { name: "Deal preview" })
  await expect(preview.getByRole("heading", {
    name: first.title,
    exact: true,
  })).toBeVisible()
  const price = preview.locator('[aria-live="polite"]')
  await expect(price).toContainText(formatPrice(first.salePrice))
  if (first.freshnessStatus === "reference") {
    await expect(price).toContainText("Reference price")
    if (first.originalPrice !== first.salePrice) await expect(price).not.toContainText(formatPrice(first.originalPrice))
    await expect(price).not.toContainText(/\d+%|Save|Saved/)
    await expect(preview.getByText("Discount", { exact: true })).toHaveCount(0)
    await expect(preview.getByText(/^−\d+% OFF$/)).toHaveCount(0)
    await expect(preview.getByText(/^₱[\d,]+ Saved$/)).toHaveCount(0)
  } else {
    await expect(price).toContainText(formatPrice(first.originalPrice))
    await expect(preview).toContainText(`${first.discount}%`)
    await expect(price).toContainText(`Save ${formatPrice(first.originalPrice - first.salePrice)}`)
  }
  await expect(preview.getByText("Live", { exact: true })).toHaveCount(0)
})

test("homepage scanner opens the active internal deal detail page", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const preview = page.getByRole("region", { name: "Deal preview" })
  await expect(preview.getByRole("link", { name: "View Deal Details" })).toHaveAttribute(
    "href",
    `/deals/${scannerSlides[0].slug}`
  )
})

test("homepage scanner explains that its detail page contains the partner link", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const preview = page.getByRole("region", { name: "Deal preview" })
  await expect(preview).toContainText(
    "Review the deal details first. The detail page contains the clearly disclosed partner link."
  )
})

test("homepage scanner keeps its focused deal link stable past auto-rotation", async ({ page }) => {
  test.skip(scannerSlides.length < 2, "Requires at least two distinct-category scanner slides for rotation")
  test.slow()
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const preview = page.getByRole("region", { name: "Deal preview" })
  const detailLink = preview.getByRole("link", { name: "View Deal Details" })
  const initialHref = await detailLink.getAttribute("href")
  expect(initialHref).toMatch(/^\/deals\/[a-z0-9-]+$/)
  await expect.poll(
    () => detailLink.getAttribute("href"),
    { timeout: 6000 }
  ).not.toBe(initialHref)

  const focusedHref = await detailLink.getAttribute("href")
  const focusedNode = await detailLink.elementHandle()
  expect(focusedNode).not.toBeNull()
  await detailLink.focus()
  await expect(detailLink).toBeFocused()
  await expect(preview).toHaveAttribute("data-decorative-motion", "off")
  await page.waitForTimeout(4500)

  expect(await focusedNode!.evaluate((element) => document.activeElement === element)).toBe(true)
  await expect(detailLink).toBeFocused()
  await expect(detailLink).toHaveAttribute("href", focusedHref as string)
})

test("homepage scanner keeps an explicit pause after focus leaves", async ({ page }) => {
  test.skip(scannerSlides.length < 2, "Requires at least two distinct-category scanner slides for rotation")
  test.slow()
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const preview = page.getByRole("region", { name: "Deal preview" })
  const detailLink = preview.getByRole("link", { name: "View Deal Details" })
  await preview.getByRole("button", { name: "Pause deal preview" }).click()
  const pausedHref = await detailLink.getAttribute("href")

  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  await page.waitForTimeout(4500)

  await expect(preview.getByRole("button", { name: "Play deal preview" })).toBeVisible()
  await expect(detailLink).toHaveAttribute("href", pausedHref as string)

  await preview.getByRole("button", { name: "Play deal preview" }).click()
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  await page.mouse.move(0, 0)
  await expect.poll(
    () => detailLink.getAttribute("href"),
    { timeout: 6000 }
  ).not.toBe(pausedHref)
})

test("homepage scanner pauses while hovered and resumes after the pointer leaves", async ({ page }) => {
  test.skip(scannerSlides.length < 2, "Requires at least two distinct-category scanner slides for rotation")
  test.slow()
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const preview = page.getByRole("region", { name: "Deal preview" })
  const detailLink = preview.getByRole("link", { name: "View Deal Details" })
  await preview.hover()
  await expect(preview).toHaveAttribute("data-decorative-motion", "off")
  const hoveredHref = await detailLink.getAttribute("href")
  await page.waitForTimeout(4500)
  await expect(detailLink).toHaveAttribute("href", hoveredHref as string)

  await page.mouse.move(0, 0)
  await expect(preview).toHaveAttribute("data-decorative-motion", "on")
  await expect.poll(
    () => detailLink.getAttribute("href"),
    { timeout: 6000 }
  ).not.toBe(hoveredHref)
})

test("homepage scanner defaults to paused with reduced motion", async ({ page }) => {
  test.slow()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const preview = page.getByRole("region", { name: "Deal preview" })
  const detailLink = preview.getByRole("link", { name: "View Deal Details" })
  const initialHref = await detailLink.getAttribute("href")
  await expect(preview.getByRole("button", { name: "Play deal preview" })).toBeVisible()
  await page.waitForTimeout(4500)

  await expect(detailLink).toHaveAttribute("href", initialHref as string)
  await expect(preview).toHaveAttribute("data-decorative-motion", "off")
  await expect.poll(() => preview.locator("[data-scanner-card]").evaluate(
    (card) => card.scrollWidth <= card.clientWidth
  )).toBe(true)
  const firstSlideControl = preview.getByRole("button", { name: "Show slide 1" })
  const controlBox = await firstSlideControl.boundingBox()
  expect(controlBox?.width).toBeGreaterThanOrEqual(24)
  expect(controlBox?.height).toBeGreaterThanOrEqual(24)
})
})

test.describe("active catalog product-card regressions", () => {
  // Keep the original nonempty-inventory assertions; expired records must never
  // be revived just to exercise browser tests. Empty-state coverage runs above.
  test.skip(activeDeals.length === 0, "Requires verified product inventory")

test("affiliate links have correct rel attributes", async ({ page }) => {
  await page.goto("/deals")
  const affiliateLinks = page.locator('a[rel*="sponsored"]')
  const count = await affiliateLinks.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < Math.min(count, 3); i++) {
    const rel = await affiliateLinks.nth(i).getAttribute("rel")
    expect(rel).toContain("noopener")
    expect(rel).toContain("noreferrer")
  }
})

test("optimized deal images load the first listing eagerly and defer the second", async ({ page }) => {
  test.skip(allDealsListing.items.length < 2 || !allDealsListing.items.slice(0, 2).every((deal) => deal.imageUrl), "Requires two imaged products at the start of the listing")
  await page.goto("/deals", { waitUntil: "domcontentloaded" })

  const images = page.locator('main article a[aria-hidden="true"] img')
  expect(await images.count()).toBeGreaterThanOrEqual(2)

  const firstImage = images.nth(0)
  const secondImage = images.nth(1)

  await expect(firstImage).toHaveAttribute("src", /^\/_next\/image\?url=/)
  await expect(firstImage).toHaveAttribute("loading", "eager")
  await expect(firstImage).toHaveAttribute("fetchpriority", "high")
  await expect(secondImage).toHaveAttribute("src", /^\/_next\/image\?url=/)
  await expect(secondImage).toHaveAttribute("loading", "lazy")
  await expect(secondImage).not.toHaveAttribute("fetchpriority", "high")

  await expect
    .poll(() => firstImage.evaluate((image) => {
      const renderedImage = image as HTMLImageElement
      return renderedImage.complete && renderedImage.naturalWidth > 0
    }))
    .toBe(true)
  await expect
    .poll(() => secondImage.evaluate((image) => {
      const renderedImage = image as HTMLImageElement
      return renderedImage.complete && renderedImage.naturalWidth > 0
    }))
    .toBe(true)
})

for (const { entityPath, dealsSectionId } of [
  { entityPath: "/categories/under-1000", dealsSectionId: "deals-section-heading" },
  { entityPath: "/stores/temu", dealsSectionId: "store-deals-heading" },
]) {
  test(`${entityPath} optimizes entity deal images and tracks their public position`, async ({ page }) => {
    test.skip(entityDeals(entityPath).length < 2 || !entityDeals(entityPath).slice(0, 2).every((deal) => deal.imageUrl), "Requires two imaged products in this entity")
    test.slow()
    await page.addInitScript(() => {
      ;(window as typeof window & { __events: unknown[] }).__events = []
      window.va = (type, payload) => {
        ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
      }
    })
    await page.goto(entityPath, { waitUntil: "domcontentloaded" })
    await installAnalyticsCapture(page)

    const cards = page.locator(`section[aria-labelledby="${dealsSectionId}"] article`)
    expect(await cards.count()).toBeGreaterThanOrEqual(2)
    const firstImage = cards.nth(0).locator('a[aria-hidden="true"] img')
    const secondImage = cards.nth(1).locator('a[aria-hidden="true"] img')

    await expect(firstImage).toHaveAttribute("src", /^\/_next\/image\?url=/)
    await expect(firstImage).toHaveAttribute("loading", "eager")
    await expect(firstImage).toHaveAttribute("fetchpriority", "high")
    await expect(secondImage).toHaveAttribute("src", /^\/_next\/image\?url=/)
    await expect(secondImage).toHaveAttribute("loading", "lazy")
    await expect(secondImage).not.toHaveAttribute("fetchpriority", "high")

    for (const image of [firstImage, secondImage]) {
      await expect
        .poll(() => image.evaluate((element) => {
          const renderedImage = element as HTMLImageElement
          return renderedImage.complete && renderedImage.naturalWidth > 0
        }))
        .toBe(true)
    }

    const secondCard = cards.nth(1)
    const detailHref = await secondCard.locator('a[href^="/deals/"]').first().getAttribute("href")
    const offerId = detailHref?.split("/").pop()
    expect(offerId).toBeTruthy()
    const affiliateLink = secondCard.locator('a[rel*="sponsored"]')
    await affiliateLink.evaluate((element) =>
      element.addEventListener("click", (event) => event.preventDefault())
    )
    await affiliateLink.click()

    const events = await page.evaluate(() =>
      (window as typeof window & {
        __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
      }).__events
    )
    const event = events.find((candidate) =>
      candidate.type === "event" && candidate.payload.name === "affiliate_click"
    )
    expect(event?.payload.data).toMatchObject({
      offerId,
      placement: "deal-card",
      position: 2,
      source: entityPath.split("/").pop(),
    })
    expect(Object.keys(event?.payload.data ?? {}).sort()).toEqual([
      "offerId",
      "placement",
      "platform",
      "position",
      "source",
    ])
    for (const privateProperty of ["href", "url", "query", "title", "email"]) {
      expect(event?.payload.data).not.toHaveProperty(privateProperty)
    }
  })
}

test("homepage scanner image is optimized, bounded, loaded, and server discoverable", async ({
  page,
  request,
}) => {
  test.skip(!scannerSlides[0]?.imageUrl, "Requires an imaged first scanner slide")
  const response = await request.get("/")
  expect(response.status()).toBe(200)
  const html = await response.text()
  const scannerRegion = html.match(
    /<section[^>]*aria-label="Deal preview"[^>]*>[\s\S]*?<\/section>/
  )?.[0]
  expect(scannerRegion).toBeDefined()
  const serverImage = scannerRegion?.match(/<img[^>]+>/)?.[0]
  expect(serverImage).toContain('sizes="(max-width: 480px) calc(100vw - 2rem), 448px"')
  const scannerAsset = serverImage?.match(/\/_next\/image\?url=([^&"]+)/)?.[1]
  expect(scannerAsset).toBeTruthy()
  const scannerPreload = html.match(/<link[^>]+rel="preload"[^>]+as="image"[^>]+>/g)?.find(
    (link) => link.includes(scannerAsset as string)
  )
  expect(scannerPreload).toContain(
    'imageSizes="(max-width: 480px) calc(100vw - 2rem), 448px"'
  )

  await page.goto("/", { waitUntil: "domcontentloaded" })
  const scannerImage = page.locator('section[aria-labelledby="hero-heading"] img').first()
  await expect(scannerImage).toHaveAttribute("src", /^\/_next\/image\?url=/)
  await expect(scannerImage).toHaveAttribute(
    "sizes",
    "(max-width: 480px) calc(100vw - 2rem), 448px"
  )
  await expect
    .poll(() => scannerImage.evaluate((element) => {
      const renderedImage = element as HTMLImageElement
      return renderedImage.complete && renderedImage.naturalWidth > 0
    }))
    .toBe(true)
})

test("deal card emits an affiliate_click event", async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/deals")
  await installAnalyticsCapture(page)
  const affiliateLink = page.locator('a[rel*="sponsored"]').first()
  const detailHref = await affiliateLink
    .locator("xpath=ancestor::article")
    .locator('a[href^="/deals/"]')
    .first()
    .getAttribute("href")
  const offerId = detailHref?.split("/").pop()
  expect(offerId).toBeTruthy()
  const popupPromise = page.waitForEvent("popup")
  await affiliateLink.click()
  const popup = await popupPromise
  await popup.close()
  const events = await page.evaluate(() =>
    (window as typeof window & {
      __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
    }).__events
  )
  const event = events.find((candidate) =>
    candidate.type === "event" && candidate.payload.name === "affiliate_click"
  )
  expect(event).toBeDefined()
  expect(Object.keys(event?.payload.data ?? {}).sort()).toEqual(["offerId", "placement", "platform", "position", "source"])
  expect(event?.payload.data).toMatchObject({
    offerId,
    placement: "deal-card",
    position: 1,
    source: "deals",
  })
  for (const privateProperty of ["href", "url", "query", "title", "email"]) {
    expect(event?.payload.data).not.toHaveProperty(privateProperty)
  }
})

test("deal detail links its store and category while tracking only its public offer ID", async ({ page }) => {
  const deal = activeDeals.find((record) => record.platform === "Shopee PH" && record.category === "Home")
  test.skip(!deal, "Requires an active Shopee PH Home product for these store/category assertions")
  const offerId = deal!.slug
  await page.goto(`/deals/${offerId}`)
  await installAnalyticsCapture(page)

  await expect(page.getByRole("link", { name: "Shopee PH", exact: true })).toHaveAttribute(
    "href",
    "/stores/shopee-ph"
  )
  await expect(page.getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
    "href",
    "/categories/home-finds"
  )

  const primaryAffiliateLink = page.getByRole("link", {
    name: "Check the current price on Shopee PH (affiliate link, opens in new tab)",
    exact: true,
  })
  await primaryAffiliateLink.evaluate((element) =>
    element.addEventListener("click", (event) => event.preventDefault())
  )
  await primaryAffiliateLink.click()

  const events = await page.evaluate(() =>
    (window as typeof window & {
      __events: Array<{ type: string; payload: { name?: string; data?: Record<string, unknown> } }>
    }).__events
  )
  const event = events.find((candidate) =>
    candidate.type === "event" && candidate.payload.name === "affiliate_click"
  )
  expect(event?.payload.data).toEqual({
    offerId,
    placement: "deal-detail-primary",
    platform: "Shopee PH",
    source: offerId,
  })
  expect(Object.keys(event?.payload.data ?? {}).sort()).toEqual([
    "offerId",
    "placement",
    "platform",
    "source",
  ])
})

test("reference prices retire stale discount claims while retaining the Temu affiliate link", async ({ page }) => {
  const deal = activeDeals.find((record) => record.platform === "Temu"
    && getDealFreshness(record.lastChecked, inventoryNow).status === "reference"
    && record.originalPrice > record.salePrice
    && isDealIndexable(record, getDealFreshness(record.lastChecked, inventoryNow)))
  test.skip(!deal, "Requires an indexable Temu reference product with distinct original/sale prices")
  const { slug, title } = deal!
  const sale = formatPrice(deal!.salePrice)
  const original = formatPrice(deal!.originalPrice)

  await page.goto(`/deals?q=${encodeURIComponent(title)}`, { waitUntil: "domcontentloaded" })
  const card = page.locator("article").filter({
    has: page.getByRole("heading", { name: title, exact: true }),
  })
  const cardPrice = card.locator('[aria-live="polite"]')
  await expect(cardPrice).toContainText("Reference price")
  await expect(cardPrice).toContainText(sale)
  await expect(cardPrice).not.toContainText(original)
  await expect(cardPrice).not.toContainText(/\d+%|Save|Saved/)
  await expect(card.getByText(/^\d+% OFF$/)).toHaveCount(0)

  const itemLists = (await page.locator('script[type="application/ld+json"]').allTextContents())
    .map((value) => JSON.parse(value))
    .filter((value) => value["@type"] === "ItemList")
  expect(itemLists.flatMap((itemList) => itemList.itemListElement.map((item: { description?: string }) => item.description)))
    .not.toContain(expect.stringMatching(/(?:₱\d|\d+%|\b(?:price|discount|save|cost)\b)/i))

  await page.goto(`/deals/${slug}`, { waitUntil: "domcontentloaded" })
  const priceInformation = page.getByRole("region", { name: "Price information" })
  await expect(priceInformation).toContainText("Reference price")
  await expect(priceInformation).toContainText(sale)
  await expect(priceInformation).not.toContainText(original)
  await expect(page.getByRole("main")).not.toContainText(`At ${sale}`)
  await expect(priceInformation).not.toContainText("Save")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `https://sulitscan.com/deals/${slug}`
  )
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/i)
  await expect(page.getByRole("link", {
    name: "Check the current price on Temu (affiliate link, opens in new tab)",
    exact: true,
  })).toHaveAttribute("rel", /sponsored/)
})
})

test.describe("active catalog pagination regressions", () => {
  // Pagination scenarios require enough products for that specific entity;
  // invalid request normalization remains applicable even without inventory.

test("deals page exposes crawlable server pagination", async ({ page }) => {
  test.skip(activeDeals.length <= DEALS_PAGE_SIZE, "Requires a populated second all-deals page")
  await page.goto("/deals?page=2")
  await expect(page.getByText("Page 2 of", { exact: false })).toBeVisible()
  await expect(page.getByRole("link", { name: "Previous page" })).toHaveAttribute("href", "/deals")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://sulitscan.com/deals?page=2")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/i)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Deals.*Page 2/i)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://sulitscan.com/deals?page=2")
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", /Deals.*Page 2/i)
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", /curated online deals/i)
  expect(await page.locator("main article").count()).toBeLessThanOrEqual(24)
})

test.describe("entity deal pagination", () => {
  test.describe.configure({ mode: "serial" })

  for (const entityPath of ["/categories/under-1000", "/stores/temu"]) {
    test(`${entityPath} exposes crawlable deal pagination`, async ({ page }) => {
      test.skip(entityDeals(entityPath).length <= ENTITY_DEALS_PAGE_SIZE, "Requires a populated second page for this entity")
      test.slow()
      await page.goto(entityPath, { waitUntil: "domcontentloaded" })
      const firstPageDeals = await page.locator("main article h3").allTextContents()
      await expect(page.getByRole("link", { name: "Next page" })).toHaveAttribute(
        "href",
        `${entityPath}?page=2`
      )

      const response = await page.goto(`${entityPath}?page=2`, {
        waitUntil: "domcontentloaded",
      })
      expect(response?.status()).toBe(200)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://sulitscan.com${entityPath}?page=2`
      )
      const secondPageDeals = await page.locator("main article h3").allTextContents()
      expect(secondPageDeals).not.toEqual(firstPageDeals)
    })

    test(`${entityPath} noindexes an invalid page request`, async ({ page }) => {
      test.slow()
      await page.goto(`${entityPath}?page=garbage`, { waitUntil: "domcontentloaded" })
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://sulitscan.com${entityPath}`
      )
    })
  }

  test("later category and store pages keep deal results while omitting page-one-only content", async ({ page }) => {
    test.skip(["/categories/under-500", "/stores/temu"].some((path) => entityDeals(path).length <= ENTITY_DEALS_PAGE_SIZE), "Requires populated second pages for both tested entities")
    test.slow()

    await page.goto("/categories/under-500", { waitUntil: "domcontentloaded" })
    const categoryPageOneDescription = await page.locator('meta[name="description"]').getAttribute("content")

    await page.goto("/categories/under-500?page=2", { waitUntil: "domcontentloaded" })
    await expect(page.locator('main article')).not.toHaveCount(0)
    await expect(page.getByText("Page 2 of", { exact: false })).toBeVisible()
    expect((await page.locator('script[type="application/ld+json"]').allTextContents())
      .some((schema) => schema.includes('"@type":"FAQPage"'))).toBe(false)
    await expect(page.getByRole("heading", { name: /Top picks in/i })).toHaveCount(0)
    await expect(page.getByRole("heading", { name: /deals in the Philippines/i })).toHaveCount(0)
    const categoryPageTwoDescription = await page.locator('meta[name="description"]').getAttribute("content")
    expect(categoryPageTwoDescription).toContain("Page 2")
    expect(categoryPageTwoDescription).not.toBe(categoryPageOneDescription)

    await page.goto("/stores/temu", { waitUntil: "domcontentloaded" })
    const storePageOneDescription = await page.locator('meta[name="description"]').getAttribute("content")

    await page.goto("/stores/temu?page=2", { waitUntil: "domcontentloaded" })
    await expect(page.locator('main article')).not.toHaveCount(0)
    await expect(page.getByText("Page 2 of", { exact: false })).toBeVisible()
    expect((await page.locator('script[type="application/ld+json"]').allTextContents())
      .some((schema) => schema.includes('"@type":"FAQPage"'))).toBe(false)
    await expect(page.getByRole("heading", { name: /Frequently asked questions about Temu/i })).toHaveCount(0)
    const storePageTwoDescription = await page.locator('meta[name="description"]').getAttribute("content")
    expect(storePageTwoDescription).toContain("Page 2")
    expect(storePageTwoDescription).not.toBe(storePageOneDescription)
  })

  test("duplicate entity page parameters remain noindex after display normalization", async ({ page }) => {
    test.skip(["/categories/under-500", "/stores/temu"].some((path) => entityDeals(path).length <= ENTITY_DEALS_PAGE_SIZE), "Requires populated second pages for both tested entities")
    test.slow()

    for (const entityPath of ["/categories/under-500", "/stores/temu"]) {
      await page.goto(`${entityPath}?page=2&page=3`, { waitUntil: "domcontentloaded" })

      await expect(page.getByText("Page 2 of", { exact: false })).toBeVisible()
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
    }
  })
})
})
