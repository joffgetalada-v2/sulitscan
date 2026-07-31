import { test, expect, type Page } from "@playwright/test"

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
  expect(pageCount).toBeGreaterThan(1)
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

test("optimized deal images load the first listing eagerly and defer the second", async ({ page }) => {
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
  const response = await request.get("/")
  expect(response.status()).toBe(200)
  const html = await response.text()
  const scannerRegion = html.match(/>sulitscan\.com\/deals<\/div>[\s\S]{0,3000}/)?.[0]
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
  const offerId = "tanle-silicone-foldable-water-bottle-is-leak-proof-a-702052"
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
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/i)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Deals.*Page 2/i)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://sulitscan.com/deals?page=2")
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", /Deals.*Page 2/i)
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", /curated online deals/i)
  expect(await page.locator("main article").count()).toBeLessThanOrEqual(24)
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

test.describe("entity deal pagination", () => {
  test.describe.configure({ mode: "serial" })

  for (const entityPath of ["/categories/under-1000", "/stores/temu"]) {
    test(`${entityPath} exposes crawlable deal pagination`, async ({ page }) => {
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
    test.slow()

    for (const entityPath of ["/categories/under-500", "/stores/temu"]) {
      await page.goto(`${entityPath}?page=2&page=3`, { waitUntil: "domcontentloaded" })

      await expect(page.getByText("Page 2 of", { exact: false })).toBeVisible()
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
    }
  })
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
