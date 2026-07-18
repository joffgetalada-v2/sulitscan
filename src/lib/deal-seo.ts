import { getActiveDeals, type Deal } from "@/data/deals"

const SITE_SUFFIX = " | SulitScan PH"
const TITLE_LIMIT = 65
const DESCRIPTION_LIMIT = 160

function truncateAtWordBoundary(text: string, limit: number): string {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (normalized.length <= limit) return normalized

  const candidate = normalized.slice(0, limit + 1)
  const lastSpace = candidate.lastIndexOf(" ")
  return (lastSpace > 0 ? candidate.slice(0, lastSpace) : normalized.slice(0, limit)).trim()
}

function stableHash(value: string): string {
  let hash = 5381
  for (const character of value) hash = (hash * 33) ^ character.charCodeAt(0)
  return (hash >>> 0).toString(36).slice(0, 4)
}

function buildTitleWithoutHash(deal: Deal): string {
  const phraseLimit = TITLE_LIMIT - SITE_SUFFIX.length - deal.platform.length - 3
  return `${truncateAtWordBoundary(deal.title, phraseLimit)} – ${deal.platform}${SITE_SUFFIX}`
}

function hasTitleCollision(deal: Deal): boolean {
  const title = buildTitleWithoutHash(deal)
  return getActiveDeals().filter((candidate) => buildTitleWithoutHash(candidate) === title).length > 1
}

function buildDescriptionWithoutHash(deal: Deal): string {
  const buyerNote = `Practical ${deal.category.toLowerCase()} pick for shoppers`
  const ending = ` on ${deal.platform}: ${buyerNote}. Confirm current price, shipping, and availability before buying.`
  return `${truncateAtWordBoundary(deal.title, DESCRIPTION_LIMIT - ending.length)}${ending}`
}

function hasDescriptionCollision(deal: Deal): boolean {
  const description = buildDescriptionWithoutHash(deal)
  return getActiveDeals().filter((candidate) => buildDescriptionWithoutHash(candidate) === description).length > 1
}

export function buildDealSeoTitle(deal: Deal): string {
  if (!hasTitleCollision(deal)) return buildTitleWithoutHash(deal)

  const hashSuffix = ` #${stableHash(deal.slug)}`
  const phraseLimit = TITLE_LIMIT - SITE_SUFFIX.length - deal.platform.length - 3 - hashSuffix.length
  return `${truncateAtWordBoundary(deal.title, phraseLimit)}${hashSuffix} – ${deal.platform}${SITE_SUFFIX}`
}

export function buildDealSeoDescription(deal: Deal): string {
  if (!hasDescriptionCollision(deal)) return buildDescriptionWithoutHash(deal)

  const hashSuffix = ` (${stableHash(deal.slug)})`
  const buyerNote = `Practical ${deal.category.toLowerCase()} pick for shoppers`
  const ending = ` on ${deal.platform}: ${buyerNote}. Confirm current price, shipping, and availability before buying.`
  return `${truncateAtWordBoundary(deal.title, DESCRIPTION_LIMIT - ending.length - hashSuffix.length)}${hashSuffix}${ending}`
}
