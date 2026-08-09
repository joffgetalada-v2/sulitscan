"use client"

import { useState, useEffect, useCallback, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle, Pause, Play, Tag, Zap, Shield, TrendingDown } from "lucide-react"
import { getActiveDeals } from "@/data/deals"
import { getDealFreshness } from "@/lib/deal-freshness"
import { formatPrice } from "@/lib/utils"

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery)
  mediaQuery.addEventListener("change", onStoreChange)
  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches
}

function getReducedMotionServerSnapshot() {
  return false
}

function getSlides() {
  const deals = getActiveDeals()
  const seen = new Set<string>()
  const top: typeof deals = []
  for (const deal of deals) {
    if (!seen.has(deal.category)) {
      seen.add(deal.category)
      top.push(deal)
    }
  }
  return top
}

export default function DealScannerVisual() {
  const slides = getSlides()
  const [current, setCurrent] = useState(0)
  const [playbackOverride, setPlaybackOverride] = useState<"auto" | "paused" | "playing">("auto")
  const [focusPaused, setFocusPaused] = useState(false)
  const [hoverPaused, setHoverPaused] = useState(false)
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )
  const preferencePaused = Boolean(prefersReducedMotion) && playbackOverride === "auto"
  const controlPaused = playbackOverride === "paused" || preferencePaused
  const rotationPaused = controlPaused || focusPaused || hoverPaused
  const decorativeMotionActive = !rotationPaused && !prefersReducedMotion

  const togglePlayback = () => {
    setPlaybackOverride(controlPaused ? "playing" : "paused")
  }

  const advance = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1 || rotationPaused) return
    const timer = setInterval(advance, 4000)
    return () => clearInterval(timer)
  }, [advance, rotationPaused, slides.length])

  const deal = slides[current]
  if (!deal) return null

  const freshness = getDealFreshness(deal.lastChecked)
  const isCurrent = freshness.status === "current"
  const saved = deal.originalPrice - deal.salePrice
  const scoreLabel = deal.sulitScore >= 9 ? "Excellent" : deal.sulitScore >= 7 ? "Good Deal" : "Fair"
  const freshnessLabel = isCurrent
    ? "Recently checked"
    : freshness.status === "reference"
      ? "Reference listing"
      : "Price check needed"

  const signalData = [
    ...(isCurrent
      ? [{ icon: TrendingDown, label: "Discount", value: `${deal.discount}% off`, good: true }]
      : []),
    { icon: Shield,       label: "Curated Pick",  value: "SulitScan reviewed",          good: true },
    { icon: Tag,          label: "Affiliate Link", value: "Clearly disclosed",           good: true },
    { icon: Zap,          label: "SulitScore",    value: `${deal.sulitScore}/10`,        good: true },
  ]

  return (
    <section
      aria-label="Deal preview"
      data-decorative-motion={decorativeMotionActive ? "on" : "off"}
      className="relative w-full max-w-md mx-auto select-none"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusPaused(false)
        }
      }}
    >
      {/* Glow halo */}
      <div
        className="absolute -inset-6 bg-gradient-to-br from-green-300/20 via-emerald-200/10 to-transparent rounded-3xl blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div
        data-scanner-card
        className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden"
      >

        {/* Browser bar */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-2.5 sm:gap-3 sm:px-4">
          <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="min-w-0 flex-1 truncate rounded-md bg-slate-800 px-3 py-1 font-mono text-xs text-slate-400">
            sulitscan.com/deals
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            <span className="text-xs text-amber-300 font-semibold">{freshnessLabel}</span>
          </div>
          <button
            type="button"
            onClick={togglePlayback}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-600 px-2 py-1 text-xs font-semibold text-slate-100 transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            aria-label={`${controlPaused ? "Play" : "Pause"} deal preview`}
          >
            {controlPaused ? (
              <Play className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Pause className="h-3 w-3" aria-hidden="true" />
            )}
            <span>{controlPaused ? "Play" : "Pause"}</span>
          </button>
        </div>

        {/* Product image */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${current}`}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
              className={`relative bg-gradient-to-br ${deal.imageGradient} overflow-hidden`}
              style={{ height: 168 }}
              aria-hidden="true"
            >
            {deal.imageUrl ? (
              <Image
                src={deal.imageUrl}
                alt={deal.title}
                fill
                className="object-cover"
                sizes="(max-width: 480px) calc(100vw - 2rem), 448px"
                preload
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "16px 16px",
                  }}
                />
                {isCurrent && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-white/[0.15] leading-none">{deal.discount}%</span>
                    <span className="text-sm text-white/[0.15] -mt-1 font-bold">OFF</span>
                  </div>
                )}
              </>
            )}

            {/* Discount badge */}
            {isCurrent && (
              <div className="absolute top-2.5 left-2.5 bg-green-500 rounded-full px-2.5 py-1 shadow-sm">
                <span className="text-xs font-bold text-white">−{deal.discount}% OFF</span>
              </div>
            )}

            {/* Category badge */}
            <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
              <span className="text-xs font-semibold text-slate-700">{deal.category}</span>
            </div>

            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-0.5 left-1/2 z-10 flex -translate-x-1/2 gap-0.5">
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setCurrent(i)}
                className="grid h-6 w-6 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${current}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
          >
            <div className="px-4 pt-3.5 pb-0">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-0.5">
                Top {deal.category} Deal
              </p>
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1.5">
                {deal.title}
              </h3>
              <div className="flex items-baseline gap-2.5" aria-live="polite">
                {isCurrent ? (
                  <>
                    <span className="text-2xl font-black text-slate-900">{formatPrice(deal.salePrice)}</span>
                    <span className="text-sm text-slate-400 line-through">{formatPrice(deal.originalPrice)}</span>
                    <span className="ml-auto text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                      Save {formatPrice(saved)}
                    </span>
                  </>
                ) : freshness.status === "reference" ? (
                  <>
                    <span className="text-xs font-semibold text-amber-700">Reference price</span>
                    <span className="text-2xl font-black text-slate-900">{formatPrice(deal.salePrice)}</span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-amber-700">Check live price</span>
                )}
              </div>
            </div>

            {/* SulitScore */}
            <div className="mx-4 my-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">SulitScore™</span>
                <span className="text-sm font-black text-green-600">
                  {deal.sulitScore} / 10, {scoreLabel}
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  initial={prefersReducedMotion ? false : { width: 0 }}
                  animate={{ width: `${deal.sulitScore * 10}%` }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Signal grid */}
            <div className="px-4 pb-3 grid grid-cols-2 gap-2">
              {signalData.map((sig) => (
                <div
                  key={sig.label}
                  className="flex items-start gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-600 leading-tight">{sig.label}</div>
                    <div className="text-[11px] text-green-600 leading-tight font-medium">{sig.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-4 pb-4">
              <Link
                href={`/deals/${deal.slug}`}
                className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white text-sm font-bold shadow-sm shadow-green-200"
              >
                <span>View Deal Details</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <p className="text-center text-[11px] text-slate-400 mt-2 leading-snug">
                Review the deal details first. The detail page contains the clearly disclosed partner link.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating discount pill */}
      {isCurrent && (
        <motion.div
          className="absolute -top-4 -right-3 bg-white border border-amber-200 rounded-full px-3 py-1.5 shadow-lg z-20 flex items-center gap-1.5"
          animate={decorativeMotionActive ? { y: [-4, 4, -4] } : { y: 0 }}
          transition={decorativeMotionActive
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }}
          aria-hidden="true"
        >
          <Tag className="w-3 h-3 text-amber-600" />
          <span className="text-xs font-bold text-amber-700">−{deal.discount}% OFF</span>
        </motion.div>
      )}

      {/* Floating savings pill */}
      {isCurrent && (
        <motion.div
          className="absolute -bottom-3 -left-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full px-3 py-1.5 shadow-lg z-20"
          animate={decorativeMotionActive ? { y: [4, -4, 4] } : { y: 0 }}
          transition={decorativeMotionActive
            ? { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
            : { duration: 0 }}
          aria-hidden="true"
        >
          <span className="text-xs font-bold text-white">{formatPrice(saved)} Saved</span>
        </motion.div>
      )}

      {/* Score pill */}
      <motion.div
        className="absolute top-1/2 -left-14 -translate-y-1/2 bg-white border border-green-200 rounded-xl px-2.5 py-1.5 shadow-lg z-20 hidden lg:flex flex-col items-center"
        animate={decorativeMotionActive ? { x: [-2, 2, -2] } : { x: 0 }}
        transition={decorativeMotionActive
          ? { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
          : { duration: 0 }}
        aria-hidden="true"
      >
        <span className="text-base font-black text-green-600 leading-none">{deal.sulitScore}</span>
        <span className="text-[9px] text-slate-400 font-medium">Score</span>
      </motion.div>
    </section>
  )
}
