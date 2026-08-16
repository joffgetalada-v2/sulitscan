import { siteConfig } from "@/lib/seo"

function safeJson(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c")
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/og-image.svg`,
    description: siteConfig.description,
    sameAs: [
      `https://twitter.com/sulitscanph`,
      `https://facebook.com/sulitscanph`,
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  )
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/deals?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  )
}

interface DealItem {
  name: string
  url: string
  description: string
  position?: number
}

export function ItemListJsonLd({ items, name }: { items: DealItem[]; name: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position ?? index + 1,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  )
}

interface BlogPostingProps {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified: string
  url: string
  imageUrl?: string
}

export function BlogPostingJsonLd({
  title,
  description,
  author,
  datePublished,
  dateModified,
  url,
  imageUrl,
}: BlogPostingProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: {
      "@type": "Organization",
      name: author,
      url: `${siteConfig.url}/editorial-policy`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    datePublished,
    dateModified,
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  )
}

interface ProductJsonLdProps {
  name: string
  description: string
  url: string
  imageUrl?: string
  price: number
  platform: string
}

/**
 * Product + Offer schema for deal pages. Deliberately minimal and honest:
 * no aggregateRating (SulitScore is editorial, not user reviews) and no
 * availability claim (we don't verify live stock on the partner store).
 */
export function ProductJsonLd({ name, description, url, imageUrl, price, platform }: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "PHP",
      url,
      seller: {
        "@type": "Organization",
        name: platform,
      },
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  )
}

interface FAQItem {
  question: string
  answer: string
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  )
}
