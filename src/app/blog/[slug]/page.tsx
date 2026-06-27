import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowLeft, Tag, BookOpen, List } from "lucide-react"
import { BreadcrumbJsonLd, BlogPostingJsonLd, FAQJsonLd } from "@/components/SeoJsonLd"
import DealCard from "@/components/DealCard"
import ImportTaxCallout from "@/components/ImportTaxCallout"
import { posts, getPostBySlug, DEFAULT_BLOG_COVER, DEFAULT_BLOG_COVER_ALT } from "@/data/posts"
import { getDealsByPlatform, getDealsByCategory, getFeaturedDeals } from "@/data/deals"
import { siteConfig } from "@/lib/seo"
import { formatDate, formatTag, clampMeta } from "@/lib/utils"

function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-").trim()
}

function extractHeadings(content: string): { level: 2 | 3; text: string; id: string }[] {
  return content
    .split("\n\n")
    .filter((block) => block.startsWith("## ") || block.startsWith("### "))
    .map((block) => {
      const isH3 = block.startsWith("### ")
      const text = block.replace(/^#{2,3} /, "")
      return { level: (isH3 ? 3 : 2) as 2 | 3, text, id: slugifyHeading(text) }
    })
}

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
    description: clampMeta(post.excerpt),
    alternates: { canonical: `${siteConfig.url}/blog/${slug}` },
    openGraph: {
      title: `${post.title} | SulitScan PH`,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [`${siteConfig.url}${post.coverImage ?? DEFAULT_BLOG_COVER}`],
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
  const headings = extractHeadings(post.content)
  const relatedPosts = posts.filter((p) => p.slug !== slug).slice(0, 3)

  // Match a few relevant deals to the post's topic (blog -> money-page flow).
  const topic = `${slug} ${post.tags.join(" ")}`.toLowerCase()
  const relatedDeals = (
    /shopee/.test(topic) ? getDealsByPlatform("Shopee PH")
    : /sephora|beauty|skincare|makeup/.test(topic) ? getDealsByPlatform("Sephora PH")
    : /under-500|budget/.test(topic) ? getDealsByCategory("under-500")
    : /temu/.test(topic) ? getDealsByPlatform("Temu")
    : getFeaturedDeals(3)
  ).slice(0, 3)
  // ImportTaxPH is relevant on overseas/Temu/shipping guides (not on the import-tax post itself).
  const showImportTax = /temu|shipping|overseas|aliexpress/.test(topic) && !slug.includes("import-tax")

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
        imageUrl={`${siteConfig.url}${post.coverImage ?? DEFAULT_BLOG_COVER}`}
      />
      {post.faqs && post.faqs.length > 0 && <FAQJsonLd items={post.faqs} />}

      {/* Cover / Hero (post cover, or the shared default) */}
      <div className="relative w-full overflow-hidden" style={{ height: "260px" }}>
        <Image
          src={post.coverImage ?? DEFAULT_BLOG_COVER}
          alt={post.coverImage ? (post.coverImageAlt ?? post.title) : DEFAULT_BLOG_COVER_ALT}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Main column */}
          <div className="lg:col-span-3">
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

            {/* Mobile TOC */}
            {headings.length > 2 && (
              <div className="lg:hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <List className="w-3.5 h-3.5" aria-hidden="true" />
                  In this guide
                </p>
                <ol className="space-y-1">
                  {headings.filter((h) => h.level === 2).map((h, i) => (
                    <li key={i}>
                      <a
                        href={`#${h.id}`}
                        className="text-xs text-green-600 hover:underline leading-relaxed"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-sm prose-slate max-w-none">
              {post.content.split("\n\n").map((block, i) => {
                if (block.startsWith("## ")) {
                  const text = block.replace(/^## /, "")
                  const id = slugifyHeading(text)
                  return (
                    <h2 key={i} id={id} className="text-lg font-bold text-slate-900 mt-8 mb-2 scroll-mt-20">
                      {renderInline(text)}
                    </h2>
                  )
                }
                if (block.startsWith("### ")) {
                  const text = block.replace(/^### /, "")
                  const id = slugifyHeading(text)
                  return (
                    <h3 key={i} id={id} className="text-base font-semibold text-slate-800 mt-5 mb-1.5 scroll-mt-20">
                      {renderInline(text)}
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
                // Image block: ![alt|WIDTHxHEIGHT](/src) — dims keep layout stable (no CLS)
                const imgMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
                if (imgMatch) {
                  const rawAlt = imgMatch[1]
                  const src = imgMatch[2]
                  const dim = rawAlt.match(/\|(\d+)x(\d+)$/)
                  const alt = rawAlt.replace(/\|\d+x\d+$/, "").trim()
                  return (
                    <figure key={i} className="my-6">
                      <Image
                        src={src}
                        alt={alt}
                        width={dim ? Number(dim[1]) : 1600}
                        height={dim ? Number(dim[2]) : 900}
                        className="w-full h-auto rounded-xl border border-slate-100"
                        sizes="(max-width: 1024px) 100vw, 768px"
                      />
                      {alt && (
                        <figcaption className="mt-2 text-xs text-slate-400 text-center">{alt}</figcaption>
                      )}
                    </figure>
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

            {/* Import-tax callout for overseas / Temu guides */}
            {showImportTax && (
              <div className="mt-8">
                <ImportTaxCallout />
              </div>
            )}

            {/* Affiliate note */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <strong>Affiliate Disclosure:</strong> Links in this article may be affiliate links. SulitScan
              earns a commission if you buy — at no extra cost to you.{" "}
              <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
            </div>

            {/* Related deals to check */}
            {relatedDeals.length > 0 && (
              <section aria-labelledby="related-deals-heading" className="mt-10">
                <h2 id="related-deals-heading" className="text-base font-bold text-slate-900 mb-1">
                  Related deals to check
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Confirm the current price, vouchers, and shipping on the partner store before buying.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedDeals.map((d) => (
                    <DealCard key={d.id} deal={d} />
                  ))}
                </div>
              </section>
            )}

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section aria-labelledby="related-posts-heading" className="mt-10">
                <h2 id="related-posts-heading" className="text-base font-bold text-slate-900 mb-4">
                  More shopping guides
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPosts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="group p-4 bg-white border border-slate-100 rounded-xl hover:border-green-100 hover:shadow-md transition-all"
                    >
                      <div className={`w-full h-20 rounded-lg bg-gradient-to-br ${p.coverGradient} mb-3`} aria-hidden="true" />
                      <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wide">{p.category}</span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1">{p.readTime} min read</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

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
          </div>

          {/* Sidebar: desktop TOC */}
          {headings.length > 2 && (
            <aside className="hidden lg:block">
              <div className="sticky top-6 bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
                <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                  <List className="w-3.5 h-3.5" aria-hidden="true" />
                  In this guide
                </p>
                <nav aria-label="Table of contents">
                  <ol className="space-y-1.5">
                    {headings.filter((h) => h.level === 2).map((h, i) => (
                      <li key={i}>
                        <a
                          href={`#${h.id}`}
                          className="text-xs text-slate-500 hover:text-green-600 leading-relaxed transition-colors block"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  )
}
