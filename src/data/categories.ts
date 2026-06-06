export interface Category {
  id: string
  slug: string
  name: string
  emoji: string
  description: string
  gradient: string
  dealCount: number
  featured: boolean
}

export const categories: Category[] = [
  {
    id: "cat-under-500",
    slug: "under-500",
    name: "Under ₱500",
    emoji: "🪙",
    description: "Budget-friendly finds that won't break the bank. Verified deals under five hundred pesos.",
    gradient: "from-yellow-400 to-amber-500",
    dealCount: 24,
    featured: true,
  },
  {
    id: "cat-tech",
    slug: "tech-deals",
    name: "Tech Deals",
    emoji: "💻",
    description: "Gadgets, accessories, chargers, and smart devices. Checked for seller trust and value.",
    gradient: "from-blue-400 to-indigo-600",
    dealCount: 18,
    featured: true,
  },
  {
    id: "cat-home",
    slug: "home-finds",
    name: "Home Finds",
    emoji: "🏠",
    description: "Kitchen tools, organizers, decor, and home essentials at sale prices.",
    gradient: "from-emerald-400 to-teal-600",
    dealCount: 15,
    featured: true,
  },
  {
    id: "cat-beauty",
    slug: "beauty",
    name: "Beauty",
    emoji: "💄",
    description: "Skincare, makeup, hair care and wellness. Filipino skin-tone tested picks.",
    gradient: "from-pink-400 to-rose-600",
    dealCount: 21,
    featured: true,
  },
  {
    id: "cat-fashion",
    slug: "fashion",
    name: "Fashion",
    emoji: "👗",
    description: "Trendy and everyday clothing deals. Sizing notes included where needed.",
    gradient: "from-purple-400 to-violet-600",
    dealCount: 19,
    featured: true,
  },
  {
    id: "cat-travel",
    slug: "travel",
    name: "Travel",
    emoji: "✈️",
    description: "Hotel deals, activity bookings, tours, and flight extras. Great for staycations too.",
    gradient: "from-sky-400 to-cyan-600",
    dealCount: 11,
    featured: true,
  },
  {
    id: "cat-digital",
    slug: "digital-tools",
    name: "Digital Tools",
    emoji: "🔧",
    description: "Software subscriptions, design tools, productivity apps, and online services.",
    gradient: "from-violet-400 to-fuchsia-600",
    dealCount: 9,
    featured: true,
  },
  {
    id: "cat-gifts",
    slug: "gift-ideas",
    name: "Gift Ideas",
    emoji: "🎁",
    description: "Curated gift picks for birthdays, Christmas, or just because. SulitScore 8+ only.",
    gradient: "from-orange-400 to-red-500",
    dealCount: 13,
    featured: true,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
