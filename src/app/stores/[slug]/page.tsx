import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ExternalLink, CheckCircle, Truck, ArrowLeft, ShieldCheck, RotateCcw, Clock } from "lucide-react"
import DealCard from "@/components/DealCard"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { stores, getStoreBySlug } from "@/data/stores"
import { getDealsByPlatform } from "@/data/deals"
import { siteConfig } from "@/lib/seo"

export function generateStaticParams() {
  return stores.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const store = getStoreBySlug(slug)
  if (!store) return {}
  return {
    title: `${store.name} Deals Philippines — ${store.tagline}`,
    description: `${store.description} Browse selected ${store.name} deals on SulitScan PH with buyer notes and affiliate disclosure.`,
    alternates: { canonical: `${siteConfig.url}/stores/${slug}` },
    openGraph: {
      title: `${store.name} Deals Philippines | SulitScan PH`,
      description: store.description,
      url: `${siteConfig.url}/stores/${slug}`,
    },
  }
}

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const store = getStoreBySlug(slug)
  if (!store) notFound()

  const storeDeals = getDealsByPlatform(store.name)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Stores", url: `${siteConfig.url}/stores` },
          { name: store.name, url: `${siteConfig.url}/stores/${slug}` },
        ]}
      />

      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/stores"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All Stores
        </Link>
      </div>

      {/* Store hero */}
      <div className={`bg-gradient-to-br ${store.gradient} py-12 px-4 sm:px-6 lg:px-8 mt-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">{store.name}</h1>
              <p className="text-white/80 text-sm max-w-xl">{store.description}</p>
            </div>
            <a
              href={store.affiliateLink}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm rounded-xl border border-white/30 transition-all"
              aria-label={`Visit ${store.name} (affiliate link, opens in new tab)`}
            >
              Visit {store.name}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
              {store.trustLevel === "high" ? "High Trust" : store.trustLevel === "medium" ? "Verified Platform" : "New Platform"}
            </span>
            {store.shipsToPhilippines && (
              <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                <Truck className="w-3 h-3" aria-hidden="true" />
                Ships to Philippines
              </span>
            )}
            {store.freeShippingMinimum !== null && (
              <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                Free shipping ₱{store.freeShippingMinimum.toLocaleString()}+
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: deals */}
          <div className="lg:col-span-2">
            {/* Deals */}
            {storeDeals.length > 0 ? (
              <section aria-labelledby="store-deals-heading">
                <h2 id="store-deals-heading" className="text-xl font-bold text-slate-900 mb-6">
                  {storeDeals.length} deals from {store.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  {storeDeals.slice(0, 12).map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
                {storeDeals.length > 12 && (
                  <div className="text-center">
                    <Link
                      href="/deals"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:border-green-200 hover:text-green-700 transition-all"
                    >
                      View all {storeDeals.length} deals →
                    </Link>
                  </div>
                )}
              </section>
            ) : (
              <div className="p-8 bg-slate-50 rounded-2xl text-center text-slate-400 text-sm">
                No deals listed for this store yet. Check back soon.
              </div>
            )}
          </div>

          {/* Right: store info sidebar */}
          <div className="space-y-6">
            {/* Buyer reminders */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                Buyer Reminders
              </h3>
              <ul className="space-y-2.5">
                {store.buyerNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-green-400 shrink-0 mt-2" aria-hidden="true" />
                    <span className="text-xs text-slate-500 leading-relaxed">{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" aria-hidden="true" />
                Shipping to Philippines
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{store.shippingNote}</p>
            </div>

            {/* Returns */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-500" aria-hidden="true" />
                Returns & Refunds
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{store.returnNote}</p>
            </div>

            {/* Price disclaimer */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
              <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
                Price Disclaimer
              </h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                Prices shown on SulitScan are sourced from affiliate datafeeds and may differ from the
                current price on {store.name}. Always confirm the final price, available vouchers, and
                product availability on the partner store before completing your purchase.
              </p>
            </div>

            {/* Affiliate disclosure */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Affiliate disclosure:</strong> SulitScan may earn
                a small commission when you click the link below and complete a purchase. This does not
                affect your price.{" "}
                <Link href="/affiliate-disclosure" className="underline text-slate-600">
                  Full disclosure
                </Link>
              </p>
              <a
                href={store.affiliateLink}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
                aria-label={`Visit ${store.name} (affiliate link, opens in new tab)`}
              >
                Visit {store.name}
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
