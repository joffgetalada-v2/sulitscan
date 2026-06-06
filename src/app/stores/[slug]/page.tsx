import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ExternalLink, CheckCircle, Truck } from "lucide-react"
import DealCard from "@/components/DealCard"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { stores, getStoreBySlug } from "@/data/stores"
import { deals } from "@/data/deals"
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
    title: `${store.name} Deals Philippines`,
    description: store.description,
    alternates: { canonical: `${siteConfig.url}/stores/${slug}` },
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

  const storeDeals = deals.filter((d) => d.platform.toLowerCase().replace(/[^a-z]/g, "-") === slug)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Stores", url: `${siteConfig.url}/stores` },
          { name: store.name, url: `${siteConfig.url}/stores/${slug}` },
        ]}
      />

      {/* Store hero */}
      <div className={`bg-gradient-to-br ${store.gradient} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-2">{store.name}</h1>
          <p className="text-white/80">{store.description}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" aria-hidden="true" />
              {store.trustLevel === "high" ? "High Trust" : store.trustLevel === "medium" ? "Moderate Trust" : "New Platform"}
            </span>
            {store.shipsToPhilippines && (
              <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                <Truck className="w-3 h-3" aria-hidden="true" />
                Ships to Philippines
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {storeDeals.length > 0 ? (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Deals on {store.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {storeDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm mb-8">No specific deals listed for this store yet.</p>
        )}

        <a
          href={store.affiliateLink}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-sm hover:shadow-green-200 transition-all"
          aria-label={`Visit ${store.name} (affiliate link, opens in new tab)`}
        >
          Visit {store.name}
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
        <p className="mt-2 text-xs text-slate-400">
          Affiliate link — we may earn a commission at no extra cost to you.{" "}
          <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
        </p>
      </div>
    </>
  )
}
