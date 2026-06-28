import DealCard from "@/components/DealCard"
import type { Deal } from "@/data/deals"

interface TopPicksProps {
  title: string
  subtitle?: string
  deals: Deal[]
  headingId: string
}

/**
 * A compact "Top Picks" row (6–8 curated deals) that surfaces the strongest,
 * lowest-risk options before the full grid, reduces choice overload.
 */
export default function TopPicks({ title, subtitle, deals, headingId }: TopPicksProps) {
  if (deals.length === 0) return null

  return (
    <section aria-labelledby={headingId} className="mb-12">
      <div className="mb-5">
        <span className="inline-block mb-1.5 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest uppercase text-green-700 bg-green-50 border border-green-100 rounded-full">
          Top Picks
        </span>
        <h2 id={headingId} className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {deals.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Prices, vouchers, availability, and shipping may change. Confirm details on the partner store before buying.
      </p>
    </section>
  )
}
