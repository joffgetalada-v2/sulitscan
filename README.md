# SulitScan PH

**Check deals before you click buy.**

SulitScan PH is a curated deals discovery site for Filipino shoppers, focused on **Temu** and **Sephora PH** affiliate deals. Honest notes, SulitScore ratings, and clear affiliate disclosure on every page.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.x | App Router framework |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.x | UI animations |
| Remotion + @remotion/player | 4.x | Hero animation |
| Lucide React | 1.x | Icons |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Homepage
│   ├── ads.txt/route.ts         # Dynamic ads.txt (see AdSense section)
│   ├── deals/                   # Deals listing + detail pages
│   ├── categories/              # Category pages
│   ├── stores/                  # Partner store pages
│   ├── blog/                    # Blog listing + articles
│   ├── about/
│   ├── contact/
│   ├── cookie-policy/           # Cookie Policy page
│   ├── affiliate-disclosure/
│   ├── privacy-policy/
│   ├── terms/
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── DealCard.tsx
│   ├── CategoryCard.tsx
│   ├── DealsGrid.tsx
│   ├── ExternalAffiliateLink.tsx  # Enforces correct rel attributes on all affiliate links
│   ├── AdSensePlaceholder.tsx     # AdSense scaffold (disabled by default)
│   ├── SeoJsonLd.tsx
│   └── ...
├── data/
│   ├── deals.ts
│   ├── categories.ts
│   ├── posts.ts
│   └── stores.ts
└── lib/
    ├── seo.ts
    └── utils.ts
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | No | Google AdSense publisher ID for client-side ad rendering. Set to enable AdSense. |
| `ADSENSE_PUBLISHER_ID` | No | Server-side AdSense publisher ID used to generate `/ads.txt`. |

### `.env.local` example

```env
# AdSense — leave blank until your account is approved
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
ADSENSE_PUBLISHER_ID=
```

---

## AdSense Setup (When Ready)

SulitScan is structured for AdSense approval. Follow these steps when ready to monetize:

### Step 1 — Apply for AdSense

Ensure the site has:
- Active `/about`, `/contact`, `/privacy-policy`, `/affiliate-disclosure`, and `/cookie-policy` pages
- Sufficient content (blog posts, deal pages)
- No auto-redirects, fake buttons, or misleading CTAs

### Step 2 — Get Approved

Submit https://sulitscan.com to Google AdSense. Approval typically takes 1–14 days.

### Step 3 — Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID = ca-pub-XXXXXXXXXXXXXXXX
ADSENSE_PUBLISHER_ID = pub-XXXXXXXXXXXXXXXX
```

### Step 4 — Add AdSense Script to Layout

In `src/app/layout.tsx`, add inside `<head>`:
```tsx
<script
  async
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
  crossOrigin="anonymous"
/>
```

### Step 5 — Place Ad Units

Use the `AdSensePlaceholder` component in `src/components/AdSensePlaceholder.tsx`.
Replace the placeholder `div` with the real `ins.adsbygoogle` element.

**AdSense placement rules — do not violate:**
- Do not place ads beside fake buttons, arrows, or product CTAs
- Do not place ads where they could be confused with affiliate "View Deal" buttons
- Keep affiliate CTAs clearly separate from ad units
- Do not write "click ads to support us"

### Step 6 — Verify ads.txt

After deploying with `ADSENSE_PUBLISHER_ID` set, visit https://sulitscan.com/ads.txt to confirm it outputs:
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

---

## Affiliate Links

All affiliate links must use `ExternalAffiliateLink` from `src/components/ExternalAffiliateLink.tsx`.

```tsx
import { ExternalAffiliateLink } from "@/components/ExternalAffiliateLink"

<ExternalAffiliateLink href={deal.affiliateLink} platform={deal.platform}>
  View Deal on {deal.platform}
</ExternalAffiliateLink>
```

This enforces: `target="_blank" rel="sponsored nofollow noopener noreferrer"` on every link.

Affiliate button text should be:
- ✅ "View Deal on Temu"
- ✅ "View Deal on Sephora PH"
- ✅ "Visit Temu"
- ✅ "Visit Sephora PH"
- ❌ "Buy Now" / "Checkout" / "Add to Cart" / "Claim Now"

---

## SEO

- Canonical URLs: all point to `https://sulitscan.com`
- Open Graph + Twitter Cards on every page
- JSON-LD: Organization, WebSite, BreadcrumbList, ItemList, BlogPosting, FAQPage
- `sitemap.ts` auto-generates all public routes
- `robots.ts` allows all crawlers, links to sitemap
- `metadataBase` set to `https://sulitscan.com` in layout

---

## Compliance

- No cart, checkout, or payment functionality
- No auto-redirect on affiliate links
- All affiliate links: `rel="sponsored nofollow noopener noreferrer"`
- Affiliate disclosure on every page (footer banner + dedicated `/affiliate-disclosure` page)
- Deal data is from affiliate datafeeds — not guaranteed live prices
- `/cookie-policy` and `/privacy-policy` explain cookie and analytics usage

---

## Deploy to Vercel

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Connect your GitHub repo to Vercel. No additional build configuration needed.

---

## TODOs / Future

- Connect to a CMS or database for live deal management
- Add price history integration
- Add email newsletter for weekly deal digests
- Add OG image generation per deal/post
- Expand to additional affiliate partners (update `ACTIVE_PLATFORMS` in `deals.ts`)
- Add dark mode

---

## Affiliate Disclosure

SulitScan PH participates in affiliate programs with Temu and Sephora PH (via Involve Asia).
We earn a commission when you click our links and make a purchase — at no extra cost to you.
See `/affiliate-disclosure` for full details.
