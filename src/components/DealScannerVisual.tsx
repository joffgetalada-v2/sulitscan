"use client"

import { motion } from "framer-motion"
import { CheckCircle, ExternalLink, Shield, TrendingDown, Truck, Tag } from "lucide-react"

const signals = [
  { icon: TrendingDown, label: "Price Drop",    value: "₱600 below avg",   good: true },
  { icon: Shield,       label: "Seller Trust",  value: "Official Store",    good: true },
  { icon: Tag,          label: "Voucher Stack", value: "Up to ₱150 more",   good: true },
  { icon: Truck,        label: "Free Shipping", value: "₱0 on this deal",   good: true },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.4 + i * 0.08, duration: 0.35 } }),
}

export default function DealScannerVisual() {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      {/* Glow behind card */}
      <div
        className="absolute inset-0 -m-6 bg-gradient-to-br from-green-300/20 to-emerald-400/10 rounded-3xl blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main dashboard card */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
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
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" aria-hidden="true" />
            <span className="text-xs text-green-400 font-medium">Live</span>
          </div>
        </div>

        {/* Product image area with scan line */}
        <div className="relative bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden" style={{ height: 120 }}>
          <div className="scan-line" aria-hidden="true" />
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden="true"
          />
          {/* Big discount text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
            <span className="text-5xl font-black text-white opacity-20">24%</span>
            <span className="text-sm text-white opacity-20 -mt-1 font-semibold">OFF</span>
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
        <div className="px-4 pt-3 pb-0">
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-0.5">Scanning deal</p>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
            Xiaomi Smart Band 9 – Activity Tracker
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₱1,899</span>
            <span className="text-sm text-slate-400 line-through">₱2,499</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">Save ₱600</span>
          </div>
        </div>

        {/* SulitScore bar */}
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
                <div className="text-xs font-semibold text-slate-700 leading-tight">{sig.label}</div>
                <div className="text-xs text-green-600 leading-tight">{sig.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-sm font-semibold shadow-sm shadow-green-200">
            <span>View Deal on Shopee</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            Affiliate link — clearly disclosed. You decide when to visit.
          </p>
        </div>
      </div>

      {/* Floating discount pill */}
      <motion.div
        className="absolute -top-4 -right-3 bg-white border border-amber-200 rounded-full px-3 py-1.5 shadow-lg z-20"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <span className="text-xs font-bold text-amber-700">🏷 −48% OFF</span>
      </motion.div>

      {/* Floating price pill */}
      <motion.div
        className="absolute -bottom-3 -left-3 bg-amber-400 rounded-full px-3 py-1.5 shadow-lg z-20"
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        aria-hidden="true"
      >
        <span className="text-xs font-bold text-white">₱269 Sulit</span>
      </motion.div>
    </div>
  )
}
