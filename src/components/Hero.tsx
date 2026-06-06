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
      style={{ height: 460 }}
      aria-hidden="true"
    />
  ),
})

const trustItems = [
  "No fake checkout or cart",
  "Affiliate links clearly disclosed",
  "Made for Filipino shoppers",
]

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-white pt-12 pb-20 sm:pt-16 sm:pb-28"
      aria-labelledby="hero-heading"
    >
      {/* Background blobs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-100/60 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 -right-24 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-emerald-100/30 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #16a34a 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="flex flex-col items-start">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" aria-hidden="true" />
              <span className="text-xs font-semibold text-green-700">
                Curated deals for Filipino shoppers
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-slate-900 leading-[1.1] tracking-tight mb-5"
            >
              Find deals that are{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-green-600">actually sulit.</span>
                <span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-green-100 rounded-full -z-10"
                  aria-hidden="true"
                />
              </span>
            </motion.h1>

            {/* Sub copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg"
            >
              SulitScan PH helps Filipino shoppers discover curated discounts, value notes,
              and shopping guides before buying from partner stores.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors shadow-md hover:shadow-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
                Browse Latest Deals
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Learn How It Works
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>
            </motion.div>

            {/* Trust items */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col gap-2"
              role="list"
            >
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />
                  <span className="text-sm text-slate-500">{item}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right — Deal scanner visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: "easeOut" }}
            className="relative lg:pl-8"
          >
            <DealScannerVisual />
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl"
        >
          {[
            { value: "12+", label: "Curated Deals" },
            { value: "8",   label: "Categories" },
            { value: "10",  label: "Partner Stores" },
            { value: "₱0",  label: "Cost to Use" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center sm:items-start">
              <span className="text-2xl font-black text-slate-900">{value}</span>
              <span className="text-xs text-slate-400 font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
