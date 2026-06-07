import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, ArrowLeft, Clock, Star, Tag, ShieldCheck, AlertCircle } from "lucide-react"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { deals, getDealBySlug, getFeaturedDeals } from "@/data/deals"
import DealCard from "@/components/DealCard"
import { siteConfig } from "@/lib/seo"
import { formatPrice, getSulitScoreBg, getSulitScoreLabel } from "@/lib/utils"

export function generateStaticParams() {
  return deals.map((d) => ({ slug: d.slug }))
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
    description: `${discountText}${deal.reason} SulitScore: ${deal.sulitScore}/10. Check deal notes before buying on ${deal.platform}.`,
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
                <strong>Sample deal note.</strong> Confirm the current price, vouchers, and availability on{" "}
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
                  {tag}
                </span>
              ))}
            </div>

            {/* Last checked */}
            <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-6">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {deal.lastChecked}
            </div>

            {/* CTA */}
            <a
              href={deal.affiliateLink}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-md hover:shadow-green-200 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label={`View this deal on ${deal.platform} (affiliate link, opens in new tab)`}
            >
              View Deal on {deal.platform}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>

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
            {[
              `Check the current price on ${deal.platform} — it may differ from what SulitScan shows.`,
              "Look for any available platform vouchers or loyalty discounts you can apply.",
              deal.platform === "Temu"
                ? "Check the size guide if ordering clothing — Temu sizing often runs smaller."
                : "Check if the product shade, size, or variant you want is in stock.",
              "Read buyer reviews on the partner store before deciding.",
              deal.platform === "Temu"
                ? "Note the estimated shipping date — Temu ships internationally (7–20 days to PH)."
                : "Confirm shipping cost — free shipping applies to orders ₱1,500+ on Sephora PH.",
              "Understand the return policy before opening the product.",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                  {idx + 1}
                </span>
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

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
