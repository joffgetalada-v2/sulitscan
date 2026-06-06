"use client"

import { motion } from "framer-motion"
import { CheckCircle, ExternalLink, Shield, TrendingDown, Truck, Tag } from "lucide-react"

const signals = [
  { icon: TrendingDown, label: "Price Drop",    value: "₱600 below avg",  good: true },
  { icon: Shield,       label: "Seller Trust",  value: "Official Store",   good: true },
  { icon: Tag,          label: "Voucher Stack", value: "Up to ₱150 more",  good: true },
  { icon: Truck,        label: "Free Shipping", value: "₱0 on this deal",  good: true },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.45 + i * 0.09, duration: 0.32 },
  }),
}

export default function DealScannerVisual() {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      {/* Glow halo behind card */}
      <div
        className="absolute -inset-6 bg-gradient-to-br from-green-300/20 via-emerald-200/10 to-transparent rounded-3xl blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main dashboard card */}
      <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden">

        {/* Browser bar */}
        <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 bg-slate-800 rounded-md px-3 py-1 text-xs text-slate-400 font-mono truncate">
            sulitscan.com/scan/xiaomi-band-9
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" aria-hidden="true" />
            <span className="text-xs text-green-400 font-semibold">Live</span>
          </div>
        </div>

        {/* Product image area with animated scan line */}
        <div
          className="relative bg-gradient-to-br from-blue-500 to-indigo-700 overflow-hidden"
          style={{ height: 128 }}
          aria-hidden="true"
        >
          <div className="scan-line" />
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* Watermark discount */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-white/[0.15] leading-none">24%</span>
            <span className="text-sm text-white/[0.15] -mt-1 font-bold">OFF</span>
          </div>
          {/* Platform badge */}
          <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <span className="text-xs font-semibold text-slate-700">Shopee PH</span>
          </div>
          {/* Discount badge */}
          <div className="absolute top-2.5 left-2.5 bg-green-500 rounded-full px-2.5 py-1 shadow-sm">
            <span className="text-xs font-bold text-white">−24% OFF</span>
          </div>
        </div>

        {/* Product info */}
        <div className="px-4 pt-3.5 pb-0">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-0.5">
            Scanning deal
          </p>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1.5">
            Xiaomi Smart Band 9 – Activity Tracker
          </h3>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-black text-slate-900">₱1,899</span>
            <span className="text-sm text-slate-400 line-through">₱2,499</span>
            <span className="ml-auto text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
              Save ₱600
            </span>
          </div>
        </div>

        {/* SulitScore */}
        <div className="mx-4 my-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">SulitScore™</span>
            <span className="text-sm font-black text-green-600">8 / 10 — Good Deal</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Signal grid */}
        <div className="px-4 pb-3 grid grid-cols-2 gap-2">
          {signals.map((sig, i) => (
            <motion.div
              key={sig.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="flex items-start gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100"
            >
              <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-600 leading-tight">{sig.label}</div>
                <div className="text-[11px] text-green-600 leading-tight font-medium">{sig.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white text-sm font-bold shadow-sm shadow-green-200">
            <span>View Deal on Shopee</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </div>
          <p className="text-center text-[11px] text-slate-400 mt-2 leading-snug">
            Affiliate link — clearly disclosed. You decide when to visit.
          </p>
        </div>
      </div>

      {/* Floating tag pill — top right */}
      <motion.div
        className="absolute -top-4 -right-3 bg-white border border-amber-200 rounded-full px-3 py-1.5 shadow-lg z-20 flex items-center gap-1.5"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <Tag className="w-3 h-3 text-amber-600" />
        <span className="text-xs font-bold text-amber-700">−48% OFF</span>
      </motion.div>

      {/* Floating savings pill — bottom left */}
      <motion.div
        className="absolute -bottom-3 -left-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full px-3 py-1.5 shadow-lg z-20"
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        aria-hidden="true"
      >
        <span className="text-xs font-bold text-white">₱600 Saved</span>
      </motion.div>

      {/* Floating score pill — left middle */}
      <motion.div
        className="absolute top-1/2 -left-14 -translate-y-1/2 bg-white border border-green-200 rounded-xl px-2.5 py-1.5 shadow-lg z-20 hidden lg:flex flex-col items-center"
        animate={{ x: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden="true"
      >
        <span className="text-base font-black text-green-600 leading-none">8</span>
        <span className="text-[9px] text-slate-400 font-medium">Score</span>
      </motion.div>
    </div>
  )
}
