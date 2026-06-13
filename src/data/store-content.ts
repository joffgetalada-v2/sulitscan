export interface StoreContent {
  slug: string
  intro: string
  goodFor: string[]
  beCareful: string[]
  faqs: { question: string; answer: string }[]
}

export const storeContent: StoreContent[] = [
  {
    slug: "temu",
    intro: `Temu is a global online marketplace offering a wide range of everyday products at very low price points — from home organizers and kitchen tools to phone accessories, fashion basics, and beauty items. For Filipino shoppers, Temu can be a useful source of budget-friendly finds, especially for non-critical purchases where you're comfortable with some variability in quality.

Because Temu ships internationally to the Philippines, delivery typically takes 7 to 20 business days. Product quality varies by seller and product type. Deals featured on SulitScan are manually selected and annotated with buyer notes — but prices from our affiliate datafeed may not reflect the current price on Temu. Always confirm the price, available vouchers, and product details on Temu before completing your order.

SulitScan earns a small affiliate commission when you purchase through our links, at no extra cost to you.`,
    goodFor: [
      "Home organizers, storage boxes, and drawer dividers",
      "Kitchen tools, utensils, and small appliances",
      "Phone accessories, cables, and holders",
      "Fashion basics — basics, activewear, belts, and accessories",
      "Decor items, seasonal finds, and craft supplies",
      "Under ₱500 gift ideas and stocking stuffers",
    ],
    beCareful: [
      "Electronics above ₱1,000 — quality can be inconsistent and returns are harder",
      "Items requiring exact sizing — check size guides in centimeters, not just S/M/L labels",
      "Branded or luxury-style goods — Temu is not an authorized retailer of established brands",
      "Items where fast delivery matters — standard shipping takes 7–20 business days",
      "Heavily discounted \"original\" prices — some baseline prices may be inflated",
    ],
    faqs: [
      {
        question: "How long does Temu shipping take to the Philippines?",
        answer: "Standard shipping from Temu typically takes 7 to 20 business days to the Philippines. You can track your order in the Temu app. Express shipping may be available on some orders at checkout.",
      },
      {
        question: "Does Temu ship to all areas in the Philippines?",
        answer: "Temu ships to most areas in the Philippines. Delivery availability and estimated dates are shown at checkout based on your address. Remote or island areas may have longer estimated delivery times.",
      },
      {
        question: "What is Temu's return policy for Filipino buyers?",
        answer: "Temu generally allows returns for defective or misrepresented items within a set return window (usually 90 days for eligible items). Always take photos or video when your order arrives to support a return claim. Check the return policy details on the specific product page before buying.",
      },
      {
        question: "Are prices on SulitScan the same as on Temu?",
        answer: "No. Prices on SulitScan are sourced from Temu's affiliate datafeed and may differ from the current price on Temu.com. Prices can change frequently due to platform promotions, flash sales, and vouchers. Always confirm the final price on Temu before completing your purchase.",
      },
      {
        question: "Can I use vouchers on top of Temu sale prices?",
        answer: "Yes — Temu frequently offers platform-wide coupons, new-user discounts, and bundled vouchers that can stack on top of listed sale prices. Check the Temu app coupon section before checkout to see available savings.",
      },
    ],
  },
  {
    slug: "sephora-ph",
    intro: `Sephora Philippines is an authorized premium beauty retailer carrying 300+ brands — including SK-II, Sunday Riley, ZOEVA, Mario Badescu, Natasha Denona, and the Sephora Collection. For Filipino beauty shoppers, Sephora PH is one of the most reliable sources for authenticated skincare, makeup, and fragrance products, with a nationwide delivery network and a Beauty Rewards loyalty program.

Deals featured on SulitScan from Sephora PH are sourced through the Involve Asia affiliate program. Prices are from the affiliate datafeed and may not reflect current Sephora PH prices — always confirm the final price, shade availability, and product details on sephora.ph before buying.

SulitScan earns a small affiliate commission when you purchase through our Sephora PH links via Involve Asia, at no extra cost to you.`,
    goodFor: [
      "Authenticated skincare from trusted brands — SK-II, Sunday Riley, Kiehl's",
      "Premium makeup and foundation shade matching using Sephora's online tools",
      "Fragrance purchases where authenticity matters",
      "Stocking up on Sephora Collection products during sale periods",
      "Earning and redeeming Sephora Beauty Rewards points",
      "Free shipping on orders ₱1,500 and above",
    ],
    beCareful: [
      "Shade and variant availability — confirm your exact shade is in stock on sephora.ph before ordering",
      "Opened or used products — Sephora PH generally does not accept returns on opened beauty products unless defective",
      "Ingredient sensitivities — always check the ingredient list for known allergens before buying skincare",
      "Sale prices — sale events change frequently, confirm the current price on sephora.ph before buying",
      "Beauty Rewards tiers — some perks and free samples depend on your current tier level",
    ],
    faqs: [
      {
        question: "Does Sephora PH ship nationwide in the Philippines?",
        answer: "Yes — Sephora PH ships nationwide. Standard delivery typically takes 3 to 7 business days depending on your location. Free standard shipping applies to orders ₱1,500 and above.",
      },
      {
        question: "What is the Sephora PH return policy?",
        answer: "Sephora PH accepts returns for unopened, unused products in original packaging within 30 days of purchase with proof of purchase. Opened products are generally non-returnable unless they are defective or damaged. Check the Sephora PH website for the most current return terms.",
      },
      {
        question: "Are Sephora PH products authentic?",
        answer: "Yes — Sephora PH is an authorized retailer for all brands it carries. Products sold on sephora.ph are guaranteed authentic. If you receive a product that appears counterfeit or damaged, contact Sephora PH customer support directly.",
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
]

export function getStoreContent(slug: string): StoreContent | undefined {
  return storeContent.find((s) => s.slug === slug)
}
