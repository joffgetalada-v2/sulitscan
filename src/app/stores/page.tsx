import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { stores } from "@/data/stores"
import { siteConfig } from "@/lib/seo"
import { Store, ArrowRight, CheckCircle, Truck, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Partner Stores — Temu and Sephora PH",
  description:
    "SulitScan currently focuses on selected deals from two partner stores: Temu (budget finds) and Sephora PH (authenticated beauty). More stores may be added later.",
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
            partner links — at no extra cost to you. We only work with stores we believe offer genuine value
            to Filipino shoppers.{" "}
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
                    {store.trustLevel === "high" ? "High Trust" : store.trustLevel === "medium" ? "Verified" : "New"}
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

        {/* Coming soon note */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <p className="text-sm text-slate-500 mb-1">
            <strong className="text-slate-700">More stores coming later.</strong>
          </p>
          <p className="text-xs text-slate-400">
            SulitScan is starting with Temu and Sephora PH to build a focused, trustworthy experience.
            We may add more partner stores as we grow.{" "}
            <Link href="/contact" className="text-green-600 hover:underline">Have a suggestion? Contact us →</Link>
          </p>
        </div>
      </div>
    </>
  )
}
