import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, ArrowLeft, Clock, Star, Tag, ShieldCheck, AlertCircle, CheckCircle, MinusCircle } from "lucide-react"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { getActiveDeals, getDealBySlug, getFeaturedDeals } from "@/data/deals"
import { ExternalAffiliateLink } from "@/components/ExternalAffiliateLink"
import DealCard from "@/components/DealCard"
import { siteConfig } from "@/lib/seo"
import { formatPrice, getSulitScoreBg, getSulitScoreLabel, formatTag, clampMeta } from "@/lib/utils"

function getBuyerChecklist(deal: { platform: string; category: string }): string[] {
  const cat = deal.category.toLowerCase()
  const isTemu = deal.platform === "Temu"
  const isSephora = deal.platform === "Sephora PH"
  const isShopee = deal.platform === "Shopee PH"
  const isBeauty = ["beauty", "skincare", "makeup", "fragrance", "haircare", "hair care"].some((c) => cat.includes(c))
  const isFashion = ["fashion", "clothing", "shoes", "accessories"].some((c) => cat.includes(c))
  const isElectronics = ["electronics", "gadgets", "tech"].some((c) => cat.includes(c))
  const isHome = ["home", "kitchen", "outdoor"].some((c) => cat.includes(c))

  const base = [
    `Confirm the current price on ${deal.platform} — prices from SulitScan may not match the current price.`,
    "Look for available platform vouchers, loyalty points, or first-order discounts.",
  ]

  if (isShopee) {
    return [
      ...base,
      "Check the seller rating and read recent buyer reviews with photos before ordering.",
      "Look for Shopee vouchers, coins, and free-shipping promos that can lower your total.",
      "Confirm the shipping fee and estimated delivery time for your address.",
      "Check the seller's return and refund policy before buying.",
      "For branded items, prefer Shopee Mall or Preferred/Official sellers to avoid replicas.",
    ]
  }

  if (isBeauty || isSephora) {
    return [
      ...base,
      "Check the ingredient list for known allergens or sensitivities.",
      "Confirm the shade, variant, or product size you want is in stock on Sephora PH.",
      "Patch test skincare on a small area before full use.",
      "Confirm the return policy — opened beauty products are generally non-returnable.",
      "Check official product details and claims on Sephora PH before buying.",
    ]
  }

  if (isFashion) {
    return [
      ...base,
      isTemu ? "Check the size guide in centimeters — Temu clothing and shoes often run smaller than labeled." : "Confirm your size and variant are available.",
      "Read buyer reviews for fit, material, and quality — look for photos from reviewers.",
      "Confirm return and exchange terms before ordering.",
      "Check dimensions, material, and construction in product photos.",
    ]
  }

  if (isElectronics) {
    return [
      ...base,
      "Check compatibility with your device or setup before ordering.",
      "Confirm voltage, charging specs, and plug type work in the Philippines.",
      "Read buyer reviews for battery life, durability, and real-world performance.",
      "Confirm what accessories are included in the package.",
      isTemu ? "Check the estimated delivery date — Temu ships internationally (7–20 business days to PH)." : "Confirm shipping cost and delivery estimate.",
    ]
  }

  if (isHome) {
    return [
      ...base,
      "Check exact dimensions — confirm the item fits your space before ordering.",
      "Read buyer reviews with photos for material quality and build.",
      "Confirm whether tools or assembly are required.",
      isTemu ? "Check the estimated delivery date — Temu ships internationally (7–20 business days to PH)." : "Confirm shipping cost and delivery estimate.",
      "Check return policy if the item arrives damaged or doesn't fit.",
    ]
  }

  return [
    ...base,
    isTemu ? "Check the size guide if ordering clothing or shoes — Temu sizing often runs smaller than stated." : "Confirm shade, size, or variant availability on Sephora PH.",
    "Read buyer reviews on the partner store for real-world quality and fit.",
    isTemu ? "Check the estimated delivery date — Temu ships internationally (7–20 business days to PH)." : "Confirm shipping cost — free standard shipping on Sephora PH orders ₱1,500+.",
    "Check if the product dimensions, materials, or specs match your needs.",
    "Read the return and refund policy before completing your purchase.",
  ]
}

// Honest, category-based guidance — helps a buyer self-select (no invented claims).
function getBestForSkipIf(deal: { category: string }): { bestFor: string[]; skipIf: string[] } {
  const cat = deal.category.toLowerCase()
  if (["beauty", "skincare", "makeup", "fragrance"].some((c) => cat.includes(c)))
    return {
      bestFor: ["Basic beauty routines and everyday tools", "Trying a product before a full-size buy", "Giftable beauty picks"],
      skipIf: ["You have sensitive skin and can't patch test first", "You need verified authenticity for a specific brand", "You can't confirm the return policy"],
    }
  if (["electronics", "tech", "gadgets"].some((c) => cat.includes(c)))
    return {
      bestFor: ["Work-from-home and desk setups", "Everyday phone, cable, and accessory needs", "Low-stakes upgrades on a budget"],
      skipIf: ["You need manufacturer warranty support", "You need verified brand authenticity", "You need it delivered urgently"],
    }
  if (["home", "kitchen", "outdoor"].some((c) => cat.includes(c)))
    return {
      bestFor: ["Small spaces and home organization", "Budget upgrades for everyday use", "Practical, non-critical household items"],
      skipIf: ["You need premium materials or heavy-duty build", "You haven't measured your space yet", "You need exact color matching"],
    }
  if (["fashion", "clothing", "shoes", "accessories"].some((c) => cat.includes(c)))
    return {
      bestFor: ["Everyday wear and a budget wardrobe refresh", "Accessories where exact fit matters less", "Casual, low-risk style picks"],
      skipIf: ["You need exact sizing — check the size guide first", "You need premium fabric or materials", "You're buying for a formal occasion"],
    }
  if (cat.includes("travel"))
    return {
      bestFor: ["Travel packing and organization", "Lightweight, giftable everyday items", "Keeping bags and toiletries tidy"],
      skipIf: ["You need heavy-duty, long-haul durability", "You need it before an imminent trip", "You need premium materials"],
    }
  return {
    bestFor: ["Practical, everyday use", "Budget-conscious shoppers", "Simple, giftable picks"],
    skipIf: ["You need warranty or after-sales support", "You need exact sizing or premium materials", "You can't confirm return terms"],
  }
}

