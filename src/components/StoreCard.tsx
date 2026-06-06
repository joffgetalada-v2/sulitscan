import Link from "next/link"
import { ExternalLink, CheckCircle, Truck } from "lucide-react"
import type { Store } from "@/data/stores"

interface StoreCardProps {
  store: Store
}

const trustColors = {
  high: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  new: "bg-slate-100 text-slate-600",
}

const trustLabels = {
  high: "High Trust",
  medium: "Moderate Trust",
  new: "New Platform",
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all overflow-hidden">
      {/* Header gradient */}
      <div
        className={`h-20 bg-gradient-to-br ${store.gradient} flex items-center justify-center`}
        aria-hidden="true"
      >
        <span className="text-2xl font-black text-white/90 tracking-tight drop-shadow-sm">
          {store.name}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        {/* Trust level */}
        <span
          className={`inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${trustColors[store.trustLevel]}`}
        >
          <CheckCircle className="w-3 h-3" aria-hidden="true" />
          {trustLabels[store.trustLevel]}
        </span>

        <p className="text-sm text-slate-600 leading-relaxed mb-3 flex-1">
          {store.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {store.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-full border border-slate-100"
            >
              {cat}
            </span>
          ))}
          {store.categories.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-xs rounded-full border border-slate-100">
              +{store.categories.length - 3}
            </span>
          )}
        </div>

        {/* Shipping info */}
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
          <Truck className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          {store.shipsToPhilippines ? (
            store.freeShippingMinimum !== null ? (
              <span>
                Ships to PH · Free shipping from ₱{store.freeShippingMinimum.toLocaleString()}
              </span>
            ) : (
              <span>Ships to Philippines</span>
            )
          ) : (
            <span>Digital / Travel bookings only</span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/stores/${store.slug}`}
          className="flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-slate-50 hover:bg-green-50 text-slate-700 hover:text-green-700 text-sm font-medium rounded-xl border border-slate-100 hover:border-green-200 transition-all"
          aria-label={`View ${store.name} deals`}
        >
          View Deals
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
