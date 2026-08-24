import type { Deal } from "@/data/deals"
import { isSuspiciousDiscount } from "@/data/deals"

/**
 * Server-side pre-filter for the Sulit Assistant: turns a free-text shopper
 * question (English or Taglish) into the small set of catalog deals worth
 * showing the model. The whole catalog is never sent to the API.
 */

export const MAX_CONTEXT_DEALS = 10

export interface DealQuery {
  tokens: string[]
  maxPrice?: number
  minPrice?: number
}

export interface ScoredDeal {
  deal: Deal
  score: number
}

// Words that carry no product signal in either language.
const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "for", "of", "to", "in", "on", "and", "or",
  "with", "me", "my", "i", "you", "may", "meron", "mayroon", "ba", "na", "pa",
  "po", "ang", "ng", "sa", "mga", "yung", "ung", "para", "kay", "ako", "mo",
  "ko", "siya", "niya", "ito", "yan", "lang", "din", "rin", "naman", "kaya",
  "any", "some", "what", "whats", "which", "best", "good", "sulit", "deal",
  "deals", "mura", "cheap", "affordable", "budget", "recommend", "suggest",
  "looking", "hanap", "find", "pls", "please", "help", "want", "need", "gusto",
])

// Taglish / everyday phrasing → catalog vocabulary (tags, categories, titles).
// Values are extra search tokens, matched against the same searchable text.
const SYNONYMS: Record<string, string[]> = {
  regalo: ["gift"],
  pangregalo: ["gift"],
  pasalubong: ["gift"],
  gift: ["gift"],
  gifts: ["gift"],
  // Recipient words map to the curated gift tag only: product gender tags
  // (women/men) also cover apparel that makes for awkward gift suggestions.
  nanay: ["gift"],
  mama: ["gift"],
  mommy: ["gift"],
  mom: ["gift"],
  tatay: ["gift"],
  papa: ["gift"],
  daddy: ["gift"],
  dad: ["gift"],
  kusina: ["kitchen"],
  luto: ["kitchen", "cookware"],
  bahay: ["home"],
  bag: ["bag"],
  bags: ["bag"],
  wallet: ["wallet"],
  sapatos: ["shoes"],
  shoes: ["shoes"],
  tsinelas: ["sandals"],
  slippers: ["sandals"],
  damit: ["fashion", "women", "men"],
  clothes: ["fashion"],
  skincare: ["skincare"],
  makeup: ["makeup"],
  brush: ["brush"],
  pabango: ["fragrance", "perfume"],
  perfume: ["fragrance", "perfume"],
  gadget: ["electronics", "tools"],
  gadgets: ["electronics", "tools"],
  cellphone: ["phone"],
  organizer: ["organizer", "storage"],
  storage: ["storage", "organizer"],
  imis: ["organizer", "storage"],
  travel: ["travel", "luggage"],
  biyahe: ["travel"],
  maleta: ["luggage", "travel"],
  luggage: ["luggage", "travel"],
  office: ["office", "desk"],
  opisina: ["office", "desk"],
  desk: ["desk", "office"],
  outdoor: ["outdoor", "garden"],
  halaman: ["garden"],
  garden: ["garden"],
  tubig: ["tumbler", "bottle"],
  inumin: ["tumbler", "bottle"],
}

// "under 500", "below ₱1,000", "500 pesos pababa", "hanggang 300", "₱500 budget"
const MAX_PRICE_PATTERNS = [
  /(?:under|below|less than|up to|hanggang|max(?:imum)?|budget(?: na| of)?|pababa ng)\s*(?:php|₱|p)?\s*([\d,]+)/i,
  /(?:php|₱|p)?\s*([\d,]+)\s*(?:pesos?)?\s*(?:pababa|below|down|or less|max)/i,
]
const MIN_PRICE_PATTERNS = [
  /(?:over|above|more than|at least|mahigit|pataas ng)\s*(?:php|₱|p)?\s*([\d,]+)/i,
]

