import type { BlogPost } from "@/data/posts"
import type { Deal } from "@/data/deals"
import { getActiveDeals, isSuspiciousDiscount } from "@/data/deals"

export function getRelatedDealsForPost(post: BlogPost, count = 3): Deal[] {
  const normalizedCount = Number.isFinite(count)
    ? Math.min(3, Math.max(0, Math.floor(count)))
    : 0
  const recommendationIntent = post.recommendationIntent
  const dealIntent = recommendationIntent?.deals
  if (!dealIntent || normalizedCount === 0) return []

  const eligibleCategories = new Set(dealIntent.categories ?? [])
  const eligibleTags = new Set(dealIntent.tags.map((tag) => tag.toLowerCase()))
  const eligiblePlatforms = new Set<string>(recommendationIntent.platforms ?? [])

  return getActiveDeals()
    .filter((deal) => !isSuspiciousDiscount(deal))
    .map((deal) => {
      const tagMatches = deal.tags.filter((tag) => eligibleTags.has(tag.toLowerCase())).length
      const categoryEligible = eligibleCategories.size === 0 || eligibleCategories.has(deal.category)
      const platformEligible = eligiblePlatforms.size === 0 || eligiblePlatforms.has(deal.platform)
      const priceEligible = dealIntent.maxPrice === undefined || deal.salePrice <= dealIntent.maxPrice
      const eligible = tagMatches > 0 && categoryEligible && platformEligible && priceEligible
      return {
        deal,
        score: eligible
          ? tagMatches * 6 + (eligibleCategories.size > 0 ? 2 : 0) + (eligiblePlatforms.size > 0 ? 3 : 0)
          : 0,
      }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) =>
      b.score - a.score ||
      b.deal.sulitScore - a.deal.sulitScore ||
      a.deal.salePrice - b.deal.salePrice
    )
    .slice(0, normalizedCount)
    .map(({ deal }) => deal)
}
