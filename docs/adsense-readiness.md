# Google AdSense Readiness Checklist

SulitScan can prepare the site for review, but Google alone decides whether a site is approved. Never paste a sample or another publisher's ID.

## Before requesting review

1. In AdSense, add sulitscan.com under Sites and copy the real client ID in the form ca-pub-0000000000000000.
2. Add NEXT_PUBLIC_ADSENSE_CLIENT_ID in Vercel for Production, Preview, and Development, then redeploy. Public IDs are identifiers, not secrets.
3. Leave NEXT_PUBLIC_ADSENSE_ADS_ENABLED unset or false during ownership verification and policy review.
4. Confirm the production homepage contains the google-adsense-account meta tag with the real ca-pub ID.
5. Confirm https://sulitscan.com/ads.txt returns the Google DIRECT record with the same 16 digits.
6. In AdSense, click Verify and then Request review. Reviews may take a few days and sometimes two to four weeks.

## Before enabling ads after approval

1. Wait until the site status is Ready.
2. In AdSense Privacy & messaging, configure a Google-certified consent management platform for the EEA, United Kingdom, and Switzerland. Use the current IAB TCF version required by Google.
3. In the AdSense dashboard, turn on Auto ads for sulitscan.com and start with a low ad load. The site code only loads the AdSense library; Auto ads must also be enabled in AdSense before Google can place ads.
4. Do not place ads on deals, categories, stores, tools, legal pages, or navigation-only pages. SulitScan intentionally limits the integration to full blog articles.
5. Set NEXT_PUBLIC_ADSENSE_ADS_ENABLED=true in Production and redeploy. This loads the AdSense script only on /blog/[slug] article pages.
6. Check at least one mobile and one desktop article. Ads must not be confused with affiliate buttons, navigation, or download controls.
7. Never ask visitors to click ads. Do not place more ads or paid promotions than publisher content.

## Ongoing checks

- Recheck ads.txt after every publisher-ID change.
- Monitor AdSense Policy center, Core Web Vitals, consent-message coverage, and article engagement.
- Keep the privacy, cookie, editorial, and affiliate disclosure pages current.
- Review low-traffic or outdated articles before increasing ad load.
- Keep www.sulitscan.com redirected permanently to the canonical apex domain in Vercel.
