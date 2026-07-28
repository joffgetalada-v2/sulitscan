import { createAdSenseConfig } from "@/lib/adsense"

/**
 * Google supports this meta tag as a cookie-free site-ownership verification
 * method. It is emitted only when a real publisher ID is configured.
 */
export default function AdSenseSiteVerification() {
  const config = createAdSenseConfig(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID)
  if (!config) return null

  return <meta name="google-adsense-account" content={config.clientId} />
}
