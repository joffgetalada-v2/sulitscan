import type { MetadataRoute } from "next"
import { buildSitemapEntries } from "@/lib/sitemap-builder"

export const dynamic = "force-dynamic"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return buildSitemapEntries(now)
}
