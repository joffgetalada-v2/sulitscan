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
    description: "Budget-friendly finds under five hundred pesos from Temu and Sephora PH.",
    gradient: "from-yellow-400 to-amber-500",
    dealCount: 96,
    featured: true,
  },
  {
    id: "cat-beauty",
    slug: "beauty",
    name: "Beauty",
    emoji: "💄",
    description: "Beauty basics, skincare, makeup, and wellness picks from Temu and Sephora PH. Always check ingredients, shades, and product details before buying.",
    gradient: "from-pink-400 to-rose-600",
    dealCount: 58,
    featured: true,
  },
  {
    id: "cat-home",
    slug: "home-finds",
    name: "Home Finds",
    emoji: "🏠",
    description: "Kitchen tools, organizers, decor, and home essentials from Temu at sale prices.",
    gradient: "from-emerald-400 to-teal-600",
    dealCount: 36,
    featured: true,
  },
  {
    id: "cat-tech",
    slug: "tech-deals",
    name: "Tech & Gadgets",
    emoji: "💻",
    description: "Gadgets, accessories, chargers, and smart devices from Temu. Checked for value.",
    gradient: "from-blue-400 to-indigo-600",
    dealCount: 15,
    featured: true,
  },
  {
    id: "cat-fashion",
    slug: "fashion",
    name: "Fashion",
    emoji: "👗",
    description: "Trendy and everyday clothing deals from Temu. Sizing notes included where available.",
    gradient: "from-purple-400 to-violet-600",
    dealCount: 36,
    featured: true,
  },
  {
    id: "cat-under-1000",
    slug: "under-1000",
    name: "Under ₱1,000",
    emoji: "💰",
    description: "Solid value picks priced under one thousand pesos from Temu and Sephora PH.",
    gradient: "from-lime-400 to-green-500",
    dealCount: 120,
    featured: true,
  },
  {
    id: "cat-gifts",
    slug: "gift-ideas",
    name: "Gift Ideas",
    emoji: "🎁",
    description: "Top-rated picks for gifting — SulitScore 8 and above only.",
    gradient: "from-orange-400 to-red-500",
    dealCount: 80,
    featured: true,
  },
  {
    id: "cat-travel",
    slug: "travel",
    name: "Travel",
    emoji: "✈️",
    description: "Hotel deals, activity bookings, tours, and flight extras. Coming soon.",
    gradient: "from-sky-400 to-cyan-600",
    dealCount: 0,
    featured: false,
  },
  {
    id: "cat-digital",
    slug: "digital-tools",
    name: "Digital Tools",
    emoji: "🔧",
    description: "Software subscriptions, design tools, and productivity apps. Coming soon.",
    gradient: "from-violet-400 to-fuchsia-600",
    dealCount: 0,
    featured: false,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
