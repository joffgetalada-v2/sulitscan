import type { Metadata } from "next"
import DealsGrid from "@/components/DealsGrid"
import TrustBar from "@/components/TrustBar"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import { getActiveDeals, getActiveCategories } from "@/data/deals"
import { DEALS_PAGE_SIZE, resolveDealListing, type DealSearchParams } from "@/lib/deal-listing"
import { siteConfig } from "@/lib/seo"
import { ShoppingBag } from "lucide-react"
import { formatDealCount } from "@/lib/utils"

interface DealsPageProps {
  searchParams: Promise<DealSearchParams>
}

const DEALS_DESCRIPTION = "Browse curated online deals from Temu, Shopee PH, and Sephora PH with buyer notes on every listing."

export async function generateMetadata({ searchParams }: DealsPageProps): Promise<Metadata> {
  const listing = resolveDealListing(getActiveDeals(), await searchParams)
  const canonical = listing.isFiltered || listing.page === 1
    ? `${siteConfig.url}/deals`
    : `${siteConfig.url}/deals?page=${listing.page}`
  const title = listing.page > 1 && !listing.isFiltered
    ? `Latest Online Deals Philippines — Page ${listing.page}`
    : "Latest Online Deals Philippines"
  const socialTitle = `${title} | SulitScan PH`

  return {
    title,
    description: DEALS_DESCRIPTION,
    alternates: { canonical },
    robots: { index: !listing.isFiltered, follow: true },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: socialTitle,
      description: DEALS_DESCRIPTION,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: "SulitScan PH — Check deals before you click buy",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: DEALS_DESCRIPTION,
      images: [siteConfig.ogImage],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
  }
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const activeDeals = getActiveDeals()
  const listing = resolveDealListing(activeDeals, await searchParams)
  const categories = getActiveCategories()
  const stores = ["All", ...Array.from(new Set(activeDeals.map((deal) => deal.platform))).sort()]

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Deals", url: `${siteConfig.url}/deals` },
        ]}
      />
      <ItemListJsonLd
        name="Temu, Shopee PH, and Sephora PH Deals Philippines – SulitScan PH"
        items={listing.items.map((deal, index) => ({
          name: deal.title,
          url: `${siteConfig.url}/deals/${deal.slug}`,
          description: deal.reason,
          position: (listing.page - 1) * DEALS_PAGE_SIZE + index + 1,
        }))}
      />

      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-green-700">
                Curated Deal Notes
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Temu, Shopee PH &amp; Sephora PH Deals
              </h1>
              <p className="text-slate-500 text-sm max-w-xl">
                {formatDealCount(activeDeals.length)} from Temu, Shopee PH, and Sephora PH. Search by product, filter by store or category,
                and sort by discount, SulitScore, or price.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TrustBar className="mb-6" />
        <DealsGrid listing={listing} categories={categories} stores={stores} />
      </div>
    </>
  )
}
