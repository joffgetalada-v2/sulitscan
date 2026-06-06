"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { Category } from "@/data/categories"

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Link
        href={`/categories/${category.slug}`}
        className="group relative flex flex-col items-center text-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all overflow-hidden"
        aria-label={`Browse ${category.name} deals – ${category.dealCount} deals available`}
      >
        {/* Gradient orb bg */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-8 transition-opacity rounded-2xl`}
          aria-hidden="true"
        />

        {/* Emoji */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl shadow-sm mb-3`}
          aria-hidden="true"
        >
          {category.emoji}
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-green-700 transition-colors">
          {category.name}
        </h3>

        {/* Deal count */}
        <p className="text-xs text-slate-400 mb-3">{category.dealCount} deals</p>

        {/* Arrow */}
        <div className="flex items-center gap-1 text-xs font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Browse
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </div>
      </Link>
    </motion.div>
  )
}
