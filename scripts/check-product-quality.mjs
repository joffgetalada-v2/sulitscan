#!/usr/bin/env node
// SulitScan product-quality guard (dependency-free, static analysis).
// Run: npm run check:product-quality
//
// Complements check-affiliate-products. Focuses on PUBLISHED (active + image)
// deals, since only those are rendered and indexed (see getActiveDeals).
//
// HARD FAILS (exit 1): a published deal with an empty title, missing reason,
//   missing category / lastChecked / affiliateLink / imageUrl, a discount
//   outside 0..100, or a SulitScore outside 1..10.
//
// WARNINGS (exit 0, informational): suspiciously high listed discounts (80%+,
//   which the UI demotes from featured / Top Picks and softens), very long
//   titles (90+ chars), and unverified material / health claims left in a title.
//
// Warnings never fail the build; they surface things worth a human glance.

import { readFileSync } from "node:fs"

const src = readFileSync("src/data/deals.ts", "utf8")
const errors = []
const warnings = []

// Active platforms + suspicious-discount threshold, kept in sync with deals.ts.
const ACTIVE = new Set(
  [...(src.match(/ACTIVE_PLATFORMS = new Set\(\[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1])
)
const SUSPICIOUS_DISCOUNT = Number(src.match(/SUSPICIOUS_DISCOUNT\s*=\s*(\d+)/)?.[1] ?? 80)

// Deal objects are single-level (tags use [] not {}), so brace-matching works.
const region = src.slice(src.indexOf("= [", src.indexOf("export const deals")), src.indexOf("const ACTIVE_PLATFORMS"))
const objs = (region.match(/\{[^{}]+\}/g) ?? []).filter((o) => /\bslug:\s*"/.test(o))

const str = (b, k) => {
  const m = b.match(new RegExp(`\\b${k}:\\s*"([^"]*)"`))
  return m ? m[1] : null
}
const num = (b, k) => {
  const m = b.match(new RegExp(`\\b${k}:\\s*(-?\\d+(?:\\.\\d+)?)`))
  return m ? Number(m[1]) : null
}

// Unverifiable material / authenticity / health claims that should not sit in a title.
const RISKY_CLAIM = /\b(genuine leather|real leather|100% leather|authentic branded|whitening|slimming|weight ?loss|cures?|medical grade|anti-?aging miracle)\b/i

let total = 0, published = 0, suspicious = 0, longTitles = 0
for (const b of objs) {
  total++
  const slug = str(b, "slug")
  const title = str(b, "title")
  const reason = str(b, "reason")
  const cat = str(b, "category")
  const last = str(b, "lastChecked")
  const aff = str(b, "affiliateLink")
  const img = str(b, "imageUrl")
  const platform = str(b, "platform")
  const discount = num(b, "discount")
  const score = num(b, "sulitScore")
  const where = slug || title || `deal #${total}`

  // Published = active platform AND has an image (matches getActiveDeals).
  const isPublished = ACTIVE.has(platform ?? "") && !!img
  if (!isPublished) continue
  published++

  // Hard invariants for anything we actually render.
  if (!title || !title.trim()) errors.push(`${where}: empty title`)
  if (!reason || !reason.trim()) errors.push(`${where}: missing reason / buyer note`)
  if (!cat) errors.push(`${where}: missing category`)
  if (!last) errors.push(`${where}: missing lastChecked`)
  if (!aff) errors.push(`${where}: missing affiliateLink`)
  if (discount === null || discount < 0 || discount > 100) errors.push(`${where}: discount out of range (${discount})`)
  if (score === null || score < 1 || score > 10) errors.push(`${where}: sulitScore out of range (${score})`)

  // Informational warnings.
  if (discount !== null && discount >= SUSPICIOUS_DISCOUNT) {
    suspicious++
    warnings.push(`${where}: high listed discount ${discount}% (demoted from featured/Top Picks, badge softened)`)
  }
  if (title && title.length > 90) {
    longTitles++
    warnings.push(`${where}: long title (${title.length} chars)`)
  }
  if (title && RISKY_CLAIM.test(title)) warnings.push(`${where}: unverified claim in title "${title}"`)
}

if (warnings.length) {
  console.log(`\nℹ check-product-quality notes (${warnings.length}), informational, not blocking:`)
  for (const w of warnings) console.log(`  • ${w}`)
}

if (errors.length) {
  console.error(`\n✗ check-product-quality FAILED: ${errors.length} issue(s):`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log(`\n✓ check-product-quality passed: ${published} published deals, required fields present, discounts and scores in range. ${suspicious} suspicious discount(s) and ${longTitles} long title(s) flagged for review.`)
