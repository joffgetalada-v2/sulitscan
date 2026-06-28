import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Only block the POST-only contact API. Do NOT block /_next/, Googlebot
        // must fetch the JS/CSS/image assets there to render and index pages.
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://sulitscan.com/sitemap.xml",
    host: "https://sulitscan.com",
  }
}
