import type { Metadata } from "next"
import Link from "next/link"
import Hero from "@/components/Hero"
import DealCard from "@/components/DealCard"
import CategoryCard from "@/components/CategoryCard"
import StoreCard from "@/components/StoreCard"
import BlogCard from "@/components/BlogCard"
import SectionHeading from "@/components/SectionHeading"
import { ItemListJsonLd, FAQJsonLd } from "@/components/SeoJsonLd"
import { deals, getFeaturedDeals } from "@/data/deals"
import { categories } from "@/data/categories"
import { stores } from "@/data/stores"
import { getRecentPosts } from "@/data/posts"
import { siteConfig } from "@/lib/seo"
import {
  TrendingDown,
  Shield,
  Tag,
  MessageSquare,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  ShoppingBag,
  Search,
  Zap,
  Clock,
} from "lucide-react"

export const metadata: Metadata = {
  title: "SulitScan PH | Verified Online Deals, Discounts, and Shopping Guides",
  description:
    "Find deals that are actually sulit. SulitScan PH helps Filipino shoppers discover curated online discounts, sale products, seller trust signals, and smart shopping guides.",
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: "SulitScan PH | Verified Online Deals, Discounts, and Shopping Guides",
    description:
      "Find deals that are actually sulit. SulitScan PH helps Filipino shoppers discover curated online discounts, sale products, seller trust signals, and smart shopping guides.",
    url: siteConfig.url,
  },
}

const intelligenceCards = [
  {
    icon: TrendingDown,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    title: "Price Drop Check",
    body: "We cross-reference current prices against historical data so you know if the deal is genuine.",
  },
  {
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    title: "Seller Trust",
    body: "Seller rating, review count, official store status, and fulfillment speed — all checked.",
  },
  {
    icon: Tag,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Voucher Stack",
    body: "We note when platform vouchers, seller vouchers, and coins can stack for extra savings.",
  },
  {
    icon: MessageSquare,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    title: "Buyer Notes",
    body: "Honest notes on what to watch out for: sizing, shipping time, quality flags, and more.",
  },
]

const howItWorks = [
  {
    step: "01",
    icon: Search,
    title: "We find deals",
    body: "We monitor Shopee, Lazada, AliExpress, Temu, iHerb, Klook, and more for genuine price drops.",
  },
  {
    step: "02",
    icon: Shield,
    title: "We verify value",
    body: "Seller trust, review quality, voucher availability, and historical pricing context.",
  },
  {
    step: "03",
    icon: Zap,
    title: "We add SulitNotes",
    body: "Each deal card shows why we picked it, what to watch for, and an honest SulitScore.",
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "You decide",
    body: "No auto-redirect. Every affiliate link is clearly labeled. You click when you're ready.",
  },
]

const scanChecklist = [
  { icon: TrendingDown, good: true,  label: "Price history", value: "Genuine drop from ₱2,499" },
  { icon: Shield,       good: true,  label: "Seller trust",  value: "Official Shopee Mall store" },
  { icon: MessageSquare,good: true,  label: "Buyer reviews", value: "4.9 ★ · 3,200+ reviews" },
  { icon: Tag,          good: true,  label: "Voucher stack", value: "Up to ₱150 stackable" },
  { icon: Clock,        good: false, label: "Shipping speed","value": "7–15 days (Cross-border)" },
  { icon: XCircle,      good: false, label: "Return policy", value: "Limited — check seller terms" },
]

const faqItems = [
  {
    question: "Is SulitScan free to use?",
    answer:
      "Yes, SulitScan is completely free for shoppers. We earn a small commission from affiliate links when you buy — at no extra cost to you.",
  },
  {
    question: "Are the deals on SulitScan real?",
    answer:
      "We manually curate deals and check basic value signals. However, all deals shown are sample/demo data. Prices change — always verify before buying.",
  },
  {
    question: "What is the SulitScan Score?",
    answer:
      "The SulitScan Score (1–10) reflects our assessment of deal quality based on discount authenticity, seller trust, review quality, and voucher stackability.",
  },
  {
    question: "Do you sell products directly?",
    answer:
      "No. SulitScan is a deals discovery and affiliate site. We help you find deals and link you to the store — we never handle payments or products.",
  },
  {
    question: "How do you choose which deals to feature?",
    answer:
      "We look for genuine discounts (not inflated originals), strong seller ratings, positive buyer reviews, and deals we'd actually buy ourselves.",
  },
]

