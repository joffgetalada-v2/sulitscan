import { compareDealsForDefault, type Deal } from "@/data/deals"

export type DealSortKey = "recommended" | "discount" | "score" | "price-asc" | "newest"

export interface DealSearchParams {
  q?: string | string[]
  store?: string | string[]
  category?: string | string[]
  sort?: string | string[]
  page?: string | string[]
}

export interface NormalizedDealFilters {
  q: string
  store: string
  category: string
  sort: DealSortKey
  page: number
}

export interface DealListingResult extends NormalizedDealFilters {
  items: Deal[]
  total: number
  pageCount: number
  isFiltered: boolean
}

export const DEALS_PAGE_SIZE = 24

const SORT_KEYS: DealSortKey[] = ["recommended", "discount", "score", "price-asc", "newest"]

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? ""
}

function allValues(value: string | string[] | undefined): string[] {
  return Array.isArray(value) ? value : [value ?? ""]
}

function normalizePage(value: string): number {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function sortDeals(deals: Deal[], sort: DealSortKey): Deal[] {
  return [...deals].sort((a, b) => {
    if (sort === "recommended") return compareDealsForDefault(a, b)
    if (sort === "discount") return b.discount - a.discount
    if (sort === "score") return b.sulitScore - a.sulitScore
    if (sort === "price-asc") return a.salePrice - b.salePrice
    return b.id.localeCompare(a.id)
  })
}

export function resolveDealListing(deals: Deal[], raw: DealSearchParams): DealListingResult {
  const q = firstValue(raw.q).trim()
  const stores = new Set(deals.map((deal) => deal.platform))
  const categories = new Set(deals.map((deal) => deal.category))
  const requestedStore = firstValue(raw.store)
  const requestedCategory = firstValue(raw.category)
  const requestedSort = firstValue(raw.sort)
  const hasRawFilters = allValues(raw.q).some((value) => Boolean(value.trim()))
    || allValues(raw.store).some((value) => value !== "" && value !== "All")
    || allValues(raw.category).some((value) => value !== "" && value !== "All")
    || allValues(raw.sort).some((value) => value !== "" && value !== "recommended")
  const store = stores.has(requestedStore) ? requestedStore : "All"
  const category = categories.has(requestedCategory) ? requestedCategory : "All"
  const sort = SORT_KEYS.includes(requestedSort as DealSortKey)
    ? requestedSort as DealSortKey
    : "recommended"

  const filtered = deals.filter((deal) => {
    const matchesStore = store === "All" || deal.platform === store
    const matchesCategory = category === "All" || deal.category === category
    const searchable = `${deal.title} ${deal.category} ${deal.platform} ${deal.tags.join(" ")}`.toLowerCase()
    const matchesQuery = !q || searchable.includes(q.toLowerCase())
    return matchesStore && matchesCategory && matchesQuery
  })
  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / DEALS_PAGE_SIZE))
  const page = total === 0 ? 1 : Math.min(normalizePage(firstValue(raw.page)), pageCount)
  const start = (page - 1) * DEALS_PAGE_SIZE

  return {
    q,
    store,
    category,
    sort,
    page,
    items: sortDeals(filtered, sort).slice(start, start + DEALS_PAGE_SIZE),
    total,
    pageCount,
    isFiltered: hasRawFilters,
  }
}

export function buildDealsHref(
  current: NormalizedDealFilters,
  overrides: Partial<NormalizedDealFilters>
): string {
  const filters = { ...current, ...overrides }
  const params = new URLSearchParams()

  if (filters.q.trim()) params.set("q", filters.q.trim())
  if (filters.store !== "All") params.set("store", filters.store)
  if (filters.category !== "All") params.set("category", filters.category)
  if (filters.sort !== "recommended") params.set("sort", filters.sort)
  if (filters.page > 1) params.set("page", String(filters.page))

  const query = params.toString()
  return query ? `/deals?${query}` : "/deals"
}
