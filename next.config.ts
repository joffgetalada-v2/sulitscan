import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Sephora PH product images (Involve Asia datafeed)
      { protocol: "http",  hostname: "sephora.i.adx.io" },
      { protocol: "https", hostname: "sephora.i.adx.io" },
      // Temu product images
      { protocol: "https", hostname: "aimg.kwcdn.com" },
      { protocol: "https", hostname: "img.kwcdn.com" },
      // Shopee product images
      { protocol: "https", hostname: "cf.shopee.ph" },
      // Lazada / Alicdn product images
      { protocol: "https", hostname: "ph-live.slatic.net" },
      { protocol: "https", hostname: "sg-live.slatic.net" },
    ],
  },
}

export default nextConfig
