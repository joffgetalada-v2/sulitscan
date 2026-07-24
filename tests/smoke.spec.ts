import { test, expect, type Page } from "@playwright/test"

async function installAnalyticsCapture(page: Page) {
  await page.evaluate(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
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

  await page.evaluate(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
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
  await expect(page.getByRole("main").getByRole("link", { name: "Compare checkout totals" })).toBeVisible()
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

test("deal card emits an affiliate_click event", async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as typeof window & { __events: unknown[] }).__events = []
    window.va = (type, payload) => {
      ;(window as typeof window & { __events: unknown[] }).__events.push({ type, payload })
    }
  })
  await page.goto("/deals")
  await installAnalyticsCapture(page)
  const popupPromise = page.waitForEvent("popup")
  await page.locator('a[rel*="sponsored"]').first().click()
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
  expect(Object.keys(event?.payload.data ?? {}).sort()).toEqual(["placement", "platform", "source"])
  expect(event?.payload.data).toMatchObject({ placement: "deal-card", source: "deals" })
})

test("homepage partner banner emits a private affiliate_click event", async ({ page }) => {
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
    platform: "Shopee",
    placement: "partner-banner",
    source: "home",
  })
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
  await page.goto("/deals")
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
  expect(xml).toContain("/categories/under-1000?page=2")
  expect(xml).toContain("/stores/temu?page=2")
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

test("Shopee seller guide recommends related Shopee content", async ({ page }) => {
  await page.goto("/blog/how-to-check-shopee-seller-legit-philippines")
  const related = page.getByRole("region", { name: "More shopping guides" })
  await expect(related.getByRole("link", { name: /Shopee/i }).first()).toBeVisible()
})

test("deals page exposes crawlable server pagination", async ({ page }) => {
  await page.goto("/deals?page=2")
  await expect(page.getByText("Page 2 of", { exact: false })).toBeVisible()
  await expect(page.getByRole("link", { name: "Previous page" })).toHaveAttribute("href", "/deals")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://sulitscan.com/deals?page=2")
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Deals.*Page 2/i)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://sulitscan.com/deals?page=2")
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", /Deals.*Page 2/i)
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", /curated online deals/i)
  expect(await page.locator("main article").count()).toBeLessThanOrEqual(24)
})

test("filtered deals are noindex and preserve URL state", async ({ page }) => {
  await page.goto("/deals?q=brush&store=Sephora+PH")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  await expect(page.locator('input[name="q"]')).toHaveValue("brush")
  await expect(page.locator('select[name="store"]')).toHaveValue("Sephora PH")
})

test("invalid deal filters normalize visibly but remain noindex", async ({ page }) => {
  await page.goto("/deals?store=garbage&category=garbage&sort=garbage")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  await expect(page.locator('select[name="store"]')).toHaveValue("All")
  await expect(page.locator('select[name="category"]')).toHaveValue("All")
  await expect(page.locator('select[name="sort"]')).toHaveValue("recommended")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://sulitscan.com/deals")
})

for (const entityPath of ["/categories/under-1000", "/stores/temu"]) {
  test(`${entityPath} exposes crawlable deal pagination`, async ({ page }) => {
    await page.goto(entityPath)
    const firstPageDeals = await page.locator("main article h3").allTextContents()
    await expect(page.getByRole("link", { name: "Next page" })).toHaveAttribute(
      "href",
      `${entityPath}?page=2`
    )

    const response = await page.goto(`${entityPath}?page=2`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://sulitscan.com${entityPath}?page=2`
    )
    const secondPageDeals = await page.locator("main article h3").allTextContents()
    expect(secondPageDeals).not.toEqual(firstPageDeals)
  })

  test(`${entityPath} noindexes an invalid page request`, async ({ page }) => {
    await page.goto(`${entityPath}?page=garbage`)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://sulitscan.com${entityPath}`
    )
  })
}


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
  test(`${slug} renders a unique cover, FAQs, related deals, and disclosure`, async ({ page }) => {
    await page.goto(`/blog/${slug}`)
    await expect(page.locator(`img[src*="${slug}"]`).first()).toBeVisible()
    await expect(page.getByRole("heading", { name: "Frequently asked questions", exact: true })).toBeVisible()
    await expect(page.locator("summary").filter({ hasText: faqQuestion })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Related deals to check" })).toBeVisible()
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

      const relatedDeals = page.getByRole("region", { name: "Related deals to check" })
      await expect(relatedDeals.locator("article").first()).toBeVisible()
      await expect(page.locator("main").getByText("Affiliate Disclosure:", { exact: false })).toBeVisible()
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://sulitscan.com/blog/${slug}`
      )
    })
  }
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
