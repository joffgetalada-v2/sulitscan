export interface Store {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  country: string
  categories: string[]
  shipsToPhilippines: boolean
  freeShippingMinimum: number | null
  trustLevel: "high" | "medium" | "new"
  gradient: string
  affiliateLink: string
  isDemo: boolean
  buyerNotes: string[]
  shippingNote: string
  returnNote: string
}

export const stores: Store[] = [
  {
    id: "store-temu",
    slug: "temu",
    name: "Temu",
    tagline: "Budget finds for everyday shopping",
    description:
      "Temu is a global marketplace offering a wide range of products at very low prices — from home decor and gadgets to fashion and beauty basics. Best for non-critical purchases where you're comfortable with some quality variability.",
    country: "Global",
    categories: ["Home", "Fashion", "Electronics", "Beauty", "Outdoor"],
    shipsToPhilippines: true,
    freeShippingMinimum: null,
    trustLevel: "medium",
    gradient: "from-orange-400 to-orange-600",
    affiliateLink: "https://temu.com",
    isDemo: false,
    buyerNotes: [
      "Always read product reviews before buying — quality can vary between sellers.",
      "Check the size guide carefully; sizing can run smaller than expected.",
      "Shipping to the Philippines typically takes 7–20 days.",
      "Temu's refund and return process is generally straightforward for defective items.",
      "Best for low-stakes purchases: decor, clothing basics, organizers, phone accessories.",
      "For electronics or items above ₱1,000, consider local platforms for faster recourse.",
    ],
    shippingNote: "Shipping to the Philippines typically takes 7–20 business days from the order date. Free shipping is usually included for most orders. Check the estimated delivery date at checkout.",
    returnNote: "Temu generally allows returns for defective or misrepresented items within a set window. Always take photos of the item upon arrival to support a return claim.",
  },
  {
    id: "store-sephora",
    slug: "sephora-ph",
    name: "Sephora PH",
    tagline: "Premium beauty, skincare, and fragrance",
    description:
      "Sephora Philippines is a leading premium beauty retailer carrying 300+ brands — including SK-II, Sunday Riley, Mario Badescu, ZOEVA, Natasha Denona, and Sephora Collection. Offers a Beauty Rewards loyalty program and ships nationwide.",
    country: "Philippines",
    categories: ["Beauty", "Skincare", "Makeup", "Fragrance", "Hair Care"],
    shipsToPhilippines: true,
    freeShippingMinimum: 1500,
    trustLevel: "high",
    gradient: "from-slate-800 to-slate-950",
    affiliateLink: "https://www.sephora.ph",
    isDemo: false,
    buyerNotes: [
      "All products sold on Sephora PH are authentic — it is an official brand-authorized retailer.",
      "Free shipping is available for orders above ₱1,500.",
      "Check product availability online before visiting a physical store.",
      "Sephora Beauty Rewards points can be used for discounts on future purchases.",
      "Sale prices listed on SulitScan are from the Involve Asia affiliate datafeed — always confirm the current price on sephora.ph before buying.",
      "Returns are accepted for unopened products within 30 days with proof of purchase.",
    ],
    shippingNote: "Sephora PH ships nationwide. Free shipping applies to orders ₱1,500 and above. Standard delivery typically takes 3–7 business days depending on your location.",
    returnNote: "Sephora PH accepts returns for unopened, unused products in original packaging within 30 days of purchase. Bring your receipt or order confirmation. Opened products are generally non-returnable unless defective.",
  },
]

export function getStoreBySlug(slug: string): Store | undefined {
  return stores.find((s) => s.slug === slug)
}
