/**
 * /ads.txt, dynamic generation.
 *
 * Set ADSENSE_PUBLISHER_ID in your environment to activate.
 * Example: ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX
 *
 * If the variable is not set, a comment-only file is returned (safe for crawlers).
 */
export function GET() {
  const publisherId = process.env.ADSENSE_PUBLISHER_ID

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : `# ads.txt, Google AdSense publisher ID not yet configured.\n# Set ADSENSE_PUBLISHER_ID environment variable to activate.\n`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
