import type { Metadata } from "next"
import DealCard from "@/components/DealCard"
import SectionHeading from "@/components/SectionHeading"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import { deals } from "@/data/deals"
import { siteConfig } from "@/lib/seo"

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

export default function DealsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading
          tag="All Deals"
          title="Latest online deals Philippines"
          subtitle="Manually curated. Demo prices — always check the store before buying."
          align="left"
        />

        {/* Filters placeholder */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "Shopee", "Lazada", "AliExpress", "Temu", "iHerb", "Travel"].map((f) => (
            <button
              key={f}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                f === "All"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-600"
              }`}
              type="button"
              aria-pressed={f === "All"}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-400">
          Showing {deals.length} demo deals. More curated picks coming soon.
        </p>
      </div>
    </>
  )
}
