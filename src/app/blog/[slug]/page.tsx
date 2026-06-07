import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowLeft, Tag, BookOpen } from "lucide-react"
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "@/components/SeoJsonLd"
import { posts, getPostBySlug } from "@/data/posts"
import { siteConfig } from "@/lib/seo"
import { formatDate, formatTag } from "@/lib/utils"

function renderInline(text: string) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  const result: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0
  for (const match of text.matchAll(regex)) {
    const idx = match.index ?? 0
    if (idx > lastIndex) result.push(text.slice(lastIndex, idx))
    if (match[1] !== undefined) {
      const isInternal = match[2].startsWith("/")
      result.push(
        isInternal
          ? <Link key={key++} href={match[2]} className="text-green-600 underline hover:text-green-700">{match[1]}</Link>
          : <a key={key++} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-green-600 underline hover:text-green-700">{match[1]}</a>
      )
    } else {
      result.push(<strong key={key++}>{match[3]}</strong>)
    }
    lastIndex = idx + match[0].length
  }
  if (lastIndex < text.length) result.push(text.slice(lastIndex))
  return result.length === 1 && typeof result[0] === "string" ? result[0] : <>{result}</>
}

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
        imageUrl={post.coverImage ? `${siteConfig.url}${post.coverImage}` : undefined}
      />

      {/* Cover / Hero */}
      <div className="relative w-full overflow-hidden" style={{ height: "260px" }}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt ?? post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${post.coverGradient}`} aria-hidden="true">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }}
            />
          </div>
        )}
      </div>

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
          <span>Published {formatDate(post.publishedAt)}</span>
          {"lastReviewed" in post && post.lastReviewed && (
            <span className="flex items-center gap-1 text-green-600">
              <Clock className="w-3 h-3" aria-hidden="true" />
              Last reviewed {formatDate(post.lastReviewed as string)}
            </span>
          )}
          <span>{post.readTime} min read</span>
        </div>

        {/* Content */}
        <div className="prose prose-sm prose-slate max-w-none">
          {post.content.split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={i} className="text-lg font-bold text-slate-900 mt-8 mb-2">
                  {renderInline(block.replace(/^## /, ""))}
                </h2>
              )
            }
            if (block.startsWith("### ")) {
              return (
                <h3 key={i} className="text-base font-semibold text-slate-800 mt-5 mb-1.5">
                  {renderInline(block.replace(/^### /, ""))}
                </h3>
              )
            }
            if (block.startsWith("- ")) {
              const items = block.split("\n").filter((l) => l.startsWith("- "))
              return (
                <ul key={i} className="list-disc pl-5 space-y-1.5 my-3">
                  {items.map((item, j) => (
                    <li key={j} className="text-slate-600 text-sm leading-relaxed">
                      {renderInline(item.replace(/^- /, ""))}
                    </li>
                  ))}
                </ul>
              )
            }
            if (/^\d+\. /.test(block.split("\n")[0])) {
              const items = block.split("\n").filter((l) => /^\d+\. /.test(l))
              return (
                <ol key={i} className="list-decimal pl-5 space-y-1.5 my-3">
                  {items.map((item, j) => (
                    <li key={j} className="text-slate-600 text-sm leading-relaxed">
                      {renderInline(item.replace(/^\d+\. /, ""))}
                    </li>
                  ))}
                </ol>
              )
            }
            if (block.startsWith("> ")) {
              return (
                <blockquote key={i} className="border-l-4 border-green-200 pl-4 my-4 text-sm text-slate-500 italic">
                  {renderInline(block.replace(/^> /, ""))}
                </blockquote>
              )
            }
            return (
              <p key={i} className="text-slate-600 text-sm leading-relaxed my-3">
                {renderInline(block)}
              </p>
            )
          })}
        </div>

        {/* Tags */}
        <div className="mt-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-600 text-xs rounded-full border border-slate-100"
              >
                <Tag className="w-3 h-3" aria-hidden="true" />
                {formatTag(tag)}
              </span>
            ))}
          </div>
        </div>

        {/* Affiliate note */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <strong>Affiliate Disclosure:</strong> Links in this article may be affiliate links. SulitScan
          earns a commission if you buy — at no extra cost to you.{" "}
          <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
        </div>

        {/* Internal links */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Explore SulitScan
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Browse all deals", href: "/deals" },
              { label: "Shop by category", href: "/categories" },
              { label: "Partner stores", href: "/stores" },
              { label: "More guides", href: "/blog" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs px-3 py-1.5 bg-white text-green-600 border border-green-100 rounded-full hover:bg-green-50 transition-colors font-medium"
              >
                {l.label}
              </Link>
            ))}
          </div>
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
