export const siteConfig = {
  name: "SulitScan PH",
  shortName: "SulitScan",
  tagline: "Check deals before you click buy.",
  description:
    "SulitScan PH helps Filipino shoppers review selected Temu and Sephora deals with transparent notes, buyer reminders, and clear affiliate disclosures.",
  url: "https://sulitscan.com",
  ogImage: "https://sulitscan.com/og-image.png",
  locale: "en_PH",
  twitterHandle: "@sulitscanph",
}

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SulitScan PH | Temu and Sephora Deals for Filipino Shoppers",
    template: "%s | SulitScan PH",
  },
  description: siteConfig.description,
  keywords: [
    "Temu deals Philippines",
    "Sephora PH deals",
    "Sephora Philippines sale",
    "Temu Philippines shopping guide",
    "online deals Philippines",
    "affiliate deals Philippines",
    "discount products Philippines",
    "sulit finds",
    "budget finds Philippines",
    "best online shopping deals",
    "Filipino shopper guide",
    "beauty deals Philippines",
  ],
  authors: [{ name: "SulitScan PH", url: siteConfig.url }],
  creator: "SulitScan PH",
  publisher: "SulitScan PH",
  openGraph: {
    type: "website" as const,
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "SulitScan PH | Temu and Sephora Deals for Filipino Shoppers",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "SulitScan PH – Check deals before you click buy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "SulitScan PH | Temu and Sephora Deals for Filipino Shoppers",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
}
