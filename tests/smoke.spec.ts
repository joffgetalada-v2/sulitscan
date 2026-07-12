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
