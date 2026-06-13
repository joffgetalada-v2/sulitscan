import Link from "next/link"
import Logo from "@/components/Logo"
import { Mail, MapPin } from "lucide-react"

const footerLinks = {
  Discover: [
    { label: "All Deals",      href: "/deals" },
    { label: "Categories",     href: "/categories" },
    { label: "Partner Stores", href: "/stores" },
    { label: "Shopping Blog",  href: "/blog" },
  ],
  Company: [
    { label: "About",             href: "/about" },
    { label: "Contact",           href: "/contact" },
    { label: "Editorial Policy",  href: "/editorial-policy" },
  ],
  Legal: [
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    { label: "Privacy Policy",       href: "/privacy-policy" },
    { label: "Terms of Use",         href: "/terms" },
    { label: "Cookie Policy",        href: "/cookie-policy" },
  ],
}

const activePlatforms = ["Temu", "Sephora PH"]
const comingSoonPlatforms = ["Shopee", "Lazada", "AliExpress"]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400" role="contentinfo">

      {/* ── Affiliate disclosure banner ── */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center">
          <p className="text-xs text-amber-800">
            <strong>Affiliate Disclosure:</strong> SulitScan PH earns a small commission when you
            click affiliate links and make a purchase — at no extra cost to you. We only feature
            deals we believe offer genuine value.{" "}
            <Link
              href="/affiliate-disclosure"
              className="underline hover:text-amber-900 font-medium transition-colors"
            >
              Full disclosure →
            </Link>
          </p>
        </div>
      </div>

      {/* ── "Shop Smart" brand bar ── */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                The smarter way to shop online
              </p>
              <p className="text-2xl font-black text-white leading-tight">
                SulitScan PH — your deal intelligence layer.
              </p>
            </div>
            <Link
              href="/deals"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-900/30 hover:-translate-y-0.5"
            >
              Browse Deals
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Brand column */}
          <div className="md:col-span-2">
            <Logo dark size="md" className="mb-4" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-4">
              SulitScan PH helps Filipino shoppers find curated online deals, compare value,
              and shop smarter — without the fake urgency.
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:hello@sulitscan.com"
                  className="hover:text-green-400 transition-colors"
                >
                  hello@sulitscan.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Philippines 🇵🇭</span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mb-5">
              Product prices and discounts are manually added or sourced from affiliate datafeeds and may change anytime. Always confirm the final price, shipping, vouchers, availability, and return terms on the partner store before buying.
            </p>

            {/* Platforms list */}
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Active Stores
              </p>
              <ul className="space-y-1 mb-4" role="list">
                {activePlatforms.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-green-500 shrink-0" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Coming Soon
              </p>
              <ul className="space-y-1" role="list">
                {comingSoonPlatforms.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[11px] text-slate-600">
                    <span className="w-1 h-1 rounded-full bg-slate-700 shrink-0" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} SulitScan PH. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Made with care for Filipino shoppers
          </p>
        </div>
      </div>
    </footer>
  )
}
