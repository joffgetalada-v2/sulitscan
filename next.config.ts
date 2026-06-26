import type { NextConfig } from "next"

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  },
  images: {
    remotePatterns: [
      // Temu product images
      { protocol: "https", hostname: "aimg.kwcdn.com" },
      { protocol: "https", hostname: "img.kwcdn.com" },
      // Lookfantastic / CultBeauty CDN
      { protocol: "https", hostname: "static.thcdn.com" },
      // Sunday Riley
      { protocol: "https", hostname: "sundayriley.com" },
      // Mario Badescu
      { protocol: "https", hostname: "www.mariobadescu.com" },
      // Nordstrom Media
      { protocol: "https", hostname: "n.nordstrommedia.com" },
      // Apothecarie
      { protocol: "https", hostname: "www.apothecarie.com" },
      // The Detox Market
      { protocol: "https", hostname: "www.thedetoxmarket.com" },
      // Herbivore Botanicals JP
      { protocol: "https", hostname: "herbivorebotanicals.jp" },
      // Voo Beauty
      { protocol: "https", hostname: "voobeauty.com" },
      // SkinSafe Products CDN
      { protocol: "https", hostname: "cdn1.skinsafeproducts.com" },
      // Sigma Beauty
      { protocol: "https", hostname: "sigmabeauty.com" },
      // ZOEVA Cosmetics
      { protocol: "https", hostname: "zoevacosmetics.com" },
      // Ulta Beauty Media
      { protocol: "https", hostname: "media.ulta.com" },
      // Pony Brushes
      { protocol: "https", hostname: "ponybrushes.com" },
      // Evecare
      { protocol: "https", hostname: "evecare.com" },
      // SK-II / general Shopify CDN
      { protocol: "https", hostname: "*.myshopify.com" },
      // Shopee product images (affiliate datafeed)
      { protocol: "https", hostname: "cf.shopee.ph" },
      { protocol: "https", hostname: "down-ph.img.susercontent.com" },
    ],
  },
}

export default nextConfig
