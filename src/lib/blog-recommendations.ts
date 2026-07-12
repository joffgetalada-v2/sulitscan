import type { BlogPost } from "@/data/posts"
import type { Deal } from "@/data/deals"
import { getActiveDeals, isSuspiciousDiscount } from "@/data/deals"

const categorySignals: Array<{ pattern: RegExp; categories: string[] }> = [
  { pattern: /home|organization|desk|work-from-home/, categories: ["Home", "Outdoor"] },
  { pattern: /beauty|skincare|makeup/, categories: ["Beauty", "Skincare"] },
  { pattern: /phone|tech|charger|accessor/, categories: ["Electronics"] },
  { pattern: /gift/, categories: ["Home", "Beauty", "Skincare", "Fashion"] },
]

export function getRelatedDealsForPost(post: BlogPost, count = 3): Deal[] {
  const normalizedCount = Number.isFinite(count)
    ? Math.min(3, Math.max(0, Math.floor(count)))
    : 0
  const topic = `${post.slug} ${post.title} ${post.tags.join(" ")}`.toLowerCase()
  const postTags = new Set(post.tags.map((tag) => tag.toLowerCase()))

  return getActiveDeals()
    .filter((deal) => !isSuspiciousDiscount(deal))
    .map((deal) => {
      let score = deal.tags.filter((tag) => postTags.has(tag.toLowerCase())).length * 3
      for (const signal of categorySignals) {
        if (signal.pattern.test(topic) && signal.categories.includes(deal.category)) score += 4
      }
      if (/under-500/.test(topic) && deal.salePrice < 500) score += 5
      if (/under-1000/.test(topic) && deal.salePrice < 1000) score += 5
      if (/shopee/.test(topic) && deal.platform === "Shopee PH") score += 3
      if (/temu/.test(topic) && deal.platform === "Temu") score += 3
      if (/sephora/.test(topic) && deal.platform === "Sephora PH") score += 3
      if (/gift/.test(topic) && deal.sulitScore >= 8) score += 2
      return { deal, score }
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
