/**
 * Temu Hot Items Scraper
 *
 * Uses your EXISTING Chrome profile so you are already logged in to Temu —
 * no need to log in again, and Google sign-in works normally.
 *
 * BEFORE RUNNING:
 *   1. Close ALL Chrome windows (required — Chrome locks the profile folder)
 *   2. Run: node scripts/scrape-temu-hotitems.js
 *   3. Chrome opens, goes straight to Temu affiliate Hot Items (already logged in)
 *   4. Scrapes automatically — results saved to scripts/temu-hotitems.json
 *   5. Share that file in the chat so the deals can be updated
 *
 * If Chrome is still running when you start the script, it will fall back to
 * opening a fresh browser window where you can log in manually.
 */

const { chromium } = require("playwright")
const fs = require("fs")
const path = require("path")
const os = require("os")

// Your existing Chrome profile path (Windows default)
const CHROME_PROFILE = path.join(
  "C:\\Users", os.userInfo().username,
  "AppData", "Local", "Google", "Chrome", "User Data"
)

const TEMU_HOT_ITEMS_URL = "https://www.temu.com/bg/affiliate/hot-items.html"

async function scrapeWithProfile() {
  console.log(`Using Chrome profile: ${CHROME_PROFILE}`)
  // launchPersistentContext uses your existing profile — already logged in
  const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
    headless: false,
    channel: "chrome",      // use the real installed Chrome, not "Chrome for Testing"
    args: ["--start-maximized"],
    viewport: null,
  })
  return { context, page: await context.newPage(), usingProfile: true }
}

async function scrapeWithFreshBrowser() {
  console.log("Falling back to fresh Chrome window — you will need to log in manually.")
  const browser = await chromium.launch({
    headless: false,
    channel: "chrome",     // still use real Chrome so Google sign-in works
    args: ["--start-maximized"],
  })
  const context = await browser.newContext({ viewport: null })
  return { browser, context, page: await context.newPage(), usingProfile: false }
}

async function scrapeProducts(page) {
  console.log("Navigating to Temu affiliate Hot Items...")
  await page.goto(TEMU_HOT_ITEMS_URL, { waitUntil: "domcontentloaded", timeout: 30000 })

  // If not logged in, wait for the user to log in (max 90 seconds)
  const isLoggedIn = await page.locator("text=Hot Items").count().catch(() => 0)
  if (!isLoggedIn) {
    console.log("⏳ Waiting up to 90 seconds for you to log in...")
    await page.waitForSelector("text=Hot Items", { timeout: 90000 }).catch(() => {})
  }

  // Scroll to load more products
  console.log("Scrolling to load products...")
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 1200)
    await page.waitForTimeout(1000)
  }

  console.log("Extracting product data...")
  const products = await page.evaluate(() => {
    const results = []

    // Dump all images on the page with their surrounding context
    const allImgs = Array.from(document.querySelectorAll("img"))

    allImgs.forEach((img) => {
      const src = img.src || img.dataset?.src || img.dataset?.lazySrc || ""
      if (!src || src.includes("logo") || src.includes("icon") || src.length < 30) return

      // Walk up the DOM to find the product card container
      let card = img.parentElement
      for (let depth = 0; depth < 6; depth++) {
        if (!card) break
        const text = card.innerText || ""
        const hasPrice = /[₱$¥€£]|php|price/i.test(text)
        const hasCommission = /commission|max/i.test(text)
        if (hasPrice || hasCommission) break
        card = card.parentElement
      }

      const cardText = card?.innerText || ""
      const priceMatch = cardText.match(/[₱$][\d,]+(?:\.\d+)?/)
      const commMatch = cardText.match(/[₱$][\d,]+(?:\.\d+)?\s*(?:commission|max)/i)

      // Get product name from nearest heading or title
      const nameEl = card?.querySelector("h1,h2,h3,h4,[class*='name'],[class*='title'],[class*='goods-name']")
      const name = nameEl?.textContent?.trim() || ""

      // Get link
      const linkEl = card?.closest("a") || card?.querySelector("a")
      const link = linkEl?.href || ""

      if (src && (name || priceMatch)) {
        results.push({
          name,
          img: src,
          price: priceMatch?.[0] || "",
          commission: commMatch?.[0] || "",
          link,
        })
      }
    })

    // Deduplicate by image src
    const seen = new Set()
    return results.filter((p) => {
      if (seen.has(p.img)) return false
      seen.add(p.img)
      return true
    }).slice(0, 40)
  })

  return products
}

async function main() {
  let handle = null

  try {
    handle = await scrapeWithProfile()
  } catch (err) {
    console.warn("Could not use existing Chrome profile:", err.message)
    console.warn("Is Chrome still running? Please close all Chrome windows and try again.")
    console.warn("Trying fresh browser as fallback...\n")
    try {
      handle = await scrapeWithFreshBrowser()
    } catch (err2) {
      console.error("Could not launch Chrome. Is Google Chrome installed?", err2.message)
      process.exit(1)
    }
  }

  const { context, page } = handle

  try {
    const products = await scrapeProducts(page)

    if (products.length === 0) {
      await page.screenshot({ path: path.join(__dirname, "temu-debug.png"), fullPage: true })
      console.log("No products found. Screenshot saved to scripts/temu-debug.png")
      console.log("Share that screenshot in the chat so we can debug the page structure.")
    } else {
      const outPath = path.join(__dirname, "temu-hotitems.json")
      fs.writeFileSync(outPath, JSON.stringify(products, null, 2))
      console.log(`\nFound ${products.length} products!`)
      console.log(`Saved to ${outPath}`)
      console.log("\nTop items:")
      products.slice(0, 10).forEach((p, i) => {
        console.log(`  [${i + 1}] ${p.name || "(no name)"} — ${p.price}`)
        console.log(`       img: ${p.img.substring(0, 90)}`)
      })
      console.log("\nDone! Share scripts/temu-hotitems.json in the chat.")
    }
  } finally {
    await context.close()
  }
}

main().catch(console.error)
