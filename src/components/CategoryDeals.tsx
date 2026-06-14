"use client"

import { useState } from "react"
import type { Deal } from "@/data/deals"
import DealCard from "@/components/DealCard"
import { formatShowingDeals } from "@/lib/utils"

const INITIAL = 24
const STEP = 12

interface Props {
  deals: Deal[]
}

export default function CategoryDeals({ deals }: Props) {
  const [visible, setVisible] = useState(INITIAL)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {deals.slice(0, visible).map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {visible < deals.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisible((v) => Math.min(v + STEP, deals.length))}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:border-green-200 hover:text-green-700 transition-all shadow-sm cursor-pointer"
          >
            Load more deals ({deals.length - visible} remaining)
          </button>
        </div>
      )}

      {deals.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            {formatShowingDeals(Math.min(visible, deals.length), deals.length)} ·
            Prices from affiliate datafeeds — confirm on partner store before buying.
          </p>
        </div>
      )}
    </>
  )
}
