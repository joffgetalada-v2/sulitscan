"use client"

import { motion } from "framer-motion"
import { Search, ShieldCheck, TrendingDown, Star } from "lucide-react"

const scanItems = [
  { icon: TrendingDown, label: "Price History", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: ShieldCheck, label: "Seller Trust", color: "text-green-500", bg: "bg-green-50" },
  { icon: Star, label: "Review Quality", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Search, label: "Value Check", color: "text-purple-500", bg: "bg-purple-50" },
]

export default function MotionMascot() {
  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Scanner ring */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 rounded-full border-4 border-dashed border-green-200"
          aria-hidden="true"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, ease: "linear", repeat: Infinity }}
          className="absolute inset-3 rounded-full border-2 border-dashed border-amber-200"
          aria-hidden="true"
        />
        {/* Center icon */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg"
        >
          <Search className="w-8 h-8 text-white" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Scanning label */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-4 text-sm font-semibold text-green-600"
        aria-live="polite"
      >
        Scanning deal…
      </motion.p>

      {/* Signal items */}
      <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-xs">
        {scanItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            className={`flex items-center gap-2 px-3 py-2 ${item.bg} rounded-xl`}
          >
            <item.icon className={`w-4 h-4 ${item.color} shrink-0`} aria-hidden="true" />
            <span className="text-xs font-medium text-slate-700">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
