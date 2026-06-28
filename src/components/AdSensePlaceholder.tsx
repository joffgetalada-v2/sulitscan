"use client"

/**
 * AdSense Placeholder, disabled by default.
 *
 * To enable AdSense:
 * 1. Set NEXT_PUBLIC_ADSENSE_CLIENT_ID in your .env.local and in Vercel Environment Variables.
 * 2. Add the AdSense script to src/app/layout.tsx head.
 * 3. Replace the placeholder div below with the real adsbygoogle unit.
 *
 * Example .env.local:
 *   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
 *
 * AdSense placement rules (do NOT violate):
 * - Do not place ads beside fake buttons, arrows, or misleading CTAs.
 * - Do not say "click ads to support us."
 * - Do not place ads that could be confused with affiliate deal CTAs.
 * - Keep affiliate CTA buttons clearly separate from any ad units.
 */
export function AdSensePlaceholder({ slot }: { slot?: string }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  if (!clientId) return null

  // TODO: Replace with real adsbygoogle ins element once AdSense is approved.
  // Example:
  // <ins
  //   className="adsbygoogle"
  //   style={{ display: "block" }}
  //   data-ad-client={clientId}
  //   data-ad-slot={slot ?? ""}
  //   data-ad-format="auto"
  //   data-full-width-responsive="true"
  // />

  return (
    <div
      className="w-full h-24 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center"
      aria-hidden="true"
      data-ad-slot={slot}
    >
      <span className="text-xs text-slate-300">Ad placeholder, not live</span>
    </div>
  )
}
