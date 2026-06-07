"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "@/components/Logo"

const navLinks = [
  { label: "Deals",      href: "/deals" },
  { label: "Categories", href: "/categories" },
  { label: "Stores",     href: "/stores" },
  { label: "Blog",       href: "/blog" },
  { label: "About",      href: "/about" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header role="banner" className="sticky top-0 z-50 w-full">
      {/* ── Announcement bar ── */}
      <div className="announcement-gradient py-2 px-4 text-center text-xs text-white font-medium">
        <Sparkles className="inline w-3 h-3 mr-1 opacity-80" aria-hidden="true" />
        New deals added weekly —{" "}
        <Link
          href="/deals"
          className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Browse what&apos;s fresh →
        </Link>
      </div>

      {/* ── Main nav bar ── */}
      <div
        className={cn(
          "w-full transition-all duration-300",
          scrolled
            ? "bg-white/96 backdrop-blur-lg shadow-sm border-b border-slate-100/80"
            : "bg-white/80 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-green-700 hover:bg-green-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-2">
              <Link
                href="/deals"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full transition-all shadow-sm shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-px"
                aria-label="Browse all deals"
              >
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                Browse Deals
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
            className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-lg"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 pt-3 pb-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-3 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-green-50 hover:text-green-700 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/deals"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  Browse Deals
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
