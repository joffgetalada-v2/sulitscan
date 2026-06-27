import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/data/posts"
import { DEFAULT_BLOG_COVER, DEFAULT_BLOG_COVER_ALT } from "@/data/posts"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

const categoryColors: Record<string, string> = {
  "Shopping Tips":   "bg-green-100 text-green-700",
  "Platform Guides": "bg-blue-100 text-blue-700",
  "Budget Finds":    "bg-amber-100 text-amber-700",
  "About SulitScan": "bg-purple-100 text-purple-700",
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const catColor = categoryColors[post.category] ?? "bg-slate-100 text-slate-600"
  const coverHeight = featured ? "h-48" : "h-36"

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-green-100 transition-all overflow-hidden"
      aria-label={`Read: ${post.title}`}
    >
      {/* Cover image area (post cover, or the shared default) */}
      <div className={`relative overflow-hidden ${coverHeight} bg-slate-100`}>
        <Image
          src={post.coverImage ?? DEFAULT_BLOG_COVER}
          alt={post.coverImage ? (post.coverImageAlt ?? post.title) : DEFAULT_BLOG_COVER_ALT}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700">
            {post.category}
          </span>
        </div>
        {/* Read time */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
          <Clock className="w-3 h-3 text-white" aria-hidden="true" />
          <span className="text-xs text-white font-medium">{post.readTime} min</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <span className={`inline-block self-start px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${catColor}`}>
          {post.category}
        </span>
        <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
          <span className="text-xs text-slate-400">{formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 group-hover:gap-2 transition-all">
            Read <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}
