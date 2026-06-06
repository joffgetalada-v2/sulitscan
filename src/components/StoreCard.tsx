import Link from "next/link"
import { ExternalLink, Shield, Truck } from "lucide-react"
import type { Store } from "@/data/stores"

interface StoreCardProps {
  store: Store
}

const trustConfig = {
  high:   { label: "Trusted Store",    color: "text-green-700 bg-white/90 border-green-100" },
  medium: { label: "Community Pick",   color: "text-amber-700 bg-white/90 border-amber-100" },
  new:    { label: "New Platform",     color: "text-blue-700  bg-white/90 border-blue-100"  },
}

export default function StoreCard({ store }: StoreCardProps) {
  const trust = trustConfig[store.trustLevel]

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-green-100 transition-all overflow-hidden">
      {/* Store color header */}
      <div className={`relative h-24 bg-gradient-to-br ${store.gradient} overflow-hidden`}>
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />
        {/* Store name watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-white/25 select-none tracking-tight">{store.name}</span>
        </div>
        {/* Trust badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${trust.color}`}>
            <Shield className="w-3 h-3" aria-hidden="true" />
            {trust.label}
          </span>
        </div>
        {/* Country */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 bg-black/20 backdrop-blur-sm rounded-full text-xs text-white/90 font-medium">
            {store.country}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-green-700 transition-colors">
          {store.name}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2 flex-1">
          {store.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {store.categories.slice(0, 3).map((cat) => (
            <span key={cat} className="text-xs px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md border border-slate-100">
              {cat}
            </span>
          ))}
          {store.categories.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md border border-slate-100">
              +{store.categories.length - 3}
            </span>
          )}
        </div>

        {/* Shipping info */}
        {store.shipsToPhilippines && (
          <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-500">
            <Truck className="w-3.5 h-3.5 text-green-500 shrink-0" aria-hidden="true" />
            <span>
              {store.freeShippingMinimum !== null
                ? store.freeShippingMinimum === 0
                  ? "Free shipping available"
                  : `Free shipping on ₱${store.freeShippingMinimum.toLocaleString()}+`
                : "Ships to Philippines"}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <Link
            href={`/stores/${store.slug}`}
            className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-lg bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-700 border border-slate-100 hover:border-green-100 transition-all"
          >
            View Deals
          </Link>
          <a
            href={store.affiliateLink}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="flex items-center justify-center gap-1.5 flex-1 text-xs font-semibold py-2 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
            aria-label={`Visit ${store.name} (opens in new tab)`}
          >
            Visit Store
            <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}
