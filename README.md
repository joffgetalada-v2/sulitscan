# SulitScan PH

**Find deals that are actually sulit.**

SulitScan PH is a professional affiliate marketing and deals discovery website for Filipino shoppers. It helps users find curated deals from Shopee, Lazada, AliExpress, Temu, and more — with honest value notes, SulitScore ratings, and clear affiliate disclosure.

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
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Homepage
│   ├── deals/              # Deals listing + detail pages
│   ├── categories/         # Category pages
│   ├── stores/             # Partner store pages
│   ├── blog/               # Blog listing + article pages
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── affiliate-disclosure/
│   ├── privacy-policy/
│   ├── terms/
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── robots.ts           # robots.txt generation
├── components/             # Reusable UI components
│   ├── Header.tsx          # Sticky responsive navigation
│   ├── Footer.tsx          # Footer with affiliate disclosure
│   ├── Hero.tsx            # Homepage hero with Remotion animation
│   ├── DealCard.tsx        # Product deal card
│   ├── CategoryCard.tsx    # Category browse card
│   ├── StoreCard.tsx       # Partner store card
│   ├── SectionHeading.tsx  # Reusable section titles
│   ├── SeoJsonLd.tsx       # JSON-LD structured data helpers
│   ├── MotionMascot.tsx    # Animated scanner illustration
│   └── RemotionHeroPlayer.tsx  # Client-only Remotion player
├── remotion/
│   └── SulitScanHeroAnimation.tsx  # Hero animation composition
├── data/                   # Static sample data
│   ├── deals.ts
│   ├── categories.ts
│   ├── posts.ts
│   └── stores.ts
└── lib/                    # Utilities
    ├── seo.ts              # SEO config and metadata defaults
    └── utils.ts            # Formatting helpers
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

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

## Key Notes

### Compliance
- No fake checkout, cart, or payment functionality
- No auto-redirect on affiliate links
- All external affiliate links use rel="sponsored nofollow noopener noreferrer"
- Affiliate disclosure on every page (footer + banner)
- All deals are demo/sample data — not live prices

### Remotion Player
The hero animation uses @remotion/player loaded via next/dynamic with ssr: false to avoid SSR issues. The animation composition lives in src/remotion/SulitScanHeroAnimation.tsx.

### SEO
- Metadata API for every page
- Canonical URLs pointing to sulitscan.com
- Open Graph + Twitter Cards
- JSON-LD structured data (Organization, WebSite, ItemList, BlogPosting, BreadcrumbList, FAQPage)
- sitemap.ts + robots.ts

---

## Deploy to Vercel

```bash
git add .
git commit -m "Initial SulitScan PH build"
git push origin main
```

Then connect your GitHub repo to Vercel and deploy. No additional build configuration needed.

---

## TODOs / Future Enhancements

- Connect to a real database or headless CMS for live deals
- Add search functionality across deals and posts
- Implement actual affiliate link tracking/redirect
- Add user deal submission form
- Add price history integration
- Add email newsletter for weekly deal digests
- Add dark mode support
- Add product comparison feature
- Integrate with Shopee/Lazada affiliate APIs when available
- Add OG image generation for each deal/post

---

## Affiliate Disclosure

SulitScan PH participates in affiliate programs. We earn a commission when you click our links and make a purchase — at no extra cost to you. See /affiliate-disclosure for full details.
