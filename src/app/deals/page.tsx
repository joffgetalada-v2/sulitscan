import type { Metadata } from "next"
import DealsGrid from "@/components/DealsGrid"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import { getActiveDeals, getActiveCategories } from "@/data/deals"
import { siteConfig } from "@/lib/seo"
import { ShoppingBag } from "lucide-react"
import { formatDealCount } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Latest Online Deals Philippines",
  description:
    "Browse curated online deals from Temu and Sephora PH — beauty, skincare, home finds, gadgets, fashion, and budget picks. Buyer notes and affiliate disclosure on every deal.",
  alternates: { canonical: `${siteConfig.url}/deals` },
  openGraph: {
    title: "Latest Online Deals Philippines | SulitScan PH",
    description:
      "Curated deal notes from Temu and Sephora PH. Filter by category, store, and SulitScore. Affiliate links clearly disclosed.",
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
        name="Temu and Sephora PH Deals Philippines – SulitScan PH"
        items={activeDeals.slice(0, 50).map((d) => ({
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
                Curated Deal Notes
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Temu &amp; Sephora PH Deals
              </h1>
              <p className="text-slate-500 text-sm max-w-xl">
                {formatDealCount(activeDeals.length)} from Temu and Sephora PH. Search by product, filter by store or category,
                and sort by discount, SulitScore, or price.
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
