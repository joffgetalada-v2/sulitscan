# SulitScan PH

**Check deals before you click buy.**

SulitScan PH is a curated deals discovery site for Filipino shoppers, focused on **Temu**, **Shopee PH**, and **Sephora PH** affiliate deals. Honest notes, SulitScore ratings, and clear affiliate disclosure appear on every page.

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
│   ├── AdSenseArticleScript.tsx   # Optional article-only AdSense loader
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
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | No | Real AdSense client ID used for the homepage verification meta tag and `/ads.txt` generation. Accepts `ca-pub-` or `pub-` plus 16 digits. |
| `NEXT_PUBLIC_ADSENSE_ADS_ENABLED` | No | Keep `false` for verification and review; set to the exact value `true` only after approval to enable the existing article-only loader. |

### `.env.local` example

```env
# AdSense — do not use a placeholder ID
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_ADSENSE_ADS_ENABLED=false
```

---

## AdSense Operations

Do not configure AdSense with a placeholder. Obtain your real publisher/client ID from Google AdSense first.

1. In Vercel, set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` to the real ID and keep `NEXT_PUBLIC_ADSENSE_ADS_ENABLED=false` for verification and review. A valid client ID enables the homepage verification meta tag and `/ads.txt`.
2. Deploy, then verify the homepage meta tag and the `/ads.txt` line. Submit the site for review and wait for Google's decision; this documentation does not promise an approval time.
3. Before enabling serving, configure and verify a Google-certified consent management platform for regions where consent is required, including the EEA, United Kingdom, and Switzerland. The repository does not provide this CMP.
4. Set `NEXT_PUBLIC_ADSENSE_ADS_ENABLED=true` only after approval and after the required CMP is configured and verified. The existing `AdSenseArticleScript` then loads the Google script on full article pages only. If desired, configure Auto ads in AdSense.
5. No layout edit or placeholder component is needed for the existing verification and article-only loader.

**AdSense placement and policy cautions:**
- Do not place ads beside fake buttons, arrows, or product CTAs
- Do not place ads where they could be confused with affiliate "View Deal" buttons
- Keep affiliate CTAs clearly separate from ad units
- Do not write "click ads to support us"

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
