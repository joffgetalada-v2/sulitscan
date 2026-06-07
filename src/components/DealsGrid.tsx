"use client"

import { useState, useMemo } from "react"
import DealCard from "./DealCard"
import type { Deal } from "@/data/deals"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface DealsGridProps {
  deals: Deal[]
  categories: string[]
}

type SortKey = "discount" | "score" | "price-asc" | "newest"

const STORES = ["All", "Temu", "Sephora PH"]
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "discount",  label: "Biggest discount" },
  { key: "score",     label: "Highest SulitScore" },
  { key: "price-asc", label: "Lowest price" },
  { key: "newest",    label: "Recently added" },
]

export default function DealsGrid({ deals, categories }: DealsGridProps) {
  const [search, setSearch]           = useState("")
  const [activeStore, setActiveStore] = useState("All")
  const [activeCategory, setActiveCategory] = useState("All")
  const [sortKey, setSortKey]         = useState<SortKey>("discount")
  const [showFilters, setShowFilters] = useState(false)
  const [displayCount, setDisplayCount] = useState(24)

  const filtered = useMemo(() => {
    let result = deals

    // Store filter
    if (activeStore !== "All") {
      result = result.filter((d) => d.platform === activeStore)
    }

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((d) => d.category === activeCategory)
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.platform.toLowerCase().includes(q)
      )
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sortKey === "discount")  return b.discount - a.discount
      if (sortKey === "score")     return b.sulitScore - a.sulitScore
      if (sortKey === "price-asc") return a.salePrice - b.salePrice
      if (sortKey === "newest")    return b.id.localeCompare(a.id)
      return 0
    })
  }, [deals, search, activeStore, activeCategory, sortKey])

  function clearFilters() {
    setSearch("")
    setActiveStore("All")
    setActiveCategory("All")
    setSortKey("discount")
    setDisplayCount(24)
  }

  const hasActiveFilters =
    search.trim() || activeStore !== "All" || activeCategory !== "All" || sortKey !== "discount"

  return (
    <>
      {/* Demo notice */}
      <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="text-base shrink-0 mt-0.5" aria-hidden="true">📌</span>
        <p className="text-xs text-amber-800">
          <strong>Sample deal data notice:</strong> Product prices and discounts shown are sourced from
          affiliate datafeeds and may not reflect current prices on the partner store. Always confirm the
          final price, shipping fees, available vouchers, and seller terms on{" "}
          <strong>Temu</strong> or <strong>Sephora PH</strong> before buying.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search by product name, category, or store..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
          aria-label="Search deals"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Toggle filters button (mobile) */}
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            showFilters || hasActiveFilters
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-slate-600 border-slate-200"
          }`}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          Filters {hasActiveFilters && "•"}
        </button>

        {/* Store filter tabs */}
        <div className={`${showFilters ? "flex" : "hidden sm:flex"} flex-wrap gap-1.5`} role="group" aria-label="Filter by store">
          {STORES.map((store) => {
            const count = store === "All" ? deals.length : deals.filter((d) => d.platform === store).length
            const isActive = activeStore === store
            return (
              <button
                key={store}
                type="button"
                onClick={() => setActiveStore(store)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {store}
                <span className="ml-1 opacity-60">({count})</span>
              </button>
            )
          })}
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" aria-hidden="true" />

        {/* Category filter tabs */}
        <div className={`${showFilters ? "flex" : "hidden sm:flex"} flex-wrap gap-1.5`} role="group" aria-label="Filter by category">
          {categories.map((cat) => {
            const count = cat === "All" ? deals.length : deals.filter((d) => d.category === cat).length
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-slate-700 text-white border-slate-700 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800"
                }`}
              >
                {cat}
                <span className="ml-1 opacity-60">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sort + result count row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <p className="text-sm text-slate-500">
          Showing <strong className="text-slate-800">{Math.min(displayCount, filtered.length)}</strong> of{" "}
          <strong className="text-slate-800">{filtered.length}</strong> {filtered.length === 1 ? "deal" : "deals"}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-slate-500 sr-only">Sort by</label>
          <select
            id="sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Deal grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.slice(0, displayCount).map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {filtered.length > displayCount && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setDisplayCount((c) => c + 24)}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-semibold rounded-xl hover:border-green-400 hover:text-green-700 transition-colors shadow-sm"
          >
            Load more deals ({filtered.length - displayCount} remaining)
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm mb-3">No deals match your current filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-green-600 hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400">
            Showing {filtered.length} deal{filtered.length !== 1 ? "s" : ""} ·
            Prices are sample data — confirm on partner store before buying.
          </p>
        </div>
      )}
    </>
  )
}
