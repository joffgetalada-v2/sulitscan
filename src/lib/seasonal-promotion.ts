export interface SeasonalPromotion {
  slug: string
  href: string
  announcement: string
}

const campaignStart = Date.parse("2026-08-31T16:00:00.000Z")
const campaignEnd = Date.parse("2026-09-10T15:59:59.999Z")

const campaign: Readonly<SeasonalPromotion> = Object.freeze({
  slug: "shopee-9-9-sale-philippines-2026-checklist",
  href: "/blog/shopee-9-9-sale-philippines-2026-checklist",
  announcement: "9.9 checkout checklist: compare the final total →",
})

export function getSeasonalPromotion(now: Date = new Date()): SeasonalPromotion | undefined {
  const timestamp = now.getTime()
  if (timestamp < campaignStart || timestamp > campaignEnd) return undefined

  return Object.freeze({ ...campaign })
}

function normalizeCount(count: number | undefined): number {
  if (count === undefined) return 3
  if (!Number.isFinite(count)) return 0
  return Math.max(0, Math.floor(count))
}

export function getPromotedPosts<T extends { slug: string }>(
  orderedPosts: T[],
  now: Date = new Date(),
  count?: number
): T[] {
  const normalizedCount = normalizeCount(count)
  if (normalizedCount === 0) return []

  const promotion = getSeasonalPromotion(now)
  const promotedPost = promotion
    ? orderedPosts.find((post) => post.slug === promotion.slug)
    : undefined

  if (!promotion || !promotedPost) return orderedPosts.slice(0, normalizedCount)

  return [
    promotedPost,
    ...orderedPosts.filter((post) => post.slug !== promotion.slug),
  ].slice(0, normalizedCount)
}
