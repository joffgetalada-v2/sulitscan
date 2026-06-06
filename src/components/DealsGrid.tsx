"use client"

import { useState } from "react"
import DealCard from "./DealCard"
import type { Deal } from "@/data/deals"

interface DealsGridProps {
  deals: Deal[]
  categories: string[]
}

export default function DealsGrid({ deals, categories }: DealsGridProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered =
    activeCategory === "All"
      ? deals
      : deals.filter((d) => d.category === activeCategory)

  return (
    <>
      {/* Category filter tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap" role="group" aria-label="Filter by category">
        {categories.map((cat) => {
          const count =
            cat === "All"
              ? deals.length
              : deals.filter((d) => d.category === cat).length
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={isActive}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isActive
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-700"
              }`}
            >
              {cat}
              <span className="ml-1.5 opacity-60">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Deal grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm">No deals in this category yet — check back soon.</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-sm text-slate-400">
          Showing {filtered.length} of {deals.length} deals · Sorted by biggest discount · Updated regularly
        </p>
      </div>
    </>
  )
}
