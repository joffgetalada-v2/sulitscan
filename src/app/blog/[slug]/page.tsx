import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, ArrowLeft, Tag } from "lucide-react"
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "@/components/SeoJsonLd"
import { posts, getPostBySlug } from "@/data/posts"
import { siteConfig } from "@/lib/seo"
import { formatDate } from "@/lib/utils"

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteConfig.url}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const postUrl = `${siteConfig.url}/blog/${slug}`

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      <BlogPostingJsonLd
        title={post.title}
        description={post.excerpt}
        author={post.author}
        datePublished={post.publishedAt}
        url={postUrl}
      />

      {/* Cover */}
      <div
        className={`bg-gradient-to-br ${post.coverGradient} py-16 px-4 sm:px-6 lg:px-8`}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Blog
        </Link>

        {/* Meta */}
        <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
          {post.category}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-2 mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-6 pb-6 border-b border-slate-100">
          <span>By {post.author}</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {post.readTime} min read
          </span>
        </div>

        {/* Content */}
        <div className="prose prose-sm prose-slate max-w-none">
          {post.content.split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-2">
                  {block.replace("## ", "")}
                </h2>
              )
            }
            if (block.startsWith("**") && block.endsWith("**")) {
              return (
                <p key={i} className="font-semibold text-slate-800 mt-3">
                  {block.replace(/\*\*/g, "")}
                </p>
              )
            }
            if (block.startsWith("- ")) {
              const items = block.split("\n").filter((l) => l.startsWith("- "))
              return (
                <ul key={i} className="list-disc pl-5 space-y-1 my-3">
                  {items.map((item, j) => (
                    <li key={j} className="text-slate-600 text-sm">
                      {item.replace("- ", "")}
                    </li>
                  ))}
                </ul>
              )
            }
            return (
              <p key={i} className="text-slate-600 text-sm leading-relaxed my-3">
                {block}
              </p>
            )
          })}
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-500 text-xs rounded-full border border-slate-100"
            >
              <Tag className="w-3 h-3" aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>

        {/* Affiliate note */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <strong>Affiliate Disclosure:</strong> Links in this article may be affiliate links. SulitScan
          earns a commission if you buy — at no extra cost to you.{" "}
          <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
        </div>

        {/* Back to blog */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            More guides
          </Link>
        </div>
      </div>
    </>
  )
}
