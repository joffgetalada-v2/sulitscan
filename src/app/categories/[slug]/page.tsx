import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DealCard from "@/components/DealCard"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { categories, getCategoryBySlug } from "@/data/categories"
import { getDealsByCategory } from "@/data/deals"
import { siteConfig } from "@/lib/seo"

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
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
    title: `${category.name} Deals Philippines`,
    description: category.description,
    alternates: { canonical: `${siteConfig.url}/categories/${slug}` },
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

  const categoryDeals = getDealsByCategory(category.name)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Categories", url: `${siteConfig.url}/categories` },
          { name: category.name, url: `${siteConfig.url}/categories/${slug}` },
        ]}
      />

      {/* Category hero */}
      <div
        className={`bg-gradient-to-br ${category.gradient} py-12 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-5xl" aria-hidden="true">{category.emoji}</div>
            <div>
              <h1 className="text-3xl font-black text-white">{category.name}</h1>
              <p className="text-white/80 mt-1">{category.dealCount} deals · {category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categoryDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">No deals found in this category yet. Check back soon!</p>
          </div>
        )}
      </div>
    </>
  )
}
