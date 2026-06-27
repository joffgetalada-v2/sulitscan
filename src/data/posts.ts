export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  publishedAt: string
  lastReviewed: string
  readTime: number
  tags: string[]
  coverGradient: string
  coverImage?: string
  coverImageAlt?: string
  /** Optional visible FAQs — when present, also emitted as FAQPage JSON-LD. */
  faqs?: { question: string; answer: string }[]
}

// Used for any post without its own coverImage (and for new posts by default).
export const DEFAULT_BLOG_COVER = "/images/blog-default.jpg"
export const DEFAULT_BLOG_COVER_ALT = "SulitScan PH Blog: smart shopping guides for Filipino shoppers"

export const posts: BlogPost[] = [
  {
    id: "post-001",
    slug: "how-sulitscan-checks-deals",
    title: "How SulitScan Checks Deals Before You Click Buy",
    excerpt:
      "Before any deal appears on SulitScan, we run it through a manual checklist. Here's exactly what we look at — and what we don't.",
    content: `
SulitScan is not a live price aggregator. We manually curate selected deals from Temu and Sephora PH through affiliate partner programs. Before any deal goes live on the site, we go through a structured review process. Here's exactly what that looks like.

## What's in This Guide

- How we find deals
- What we check before listing
- How we score deals with SulitScore
- What we do NOT do
- Our honest disclaimer
- Your pre-purchase checklist

## How We Find Deals

We monitor Temu and Sephora PH through affiliate programs — specifically Temu's direct affiliate partner program and Involve Asia (for Sephora PH). Affiliate partners share product data, pricing, and deal information.

We browse these feeds manually and select products that appear to offer genuine value to Filipino shoppers. We do not use bots, scrapers, or automated tools to bulk-import deal data.

## What We Check Before Listing

### 1. Is the price actually lower than usual?

We compare the listed sale price against publicly visible prices for similar products. If a product's "original price" looks inflated to make the discount seem bigger than it is, we note that in the buyer notes — or skip the product entirely.

Not every discount is genuine. A product listed at ₱999 "down from ₱3,500" is worth checking against similar products before assuming the ₱3,500 was ever a real price.

### 2. Is this an appropriate product for the platform?

For **Temu**, we focus on categories where the value is clear and the risk of disappointment is low: home organizers, kitchen tools, phone accessories, fashion basics, and decor. We are more cautious with electronics and branded products.

For **Sephora PH**, products are listed from an authorized retailer. We still check that the product matches the category, that the price is consistent with Sephora PH's listed price, and that the deal makes sense for Filipino shoppers.

### 3. Can additional savings be applied?

We note if platform vouchers, first-order discounts, or loyalty points can stack on top of the listed sale price. For Sephora PH, Beauty Rewards points are often applicable. For Temu, new-user and platform vouchers are frequently available.

### 4. What should the buyer check before purchasing?

Every deal card on SulitScan includes buyer notes: sizing reminders, shipping speed, quality expectations, and return policy context. These are not generic disclaimers — we write them based on the specific product type.

For clothing: we note sizing concerns (Temu often runs small). For skincare: we note patch test reminders and checking ingredient lists. For electronics: we flag compatibility and warranty questions.

### 5. What is the SulitScore?

The SulitScore is a 1–10 rating we assign to each deal based on:

- **Discount authenticity** — does the stated discount reflect a genuine price reduction?
- **Store trust** — how reliable is the seller or platform for this product type?
- **Review quality** — do buyer reviews on the partner store support the product claims?
- **Voucher potential** — can extra savings be applied?
- **Shipping and delivery context** — is the shipping time and cost reasonable?

A score of 9–10 means we consider the deal genuinely strong. A score of 6–7 means it may be worth checking but has caveats worth reading.

## What We Do Not Do

- We do not physically test products
- We do not verify live inventory or stock
- We do not guarantee the price at checkout — prices change frequently
- We do not process payments or take orders
- We do not make medical or clinical claims about beauty products
- We do not fabricate reviews or testimonials

## The Honest Disclaimer

Prices listed on SulitScan are sourced from affiliate datafeeds at the time we add or update a deal. They may not match the current price on the partner store. Platform vouchers and first-order discounts are not always reflected in the listed price.

Always confirm the final price, available vouchers, and seller terms on Sephora PH or Temu before you buy. If the price has changed since we listed it, use the "Report outdated price" link on the deal page — we appreciate the heads up.

## Before You Click Buy — Your Checklist

1. Is the price on the partner store the same as what SulitScan shows?
2. Are there platform or seller vouchers you can apply?
3. Have you checked the size guide or product dimensions?
4. Have you read buyer reviews on the partner store?
5. Do you understand the return policy for this product type?
6. For skincare or beauty: have you checked the ingredient list?
7. For Temu orders: is the delivery estimate acceptable for when you need it?

SulitScan is a starting point — not the final word. You decide when to buy.

## FAQ

**Q: Do affiliate commissions affect which deals you list?**
No. We only list deals we believe offer genuine value. Our affiliate relationships do not determine our editorial selections. See our [Affiliate Disclosure](/affiliate-disclosure) for full details.

**Q: How often are prices updated?**
We update deals when we notice price changes through our affiliate feeds. But we are a small, manual operation — prices can change faster than we update. Always confirm on the partner store.

**Q: Can I report a deal with a wrong price?**
Yes. Every deal detail page has a "Report outdated price" link. Clicking it opens your email client with the deal pre-filled. We review all reports.

**Q: Do you cover Shopee, Lazada, or AliExpress?**
Shopee PH is now an active store on SulitScan, alongside Temu and Sephora PH. Lazada and AliExpress are not active yet and may be added later once their offers and buyer-check information are prepared.

## Affiliate Disclosure

SulitScan may earn a commission when you click a partner link and complete a purchase. This does not affect your price. See our full [Affiliate Disclosure](/affiliate-disclosure) for details.
    `.trim(),
    category: "About SulitScan",
    author: "SulitScan Team",
    publishedAt: "2026-06-01",
    lastReviewed: "2026-06-08",
    readTime: 7,
    tags: ["how-it-works", "transparency", "sulitscan", "deal-checking"],
    coverGradient: "from-green-400 to-emerald-600",
    coverImage: "/images/guides/how-sulitscan-checks-deals.jpg",
    coverImageAlt: "How SulitScan checks deals — phone showing a checked deal with price comparison, seller rating, and a deal checklist",
  },
  {
    id: "post-002",
    slug: "temu-shopping-guide-philippines",
    title: "Temu Shopping Guide for Filipino Buyers: What to Know Before You Order",
    excerpt:
      "Temu offers surprisingly low prices, but there are a few things Filipino shoppers should know before placing an order.",
    content: `
Temu has become popular in the Philippines for its very low prices on home decor, fashion, gadgets, and everyday basics. But low prices come with questions: What's the quality like? How long does shipping take? What happens if something goes wrong?

This guide covers everything a Filipino buyer needs to know before placing a Temu order.

## What's in This Guide

- What Temu is good for
- Pricing reality check
- Sizing guide for Filipino shoppers
- Shipping to the Philippines
- Returns and refunds
- Safety and quality tips
- Voucher tips
- Your pre-order checklist
- FAQ

## What Temu Is Good For

Temu works best for everyday, low-stakes purchases where quality doesn't need to be perfect:

- Home organizers, storage containers, and kitchen tools
- Phone accessories (cases, holders, charging cables)
- Basic clothing: socks, sleepwear, basics, accessories
- Hobby and craft supplies
- Affordable decor items and small furniture pieces
- Fitness and outdoor accessories

**What to approach with caution on Temu:** High-value electronics, items requiring precise sizing (shoes especially), branded goods, children's safety products, anything requiring warranties, and food or health products.

Temu is best for items where if it's slightly off from what you expected, you'd still feel the purchase was reasonable.

## Pricing Reality Check

Temu's prices are genuinely low compared to local retail for many categories. But there are a few things to keep in mind:

The "original price" shown may be inflated. A product listed at ₱899 "down from ₱2,500" is worth checking. Search for the same or similar product on other platforms to get a sense of the real market price.

Vouchers and first-order discounts are common. Check the Promotions tab before checkout. New Temu users typically receive significant first-order discounts that can reduce the total by 20–40%.

Shipping is often free. Most Temu orders to the Philippines include free standard shipping, but some lightweight or very low-priced items may have a small shipping fee. Check before confirming.

## Sizing for Filipino Shoppers

This is important. Temu clothing sizes frequently run smaller than labeled — by one to two sizes. Filipino shoppers have consistently reported this in reviews.

Before buying clothing:

- Read the measurements in centimeters in the product description, not just the size label (S/M/L)
- Compare against your own measurements
- Check buyer photos and reviews — look for reviewers who mention size fit
- When in doubt, size up

For footwear, the same applies. A labeled size 38 may fit closer to a local size 36–37. Always check the size chart in centimeters and buyer reviews before ordering shoes.

## Shipping to the Philippines

Standard shipping from Temu to the Philippines typically takes **7–20 business days** from the order date. This is international shipping — not local. If you need something by a specific date, plan accordingly.

Express shipping is sometimes available and can shorten delivery to 5–10 business days, but it usually costs extra.

Temu provides tracking through their app and website. You'll receive notifications as your order moves through international logistics. The last-mile delivery in the Philippines is handled by local courier partners.

If you're in a remote province or barangay, add extra days to the estimate.

## Returns and Refunds

Temu's return and refund process is generally straightforward for:
- Items that are significantly not as described
- Defective or broken products upon arrival
- Items not received within the expected window

**What to do when your order arrives:**

1. Take photos of the package before opening
2. Take photos of the item after opening
3. Check against the product description and your order details
4. File any return within Temu's return window (typically 90 days from purchase)

If you need to return an item, do it through the Temu app. Keep packaging until you're satisfied with the order.

For minor differences (slightly different color shade, texture slightly different from photos), Temu may offer a partial refund rather than a full return — check their policy for the specific product category.

## Safety and Quality Tips

For home products and kitchen items, check that the product is labeled as food-safe if it will contact food. Stainless steel products should note the grade (e.g., 304 or 410 grade stainless).

For electronics, check that the product supports Philippine voltage (220V) and uses a compatible plug type. Some Temu electronics are designed for US or European markets.

For children's products, exercise extra caution and check for any safety certifications listed in the product details.

## Voucher and Savings Tips

- Check the Promotions tab on Temu before adding items to cart
- First-time buyers usually get a new-user welcome discount — claim it before checkout
- Look for "Buy X get Y" deals or bundle discounts on multi-quantity items
- Temu periodically runs sale events (e.g., birthday sales, holiday sales) — timing a purchase for a sale event can increase savings
- Some GCash and credit card promos can stack with Temu's own discounts — check your bank or e-wallet for active promos

## Before You Order on Temu — Checklist

1. Read buyer reviews — not just the star rating, read the written reviews
2. Check the measurements, not just the size label, for clothing and footwear
3. Look for the estimated shipping date at checkout
4. Check if a first-order or platform voucher applies
5. Is the product something you'd be satisfied with even if quality is slightly variable?
6. Do you understand the return window and process?
7. For electronics: does it support Philippine voltage?

## FAQ

**Q: Is Temu safe to buy from?**
Temu is a legitimate global marketplace. Many Filipino shoppers have ordered from it successfully. As with any marketplace, quality varies by product and seller. Low-stakes everyday items are generally safe bets. High-value or safety-critical items warrant more caution.

**Q: Why are Temu prices so low?**
Most Temu products come directly from manufacturers in China, cutting out middlemen. Lower production costs and thin margins on volume result in low retail prices. Quality varies as a result.

**Q: Can I pay with GCash or local payment methods?**
Temu accepts major credit cards and some e-wallet options. Check the payment options at checkout for what's currently available in the Philippines.

**Q: What if my Temu order never arrives?**
If your order doesn't arrive within the estimated window, file a claim through the Temu app. Temu has a purchase protection policy for non-delivery. Keep all tracking information.

**Q: Does SulitScan ship from Temu?**
No. SulitScan is a deal discovery site. We link you to Temu and you complete the order directly there. We never handle payments or shipping.

## Related on SulitScan

Browse [Temu deals](/deals) on SulitScan, or explore by category: [Home Finds](/categories/home-finds), [Tech Deals](/categories/tech-deals), [Fashion](/categories/fashion), [Under ₱500](/categories/under-500).

## Affiliate Disclosure

SulitScan may earn a commission when you click a Temu affiliate link and complete a purchase. This does not affect your price.
    `.trim(),
    category: "Platform Guides",
    author: "SulitScan Team",
    publishedAt: "2026-06-02",
    lastReviewed: "2026-06-08",
    readTime: 9,
    tags: ["temu", "shopping-guide", "philippines", "tips", "buyer-guide"],
    coverGradient: "from-orange-400 to-red-500",
    coverImage: "/images/guides/temu-shopping-guide-philippines.jpg",
    coverImageAlt: "Temu shopping guide for Filipino buyers — Temu app showing affordable finds, free shipping, and discounts",
  },
  {
    id: "post-003",
    slug: "sephora-ph-beauty-guide",
    title: "Sephora PH Beauty Deals: What to Check Before Buying",
    excerpt:
      "Sephora PH carries 300+ authentic beauty brands. Here's how to get the best value from their deals, loyalty points, and sale events.",
    content: `
Sephora Philippines is the partner store listed for these beauty deals. They carry premium brands including SK-II, Sunday Riley, Mario Badescu, ZOEVA, Natasha Denona, Urban Decay, and the Sephora Collection line. This guide helps Filipino shoppers check Sephora PH's deals, loyalty program, and sale events before buying.

## What's in This Guide

- Why Sephora PH deals are worth checking
- Types of Sephora PH deals
- Beauty Rewards loyalty program
- Free shipping threshold
- Buying skincare safely
- Shade and variant tips
- Before you buy checklist
- FAQ

## Why Sephora PH Deals Are Worth Checking

Sephora PH is the partner store listed for these beauty deals. Always confirm the current price on sephora.ph before purchasing — prices in our datafeed may not always reflect active promotions or recent price changes.

SulitScan tracks selected Sephora PH deals through the Involve Asia affiliate program. We list the price from the datafeed and add buyer notes — always **confirm current price and availability on sephora.ph** before purchasing.

## Types of Sephora PH Deals

### Sephora Collection Products

Sephora's own brand offers accessible pricing (roughly ₱500–₱1,500 range) across skincare, makeup, and tools. Popular categories include setting sprays, primers, eyeshadow palettes, lip products, and makeup brushes. The Sephora Collection is a reliable entry point for shoppers exploring premium beauty without committing to a full-price prestige brand.

### Brand Sales and Promos

Sephora PH regularly runs brand-specific promotions on premium lines. These are often time-limited. Check their website, app, or newsletter for current brand promos. During sale events (like Sephora's birthday sale or brand-specific promotions), discounts on prestige products can be meaningful.

### Gift Sets and Value Sets

Around holidays and sale events, Sephora bundles products into sets at better per-item value than buying individually. These are worth watching if you're interested in trying multiple products from a brand.

### Flash Sales and App Exclusives

Sephora PH occasionally runs app-exclusive promotions or time-limited flash discounts. Download the Sephora PH app to be notified of these when they go live.

## Beauty Rewards Loyalty Program

If you shop at Sephora PH regularly, the Beauty Rewards loyalty program is worth using:

- Earn points on every purchase — both in-store and online
- Points accumulate and can be redeemed for discounts on future purchases
- Higher tiers (Gold, VIB) unlock earlier sale access and exclusive offers
- Creating an account is free

If you're buying a Sephora PH deal found on SulitScan, log in to your Beauty Rewards account before checkout to earn points on your purchase.

## Free Shipping Threshold

Free standard shipping on Sephora PH applies to orders **₱1,500 and above**. If your cart total is close to but below ₱1,500, adding a small Sephora Collection item (a lip liner, a small face mask, or a travel-size product) can push you over the threshold and save on shipping.

Standard delivery in Metro Manila typically takes 3–5 business days. Provincial delivery may take 5–7 business days.

## Buying Skincare Safely

This section is important for anyone buying skincare or beauty products online.

**Check the ingredients:** If you have known allergies, sensitivities, or skin conditions, read the full ingredient list before purchasing. Sephora PH product pages list ingredients. For products not yet listed, check the brand's official website.

**Patch test new products:** For skincare especially (serums, retinols, acids, active treatments), always patch test before applying to your full face. Apply a small amount to your inner wrist or behind your ear for 24–48 hours before full use.

**Check expiry and batch codes:** When your order arrives, check the manufacturing date or expiry date on the product packaging. If a product appears expired or improperly sealed, contact Sephora PH customer service immediately.

**For new-to-you brands:** Consider starting with a smaller size or sample before committing to a full-size product. Sephora PH sometimes offers samples with purchases. Check the product page and your cart for sample options.

**Opened products are generally non-returnable:** This is the key return policy to understand before buying. If you purchase a skincare or makeup product and open it, it typically cannot be returned unless it's defective. Buy with confidence in the product before opening.

## Shade and Variant Tips

Makeup shades (foundation, concealer, lip products) can look different on screen than in person. Before purchasing:

- Check the product page for swatches in multiple skin tones
- Look for Filipino beauty bloggers or buyers who have reviewed the product — reviews from people with similar skin tones are most useful
- For foundation: many brands publish undertone guides. Warm undertones (yellow-leaning) are common among Filipino skin. Check whether a product's shade range includes warm-undertoned options
- For lip products: the shade on screen may appear lighter or darker than on your lips — check buyer photos in reviews

## Before You Buy at Sephora PH — Checklist

1. Is the price on sephora.ph the same as what SulitScan shows?
2. Is there an active platform promo, Beauty Rewards offer, or brand promotion you can use?
3. Is the product available in your preferred shade, size, or variant?
4. Have you read the ingredient list for allergens or sensitivities?
5. Are you familiar with the return policy — especially for opened products?
6. Is this a product suited to your skin type and concern?
7. If buying skincare for the first time: are you planning to patch test before full use?
8. Is the total order above ₱1,500 for free shipping?

## FAQ

**Q: Are all products on Sephora PH authentic?**
Sephora PH is the partner store listed for these deals. Always confirm product details, shade, size, and return terms on sephora.ph before buying. If you have concerns about a specific product upon receipt, contact Sephora PH customer service directly.

**Q: Does SulitScan list all Sephora PH products?**
No. We curate a selected set of deals — products that we think are worth flagging based on price, value, or category fit. For the full Sephora PH catalog, visit sephora.ph directly.

**Q: Can I combine Beauty Rewards points with a SulitScan affiliate link?**
Yes — you can still log in to your Beauty Rewards account and earn points when you click through from SulitScan. The affiliate link does not affect your account or rewards.

**Q: How often are Sephora PH deals updated on SulitScan?**
We update deals periodically. Prices in our datafeed may not always reflect real-time changes. Always confirm on sephora.ph before buying.

**Q: Does SulitScan cover Sephora stores outside the Philippines?**
No. SulitScan only covers Sephora PH (sephora.ph). We do not list deals from Sephora Singapore, Sephora US, or other regional sites.

## Related on SulitScan

Browse [Beauty deals](/categories/beauty) and [Under ₱500 deals](/categories/under-500) on SulitScan. Visit our [Sephora PH store page](/stores/sephora-ph) for buyer reminders and shipping details.

## Affiliate Disclosure

SulitScan may earn a commission when you click a Sephora PH affiliate link and complete a purchase. This does not affect your price.
    `.trim(),
    category: "Platform Guides",
    author: "SulitScan Team",
    publishedAt: "2026-06-03",
    lastReviewed: "2026-06-08",
    readTime: 10,
    tags: ["sephora", "beauty", "skincare", "philippines", "buyer-guide"],
    coverGradient: "from-pink-400 to-rose-600",
    coverImage: "/images/guides/sephora-ph-beauty-guide.jpg",
    coverImageAlt: "Sephora PH beauty deals — skincare, makeup, and fragrance with authenticity, price, expiry, and return check icons",
  },
  {
    id: "post-004",
    slug: "how-to-spot-fake-discounts",
    title: "How to Spot Fake Discounts Online Before You Get Tricked",
    excerpt:
      "Not every sale is a real bargain. Here are the signs that a discount is genuine — and the red flags that it's not.",
    content: `
One of the most common tricks in online shopping is the inflated original price. A product is listed at ₱2,000 with a "50% off" tag showing ₱1,000 — but the product was never actually sold at ₱2,000. You're not saving anything real. You're paying the regular price with a misleading label on it.

This guide helps Filipino shoppers identify genuine discounts and avoid the most common pricing tricks.

## What's in This Guide

- Why fake discounts are widespread
- Red flags: signs a discount may not be real
- How to verify a discount
- What to do when something looks off
- Your pre-purchase checklist
- FAQ

## Why Fake Discounts Are Widespread

Online marketplaces make it easy for sellers to set their own "original prices." There's often little enforcement of whether the original price was ever a real transaction price. A seller can list a product at ₱5,000 for one day, then "discount" it to ₱1,200 — showing a dramatic 76% off that never reflected an actual market price.

This isn't unique to any one platform. It's a known pattern across global e-commerce, including some deals on otherwise legitimate platforms.

## Red Flags: Signs a Discount May Not Be Real

### The original price is unrealistically high

If a simple plastic kitchen gadget has an "original price" of ₱3,500 and a sale price of ₱350, that's worth questioning. Research similar products to get a sense of what the actual market price range is.

### The sale never ends

Some platforms show countdown timers that reset every day. If a "flash sale" or "limited time offer" timer always shows a few hours remaining no matter when you check, it's a permanent feature disguised as urgency — not a real limited-time deal.

### The discount is extreme on branded products

A 90% discount on a premium branded skincare product or a well-known electronics brand is almost never legitimate. Legitimate discounts from authorized retailers are usually more modest (10–40%). Extreme discounts on branded goods often indicate a fake, grey-market, or significantly different product.

### No review history at the "original" price

If the product has buyer reviews dating back months, and all those reviews mention the same price as today's "sale price," the original price listed is fictitious.

### The product has no verifiable brand or seller history

Generic products with no brand identity, no seller history, and prices that seem impossible are worth skipping.

## How to Verify a Discount

### Search for the same or similar product

Copy the product title or a distinctive feature phrase and search for it on other platforms. If similar items are consistently priced at ₱350, the "original ₱2,500" is almost certainly inflated.

### Read dated buyer reviews

Buyer reviews include a purchase date. If reviews from six months ago mention the same price as today's "sale price," the item was never discounted from a higher price.

### Check the price history if available

Some browser extensions track price history on certain platforms. While not always available for all products, historical price data can confirm whether the "original price" was ever real.

### Look for the same product on the brand's website

For branded products, check the official brand website or an authorized local retailer for the product's regular price. This gives you a reference point.

### Use SulitScan's notes

Every deal on SulitScan includes a SulitScore and buyer notes. If something looks off about the discount — we try to flag it or skip the product entirely. If the buyer notes say "compare against similar products before buying," that's a cue to do exactly that.

## What to Do When Something Looks Off

If you suspect a discount is inflated:
- Don't feel pressured by countdown timers or "limited stock" warnings
- Search for the same product elsewhere
- Check reviews carefully
- Skip if you can't confirm the discount is genuine

There is no urgency on a deal that might not be real. Good deals come back.

## What SulitScan Does

We manually review price claims before listing a deal. If a discount looks inflated, we either skip the product or note the concern in the buyer notes. We compare listed prices against similar products and flag where the comparison doesn't hold up.

That said: we are not a live price tracker. Always confirm the current price and discount on the partner store before purchasing.

## Your Pre-Purchase Checklist

1. Does the original price make sense compared to similar products?
2. Is there a dated review history consistent with the price claims?
3. Is the sale window actually limited, or does the timer reset?
4. Can you find the same product at a similar or lower price elsewhere?
5. Are there reviews from verified buyers with photos?
6. Is the seller or brand identifiable and credible?

## FAQ

**Q: Is every high discount a scam?**
Not necessarily. Genuine clearance sales, overstock liquidations, and end-of-season discounts can produce significant price reductions. The key is whether the original price was real. Compare against market prices, not just the stated original.

**Q: What about flash sales from official brand stores?**
Official brand promotions from authorized retailers are generally more trustworthy than random marketplace sellers offering huge discounts. Still verify the price makes sense relative to the product's normal market value.

**Q: Does SulitScan guarantee that listed discounts are real?**
No. We review price claims manually and try to flag questionable discounts — but we cannot guarantee accuracy. Prices change after we list a deal, and we may miss some inflated originals. Always confirm on the partner store.

**Q: How do "buy more save more" deals work?**
These are often legitimate — the per-unit price drops when you buy a bundle. Just check that the single-unit price is a reasonable market price first. If the single-unit price is also inflated, the bundle discount is built on a false base.

## Affiliate Disclosure

SulitScan may earn a commission when you click partner links and complete a purchase. This does not affect your price.
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2026-06-04",
    lastReviewed: "2026-06-08",
    readTime: 8,
    tags: ["fake-discounts", "shopping-tips", "buyer-protection", "smart-shopping"],
    coverGradient: "from-amber-400 to-orange-500",
    coverImage: "/images/guides/fake-discount-check-guide.jpg",
    coverImageAlt: "Illustration of a magnifying glass checking discount tags and fake sale pricing",
  },
  {
    id: "post-005",
    slug: "voucher-shipping-return-checklist",
    title: "Voucher, Shipping, and Return Checklist for Every Online Order",
    excerpt:
      "Before you click confirm at checkout, run through this quick list. It takes 2 minutes and can save you money and frustration.",
    content: `
Most online shopping regrets come from one of three things: missing a voucher that would have saved money, getting surprised by a shipping time longer than expected, or finding out after opening that the item can't be returned. A two-minute checklist before checkout can prevent all three.

This guide covers what to check for vouchers, shipping, and returns before confirming any online order — specifically for Temu and Sephora PH.

## What's in This Guide

- Voucher check (Temu and Sephora PH)
- Shipping check
- Return policy check
- What to do after your order arrives
- The final question before you buy
- FAQ

## Voucher Check

### Temu Vouchers

Before confirming a Temu order:

- Check the **Promotions** tab on Temu for active coupon codes
- First-time buyers usually get a new-user welcome discount — this appears when you first browse or at checkout
- Look for bundled discounts: some Temu products offer a better per-unit price when you buy 2 or more
- Check if a platform-wide coupon applies and add it before confirming

Temu periodically runs sale events (flash sales, holiday sales). If your order is not urgent, waiting for a sale event can add savings on top of already-low prices.

### Sephora PH Vouchers and Loyalty Points

Before confirming a Sephora PH order:

- Log in to your **Beauty Rewards account** — points may be redeemable for a discount
- Check if there's an active brand promotion on the product you're buying (brand-specific promos appear on the product page or in the Promos section)
- If your cart total is close to ₱1,500, consider adding a small item to reach the free shipping threshold
- Check if a brand has an anniversary or birthday sale running — these are often announced in Sephora PH's newsletter and app

### General Voucher Tips

- Is there an active credit card, GCash, or e-wallet promo that applies to your purchase? Check your bank or e-wallet app for current promos
- Has the discount already been applied to the listed price, or do you need to enter a code at checkout?
- Some vouchers have minimum order requirements — confirm your cart meets it

## Shipping Check

Before confirming any order, check the following:

- **Estimated delivery date**: Not just "7–20 days" — look for the specific estimated date shown at checkout. This is more useful than a range.
- **Free shipping**: Is it included, or is there a condition (minimum spend, specific items)?
- **Your delivery area**: Are you in a location that may have extended delivery times? Provincial addresses and remote barangays can add 3–5 extra days.
- **Urgency**: Do you need this item by a specific date? If yes, is the shipping estimate compatible?

For **Temu**: Standard international shipping to the Philippines typically takes 7–20 business days. Express options are sometimes available but may cost extra.

For **Sephora PH**: Standard shipping takes 3–7 business days for Metro Manila and key cities. Provincial delivery may take 5–10 business days. Free shipping applies to orders ₱1,500 and above.

## Return Policy Check

### Before buying

- Can this item be returned if it doesn't fit, doesn't match the description, or isn't what you expected?
- **Cosmetics and beauty items**: These often cannot be returned once opened. This is standard practice — not unique to Sephora PH. If you're unsure about a product, consider starting with a smaller size.
- What is the return window? (Temu: typically 90 days from purchase for defective items. Sephora PH: 30 days from purchase for unopened items in original packaging.)
- Do you need to ship the item back yourself? Is return shipping free or at your cost?

### After receiving your order

Always take photos of your order when it arrives — both the package before opening and the item after opening. This is your evidence if you need to file a return.

- Check the item against the product description and your order details
- Check that sizing, color, and variant are what you ordered
- For beauty products: check the seal, expiry date, and packaging condition
- Don't discard packaging until you're satisfied

File a return claim as early as possible if something is wrong. Don't wait until you're near the deadline.

## The Final Question Before You Buy

Before you click Confirm Order, ask yourself:

> "If this item arrives slightly different from what I expect — slightly different color, slightly different size, slightly different quality — will I be satisfied with this purchase?"

If yes: proceed. If no: research more or reconsider.

This is especially useful for Temu purchases, where product photos and reality sometimes differ slightly. Setting realistic expectations before buying is more effective than hoping for a perfect match.

## FAQ

**Q: What if a voucher I expected didn't apply?**
Check if there's a minimum spend requirement you didn't meet, or if the voucher is for specific product categories. Contact platform support if a valid voucher isn't applying — save screenshots as evidence.

**Q: Can I combine a voucher with Beauty Rewards points at Sephora PH?**
Sephora PH's checkout allows points redemption and promo codes. Check the checkout page for all available options before confirming.

**Q: What if my Temu item arrives damaged?**
Take photos immediately (before and after opening). File a return request through the Temu app as soon as possible. Temu's purchase protection covers items that arrive damaged or significantly not as described.

**Q: What if Sephora PH sends the wrong item?**
Contact Sephora PH customer service with your order number and photos of what you received. Wrong items can typically be returned and replaced regardless of whether the product was opened.

**Q: Is it worth buying product insurance for high-value items?**
Some platforms offer optional purchase protection add-ons. For high-value items, this can be worth considering — read the coverage terms before paying for it.

## Related on SulitScan

Browse [deals under ₱1,000](/categories/under-1000) or check our [Temu store guide](/stores/temu) and [Sephora PH store guide](/stores/sephora-ph) for more platform-specific buying tips.

## Affiliate Disclosure

SulitScan may earn a commission when you click partner links and complete a purchase. This does not affect your price.
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2026-06-05",
    lastReviewed: "2026-06-08",
    readTime: 8,
    tags: ["checklist", "vouchers", "shipping", "returns", "tips"],
    coverGradient: "from-teal-400 to-cyan-600",
    coverImage: "/images/guides/voucher-shipping-return-checklist.jpg",
    coverImageAlt: "Illustration of an online shopping checklist with delivery, voucher, and return icons",
  },
  {
    id: "post-006",
    slug: "why-final-prices-change-at-checkout",
    title: "Why the Final Price at Checkout Is Different from What You Saw",
    excerpt:
      "You saw ₱299 on the deal page. At checkout it shows ₱420. Here's why this happens and how to avoid checkout surprises.",
    content: `
You found a deal. The product page shows ₱299. You add it to cart, go to checkout — and it shows ₱420. What happened?

Price differences between deal listings and checkout are common across all online shopping platforms, including Temu and Sephora PH. This guide explains the most common reasons, and what you can do to avoid unpleasant surprises.

## What's in This Guide

- Why checkout prices differ from listing prices
- The specific cases for Temu and Sephora PH
- What SulitScan does about price accuracy
- How to check the final price before committing
- Your final pre-purchase checklist
- FAQ

## Common Reasons for Checkout Price Differences

### 1. Shipping fees added

The product price may not include shipping. For Temu, most orders include free shipping — but some items (particularly lightweight or very-low-price single items) may have a shipping fee. The shipping cost is added at checkout, not shown on the product listing.

For Sephora PH, free shipping applies to orders ₱1,500 and above. Below that threshold, a shipping fee is added at checkout.

### 2. Voucher not applied

If you saw a deal price after a voucher was applied in a screenshot, post, or deal listing — but you didn't apply the same voucher yourself at checkout — you'll pay the pre-voucher price.

Always check the Promotions or Vouchers section at checkout before confirming. Don't assume a discount is already applied to the listed price.

### 3. Price changed since the deal was listed

This is the most common reason for differences between SulitScan's listed price and the checkout price. Prices on Temu and Sephora PH can change daily — sometimes hourly during sale events.

SulitScan sources prices from affiliate datafeeds at the time we add or update a deal. We cannot guarantee the price is still the same when you click through to the partner store. This is why every deal card on SulitScan includes a "last checked" date and a reminder to confirm the final price on the partner store.

### 4. Variant pricing

The price shown may be for a specific color, size, or quantity. If you select a different variant — a larger size, a different color, a different quantity — the price updates to that variant's price.

Always confirm the price updates correctly after selecting your specific variant before proceeding to checkout.

### 5. Tax or VAT added at checkout

Some platforms display prices exclusive of taxes on product pages, then add VAT at checkout. This is more common on platforms operating in certain markets. Check if tax is added at checkout on the platform you're using.

### 6. Exchange rate fluctuation

If you're paying through a credit card in a currency other than Philippine Peso, your bank's exchange rate and any foreign transaction fees will affect your final billed amount. This applies to international platforms like Temu.

### 7. Minimum quantity requirements

Some Temu products have a minimum order quantity (e.g., "pack of 5" or "set of 3"). If the listed price is per item but the minimum order is a pack, the total at checkout will be for the pack, not the single item.

## Temu-Specific Price Notes

- Temu's listed price on product pages is usually the pre-shipping price
- First-time buyer discounts are applied at checkout, not on the product page
- Bundled or multi-quantity discounts apply when you add the required quantity
- Flash sale prices are time-limited — if you delay, the price may revert

## Sephora PH-Specific Price Notes

- Sephora PH shows product prices inclusive of VAT
- Shipping is free for orders ₱1,500 and above; below that, a shipping fee applies
- Beauty Rewards point redemptions are applied at checkout
- Brand promo codes and platform vouchers are entered at checkout — they don't automatically appear in the cart

## What SulitScan Does

We add a "last checked" timestamp to every deal. We include a price disclaimer reminding you that prices may differ from what we list. And we include a buyer checklist on every deal detail page — the first item is always to confirm the current price on the partner store.

We are a small, manual operation. Prices in our datafeed update periodically but are not real-time. The best use of SulitScan is as a discovery tool — find deals here, then confirm the price and details on the partner store before buying.

## How to Check the Final Price Before Committing

1. Click through to the partner store from the deal card or detail page
2. Select the specific variant you want (size, color, quantity)
3. Add to cart
4. Check the cart total — this is the pre-checkout price
5. At checkout: check for available vouchers and apply them
6. Review the order total on the payment page — this includes shipping and any taxes
7. Only confirm the order when you're satisfied with the total

## Your Final Pre-Purchase Checklist

1. Does the checkout price match your budget?
2. Has shipping been added? Is it still within budget?
3. Did you apply any available vouchers or loyalty points?
4. Is the variant (size, color, quantity) correct?
5. Is the delivery estimate acceptable?
6. Do you understand the return policy if the item doesn't meet expectations?

If any of these don't look right — step back. There's no urgency. Good deals come back.

## FAQ

**Q: SulitScan showed ₱299 but the product is now ₱450 on Temu. What happened?**
Prices change after we update our listings. Our datafeed prices are not real-time. Always confirm on the partner store before buying. If you see a significant difference, use the "Report outdated price" link on the deal page.

**Q: Can I lock in a price by adding to cart?**
On most platforms, adding to cart does not lock in a price. The price at checkout is the current price at the time you complete the order. Cart prices can change.

**Q: What's the best way to avoid checkout price surprises?**
Go all the way to the payment confirmation page before finalizing. Review the itemized total — product price, shipping, taxes, and any discounts applied — before entering payment details.

**Q: Is the checkout price fixed after I confirm the order?**
Yes — once an order is confirmed, the price at confirmation is the price you pay. Subsequent price drops on the platform do not retroactively apply to completed orders.

**Q: What if I notice the wrong price was charged after payment?**
Contact the platform's customer support with your order details. Keep all order confirmations and receipts. Most platforms have a process for billing dispute resolution.

## Related on SulitScan

Read our guide on [how to spot fake discounts](/blog/how-to-spot-fake-discounts) and our [voucher and shipping checklist](/blog/voucher-shipping-return-checklist). Browse [current deals](/deals) on SulitScan.

## Affiliate Disclosure

SulitScan may earn a commission when you click partner links and complete a purchase. This does not affect your price. See our full [Affiliate Disclosure](/affiliate-disclosure).
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2026-06-06",
    lastReviewed: "2026-06-08",
    readTime: 9,
    tags: ["checkout", "pricing", "tips", "buyer-protection", "transparency"],
    coverGradient: "from-violet-400 to-purple-600",
    coverImage: "/images/guides/final-price-checkout-guide.jpg",
    coverImageAlt: "Illustration of a checkout summary showing product price, shipping, vouchers, and final total",
  },

  {
    id: "post-007",
    slug: "best-temu-finds-under-500-philippines",
    title: "Best Temu Finds Philippines Under ₱500",
    excerpt:
      "Under ₱500, some Temu products are genuinely useful and others are a waste of a delivery slot. Here are the categories that consistently deliver value — and what to check first.",
    content: `
Temu has become one of the most popular ways for Filipino shoppers to find low-cost home, fashion, and accessory items online. But "cheap" and "sulit" are not the same thing. Under ₱500, some Temu products are genuinely useful — and others are a waste of a delivery slot. This guide covers the categories that consistently deliver value under ₱500, what to check before ordering, and how to avoid the common traps.

## What's in this guide

- Why under ₱500 is a smart starting budget
- The best Temu categories under ₱500
- What to check before you buy
- Categories to approach with caution
- How to stack vouchers to stay under ₱500
- Related guides and deals

## Why Under ₱500 Is a Smart Starting Budget

If you are new to Temu, a first order under ₱500 is the lowest-risk way to test the platform. You get to see the real shipping time to the Philippines, the actual packaging, and the true material quality — without committing a large amount of money to a store you have not bought from before.

Most genuinely useful Temu finds in this range are small, practical items where "good enough" quality is perfectly acceptable: organizers, clips, basic accessories, and tools you will not be heartbroken about if they are a little flimsier than expected.

## The Best Temu Categories Under ₱500

### Home organizers and storage

This is where Temu shines. Drawer dividers, cable organizers, under-sink racks, spice containers, and stackable bins are usually well under ₱500 and do exactly what they promise. Because these items do not need precise tolerances or premium materials, the value is consistently strong.

### Cable management and phone accessories

Cord clips, velcro ties, charging cable organizers, phone stands, and pop sockets are cheap, useful, and low-risk. Just confirm cable and connector types (USB-A vs USB-C vs Lightning) match your devices before ordering.

### Kitchen gadgets and tools

Measuring spoons, silicone brushes, jar openers, peelers, and small storage containers are practical buys. Avoid anything that needs to hold heat, take a sharp edge, or carry real weight — those are where ultra-cheap kitchen tools disappoint.

### Stationery and desk accessories

Sticky notes, desk organizers, pen holders, clips, and label makers are reliable value. Great for students and home offices on a budget.

### Small fashion accessories

Hats, tote bags, scrunchies, simple jewelry, and sunglasses are forgiving because they do not depend on precise sizing. These make low-risk first orders.

## What to Check Before You Buy

> A low price only becomes a good deal once you have confirmed the size, material, and shipping time match your expectations.

Before adding anything to your Temu cart, run through this quick checklist:

- **Read reviews with photos.** Filipino and Southeast Asian buyer photos tell you far more than the listing images, which are often styled and oversized.
- **Check dimensions in centimeters.** Many Temu items are smaller than they look. The product photo of an "organizer" might be the size of your palm.
- **Confirm the material.** "Stainless steel" in some listings means steel-finish plastic. Read the specification, not just the title.
- **Check the estimated delivery date.** Temu ships internationally to the Philippines, usually in 7–20 business days. If you need an item urgently, this is not the right channel.
- **Confirm the all-in price.** Add shipping (if any) and check whether a voucher applies before assuming the item is under ₱500 at checkout.

For more on this, read our guide on [how to spot fake discounts](/blog/how-to-spot-fake-discounts).

## Categories to Approach With Caution

Not everything under ₱500 is worth it. Be more careful with:

- **Electronics with batteries or chargers.** Cheap power banks and chargers can overstate capacity or lack proper voltage support for the Philippines (220V). Confirm "100–240V" input.
- **Skincare and anything applied to skin.** Under ₱500 beauty products that make anti-aging or whitening claims should be checked carefully. For skincare, an authorized retailer like [Sephora PH](/stores/sephora-ph) is a safer choice.
- **Anything load-bearing.** Hooks, shelves, and stands rated to hold weight are riskier at the lowest price points.

## How to Stack Vouchers to Stay Under ₱500

Temu frequently offers new-user vouchers, first-order discounts, and platform-wide coupons. These can bring an item that lists slightly above ₱500 back under your budget. Before checkout:

- Apply any available platform voucher or coupon code.
- Check whether free or discounted shipping applies to your order total.
- Compare the final, all-in total — not the pre-voucher sticker price.

Our [voucher and shipping checklist](/blog/voucher-shipping-return-checklist) walks through this in detail.

## Related on SulitScan

Browse current [Under ₱500 deals](/categories/under-500) or explore [Home Finds](/categories/home-finds) and [Tech & Gadgets](/categories/tech-deals). New to the platform? Start with our [Temu shopping guide for the Philippines](/blog/temu-shopping-guide-philippines).

## Affiliate Disclosure

SulitScan may earn a commission when you click a partner link and complete a purchase, at no extra cost to you. Prices are sourced from affiliate datafeeds and may differ from the current price on Temu — always confirm before buying. See our full [Affiliate Disclosure](/affiliate-disclosure).
    `.trim(),
    category: "Platform Guides",
    author: "SulitScan Team",
    publishedAt: "2026-06-09",
    lastReviewed: "2026-06-14",
    readTime: 9,
    tags: ["temu", "under-500", "home-finds", "shopping-guide", "philippines"],
    coverGradient: "from-orange-400 to-amber-500",
    coverImage: "/images/guides/best-temu-finds-under-500-philippines.jpg",
    coverImageAlt: "Best Temu finds under ₱500 — budget home organizers, cable holders, phone stand, tumbler, and desk accessories",
  },

  {
    id: "post-008",
    slug: "temu-philippines-shipping-guide",
    title: "Temu Philippines Shipping Guide: Delivery, Fees, and What to Expect",
    excerpt:
      "How long does Temu take to arrive in the Philippines, and how much is shipping? A clear guide to delivery windows, fees, customs, tracking, and what to do if something goes wrong.",
    content: `
One of the most common questions Filipino shoppers ask before their first Temu order is simple: how long will it actually take to arrive, and how much is shipping? This guide explains how Temu shipping to the Philippines works — delivery windows, fees, customs, tracking, and what to do if something goes wrong.

## What's in this guide

- How Temu ships to the Philippines
- Typical delivery times
- Shipping fees and free shipping
- Customs, duties, and taxes
- Tracking your order
- Delays, missing items, and refunds
- Tips for a smoother delivery

## How Temu Ships to the Philippines

Temu fulfills most Philippine orders from international warehouses, then hands the parcel to a local courier for final delivery. This means your order typically passes through two stages: an international leg, and a local last-mile delivery once it reaches the country.

Because of this model, Temu delivery is slower than a local seller shipping from within the Philippines — but the trade-off is access to a much wider catalog at low prices.

## Typical Delivery Times

For most standard orders, expect **7 to 20 business days** from order confirmation to delivery. The exact timing depends on:

- Warehouse processing time
- The shipping method selected at checkout
- Customs clearance
- Local courier load in your area

> Always check the estimated delivery date shown at checkout before you confirm — it is the most accurate prediction for your specific order.

Some items ship from local or regional warehouses and arrive faster. Temu labels these where applicable, so look for quicker estimated dates if speed matters.

## Shipping Fees and Free Shipping

Temu regularly runs free or discounted shipping promotions, and many orders above a certain total qualify for free standard delivery. At checkout:

- Check whether your order qualifies for free shipping.
- Compare standard vs. express options — express costs more but shortens the international leg.
- Confirm the all-in total, including shipping, before paying.

Because promotions change frequently, treat any shipping fee as something to confirm at checkout rather than assume.

## Customs, Duties, and Taxes

Low-value parcels often clear without additional charges, but larger or higher-value orders may be subject to Philippine customs duties and VAT. Temu usually displays applicable import charges at checkout for transparency. To avoid surprises:

- Review the order summary for any import fees before confirming.
- Keep your order confirmation in case customs documentation is requested.
- Be aware that consolidating many items into one large order can push the total into a taxable bracket.

## Tracking Your Order

After your order ships, Temu provides tracking inside the app and via email. Tracking updates can be sparse during the international leg and become more detailed once the parcel reaches a local courier. If tracking appears stuck for several days during international transit, this is common and usually resolves on its own.

## Delays, Missing Items, and Refunds

Temu offers buyer protection that covers late deliveries, items that never arrive, and items that arrive damaged or significantly not as described. If something goes wrong:

1. Check the estimated delivery date — many "late" parcels are still within the stated window.
2. Open the order in the Temu app and use the help or refund option.
3. For damaged or wrong items, take clear photos immediately upon arrival.
4. File the claim within the protection window stated in the app.

For low-value items, Temu sometimes issues a refund without requiring you to ship the item back.

## Tips for a Smoother Delivery

- **Order early.** For gifts or time-sensitive needs, order at least 3–4 weeks ahead.
- **Use a complete, accurate address.** Include landmarks where helpful for the local courier.
- **Group orders thoughtfully.** Combining items can save on shipping but may increase customs exposure.
- **Confirm the price still makes sense with shipping included.** A cheap item with high shipping may not be sulit.

## Related on SulitScan

New to Temu? Read our full [Temu shopping guide for the Philippines](/blog/temu-shopping-guide-philippines) and our [voucher, shipping, and return checklist](/blog/voucher-shipping-return-checklist). Browse [Temu deals](/stores/temu) and [Under ₱500 finds](/categories/under-500).

## Affiliate Disclosure

SulitScan may earn a commission when you click a partner link and complete a purchase, at no extra cost to you. Shipping fees, delivery windows, and import charges are set by Temu and may change — always confirm at checkout. See our full [Affiliate Disclosure](/affiliate-disclosure).
    `.trim(),
    category: "Platform Guides",
    author: "SulitScan Team",
    publishedAt: "2026-06-10",
    lastReviewed: "2026-06-14",
    readTime: 8,
    tags: ["temu", "shipping", "philippines", "buyer-guide", "shopping-guide"],
    coverGradient: "from-sky-400 to-blue-600",
    coverImage: "/images/guides/temu-philippines-shipping-guide.jpg",
    coverImageAlt: "Temu Philippines shipping guide — order tracking screen showing processing, shipping, customs, and delivery stages",
  },

  {
    id: "post-009",
    slug: "sephora-ph-sale-guide",
    title: "Sephora PH Sale Guide: How to Get Better Value on Beauty Deals",
    excerpt:
      "Premium beauty comes with premium prices — but with the right timing and a few habits, you can get genuinely better value on Sephora PH skincare, makeup, and fragrance.",
    content: `
Sephora PH is the go-to for authenticated beauty in the Philippines — but premium brands come with premium prices. The good news: with the right timing and a few habits, you can get genuinely better value on skincare, makeup, and fragrance. This guide explains how Sephora PH sales work and how to make your beauty budget go further.

## What's in this guide

- How Sephora PH pricing and sales work
- When the best sales happen
- How to get better value year-round
- Beauty Rewards and member perks
- What to check before you buy
- Returns and authenticity
- Related guides and deals

## How Sephora PH Pricing and Sales Work

Sephora PH is an authorized retailer, so the products are authentic and prices are set by the store. Unlike some marketplace sellers, you will not see wildly inflated "original" prices designed to make discounts look bigger. That makes Sephora PH sales easier to trust — a discount is usually a real reduction from the standard retail price.

Sales tend to cluster around seasonal events and member promotions rather than running continuously. Knowing the rhythm helps you time bigger purchases.

## When the Best Sales Happen

The strongest value windows typically include:

- **Seasonal sale events** — mid-year and year-end sales often bring the deepest reductions.
- **Brand-specific promotions** — individual brands run limited offers throughout the year.
- **Member sale events** — loyalty members frequently get early access or extra discounts.
- **Holiday gift sets** — late in the year, value sets and bundles offer more product per peso.

> If a product is not urgent, add it to your wishlist and wait for a sale event rather than paying full price.

## How to Get Better Value Year-Round

Even outside major sales, you can stretch your budget:

- **Buy sets and bundles.** Value sets and minis often cost less per milliliter than full-size individual products.
- **Start with travel sizes.** For a product you have not tried, a mini lets you test before committing to a full-size price.
- **Watch free shipping thresholds.** Sephora PH offers free shipping on orders above a set amount (commonly ₱1,500) — consolidating purchases can save on delivery.
- **Prioritize hero products.** Spend on the items that matter most for your routine, and economize on basics.

## Beauty Rewards and Member Perks

Sephora PH's Beauty Rewards program lets you earn points on purchases that can be redeemed later, and members often get early or exclusive access to sales. If you buy from Sephora PH more than once or twice a year, enrolling is worth it — the points and member-only offers add real value over time.

## What to Check Before You Buy

Before checking out, confirm:

- **Shade or variant availability.** Sale items can sell out in popular shades — confirm yours is in stock.
- **Full-size vs. sample.** Make sure you are comparing like for like when judging value.
- **Ingredient list.** Check for allergens or actives (AHA, BHA, retinol) if you have sensitive skin, and patch test new products.
- **Current price on the partner store.** Prices on SulitScan come from affiliate datafeeds and may lag the live Sephora PH price — always confirm before buying.

## Returns and Authenticity

Because Sephora PH is an authorized retailer, authenticity is not the concern it can be on open marketplaces. Sephora PH generally accepts returns of unopened, unused products in original packaging within a set window with proof of purchase; opened products are usually non-returnable unless defective. Check the current return policy at the time of your order.

## Related on SulitScan

Read our [Sephora PH beauty guide](/blog/sephora-ph-beauty-guide) for brand and product picks, and browse current [Beauty deals](/categories/beauty) or the [Sephora PH store page](/stores/sephora-ph). Shopping for someone else? See [Gift Ideas](/categories/gift-ideas).

## Affiliate Disclosure

SulitScan may earn a commission when you click a partner link and complete a purchase, at no extra cost to you. Sale prices and availability are set by Sephora PH and change frequently — always confirm on the partner store before buying. See our full [Affiliate Disclosure](/affiliate-disclosure).
    `.trim(),
    category: "Platform Guides",
    author: "SulitScan Team",
    publishedAt: "2026-06-11",
    lastReviewed: "2026-06-14",
    readTime: 9,
    tags: ["sephora", "beauty", "skincare", "shopping-guide", "philippines"],
    coverGradient: "from-rose-400 to-pink-600",
    coverImage: "/images/guides/sephora-ph-sale-guide.jpg",
    coverImageAlt: "Sephora PH sale guide — beauty products with up to 30% off, Beauty Pass rewards card, and a maximize-your-value checklist",
  },

  {
    id: "post-010",
    slug: "online-shopping-safety-tips-philippines",
    title: "Online Shopping Safety Tips Philippines: What to Check Before Buying",
    excerpt:
      "Online shopping is convenient but attracts scams, fake listings, and misleading discounts. Practical safety checks every Filipino shopper can use to buy with confidence.",
    content: `
Online shopping in the Philippines is convenient and often cheaper than buying in store — but it also attracts scams, fake listings, and misleading discounts. This guide covers practical safety checks every Filipino shopper can use to buy with confidence, whether on Temu, Sephora PH, or any other platform.

## What's in this guide

- Verify the store and seller
- Read reviews the right way
- Spot fake discounts
- Protect your payment and data
- Understand shipping and returns before paying
- Red flags to walk away from
- What to do if something goes wrong

## Verify the Store and Seller

Before buying, confirm you are dealing with a legitimate store:

- **Prefer authorized retailers for branded goods.** For premium beauty, buy from an authorized retailer like [Sephora PH](/stores/sephora-ph) rather than an unknown marketplace seller.
- **Check the seller's history.** On marketplaces, look at how long the seller has operated, their rating, and their number of completed orders.
- **Be cautious of brand-new sellers** offering flagship products at prices far below everyone else.

## Read Reviews the Right Way

Star ratings alone can mislead. Dig deeper:

- **Filter for reviews with photos** from real buyers — these reveal true size, color, and quality.
- **Read the middle and negative reviews,** not just the five-star ones. Patterns in complaints (runs small, arrived damaged, not as pictured) are the most useful signal.
- **Be wary of listings with only generic, repetitive praise** and no detail — these can be padded.

## Spot Fake Discounts

A big red discount badge does not guarantee a real saving. A product listed at ₱999 "down from ₱3,500" may never have sold at ₱3,500.

> Judge the sale price against what similar products actually cost — not against the inflated "original" price next to it.

Our full guide on [how to spot fake discounts](/blog/how-to-spot-fake-discounts) breaks this down with examples.

## Protect Your Payment and Data

- **Use the platform's official checkout.** Never pay outside the app or site via direct bank transfer to a seller for a marketplace order.
- **Avoid sellers who ask you to move to a chat app** to "complete payment" — a common scam pattern.
- **Watch for phishing.** Legitimate stores will not ask for your password or full card details by message or email.
- **Use payment methods with buyer protection** where available.

## Understand Shipping and Returns Before Paying

Confirm these before you confirm the order:

- The estimated delivery date (international orders like Temu can take 7–20 business days).
- The all-in total, including shipping and any import charges.
- The return and refund policy for that specific item.

For a deeper checklist, see our [voucher, shipping, and return guide](/blog/voucher-shipping-return-checklist).

## Red Flags to Walk Away From

Stop and reconsider if you see:

- Prices dramatically lower than every other seller for the same branded item.
- Pressure tactics like countdown timers or "only 1 left" urgency designed to rush you.
- No clear return policy, seller information, or customer support channel.
- Requests to pay by direct transfer outside the platform.
- Reviews that all sound identical or were posted on the same day.

## What to Do If Something Goes Wrong

If an order arrives wrong, damaged, or never shows up:

1. Document everything — take photos on arrival and keep all order confirmations.
2. Open a claim through the platform's official buyer protection or dispute process.
3. File within the stated protection window.
4. Escalate to the platform's customer support if the seller is unresponsive.

Buyer protection programs exist precisely for these cases, so use the official channels rather than negotiating off-platform.

## Related on SulitScan

Learn [how SulitScan checks deals](/blog/how-sulitscan-checks-deals) before listing them, and read [why final prices change at checkout](/blog/why-final-prices-change-at-checkout). Browse [current deals](/deals) with buyer notes on every card.

## Affiliate Disclosure

SulitScan may earn a commission when you click a partner link and complete a purchase, at no extra cost to you. We add buyer reminders to every deal, but always confirm price, availability, and return terms on the partner store before buying. See our full [Affiliate Disclosure](/affiliate-disclosure).
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2026-06-12",
    lastReviewed: "2026-06-14",
    readTime: 9,
    tags: ["shopping-tips", "buyer-protection", "safety", "philippines", "smart-shopping"],
    coverGradient: "from-emerald-400 to-teal-600",
    coverImage: "/images/guides/online-shopping-safety-tips-philippines.jpg",
    coverImageAlt: "Online shopping safety tips Philippines — secure checkout screen, shield lock, and a shopping safety checklist",
  },

  {
    id: "post-011",
    slug: "philippine-import-tax-guide-online-shoppers",
    title: "Philippine Import Tax Guide for Online Shoppers: What to Check Before Ordering Abroad",
    excerpt:
      "Will you pay import tax when your overseas order reaches the Philippines? A plain-English guide to the ₱10,000 de minimis rule, customs duty, VAT, and landed cost.",
    content: `
Ordering from overseas stores is normal now for Filipino shoppers. Platforms like Temu, Shein, AliExpress, and Amazon make it easy to buy gadgets, clothes, skincare, and home items at attractive prices. But before you check out, there is one question many shoppers forget to ask: **will I need to pay import tax when my package arrives in the Philippines?**

This guide explains the basics in plain terms — written for everyday online shoppers, not customs brokers. The goal is to help you understand what can affect your final cost before your order reaches your door. It pairs well with our [Temu Philippines shipping guide](/blog/temu-philippines-shipping-guide) and our explainer on [why final prices change at checkout](/blog/why-final-prices-change-at-checkout).

> This is a general educational guide, not official Bureau of Customs advice. For high-value shipments, always confirm with the courier and official sources.

## What's in this guide

- What import tax means for online shoppers
- The ₱10,000 de minimis rule
- Why your final cost differs from checkout
- FOB vs CIF, explained simply
- Worked examples, below and above ₱10,000
- Multiple packages arriving together
- Common mistakes and a pre-order checklist
- How to estimate your landed cost

## What is import tax in the Philippines?

When goods enter the Philippines from another country, they may be assessed by the Bureau of Customs. Depending on the item value, product type, and how the shipment is classified, it may be subject to **customs duty**, **VAT**, import processing charges, or other fees.

For online shoppers, this usually matters when buying from overseas platforms or sellers — Temu and Shein orders shipped from abroad, AliExpress and Amazon parcels, consolidated shipments from forwarders, and other cross-border packages.

Not every package is taxed. The amount depends on the declared value of the goods and how the shipment is assessed.

## The ₱10,000 de minimis rule

In simple terms, the de minimis rule is a threshold for low-value imports. For many personal online orders, if the value of the goods is **₱10,000 or less**, customs duty and VAT generally are not collected. Once a shipment goes above the threshold, duties and taxes may apply depending on the product category and customs assessment.

This threshold is usually checked against the **value of the goods** (often called the FOB or FCA value) — that is, the item value itself, before shipping and insurance.

![Philippine ₱10,000 de minimis rule — orders valued at ₱10,000 or less may enter duty and VAT free, while orders above ₱10,000 may become dutiable|1448x1086](/images/guides/philippine-de-minimis-rule.jpg)

## Why your final cost differs from the checkout price

Many shoppers assume the checkout price is the final cost. That is not always true. The amount shown on the shopping app may cover the item and sometimes shipping, but it may not include every import-related charge.

Your final **landed cost** can be affected by item value, currency conversion, shipping, insurance, product category, the customs duty rate, VAT, courier handling or processing fees, and whether several packages are assessed together. This is why a cheap-looking item can become more expensive when it arrives.

![Sample landed-cost breakdown for an overseas order — item price plus shipping, insurance, customs duty, and 12% VAT add up to the total you actually pay|1448x1086](/images/guides/import-tax-cost-breakdown.jpg)

## FOB vs CIF: the difference in plain terms

Two terms you may see are **FOB** and **CIF**:

- **FOB** is the value of the goods themselves — think of it as the item price before shipping and insurance.
- **CIF** means cost, insurance, and freight — the item value plus shipping plus insurance.

A simple way to remember it:

> FOB = item value. CIF = item value + shipping + insurance.

The de minimis check is usually based on the goods value. But if a shipment becomes taxable, the calculation may use a broader customs value that can include shipping and insurance.

## Example: an order below ₱10,000

Say you order accessories from an overseas store:

- Item value: ₱3,500
- Shipping: ₱300
- Insurance: ₱0

If the goods value is within the de minimis threshold and the package qualifies, customs duty and VAT generally are not collected. Still check the platform, courier, and shipping terms, since other processing or handling charges can depend on the arrangement.

## Example: an order above ₱10,000

Now say you order several items together:

- Item value: ₱12,500
- Shipping: ₱800
- Insurance: ₱0

Since the goods value is above ₱10,000, the shipment may be subject to customs duty and VAT depending on the product category and official assessment. This is where estimating before you buy really helps.

## What about multiple packages on the same day?

This catches a lot of shoppers. If you place several orders close together, they may arrive around the same time — and depending on how they are assessed, multiple packages for the same recipient or address may be treated together.

For example, three parcels of ₱4,000, ₱3,500, and ₱3,200 each look below ₱10,000 individually. Together, the total is ₱10,700 — which can push the combined value over the threshold. If you are buying several items from overseas within the same period, plan your orders carefully.

## Why product category matters

Different products can carry different duty rates. Clothing, shoes, electronics, cosmetics, books, toys, and bags are not always treated the same — the actual duty depends on the proper HS or AHTN classification. Calculators can only estimate based on general categories; for high-value shipments, verify the classification through official sources or a customs professional.

## Common mistakes Filipino shoppers make

- **Looking only at the item price.** A product looks cheap until shipping, VAT, duty, and handling are added.
- **Ignoring currency conversion.** A price in USD, CNY, or JPY changes in pesos depending on the exchange rate used.
- **Buying several packages at once.** Shipments arriving together may be assessed together.
- **Assuming the seller paid all taxes.** A final-looking checkout amount does not always cover import charges.
- **Not checking the product category.** The duty rate depends on what the item actually is, not just what the seller calls it.

Our guide on [how to spot fake discounts](/blog/how-to-spot-fake-discounts) and our [online shopping safety tips](/blog/online-shopping-safety-tips-philippines) cover related traps worth avoiding.

## Quick checklist before placing an overseas order

- What is the item value in pesos?
- Is it close to or above ₱10,000?
- How much is shipping, and is insurance included?
- What product category does it belong to?
- Will multiple packages arrive around the same time?
- Does the checkout page mention duties, taxes, or import fees?
- Does the courier collect charges on delivery?
- Is the seller reliable and the return policy acceptable?
- Is the item still worth it after possible charges?

## Estimate your landed cost before you order

Want a quick estimate before you buy? We built a free sister tool, **[ImportTaxPH](https://www.importtaxph.com/)**, to help Filipino shoppers estimate possible customs duty, VAT, and total landed cost for overseas orders from stores like Temu, Shein, AliExpress, and Amazon.

To get a useful estimate, have these ready: item price and currency, shipping cost, insurance if any, product category, and whether multiple shipments may arrive on the same day. The result is an estimate only — the final assessment depends on official customs valuation and classification — but it helps you decide whether a foreign deal is still worth it after charges. You can try it at [importtaxph.com](https://www.importtaxph.com/).

## Is buying overseas still worth it?

Sometimes, yes — when the product is much cheaper than local options, hard to find here, shipping is reasonable, the order is below the de minimis threshold, and the seller has good reviews. Local buying can be better when the price difference is small, you need fast delivery, warranty matters, or the item is expensive, fragile, or sensitive to sizing and returns.

The best choice is not always the cheapest checkout price — it is the one with the best total value after all costs and risks. When you spot an overseas deal on [SulitScan](/deals), factor in the possible landed cost first.

## Related on SulitScan

Read our [Temu Philippines shipping guide](/blog/temu-philippines-shipping-guide) for delivery and fees, [why final prices change at checkout](/blog/why-final-prices-change-at-checkout), and our [best Temu finds under ₱500](/blog/best-temu-finds-under-500-philippines). Browse current [Under ₱500 deals](/categories/under-500) or all [deals on SulitScan](/deals).

## Affiliate Disclosure

SulitScan may earn a commission when you click a partner link and complete a purchase, at no extra cost to you. ImportTaxPH is our free sister tool, not a Bureau of Customs service — its estimates are for guidance only, not legal or tax advice. Always confirm the final landed cost with the courier and official sources before buying. See our full [Affiliate Disclosure](/affiliate-disclosure).
    `.trim(),
    category: "Shopping Tips",
    author: "SulitScan Team",
    publishedAt: "2026-06-20",
    lastReviewed: "2026-06-20",
    readTime: 10,
    tags: ["import-tax", "customs", "philippines", "shopping-tips", "temu"],
    coverGradient: "from-blue-500 to-indigo-600",
    coverImage: "/images/guides/import-tax-landed-cost.jpg",
    coverImageAlt: "International parcel from overseas to the Philippines with a customs declaration, calculator, peso bills, and a landed-cost breakdown",
  },

  {
    id: "post-012",
    slug: "best-shopee-finds-under-500-philippines",
    title: "Best Shopee Finds Under ₱500 Philippines",
    excerpt:
      "Under ₱500, Shopee is great for organizers, phone accessories, and bags, and risky for electronics. Here is what actually holds up and what to skip.",
    content: `
Shopee is where a lot of Filipino shoppers go first for cheap, practical stuff. Under ₱500 you are not buying heirlooms. You are buying the small things that make a desk tidier, a bag lighter, or a kitchen drawer less chaotic. That is exactly where Shopee tends to be worth it.

This guide is about the under ₱500 finds that actually hold up, not the ones that look great in the listing photo and arrive sad. It pairs well with our [best Temu finds under ₱500](/blog/best-temu-finds-under-500-philippines) if you are weighing the two.

## What's in this guide

- Why Shopee works for budget hauls
- The categories that deliver under ₱500
- A quick buyer checklist
- What to check before you order
- Common mistakes to avoid
- Is it worth it
- FAQs

## Why Shopee works for budget hauls

The appeal is simple. Local sellers, faster shipping than overseas marketplaces, frequent vouchers, and a return process that exists if something goes wrong. You can get an order in a few days instead of a few weeks, and you can stack a voucher or free shipping promo on top of an already low price.

The catch is that quality is all over the place. One ₱149 organizer is genuinely useful for three years. The next one cracks in the first week. The trick is knowing which categories are forgiving at this price and which ones are not.

## The categories that deliver under ₱500

### Home and desk organization

This is the safest bet. Drawer dividers, pen holders, cable boxes, storage bins, shoe racks, and small kitchen organizers each do one job, and most do it fine. Buy these freely. If a ₱200 organizer saves you ten minutes of digging every morning, it paid for itself. Browse our [Home Finds](/categories/home-finds) for current picks.

### Phone and tech accessories

Phone stands, cable organizers, cable clips, mousepads, laptop stands, and earphone cases are low risk and cheap. Confirm the connector type before buying anything that plugs in, and skip the very cheapest chargers and power banks. For everything else, browse [Tech and Gadgets](/categories/tech-deals).

### Bags and everyday fashion

Tote bags, sling bags, canvas bags, caps, and simple accessories are forgiving because they do not depend on exact sizing. A ₱300 canvas tote does not need to be premium to be useful. Read the buyer photos, not just the listing render, since fabric and color are where cheap bags disappoint.

### Travel and packing

Toiletry bags, packing pouches, and zippered organizers are cheap and genuinely handy for trips. They keep a bag from turning into a black hole. Just do not expect heavy duty zippers at this price.

## A quick buyer checklist

Before you order anything under ₱500, run through this:

1. Does the seller have a solid rating and a decent number of sales?
2. Are there buyer reviews with real photos, ideally from Filipino shoppers?
3. Does the listing show actual dimensions in centimeters?
4. Is there a voucher or free shipping promo you can apply?
5. What does shipping cost, and when does it arrive?
6. What is the return policy if it shows up wrong or broken?

If most of those check out, a cheap item is usually a safe bet.

## What to check before you order

> A ₱149 price tag is only a good deal once the size, material, and seller all check out.

Sellers matter more than the price. A Preferred Seller or Shopee Mall listing is not a guarantee, but it is a better starting point than a brand new shop with no reviews. For anything branded, be skeptical of prices far below everyone else, since replicas are common at the bottom of the market. Our guide on [how to spot fake discounts](/blog/how-to-spot-fake-discounts) covers the inflated original price trick that shows up here a lot.

Check the all in cost too. A ₱120 item with ₱90 shipping is really a ₱210 item. Vouchers can swing it the other way, so look before you commit.

## Common mistakes to avoid

- Buying on the listing photo alone. The styled render is not what ships. The buyer photos are.
- Ignoring the size. Plenty of cheap organizers are smaller than they look on screen.
- Filling a cart with ten random things because they are cheap. Two useful items beat ten that sit in a drawer.
- Assuming branded means real. At suspiciously low prices, it often is not.
- Skipping the return terms. On a ₱200 item the return shipping can cost more than the refund is worth, so know that going in.

Our [online shopping safety tips](/blog/online-shopping-safety-tips-philippines) go deeper on seller and payment red flags.

## Is it worth it

Honestly, yes, for the right things. Shopee under ₱500 is great for organizers, accessories, and everyday practical items where good enough is genuinely good enough. It is a worse idea for anything where safety, warranty, sizing, or authenticity really matters. Spend the ₱149 on a drawer organizer. Do not spend it on a charger for your new phone.

Browse current [deals on SulitScan](/deals) or jump straight to [Under ₱500](/categories/under-500), where you can filter by store and sort by our SulitScore. For buyer reminders and FAQs specific to this marketplace, see our [Shopee PH buyer guide](/stores/shopee-ph).

## FAQs

**Q: Are Shopee items under ₱500 worth buying?**
For practical, low risk items like organizers, phone accessories, and bags, usually yes. The value is consistent when the item does not depend on premium materials or exact sizing. For electronics with batteries, branded goods, or anything safety related, spend a bit more or buy from a verified seller.

**Q: How do I avoid getting a bad product on Shopee?**
Check the seller rating and sales count, read reviews with real buyer photos, and confirm the dimensions in the listing. Preferred Sellers and Shopee Mall shops are a safer starting point, though not a guarantee.

**Q: Does SulitScan sell these products?**
No. SulitScan is a shopping guide. We point you to listings on partner stores like Shopee, and you buy directly from the seller. We do not handle payments, orders, or returns.

**Q: Why is the price on SulitScan different from Shopee?**
Prices come from affiliate datafeeds and can lag the live Shopee price. Vouchers and flash sales change fast, so always confirm the current price on Shopee before buying.

**Q: Can I return a cheap Shopee item if it arrives wrong?**
Shopee has a return and refund process, but for low value items the return shipping may cost more than the refund. Take photos on arrival, file within the window, and weigh whether the return is worth the hassle.

## Affiliate disclosure

SulitScan may earn a commission when you click a partner link and complete a purchase, at no extra cost to you. Prices, vouchers, and availability change often, so always confirm the final price, shipping fee, and return terms on Shopee before buying. See our full [Affiliate Disclosure](/affiliate-disclosure).
    `.trim(),
    category: "Platform Guides",
    author: "SulitScan Team",
    publishedAt: "2026-06-27",
    lastReviewed: "2026-06-27",
    readTime: 8,
    tags: ["shopee", "under-500", "home-finds", "shopping-guide", "philippines"],
    coverGradient: "from-orange-400 to-amber-500",
    coverImage: "/images/guides/best-shopee-finds-under-500-philippines.jpg",
    coverImageAlt: "Best Shopee finds under ₱500 in the Philippines: phone stand, desk organizer, cable holder, tumbler, makeup organizer, and travel pouch",
    faqs: [
      {
        question: "Are Shopee items under ₱500 worth buying?",
        answer:
          "For practical, low risk items like organizers, phone accessories, and bags, usually yes. The value is consistent when the item does not depend on premium materials or exact sizing. For electronics with batteries, branded goods, or anything safety related, spend a bit more or buy from a verified seller.",
      },
      {
        question: "How do I avoid getting a bad product on Shopee?",
        answer:
          "Check the seller rating and sales count, read reviews with real buyer photos, and confirm the dimensions in the listing. Preferred Sellers and Shopee Mall shops are a safer starting point, though not a guarantee.",
      },
      {
        question: "Does SulitScan sell these products?",
        answer:
          "No. SulitScan is a shopping guide. We point you to listings on partner stores like Shopee, and you buy directly from the seller. We do not handle payments, orders, or returns.",
      },
      {
        question: "Why is the price on SulitScan different from Shopee?",
        answer:
          "Prices come from affiliate datafeeds and can lag the live Shopee price. Vouchers and flash sales change fast, so always confirm the current price on Shopee before buying.",
      },
      {
        question: "Can I return a cheap Shopee item if it arrives wrong?",
        answer:
          "Shopee has a return and refund process, but for low value items the return shipping may cost more than the refund. Take photos on arrival, file within the window, and weigh whether the return is worth the hassle.",
      },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getRecentPosts(count = 6): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, count)
}
