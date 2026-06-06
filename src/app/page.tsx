import type { Metadata } from "next"
import Link from "next/link"
import Hero from "@/components/Hero"
import DealCard from "@/components/DealCard"
import CategoryCard from "@/components/CategoryCard"
import SectionHeading from "@/components/SectionHeading"
import MotionMascot from "@/components/MotionMascot"
import { ItemListJsonLd, FAQJsonLd } from "@/components/SeoJsonLd"
import { deals, getFeaturedDeals } from "@/data/deals"
import { categories } from "@/data/categories"
import { getRecentPosts } from "@/data/posts"
import { siteConfig } from "@/lib/seo"
import { formatDate } from "@/lib/utils"
import {
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  BookOpen,
  ArrowRight,
  Clock,
} from "lucide-react"

export const metadata: Metadata = {
  title: "SulitScan PH | Verified Online Deals, Discounts, and Shopping Guides",
  description:
    "Find deals that are actually sulit. SulitScan PH helps Filipino shoppers discover curated online discounts, sale products, seller trust signals, and smart shopping guides.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "SulitScan PH | Verified Online Deals, Discounts, and Shopping Guides",
    description:
      "Find deals that are actually sulit. SulitScan PH helps Filipino shoppers discover curated online discounts, sale products, seller trust signals, and smart shopping guides.",
    url: siteConfig.url,
  },
}

const trustItems = [
  {
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-50",
    title: "Verified Deal Notes",
    body: "Every deal comes with a short note explaining why we picked it — no vague claims.",
  },
  {
    icon: ShoppingBag,
    color: "text-blue-500",
    bg: "bg-blue-50",
    title: "Seller Trust Signals",
    body: "We check seller ratings, review counts, and official store status before listing.",
  },
  {
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50",
    title: "Voucher Stack Reminders",
    body: "We note when platform or seller vouchers can be stacked for extra savings.",
  },
  {
    icon: Clock,
    color: "text-purple-500",
    bg: "bg-purple-50",
    title: "Last Checked Date",
    body: "Deals show when they were last verified. Prices change — always confirm before buying.",
  },
]

const howItWorks = [
  {
    step: "01",
    title: "We find deals",
    body: "We monitor Shopee, Lazada, AliExpress, Temu, iHerb, Klook, and more for real price drops.",
  },
  {
    step: "02",
    title: "We check basic value signals",
    body: "Seller trust, review quality, voucher availability, and historical pricing context.",
  },
  {
    step: "03",
    title: "We add useful notes",
    body: "Each deal card shows why we picked it, what to watch for, and an honest SulitScore.",
  },
  {
    step: "04",
    title: "You decide before buying",
    body: "We never auto-redirect. Every affiliate link is clearly labeled. You click when you're ready.",
  },
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
]

