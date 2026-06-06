import type { Metadata } from "next"
import StoreCard from "@/components/StoreCard"
import SectionHeading from "@/components/SectionHeading"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { stores } from "@/data/stores"
import { siteConfig } from "@/lib/seo"

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
          { name: "Home", url: siteConfig.url },
          { name: "Stores", url: `${siteConfig.url}/stores` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading
          tag="Partner Stores"
          title="Where we find deals"
          subtitle="SulitScan features affiliate partnerships with these platforms. All links clearly labeled."
          align="left"
        />

        {/* Affiliate reminder */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>Affiliate Note:</strong> SulitScan earns a commission when you purchase through our
          partner links — at no extra cost to you. We only feature stores we believe offer good value to
          Filipino shoppers.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-400">
          More partner stores being added. Have a suggestion?{" "}
          <a href="/contact" className="text-green-600 hover:underline">Contact us</a>.
        </p>
      </div>
    </>
  )
}
