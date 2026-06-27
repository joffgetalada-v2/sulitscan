import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"
import { ShieldCheck, FileText, RefreshCw, Tag, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: { absolute: "Editorial Policy | SulitScan PH" },
  description:
    "How SulitScan PH selects, reviews, and publishes deal notes and shopping guides, our standards for accuracy, affiliate disclosure, and buyer fairness.",
  alternates: { canonical: `${siteConfig.url}/editorial-policy` },
}

const sections = [
  {
    icon: ShieldCheck,
    title: "How we select deals",
    body: [
      "SulitScan PH publishes deal notes sourced from affiliate datafeeds and manual research. We do not accept payment to feature deals or promote specific products.",
      "Deals are selected based on discount percentage, SulitScore (a composite value rating), and relevance to Filipino shoppers. We prioritise deals with verifiable price history and clear buyer reminders.",
      "We currently feature three partner stores: Temu, Shopee PH, and Sephora PH, where we have affiliate arrangements. We do not feature stores we cannot disclose commercially.",
    ],
  },
  {
    icon: Tag,
    title: "Affiliate relationships",
    body: [
      "SulitScan PH participates in affiliate programmes. When you click a partner link and make a purchase, we may earn a small commission, at no extra cost to you.",
      "All affiliate links are labelled and use rel=\"sponsored nofollow noopener noreferrer\". Every deal page includes an affiliate disclosure notice.",
      "Our editorial decisions are not influenced by affiliate commission rates. If a deal scores poorly on buyer reminders or value, we do not feature it.",
    ],
  },
  {
    icon: AlertCircle,
    title: "Price accuracy and disclaimers",
    body: [
      "Prices displayed on SulitScan PH are sourced from affiliate datafeeds and may not reflect the current price on the partner store. Prices can change at any time without notice.",
      "Always confirm the current price, vouchers, availability, and shipping costs on the partner store before completing a purchase.",
      "We are not responsible for price discrepancies between what is shown on SulitScan PH and what appears on the partner store at the time of your purchase.",
    ],
  },
  {
    icon: FileText,
    title: "Shopping guides and blog posts",
    body: [
      "Shopping guides on SulitScan PH are written to help Filipino shoppers make more informed purchasing decisions. They include buyer tips, category overviews, and general guidance, not product endorsements.",
      "We do not publish fake reviews, fabricated testimonials, or artificial urgency (e.g. fake countdowns, fake stock levels). All content is written or reviewed by the SulitScan editorial team.",
      "Where guides reference specific products or stores, those references may be connected to affiliate relationships that are clearly disclosed.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Content updates and corrections",
    body: [
      "Deal notes are updated when affiliate datafeed prices change or when we receive reports of outdated information. Each deal card shows the date it was last checked.",
      "If you notice outdated pricing, a broken affiliate link, or inaccurate content, please report it using the 'Report outdated price' link on any deal card, or contact us directly.",
      "We review and correct content on an ongoing basis. Significant corrections to shopping guides are noted at the top of the affected post.",
    ],
  },
]

export default function EditorialPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home",             url: siteConfig.url },
          { name: "Editorial Policy", url: `${siteConfig.url}/editorial-policy` },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-green-700">
            Transparency
          </span>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Editorial Policy
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
            SulitScan PH is a neutral shopping assistant, not a seller, not an endorser.
            This page explains how we select deals, disclose affiliate relationships, and maintain
            accuracy across our content.
          </p>
          <p className="text-xs text-slate-400 mt-4">Last reviewed: June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {sections.map(({ icon: Icon, title, body }) => (
          <section key={title} aria-labelledby={title.toLowerCase().replace(/\s+/g, "-")}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-green-600" aria-hidden="true" />
              </div>
              <h2
                id={title.toLowerCase().replace(/\s+/g, "-")}
                className="text-lg font-bold text-slate-900 pt-1.5"
              >
                {title}
              </h2>
            </div>
            <div className="pl-14 space-y-3">
              {body.map((paragraph, i) => (
                <p key={i} className="text-sm text-slate-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        {/* Contact */}
        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <h2 className="text-base font-bold text-slate-900 mb-2">Questions or corrections?</h2>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            If you have a question about our editorial process, want to report inaccurate content,
            or believe a deal note is misleading, please get in touch.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Contact us
          </Link>
        </div>

        {/* Related links */}
        <div className="flex flex-wrap gap-3 pt-2 text-sm">
          <Link href="/affiliate-disclosure" className="text-green-600 hover:underline">
            Affiliate Disclosure →
          </Link>
          <Link href="/privacy-policy" className="text-green-600 hover:underline">
            Privacy Policy →
          </Link>
          <Link href="/terms" className="text-green-600 hover:underline">
            Terms of Use →
          </Link>
        </div>
      </div>
    </>
  )
}
