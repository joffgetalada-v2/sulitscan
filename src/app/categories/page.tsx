import type { Metadata } from "next"
import Link from "next/link"
import CategoryCard from "@/components/CategoryCard"
import { BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import { categories } from "@/data/categories"
import { getDealsByCategory } from "@/data/deals"
import { siteConfig } from "@/lib/seo"
import { LayoutGrid, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { formatDealCount } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Shopping Deal Categories Philippines",
  description:
    "Browse SulitScan deals by category, Under ₱500, Tech & Gadgets, Home Finds, Beauty, Fashion, and Gift Ideas. Curated deals for Filipino shoppers with buyer notes on every listing.",
  alternates: { canonical: `${siteConfig.url}/categories` },
  openGraph: {
    title: "Shopping Deal Categories Philippines | SulitScan PH",
    description:
      "Browse curated online deals by category, budget picks, beauty, home finds, tech, fashion, and gift ideas for Filipino shoppers.",
    url: `${siteConfig.url}/categories`,
  },
}

const categoryFaqs = [
  {
    question: "How are deals organized into categories on SulitScan?",
    answer:
      "SulitScan organizes deals by product type and shopper intent. Budget categories (Under ₱500, Under ₱1,000) group deals by price range. Product categories (Beauty, Home Finds, Tech & Gadgets, Fashion, Gift Ideas) group deals by what you are shopping for. Every deal includes a SulitScore, buyer notes, a price disclaimer, and a link to report outdated prices.",
  },
  {
    question: "Are prices shown in categories the final prices?",
    answer:
      "No. Prices shown on SulitScan are sourced from affiliate datafeeds and may not reflect the current price on the partner store. Sale prices, platform vouchers, and promotions change frequently. Always confirm the final price on Temu, Shopee PH, or Sephora PH before completing your purchase.",
  },
  {
    question: "Which categories have the most deals right now?",
    answer:
      "The Under ₱500 and Home Finds categories currently have the most deals, followed by Beauty and Fashion. All categories show a live deal count next to the category name. We update deals as new affiliate offers become available.",
  },
  {
    question: "Can I filter deals by store within a category?",
    answer:
      "Not directly on category pages, but the main deals page (/deals) has filters for store, category, and sort order. You can also browse store-specific deals on the Temu, Shopee PH, or Sephora PH store pages.",
  },
]

export default function CategoriesPage() {
  const liveCounts = Object.fromEntries(
    categories.map((c) => [c.slug, getDealsByCategory(c.slug).length])
  )

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home",       url: siteConfig.url },
          { name: "Categories", url: `${siteConfig.url}/categories` },
        ]}
      />
      <FAQJsonLd items={categoryFaqs} />
      <ItemListJsonLd
        name="Shopping Deal Categories Philippines – SulitScan PH"
        items={categories.filter((c) => c.featured).map((c) => ({
          name: c.name,
          url: `${siteConfig.url}/categories/${c.slug}`,
          description: c.description,
        }))}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-green-700">
                Browse by category
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Shop deals by what you need
              </h1>
              <p className="text-slate-500 text-sm">
                {categories.filter((cat) => cat.featured).length} categories · Find exactly what you need at a price that&apos;s actually sulit.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Bento grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {categories.filter((cat) => cat.featured).map((cat) => (
            <CategoryCard key={cat.id} category={cat} liveCount={liveCounts[cat.slug]} large />
          ))}
        </div>

        {/* Category detail list */}
        <h2 className="text-xl font-black text-slate-900 mb-6">All categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {categories.filter((cat) => cat.featured).map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all"
              aria-label={`Browse ${cat.name} deals`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-xl shrink-0 shadow-sm`}
                aria-hidden="true"
              >
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-green-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{cat.description}</p>
                <span className="text-xs text-green-600 font-semibold mt-1 block">
                  {formatDealCount(liveCounts[cat.slug])} available
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-green-500 transition-colors shrink-0 mt-1" aria-hidden="true" />
            </Link>
          ))}
        </div>

        {/* Intro content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-bold text-slate-900">How to use SulitScan categories</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              SulitScan categories are designed to help Filipino shoppers find deals that match both their
              budget and their specific shopping needs. Whether you&apos;re looking for everyday home finds,
              beauty deals from Sephora PH, budget gadgets, or gift ideas under ₱500, each category page
              has curated deals with buyer notes and a SulitScore to help you decide before clicking buy.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Budget categories</strong>{" "}(Under ₱500, Under ₱1,000) group deals purely by price range.
              These are useful when you have a spending limit in mind and want to see everything available
              within that range across different product types.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Product categories</strong>{" "}(Beauty, Home Finds, Tech & Gadgets, Fashion, Gift Ideas)
              group deals by what you&apos;re shopping for. These pages include category-specific buyer guidance,
              what to check before buying beauty products, how to read Temu sizing, what to look for in
              home finds, and more.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every deal on SulitScan includes a price disclaimer reminding you that prices are sourced
              from affiliate datafeeds and may not match the current price on the partner store. Confirm
              the final price on <Link href="/stores/temu" className="text-green-600 hover:underline">Temu</Link>,{" "}
              <Link href="/stores/shopee-ph" className="text-green-600 hover:underline">Shopee PH</Link>, or{" "}
              <Link href="/stores/sephora-ph" className="text-green-600 hover:underline">Sephora PH</Link> before buying.
            </p>

            {/* How to use tips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <h3 className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                  Before you buy
                </h3>
                <ul className="space-y-1.5" role="list">
                  {[
                    "Check the SulitScore and buyer notes on each deal",
                    "Confirm the price is still current on the partner store",
                    "Look for platform vouchers that may stack on the sale price",
                    "Read the store-specific buyer guide before ordering",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-green-500 shrink-0 mt-2" aria-hidden="true" />
                      <span className="text-xs text-green-800 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  Important reminders
                </h3>
                <ul className="space-y-1.5" role="list">
                  {[
                    "Prices shown are from affiliate datafeeds, always confirm on the partner store",
                    "Temu sizing can run smaller than labeled, check the CM size guide",
                    "Sephora PH sale prices change frequently, verify before buying",
                    "Report outdated prices using the link on any deal card",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0 mt-2" aria-hidden="true" />
                      <span className="text-xs text-amber-800 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Active stores</h3>
              <ul className="space-y-2" role="list">
                <li>
                  <Link href="/stores/temu" className="text-sm text-green-600 hover:underline font-medium">
                    Temu →
                  </Link>
                  <p className="text-xs text-slate-400 mt-0.5">Budget finds: home, fashion, accessories</p>
                </li>
                <li>
                  <Link href="/stores/shopee-ph" className="text-sm text-green-600 hover:underline font-medium">
                    Shopee PH →
                  </Link>
                  <p className="text-xs text-slate-400 mt-0.5">Marketplace finds: home, tech, fashion, travel</p>
                </li>
                <li>
                  <Link href="/stores/sephora-ph" className="text-sm text-green-600 hover:underline font-medium">
                    Sephora PH →
                  </Link>
                  <p className="text-xs text-slate-400 mt-0.5">Premium beauty, skincare, fragrance</p>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Shopping guides</h3>
              <ul className="space-y-2" role="list">
                <li>
                  <Link href="/blog" className="text-sm text-green-600 hover:underline">All shopping guides →</Link>
                </li>
                <li>
                  <Link href="/deals" className="text-sm text-green-600 hover:underline">Browse all deals →</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <section aria-labelledby="faq-heading" className="mb-10">
          <h2 id="faq-heading" className="text-xl font-bold text-slate-900 mb-5">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {categoryFaqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-slate-100 rounded-xl shadow-sm">
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none select-none text-sm font-semibold text-slate-900 hover:text-green-700 transition-colors">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
