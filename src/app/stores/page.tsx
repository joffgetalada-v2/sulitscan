import type { Metadata } from "next"
import StoreCard from "@/components/StoreCard"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { stores } from "@/data/stores"
import { siteConfig } from "@/lib/seo"
import { Store } from "lucide-react"

export const metadata: Metadata = {
  title: "Partner Stores and Marketplaces",
  description:
    "Explore SulitScan's partner stores: Shopee, Lazada, AliExpress, Temu, iHerb, Trip.com, Klook, SHEIN, Zalora, and more.",
  alternates: { canonical: `${siteConfig.url}/stores` },
  openGraph: {
    title: "Partner Stores and Marketplaces | SulitScan PH",
    description:
      "Explore SulitScan's partner stores: Shopee, Lazada, AliExpress, Temu, iHerb, Trip.com, Klook, SHEIN, Zalora, and more.",
    url: `${siteConfig.url}/stores`,
  },
}

export default function StoresPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home",   url: siteConfig.url },
          { name: "Stores", url: `${siteConfig.url}/stores` },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <Store className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-green-700">
                Partner Stores
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Where we find deals
              </h1>
              <p className="text-slate-500 text-sm">
                {stores.length} partner platforms · Affiliate partnerships clearly disclosed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Affiliate note */}
        <div className="mb-8 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-lg mt-0.5" aria-hidden="true">📌</span>
          <p className="text-sm text-amber-800">
            <strong>Affiliate note:</strong> SulitScan earns a small commission when you purchase through our
            partner links — at no extra cost to you. We only feature stores we believe offer genuine value
            to Filipino shoppers.
          </p>
        </div>

        {/* Store grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-slate-400">
          More partner stores coming soon. Have a suggestion?{" "}
          <a href="/contact" className="text-green-600 hover:underline font-medium">Contact us →</a>
        </p>
      </div>
    </>
  )
}
