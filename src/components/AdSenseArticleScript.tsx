import Script from "next/script"
import { createAdSenseConfig } from "@/lib/adsense"

/**
 * Ad serving is deliberately limited to full editorial articles. Keep the
 * separate serving flag off during review and until a Google-certified CMP is
 * configured for regions where consent is required.
 */
export default function AdSenseArticleScript() {
  const config = createAdSenseConfig(
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
    process.env.NEXT_PUBLIC_ADSENSE_ADS_ENABLED
  )
  if (!config?.scriptSrc) return null

  return (
    <Script
      id="google-adsense-article-script"
      src={config.scriptSrc}
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
    />
  )
}
