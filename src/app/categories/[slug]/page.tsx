import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import DealCard from "@/components/DealCard"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import { categories, getCategoryBySlug } from "@/data/categories"
import { getDealsByCategory } from "@/data/deals"
import { siteConfig } from "@/lib/seo"
import { ArrowLeft } from "lucide-react"
import { formatDealCount } from "@/lib/utils"

export function generateStaticParams() {
  return categories.filter((c) => c.featured).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category.name} Deals Philippines — Temu &amp; Sephora PH`,
    description: `${category.description} Browse ${category.name.toLowerCase()} deals from Temu and Sephora PH on SulitScan PH.`,
    alternates: { canonical: `${siteConfig.url}/categories/${slug}` },
    openGraph: {
      title: `${category.name} Deals | SulitScan PH`,
      description: category.description,
      url: `${siteConfig.url}/categories/${slug}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const categoryDeals = getDealsByCategory(slug)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Categories", url: `${siteConfig.url}/categories` },
          { name: category.name, url: `${siteConfig.url}/categories/${slug}` },
        ]}
      />
      {categoryDeals.length > 0 && (
        <ItemListJsonLd
          name={`${category.name} Deals Philippines – SulitScan PH`}
          items={categoryDeals.slice(0, 30).map((d) => ({
            name: d.title,
            url: `${siteConfig.url}/deals/${d.slug}`,
            description: d.reason,
          }))}
        />
      )}

      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All Categories
        </Link>
      </div>

      {/* Category hero */}
      <div className={`bg-gradient-to-br ${category.gradient} py-12 px-4 sm:px-6 lg:px-8 mt-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-5xl" aria-hidden="true">{category.emoji}</div>
            <div>
              <h1 className="text-3xl font-black text-white">{category.name}</h1>
              <p className="text-white/80 mt-1 text-sm max-w-lg">
                {formatDealCount(categoryDeals.length)} · {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Notice */}
        <div className="mb-8 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-base shrink-0 mt-0.5" aria-hidden="true">📌</span>
          <p className="text-xs text-amber-800">
            <strong>Affiliate datafeed prices:</strong> Prices shown are sourced from affiliate datafeeds and may not reflect the current
            price on the partner store. Always confirm before buying.{" "}
            <Link href="/affiliate-disclosure" className="underline font-medium">Affiliate disclosure →</Link>
          </p>
        </div>

        {categoryDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categoryDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-3xl mb-4" aria-hidden="true">🔍</p>
            <p className="text-slate-600 font-semibold mb-2">No deals found in this category yet.</p>
            <p className="text-slate-400 text-sm mb-6">
              We&apos;re adding new deals regularly. Check back soon, or browse all deals.
            </p>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-xl hover:bg-green-700 transition-colors"
            >
              Browse All Deals
            </Link>
          </div>
        )}

        {categoryDeals.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400">
              Showing {formatDealCount(categoryDeals.length)} ·
              Prices are from affiliate datafeeds — confirm on partner store before buying.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
