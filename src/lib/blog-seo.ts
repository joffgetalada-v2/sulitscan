import type { BlogPost } from "@/data/posts"

const SITE_SUFFIX = " | SulitScan PH"
const TITLE_LIMIT = 65
const TRAILING_CONNECTIVES = new Set([
  "and",
  "before",
  "every",
  "for",
  "from",
  "get",
  "in",
  "of",
  "on",
  "the",
  "to",
  "what",
  "with",
  "you",
])

function cleanTrailingConnectives(text: string): string {
  const words = text.replace(/[\s,;:–—-]+$/u, "").trim().split(" ")
  while (words.length > 1 && TRAILING_CONNECTIVES.has(words.at(-1)?.toLowerCase() ?? "")) {
    words.pop()
  }
  return words.join(" ")
}

function truncateAtWordBoundary(text: string, limit: number): string {
  const words = text.replace(/\s+/g, " ").trim().split(" ")
  const phrase: string[] = []

  for (const word of words) {
    const candidate = [...phrase, word].join(" ")
    if (candidate.length > limit) break
    phrase.push(word)
  }

  return cleanTrailingConnectives(phrase.join(" "))
}

export function buildBlogSeoTitle(post: BlogPost): string {
  const normalizedTitle = post.title.replace(/\s+/g, " ").trim()
  const availableLength = TITLE_LIMIT - SITE_SUFFIX.length
  if (normalizedTitle.length <= availableLength) return `${normalizedTitle}${SITE_SUFFIX}`

  const subject = normalizedTitle.split(":", 1)[0]
  const titleSource = subject.length <= availableLength ? subject : normalizedTitle
  return `${truncateAtWordBoundary(titleSource, availableLength)}${SITE_SUFFIX}`
}
