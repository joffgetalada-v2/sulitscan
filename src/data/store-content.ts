export interface StoreContent {
  slug: string
  intro: string
  goodFor: string[]
  beCareful: string[]
  faqs: { question: string; answer: string }[]
}

export const storeContent: StoreContent[] = [
  {
    slug: "sephora-ph",
    intro: `Sephora Philippines is an authorized premium beauty retailer carrying 300+ brands, including SK-II, Sunday Riley, ZOEVA, Mario Badescu, Natasha Denona, and the Sephora Collection. For Filipino beauty shoppers, Sephora PH is one of the most reliable sources for authenticated skincare, makeup, and fragrance products, with a nationwide delivery network and a Beauty Rewards loyalty program.

Deals featured on SulitScan from Sephora PH are sourced through the Involve Asia affiliate program. Prices are from the affiliate datafeed and may not reflect current Sephora PH prices, always confirm the final price, shade availability, and product details on sephora.ph before buying.

SulitScan earns a small affiliate commission when you purchase through our Sephora PH links via Involve Asia, at no extra cost to you.`,
    goodFor: [
      "Authenticated skincare from trusted brands, SK-II, Sunday Riley, Kiehl's",
      "Premium makeup and foundation shade matching using Sephora's online tools",
      "Fragrance purchases where authenticity matters",
      "Stocking up on Sephora Collection products during sale periods",
      "Earning and redeeming Sephora Beauty Rewards points",
      "Free shipping on orders ₱1,500 and above",
    ],
    beCareful: [
      "Shade and variant availability, confirm your exact shade is in stock on sephora.ph before ordering",
      "Opened or used products, Sephora PH generally does not accept returns on opened beauty products unless defective",
      "Ingredient sensitivities, always check the ingredient list for known allergens before buying skincare",
      "Sale prices, sale events change frequently, confirm the current price on sephora.ph before buying",
      "Beauty Rewards tiers, some perks and free samples depend on your current tier level",
    ],
    faqs: [
      {
        question: "Does Sephora PH ship nationwide in the Philippines?",
        answer: "Yes, Sephora PH ships nationwide. Standard delivery typically takes 3 to 7 business days depending on your location. Free standard shipping applies to orders ₱1,500 and above.",
      },
      {
        question: "What is the Sephora PH return policy?",
        answer: "Sephora PH accepts returns for unopened, unused products in original packaging within 30 days of purchase with proof of purchase. Opened products are generally non-returnable unless they are defective or damaged. Check the Sephora PH website for the most current return terms.",
      },
      {
        question: "Are Sephora PH products authentic?",
        answer: "Yes, Sephora PH is an authorized retailer for all brands it carries. Products sold on sephora.ph are guaranteed authentic. If you receive a product that appears counterfeit or damaged, contact Sephora PH customer support directly.",
      },
      {
        question: "How do Sephora Beauty Rewards work in the Philippines?",
        answer: "Sephora Beauty Rewards is a loyalty program where you earn points on qualifying purchases. Points can be redeemed for Rewards Bazaar items including deluxe samples, accessories, and beauty products. Tiers include White, Black, and Gold based on annual spending.",
      },
      {
        question: "Are prices on SulitScan the same as on Sephora PH?",
        answer: "Not necessarily. Prices on SulitScan are sourced from the Involve Asia affiliate datafeed and may differ from current prices on sephora.ph. Sale events, vouchers, and Beauty Rewards offers can change the final price. Always confirm the current price on sephora.ph before completing your purchase.",
      },
    ],
  },
  {
    slug: "shopee-ph",
    intro: `Shopee Philippines is a local online marketplace where many sellers list home, tech, fashion, beauty, and daily essentials. For Filipino shoppers, Shopee is a useful source of budget finds and practical everyday items, especially under a few hundred pesos. Because orders usually ship locally, delivery tends to be faster than overseas marketplaces, and vouchers or free-shipping promos can bring an already low price down further.

The trade-off is that quality varies a lot from seller to seller. SulitScan's current Shopee selection starts with Official or Preferred shops and applies minimum feed checks for item rating, shop rating, sales history, and positive stock. Each listing also includes independent buyer notes. These checks reduce obvious risk but are only a dated snapshot: prices, ratings, seller status, and stock can change, so confirm the live listing and final cost after vouchers and shipping before completing your order.

SulitScan does not sell Shopee products and does not guarantee any seller. We point you to listings, and you buy directly from the seller on Shopee. SulitScan may earn a small affiliate commission when you buy through our links, at no extra cost to you.`,
    goodFor: [
      "Home and desk organizers, storage boxes, and small kitchen tools",
      "Phone accessories and carefully reviewed charging products from official shops",
      "Everyday fashion such as tops, jeans, tote bags, and sling bags",
      "Drinkware and travel accessories from official brand stores",
      "Kids' activities, household cleaning tools, and practical home items",
      "Listings where current feed ratings, sales history, and seller status can be checked",
    ],
    beCareful: [
      "Suspiciously large discounts: a listed 80% or 90% off can reflect an inflated original price, so compare the final price with similar items",
      "Branded or luxury-style goods at prices far below everyone else, where replicas are common",
      "Cheap chargers, power banks, and battery electronics, where safety and quality matter more",
      "Items that depend on exact sizing or material, since cheap listings can differ from the photos",
      "New sellers with few reviews: prefer Preferred Sellers or Shopee Mall as a safer starting point",
    ],
    faqs: [
      {
        question: "Does SulitScan sell Shopee products directly?",
        answer: "No. SulitScan is a shopping guide and affiliate discovery site. We point you to listings on Shopee, and you buy directly from the seller. We do not handle payments, orders, or returns.",
      },
      {
        question: "Are Shopee prices always accurate on SulitScan?",
        answer: "Not always. Prices come through the Involve Asia Shopee affiliate datafeed and can lag the live Shopee price. Vouchers and flash sales change fast, so always confirm the current price on Shopee before buying.",
      },
      {
        question: "What should I check before buying from Shopee?",
        answer: "Check the seller rating and sales count, read reviews with real buyer photos, confirm the dimensions in centimeters, and add up the final cost after vouchers and shipping. Preferred Sellers and Shopee Mall shops are a safer starting point, though not a guarantee.",
      },
      {
        question: "Why do some Shopee discounts look very high?",
        answer: "A listed 80% or 90% discount sometimes reflects an inflated original price rather than a real saving. Compare the sale price with similar items, check reviews and seller details, and weigh the shipping fee before deciding.",
      },
      {
        question: "How does SulitScan earn from Shopee links?",
        answer: "SulitScan may earn a small affiliate commission when you click a Shopee link and complete a purchase, at no extra cost to you. This does not affect your price and does not change which products we feature.",
      },
    ],
  },
]

export function getStoreContent(slug: string): StoreContent | undefined {
  return storeContent.find((s) => s.slug === slug)
}