function parseAmount(raw: string): number | undefined {
  const value = Number(raw.replace(/,/g, ""))
  return Number.isFinite(value) && value > 0 && value < 1_000_000 ? value : undefined
}

export function parseDealQuery(message: string): DealQuery {
  const query: DealQuery = { tokens: [] }
  for (const pattern of MAX_PRICE_PATTERNS) {
    const match = message.match(pattern)
    if (match) {
      query.maxPrice = parseAmount(match[1])
      if (query.maxPrice !== undefined) break
    }
  }
  for (const pattern of MIN_PRICE_PATTERNS) {
    const match = message.match(pattern)
    if (match) {
      query.minPrice = parseAmount(match[1])
      if (query.minPrice !== undefined) break
    }
  }

  const words = message
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word) && !/^\d+$/.test(word))

  const expanded = new Set<string>()
  for (const word of words) {
    expanded.add(word)
    // "pang-kusina" carries its signal in the root word after the prefix, so
    // index hyphen-separated parts (and the joined form) alongside the whole.
    const variants = new Set([word, word.replace(/-/g, ""), ...word.split("-").filter((part) => part.length > 1)])
    for (const variant of variants) {
      if (!STOPWORDS.has(variant)) expanded.add(variant)
      for (const synonym of SYNONYMS[variant] ?? []) expanded.add(synonym)
    }
  }
  query.tokens = [...expanded]
  return query
}

/**
 * Filter and rank deals for one question. Hard constraints: price range and
 * the site's own suspicious-discount exclusion. Soft ranking: keyword hits
 * weighted by where they match, then SulitScore, then price.
 */
export function searchDeals(activeDeals: Deal[], message: string): ScoredDeal[] {
  const query = parseDealQuery(message)

  const candidates = activeDeals.filter((deal) => {
    if (isSuspiciousDiscount(deal)) return false
    if (query.maxPrice !== undefined && deal.salePrice > query.maxPrice) return false
    if (query.minPrice !== undefined && deal.salePrice < query.minPrice) return false
    return true
  })

  const scored = candidates
    .map((deal) => {
      const tags = new Set(deal.tags.map((tag) => tag.toLowerCase()))
      const title = deal.title.toLowerCase()
      const rest = `${deal.category} ${deal.platform}`.toLowerCase()
      let score = 0
      for (const token of query.tokens) {
        if (tags.has(token)) score += 4
        else if ([...tags].some((tag) => tag.includes(token))) score += 3
        if (title.includes(token)) score += 2
        if (rest.includes(token)) score += 1
      }
      return { deal, score }
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.deal.sulitScore - a.deal.sulitScore ||
        a.deal.salePrice - b.deal.salePrice
    )

  // A price-only question ("may sulit ba under 300?") has no keyword tokens;
  // fall back to the best-scored deals inside the price constraint.
  if (scored.length === 0 && query.tokens.length === 0 && (query.maxPrice !== undefined || query.minPrice !== undefined)) {
    return candidates
      .slice()
      .sort((a, b) => b.sulitScore - a.sulitScore || a.salePrice - b.salePrice)
      .slice(0, MAX_CONTEXT_DEALS)
      .map((deal) => ({ deal, score: 1 }))
  }

  return scored.slice(0, MAX_CONTEXT_DEALS)
}

/** Compact, model-facing description of one deal. Only fields the assistant may repeat. */
export function dealToContextLine(deal: Deal): string {
  const reason = deal.reason.length > 140 ? `${deal.reason.slice(0, 137)}...` : deal.reason
  return JSON.stringify({
    title: deal.title,
    url: `/deals/${deal.slug}`,
    referencePricePhp: deal.salePrice,
    category: deal.category,
    store: deal.platform,
    sulitScore: `${deal.sulitScore}/10`,
    note: reason,
  })
}
