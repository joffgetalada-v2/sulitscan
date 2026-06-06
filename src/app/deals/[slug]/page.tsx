import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ExternalLink, ArrowLeft, Clock, Star, Tag, ShieldCheck } from "lucide-react"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { deals, getDealBySlug } from "@/data/deals"
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
  return {
    title: `${deal.title} – ${deal.platform} Deal`,
    description: `${deal.discount}% off ${deal.title} on ${deal.platform}. ${deal.reason}`,
    alternates: { canonical: `${siteConfig.url}/deals/${slug}` },
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

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Deals", url: `${siteConfig.url}/deals` },
          { name: deal.title, url: `${siteConfig.url}/deals/${slug}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All Deals
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image placeholder */}
          <div
            className={`rounded-2xl bg-gradient-to-br ${deal.imageGradient} aspect-square flex items-center justify-center`}
            aria-hidden="true"
          >
            <span className="text-7xl font-black text-white/25 select-none">{deal.discount}%</span>
          </div>

          {/* Details */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {deal.category} · {deal.platform}
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1 mb-4 leading-snug">
              {deal.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-black text-slate-900">
                {formatPrice(deal.salePrice)}
              </span>
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(deal.originalPrice)}
              </span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                -{deal.discount}%
              </span>
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
              aria-label={`View deal for ${deal.title} on ${deal.platform} (affiliate link, opens in new tab)`}
            >
              View Deal on {deal.platform}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>

            <p className="mt-2 text-xs text-center text-slate-400">
              Affiliate link — we may earn a commission at no extra cost to you.{" "}
              <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
