"use client"

import { useState } from "react"
import DealCard from "@/components/DealCard"
import type { Deal } from "@/data/deals"

const INITIAL = 24
const STEP = 12

interface StoreDealsProps {
  deals: Deal[]
  storeName: string
}

export default function StoreDeals({ deals, storeName }: StoreDealsProps) {
  const [visible, setVisible] = useState(INITIAL)

  if (deals.length === 0) {
    return (
      <div className="p-8 bg-slate-50 rounded-2xl text-center text-slate-400 text-sm">
        No deals listed for this store yet. Check back soon.
      </div>
    )
  }

  return (
    <>
      <p className="text-xs text-slate-400 mb-4">
        Showing {Math.min(visible, deals.length)} of {deals.length} deals ·{" "}
        Prices from affiliate datafeed — confirm current price on {storeName} before buying.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {deals.slice(0, visible).map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
      {visible < deals.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisible((v) => Math.min(v + STEP, deals.length))}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:border-green-200 hover:text-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Load more deals ({deals.length - visible} remaining)
          </button>
        </div>
      )}
    </>
  )
}
