"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Clock, Zap } from "lucide-react"
import type { Deal } from "@/data/deals"
import { formatPrice, getSulitScoreBg, getSulitScoreLabel } from "@/lib/utils"

interface DealCardProps {
  deal: Deal
}

export default function DealCard({ deal }: DealCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all overflow-hidden"
    >
      {/* Image / visual area */}
      <div
        className={`relative h-56 bg-gradient-to-br ${deal.imageGradient} overflow-hidden`}
        aria-hidden="true"
      >
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-white opacity-20 leading-none select-none">
                {deal.discount}%
              </span>
              <span className="text-sm text-white opacity-20 font-semibold -mt-1 select-none">OFF</span>
            </div>
          </>
        )}

        {/* Discount badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <Zap className="w-3 h-3 text-green-600" aria-hidden="true" />
          <span className="text-xs font-bold text-green-700">−{deal.discount}%</span>
        </div>

        {/* Category */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/20 backdrop-blur-sm rounded-full">
          <span className="text-xs text-white/90 font-medium">{deal.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 leading-snug mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
          {deal.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-black text-slate-900">{formatPrice(deal.salePrice)}</span>
          <span className="text-sm text-slate-400 line-through">{formatPrice(deal.originalPrice)}</span>
          <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
            Save {formatPrice(deal.originalPrice - deal.salePrice)}
          </span>
        </div>

        {/* SulitScore */}
        <div className="mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getSulitScoreBg(deal.sulitScore)}`}>
            <span className="font-black">{deal.sulitScore}/10</span>
            <span>·</span>
            <span>{getSulitScoreLabel(deal.sulitScore)}</span>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
            style={{ width: `${deal.sulitScore * 10}%` }}
          />
        </div>

        {/* Reason */}
        <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-3 line-clamp-2">
          {deal.reason}
        </p>

        {/* CTA */}
        <a
          href={deal.affiliateLink}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label={`Get this deal — ${deal.title} (opens in new tab)`}
        >
          Get This Deal
          <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  )
}
