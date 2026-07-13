import { test, expect } from "@playwright/test"

const routes = [
  { path: "/",                     title: "SulitScan PH" },
  { path: "/deals",                title: "Deals" },
  { path: "/categories",           title: "Categories" },
  { path: "/stores",               title: "Stores" },
  { path: "/blog",                 title: "Blog" },
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
    (window as typeof window & { __events: Array<{ type: string; payload: { name?: string } }> }).__events
  )
  expect(events.some((event) => event.type === "event" && event.payload.name === "affiliate_click")).toBe(true)
})

test("Temu guide links to the tracked Temu ImportTaxPH calculator", async ({ page }) => {
  await page.goto("/blog/temu-shopping-guide-philippines")
  const link = page.getByRole("link", { name: /ImportTaxPH/i }).first()
  await expect(link).toHaveAttribute("href", /importtaxph\.com\/temu-import-tax/)
  await expect(link).toHaveAttribute("href", /utm_source=sulitscan/)
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
    (window as typeof window & { __events: Array<{ type: string; payload: { name?: string } }> }).__events
  )
  expect(events.some((event) => event.type === "event" && event.payload.name === "sister_site_click")).toBe(true)
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
