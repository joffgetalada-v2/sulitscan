import type { Metadata } from "next"
import CategoryCard from "@/components/CategoryCard"
import SectionHeading from "@/components/SectionHeading"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { categories } from "@/data/categories"
import { siteConfig } from "@/lib/seo"

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
          { name: "Home", url: siteConfig.url },
          { name: "Categories", url: `${siteConfig.url}/categories` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading
          tag="Categories"
          title="Shop deals by category"
          subtitle="Find exactly what you need, at a price that's actually sulit."
          align="left"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

        {/* Category descriptions */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-xl shrink-0`}
                aria-hidden="true"
              >
                {cat.emoji}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">{cat.name}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
                <span className="text-xs text-green-600 font-medium mt-1 block">
                  {cat.dealCount} deals available
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
