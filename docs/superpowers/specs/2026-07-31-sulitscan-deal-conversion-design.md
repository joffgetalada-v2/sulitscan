# SulitScan Deal Discovery and Attribution Design

**Date:** 2026-07-31

## Problem

Two measurable gaps remain on the affiliate path:

1. Deal listing cards bypass Next image optimization even though their Shopee domains are configured. A sampled live asset was about 604 KB from the source CDN and about 16 KB through the existing `/_next/image` path. The first four cards are also eager/high-priority, increasing initial transfer contention.
2. Every product click from `/deals` currently produces the same affiliate analytics dimensions. SulitScan can see that Shopee was clicked but not which deal attracted the click, making it difficult to improve merchandising around commission intent.

Final review found two Important extensions of those gaps:

3. Category and store entity grids still prioritized their first four cards and did not pass a card position into affiliate analytics, so their transfer policy and attribution differed from `/deals`.
4. The homepage scanner used a responsive `fill` image without a bounded `sizes` value, and `Hero` disabled its server rendering. That combination could select an unnecessarily large source and kept the scanner image/preload out of the initial server HTML.

## Design

Remove `unoptimized` from deal-card and homepage scanner images so the configured Next optimizer can resize and compress them. Only the first listing card receives eager/high priority; all remaining cards use lazy loading. Remote image allow-listing is unchanged.

Apply that one-priority policy and 1-based position contract to every `EntityDeals` category/store grid. Give the scanner its exact responsive bound, `(max-width: 480px) calc(100vw - 2rem), 448px`, and render it through a normal static import. `DealScannerVisual` remains a Client Component, preserving its Framer Motion transitions, interval, and slide controls while allowing the initial image and preload to be emitted during server rendering.

Extend `ExternalAffiliateLink` with optional privacy-safe `offerId` and numeric `position`. Include only defined values in the Vercel Analytics event. Deal cards pass the public deal slug and 1-based listing position; partner banners pass the public banner ID. No product title, destination URL, user data, or query string is tracked.

## Verification

- Node/browser tests prove a deal listing image is served through `/_next/image`, the first card is prioritized, and subsequent cards are lazy.
- Category and store browser coverage proves entity images load successfully with the same first-only priority policy and that a second-card click emits its public slug with `position: 2` and no private fields.
- Homepage coverage proves the scanner uses the optimizer and exact `sizes`, loads with nonzero natural width, and has a scanner-specific optimized image/preload pair in the server HTML.
- Existing affiliate analytics tests are extended to assert deal/banner identifiers and position without changing outbound navigation behavior.
- Full release and browser gates must pass before committing.
