import type { Metadata } from "next"
import Link from "next/link"
import { Clock, BookOpen } from "lucide-react"
import SectionHeading from "@/components/SectionHeading"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { posts } from "@/data/posts"
import { siteConfig } from "@/lib/seo"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Smart Shopping Guides Philippines",
  description:
    "Smart shopping guides, platform comparisons, and deal tips for Filipino shoppers. Learn how to save more on Shopee, Lazada, AliExpress, and more.",
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    title: "Smart Shopping Guides Philippines | SulitScan PH",
    description:
      "Smart shopping guides and deal tips for Filipino shoppers.",
    url: `${siteConfig.url}/blog`,
  },
}

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading
          tag="Blog"
          title="Smart Shopping Guides Philippines"
          subtitle="Tips, platform comparisons, and voucher guides for Filipino online shoppers."
          align="left"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all overflow-hidden"
              aria-label={`Read: ${post.title}`}
            >
              <div
                className={`h-36 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}
                aria-hidden="true"
              >
                <BookOpen className="w-10 h-10 text-white/70" aria-hidden="true" />
              </div>
              <div className="flex flex-col flex-1 p-5">
                <span className="text-xs font-semibold text-green-600 mb-1.5 uppercase tracking-wide">
                  {post.category}
                </span>
                <h2 className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <span className="text-xs text-slate-400">{formatDate(post.publishedAt)}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {post.readTime} min
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
