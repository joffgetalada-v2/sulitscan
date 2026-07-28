const ADSENSE_CLIENT_ID = /^ca-pub-\d{16}$/
const ADSENSE_PUBLISHER_ID = /^pub-\d{16}$/

export function normalizeAdSenseClientId(value?: string): string | null {
  const candidate = value?.trim()
  if (!candidate) return null

  if (ADSENSE_CLIENT_ID.test(candidate)) return candidate
  if (ADSENSE_PUBLISHER_ID.test(candidate)) return `ca-${candidate}`
  return null
}

export function toAdSensePublisherId(value?: string): string | null {
  const clientId = normalizeAdSenseClientId(value)
  return clientId ? clientId.replace(/^ca-/, "") : null
}

export function isAdSenseServingEnabled(value?: string): boolean {
  return value?.trim() === "true"
}

export interface AdSenseConfig {
  clientId: string
  publisherId: string
  servingEnabled: boolean
  scriptSrc: string | null
}

export function createAdSenseConfig(
  clientIdValue?: string,
  servingEnabledValue?: string
): AdSenseConfig | null {
  const clientId = normalizeAdSenseClientId(clientIdValue)
  if (!clientId) return null

  const publisherId = toAdSensePublisherId(clientId)
  if (!publisherId) return null

  const servingEnabled = isAdSenseServingEnabled(servingEnabledValue)
  return {
    clientId,
    publisherId,
    servingEnabled,
    scriptSrc: servingEnabled
      ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
      : null,
  }
}
