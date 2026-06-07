export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  publishedAt: string
  readTime: number
  tags: string[]
  coverGradient: string
}

export const posts: BlogPost[] = [
  {
    id: "post-001",
    slug: "how-sulitscan-checks-deals",
    title: "How SulitScan Checks Deals Before You Click Buy",
    excerpt:
      "Before any deal appears on SulitScan, we run it through a manual checklist. Here's exactly what we look at — and what we don't.",
    content: `
SulitScan is not a live price aggregator. We manually curate selected deals from Temu and Sephora PH through affiliate partner programs. Here's what our deal-checking process looks like.

## What We Check

**1. Is the price actually lower than usual?**
We compare the listed sale price against publicly visible prices and similar products. If a product's "original price" looks inflated to make the discount seem bigger, we note that.

**2. Is this a real product from a real seller?**
For Sephora PH: all products come from an official, brand-authorized retailer. Authenticity is not a concern.
For Temu: we check that the product category is appropriate for Temu (non-critical home, fashion, decor) and that buyer reviews exist.

**3. Can additional savings be applied?**
We note if platform vouchers, first-order discounts, or loyalty points can stack on top of the listed sale price.

**4. What should the buyer check before purchasing?**
Every deal card includes buyer notes: sizing reminders, shipping speed, quality flags, and return policy context.

**5. What is the SulitScore?**
A 1–10 score based on discount authenticity, seller trust, review quality, voucher potential, and shipping context.

## What We Do Not Do

- We do not physically test products.
- We do not verify live inventory.
- We do not guarantee the price at checkout — prices change.
- We do not process payments or take orders.

## The Honest Disclaimer

Prices listed on SulitScan are sourced from affiliate datafeeds and may not match the current price on the partner store. Always confirm the final price, available vouchers, and seller terms on Sephora PH or Temu before you buy.

## Before You Click Buy — Your Checklist

- Is the price on the partner store the same as what SulitScan shows?
- Are there platform or seller vouchers you can apply?
- Have you checked the size guide or product dimensions?
- Have you read buyer reviews on the partner store?
- Do you understand the return policy?

SulitScan is a starting point — not the final word. You decide when to buy.

## Affiliate Disclosure

SulitScan may earn a commission when you click a partner link and complete a purchase. This does not affect your price. See our full [Affiliate Disclosure](/affiliate-disclosure) for details.
    `.trim(),
    category: "About SulitScan",
    author: "SulitScan Team",
    publishedAt: "2026-06-01",
    readTime: 5,
    tags: ["how-it-works", "transparency", "sulitscan", "deal-checking"],
    coverGradient: "from-green-400 to-emerald-600",
  },
  {
    id: "post-002",
    slug: "temu-shopping-guide-philippines",
    title: "Temu Shopping Guide for Filipino Buyers: What to Know Before You Order",
    excerpt:
      "Temu offers surprisingly low prices, but there are a few things Filipino shoppers should know before clicking Buy Now.",
    content: `
Temu has become popular in the Philippines for its ultra-low prices on home decor, fashion, gadgets, and everyday basics. Here's a practical guide for Filipino buyers.

## What Temu Is Good For

Temu works best for:
- Home organizers, storage, and decor
- Phone accessories (cases, holders, cables)
- Basic clothing and fashion accessories
- Hobby and craft supplies
- Small kitchen tools and gadgets

**What to avoid on Temu:** High-value electronics, medications, branded goods, or anything where quality consistency is critical.

## Pricing Reality

Temu's prices are genuinely low. But:
- The "original price" shown may be inflated to make the discount look bigger.
- Vouchers and first-order discounts are common — check the promotions tab before checkout.
- Shipping is often included, but check the estimated delivery window carefully.

## Sizing

Filipino shoppers consistently report that Temu clothing runs smaller than stated. Size up by at least one size for clothing. Always check the measurements in the product description, not just the size label.

## Shipping to the Philippines

Standard shipping typically takes **7–20 business days**. Express shipping (if available) reduces this to 5–10 days. Temu does not guarantee exact delivery dates but usually meets the estimated window.

## Returns and Refunds

Temu's return process is generally straightforward for:
- Items not as described
- Defective products
- Items not received

Take photos of every order when it arrives. If an item is damaged or wrong, file the return request within the stated window (usually 90 days from purchase).

## Before You Buy on Temu — Checklist

- Read buyer reviews (not just the star rating — read written reviews)
- Check the size measurements, not just the label
- Look for the estimated shipping date
- Check if a first-order or platform voucher applies
- Is this a purchase you'd be OK with if quality is slightly off?

## Affiliate Disclosure

SulitScan may earn a commission when you click a Temu affiliate link and complete a purchase. This does not affect your price.
    `.trim(),
    category: "Platform Guides",
    author: "SulitScan Team",
    publishedAt: "2026-06-02",
    readTime: 6,
    tags: ["temu", "shopping-guide", "philippines", "tips", "buyer-guide"],
    coverGradient: "from-orange-400 to-red-500",
  },
  {
    id: "post-003",
    slug: "sephora-ph-beauty-guide",
    title: "Sephora PH Beauty Deals: What to Check Before Buying",
    excerpt:
      "Sephora PH carries 300+ authentic beauty brands. Here's how to get the best value from their deals, loyalty points, and sale events.",
    content: `
Sephora Philippines is one of the most trusted beauty retailers in the country. Carrying premium brands like SK-II, Sunday Riley, Mario Badescu, ZOEVA, Urban Decay, and their own Sephora Collection line, it's the go-to for authenticated skincare and makeup.

## Why Sephora PH Deals Are Worth Checking

Unlike marketplace sellers, all Sephora PH products are brand-authorized and authenticated. When Sephora runs a sale or promo, the discount is real — not padded from an inflated original.

SulitScan tracks selected Sephora PH deals through the Involve Asia affiliate program. We list the price from the datafeed, but always **confirm the current price on sephora.ph** before purchasing.

## Types of Sephora PH Deals

**1. Sephora Collection Products**
Sephora's own brand offers good quality at accessible prices (₱500–₱1,500 range). Popular picks include setting sprays, primers, brushes, and lip products.

**2. Brand Sales and Promos**
Sephora PH regularly runs brand-specific promos on premium lines. These are often time-limited — check their website or app for current promotions.

**3. Gift Sets and Value Sets**
Around holidays and sale events, Sephora bundles products into gift sets at better per-item pricing than buying individually.

## Beauty Rewards Program

Sephora PH has a Beauty Rewards loyalty program:
- Earn points on every purchase
- Points can be redeemed for discounts
- Higher tiers (Gold, VIB) get early sale access and exclusive promos

If you're a frequent Sephora buyer, creating an account and building your tier is worth it.

## Free Shipping Threshold

Free standard shipping applies to orders **₱1,500 and above**. If your order is slightly below, adding a small Sephora Collection item can push you over the threshold and save on shipping.

## Before You Buy at Sephora PH — Checklist

- Is the price on sephora.ph the same as what SulitScan shows?
- Is there an active platform promo or Beauty Rewards offer you can use?
- Is the product available in your preferred shade, size, or variant?
- Are you familiar with the brand's return policy for opened products?
- Is this a product suited to your skin type and concern?

## Returns at Sephora PH

Sephora PH accepts returns for unopened, unused products within 30 days with proof of purchase. Opened products are generally non-returnable unless defective. If buying a product for the first time, consider a smaller size or look for in-store samples before committing.

## Affiliate Disclosure

SulitScan may earn a commission when you click a Sephora PH affiliate link and complete a purchase. This does not affect your price.
    `.trim(),
    category: "Platform Guides",
    author: "SulitScan Team",
    publishedAt: "2026-06-03",
    readTime: 7,
    tags: ["sephora", "beauty", "skincare", "philippines", "buyer-guide"],
    coverGradient: "from-pink-400 to-rose-600",
  },
  {
    id: "post-004",
    slug: "how-to-spot-fake-discounts",
    title: "How to Spot Fake Discounts Online Before You Get Tricked",
    excerpt:
      "Not every sale is a real bargain. Here are the signs that a discount is genuine — and the red flags that it's not.",
    content: `
One of the most common tricks in online shopping is the inflated original price. A product is listed at ₱2,000 with a "50% off" tag showing ₱1,000 — but the product was never actually sold at ₱2,000. You're not saving anything.

Here's how to protect yourself.

## Red Flags: Signs a Discount May Be Fake

**1. The Original Price Is Unusually High**
If the "original price" is significantly higher than any similar product you can find elsewhere, the original price may have been inflated specifically to create the appearance of a discount.

**2. The Sale Never Ends**
Some platforms show countdown timers that reset every day. If a "flash sale" timer always shows a few hours remaining, it's not actually a flash sale.

**3. The "Was" Price Has No History**
If you can't find any evidence that the product was ever sold at the original price — no old screenshots, no review dates matching that price — it may be fictitious.

**4. Discount Size Doesn't Match Reality**
A 90% discount on branded skincare or electronics is almost never real. If the deal seems too good to be true, it usually is.

## How to Verify a Discount

**Check Similar Products**
Search for the same or similar product across multiple stores. The true market price becomes clearer quickly.

**Read Dated Reviews**
Buyer reviews include the purchase date. If reviewers from six months ago mention the same price as today's "sale price," the item was never actually discounted.

**Look for Product Specifications**
Generic products (phone cases, cables, decor) often have legitimate very low prices because margins are thin. But branded items at 80%+ off warrant skepticism.

**Use SulitScan's Notes**
Every deal on SulitScan includes a SulitScore and buyer notes. If something looks off about the discount, we try to flag it.

## What SulitScan Does

We manually review price claims before listing a deal. If a discount looks inflated, we either skip the product or note the concern in the buyer notes section.

That said: we are not a live price tracker. Always confirm the current price and discount on the partner store before purchasing.

## Your Pre-Purchase Checklist

- Does the original price make sense compared to similar products?
- Is there a dated review history consistent with the price claims?
- Is the sale window actually limited, or does it reset?
- Can you find the same product at a similar or lower price elsewhere?

## Affiliate Disclosure

SulitScan may earn a commission when you click partner links and complete a purchase. This does not affect your price.
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2026-06-04",
    readTime: 5,
    tags: ["fake-discounts", "shopping-tips", "buyer-protection", "smart-shopping"],
    coverGradient: "from-amber-400 to-orange-500",
  },
  {
    id: "post-005",
    slug: "voucher-shipping-return-checklist",
    title: "Voucher, Shipping, and Return Checklist for Every Online Order",
    excerpt:
      "Before you click confirm at checkout, run through this quick list. It takes 2 minutes and can save you money and frustration.",
    content: `
Most online shopping regrets come from one of three things: missing a voucher, getting surprised by shipping time, or not knowing the return policy before buying. Here's a checklist to run through before every order.

## Voucher Check

**Temu:**
- Check the Promotions tab for active coupon codes
- First-time buyers often get a new-user discount — claim it before checkout
- Look for bundled discounts (buy 2 or more items from the same seller)

**Sephora PH:**
- Log in to your Beauty Rewards account — points may be redeemable for a discount
- Check if there's an active promo on the brand you're buying from
- If your cart total is close to ₱1,500, consider adding a small item for free shipping

**General:**
- Is there a credit card or e-wallet promo that applies? (GCash, PayMaya, bank promos)
- Has the discount already been applied to the listed price, or do you need to enter a code?

## Shipping Check

- What is the estimated delivery date? (Not just "7–20 days" — look for the actual date)
- Is free shipping included, or is it conditional on a minimum order?
- Are you in a delivery area that may take longer? (Provinces, remote barangays)
- Will the item arrive in time if you need it by a specific date?

## Return Policy Check

**Before buying:**
- Can this item be returned if it doesn't fit or isn't as described?
- Is it returnable once opened? (Cosmetics and beauty items often cannot be returned if opened)
- What is the return window? (Some platforms give 7 days, others 30 or 90)
- Do you need to ship it back yourself, and is return shipping free?

**After receiving:**
- Take photos of the item and packaging immediately upon delivery
- Check against the product description while you still have the option to file a return
- Don't discard the packaging until you're satisfied

## The Final Question

Before you click Confirm Order:

*"If this item arrives slightly different from what I expect — different color, slightly different size, slightly different quality — will I be satisfied with the purchase?"*

If yes: proceed. If no: reconsider or research more before buying.

## Affiliate Disclosure

SulitScan may earn a commission when you click partner links and complete a purchase. This does not affect your price.
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2026-06-05",
    readTime: 4,
    tags: ["checklist", "vouchers", "shipping", "returns", "tips"],
    coverGradient: "from-teal-400 to-cyan-600",
  },
  {
    id: "post-006",
    slug: "why-final-prices-change-at-checkout",
    title: "Why the Final Price at Checkout Is Different from What You Saw",
    excerpt:
      "You saw ₱299 on the deal page. At checkout it shows ₱420. Here's why this happens and how to avoid checkout surprises.",
    content: `
The price you see on a deal listing — whether on SulitScan or the partner store's product page — is rarely the final price you pay. Here's why checkout prices differ and what to watch for.

## Common Reasons for Checkout Price Differences

**1. Shipping Fees Added**
The product price may not include shipping. On Temu, many items include free shipping — but some do not, especially for very small or lightweight items sold individually.

**2. Voucher Not Applied**
If you saw the price after a voucher was applied in a screenshot or deal post, but you didn't apply the voucher yourself at checkout, you'll pay more.

**3. Price Changed Since the Deal Was Listed**
SulitScan sources prices from affiliate datafeeds, which may not reflect real-time price changes. Prices on Temu and Sephora PH can change daily or even hourly during sale events.

**4. Variant Pricing**
The price shown may be for a specific color, size, or quantity that's different from the one you selected. Always confirm the price updates after selecting your specific variant.

**5. Currency or Tax Display**
Some platforms show prices exclusive of taxes. At checkout, VAT or other fees may be added.

**6. Exchange Rate Fluctuation**
If you're paying through a credit card in a currency other than Philippine Peso, exchange rates affect your final billed amount.

## What SulitScan Does

We source prices from affiliate datafeeds at the time we add or update a deal. We add a "price verified" date to every deal card. But we cannot guarantee the price is still the same when you click through.

This is why every deal card on SulitScan includes:
- A timestamp showing when the price was last checked
- A reminder to confirm the final price on the partner store
- A note that prices may change

## Before You Pay — Final Check

1. Does the checkout price match what you expected?
2. Has shipping been added? Is it still within your budget?
3. Did you apply any available vouchers?
4. Is the variant (size, color, quantity) correct?
5. Is the delivery estimate acceptable?

If any of these don't look right — go back. There's no urgency. Good deals come back.

## Affiliate Disclosure

SulitScan may earn a commission when you click partner links and complete a purchase. This does not affect your price. See our full [Affiliate Disclosure](/affiliate-disclosure).
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2026-06-06",
    readTime: 5,
    tags: ["checkout", "pricing", "tips", "buyer-protection", "transparency"],
    coverGradient: "from-violet-400 to-purple-600",
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getRecentPosts(count = 6): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, count)
}