export default function HomePage() {
  const featuredDeals = getFeaturedDeals(6)
  const recentPosts = getRecentPosts(3)

  return (
    <>
      {/* JSON-LD */}
      <ItemListJsonLd
        name="Featured Online Deals Philippines – SulitScan PH"
        items={featuredDeals.map((d) => ({
          name: d.title,
          url: `${siteConfig.url}/deals/${d.slug}`,
          description: d.reason,
        }))}
      />
      <FAQJsonLd items={faqItems} />

      {/* Hero */}
      <Hero />

      {/* Affiliate disclosure */}
      <div className="bg-amber-50 border-y border-amber-200 py-3 px-4 text-center">
        <p className="text-xs text-amber-800 max-w-2xl mx-auto">
          <strong>Affiliate Disclosure:</strong> SulitScan earns a commission on qualifying purchases through
          affiliate links — at no extra cost to you.{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-amber-900">
            Learn more
          </Link>
        </p>
      </div>

      {/* Trust / Value section */}
      <section
        className="py-16 bg-white"
        aria-labelledby="trust-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Why SulitScan"
            title="We scan so you don't have to"
            subtitle="Before every deal is listed, we check what matters most to Filipino shoppers."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-start p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured deals */}
      <section
        className="py-16 bg-slate-50"
        aria-labelledby="featured-deals-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Featured Deals"
            title="Deals we think are worth your click"
            subtitle="Manually checked. SulitScored. Demo prices — always verify before buying."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-green-50 text-slate-700 hover:text-green-700 font-semibold rounded-full border border-slate-200 hover:border-green-200 transition-all shadow-sm"
            >
              See All Deals
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        className="py-16 bg-white"
        aria-labelledby="categories-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Shop by Category"
            title="Browse deals by what you need"
            subtitle="From budget finds to tech deals, beauty, travel, and more."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="py-16 bg-gradient-to-b from-slate-50 to-white"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="How SulitScan Works"
            title="Smart deals, transparent process"
            subtitle="No dark patterns. No fake scarcity. Just honest deal discovery."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div
                key={step.step}
                className="relative flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 -right-3 w-6 h-px bg-slate-200 z-10"
                    aria-hidden="true"
                  />
                )}
                <span className="text-3xl font-black text-green-100 mb-3 select-none">
                  {step.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Deal or Fake Sale */}
      <section
        className="py-16 bg-white"
        aria-labelledby="fake-sale-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-widest text-amber-700 uppercase bg-amber-100 rounded-full">
                Buyer&apos;s Guide
              </span>
              <h2
                id="fake-sale-heading"
                className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4"
              >
                Real Deal or Fake Sale?
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Not every &quot;sale&quot; is a real bargain. Here&apos;s what savvy Filipino shoppers
                check before clicking buy:
              </p>
              <ul className="space-y-3" role="list">
                {[
                  { emoji: "📊", text: "Price history — was the original price inflated?" },
                  { emoji: "⭐", text: "Seller trust — rating, reviews, and fulfillment record" },
                  { emoji: "💬", text: "Buyer reviews — do they match the product description?" },
                  { emoji: "🎟️", text: "Voucher availability — can you stack for extra savings?" },
                  { emoji: "🚚", text: "Shipping cost + speed — is free shipping actually free?" },
                ].map(({ emoji, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">{emoji}</span>
                    <span className="text-sm text-slate-600">{text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog/how-to-check-price-history-shopee-lazada"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-green-600 hover:text-green-700"
              >
                Read our price-check guide
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Right — animated scanner */}
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <MotionMascot />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section
        className="py-16 bg-slate-50"
        aria-labelledby="blog-preview-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Smart Shopping Guides"
            title="Read before you buy"
            subtitle="Tips, comparisons, and guides written for Filipino shoppers."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all overflow-hidden"
                aria-label={`Read: ${post.title}`}
              >
                <div
                  className={`h-28 bg-gradient-to-br ${post.coverGradient}`}
                  aria-hidden="true"
                />
                <div className="flex flex-col flex-1 p-4">
                  <span className="text-xs font-medium text-green-600 mb-1">{post.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                    <span className="text-xs text-slate-400">{formatDate(post.publishedAt)}</span>
                    <span className="text-xs text-slate-400">{post.readTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-green-50 text-slate-700 hover:text-green-700 font-semibold rounded-full border border-slate-200 hover:border-green-200 transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Read All Guides
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-16 bg-white"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="FAQ"
            title="Common questions"
          />
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group border border-slate-100 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors list-none">
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

      {/* CTA banner */}
      <section
        className="py-16 bg-gradient-to-r from-green-500 to-emerald-600"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="cta-heading"
            className="text-3xl font-black text-white mb-3"
          >
            Ready to find your next sulit deal?
          </h2>
          <p className="text-green-100 mb-8">
            Browse {deals.length}+ curated deals across Shopee, Lazada, AliExpress, Temu, and more.
          </p>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-green-50 text-green-700 font-bold rounded-full transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-500"
          >
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            Browse All Deals
          </Link>
        </div>
      </section>
    </>
  )
}
