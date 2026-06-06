import type { Metadata } from "next"
import DealCard from "@/components/DealCard"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import { deals } from "@/data/deals"
import { siteConfig } from "@/lib/seo"
import { ShoppingBag, Filter } from "lucide-react"

export const metadata: Metadata = {
  title: "Latest Online Deals Philippines",
  description:
    "Browse curated online deals from Shopee, Lazada, AliExpress, Temu, fashion, beauty, tech, home, travel, and more. Check value notes before you buy.",
  alternates: { canonical: `${siteConfig.url}/deals` },
  openGraph: {
    title: "Latest Online Deals Philippines | SulitScan PH",
    description:
      "Browse curated online deals from Shopee, Lazada, AliExpress, Temu, fashion, beauty, tech, home, travel, and more.",
    url: `${siteConfig.url}/deals`,
  },
}

const platforms = ["All", "Shopee", "Lazada", "AliExpress", "Temu", "iHerb", "Travel", "SHEIN"]

export default function DealsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home",  url: siteConfig.url },
          { name: "Deals", url: `${siteConfig.url}/deals` },
        ]}
      />
      <ItemListJsonLd
        name="Online Deals Philippines – SulitScan PH"
        items={deals.map((d) => ({
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
                Curated Deals
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Latest online deals Philippines
              </h1>
              <p className="text-slate-500 text-sm">
                {deals.length} deals · Manually curated · Demo prices — always verify before buying.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            Filter:
          </div>
          {platforms.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === "All"}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                f === "All"
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Deals grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400">
            Showing {deals.length} demo deals · More curated picks coming soon
          </p>
        </div>
      </div>
    </>
  )
}
