import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remotion uses browser APIs — exclude from server-side bundling
  serverExternalPackages: ["remotion", "@remotion/player"],
}

export default nextConfig
