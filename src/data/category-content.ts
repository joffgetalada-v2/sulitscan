export interface CategoryContent {
  slug: string
  metaDescription: string
  intro: string
  bestFor: string[]
  whatToCheck: string[]
  commonMistakes: string[]
  faqs: { question: string; answer: string }[]
  relatedCategories: string[]
  relatedBlogSlugs: string[]
}

export const categoryContent: Record<string, CategoryContent> = {
  "under-500": {
    slug: "under-500",
    metaDescription:
      "Browse current deals under ₱500 from Shopee PH and Sephora PH, with checks for size, seller quality, final price, and return terms.",
    intro:
      "A useful item under ₱500 is not automatically a bargain. SulitScan's current selection focuses on low-cost Shopee PH home, travel, fashion, and tech accessories plus qualifying Sephora PH beauty items. Compare the delivered total, measurements, materials, seller record, and current return terms before deciding. A slightly higher-priced listing can be better value when it is the correct size, clearly documented, and sold by a stronger shop.",
    bestFor: [
      "Small home organizers, storage accessories, and simple kitchen tools",
      "Travel pouches, desk accessories, and other low-stakes items",
      "Basic bags and accessories where exact sizing is easy to verify",
      "Selected beauty minis, tools, or accessories from established retailers",
      "Testing whether a product type solves a problem before buying a larger version",
    ],
    whatToCheck: [
      "Read recent buyer reviews with photos for the exact variation you plan to order.",
      "Confirm dimensions in centimeters and compare them with the intended space or item.",
      "Add shipping and required accessories before comparing the final cost.",
      "Check the live seller rating, stock status, delivery estimate, and return window.",
      "For cosmetics, verify the ingredient list, shade or variant, seal, and seller identity.",
    ],
    commonMistakes: [
      "Buying several units before checking the quality of one delivered item.",
      "Treating a crossed-out reference price as proof of a real discount.",
      "Assuming listing photos show scale accurately instead of reading measurements.",
      "Using a voucher as the reason to buy something that was not already needed.",
    ],
    faqs: [
      {
        question: "What usually gives the best value under ₱500?",
        answer:
          "Simple items with easy-to-check dimensions and few failure points often make the strongest candidates: organizers, pouches, basic accessories, and manual tools. Electronics, safety equipment, and products making health claims need stricter checks than price alone.",
      },
      {
        question: "How can I tell if an under ₱500 deal is actually sulit?",
        answer:
          "Compare the final delivered total, usable quantity, measurements, material, seller record, and current return terms. SulitScan's score is a research aid, not a guarantee, so confirm every live detail on the partner store.",
      },
      {
        question: "Are SulitScan prices guaranteed?",
        answer:
          "No. Prices come from affiliate datafeeds and can differ from the live store. Confirm the selected variation, final cart total, shipping, vouchers, and seller terms before paying.",
      },
    ],
    relatedCategories: ["under-1000", "home-finds", "beauty"],
    relatedBlogSlugs: [
      "best-shopee-finds-under-500-philippines",
      "how-to-spot-fake-discounts",
      "online-product-review-checklist-philippines",
    ],
  },

  "under-1000": {
    slug: "under-1000",
    metaDescription:
      "Compare deals under ₱1,000 from Shopee PH and Sephora PH using final cost, specifications, seller evidence, and current return terms.",
    intro:
      "The under ₱1,000 range covers everything from simple accessories to small appliances, fashion basics, home tools, and beauty sets. That variety makes a single 'best buy' rule unreliable. Start with the job the item must do, then compare the exact model or variation, complete delivered cost, seller evidence, and support available if it arrives wrong. Spend the budget on documented fit and function rather than on the largest discount label.",
    bestFor: [
      "Home and desk products with measurable dimensions and simple functions",
      "Fashion basics when garment measurements and fabric composition are provided",
      "Beauty minis, starter sets, and tools from identifiable retailers or official shops",
      "Phone and computer accessories with exact connector and device compatibility",
      "Practical gifts where presentation, delivery timing, and return terms are clear",
    ],
    whatToCheck: [
      "Compare the current checkout total rather than the headline price alone.",
      "Verify the exact size, color, capacity, connector, or bundle selected in the cart.",
      "Check whether required batteries, adapters, refills, or accessories are included.",
      "Review recent feedback for the same variation and the shop's current status.",
      "Save the listing and order details that describe what the seller agreed to provide.",
    ],
    commonMistakes: [
      "Buying a larger bundle without calculating cost per usable unit.",
      "Comparing different product sizes as if the sticker prices describe equal value.",
      "Ignoring warranty details on small appliances and powered accessories.",
      "Letting a voucher expiry replace a considered purchase decision.",
    ],
    faqs: [
      {
        question: "What products are sensible to compare under ₱1,000?",
        answer:
          "Home tools, desk accessories, bags, basic clothing, beauty minis, and straightforward tech accessories can be compared at this price. Use specifications appropriate to the category rather than assuming every item needs the same checklist.",
      },
      {
        question: "Should I choose the listing with the biggest discount?",
        answer:
          "Not automatically. Verify the reference price, exact variation, delivered cost, seller record, and evidence from recent buyers. A smaller honest discount on the right product can be better value.",
      },
      {
        question: "Do the prices include shipping and vouchers?",
        answer:
          "Not necessarily. Affiliate datafeed prices can lag and do not always represent your final cart. Confirm shipping, voucher eligibility, quantity, and payment terms on the partner store.",
      },
    ],
    relatedCategories: ["under-500", "fashion", "home-finds"],
    relatedBlogSlugs: [
      "best-work-from-home-desk-accessories-under-1000-philippines",
      "why-final-prices-change-at-checkout",
      "voucher-shipping-return-checklist",
    ],
  },

  beauty: {
    slug: "beauty",
    metaDescription:
      "Research beauty deals from Sephora PH and Shopee PH with checks for seller identity, ingredients, shade, product size, seals, and return limits.",
    intro:
      "Beauty deals require more than a price comparison because authenticity, ingredients, shade, product size, and storage can affect whether a purchase is usable. SulitScan's current coverage includes Sephora PH and selected Shopee PH listings. Match the exact product and seller to reliable evidence, read the full ingredient and size information, and check current return restrictions before ordering. A low price does not resolve an unclear batch, seal, or seller identity.",
    bestFor: [
      "Skincare and makeup from identifiable official or established retail channels",
      "Travel sizes and minis when the volume is stated clearly",
      "Makeup tools and organizers with dimensions and washable materials",
      "Gift sets whose contents, sizes, shades, and packaging are documented",
      "Replacements for products whose formula and shade already suit the buyer",
    ],
    whatToCheck: [
      "Confirm the exact seller, product name, size, shade, and variant before checkout.",
      "Read the complete ingredient list and follow product-specific warnings.",
      "Compare price per milliliter or gram when sizes differ.",
      "Check seal, batch, expiry, and packaging information when the product arrives.",
      "Read the current return rule before opening a cosmetic or personal-care item.",
    ],
    commonMistakes: [
      "Comparing a mini with a full-size product using only the total price.",
      "Assuming a marketplace badge alone proves the identity of the delivered item.",
      "Ordering a shade from a promotional photo without checking the exact variation.",
      "Opening or using a product before documenting damage, leakage, or the wrong item.",
    ],
    faqs: [
      {
        question: "How should I verify an online beauty listing?",
        answer:
          "Check the seller identity, exact product and size, ingredient list, selected shade, recent buyer evidence, and live retailer terms. On arrival, compare the delivered item with the saved order details before opening it.",
      },
      {
        question: "Are beauty minis always better value?",
        answer:
          "No. Minis can reduce commitment or suit travel, but may cost more per milliliter or gram. Compare the current delivered cost per unit and only buy a larger size when you expect to use it safely before expiry.",
      },
      {
        question: "Can an opened beauty product be returned?",
        answer:
          "Eligibility depends on the retailer, reason, product, and current return window. Review the live policy before opening, and document a wrong, leaking, damaged, or unsealed delivery immediately.",
      },
    ],
    relatedCategories: ["under-500", "under-1000", "gift-ideas"],
    relatedBlogSlugs: [
      "sephora-ph-beauty-guide",
      "how-to-check-skincare-makeup-legit-philippines",
      "sephora-ph-minis-vs-full-size-value-sets",
    ],
  },

  "home-finds": {
    slug: "home-finds",
    metaDescription:
      "Browse Shopee PH home finds with practical checks for dimensions, materials, load limits, electrical details, seller evidence, and final cost.",
    intro:
      "Home finds can solve a real storage, cleaning, or setup problem, but styled photos rarely prove fit or durability. SulitScan's current home selection is sourced from Shopee PH. Measure the intended space, identify the load or task, and compare materials, assembly, required accessories, and seller evidence for the exact variation. For powered items, verify ratings, certification scope, warranty, and instructions before price enters the decision.",
    bestFor: [
      "Organizers and storage products with complete external and internal dimensions",
      "Manual kitchen and cleaning tools with clear material information",
      "Decor and frames when mounting method, weight, and scale are documented",
      "Renter-friendly improvements that do not require unsafe modification",
      "Small furniture accessories after measuring clearance and load requirements",
    ],
    whatToCheck: [
      "Measure width, depth, height, openings, and clearance at the actual location.",
      "Check material, load limit, assembly method, and included hardware.",
      "Use buyer photos to evaluate scale and finish for the exact variant.",
      "For electrical products, verify ratings, instructions, and applicable safety evidence.",
      "Include installation supplies and shipping in the complete cost.",
    ],
    commonMistakes: [
      "Measuring the empty space but not the path needed to install or open the item.",
      "Treating water-resistant, rust-resistant, or heavy-duty as absolute guarantees.",
      "Assuming screws, adapters, batteries, or mounting parts are included.",
      "Choosing an electrical item from appearance or wattage without checking requirements.",
    ],
    faqs: [
      {
        question: "What should I measure before buying a home organizer?",
        answer:
          "Measure the available width, depth, height, opening, and any door, drawer, cable, or ventilation clearance. Compare those measurements with the exact assembled product dimensions, not a styled photo.",
      },
      {
        question: "How should I assess a powered home item?",
        answer:
          "Check the exact model's electrical rating, plug, instructions, warranty, seller identity, and any applicable Philippine safety requirements. Do not infer compatibility or certification from a generic listing image.",
      },
      {
        question: "Does SulitScan inspect every home product?",
        answer:
          "No. SulitScan provides desk-researched buyer guidance and affiliate-datafeed listings. Confirm current details on the seller page and inspect the delivered item before installation or use.",
      },
    ],
    relatedCategories: ["under-500", "under-1000", "gift-ideas"],
    relatedBlogSlugs: [
      "first-apartment-essentials-under-1000-philippines",
      "online-furniture-measurement-guide-philippines",
      "food-storage-containers-buying-guide-philippines",
    ],
  },

  "tech-deals": {
    slug: "tech-deals",
    metaDescription:
      "Compare Shopee PH tech deals using connector, device, power, safety, warranty, seller, and delivered-cost checks before checkout.",
    intro:
      "Tech accessories can look interchangeable while differing in connector, protocol, output, device support, and safety evidence. SulitScan's current tech selection comes from Shopee PH. Start with the device model and job to be done, then verify the exact specification, included components, seller identity, warranty, and current buyer evidence. A high claimed capacity or wattage is not useful when the listing cannot document compatibility and support.",
    bestFor: [
      "Stands, mounts, cases, and organizers with measurable fit requirements",
      "Cables and adapters whose connectors and supported standards are stated",
      "Accessories from identifiable official or preferred shops with current evidence",
      "Replacement items that match an existing model number and specification",
      "Simple peripherals after checking operating-system and device compatibility",
    ],
    whatToCheck: [
      "Match the exact device, connector, protocol, dimensions, and required software.",
      "For powered products, verify input, output, cable, protection, and safety evidence.",
      "Check whether the selected bundle includes every component shown in the photo.",
      "Read recent reviews for the exact model or variation, not only the shop average.",
      "Confirm warranty coverage, claim contact, and current return window before paying.",
    ],
    commonMistakes: [
      "Buying by connector shape while ignoring the charging or data standard.",
      "Treating claimed capacity, power, or range as independently verified performance.",
      "Assuming a familiar brand name in a title proves authorized inventory.",
      "Using an unverified charger, battery, or adapter because the discount looks large.",
    ],
    faqs: [
      {
        question: "How do I check whether a tech accessory is compatible?",
        answer:
          "Start with the exact device model and required function. Then match connector, protocol, dimensions, power requirements, operating system, and any app or firmware requirement for the selected variation.",
      },
      {
        question: "Is a high wattage or capacity claim enough to choose a product?",
        answer:
          "No. Check how the claim is measured, whether the device and cable support it, which protections and certifications apply, and what warranty backs the exact model. Treat an unsupported headline number cautiously.",
      },
      {
        question: "Does SulitScan guarantee device compatibility?",
        answer:
          "No. Product revisions and device requirements change. Confirm the exact model and specification with the manufacturer or seller before buying and test within the current return window.",
      },
    ],
    relatedCategories: ["under-500", "under-1000", "home-finds"],
    relatedBlogSlugs: [
      "power-bank-buying-guide-philippines",
      "phone-tripod-buying-guide-philippines",
      "wireless-earbuds-buying-guide-philippines",
    ],
  },

  fashion: {
    slug: "fashion",
    metaDescription:
      "Browse Shopee PH fashion deals with checks for garment measurements, fabric, variation, seller evidence, delivered cost, and return terms.",
    intro:
      "Fashion value depends on fit, fabric, construction, and how often an item will be worn—not only on a low listing price. SulitScan's current fashion selection comes from Shopee PH. Compare the garment measurements for the exact variation with a similar item you already own, read the fabric composition and care instructions, and use recent buyer photos to judge drape, color, and finish. Confirm the current size-return process before ordering.",
    bestFor: [
      "Bags and accessories with clear dimensions and material descriptions",
      "Casual basics when complete garment measurements are available",
      "Simple pieces whose fit can be compared with an item already owned",
      "Seasonal accessories where exact body fit is less critical",
      "Known brands from identifiable official or preferred shops",
    ],
    whatToCheck: [
      "Use garment measurements in centimeters instead of relying on S, M, or L labels.",
      "Compare fabric composition, lining, stretch, closure, and care instructions.",
      "Check the exact color and size selected in the cart before payment.",
      "Use recent buyer photos to assess scale, opacity, stitching, and color.",
      "Read the live return rule for fit, hygiene, tags, packaging, and deadlines.",
    ],
    commonMistakes: [
      "Ordering a usual size without comparing the listing's garment measurements.",
      "Using body measurements and garment measurements as if they are identical.",
      "Assuming styled photos show fabric thickness, opacity, or true color.",
      "Removing tags or packaging before checking fit and the delivered variation.",
    ],
    faqs: [
      {
        question: "Should I order my usual online clothing size?",
        answer:
          "Not without checking. Compare the listing's garment measurements with a similar item that fits you, and account for the fabric's stretch and the fit you want. Letter sizes vary between listings.",
      },
      {
        question: "How can I judge fabric quality online?",
        answer:
          "Read the composition and care details, inspect close buyer photos, and look for comments on weight, opacity, stretch, stitching, and feel. A promotional photo alone cannot establish those qualities.",
      },
      {
        question: "Can I return clothing that does not fit?",
        answer:
          "That depends on the seller, platform, reason, condition, and current deadline. Read the live policy before ordering and keep tags, packaging, and order evidence until you have checked the item.",
      },
    ],
    relatedCategories: ["under-500", "under-1000", "gift-ideas"],
    relatedBlogSlugs: [
      "online-shoe-size-guide-philippines",
      "bags-under-500-philippines-buying-guide",
      "online-product-review-checklist-philippines",
    ],
  },

  "gift-ideas": {
    slug: "gift-ideas",
    metaDescription:
      "Compare gift ideas from Shopee PH and Sephora PH using recipient fit, delivery timing, presentation, seller evidence, and return terms.",
    intro:
      "A good online gift must suit the recipient, arrive on time, and remain supportable if the parcel is wrong or damaged. SulitScan's current gift category draws from Shopee PH and Sephora PH listings that meet the category's score threshold. Treat that score as a shortlist, then verify the exact variation, presentation, delivery estimate, seller evidence, and return restrictions. For time-sensitive occasions, a documented local option may be better than a more dramatic discount.",
    bestFor: [
      "Practical home, desk, or travel items matched to a known need",
      "Beauty sets and minis when preferences, allergies, and product details are known",
      "Bags and accessories with forgiving fit and clear measurements",
      "Consumable or refillable items the recipient already uses",
      "Gifts whose delivery estimate leaves time to inspect and rewrap them",
    ],
    whatToCheck: [
      "Confirm the recipient's preferences, size, allergies, device, or existing setup.",
      "Check the exact variant, included items, packaging, and gift-ready condition.",
      "Use the live delivery estimate and allow inspection time before the occasion.",
      "Review return restrictions for cosmetics, personalized goods, and opened items.",
      "Keep the order record and avoid exposing the recipient's personal data unnecessarily.",
    ],
    commonMistakes: [
      "Ordering too close to the event based on an ideal delivery estimate.",
      "Choosing a bundle without checking the size or quantity of each component.",
      "Buying skincare, fragrance, clothing, or tech without recipient-specific checks.",
      "Discarding order or packaging evidence before the recipient inspects the item.",
    ],
    faqs: [
      {
        question: "What makes an online gift lower risk?",
        answer:
          "Choose something matched to a known need, with clear specifications, a reliable seller, enough delivery buffer, and a workable current return process. Avoid guessing on allergies, exact fit, shade, scent, or device compatibility.",
      },
      {
        question: "How early should I order a holiday gift?",
        answer:
          "Use the live estimated delivery date and add time to inspect, resolve problems, and wrap the item. Campaigns, weather, origin, seller preparation, and non-working days can change the estimate, so there is no universal safe cutoff.",
      },
      {
        question: "Does a high SulitScore guarantee a good gift?",
        answer:
          "No. It helps shortlist listings using available deal and risk signals, but it cannot know the recipient's needs or guarantee stock, delivery, condition, or suitability. Confirm the live details yourself.",
      },
    ],
    relatedCategories: ["beauty", "fashion", "under-1000"],
    relatedBlogSlugs: [
      "best-gifts-under-500-philippines",
      "sephora-ph-minis-vs-full-size-value-sets",
      "christmas-lights-buying-guide-philippines",
    ],
  },

  travel: {
    slug: "travel",
    metaDescription:
      "Browse Shopee PH travel organizers and pouches with checks for dimensions, material, zipper quality, delivered cost, and current return terms.",
    intro:
      "Travel finds on SulitScan focus on small products that organize a trip: toiletry bags, packing pouches, and zippered organizers from Shopee PH. They are easier to compare than luggage, but the dimensions, material, zipper, seams, and water-resistance claim still matter. Choose for a specific packing job, confirm the exact variation, and compare the delivered cost with what you already own before adding another organizer.",
    bestFor: [
      "Toiletry bags and hanging wash bags with usable internal dimensions",
      "Packing pouches for separating clothes, cables, or small accessories",
      "Compact daily-carry pouches with a clearly shown closure and lining",
      "Lightweight organizers that solve a defined packing problem",
      "Low-stakes accessories that can be inspected before the trip",
    ],
    whatToCheck: [
      "Confirm external and internal dimensions in centimeters.",
      "Check material and water-resistance language against instructions and buyer photos.",
      "Read recent feedback that specifically mentions zippers, seams, and lining.",
      "Add shipping and compare the final cost with a pouch you already own.",
      "Check seller status, delivery estimate, and return terms before a fixed trip date.",
    ],
    commonMistakes: [
      "Buying from a styled photo without mapping the items that must fit inside.",
      "Treating water-resistant as waterproof without supporting instructions.",
      "Ignoring zipper and seam feedback because the item is inexpensive.",
      "Ordering too close to a trip to inspect or replace a wrong item.",
    ],
    faqs: [
      {
        question: "Are low-cost travel pouches worth buying?",
        answer:
          "They can be when they solve a defined organization problem and the measurements, material, zipper, and seams are documented. Compare the delivered cost with what you already have before buying.",
      },
      {
        question: "What should I check before buying a toiletry bag?",
        answer:
          "Map the bottles and tools that must fit, verify internal dimensions, check lining and closure details, and review how the maker describes leaks or water resistance. Keep liquids in separate sealed containers.",
      },
      {
        question: "Does SulitScan sell travel items directly?",
        answer:
          "No. SulitScan is a shopping guide and may link to affiliate listings. You buy from the partner seller, so confirm the current price, seller, delivery estimate, and return terms there.",
      },
    ],
    relatedCategories: ["under-500", "home-finds", "fashion"],
    relatedBlogSlugs: [
      "travel-packing-organizers-philippines-buying-guide",
      "carry-on-luggage-philippines-buying-guide",
      "online-shopping-safety-tips-philippines",
    ],
  },
}

export function getCategoryMetaDescription(slug: string, fallback: string): string {
  return categoryContent[slug]?.metaDescription ?? fallback
}
