import Link from "next/link"
import { Zap, Heart } from "lucide-react"

const footerLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Shop: [
    { label: "All Deals", href: "/deals" },
    { label: "Categories", href: "/categories" },
    { label: "Partner Stores", href: "/stores" },
  ],
  Legal: [
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Disclaimer", href: "/terms#disclaimer" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300" role="contentinfo">
      {/* Disclosure banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center">
          <p className="text-xs text-amber-800">
            <strong>Affiliate Disclosure:</strong> SulitScan PH earns a commission when you click affiliate
            links and make a purchase — at no extra cost to you. We only feature deals we believe offer genuine
            value.{" "}
            <Link href="/affiliate-disclosure" className="underline hover:text-amber-900">
              Learn more
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="SulitScan PH home">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600">
                <Zap className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-white">
                Sulit<span className="text-green-400">Scan</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find deals that are actually sulit. Curated online shopping deals for Filipino shoppers.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Demo deals only. No live pricing. Always check the store before buying.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {group}
              </h3>
              <ul className="space-y-2" role="list">
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

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SulitScan PH. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            Made with <Heart className="w-3 h-3 text-rose-400 fill-rose-400 mx-0.5" aria-hidden="true" /> for Filipino shoppers.
          </p>
        </div>
      </div>
    </footer>
  )
}
