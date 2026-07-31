import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, CheckCircle2, ExternalLink, ReceiptText } from "lucide-react"
import { ExternalAffiliateLink } from "@/components/ExternalAffiliateLink"
import { BreadcrumbJsonLd, FAQJsonLd } from "@/components/SeoJsonLd"
import { stores } from "@/data/stores"
import { siteConfig } from "@/lib/seo"

const pageUrl = `${siteConfig.url}/sales-calendar`
const heroImage = `${siteConfig.url}/images/guides/shopping-sale-calendar-philippines.webp`

export const metadata: Metadata = {
  title: { absolute: "Philippines Online Shopping Sale Calendar 2026" },
  description:
    "A buyer-first Philippine shopping sale calendar for planning around common double-day dates, payday periods, seasonal buying, and final checkout checks.",
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Philippines Online Shopping Sale Calendar 2026",
    description:
      "Plan purchases around common Philippine shopping dates, then confirm current retailer terms before checkout.",
    url: pageUrl,
    type: "website",
    images: [{ url: heroImage, width: 1600, height: 900, alt: "Calendar planning for common Philippine online shopping sale dates" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Philippines Online Shopping Sale Calendar 2026",
    description:
      "Plan purchases around common Philippine shopping dates, then confirm current retailer terms before checkout.",
    images: [heroImage],
  },
}

const doubleDayDates = Array.from({ length: 12 }, (_, index) => {
  const month = index + 1
  return `${month}.${month}`
})

const faqItems = [
  {
    question: "Are these confirmed retailer sale dates?",
    answer:
      "No. These are common planning patterns, not promised retailer events. Confirm each retailer or app's live schedule, terms, and eligible items before buying.",
  },
  {
    question: "How should I use a double-day date?",
    answer:
      "Use it as a reminder to compare an exact variant, record a reference price, and check the delivered total. It does not guarantee a discount or merchant participation.",
  },
  {
    question: "What should I check before I pay?",
    answer:
      "Confirm the item and variant, shipping, applicable vouchers, payment restrictions, delivery deadline, return route, and final total in the retailer or app checkout.",
  },
  {
    question: "Why can a final price differ from a planned price?",
    answer:
      "Prices, stock, vouchers, shipping, payment rules, and eligibility can change. Recheck the live retailer or app listing and checkout before placing an order.",
  },
]

const partnerStores = stores.filter((store) => ["temu", "shopee-ph", "sephora-ph"].includes(store.slug))

export default function SalesCalendarPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Philippines online shopping sale calendar", url: pageUrl },
        ]}
      />
      <FAQJsonLd items={faqItems} />

      <section className="border-b border-slate-100 bg-gradient-to-br from-green-50 via-white to-amber-50 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-green-700">Home</Link>
            <span aria-hidden="true"> / </span>
            <span>Sale calendar</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-green-700">Buyer planning guide</p>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Philippines Online Shopping Sale Calendar 2026
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Use common shopping-date patterns to plan what to compare—not to assume a promotion.
                Sale dates, vouchers, stock, prices, eligibility, and merchant participation can change
                and must be confirmed on the retailer or app before checkout.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Last reviewed: <time dateTime="2026-07-31">July 31, 2026</time>.
              </p>
            </div>
            <Image
              src="/images/guides/shopping-sale-calendar-philippines.webp"
              alt="Calendar planning for common Philippine online shopping sale dates"
              width={1600}
              height={900}
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="h-auto w-full rounded-3xl border border-slate-200 object-cover shadow-lg"
              preload
            />
          </div>
        </div>
      </section>

      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-14 px-4 sm:px-6 lg:px-8">
          <section aria-labelledby="double-day-heading">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">Common date patterns</p>
              <h2 id="double-day-heading" className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                Twelve double-day planning anchors
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                These dates are common calendar patterns that can help you prepare a shortlist. They do not indicate that any named retailer participates or that a discount will be available.
              </p>
            </div>
            <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Common double-day dates">
              {doubleDayDates.map((date) => (
                <li key={date} className="rounded-2xl border border-green-100 bg-green-50 px-4 py-5 text-center">
                  <span className="block text-2xl font-black text-green-800">{date}</span>
                  <span className="mt-1 block text-xs text-green-700">Common planning date</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-950 p-7 text-slate-100">
              <CalendarDays className="h-7 w-7 text-amber-300" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black">Payday and seasonal planning</h2>
              <p className="mt-3 leading-relaxed text-slate-300">
                Around the middle and end of each month, revisit your list and confirm the live retailer schedule instead of relying on a calendar. Useful seasonal themes for Filipino shoppers include back-to-school, rainy-season home preparation, travel and gifting, 11.11, and year-end or 12.12 planning. These are buying themes, not promotion promises.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <ReceiptText className="h-7 w-7 text-green-700" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black text-slate-900">Use live deal notes and a final-total comparison</h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                Start with current notes on the site, then compare the actual delivered totals for the exact items you are considering.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/deals" className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700">Browse current deal notes</Link>
                <Link href="/tools/checkout-comparison" className="rounded-full border border-green-700 px-5 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-50">Compare checkout totals</Link>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Before-sale checklist</h2>
              <ul className="mt-5 space-y-3 text-slate-700">
                {[
                  "Set a delivered-total budget, not only a listed-price target.",
                  "Shortlist the exact size, color, bundle, and quantity you would accept.",
                  "Record a reference price so you can compare rather than react to a countdown.",
                  "Check the seller or store and read relevant buyer reviews.",
                  "Check return, warranty, and support terms before you need them.",
                  "Avoid buying only because a countdown creates pressure.",
                ].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Final checkout checklist</h2>
              <ul className="mt-5 space-y-3 text-slate-700">
                {[
                  "Confirm the item, variant, and quantity.",
                  "Check shipping charges and the delivery deadline.",
                  "Apply only vouchers that actually apply to your cart.",
                  "Review payment restrictions before placing the order.",
                  "Confirm the return route and who handles it.",
                  "Compare the complete total cost before paying.",
                ].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
          </section>

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-7" aria-labelledby="partner-heading">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Sponsored partner links</p>
            <h2 id="partner-heading" className="mt-2 text-2xl font-black text-slate-900">Check current terms directly with partner stores</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">SulitScan may earn a commission if you buy through these links, at no extra cost to you. Confirm current availability, prices, vouchers, and eligibility on the partner store.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {partnerStores.map((store) => store.affiliateLink && (
                <ExternalAffiliateLink
                  key={store.slug}
                  href={store.affiliateLink}
                  platform={store.name}
                  offerId={store.slug}
                  placement="sales-calendar-store"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Check {store.name}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </ExternalAffiliateLink>
              ))}
            </div>
          </section>

          <section aria-labelledby="faq-heading" className="mx-auto max-w-4xl">
            <h2 id="faq-heading" className="text-2xl font-black text-slate-900">Frequently asked questions</h2>
            <div className="mt-5 space-y-3">
              {faqItems.map((item) => (
                <details key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <summary className="cursor-pointer font-bold text-slate-900">{item.question}</summary>
                  <p className="mt-3 leading-relaxed text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-600">Need a store-specific starting point? Browse our <Link href="/stores" className="font-semibold text-green-700 underline underline-offset-2">partner store notes</Link> or read the latest <Link href="/blog" className="font-semibold text-green-700 underline underline-offset-2">shopping guides</Link>.</p>
          </section>
        </div>
      </div>
    </>
  )
}
