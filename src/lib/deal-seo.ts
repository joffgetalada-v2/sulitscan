import { getActiveDeals, type Deal } from "@/data/deals"

const SITE_SUFFIX = " | SulitScan PH"
const TITLE_LIMIT = 65
const DESCRIPTION_LIMIT = 160

function truncateAtWordBoundary(text: string, limit: number): string {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (normalized.length <= limit) return normalized

  const words = normalized.split(" ")
  const phrase: string[] = []
  for (const word of words) {
    const candidate = [...phrase, word].join(" ")
    if (candidate.length <= limit) {
      phrase.push(word)
    } else if (phrase.length > 0) {
      break
    }
  }

  return phrase.join(" ") || "Item"
}

function cleanTitlePhrase(text: string): string {
  return text.replace(/[\s\-–—|:;,./\\!?()[\]{}"']+$/gu, "").trim() || "Item"
}

function buildTitlePhrase(text: string, limit: number): string {
  return cleanTitlePhrase(truncateAtWordBoundary(text, limit))
}

function stableHash(value: string): string {
  let hash = 5381
  for (const character of value) hash = (hash * 33) ^ character.charCodeAt(0)
  return (hash >>> 0).toString(36).slice(-4)
}

function buildTitleWithoutHash(deal: Deal): string {
  const phraseLimit = TITLE_LIMIT - SITE_SUFFIX.length - deal.platform.length - 3
  return `${buildTitlePhrase(deal.title, phraseLimit)} – ${deal.platform}${SITE_SUFFIX}`
}

function getTitleCollisions(deal: Deal): Deal[] {
  const title = buildTitleWithoutHash(deal)
  return getActiveDeals()
    .filter((candidate) => buildTitleWithoutHash(candidate) === title)
    .sort((a, b) => a.slug.localeCompare(b.slug))
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
  const collisions = getTitleCollisions(deal)
  if (collisions.length < 2) return buildTitleWithoutHash(deal)

  const hash = stableHash(deal.slug)
  const sameHashDeals = collisions.filter((candidate) => stableHash(candidate.slug) === hash)
  const hashRank = sameHashDeals.findIndex((candidate) => candidate.slug === deal.slug)
  const hashSuffix = ` #${hash}${sameHashDeals.length > 1 ? `-${hashRank + 1}` : ""}`
  const phraseLimit = TITLE_LIMIT - SITE_SUFFIX.length - deal.platform.length - 3 - hashSuffix.length
  return `${buildTitlePhrase(deal.title, phraseLimit)}${hashSuffix} – ${deal.platform}${SITE_SUFFIX}`
}

export function buildDealSeoDescription(deal: Deal): string {
  if (!hasDescriptionCollision(deal)) return buildDescriptionWithoutHash(deal)

  const hashSuffix = ` (${stableHash(deal.slug)})`
  const buyerNote = `Practical ${deal.category.toLowerCase()} pick for shoppers`
  const ending = ` on ${deal.platform}: ${buyerNote}. Confirm current price, shipping, and availability before buying.`
  return `${truncateAtWordBoundary(deal.title, DESCRIPTION_LIMIT - ending.length - hashSuffix.length)}${hashSuffix}${ending}`
}