export function generateStaticParams() {
  return getActiveDeals().map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const deal = getDealBySlug(slug)
  if (!deal) return {}
  const discountText = deal.discount > 0 ? `${deal.discount}% off. ` : ""
  return {
    title: `${deal.title} — ${deal.platform} Deal`,
    description: clampMeta(`${discountText}${deal.reason} SulitScore ${deal.sulitScore}/10 — confirm the price on ${deal.platform} before buying.`),
    alternates: { canonical: `${siteConfig.url}/deals/${slug}` },
    openGraph: {
      title: `${deal.title} | SulitScan PH`,
      description: deal.reason,
      url: `${siteConfig.url}/deals/${slug}`,
    },
  }
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const deal = getDealBySlug(slug)
  if (!deal) notFound()

  const relatedDeals = getFeaturedDeals(4).filter((d) => d.id !== deal.id).slice(0, 3)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Deals", url: `${siteConfig.url}/deals` },
          { name: deal.title, url: `${siteConfig.url}/deals/${slug}` },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All Deals
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Image or gradient placeholder */}
          <div className="rounded-2xl overflow-hidden aspect-square relative bg-slate-100">
            {deal.imageUrl ? (
              <Image
                src={deal.imageUrl}
                alt={deal.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${deal.imageGradient} flex items-center justify-center`}
                aria-hidden="true"
              >
                {deal.discount > 0 && (
                  <span className="text-7xl font-black text-white/25 select-none">{deal.discount}%</span>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Store + category */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                {deal.platform}
              </span>
              <span className="text-xs text-slate-400">{deal.category}</span>
            </div>

            <h1 className="text-xl font-black text-slate-900 mb-4 leading-snug">
              {deal.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4 flex-wrap">
              <span className="text-3xl font-black text-slate-900">
                {formatPrice(deal.salePrice)}
              </span>
              {deal.discount > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(deal.originalPrice)}
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                    −{deal.discount}%
                  </span>
                </>
              )}
            </div>

            {/* SulitScore */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border mb-4 ${getSulitScoreBg(deal.sulitScore)}`}
            >
              <Star className="w-4 h-4 fill-current" aria-hidden="true" />
              SulitScore {deal.sulitScore}/10 — {getSulitScoreLabel(deal.sulitScore)}
            </div>

            {/* Why picked */}
            <div className="flex items-start gap-2 p-4 bg-green-50 rounded-xl mb-4">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-green-800 leading-relaxed">{deal.reason}</p>
            </div>

            {/* Price disclaimer */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>Affiliate datafeed price.</strong> Confirm the current price, vouchers, and availability on{" "}
                {deal.platform} before buying.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {deal.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-full border border-slate-100"
                >
                  <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                  {formatTag(tag)}
                </span>
              ))}
            </div>

            {/* Last checked + report */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1.5 text-xs text-amber-600">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {deal.lastChecked}
              </div>
              <Link
                href={`/contact?topic=outdated-price&deal=${encodeURIComponent(deal.slug)}`}
                rel="nofollow"
                className="text-xs text-slate-400 hover:text-rose-500 transition-colors underline underline-offset-2"
              >
                Report outdated price
              </Link>
            </div>

            {/* CTA */}
            <ExternalAffiliateLink
              href={deal.affiliateLink}
              platform={deal.platform}
              aria-label={`Check the current price on ${deal.platform} (affiliate link, opens in new tab)`}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-md hover:shadow-green-200 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Check Price on {deal.platform}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </ExternalAffiliateLink>

            <p className="mt-2 text-xs text-center text-slate-400">
              Affiliate link — SulitScan may earn a commission at no extra cost to you.{" "}
              <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
            </p>
          </div>
        </div>

        {/* Buyer checklist */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-10">
          <h2 className="text-base font-bold text-slate-900 mb-4">Before you buy — checklist</h2>
          <ul className="space-y-2.5" role="list">
            {getBuyerChecklist(deal).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                  {idx + 1}
                </span>
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best for / Skip if */}
        {(() => {
          const { bestFor, skipIf } = getBestForSkipIf(deal)
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" aria-hidden="true" />
                  Best for
                </h2>
                <ul className="space-y-2" role="list">
                  {bestFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" aria-hidden="true" />
                      <span className="text-xs text-green-800 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <MinusCircle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  Skip if
                </h2>
                <ul className="space-y-2" role="list">
                  {skipIf.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" aria-hidden="true" />
                      <span className="text-xs text-amber-800 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })()}

        {/* Related deals */}
        {relatedDeals.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-lg font-bold text-slate-900 mb-5">
              More deals to check
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedDeals.map((d) => (
                <DealCard key={d.id} deal={d} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
