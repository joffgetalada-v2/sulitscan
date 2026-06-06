export const siteConfig = {
  name: "SulitScan PH",
  shortName: "SulitScan",
  tagline: "Find deals that are actually sulit.",
  description:
    "Find deals that are actually sulit. SulitScan PH helps Filipino shoppers discover curated online discounts, sale products, seller trust signals, and smart shopping guides.",
  url: "https://sulitscan.com",
  ogImage: "https://sulitscan.com/og-image.png",
  locale: "en_PH",
  twitterHandle: "@sulitscanph",
}

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SulitScan PH | Verified Online Deals, Discounts, and Shopping Guides",
    template: "%s | SulitScan PH",
  },
  description: siteConfig.description,
  keywords: [
    "online deals Philippines",
    "Shopee deals Philippines",
    "Lazada deals Philippines",
    "affiliate deals Philippines",
    "discount products Philippines",
    "sulit finds",
    "budget finds Philippines",
    "best online shopping deals",
    "Temu finds Philippines",
    "AliExpress finds Philippines",
    "Filipino shopper guide",
    "sale Philippines",
  ],
  authors: [{ name: "SulitScan PH", url: siteConfig.url }],
  creator: "SulitScan PH",
  publisher: "SulitScan PH",
  openGraph: {
    type: "website" as const,
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "SulitScan PH | Verified Online Deals, Discounts, and Shopping Guides",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "SulitScan PH – Find deals that are actually sulit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "SulitScan PH | Verified Online Deals, Discounts, and Shopping Guides",
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
