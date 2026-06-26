#!/usr/bin/env node
// SulitScan link & affiliate guard (dependency-free, static analysis).
// Run: npm run check:links
//
// Fails the build if it finds:
//   - broken internal links (href / markdown / related slugs that don't resolve)
//   - duplicate deal slugs
//   - empty / placeholder / non-http affiliate or partner URLs
//   - localhost or vercel.app anywhere in source
//   - an affiliate link component missing rel="sponsored nofollow noopener noreferrer"
//
// It intentionally does NOT hit the network — it only validates local data/source.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const read = (p) => readFileSync(join(ROOT, p), "utf8")
const errors = []

function walk(dir, exts) {
  const out = []
  for (const entry of readdirSync(join(ROOT, dir))) {
    const rel = `${dir}/${entry}`
    if (statSync(join(ROOT, rel)).isDirectory()) out.push(...walk(rel, exts))
    else if (exts.some((x) => entry.endsWith(x))) out.push(rel)
  }
  return out
}

const slugsOf = (f) => [...read(f).matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])

// ── Route table ──────────────────────────────────────────────────────────
const STATIC = new Set([
  "", "deals", "categories", "stores", "blog", "about", "contact",
  "affiliate-disclosure", "editorial-policy", "privacy-policy", "terms", "cookie-policy",
])
const catSlugs = new Set(slugsOf("src/data/categories.ts"))
const storeSlugs = new Set(slugsOf("src/data/stores.ts"))
const postSlugs = new Set(slugsOf("src/data/posts.ts"))
const dealSlugs = slugsOf("src/data/deals.ts")
const dealSet = new Set(dealSlugs)

function validInternal(path) {
  const p = path.split("?")[0].split("#")[0].replace(/\/+$/, "").replace(/^\//, "")
  if (STATIC.has(p)) return true
  const parts = p.split("/")
  if (parts.length !== 2) return false
  const [a, b] = parts
  if (a === "deals") return dealSet.has(b)
  if (a === "categories") return catSlugs.has(b)
  if (a === "stores") return storeSlugs.has(b)
  if (a === "blog") return postSlugs.has(b)
  return false
}

// ── 1. Duplicate deal slugs ──────────────────────────────────────────────
const seen = new Set()
for (const s of dealSlugs) {
  if (seen.has(s)) errors.push(`Duplicate deal slug: "${s}"`)
  seen.add(s)
}

// ── 2. Affiliate / partner URLs must be real http(s) links ───────────────
const BAD_URL = /^$|^#$|example\.com|placeholder|localhost|vercel\.app|\/todo\b/i
for (const f of ["src/data/deals.ts", "src/data/stores.ts", "src/data/partner-banners.ts"]) {
  for (const m of read(f).matchAll(/(?:affiliateLink|href):\s*"([^"]*)"/g)) {
    const v = m[1]
    if (!/^https?:\/\/\S+/.test(v) || BAD_URL.test(v)) {
      errors.push(`${f}: invalid affiliate/href URL: "${v}"`)
    }
  }
}

// ── 3. Internal links resolve (href literals, markdown links, related slugs) ─
for (const f of walk("src", [".tsx", ".ts"])) {
  for (const m of read(f).matchAll(/href="(\/[^"{}\s]*)"/g)) {
    if (!validInternal(m[1])) errors.push(`${f}: broken internal link href="${m[1]}"`)
  }
}
const postsSrc = read("src/data/posts.ts")
// Markdown page links [text](/path) — exclude image markdown ![alt](/path)
for (const m of postsSrc.matchAll(/(?<!!)\[[^\]]*\]\((\/[^)]+)\)/g)) {
  if (!validInternal(m[1])) errors.push(`posts.ts: broken markdown link (${m[1]})`)
}
// Inline blog images ![alt](/path) — verify the file exists in public/
for (const m of postsSrc.matchAll(/!\[[^\]]*\]\((\/[^)]+)\)/g)) {
  if (!existsSync(join(ROOT, "public", m[1].replace(/^\//, "")))) {
    errors.push(`posts.ts: missing image file public${m[1]}`)
  }
}
const cc = read("src/data/category-content.ts")
for (const block of cc.matchAll(/relatedBlogSlugs:\s*\[([^\]]*)\]/g)) {
  for (const m of block[1].matchAll(/"([^"]+)"/g)) {
    if (!postSlugs.has(m[1])) errors.push(`category-content relatedBlogSlugs: unknown post "${m[1]}"`)
  }
}
for (const block of cc.matchAll(/relatedCategories:\s*\[([^\]]*)\]/g)) {
  for (const m of block[1].matchAll(/"([^"]+)"/g)) {
    if (!catSlugs.has(m[1])) errors.push(`category-content relatedCategories: unknown category "${m[1]}"`)
  }
}

// ── 4. No localhost / vercel.app in production source ─────────────────────
for (const f of walk("src", [".tsx", ".ts"])) {
  if (/localhost|sulitscan\.vercel\.app/.test(read(f))) {
    errors.push(`${f}: contains localhost or sulitscan.vercel.app`)
  }
}

// ── 5. Affiliate link components carry the required rel ───────────────────
const REL = "sponsored nofollow noopener noreferrer"
for (const f of [
  "src/components/DealCard.tsx",
  "src/components/ExternalAffiliateLink.tsx",
  "src/components/StoreCard.tsx",
  "src/components/PartnerBanners.tsx",
]) {
  if (!read(f).includes(REL)) errors.push(`${f}: missing rel="${REL}"`)
}

// ── Report ────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`\n✗ check-links FAILED — ${errors.length} issue(s):`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log(
  `✓ check-links passed — ${dealSlugs.length} deals, ${catSlugs.size} categories, ` +
    `${storeSlugs.size} stores, ${postSlugs.size} posts. ` +
    `All internal links resolve, all affiliate URLs valid, rel attributes present.`
)
