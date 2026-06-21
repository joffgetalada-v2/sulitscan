import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import PartnerBanners from "@/components/PartnerBanners"
import { stores } from "@/data/stores"
import { partnerBanners } from "@/data/partner-banners"
import { siteConfig } from "@/lib/seo"
import { Store, ArrowRight, CheckCircle, Truck, ShieldCheck, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Temu and Sephora PH Partner Stores Philippines",
  description:
    "SulitScan focuses on curated deals from two partner stores: Temu for budget finds and Sephora PH for beauty and skincare. More stores coming soon.",
  alternates: { canonical: `${siteConfig.url}/stores` },
  openGraph: {
    title: "Partner Stores | SulitScan PH",
    description:
      "SulitScan currently focuses on selected deals from Temu and Sephora PH. Affiliate links clearly disclosed.",
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
              <p className="text-slate-500 text-sm max-w-xl">
                SulitScan currently focuses on selected deals from <strong>2 partner stores</strong>: Temu and Sephora PH.
                We are starting focused and building trust before expanding.
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
            <strong>Affiliate disclosure:</strong> SulitScan earns a small commission when you purchase through our
            partner links — at no extra cost to you. We only feature stores with clear buyer notes and affiliate disclosures.{" "}
            <Link href="/affiliate-disclosure" className="underline font-medium">Full disclosure →</Link>
          </p>
        </div>

        {/* Store cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              {/* Store hero */}
              <div className={`bg-gradient-to-br ${store.gradient} px-6 py-8`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1">{store.name}</h2>
                    <p className="text-white/70 text-sm">{store.tagline}</p>
                  </div>
                  <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                    {store.trustLevel === "high" ? "Active Store" : store.trustLevel === "medium" ? "Active Store" : "Listed Store"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {store.shipsToPhilippines && (
                    <span className="flex items-center gap-1 bg-white/10 text-white text-xs px-2.5 py-1 rounded-full">
                      <Truck className="w-3 h-3" aria-hidden="true" /> Ships to PH
                    </span>
                  )}
                  {store.freeShippingMinimum !== null && (
                    <span className="flex items-center gap-1 bg-white/10 text-white text-xs px-2.5 py-1 rounded-full">
                      Free shipping ₱{store.freeShippingMinimum.toLocaleString()}+
                    </span>
                  )}
                </div>
              </div>

              {/* Store detail */}
              <div className="px-6 py-5">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{store.description}</p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {store.categories.map((cat) => (
                    <span key={cat} className="text-xs px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full border border-slate-100">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Buyer notes preview */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Buyer Reminders</h3>
                  <ul className="space-y-1.5">
                    {store.buyerNotes.slice(0, 3).map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-xs text-slate-500">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/stores/${store.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    View store details
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                  <a
                    href={store.affiliateLink}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={`Visit ${store.name} (affiliate link, opens in new tab)`}
                  >
                    Visit {store.name} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured partner offers (sponsored advertiser links) */}
        <div className="mb-14 pt-2">
          <PartnerBanners
            headingId="partner-offers-heading"
            title="Featured partner offers"
            subtitle="Sponsored links to partner stores worth checking. These are advertiser offers — their catalogs are not imported into SulitScan deals, so confirm everything on the partner site before buying."
            banners={partnerBanners}
          />
        </div>

        {/* Coming soon stores */}
        <section aria-labelledby="coming-soon-heading">
          <h2 id="coming-soon-heading" className="text-lg font-bold text-slate-900 mb-2">
            Coming Soon
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            SulitScan currently focuses on Temu and Sephora PH. Shopee, Lazada, and AliExpress are planned for future deal coverage once affiliate offers, discounts, and buyer-check information are prepared.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { name: "Shopee", desc: "Philippine marketplace with a wide range of local and imported products." },
              { name: "Lazada", desc: "Southeast Asian e-commerce platform covering electronics, fashion, and more." },
              { name: "AliExpress", desc: "Global marketplace for low-price direct-from-factory products." },
            ].map((store) => (
              <div key={store.name} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3 opacity-75">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">{store.name}</h3>
                  <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full font-medium">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    Coming soon
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{store.desc}</p>
                <p className="text-xs text-slate-400 italic">
                  We are preparing curated deal notes for this store. Product listings will be added only after we review available affiliate offers, discounts, and buyer-check information.
                </p>
                <span className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl cursor-not-allowed">
                  Coming soon
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Have a suggestion for a store we should add?{" "}
              <Link href="/contact" className="text-green-600 hover:underline">Contact us →</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
