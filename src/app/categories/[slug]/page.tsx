import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BreadcrumbJsonLd, ItemListJsonLd, FAQJsonLd } from "@/components/SeoJsonLd"
import { categories, getCategoryBySlug } from "@/data/categories"
import { getDealsByCategory } from "@/data/deals"
import { categoryContent } from "@/data/category-content"
import CategoryDeals from "@/components/CategoryDeals"
import TopPicks from "@/components/TopPicks"
import TrustBar from "@/components/TrustBar"
import { siteConfig } from "@/lib/seo"
import { formatDealCount, clampMeta } from "@/lib/utils"
import { ArrowLeft, CheckCircle, BookOpen, AlertCircle } from "lucide-react"

export function generateStaticParams() {
  return categories.filter((c) => c.featured).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  const content = categoryContent[slug]
  return {
    title: `${category.name} Deals Philippines`,
    description: clampMeta(
      content?.intro ??
        `${category.description} Browse ${category.name.toLowerCase()} deals from Temu and Sephora PH on SulitScan PH.`
    ),
    alternates: { canonical: `${siteConfig.url}/categories/${slug}` },
    openGraph: {
      title: `${category.name} Deals Philippines | SulitScan PH`,
      description: category.description,
      url: `${siteConfig.url}/categories/${slug}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const categoryDeals = getDealsByCategory(slug)
  const content = categoryContent[slug]
  // Top picks: highest SulitScore, then biggest discount — capped at 8.
  const topPicks = categoryDeals.length > 8
    ? [...categoryDeals].sort((a, b) => b.sulitScore - a.sulitScore || b.discount - a.discount).slice(0, 8)
    : []

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Categories", url: `${siteConfig.url}/categories` },
          { name: category.name, url: `${siteConfig.url}/categories/${slug}` },
        ]}
      />
      {categoryDeals.length > 0 && (
        <ItemListJsonLd
          name={`${category.name} Deals Philippines – SulitScan PH`}
          items={categoryDeals.slice(0, 24).map((d) => ({
            name: d.title,
            url: `${siteConfig.url}/deals/${d.slug}`,
            description: d.reason,
          }))}
        />
      )}
      {content?.faqs && <FAQJsonLd items={content.faqs} />}

      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All Categories
        </Link>
      </div>

      {/* Category hero */}
      <div className={`bg-gradient-to-br ${category.gradient} py-12 px-4 sm:px-6 lg:px-8 mt-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-5xl" aria-hidden="true">{category.emoji}</div>
            <div>
              <h1 className="text-3xl font-black text-white">{category.name}</h1>
              <p className="text-white/80 mt-1 text-sm max-w-lg">
                {formatDealCount(categoryDeals.length)} · {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Affiliate disclosure */}
        <div className="mb-8 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-amber-800">
            <strong>Affiliate datafeed prices:</strong> Prices shown are sourced from affiliate datafeeds and may not reflect the current
            price on the partner store. Always confirm before buying.{" "}
            <Link href="/affiliate-disclosure" className="underline font-medium">Affiliate disclosure →</Link>
          </p>
        </div>

        <TrustBar className="mb-8" />

        {/* Top Picks */}
        {topPicks.length > 0 && (
          <TopPicks
            headingId="top-picks-heading"
            title={`Top picks in ${category.name}`}
            subtitle="Our highest-scoring, lowest-risk options in this category — confirm the price on the partner store before buying."
            deals={topPicks}
          />
        )}

        {/* SEO intro content */}
        {content && (
          <div className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: intro + buyer guidance */}
            <div className="lg:col-span-2 space-y-8">
              <section aria-labelledby="category-intro">
                <h2 id="category-intro" className="text-lg font-bold text-slate-900 mb-3">
                  {category.name} deals in the Philippines
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{content.intro}</p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <section aria-labelledby="best-for-heading">
                  <h2 id="best-for-heading" className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />
                    Best for
                  </h2>
                  <ul className="space-y-2">
                    {content.bestFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" aria-hidden="true" />
                        <span className="text-xs text-slate-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="check-before-buying">
                  <h2 id="check-before-buying" className="text-sm font-bold text-slate-900 mb-3">
                    What to check before buying
                  </h2>
                  <ul className="space-y-2">
                    {content.whatToCheck.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" aria-hidden="true" />
                        <span className="text-xs text-slate-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <section aria-labelledby="common-mistakes-heading">
                <h2 id="common-mistakes-heading" className="text-sm font-bold text-slate-900 mb-3">
                  Common mistakes to avoid
                </h2>
                <ul className="space-y-2">
                  {content.commonMistakes.map((item, i) => (
                    <li key={i} className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-rose-400" aria-hidden="true">✕</span> {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right: sidebar */}
            <div className="space-y-5">
              {/* Related categories */}
              {content.relatedCategories.length > 0 && (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Related categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.relatedCategories.map((catSlug) => {
                      const relCat = categories.find((c) => c.slug === catSlug)
                      if (!relCat) return null
                      return (
                        <Link
                          key={catSlug}
                          href={`/categories/${catSlug}`}
                          className="text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-green-200 hover:text-green-700 transition-colors"
                        >
                          {relCat.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Related blog posts */}
              {content.relatedBlogSlugs.length > 0 && (
                <div className="bg-green-50 rounded-2xl border border-green-100 p-5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
                    Shopping guides
                  </h3>
                  <ul className="space-y-2">
                    {content.relatedBlogSlugs.map((blogSlug) => (
                      <li key={blogSlug}>
                        <Link
                          href={`/blog/${blogSlug}`}
                          className="text-xs text-green-700 hover:underline leading-snug block"
                        >
                          {blogSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Partner stores */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Active stores</h3>
                <div className="space-y-2">
                  <Link href="/stores/temu" className="flex items-center gap-2 text-xs text-slate-600 hover:text-green-700 transition-colors">
                    <span className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600" aria-hidden="true">T</span>
                    Temu — budget finds
                  </Link>
                  <Link href="/stores/sephora-ph" className="flex items-center gap-2 text-xs text-slate-600 hover:text-green-700 transition-colors">
                    <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white" aria-hidden="true">S</span>
                    Sephora PH — beauty
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deals grid */}
        {categoryDeals.length > 0 ? (
          <section aria-labelledby="deals-section-heading">
            <h2 id="deals-section-heading" className="text-lg font-bold text-slate-900 mb-5">
              {category.name} deals — {categoryDeals.length} available
            </h2>
            <CategoryDeals deals={categoryDeals} />
          </section>
        ) : (
          <div className="text-center py-16">
            <p className="text-3xl mb-4" aria-hidden="true">🔍</p>
            <p className="text-slate-600 font-semibold mb-2">No deals found in this category yet.</p>
            <p className="text-slate-400 text-sm mb-6">
              We&apos;re adding new deals regularly. Check back soon, or browse all deals.
            </p>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-xl hover:bg-green-700 transition-colors"
            >
              Browse All Deals
            </Link>
          </div>
        )}

        {/* FAQ section */}
        {content?.faqs && content.faqs.length > 0 && (
          <section className="mt-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-lg font-bold text-slate-900 mb-5">
              Frequently asked questions
            </h2>
            <div className="space-y-3 max-w-2xl">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:border-green-100 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors list-none select-none">
                    {faq.question}
                    <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg leading-none shrink-0" aria-hidden="true">↓</span>
                  </summary>
                  <div className="px-5 pb-4 pt-3 text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
