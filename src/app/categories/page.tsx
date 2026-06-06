import type { Metadata } from "next"
import Link from "next/link"
import CategoryCard from "@/components/CategoryCard"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { categories } from "@/data/categories"
import { siteConfig } from "@/lib/seo"
import { LayoutGrid, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Shopping Deal Categories",
  description:
    "Browse SulitScan deals by category — Under ₱500, Tech, Home, Beauty, Fashion, Travel, Digital Tools, and Gift Ideas.",
  alternates: { canonical: `${siteConfig.url}/categories` },
  openGraph: {
    title: "Shopping Deal Categories | SulitScan PH",
    description:
      "Browse deals by category: Under ₱500, Tech, Home, Beauty, Fashion, Travel, Digital Tools, and Gift Ideas.",
    url: `${siteConfig.url}/categories`,
  },
}

export default function CategoriesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home",       url: siteConfig.url },
          { name: "Categories", url: `${siteConfig.url}/categories` },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-green-700">
                Browse by category
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Shop deals by what you need
              </h1>
              <p className="text-slate-500 text-sm">
                {categories.length} categories · Find exactly what you need at a price that&apos;s actually sulit.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Bento grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} large />
          ))}
        </div>

        {/* Category detail list */}
        <h2 className="text-xl font-black text-slate-900 mb-6">All categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all"
              aria-label={`Browse ${cat.name} deals`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-xl shrink-0 shadow-sm`}
                aria-hidden="true"
              >
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-green-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{cat.description}</p>
                <span className="text-xs text-green-600 font-semibold mt-1 block">
                  {cat.dealCount} deals available
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-green-500 transition-colors shrink-0 mt-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
