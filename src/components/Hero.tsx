"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, Info, Zap } from "lucide-react"

const RemotionHeroPlayer = dynamic(() => import("./RemotionHeroPlayer"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 animate-pulse"
      style={{ paddingBottom: "64%" }}
      aria-hidden="true"
    />
  ),
})

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-green-50/40 to-white pt-12 pb-16 sm:pt-16 sm:pb-24"
      aria-labelledby="hero-heading"
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-green-100/60 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-10 -right-20 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full mb-6"
            >
              <Zap className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
              <span className="text-xs font-semibold text-green-700">
                Curated deals for Filipino shoppers
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-5"
            >
              Find deals that are{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-green-500">actually sulit.</span>
                <span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-green-100 rounded-full -z-10"
                  aria-hidden="true"
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg"
            >
              SulitScan helps Filipino shoppers discover curated online deals, compare value,
              check seller trust, and shop smarter before clicking buy.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                Browse Deals
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-full border border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <Info className="w-4 h-4" aria-hidden="true" />
                How It Works
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              {[
                { icon: "✅", text: "Verified value notes" },
                { icon: "🔒", text: "No fake checkout" },
                { icon: "🇵🇭", text: "Made for PH shoppers" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <span aria-hidden="true">{icon}</span>
                  <span className="text-xs text-slate-500 font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Remotion animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            {/* Glow ring */}
            <div
              className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-br from-green-200/50 to-emerald-100/40 blur-xl pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/80">
              <RemotionHeroPlayer />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
