import type { Metadata } from "next"
import DealsGrid from "@/components/DealsGrid"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import { getActiveDeals, getActiveCategories } from "@/data/deals"
import { siteConfig } from "@/lib/seo"
import { ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Best Discounts & Deals Philippines",
  description:
    "Browse verified discount deals sorted by biggest savings — beauty, electronics, fashion, home, and more. Updated regularly.",
  alternates: { canonical: `${siteConfig.url}/deals` },
  openGraph: {
    title: "Best Discounts & Deals Philippines | SulitScan PH",
    description:
      "Verified price drops and exclusive discounts, sorted by biggest savings first.",
    url: `${siteConfig.url}/deals`,
  },
}

export default function DealsPage() {
  const activeDeals = getActiveDeals()
  const categories = getActiveCategories()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home",  url: siteConfig.url },
          { name: "Deals", url: `${siteConfig.url}/deals` },
        ]}
      />
      <ItemListJsonLd
        name="Best Discount Deals Philippines – SulitScan PH"
        items={activeDeals.map((d) => ({
          name: d.title,
          url: `${siteConfig.url}/deals/${d.slug}`,
          description: d.reason,
        }))}
      />

      {/* Page header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-green-700">
                Verified Discounts
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Best deals right now
              </h1>
              <p className="text-slate-500 text-sm">
                {activeDeals.length} deals · Sorted by biggest discount · Prices verified regularly
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DealsGrid deals={activeDeals} categories={categories} />
      </div>
    </>
  )
}
