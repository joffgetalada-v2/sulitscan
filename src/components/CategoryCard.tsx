"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { Category } from "@/data/categories"

interface CategoryCardProps {
  category: Category
  liveCount?: number
  large?: boolean
}

export default function CategoryCard({ category, liveCount, large = false }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
    >
      <Link
        href={`/categories/${category.slug}`}
        className={`group flex flex-col relative overflow-hidden rounded-2xl border border-white/20 shadow-sm hover:shadow-lg transition-all ${large ? "min-h-40" : "min-h-32"} bg-gradient-to-br ${category.gradient}`}
        aria-label={`Browse ${category.name} deals`}
      >
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />

        {/* Glow circle */}
        <div
          className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Emoji */}
          <span className="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block" aria-hidden="true">
            {category.emoji}
          </span>

          <h3 className="text-sm font-bold text-white leading-tight mb-1">{category.name}</h3>
          <p className="text-xs text-white/70 leading-tight mt-auto">
            {liveCount ?? category.dealCount} deals
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
