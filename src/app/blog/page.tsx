import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import BlogCard from "@/components/BlogCard"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/SeoJsonLd"
import { getPostsNewestFirst } from "@/data/posts"
import { siteConfig } from "@/lib/seo"
import { buildBlogHref, resolveBlogListing, type BlogSearchParams } from "@/lib/blog-listing"
import { BookOpen } from "lucide-react"
import NewsletterSignup from "@/components/newsletter/NewsletterSignup"

interface BlogPageProps {
  searchParams: Promise<BlogSearchParams>
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const raw = await searchParams
  const hasRawFilters = Object.hasOwn(raw, "q") || Object.hasOwn(raw, "category")
  return {
    title: "Smart Shopping Guides Philippines",
    description:
      "Shopping guides for Filipino buyers, Temu, Shopee PH, and Sephora PH buying advice, how to spot fake discounts, voucher strategies, and smart online shopping habits.",
    alternates: { canonical: `${siteConfig.url}/blog` },
    robots: { index: !hasRawFilters, follow: true },
    openGraph: {
      title: "Smart Shopping Guides Philippines | SulitScan PH",
      description: "Practical shopping guides covering Temu, Shopee PH, Sephora PH, deal-checking, and smarter buying habits for Filipino shoppers.",
      url: `${siteConfig.url}/blog`,
    },
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const orderedPosts = getPostsNewestFirst()
  const listing = resolveBlogListing(orderedPosts, await searchParams)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
        ]}
      />
      <ItemListJsonLd
        name="Smart Shopping Guides Philippines – SulitScan PH"
        items={listing.items.map((p) => ({
          name: p.title,
          url: `${siteConfig.url}/blog/${p.slug}`,
          description: p.excerpt,
        }))}
      />

      {/* Hero banner */}
      <div className="relative w-full overflow-hidden" style={{ height: "260px" }}>
        <Image
          src="/images/guides/smart-shopping-guide.jpg"
          alt="SulitScan PH Smart Shopping Guides, deal checks, buyer tips, and budget finds for Filipino shoppers"
          fill
          className="object-cover"
          sizes="100vw"
          preload
        />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-green-700">
                Shopping Guides
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Smart shopping guides for Filipino shoppers
              </h1>
              <p className="text-slate-500 text-sm">
                {orderedPosts.length} guides · Temu, Shopee PH, and Sephora PH tips, deal-checking, and smart shopping habits.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form key={buildBlogHref({ q: listing.q, category: listing.category })} action="/blog" method="get" aria-label="Find shopping guides" className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1 min-w-0">
            <label htmlFor="guide-search" className="block mb-2 text-sm font-semibold text-slate-700">Search guides</label>
            <input id="guide-search" name="q" type="search" maxLength={80} defaultValue={listing.q} placeholder="Search topics, stores, or buying tips" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div>
            <label htmlFor="guide-category" className="block mb-2 text-sm font-semibold text-slate-700">Guide category</label>
            <select id="guide-category" name="category" defaultValue={listing.category} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
              {listing.categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <button type="submit" className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700">Find guides</button>
        </form>

        <nav aria-label="Guide categories" className="mb-6 flex flex-wrap gap-2">
          {listing.categories.map((category) => (
            <Link key={category} href={buildBlogHref({ q: listing.q, category })} aria-current={category === listing.category ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 ${category === listing.category ? "border-green-700 bg-green-700 text-white" : "border-slate-200 text-slate-600 hover:border-green-600 hover:text-green-700"}`}>
              {category}
            </Link>
          ))}
        </nav>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-sm text-slate-600">{listing.total} {listing.total === 1 ? "guide" : "guides"} found</p>
          {(listing.isFiltered || listing.noResults) && <Link href="/blog" className="text-sm font-semibold text-green-700 underline underline-offset-4">Reset guide filters</Link>}
        </div>

        {listing.noResults ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h2 className="text-lg font-bold text-slate-900">No guides match your search.</h2>
            <p className="mt-2 text-sm text-slate-600">Try another topic or choose a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listing.items.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-12 max-w-lg mx-auto text-center">
          <p className="text-sm font-bold text-slate-900 mb-1">Get weekly sulit finds in your inbox</p>
          <p className="text-xs text-slate-500 mb-5">Deal alerts and shopping tips for Filipino buyers, free.</p>
          <NewsletterSignup source="blog-index" />
        </div>
      </div>
    </>
  )
}
