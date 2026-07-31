import Link from "next/link"
import DealCard from "@/components/DealCard"
import {
  buildEntityPageHref,
  ENTITY_DEALS_PAGE_SIZE,
  type EntityDealListingResult,
} from "@/lib/entity-deal-listing"

interface EntityDealsProps {
  listing: EntityDealListingResult
  basePath: string
  gridClassName: string
  priceNote: string
}

export default function EntityDeals({
  listing,
  basePath,
  gridClassName,
  priceNote,
}: EntityDealsProps) {
  const pageStart = Math.min(
    Math.max(1, listing.page - 2),
    Math.max(1, listing.pageCount - 4)
  )
  const pageEnd = Math.min(listing.pageCount, pageStart + 4)
  const pageNumbers = Array.from(
    { length: pageEnd - pageStart + 1 },
    (_, index) => pageStart + index
  )
  const firstItem = (listing.page - 1) * ENTITY_DEALS_PAGE_SIZE + 1
  const lastItem = firstItem + listing.items.length - 1

  if (listing.items.length === 0) {
    return (
      <div className="p-8 bg-slate-50 rounded-2xl text-center text-slate-400 text-sm">
        No deals listed yet. Check back soon.
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <p>
          Showing {firstItem}–{lastItem} of {listing.total} deals · {priceNote}
        </p>
        <p className="font-medium text-slate-600">
          Page {listing.page} of {listing.pageCount}
        </p>
      </div>

      <div className={gridClassName}>
        {listing.items.map((deal, index) => (
          <DealCard
            key={deal.id}
            deal={deal}
            imagePriority={index === 0}
            position={index + 1}
          />
        ))}
      </div>

      {listing.pageCount > 1 && (
        <nav aria-label="Deals pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {listing.page > 1 && (
            <Link
              href={buildEntityPageHref(basePath, listing.page - 1)}
              aria-label="Previous page"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-green-400 hover:text-green-700"
            >
              Previous page
            </Link>
          )}
          {pageNumbers.map((page) => (
            <Link
              key={page}
              href={buildEntityPageHref(basePath, page)}
              aria-label={`Page ${page}`}
              aria-current={page === listing.page ? "page" : undefined}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                page === listing.page
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-green-400 hover:text-green-700"
              }`}
            >
              {page}
            </Link>
          ))}
          {listing.page < listing.pageCount && (
            <Link
              href={buildEntityPageHref(basePath, listing.page + 1)}
              aria-label="Next page"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-green-400 hover:text-green-700"
            >
              Next page
            </Link>
          )}
        </nav>
      )}
    </>
  )
}