export default function HomePage() {
  const featuredDeals = getFeaturedDeals(6)
  const recentPosts = getRecentPosts(3)
  const featuredStores = stores.slice(0, 4)

  return (
    <>
      <ItemListJsonLd
        name="Featured Online Deals Philippines – SulitScan PH"
        items={featuredDeals.map((d) => ({
          name: d.title,
          url: `${siteConfig.url}/deals/${d.slug}`,
          description: d.reason,
        }))}
      />
      <FAQJsonLd items={faqItems} />

      {/* ─── Hero ─── */}
      <Hero />

      {/* ─── Affiliate Disclosure strip ─── */}
      <div className="bg-amber-50 border-y border-amber-200 py-3 px-4 text-center">
        <p className="text-xs text-amber-800 max-w-2xl mx-auto">
          <strong>Affiliate Disclosure:</strong> SulitScan earns a small commission on qualifying purchases through
          affiliate links — at no extra cost to you.{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-amber-900 font-medium">
            Full disclosure →
          </Link>
        </p>
      </div>

      {/* ─── Deal Intelligence ─── */}
      <section className="py-20 bg-white" aria-labelledby="intelligence-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="intelligence-heading"
            tag="Deal Intelligence"
            title="We scan so you don't have to"
            subtitle="Before every deal is listed, we check what matters most to Filipino shoppers."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {intelligenceCards.map((card) => (
              <div
                key={card.title}
                className={`flex flex-col p-5 rounded-2xl border ${card.border} ${card.bg} hover:shadow-md transition-shadow`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Deals ─── */}
      <section className="py-20 bg-slate-50" aria-labelledby="featured-deals-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 border border-green-100 rounded-full">
                Featured Deals
              </span>
              <h2 id="featured-deals-heading" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Deals worth your click
              </h2>
              <p className="mt-2 text-slate-500 text-sm">Manually checked. Demo prices — always verify before buying.</p>
            </div>
            <Link
              href="/deals"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              See all {deals.length} deals <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-green-200 hover:text-green-700 transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              See All {deals.length} Deals
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Category Bento Grid ─── */}
      <section className="py-20 bg-white" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="categories-heading"
            tag="Shop by Category"
            title="Browse deals by what you need"
            subtitle="From budget finds to tech deals, beauty, travel, and more."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-green-600 hover:text-green-700 border border-green-200 hover:border-green-300 rounded-full transition-all"
            >
              Browse All Categories
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Partner Stores ─── */}
      <section className="py-20 bg-slate-50" aria-labelledby="stores-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 border border-green-100 rounded-full">
                Partner Stores
              </span>
              <h2 id="stores-heading" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Where we find deals
              </h2>
            </div>
            <Link
              href="/stores"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              All stores <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 bg-white" aria-labelledby="how-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="how-heading"
            tag="How SulitScan Works"
            title="Smart deals, transparent process"
            subtitle="No dark patterns. No fake scarcity. Just honest deal discovery."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                {/* Connector */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-slate-200 z-10" aria-hidden="true" />
                )}
                {/* Step number */}
                <span className="text-4xl font-black text-slate-100 mb-3 select-none leading-none">{step.step}</span>
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <step.icon className="w-4.5 h-4.5 text-green-600" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Real Deal or Fake Sale ─── */}
      <section className="py-20 bg-slate-50" aria-labelledby="fake-sale-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: copy */}
            <div>
              <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-amber-700 bg-amber-50 border border-amber-100 rounded-full">
                Buyer&apos;s Guide
              </span>
              <h2 id="fake-sale-heading" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4">
                Real deal or fake sale?
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Not every &quot;sale&quot; is a real bargain. Here&apos;s what savvy Filipino shoppers
                check before clicking buy:
              </p>
              <ul className="space-y-3 mb-6" role="list">
                {[
                  "Is the original price realistic compared to similar products?",
                  "Does the seller have high ratings and a long track record?",
                  "Do buyer reviews match the product description?",
                  "Can platform or seller vouchers be stacked?",
                  "Is free shipping truly free or offset by a higher product price?",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog/how-to-check-price-history-shopee-lazada"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
              >
                Read our price-check guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Right: scanner checklist visual */}
            <div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Scanning deal</p>
                    <p className="text-sm font-bold text-slate-900">Xiaomi Smart Band 9</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" aria-hidden="true" />
                    Scanning...
                  </span>
                </div>
                {/* Checklist */}
                <ul className="divide-y divide-slate-50" role="list">
                  {scanChecklist.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 px-5 py-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.good ? "bg-green-50" : "bg-red-50"}`}>
                        <item.icon className={`w-3.5 h-3.5 ${item.good ? "text-green-600" : "text-red-400"}`} aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-500">{item.label}</div>
                        <div className={`text-xs font-medium ${item.good ? "text-slate-800" : "text-slate-500"}`}>{item.value}</div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.good ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
                        {item.good ? "Pass" : "Note"}
                      </span>
                    </li>
                  ))}
                </ul>
                {/* Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Overall SulitScore</span>
                    <span className="text-sm font-black text-green-600">8 / 10 — Good Deal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Blog preview ─── */}
      <section className="py-20 bg-white" aria-labelledby="blog-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 border border-green-100 rounded-full">
                Shopping Guides
              </span>
              <h2 id="blog-heading" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Read before you buy
              </h2>
              <p className="mt-2 text-slate-500 text-sm">Tips, comparisons, and guides for Filipino shoppers.</p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              All guides <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-green-200 hover:text-green-700 transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Read All Guides
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 bg-slate-50" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading id="faq-heading" tag="FAQ" title="Common questions" />
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="group bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors list-none select-none">
                  {item.question}
                  <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg leading-none shrink-0" aria-hidden="true">
                    ↓
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="relative py-20 bg-slate-900 overflow-hidden" aria-labelledby="cta-heading">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} aria-hidden="true" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-green-500/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-green-400 bg-green-400/10 rounded-full border border-green-400/20">
            Ready to shop smarter?
          </span>
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Find your next sulit deal today.
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Browse {deals.length}+ curated deals across Shopee, Lazada, AliExpress, Temu, and more.
            No auto-redirect. No fake urgency. Just honest deals.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              Browse All Deals
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors border border-white/20"
            >
              <BookOpen className="w-5 h-5" aria-hidden="true" />
              Read Guides
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
