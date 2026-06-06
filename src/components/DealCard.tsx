"use client"

import { motion } from "framer-motion"
import { ExternalLink, Star, Clock, Tag } from "lucide-react"
import type { Deal } from "@/data/deals"
import { formatPrice, getSulitScoreBg, getSulitScoreLabel } from "@/lib/utils"

interface DealCardProps {
  deal: Deal
  priority?: boolean
}

export default function DealCard({ deal }: DealCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Image placeholder */}
      <div
        className={`relative h-44 bg-gradient-to-br ${deal.imageGradient} flex items-center justify-center overflow-hidden`}
        aria-hidden="true"
      >
        {/* Discount badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <Tag className="w-3 h-3 text-green-600" aria-hidden="true" />
          <span className="text-xs font-bold text-green-700">-{deal.discount}%</span>
        </div>

        {/* Platform badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <span className="text-xs font-semibold text-slate-700">{deal.platform}</span>
        </div>

        {/* Large discount overlay */}
        <div className="flex flex-col items-center justify-center text-white">
          <span className="text-5xl font-black opacity-30 select-none">{deal.discount}%</span>
          <span className="text-sm font-medium opacity-50 -mt-1 select-none">OFF</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
          {deal.category}
        </span>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
          {deal.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-slate-900">
            {formatPrice(deal.salePrice)}
          </span>
          <span className="text-sm text-slate-400 line-through">
            {formatPrice(deal.originalPrice)}
          </span>
        </div>

        {/* SulitScore */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getSulitScoreBg(deal.sulitScore)}`}
          >
            <Star className="w-3 h-3 fill-current" aria-hidden="true" />
            SulitScore {deal.sulitScore}/10 · {getSulitScoreLabel(deal.sulitScore)}
          </div>
        </div>

        {/* Reason */}
        <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4 line-clamp-2">
          {deal.reason}
        </p>

        {/* Last checked */}
        {deal.isDemo && (
          <div className="flex items-center gap-1 mb-3">
            <Clock className="w-3 h-3 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="text-xs text-amber-600">{deal.lastChecked}</span>
          </div>
        )}

        {/* CTA */}
        <a
          href={deal.affiliateLink}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label={`View deal for ${deal.title} on ${deal.platform} (opens in new tab)`}
        >
          View Deal on {deal.platform}
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  )
}
