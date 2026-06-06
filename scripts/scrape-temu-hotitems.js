/**
 * Temu Hot Items Scraper — run this manually after "npx playwright install chromium"
 *
 * Usage:
 *   1. Run: npx playwright install chromium
 *   2. Run: node scripts/scrape-temu-hotitems.js
 *   3. A browser window opens — log in to your Temu affiliate account
 *   4. The script waits 60s for you to log in, then auto-scrapes Hot Items
 *   5. Results saved to scripts/temu-hotitems.json
 */

const { chromium } = require("playwright")
const fs = require("fs")
const path = require("path")

async function scrapeTemu() {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  console.log("Opening Temu affiliate Hot Items page...")
  await page.goto("https://www.temu.com/bg/affiliate/hot-items.html", {
    waitUntil: "networkidle",
    timeout: 30000,
  })

  console.log("⏳ You have 60 seconds to log in to your Temu affiliate account...")
  await page.waitForTimeout(60000)

  console.log("Scraping Hot Items...")

  // Wait for products to appear
  await page.waitForSelector(".goods-item, [class*='goods'], [class*='item-card']", {
    timeout: 15000,
  }).catch(() => console.log("Selector not found — trying fallback..."))

  const products = await page.evaluate(() => {
    const items = []

    // Try multiple selectors Temu uses for product cards
    const cards = document.querySelectorAll(
      ".goods-item, [class*='GoodsItem'], [class*='goods-card'], [class*='item-wrap']"
    )

    cards.forEach((card, idx) => {
      if (idx >= 30) return // Limit to 30 items

      const imgEl = card.querySelector("img")
      const nameEl = card.querySelector("[class*='name'], [class*='title'], h3, h4")
      const priceEl = card.querySelector("[class*='price'], [class*='Price']")
      const commEl = card.querySelector("[class*='commission'], [class*='Commission']")
      const linkEl = card.querySelector("a")

      const img = imgEl?.src || imgEl?.dataset?.src || ""
      const name = nameEl?.textContent?.trim() || ""
      const price = priceEl?.textContent?.trim() || ""
      const commission = commEl?.textContent?.trim() || ""
      const link = linkEl?.href || ""

      if (name && img) {
        items.push({ name, img, price, commission, link, idx })
      }
    })

    return items
  })

  if (products.length === 0) {
    // Take a screenshot to help debug
    await page.screenshot({ path: "scripts/temu-debug.png", fullPage: true })
    console.log("No products found. Screenshot saved to scripts/temu-debug.png")
  } else {
    console.log(`Found ${products.length} products!`)
    const outPath = path.join(__dirname, "temu-hotitems.json")
    fs.writeFileSync(outPath, JSON.stringify(products, null, 2))
    console.log(`Saved to ${outPath}`)
    console.log("\nTop products:")
    products.slice(0, 10).forEach((p) => {
      console.log(`  [${p.idx + 1}] ${p.name} — ${p.price} (commission: ${p.commission})`)
      console.log(`       img: ${p.img.substring(0, 80)}...`)
    })
  }

  await browser.close()
}

scrapeTemu().catch(console.error)
