import type { Metadata } from "next"
import { existsSync } from "fs"
import { join } from "path"
import Link from "next/link"
import Image from "next/image"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import PartnerBanners from "@/components/PartnerBanners"
import { ExternalAffiliateLink } from "@/components/ExternalAffiliateLink"
import { stores } from "@/data/stores"
import { activePartnerBanners } from "@/data/partner-banners"
import { siteConfig } from "@/lib/seo"
import { Store, ArrowRight, CheckCircle, Truck, ShieldCheck } from "lucide-react"

// Returns the public URL only if the file actually exists, so a missing banner
// gracefully falls back to a gradient instead of a broken image.
function publicImg(rel: string): string | undefined {
  return existsSync(join(process.cwd(), "public", rel.replace(/^\//, ""))) ? rel : undefined
}

export const metadata: Metadata = {
  title: "Temu, Shopee PH, and Sephora PH Partner Stores Philippines",
  description:
    "SulitScan features curated deals from partner stores: Temu and Shopee PH for budget and marketplace finds, and Sephora PH for beauty and skincare. Affiliate links clearly disclosed.",
  alternates: { canonical: `${siteConfig.url}/stores` },
  openGraph: {
    title: "Partner Stores | SulitScan PH",
    description:
      "SulitScan currently features selected deals from Temu, Shopee PH, and Sephora PH. Affiliate links clearly disclosed.",
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
      <ItemListJsonLd
        name="Partner Stores Philippines – SulitScan PH"
        items={stores.map((s) => ({
          name: s.name,
          url: `${siteConfig.url}/stores/${s.slug}`,
          description: s.tagline,
        }))}
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
                SulitScan currently features selected deals from <strong>3 partner stores</strong>: Temu, Shopee PH, and Sephora PH.
                We add new partners only after reviewing their offers and buyer-check information.
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
            partner links, at no extra cost to you. We only feature stores with clear buyer notes and affiliate disclosures.{" "}
            <Link href="/affiliate-disclosure" className="underline font-medium">Full disclosure →</Link>
          </p>
        </div>

        {/* Store cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              {/* Store hero, banner image when available, else gradient header. The
                  whole header links through to the store detail page. */}
              {store.bannerImage && publicImg(store.bannerImage) ? (
                <Link
                  href={`/stores/${store.slug}`}
                  className="relative block group"
                  aria-label={`View ${store.name} store details`}
                >
                  <Image
                    src={store.bannerImage}
                    alt={`${store.name} store banner, ${store.tagline}`}
                    width={store.bannerWidth ?? 1811}
                    height={store.bannerHeight ?? 412}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="w-full h-auto group-hover:opacity-95 transition-opacity"
                    preload
                  />
                  <h2 className="sr-only">{store.name}</h2>
                  {!store.bannerHasBadge && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {store.trustLevel === "new" ? "Listed Store" : "Active Store"}
                    </span>
                  )}
                </Link>
              ) : (
                <Link href={`/stores/${store.slug}`} className={`block bg-gradient-to-br ${store.gradient} px-6 py-8`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white mb-1">{store.name}</h2>
                      <p className="text-white/70 text-sm">{store.tagline}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                      {store.trustLevel === "new" ? "Listed Store" : "Active Store"}
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
                </Link>
              )}

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
                  {store.affiliateLink && (
                    <ExternalAffiliateLink
                      href={store.affiliateLink}
                      platform={store.name}
                      placement="store-index"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={`Visit ${store.name} (affiliate link, opens in new tab)`}
                    >
                      Visit {store.name} →
                    </ExternalAffiliateLink>
                  )}
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
            subtitle="Sponsored links to partner stores worth checking. These are advertiser offers, and their catalogs are not imported into SulitScan deals, so confirm everything on the partner site before buying."
            banners={activePartnerBanners}
          />
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Know an active store offer SulitScan should review?{" "}
            <Link href="/contact" className="text-green-600 hover:underline">Send the details →</Link>
          </p>
        </div>
      </div>
    </>
  )
}
