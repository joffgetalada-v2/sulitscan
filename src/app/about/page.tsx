import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"
import { Zap, ShieldCheck, Heart, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "About SulitScan PH | Smarter Deal Discovery for Filipino Shoppers",
  description:
    "Learn about SulitScan PH — a curated deals discovery site helping Filipino shoppers find genuinely sulit online deals from Shopee, Lazada, AliExpress, and more.",
  alternates: { canonical: `${siteConfig.url}/about` },
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "About", url: `${siteConfig.url}/about` },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg mb-5">
            <Zap className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            About SulitScan PH
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            A deals discovery site for Filipino shoppers who want to shop smarter — not just cheaper.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission */}
        <section className="mb-12" aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="text-xl font-bold text-slate-900 mb-4">
            Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            SulitScan was built because finding a genuinely good deal online in the Philippines takes
            too much work. There are too many fake sales, inflated original prices, and misleading
            discount percentages.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our goal is simple: help Filipino shoppers find deals that are <em>actually</em> sulit —
            good value from trustworthy sellers, with transparent notes about what we checked and what
            you should watch out for.
          </p>
        </section>

        {/* Values */}
        <section className="mb-12" aria-labelledby="values-heading">
          <h2 id="values-heading" className="text-xl font-bold text-slate-900 mb-6">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                color: "text-green-500",
                bg: "bg-green-50",
                title: "Transparency",
                body: "Every deal has a note explaining why we featured it. No black-box recommendations.",
              },
              {
                icon: Heart,
                color: "text-rose-500",
                bg: "bg-rose-50",
                title: "Filipino-First",
                body: "We think about Filipino sizing, peso pricing, local shipping, and PH-specific platforms.",
              },
              {
                icon: BookOpen,
                color: "text-blue-500",
                bg: "bg-blue-50",
                title: "Education",
                body: "We write guides to help you shop better — not just click more affiliate links.",
              },
            ].map((v) => (
              <div key={v.title} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center mb-3`}>
                  <v.icon className={`w-5 h-5 ${v.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliate disclosure */}
        <section className="mb-12 p-5 bg-amber-50 border border-amber-200 rounded-xl" aria-labelledby="disclosure-heading">
          <h2 id="disclosure-heading" className="text-sm font-bold text-amber-900 mb-2">
            Affiliate Disclosure
          </h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            SulitScan is an affiliate marketing website. We earn a small commission when you click
            our affiliate links and make a purchase — at no extra cost to you. This is how we
            support the site. All affiliate links are clearly labeled, and we only feature deals we
            believe offer genuine value.{" "}
            <Link href="/affiliate-disclosure" className="underline font-medium">
              Full disclosure
            </Link>
          </p>
        </section>

        {/* What we don't do */}
        <section className="mb-12" aria-labelledby="dont-heading">
          <h2 id="dont-heading" className="text-xl font-bold text-slate-900 mb-4">
            What We Don&apos;t Do
          </h2>
          <ul className="space-y-2" role="list">
            {[
              "We do not sell products directly.",
              "We do not have a cart, checkout, or payment system.",
              "We do not auto-redirect you to affiliate links.",
              "We do not scrape Shopee, Lazada, AliExpress, or any marketplace.",
              "We do not guarantee prices — always check the store before buying.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-green-500 shrink-0 mt-0.5" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-sm hover:shadow-green-200 transition-all"
          >
            Browse Deals
          </Link>
          <span className="mx-3 text-slate-300">or</span>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:border-green-200 hover:text-green-700 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  )
}
