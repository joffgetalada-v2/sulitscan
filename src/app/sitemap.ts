import type { MetadataRoute } from "next"
import { getActiveDeals, getDealsByCategory, getDealsByPlatform } from "@/data/deals"
import { categories } from "@/data/categories"
import { posts } from "@/data/posts"
import { stores } from "@/data/stores"
import { buildEntityPageHref, ENTITY_DEALS_PAGE_SIZE } from "@/lib/entity-deal-listing"
import { DEALS_PAGE_SIZE } from "@/lib/deal-listing"

const BASE_URL = "https://sulitscan.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const newestPostReview = posts.reduce(
    (latest, post) => post.lastReviewed > latest ? post.lastReviewed : latest,
    posts[0]?.lastReviewed ?? "2026-07-12"
  )

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/deals`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/stores`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(newestPostReview),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools/checkout-comparison`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sales-calendar`,
      lastModified: "2026-07-31",
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${BASE_URL}/images/guides/shopping-sale-calendar-philippines.webp`],
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/affiliate-disclosure`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookie-policy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/editorial-policy`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ]

  const activeDeals = getActiveDeals()
  const dealRoutes: MetadataRoute.Sitemap = activeDeals.map((deal) => ({
    url: `${BASE_URL}/deals/${deal.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const dealListingRoutes: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, Math.ceil(activeDeals.length / DEALS_PAGE_SIZE) - 1) },
    (_, index) => ({
      url: `${BASE_URL}/deals?page=${index + 2}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })
  )

  const featuredCategories = categories.filter((c) => c.featured)
  const categoryRoutes: MetadataRoute.Sitemap = featuredCategories.flatMap((cat) => {
    const pageCount = Math.max(
      1,
      Math.ceil(getDealsByCategory(cat.slug).length / ENTITY_DEALS_PAGE_SIZE)
    )
    return Array.from({ length: pageCount }, (_, index) => ({
      url: `${BASE_URL}${buildEntityPageHref(`/categories/${cat.slug}`, index + 1)}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  })

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.lastReviewed),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const storeRoutes: MetadataRoute.Sitemap = stores.flatMap((store) => {
    const pageCount = Math.max(
      1,
      Math.ceil(getDealsByPlatform(store.name).length / ENTITY_DEALS_PAGE_SIZE)
    )
    return Array.from({ length: pageCount }, (_, index) => ({
      url: `${BASE_URL}${buildEntityPageHref(`/stores/${store.slug}`, index + 1)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  })

  return [
    ...staticRoutes,
    ...dealRoutes,
    ...dealListingRoutes,
    ...categoryRoutes,
    ...postRoutes,
    ...storeRoutes,
  ]
}
