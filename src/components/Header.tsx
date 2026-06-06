"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Deals", href: "/deals" },
  { label: "Categories", href: "/categories" },
  { label: "Stores", href: "/stores" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-white/80 backdrop-blur-sm"
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="SulitScan PH home"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 shadow-sm group-hover:shadow-green-200 transition-shadow">
              <Zap className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Sulit<span className="text-green-500">Scan</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/deals"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-green-200"
              aria-label="View all deals"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              View Deals
            </Link>

            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/deals"
              className="flex items-center justify-center gap-2 mt-3 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              View Deals
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
