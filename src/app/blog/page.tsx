import type { Metadata } from "next"
import Image from "next/image"
import BlogCard from "@/components/BlogCard"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { posts } from "@/data/posts"
import { siteConfig } from "@/lib/seo"
import { BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Smart Shopping Guides Philippines",
  description:
    "Shopping guides for Filipino buyers — Temu tips, Sephora PH buying advice, how to spot fake discounts, voucher strategies, and smart online shopping habits.",
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    title: "Smart Shopping Guides Philippines | SulitScan PH",
    description: "Practical shopping guides covering Temu, Sephora PH, deal-checking, and smarter buying habits for Filipino shoppers.",
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

      {/* Hero banner */}
      <div className="relative w-full overflow-hidden" style={{ height: "260px" }}>
        <Image
          src="/images/guides/smart-shopping-guide.png"
          alt="SulitScan PH Smart Shopping Guides — deal checks, buyer tips, and budget finds for Filipino shoppers"
          fill
          className="object-cover"
          sizes="100vw"
          priority
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
                {posts.length} guides · Temu tips, Sephora PH buying advice, deal-checking, and smart shopping habits.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}
