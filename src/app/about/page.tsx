import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { LogoMark } from "@/components/Logo"
import { siteConfig } from "@/lib/seo"
import { ShieldCheck, Heart, BookOpen, ShoppingBag, CheckCircle, XCircle } from "lucide-react"

export const metadata: Metadata = {
  title: { absolute: "About SulitScan PH | Smarter Deal Discovery for Filipino Shoppers" },
  description:
    "Learn about SulitScan PH, a curated deals discovery site helping Filipino shoppers find genuinely sulit online deals from Temu, Shopee PH, and Sephora PH.",
  alternates: { canonical: `${siteConfig.url}/about` },
}

const values = [
  {
    icon: ShieldCheck,
    color: "text-green-600",
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
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Education",
    body: "We write guides to help you shop better, not just click more affiliate links.",
  },
]

const weDont = [
  "Sell products directly",
  "Have a cart, checkout, or payment system",
  "Auto-redirect you to affiliate links",
  "Use automated scrapers to pull deal data",
  "Guarantee prices, always check the store before buying",
]

const weDo = [
  "Manually curate deals with honest notes",
  "Check seller trust and review quality",
  "Note when vouchers can be stacked",
  "Label every affiliate link clearly",
  "Write guides to help you shop smarter",
]

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home",  url: siteConfig.url },
          { name: "About", url: `${siteConfig.url}/about` },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <LogoMark size={56} className="mx-auto mb-5" />
          <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 border border-green-100 rounded-full">
            About Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            About SulitScan PH
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
            A deals discovery site for Filipino shoppers who want to shop smarter, not just cheaper.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Mission */}
        <section className="mb-14" aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="text-xl font-black text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            SulitScan was built because finding a genuinely good deal online in the Philippines takes
            too much work. There are too many fake sales, inflated original prices, and misleading
            discount percentages.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our goal is simple: help Filipino shoppers find deals that are <em>actually</em> sulit,
            good value from trustworthy sellers, with transparent notes about what we checked and what
            you should watch out for.
          </p>
        </section>

        {/* Values */}
        <section className="mb-14" aria-labelledby="values-heading">
          <h2 id="values-heading" className="text-xl font-black text-slate-900 mb-6">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center mb-3`}>
                  <v.icon className={`w-5 h-5 ${v.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* We do / we don't */}
        <section className="mb-14" aria-labelledby="commitment-heading">
          <h2 id="commitment-heading" className="text-xl font-black text-slate-900 mb-6">Our Commitments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 bg-green-50 border border-green-100 rounded-2xl">
              <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" aria-hidden="true" /> What we do
              </h3>
              <ul className="space-y-2" role="list">
                {weDo.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-green-700">
                    <span className="shrink-0 mt-0.5" aria-hidden="true">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-slate-400" aria-hidden="true" /> What we don&apos;t do
              </h3>
              <ul className="space-y-2" role="list">
                {weDont.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                    <span className="shrink-0 mt-0.5" aria-hidden="true">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Affiliate disclosure */}
        <section className="mb-14 p-5 bg-amber-50 border border-amber-200 rounded-2xl" aria-labelledby="disclosure-heading">
          <h2 id="disclosure-heading" className="text-sm font-bold text-amber-900 mb-2">
            Affiliate Disclosure
          </h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            SulitScan is an affiliate marketing website. We earn a small commission when you click
            our affiliate links and make a purchase, at no extra cost to you. All affiliate links are
            clearly labeled, and we only feature deals we believe offer genuine value.{" "}
            <Link href="/affiliate-disclosure" className="underline font-medium hover:text-amber-900">
              Full disclosure →
            </Link>
          </p>
        </section>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            Browse Deals
          </Link>
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
