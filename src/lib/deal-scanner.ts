import type { Deal } from "@/data/deals"
import { getDealFreshness } from "@/lib/deal-freshness"

export interface DealScannerSlide {
  slug: string
  title: string
  category: string
  imageGradient: string
  imageUrl: string | null
  originalPrice: number
  salePrice: number
  discount: number
  sulitScore: number
  freshnessStatus: "current" | "reference"
}

// Only the server calls this selector. The client receives these display fields,
// not the registry, affiliate destinations, editorial notes, or source dates.
export function getDealScannerSlides(deals: Deal[], limit = 6, now = new Date()): DealScannerSlide[] {
  const cap = Number.isFinite(limit) ? Math.max(0, Math.min(6, Math.floor(limit))) : 6
  const slides: DealScannerSlide[] = []
  const seen = new Set<string>()
  for (const deal of deals) {
    if (slides.length >= cap) break
    const freshnessStatus = getDealFreshness(deal.lastChecked, now).status
    if (deal.isDemo || freshnessStatus === "expired" || seen.has(deal.category)) continue
    seen.add(deal.category)
    slides.push({
      slug: deal.slug, title: deal.title, category: deal.category,
      imageGradient: deal.imageGradient, imageUrl: deal.imageUrl ?? null,
      originalPrice: deal.originalPrice, salePrice: deal.salePrice,
      discount: deal.discount, sulitScore: deal.sulitScore, freshnessStatus,
    })
  }
  return slides
}
