import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ExternalLink, CheckCircle, Truck, ArrowLeft, ArrowRight, ShieldCheck, RotateCcw, Clock, AlertCircle, ChevronDown, BookOpen } from "lucide-react"
import { BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import { stores, getStoreBySlug } from "@/data/stores"
import { getStoreContent } from "@/data/store-content"
import { getDealsByPlatform } from "@/data/deals"
import { siteConfig } from "@/lib/seo"
import { clampMeta } from "@/lib/utils"
import StoreDeals from "@/components/StoreDeals"
import ImportTaxCallout from "@/components/ImportTaxCallout"

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
    title: `${store.name} Deals Philippines`,
    description: clampMeta(`${store.description} Browse selected ${store.name} deals on SulitScan PH with buyer notes, shipping info, and affiliate disclosure.`),
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
  const content = getStoreContent(slug)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Stores", url: `${siteConfig.url}/stores` },
          { name: store.name, url: `${siteConfig.url}/stores/${slug}` },
        ]}
      />
      {content?.faqs && content.faqs.length > 0 && (
        <FAQJsonLd items={content.faqs} />
      )}
      {storeDeals.length > 0 && (
        <ItemListJsonLd
          name={`${store.name} Deals Philippines – SulitScan PH`}
          items={storeDeals.slice(0, 24).map((d) => ({
            name: d.title,
            url: `${siteConfig.url}/deals/${d.slug}`,
            description: d.reason,
          }))}
        />
      )}

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
            {store.affiliateLink ? (
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
            ) : (
              <a
                href="#store-deals-heading"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm rounded-xl border border-white/30 transition-all"
              >
                Browse {store.name} deals
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
              {store.trustLevel === "high" ? "Active Store" : store.trustLevel === "medium" ? "Active Store" : "Listed Store"}
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

          {/* Left: main content + deals */}
          <div className="lg:col-span-2 space-y-10">

            {/* Store intro */}
            {content?.intro && (
              <section>
                <div className="prose prose-sm prose-slate max-w-none">
                  {content.intro.trim().split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm text-slate-600 leading-relaxed mb-3">{para}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Good for / Be careful */}
            {content && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                  <h2 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" aria-hidden="true" />
                    Good for
                  </h2>
                  <ul className="space-y-2" role="list">
                    {content.goodFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-green-500 shrink-0 mt-2" aria-hidden="true" />
                        <span className="text-xs text-green-800 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <h2 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                    Be careful with
                  </h2>
                  <ul className="space-y-2" role="list">
                    {content.beCareful.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0 mt-2" aria-hidden="true" />
                        <span className="text-xs text-amber-800 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Overseas import-tax callout (Temu ships internationally) */}
            {slug === "temu" && <ImportTaxCallout />}

            {/* Deals */}
            <section aria-labelledby="store-deals-heading">
              <h2 id="store-deals-heading" className="text-xl font-bold text-slate-900 mb-4">
                {storeDeals.length > 0
                  ? `${storeDeals.length} curated deal${storeDeals.length !== 1 ? "s" : ""} from ${store.name}`
                  : `Deals from ${store.name}`}
              </h2>
              <StoreDeals deals={storeDeals} storeName={store.name} />
            </section>

            {/* FAQs */}
            {content?.faqs && content.faqs.length > 0 && (
              <section aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-xl font-bold text-slate-900 mb-5">
                  Frequently asked questions about {store.name}
                </h2>
                <div className="space-y-3">
                  {content.faqs.map((faq, i) => (
                    <details key={i} className="group bg-white border border-slate-100 rounded-xl shadow-sm">
                      <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none select-none text-sm font-semibold text-slate-900 hover:text-green-700 transition-colors">
                        {faq.question}
                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" aria-hidden="true" />
                      </summary>
                      <div className="px-5 pb-4">
                        <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
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
              <ul className="space-y-2.5" role="list">
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
                a small commission when you click a {store.name} link and complete a purchase. This does not
                affect your price.{" "}
                <Link href="/affiliate-disclosure" className="underline text-slate-600">
                  Full disclosure
                </Link>
              </p>
              {store.affiliateLink ? (
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
              ) : (
                <a
                  href="#store-deals-heading"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
                >
                  Browse {store.name} deals
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
            </div>

            {/* Related links */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Explore more</h3>
              <ul className="space-y-2" role="list">
                {store.relatedGuideSlug && (
                  <li>
                    <Link href={`/blog/${store.relatedGuideSlug}`} className="text-xs text-green-700 font-medium hover:underline inline-flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      {store.name} buyer guide →
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/deals" className="text-xs text-green-600 hover:underline">Browse all deals →</Link>
                </li>
                <li>
                  <Link href="/categories" className="text-xs text-green-600 hover:underline">Shop by category →</Link>
                </li>
                <li>
                  <Link href="/blog" className="text-xs text-green-600 hover:underline">Shopping guides →</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
