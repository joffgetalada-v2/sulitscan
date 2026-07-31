import type { Deal } from "@/data/deals"

export const ENTITY_DEALS_PAGE_SIZE = 24

export interface EntityDealListingResult {
  items: Deal[]
  page: number
  pageCount: number
  total: number
  isCanonical: boolean
}

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? ""
}

export function resolveEntityDealListing(
  deals: Deal[],
  rawPage: string | string[] | undefined
): EntityDealListingResult {
  const value = firstValue(rawPage)
  const requestedPage = /^[1-9]\d*$/.test(value) ? Number(value) : 1
  const pageCount = Math.max(1, Math.ceil(deals.length / ENTITY_DEALS_PAGE_SIZE))
  const page = Math.min(requestedPage, pageCount)
  const start = (page - 1) * ENTITY_DEALS_PAGE_SIZE

  return {
    items: deals.slice(start, start + ENTITY_DEALS_PAGE_SIZE),
    page,
    pageCount,
    total: deals.length,
    isCanonical: rawPage === undefined || (
      typeof rawPage === "string" && page > 1 && rawPage === String(page)
    ),
  }
}

export function buildEntityPageHref(basePath: string, page: number): string {
  return page > 1 ? `${basePath}?page=${page}` : basePath
}
