import { posts } from "@/data/posts"
import { siteConfig } from "@/lib/seo"

// The feed reads only static post data, so prerender it at build time.
export const dynamic = "force-static"

const FEED_ITEM_LIMIT = 20

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const items = [...posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, FEED_ITEM_LIMIT)
    .map((post) => {
      const url = `${siteConfig.url}/blog/${post.slug}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${new Date(`${post.publishedAt}T00:00:00+08:00`).toUTCString()}</pubDate>
    </item>`
    })
    .join("\n")

  const newestReview = posts.reduce(
    (latest, post) => (post.lastReviewed > latest ? post.lastReviewed : latest),
    posts[0]?.lastReviewed ?? "2026-07-12"
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} Blog</title>
    <link>${siteConfig.url}/blog</link>
    <atom:link href="${siteConfig.url}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-ph</language>
    <lastBuildDate>${new Date(`${newestReview}T00:00:00+08:00`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
