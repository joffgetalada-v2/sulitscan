/**
 * Temu Hot Items Scraper
 *
 * Copies your Chrome login session to a temp folder so Playwright can use it
 * without the "DevTools requires non-default data directory" block.
 *
 * HOW TO RUN:
 *   node scripts/scrape-temu-hotitems.js
 */

const { chromium } = require("playwright")
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")
const os = require("os")

// ── Config ────────────────────────────────────────────────────────────────────
const CHROME_USER_DATA = path.join(
  "C:\\Users", os.userInfo().username,
  "AppData", "Local", "Google", "Chrome", "User Data"
)
// Your profile — from chrome://version → "Profile Path", last folder name
const CHROME_PROFILE_DIR = "Profile 10"

const TEMU_HOT_ITEMS_URL = "https://www.temu.com/bg/affiliate/hot-items.html"
// ─────────────────────────────────────────────────────────────────────────────

function killChrome() {
  try {
    execSync("taskkill /F /IM chrome.exe /T", { stdio: "ignore" })
    console.log("✓ Closed Chrome")
  } catch { /* wasn't running */ }
  return new Promise(r => setTimeout(r, 2000))
}

function copyDirRobocopy(src, dst) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dst, { recursive: true })
  // robocopy exit codes 0-7 are all success variants
  try { execSync(`robocopy "${src}" "${dst}" /E /NFL /NDL /NJH /NJS /nc /ns /np`, { stdio: "ignore" }) } catch { /* ok */ }
}

async function createTempProfile() {
  const tmpDir = path.join(os.tmpdir(), "temu-scraper-profile")
  const tmpProfileDir = path.join(tmpDir, "Default")

  // Wipe previous temp so we get fresh cookies
  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true })
  fs.mkdirSync(tmpProfileDir, { recursive: true })

  const srcProfile = path.join(CHROME_USER_DATA, CHROME_PROFILE_DIR)

  // Local State holds the DPAPI-encrypted cookie decryption key — must copy it
  const localStateSrc = path.join(CHROME_USER_DATA, "Local State")
  if (fs.existsSync(localStateSrc)) {
    fs.copyFileSync(localStateSrc, path.join(tmpDir, "Local State"))
  }

  // Copy auth-critical profile files
  for (const file of ["Cookies", "Preferences", "Secure Preferences"]) {
    const src = path.join(srcProfile, file)
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(tmpProfileDir, file))
  }

  // Local Storage has session tokens that keep you logged in
  copyDirRobocopy(
    path.join(srcProfile, "Local Storage"),
    path.join(tmpProfileDir, "Local Storage")
  )
  // IndexedDB (some sites store auth here)
  copyDirRobocopy(
    path.join(srcProfile, "IndexedDB"),
    path.join(tmpProfileDir, "IndexedDB")
  )

  console.log("✓ Copied your login session to temp profile")
  return tmpDir
}

async function scrapeProducts(page) {
  console.log("Navigating to Temu affiliate Hot Items...")

  try {
    await page.goto(TEMU_HOT_ITEMS_URL, { waitUntil: "domcontentloaded", timeout: 30000 })
  } catch {
    // Some Temu redirects throw ERR_ABORTED — wait for settle instead
    await page.waitForLoadState("domcontentloaded").catch(() => {})
  }

  await page.waitForTimeout(3000)
  const title = await page.title()
  console.log(`Page title: "${title}"`)

  // Wait for login if session wasn't carried over
  const hotItemsCount = await page.locator("text=Hot Items").count().catch(() => 0)
  if (!hotItemsCount) {
    console.log("⏳ Waiting up to 2 minutes — log in if prompted...")
    await page.waitForSelector("text=Hot Items", { timeout: 120000 }).catch(() => {
      console.log("Timed out waiting — scraping whatever is on screen")
    })
    await page.waitForTimeout(2000)
  }

  // Scroll to trigger lazy-loaded product images
  console.log("Scrolling to load products...")
  for (let i = 0; i < 7; i++) {
    await page.mouse.wheel(0, 1200)
    await page.waitForTimeout(1200)
  }

  console.log("Extracting product data...")
  const products = await page.evaluate(() => {
    const results = []
    const seen = new Set()

    document.querySelectorAll("img").forEach((img) => {
      const src = img.src || img.dataset?.src || img.dataset?.lazySrc || ""
      if (!src || src.includes("logo") || src.includes("icon") || src.length < 30) return
      if (seen.has(src)) return
      seen.add(src)

      let card = img.parentElement
      for (let depth = 0; depth < 8; depth++) {
        if (!card) break
        const text = card.innerText || ""
        if (/[₱$¥€£]|php|price|commission|max/i.test(text)) break
        card = card.parentElement
      }

      const cardText = card?.innerText || ""
      const priceMatch = cardText.match(/[₱$][\d,]+(?:\.\d+)?/)
      const commMatch = cardText.match(/[₱$][\d,]+(?:\.\d+)?\s*(?:commission|max)/i)
      const nameEl = card?.querySelector(
        "h1,h2,h3,h4,[class*='name'],[class*='title'],[class*='goods-name'],[class*='item-name']"
      )
      const name = nameEl?.textContent?.trim() || ""
      const linkEl = card?.closest("a") || card?.querySelector("a")
      const link = linkEl?.href || ""

      if (name || priceMatch) {
        results.push({
          name,
          img: src,
          price: priceMatch?.[0] || "",
          commission: commMatch?.[0] || "",
          link,
        })
      }
    })

    return results.slice(0, 40)
  })

  return products
}

async function main() {
  console.log("─────────────────────────────────────────")
  console.log("  Temu Hot Items Scraper")
  console.log("─────────────────────────────────────────")

  await killChrome()
  const tmpProfile = await createTempProfile()

  let context
  try {
    context = await chromium.launchPersistentContext(tmpProfile, {
      headless: false,
      channel: "chrome",
      args: ["--start-maximized"],
      viewport: null,
    })
    console.log("✓ Chrome launched with your session")
  } catch (err) {
    console.error("Failed to launch Chrome:", err.message)
    console.error("Make sure Google Chrome is installed (not just Chromium).")
    process.exit(1)
  }

  const page = await context.newPage()

  try {
    const products = await scrapeProducts(page)

    console.log("\n─────────────────────────────────────────")
    if (products.length === 0) {
      const debugPath = path.join(__dirname, "temu-debug.png")
      await page.screenshot({ path: debugPath, fullPage: true })
      console.log("No products found — screenshot saved:")
      console.log(debugPath)
      console.log("Share that screenshot in the chat so we can debug.")
    } else {
      const outPath = path.join(__dirname, "temu-hotitems.json")
      fs.writeFileSync(outPath, JSON.stringify(products, null, 2))
      console.log(`Found ${products.length} products!`)
      console.log(`Saved: ${outPath}`)
      console.log("\nTop items:")
      products.slice(0, 10).forEach((p, i) => {
        console.log(`  [${i + 1}] ${p.name || "(no name)"} — ${p.price}`)
        if (p.img) console.log(`       ${p.img.substring(0, 90)}`)
      })
      console.log("\n✓ Done! Share scripts/temu-hotitems.json in the chat.")
    }
  } finally {
    await context.close()
  }
}

main().catch(console.error)
