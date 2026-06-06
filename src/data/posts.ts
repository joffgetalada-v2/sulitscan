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
    slug: "how-to-check-price-history-shopee-lazada",
    title: "Is It Really on Sale? How to Check Shopee and Lazada Price History",
    excerpt:
      "Flash sales can be misleading. Here's how to verify if a deal is genuine or if the original price was inflated before the promo.",
    content: `
Many Filipino shoppers have experienced "sale" prices that aren't actually lower than the usual price. Platforms sometimes raise the original price before a sale, making the discount look bigger than it is.

## How to Check Price History

**Step 1: Use a Price Tracker Extension**
Tools like Keepa (for international) or community-maintained spreadsheets can help track how a product's listed price has changed over time.

**Step 2: Screenshot Before Big Sale Days**
Before 11.11, 12.12, or Payday Sales, screenshot prices of items you're watching. Compare after the sale starts.

**Step 3: Check Product Reviews for Price Context**
Reviewers sometimes mention what they paid. If many reviews mention a much lower price than the current "original," something's off.

**Step 4: Search the Same Product Across Stores**
Compare the same product across Shopee, Lazada, and AliExpress. The true market price becomes clearer.

**Step 5: Wait 24–48 Hours**
Many "flash deals" are not actually limited. The timer resets. Don't rush.

## Red Flags to Watch For
- Original price much higher than any similar product on the market
- Seller account created recently with high ratings but low review count
- Product images reused from other stores

SulitScan manually checks for these signals before adding a deal to our list.
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2025-05-15",
    readTime: 5,
    tags: ["price-history", "shopee", "lazada", "tips", "smart-shopping"],
    coverGradient: "from-green-400 to-emerald-600",
  },
  {
    id: "post-002",
    slug: "shopee-vouchers-you-are-not-using",
    title: "Top 10 Shopee Vouchers You're Probably Not Using",
    excerpt:
      "Free shipping vouchers, platform coins, and seller vouchers can stack. Most shoppers miss at least three of these.",
    content: `
Shopee has multiple voucher layers that most casual shoppers don't fully use. Here's a breakdown.

## Types of Shopee Vouchers

**1. Platform-Wide Free Shipping Vouchers**
Available in My Vouchers. Apply to orders above a minimum spend. Often the most valuable.

**2. Seller-Specific Vouchers**
Visit a store's page and follow them. Many shops give vouchers to new followers.

**3. Shopee Coins Cashback**
You earn Shopee Coins on every purchase. They're worth ₱0.20 per coin and can be used on your next order.

**4. ShopeePay Cashback**
Paying via ShopeePay (not linked bank card, but balance) sometimes gives an extra 5–10% cashback.

**5. Flash Vouchers (Claim Time)**
Shopee releases new vouchers daily at 12:00 PM. These disappear in minutes.

**6. Shopee Live Vouchers**
Watching Shopee Live streams gives claim vouchers for that session.

**7. Games (Shopee Farm, etc.)**
Shopee's in-app games give coins that add up. Worth 5–10 minutes a day.

**8. Credit Card Partner Vouchers**
Banks like BDO, BPI, and Metrobank often have exclusive Shopee promo codes.

**9. Birthday Month Voucher**
Update your birthday in your profile. Shopee often gives a voucher in your birth month.

**10. Returning Cart Vouchers**
Add items to cart, then come back after 24 hours. Sometimes you'll see a discount pop-up.

