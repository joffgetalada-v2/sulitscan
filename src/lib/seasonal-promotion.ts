export interface SeasonalPromotion {
  slug: string
  href: string
  announcement: string
}

const campaigns = [
  {
    start: Date.parse("2026-10-02T16:00:00.000Z"),
    end: Date.parse("2026-10-10T15:59:59.999Z"),
    promotion: Object.freeze({
      slug: "10-10-sale-philippines-guide",
      href: "/blog/10-10-sale-philippines-guide",
      announcement: "10.10 checkout guide: compare the final total →",
    }),
  },
  {
    start: Date.parse("2026-10-24T16:00:00.000Z"),
    end: Date.parse("2026-11-11T15:59:59.999Z"),
    promotion: Object.freeze({
      slug: "11-11-sale-philippines-cart-building-checklist",
      href: "/blog/11-11-sale-philippines-cart-building-checklist",
      announcement: "11.11 cart checklist: set your baseline first →",
    }),
  },
] as const

export function getSeasonalPromotion(now: Date = new Date()): SeasonalPromotion | undefined {
  const timestamp = now.getTime()
  if (!Number.isFinite(timestamp)) return undefined

  // Ordered selection makes the first matching campaign win if windows overlap.
  const campaign = campaigns.find(({ start, end }) => timestamp >= start && timestamp <= end)
  return campaign ? Object.freeze({ ...campaign.promotion }) : undefined
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

  const seen = new Set<string>()
  const uniquePosts = orderedPosts.filter((post) => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)
    return true
  })
  const promotion = getSeasonalPromotion(now)
  const promotedPost = promotion
    ? uniquePosts.find((post) => post.slug === promotion.slug)
    : undefined

  if (!promotion || !promotedPost) return uniquePosts.slice(0, normalizedCount)

  return [
    promotedPost,
    ...uniquePosts.filter((post) => post.slug !== promotion.slug),
  ].slice(0, normalizedCount)
}
