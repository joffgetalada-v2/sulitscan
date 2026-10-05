import type { BlogPost } from "@/data/posts"

export interface BlogSearchParams {
  q?: string | string[]
  category?: string | string[]
}

export interface NormalizedBlogFilters {
  q: string
  category: string
}

export interface BlogListingResult extends NormalizedBlogFilters {
  items: BlogPost[]
  categories: string[]
  total: number
  isFiltered: boolean
  noResults: boolean
}

function normalizeText(value: string | string[] | undefined): string {
  const first = Array.isArray(value) ? value[0] : value
  return (first ?? "").trim().replace(/\s+/g, " ")
}

function normalizeQuery(value: string | string[] | undefined): string {
  return normalizeText(value).slice(0, 80).trim()
}

export function resolveBlogListing(posts: BlogPost[], raw: BlogSearchParams): BlogListingResult {
  const categories = ["All", ...new Set(posts.map((post) => post.category))].sort((a, b) => {
    if (a === "All") return -1
    if (b === "All") return 1
    return a.localeCompare(b)
  })
  const q = normalizeQuery(raw.q)
  const requestedCategory = normalizeText(raw.category).toLowerCase()
  const category = categories.find((option) => option.toLowerCase() === requestedCategory) ?? "All"
  const query = q.toLowerCase()
  const items = posts.filter((post) => {
    const searchable = `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(" ")}`.toLowerCase()
    return (category === "All" || post.category === category) && (!query || searchable.includes(query))
  })

  return {
    q,
    category,
    items,
    categories,
    total: items.length,
    isFiltered: Boolean(q) || category !== "All",
    noResults: items.length === 0,
  }
}

export function buildBlogHref(filters: Partial<NormalizedBlogFilters>): string {
  const params = new URLSearchParams()
  const q = normalizeQuery(filters.q)
  const category = normalizeText(filters.category)
  if (q) params.set("q", q)
  if (category && category.toLowerCase() !== "all") params.set("category", category)
  const query = params.toString()
  return query ? `/blog?${query}` : "/blog"
}
