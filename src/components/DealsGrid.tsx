import Link from "next/link"
import { Search } from "lucide-react"
import DealCard from "./DealCard"
import {
  buildDealsHref,
  type DealListingResult,
  type DealSortKey,
} from "@/lib/deal-listing"
import { formatDealCount, formatShowingDeals } from "@/lib/utils"

interface DealsGridProps {
  listing: DealListingResult
  categories: string[]
  stores: string[]
}

const SORT_OPTIONS: { key: DealSortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "discount", label: "Biggest discount" },
  { key: "score", label: "Highest SulitScore" },
  { key: "price-asc", label: "Lowest price" },
  { key: "newest", label: "Recently added" },
]

export default function DealsGrid({ listing, categories, stores }: DealsGridProps) {
  const pageStart = Math.max(1, listing.page - 2)
  const pageEnd = Math.min(listing.pageCount, pageStart + 4)
  const pageNumbers = Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => pageStart + index)

  return (
    <>
      <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="text-base shrink-0 mt-0.5" aria-hidden="true">📌</span>
        <p className="text-xs text-amber-800">
          <strong>Affiliate datafeed prices:</strong> Product prices and discounts are sourced from
          affiliate datafeeds and may not reflect current prices on the partner store. Always confirm the
          final price, shipping fees, available vouchers, and return terms on{" "}
          <strong>Temu</strong>, <strong>Shopee PH</strong>, or <strong>Sephora PH</strong> before buying.
        </p>
      </div>

      <form action="/deals" method="get" className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative sm:col-span-2">
            <label htmlFor="deal-search" className="sr-only">Search deals</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              id="deal-search"
              name="q"
              type="search"
              placeholder="Search by product, category, or store..."
              defaultValue={listing.q}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="store-select" className="sr-only">Store</label>
            <select id="store-select" name="store" defaultValue={listing.store} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400">
              {stores.map((store) => <option key={store} value={store}>{store}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="category-select" className="sr-only">Category</label>
            <select id="category-select" name="category" defaultValue={listing.category} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400">
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <select id="sort-select" name="sort" defaultValue={listing.sort} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400">
              {SORT_OPTIONS.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="submit" className="inline-flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Apply filters
          </button>
          <Link href="/deals" className="text-sm font-medium text-slate-500 hover:text-green-700 hover:underline">
            Clear filters
          </Link>
        </div>
      </form>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <p className="text-sm text-slate-500">{formatShowingDeals(listing.items.length, listing.total)}</p>
        <p className="text-sm font-medium text-slate-600">Page {listing.page} of {listing.pageCount}</p>
      </div>

      {listing.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listing.items.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} imagePriority={index === 0} />
            ))}
          </div>

          <nav aria-label="Deals pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {listing.page > 1 && (
              <Link href={buildDealsHref(listing, { page: listing.page - 1 })} aria-label="Previous page" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-green-400 hover:text-green-700">
                Previous page
              </Link>
            )}
            {pageNumbers.map((page) => (
              <Link
                key={page}
                href={buildDealsHref(listing, { page })}
                aria-label={`Page ${page}`}
                aria-current={page === listing.page ? "page" : undefined}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${page === listing.page ? "border-green-600 bg-green-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-green-400 hover:text-green-700"}`}
              >
                {page}
              </Link>
            ))}
            {listing.page < listing.pageCount && (
              <Link href={buildDealsHref(listing, { page: listing.page + 1 })} aria-label="Next page" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-green-400 hover:text-green-700">
                Next page
              </Link>
            )}
          </nav>
          <p className="mt-12 text-center text-xs text-slate-400">
            {formatDealCount(listing.total)} match these filters. Prices are from affiliate datafeeds, confirm on the partner store before buying.
          </p>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm mb-3">No deals match your current filters.</p>
          <Link href="/deals" className="text-xs text-green-600 hover:underline font-medium">Clear all filters</Link>
        </div>
      )}
    </>
  )
}