## How to Stack Them
You can use one platform voucher + one seller voucher + Shopee Coins on a single order. That's three savings layers at once.
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2025-05-22",
    readTime: 6,
    tags: ["shopee", "vouchers", "tips", "savings", "hacks"],
    coverGradient: "from-orange-400 to-red-500",
  },
  {
    id: "post-003",
    slug: "aliexpress-vs-temu-which-is-safer",
    title: "AliExpress vs Temu: Which is Safer for Filipino Shoppers?",
    excerpt:
      "Both offer rock-bottom prices. But which one is more reliable for delivery, quality, and buyer protection in the Philippines?",
    content: `
Both AliExpress and Temu have become popular among budget-conscious Filipino shoppers. Here's a head-to-head comparison.

## AliExpress

**Pros:**
- Established platform since 2010
- Buyer Protection program (refund if item not received)
- Wide variety of verified seller ratings
- Faster shipping via Cainiao or AliExpress Standard Shipping

**Cons:**
- Shipping to Philippines can still take 10–25 days
- Quality varies wildly between sellers
- Communication with sellers can be slow

**Best For:** Electronics accessories, phone cases, tools, and hobby supplies.

## Temu

**Pros:**
- Often even lower prices than AliExpress
- Cleaner app experience
- Refund policy is relatively smooth

**Cons:**
- Newer platform (launched 2022) — less track record
- Some users report impulse-buying due to aggressive promotions
- Quality inconsistency is more common
- Shipping takes 7–20 days

**Best For:** Non-critical items like decor, clothing basics, and novelty items.

## Our Recommendation
For anything above ₱500, stick to AliExpress or local platforms (Shopee/Lazada). Temu is fine for low-stakes purchases where quality uncertainty is acceptable.

Always check the seller's review count and percentage, and use buyer protection if available.
    `.trim(),
    category: "Platform Guides",
    author: "SulitScan Team",
    publishedAt: "2025-06-01",
    readTime: 7,
    tags: ["aliexpress", "temu", "platform-guide", "safety", "comparison"],
    coverGradient: "from-blue-400 to-indigo-600",
  },
  {
    id: "post-004",
    slug: "stack-vouchers-lazada-shopee",
    title: "How to Stack Vouchers on Lazada and Shopee for Maximum Savings",
    excerpt:
      "Stacking vouchers is legal, works every day, and most shoppers never try it. Here's exactly how.",
    content: `
Voucher stacking means applying multiple discount types to a single order at checkout. Lazada and Shopee both allow it.

## On Shopee

**Layer 1 – Platform Voucher:** Select from "Shopee Vouchers" at checkout.
**Layer 2 – Seller Voucher:** Select from "Shop Vouchers" at checkout.
**Layer 3 – Shopee Coins:** Toggle "Use Shopee Coins" to apply up to 15% of order value.
**Layer 4 – ShopeePay Cashback:** Set ShopeePay as payment method.

That's four discounts on one order.

## On Lazada

**Layer 1 – Platform Voucher:** Apply under "Voucher" at checkout.
**Layer 2 – Seller Voucher:** Collected from seller's store page.
**Layer 3 – LazCoins:** Toggle at checkout.
**Layer 4 – Bank Promo:** Enter promo code from partner bank.

## Tips for Maximum Stack

1. **Buy during a sale event.** Vouchers are more generous on 11.11, 12.12, and Payday Sales.
2. **Hit the minimum spend.** Many vouchers activate only above ₱500 or ₱1,000.
3. **Combine items per seller.** Buying multiple items from one seller triggers seller vouchers more easily.
4. **Claim vouchers in advance.** Vouchers expire. Collect them early and use before they lapse.

## Real Example

Order: ₱1,200 airfryer on Shopee
- Platform Voucher: -₱100
- Seller Voucher: -₱50
- Shopee Coins: -₱60
- ShopeePay 5% Cashback: -₱50

**You pay: ₱940 instead of ₱1,200. 22% off.**
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2025-06-03",
    readTime: 6,
    tags: ["vouchers", "stacking", "shopee", "lazada", "savings-tips"],
    coverGradient: "from-purple-400 to-violet-600",
  },
  {
    id: "post-005",
    slug: "best-budget-tech-deals-under-500",
    title: "Best Budget Tech Deals Under ₱500 This Month",
    excerpt:
      "Screen cleaners, USB hubs, cable organizers, LED strips, and more — all under five hundred pesos.",
    content: `
You don't need a big budget to upgrade your tech setup. Here are this month's top picks under ₱500.

## Top Picks

**1. Phone Stand with 360° Rotation – ₱149**
Essential for video calls and content watching. Adjustable height, compatible with all phones.

**2. USB-C to USB-A Cable (1.2m, fast-charging) – ₱89**
Look for cables rated at 60W or above. Check for braided coating for durability.

**3. Silicone Cable Organizer Set (10 pcs) – ₱79**
Keeps charging cables, earphones, and USB cables neat. Works on desks and bags.

**4. LED Strip Light (5m, RGB, remote-controlled) – ₱299**
Gaming setup or bedroom mood lighting. Adhesive backing. Check if remote is included.

**5. Laptop Stand (Adjustable Aluminum) – ₱389**
Great ergonomic upgrade for working from home. Foldable and portable.

**6. Wireless Mouse (2.4GHz, 1200 DPI) – ₱299**
Basic but reliable. Good for students and office use. Battery-powered.

**7. Screen Cleaning Kit (Spray + Microfiber) – ₱149**
Smudge-free screens on phones, laptops, glasses. Non-alcohol formula.

**8. Selfie Ring Light (10-inch, 3 color modes) – ₱499**
Good lighting for online classes, streaming, or content creation.

## How We Chose These
Each pick was checked against current marketplace prices. We avoided items with less than 4.5 stars or fewer than 50 reviews.
    `.trim(),
    category: "Budget Finds",
    author: "SulitScan Team",
    publishedAt: "2025-06-05",
    readTime: 4,
    tags: ["tech", "budget", "under-500", "gadgets", "home-office"],
    coverGradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "post-006",
    slug: "sulitscan-score-explained",
    title: "SulitScan Score Explained: How We Rate Deals",
    excerpt:
      "Our score isn't just about discount size. Here's exactly what goes into a SulitScan Score and why an 8 is better than a 5.",
    content: `
We created the SulitScan Score to give shoppers a simple signal about deal quality. Here's what goes into it.

## What the Score Is

A number from 1 to 10. Higher is better.

**Score 9–10:** Excellent deal. Strong discount from a trusted seller. Price is verified lower than usual. Limited time or stock.

**Score 7–8:** Good deal. Discount is real and meaningful. Some caveats apply (shipping time, sizing note, etc.).

**Score 5–6:** Decent deal. Not great, not bad. Buy only if you need it now or can't wait for a better price.

**Score 3–4:** Marginal. Discount is small or seller trust is unclear. Check elsewhere first.

**Score 1–2:** We wouldn't feature this. Listed for informational purposes only.

## What We Check

**1. Discount Authenticity**
Is the original price realistic? We cross-reference similar products to verify.

**2. Seller Trust**
Seller rating, review count, fulfillment speed, official brand or mall store status.

**3. Product Reviews**
Do buyers report quality consistent with the price? We look for red flags.

**4. Voucher Stackability**
Can platform vouchers be applied? This affects the effective final price.

**5. Shipping Speed + Cost**
Slow free shipping vs fast paid shipping affects value, especially for travel or time-sensitive items.

**6. Price History Trend**
Has this product been at this price before? Is this a genuine low?

## What We Don't Check
We don't physically test products. SulitScan is a deals aggregation and guide site — we curate based on publicly available signals. Always read reviews before buying.

We are transparent about this: every deal card shows exactly why we picked it.
    `.trim(),
    category: "About SulitScan",
    author: "SulitScan Team",
    publishedAt: "2025-06-06",
    readTime: 5,
    tags: ["sulitscan", "score", "how-it-works", "transparency"],
    coverGradient: "from-green-400 to-teal-500",
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getRecentPosts(count = 6): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, count)
}
