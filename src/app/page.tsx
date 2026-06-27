import type { Metadata } from "next"
import Link from "next/link"
import Hero from "@/components/Hero"
import DealCard from "@/components/DealCard"
import CategoryCard from "@/components/CategoryCard"
import BlogCard from "@/components/BlogCard"
import SectionHeading from "@/components/SectionHeading"
import PartnerBanners from "@/components/PartnerBanners"
import { ItemListJsonLd, FAQJsonLd } from "@/components/SeoJsonLd"
import { homePartnerBanners } from "@/data/partner-banners"
import { getFeaturedDeals, getActiveDeals, getDealsByCategory } from "@/data/deals"
import { categories } from "@/data/categories"
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
  title: { absolute: "SulitScan PH | Curated Online Deals and Shopping Guides for Filipino Shoppers" },
  description:
    "SulitScan PH helps Filipino shoppers find curated online deals with honest buyer notes, fake-discount checks, and smart shopping guides for Temu, Shopee PH, and Sephora PH.",
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: "SulitScan PH | Curated Online Deals and Shopping Guides for Filipino Shoppers",
    description:
      "Find deals that are actually sulit. SulitScan PH helps Filipino shoppers discover curated online deals, buyer notes, affiliate disclosures, and smart shopping guides before clicking buy.",
    url: siteConfig.url,
  },
}

const intelligenceCards = [
  {
    icon: TrendingDown,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    title: "Price Check",
    body: "We add price-check reminders and value notes so you know what to compare before you click.",
  },
  {
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    title: "Store Trust Note",
    body: "We add context on the partner store: Temu and Shopee PH for budget finds, Sephora PH for beauty and skincare notes.",
  },
  {
    icon: Tag,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Voucher Reminder",
    body: "We note when platform vouchers, first-order discounts, or loyalty points can add extra savings.",
  },
  {
    icon: MessageSquare,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    title: "Buyer Notes",
    body: "Honest notes on what to check: sizing, shipping time, return policy, and quality expectations.",
  },
]

const howItWorks = [
  {
    step: "01",
    icon: Search,
    title: "We find deals",
    body: "We monitor Temu, Shopee PH, and Sephora PH through affiliate programs for value picks worth checking.",
  },
  {
    step: "02",
    icon: Shield,
    title: "We add context",
    body: "Buyer notes, voucher reminders, shipping estimates, and an honest SulitScore for every deal.",
  },
  {
    step: "03",
    icon: Zap,
    title: "We disclose clearly",
    body: "Every affiliate link is labeled. We may earn a commission, but it does not affect your price.",
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "You decide",
    body: "No auto-redirect. No fake scarcity. You click through to the partner store only when you're ready.",
  },
]

const scanChecklist = [
  { icon: TrendingDown, good: true,  label: "Price plausibility",  value: "Similar products range ₱800–₱1,100" },
  { icon: Shield,       good: true,  label: "Store context",       value: "Sephora PH, authorized retailer" },
  { icon: MessageSquare,good: true,  label: "Buyer reviews",       value: "4.7 ★ · check on partner store" },
  { icon: Tag,          good: true,  label: "Loyalty points",      value: "Beauty Rewards applicable" },
  { icon: Clock,        good: false, label: "Shipping speed",      value: "3–7 days standard (Sephora PH)" },
  { icon: XCircle,      good: false, label: "Return policy",       value: "Opened items, non-returnable" },
]

const faqItems = [
  {
    question: "Is SulitScan free to use?",
    answer:
      "Yes, SulitScan is completely free for shoppers. We may earn a small commission from affiliate links when you buy, at no extra cost to you.",
  },
  {
    question: "Which stores does SulitScan currently cover?",
    answer:
      "Right now, SulitScan features selected deals from Temu, Shopee PH, and Sephora PH. We may add more reviewed partner stores later.",
  },
  {
    question: "Are the prices on SulitScan live and accurate?",
    answer:
      "Prices are sourced from affiliate datafeeds and may not reflect the current price on the partner store. Always confirm on Temu, Shopee PH, or Sephora PH before completing your purchase.",
  },
  {
    question: "What is the SulitScan Score?",
    answer:
      "The SulitScan Score (1–10) reflects our assessment of deal quality based on discount authenticity, store trust, review signals, voucher potential, and shipping context.",
  },
  {
    question: "Do you sell products directly?",
    answer:
      "No. SulitScan is a deals discovery and affiliate site. We help you find deals and link you to the partner store, we never handle payments or products.",
  },
  {
    question: "Are SulitScan affiliate links free for me to click?",
    answer:
      "Yes. Affiliate links are free to click. If you purchase through our link, the partner store pays us a small referral commission. Your final price is not affected.",
  },
]

