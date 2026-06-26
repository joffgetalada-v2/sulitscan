#!/usr/bin/env node
// SulitScan affiliate-product guard (dependency-free, static analysis).
// Run: npm run check:affiliate-products
//
// Validates every deal in src/data/deals.ts, with stricter rules for PUBLISHED
// (active) deals — those whose platform is active AND that have an image, since
// only those are rendered and indexed (see getActiveDeals).
//
// All deals:      unique slug, non-empty title, category, lastChecked,
//                 https affiliate link (no placeholder/empty/#/localhost),
//                 imageUrl https when present.
// Published only: title contains no prohibited / unsafe keyword.
//
// Fails the build (exit 1) on any violation.

import { readFileSync } from "node:fs"

const src = readFileSync("src/data/deals.ts", "utf8")
const errors = []

// Active platforms, kept in sync with deals.ts.
const ACTIVE = new Set(
  [...(src.match(/ACTIVE_PLATFORMS = new Set\(\[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1])
)

// Deal objects are single-level (tags use [] not {}), so brace-matching works.
const region = src.slice(src.indexOf("= [", src.indexOf("export const deals")), src.indexOf("const ACTIVE_PLATFORMS"))
const objs = (region.match(/\{[^{}]+\}/g) ?? []).filter((o) => /\bslug:\s*"/.test(o))

const field = (b, k) => {
  const m = b.match(new RegExp(`\\b${k}:\\s*"([^"]*)"`))
  return m ? m[1] : null
}

// Unambiguous prohibitions (kept tight to avoid flagging legit cosmetics/tools).
const PROHIBITED = /\b(supplement|glutathione|\bgluta\b|collagen drink|weight ?loss|slimming|diet pills?|vape|e-?cig|cigarette|tobacco|nicotine|liquor|airsoft|\bweapon|\bcondom|lubricant|casino|\breplica\b|counterfeit)\b/i
const BAD_AFF = /^$|^#$|example\.com|placeholder|localhost|vercel\.app|\/todo\b/i

const slugs = new Set()
let total = 0, published = 0
for (const b of objs) {
  total++
  const slug = field(b, "slug")
  const title = field(b, "title")
  const aff = field(b, "affiliateLink")
  const cat = field(b, "category")
  const last = field(b, "lastChecked")
  const img = field(b, "imageUrl")
  const platform = field(b, "platform")
  const where = slug || title || `deal #${total}`

  if (!slug) errors.push(`${where}: missing slug`)
  else if (slugs.has(slug)) errors.push(`Duplicate slug: ${slug}`)
  else slugs.add(slug)

  if (!title || !title.trim()) errors.push(`${where}: empty title`)
  if (!cat) errors.push(`${where}: missing category`)
  if (!last) errors.push(`${where}: missing lastChecked`)
  if (!aff || !/^https:\/\/\S+/.test(aff) || BAD_AFF.test(aff)) errors.push(`${where}: invalid affiliateLink "${aff ?? ""}"`)
  if (img && !/^https:\/\/\S+/.test(img)) errors.push(`${where}: imageUrl not https "${img}"`)

  // Published = active platform AND has an image (matches getActiveDeals).
  const isPublished = ACTIVE.has(platform ?? "") && !!img
  if (isPublished) {
    published++
    if (title && PROHIBITED.test(title)) errors.push(`${where}: prohibited keyword in PUBLISHED title "${title}"`)
  }
}

if (errors.length) {
  console.error(`\n✗ check-affiliate-products FAILED — ${errors.length} issue(s):`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log(`✓ check-affiliate-products passed — ${total} deals (${published} published): unique slugs, valid https affiliate links, no prohibited keywords in published titles.`)
