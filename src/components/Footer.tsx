import Link from "next/link"
import Logo from "@/components/Logo"
import { Heart } from "lucide-react"

const footerLinks = {
  Discover: [
    { label: "All Deals",      href: "/deals" },
    { label: "Categories",     href: "/categories" },
    { label: "Partner Stores", href: "/stores" },
    { label: "Shopping Blog",  href: "/blog" },
  ],
  Company: [
    { label: "About",   href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    { label: "Privacy Policy",       href: "/privacy-policy" },
    { label: "Terms of Use",         href: "/terms" },
  ],
}

const platforms = ["Shopee PH", "Lazada PH", "AliExpress", "Temu", "SHEIN", "iHerb", "Trip.com", "Klook"]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400" role="contentinfo">
      {/* Affiliate disclosure banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center">
          <p className="text-xs text-amber-800">
            <strong>Affiliate Disclosure:</strong> SulitScan PH earns a small commission when you click affiliate
            links and make a purchase — at no extra cost to you. We only feature deals we believe offer genuine value.{" "}
            <Link href="/affiliate-disclosure" className="underline hover:text-amber-900 font-medium">
              Full disclosure →
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Logo dark size="md" className="mb-4" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              SulitScan PH helps Filipino shoppers find curated online deals, compare value,
              and shop smarter — without the fake urgency.
            </p>
            <p className="mt-4 text-xs text-slate-600 leading-relaxed max-w-xs">
              All deals are sample/demo data. Always verify prices before buying.
              No cart, checkout, or payment features on this site.
            </p>

            {/* Platforms list */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Partner platforms</p>
              <div className="flex flex-wrap gap-1.5">
                {platforms.map((p) => (
                  <span key={p} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md">{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">{group}</h3>
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

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} SulitScan PH. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-600">
            Made with{" "}
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 mx-0.5" aria-hidden="true" />{" "}
            for Filipino shoppers
          </p>
        </div>
      </div>
    </footer>
  )
}