export default function HomePage() {
  const featuredDeals  = getFeaturedDeals(6)
  const activeDeals    = getActiveDeals()
  const recentPosts    = getRecentPosts(3)
  const liveCounts     = Object.fromEntries(
    categories.map((c) => [c.slug, getDealsByCategory(c.slug).length])
  )

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
      <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center">
        <p className="text-xs text-amber-800 max-w-2xl mx-auto">
          <strong>Affiliate Disclosure:</strong> SulitScan earns a small commission on qualifying
          purchases through partner links, at no extra cost to you.{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-amber-900 font-medium">
            Full disclosure →
          </Link>
        </p>
      </div>

      {/* ─── Trust badges ─── */}
      <section className="py-8 bg-white border-b border-slate-100" aria-label="Trust signals">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {[
              { icon: "🛒", label: "No checkout or cart" },
              { icon: "🔒", label: "No hidden redirects" },
              { icon: "📢", label: "Affiliate links disclosed" },
              { icon: "✋", label: "Curated manually" },
              { icon: "🏪", label: "3 partner stores" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate-600">
                <span aria-hidden="true">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats strip ─── */}
      <section
        className="py-14 bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 relative overflow-hidden"
        aria-label="Platform overview"
      >
        <div className="absolute inset-0 bg-grid-dark" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "3",      label: "Partner Stores",   note: "Temu, Shopee PH, Sephora PH" },
              { value: "100+",   label: "Curated Deals",    note: "Manually selected" },
              { value: "30–75%", label: "Discounts shown",  note: "Listed by the partner store" },
              { value: "100%",   label: "Free forever",     note: "No premium plan" },
            ].map(({ value, label, note }) => (
              <div key={label}>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 tabular">
                  {value}
                </div>
                <div className="font-semibold text-green-100 text-sm">{label}</div>
                <div className="text-green-300/70 text-xs mt-1">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Deal Intelligence ─── */}
      <section className="py-20 bg-white" aria-labelledby="intelligence-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="intelligence-heading"
            tag="How We Help"
            title="What we add to every deal"
            subtitle="Before a deal is listed, we add context that helps you shop with confidence."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {intelligenceCards.map((card) => (
              <div
                key={card.title}
                className={`flex flex-col p-5 rounded-2xl border ${card.border} ${card.bg} hover:shadow-md transition-all hover:-translate-y-0.5`}
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
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
              <h2
                id="featured-deals-heading"
                className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
              >
                Deals worth checking
              </h2>
              <p className="mt-2 text-slate-500 text-sm">
                Deal notes from Temu, Shopee PH, and Sephora PH affiliate datafeeds. Confirm price on the partner store before buying.
              </p>
            </div>
            <Link
              href="/deals"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
            >
              See all {activeDeals.length} deals{" "}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
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
              See All {activeDeals.length} Deals
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Partner Offers (sponsored) ─── */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PartnerBanners
            headingId="home-partner-offers-heading"
            title="Featured partner offers"
            subtitle="Sponsored links to partner stores worth a look. See all partners on our stores page."
            banners={homePartnerBanners}
          />
        </div>
      </section>

      {/* ─── Category Bento Grid ─── */}
      <section className="py-20 bg-white" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="categories-heading"
            tag="Shop by Category"
            title="Browse deals by what you need"
            subtitle="From budget finds to beauty, home, tech, and more."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.filter((cat) => cat.featured).map((cat) => (
              <CategoryCard key={cat.id} category={cat} liveCount={liveCounts[cat.slug]} />
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

      {/* ─── How It Works ─── */}
      <section className="py-20 bg-slate-50" aria-labelledby="how-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="how-heading"
            tag="How SulitScan Works"
            title="Transparent deal discovery"
            subtitle="No dark patterns. No fake scarcity. Just honest deal notes."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div
                key={step.step}
                className="relative flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                {i < howItWorks.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-slate-200 z-10"
                    aria-hidden="true"
                  />
                )}
                <span className="text-4xl font-black text-slate-100 mb-3 select-none leading-none">
                  {step.step}
                </span>
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <step.icon className="w-[18px] h-[18px] text-green-600" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Deal Checker Visual ─── */}
      <section className="py-20 bg-white" aria-labelledby="checker-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: copy */}
            <div>
              <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-amber-700 bg-amber-50 border border-amber-100 rounded-full">
                Buyer&apos;s Guide
              </span>
              <h2
                id="checker-heading"
                className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4"
              >
                What we check before listing a deal
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Not every listed price is a genuine saving. Here&apos;s what we look at
                before adding a deal to SulitScan:
              </p>
              <ul className="space-y-3 mb-6" role="list">
                {[
                  "Is the original price realistic compared to similar products?",
                  "Does the store have a good track record for authenticity and fulfillment?",
                  "Are buyer reviews consistent with the product description?",
                  "Can platform or loyalty vouchers be applied on top?",
                  "What does the buyer need to know before purchasing?",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle
                      className="w-4 h-4 text-green-500 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog/how-sulitscan-checks-deals"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
              >
                Read how SulitScan checks deals{" "}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Right: scanner checklist visual */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Sample deal check</p>
                  <p className="text-sm font-bold text-slate-900">SK-II Facial Treatment Essence</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot"
                    aria-hidden="true"
                  />
                  Notes ready
                </span>
              </div>
              <ul className="divide-y divide-slate-50" role="list">
                {scanChecklist.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 px-5 py-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        item.good ? "bg-green-50" : "bg-amber-50"
                      }`}
                    >
                      <item.icon
                        className={`w-3.5 h-3.5 ${item.good ? "text-green-600" : "text-amber-500"}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-500">{item.label}</div>
                      <div
                        className={`text-xs font-medium ${
                          item.good ? "text-slate-800" : "text-slate-500"
                        }`}
                      >
                        {item.value}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.good
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {item.good ? "Pass" : "Note"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Overall SulitScore</span>
                  <span className="text-sm font-black text-green-600">8 / 10 · Good Deal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Partner Stores ─── */}
      <section className="py-16 bg-slate-50" aria-labelledby="stores-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="stores-heading"
            tag="Partner Stores"
            title="Our partner stores"
            subtitle="SulitScan currently features selected deals from Temu, Shopee PH, and Sephora PH. More reviewed partners may be added later."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              {
                href: "/stores/temu",
                gradient: "from-orange-400 to-orange-600",
                name: "Temu",
                desc: "Budget finds: home, fashion, gadgets, and decor.",
                badge: "Budget",
              },
              {
                href: "/stores/shopee-ph",
                gradient: "from-orange-500 to-red-500",
                name: "Shopee PH",
                desc: "Marketplace finds: home, tech, fashion, and travel.",
                badge: "Marketplace",
              },
              {
                href: "/stores/sephora-ph",
                gradient: "from-slate-800 to-slate-950",
                name: "Sephora PH",
                desc: "Authenticated beauty: skincare, makeup, and fragrance.",
                badge: "Premium Beauty",
              },
            ].map((store) => (
              <Link
                key={store.name}
                href={store.href}
                className="group flex flex-col gap-3 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${store.gradient} flex items-center justify-center`} aria-hidden="true">
                  <span className="text-white font-black text-sm">{store.name[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition-colors">{store.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">{store.badge}</span>
                  </div>
                  <p className="text-xs text-slate-500">{store.desc}</p>
                </div>
                <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                  View store <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </span>
              </Link>
            ))}
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
              <h2
                id="blog-heading"
                className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
              >
                Read before you buy
              </h2>
              <p className="mt-2 text-slate-500 text-sm">
                Practical shopping guides for Filipino buyers, covering Temu, Shopee PH, Sephora PH, and smarter buying habits.
              </p>
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
              <details
                key={item.question}
                className="group bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:border-green-100 transition-colors"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors list-none select-none">
                  {item.question}
                  <span
                    className="text-slate-400 group-open:rotate-180 transition-transform text-lg leading-none shrink-0"
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                </summary>
                <div className="px-5 pb-4 pt-3 text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section
        className="relative py-24 bg-slate-900 overflow-hidden"
        aria-labelledby="cta-heading"
      >
        <div className="absolute inset-0 bg-grid-dark" aria-hidden="true" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-green-400 bg-green-400/10 rounded-full border border-green-400/20">
            Ready to shop smarter?
          </span>
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-tight"
          >
            Find your next{" "}
            <span className="gradient-text">sulit</span> deal today.
          </h2>
          <p className="text-slate-400 mb-10 leading-relaxed text-base sm:text-lg">
            Browse {activeDeals.length}+ curated deal notes from Temu, Shopee PH, and Sephora PH.
            No auto-redirect. No fake urgency. Affiliate links clearly disclosed.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-green-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              Browse All Deals
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-base rounded-2xl transition-colors border border-white/20 hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" aria-hidden="true" />
              Read Guides
            </Link>
          </div>
          <p className="mt-8 text-xs text-slate-500">
            SulitScan may earn a commission on qualifying purchases through affiliate links.
            This does not affect your price.{" "}
            <Link href="/affiliate-disclosure" className="underline hover:text-slate-400">
              Full disclosure
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
