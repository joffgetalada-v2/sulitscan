import { test, expect } from "@playwright/test"

const routes = [
  { path: "/",                     title: "SulitScan PH" },
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
  expect(await page.locator("main article").count()).toBeLessThanOrEqual(24)
})

test("filtered deals are noindex and preserve URL state", async ({ page }) => {
  await page.goto("/deals?q=brush&store=Sephora+PH")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  await expect(page.locator('input[name="q"]')).toHaveValue("brush")
  await expect(page.locator('select[name="store"]')).toHaveValue("Sephora PH")
})


test("article uses article-specific Twitter metadata and dateModified", async ({ page }) => {
  await page.goto("/blog/best-shopee-finds-under-500-philippines")
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", /Shopee/i)
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /best-shopee-finds-under-500-philippines/i)
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
  const article = jsonLd.map((value) => JSON.parse(value)).find((value) => value["@type"] === "BlogPosting")
  expect(article.dateModified).toBe("2026-07-19")
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
