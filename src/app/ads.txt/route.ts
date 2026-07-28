import { toAdSensePublisherId } from "@/lib/adsense"

/** Dynamic ads.txt generation without ever publishing a placeholder ID. */
export function GET() {
  const publisherId = toAdSensePublisherId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID)

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : `# Google AdSense is not configured. Add the real publisher ID in Vercel before requesting review.\n`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
