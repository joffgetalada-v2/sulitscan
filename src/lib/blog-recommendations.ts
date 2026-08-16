import type { BlogPost } from "@/data/posts"
import { posts } from "@/data/posts"
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

// Evergreen guides that are useful on any deal page, used to top up when a
// deal has too few editorially matched guides.
const FALLBACK_GUIDE_SLUGS = [
  "voucher-shipping-return-checklist",
  "how-to-spot-fake-discounts",
  "how-sulitscan-checks-deals",
]

/**
 * Inverse of getRelatedDealsForPost: find the guides whose editorial
 * recommendation intent matches this deal, so deal pages can link back into
 * relevant blog content. Reuses the same intent data, so new guides start
 * appearing on matching deal pages automatically.
 */
export function getRelatedGuidesForDeal(deal: Deal, count = 2): BlogPost[] {
  const normalizedCount = Number.isFinite(count)
    ? Math.min(3, Math.max(0, Math.floor(count)))
    : 0
  if (normalizedCount === 0) return []

  const dealTags = new Set(deal.tags.map((tag) => tag.toLowerCase()))

  const matched = posts
    .map((post) => {
      const recommendationIntent = post.recommendationIntent
      const dealIntent = recommendationIntent?.deals
      if (!dealIntent) return { post, score: 0 }

      const tagMatches = dealIntent.tags.filter((tag) => dealTags.has(tag.toLowerCase())).length
      const categoryEligible =
        !dealIntent.categories || dealIntent.categories.length === 0 || dealIntent.categories.includes(deal.category)
      const platformEligible =
        !recommendationIntent.platforms ||
        recommendationIntent.platforms.length === 0 ||
        (recommendationIntent.platforms as string[]).includes(deal.platform)
      const priceEligible = dealIntent.maxPrice === undefined || deal.salePrice <= dealIntent.maxPrice
      const eligible = tagMatches > 0 && categoryEligible && platformEligible && priceEligible
      return {
        post,
        score: eligible ? tagMatches * 6 + (platformEligible && recommendationIntent.platforms ? 3 : 0) : 0,
      }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.post.slug.localeCompare(b.post.slug))
    .map(({ post }) => post)

  const result = matched.slice(0, normalizedCount)
  if (result.length < normalizedCount) {
    const seen = new Set(result.map((post) => post.slug))
    for (const slug of FALLBACK_GUIDE_SLUGS) {
      if (result.length >= normalizedCount) break
      const fallback = posts.find((post) => post.slug === slug)
      if (fallback && !seen.has(fallback.slug)) {
        result.push(fallback)
        seen.add(fallback.slug)
      }
    }
  }
  return result
}
