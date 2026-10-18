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
  /** Optional wide store banner used as the card header (falls back to the gradient). */
  bannerImage?: string
  /** Intrinsic banner dimensions for correct aspect ratio (defaults to 1811x412). */
  bannerWidth?: number
  bannerHeight?: number
  /** True when the banner image already includes the store-status badge, so the
      card does not overlay a duplicate "Active Store" pill. */
  bannerHasBadge?: boolean
  /**
   * External store link (store homepage). Optional: stores reached only through
   * per-product affiliate links (e.g. Shopee PH) have no store-level link, so we
   * use internal links to their on-site deals instead of inventing one.
   */
  affiliateLink?: string
  /** Slug of the most relevant on-site buyer guide for this store. */
  relatedGuideSlug?: string
  isDemo: boolean
  buyerNotes: string[]
  shippingNote: string
  returnNote: string
}

export const stores: Store[] = [
  {
    id: "store-sephora",
    slug: "sephora-ph",
    name: "Sephora PH",
    tagline: "Premium beauty, skincare, and fragrance",
    description:
      "Sephora Philippines is a leading premium beauty retailer carrying 300+ brands, including SK-II, Sunday Riley, Mario Badescu, ZOEVA, Natasha Denona, and Sephora Collection. Offers a Beauty Rewards loyalty program and ships nationwide.",
    country: "Philippines",
    categories: ["Beauty", "Skincare", "Makeup", "Fragrance", "Hair Care"],
    shipsToPhilippines: true,
    freeShippingMinimum: 1500,
    trustLevel: "high",
    gradient: "from-slate-800 to-slate-950",
    bannerImage: "/banners/stores/sephora-ph.jpg",
    affiliateLink: "https://invl.me/clnkccv",
    relatedGuideSlug: "sephora-ph-beauty-guide",
    isDemo: false,
    buyerNotes: [
      "Sephora PH is the partner store listed for these beauty deals. Always confirm product details, shade, and return terms on sephora.ph before buying.",
      "Free shipping is available for orders above ₱1,500.",
      "Check product availability online before visiting a physical store.",
      "Sephora Beauty Rewards points can be used for discounts on future purchases.",
      "Sale prices listed on SulitScan are from the Involve Asia affiliate datafeed, so always confirm the current price on sephora.ph before buying.",
      "Returns are accepted for unopened products within 30 days with proof of purchase.",
    ],
    shippingNote: "Sephora PH ships nationwide. Free shipping applies to orders ₱1,500 and above. Standard delivery typically takes 3–7 business days depending on your location.",
    returnNote: "Sephora PH accepts returns for unopened, unused products in original packaging within 30 days of purchase. Bring your receipt or order confirmation. Opened products are generally non-returnable unless defective.",
  },
  {
    id: "store-shopee-ph",
    slug: "shopee-ph",
    name: "Shopee PH",
    tagline: "Marketplace finds for everyday shopping",
    description:
      "Shopee Philippines is a local marketplace with a wide range of products from many sellers, covering home, tech, fashion, beauty, and daily essentials. Best for budget finds and practical everyday items where you check the seller rating, buyer reviews, and the final price after vouchers and shipping.",
    country: "Philippines",
    categories: ["Home", "Fashion", "Electronics", "Beauty", "Travel"],
    shipsToPhilippines: true,
    freeShippingMinimum: null,
    trustLevel: "medium",
    gradient: "from-orange-500 to-red-500",
    bannerImage: "/banners/stores/shopee-ph.jpg",
    bannerWidth: 1810,
    bannerHeight: 869,
    bannerHasBadge: true,
    affiliateLink: "https://invl.me/clnkccq",
    relatedGuideSlug: "best-shopee-finds-under-500-philippines",
    isDemo: false,
    buyerNotes: [
      "SulitScan's current Shopee picks are reviewed datafeed records from Official or Preferred shops, with item and shop ratings of at least 4.8 and positive stock when checked.",
      "Still check the latest seller rating and buyer reviews before ordering because marketplace status, stock, and feedback can change.",
      "Compare the final price after vouchers and shipping fees, not just the listed sale price.",
      "Review the product photos and the dimensions in centimeters carefully before buying.",
      "Be cautious with suspicious branded replicas or unrealistic discounts on well-known brands.",
      "Check the return and refund terms on Shopee before buying, especially for low-value items.",
      "Prices on SulitScan are from the Involve Asia Shopee affiliate datafeed and can lag the live Shopee price. Always confirm the current price on Shopee before buying.",
    ],
    shippingNote: "Most Shopee PH orders ship locally within the Philippines, so delivery is usually faster than overseas marketplaces. Shipping time, fees, and free-shipping vouchers vary by seller and location. Confirm the estimated delivery date and shipping fee at checkout.",
    returnNote: "Shopee PH has a return and refund process through Shopee Guarantee, but terms vary by seller. Take photos or video when your order arrives, and file any return within the listed window. For low-value items, weigh the return shipping cost against the refund.",
  },
]

export function getStoreBySlug(slug: string): Store | undefined {
  return stores.find((s) => s.slug === slug)
}
