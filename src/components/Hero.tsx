"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ShoppingBag, ArrowRight, CheckCircle } from "lucide-react"

const DealScannerVisual = dynamic(() => import("./DealScannerVisual"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full max-w-md mx-auto rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse"
      style={{ height: 480 }}
      aria-hidden="true"
    />
  ),
})

const trustItems = [
  "No checkout. No hidden redirects.",
  "Affiliate links clearly disclosed.",
  "Curated manually for Filipino shoppers.",
]

const stats = [
  { value: "2",    label: "Partner Stores",  color: "text-green-600" },
  { value: "100+", label: "Curated Deals",   color: "text-slate-900" },
  { value: "7",    label: "Categories",      color: "text-slate-900" },
  { value: "₱0",  label: "Cost to You",     color: "text-amber-600" },
]

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
      aria-labelledby="hero-heading"
    >
      {/* Grid line background */}
      <div className="absolute inset-0 bg-grid" aria-hidden="true" />

      {/* Gradient orbs */}
      <div
        className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-green-100/80 to-emerald-200/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 -right-32 w-[500px] h-[500px] rounded-full bg-amber-100/50 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-center">

          {/* ── Left: copy ── */}
          <div className="flex flex-col items-start">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" aria-hidden="true" />
              <span className="text-xs font-semibold text-green-700 tracking-wide">
                Temu &amp; Sephora PH Deals
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-black text-slate-900 leading-[1.0] tracking-tight mb-6"
            >
              Check deals
              <br className="hidden sm:block" />
              {" "}before you{" "}
              <span className="gradient-text">click buy.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-9 max-w-lg"
            >
              SulitScan PH helps Filipino shoppers review selected Temu and Sephora
              deals with transparent notes, buyer reminders, and clear affiliate
              disclosures.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                href="/deals"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <ShoppingBag className="w-5 h-5 shrink-0" aria-hidden="true" />
                Browse Deals
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                How It Works
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>
            </motion.div>

            {/* Trust items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col gap-y-2"
              role="list"
              aria-label="Trust signals"
            >
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2" role="listitem">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />
                  <span className="text-sm text-slate-500">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: deal scanner visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" }}
            className="relative"
          >
            <DealScannerVisual />
          </motion.div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.68 }}
          className="mt-16 sm:mt-20 pt-10 border-t border-slate-100"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
            {stats.map(({ value, label, color }) => (
              <div key={label}>
                <div className={`text-3xl sm:text-4xl font-black ${color} mb-1 tabular`}>
                  {value}
                </div>
                <div className="text-sm text-slate-400 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
