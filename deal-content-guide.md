# Deal Content Guide — SulitScan PH

How to add a new deal so it starts life with unique content and never re-creates the thin-content problem Google punished us for. Follow this for every new listing.

## The rule that enforces itself

A deal page is **only indexed by Google when it has a `description`** (see `isDealIndexable()` in `src/lib/deal-seo.ts`). A deal added without one still works for visitors, but it sends `noindex` and stays out of the sitemap automatically. So the workflow is:

1. Bulk-import or draft the deal data (title, prices, image, affiliate link).
2. Write the four content fields below → the page becomes indexable on its own.
3. Never remove this gate to "index everything" — 169 templated pages indexed is worse than 40 good ones.

## The four content fields

### 1. `reason` (1–2 sentences, shown on cards and the deal page)

- Must be specific to this product — never reuse a sentence from another deal.
- **Do not mention prices, percentages, or the words "price / discount / save / cost"** unless you will re-check the deal every 14 days. Once a deal ages past "current" freshness, price-mentioning reasons get replaced by a generic fallback sentence (see `getFreshnessSafeReason`), which re-creates duplicate content.
- Formula that works: *what it is + the one thing to check before buying.*

### 2. `description` (100–200 words, 2 paragraphs, the index gate)

Paragraph 1 — the product and its person:
- What the product actually is, in plain words.
- Who specifically it's for (condo renter, bike commuter, student with a shared fridge…). Name the Filipino context when it's real (wet bathrooms, jeepney commutes, bukbok, brownouts) — never as decoration.

Paragraph 2 — the honest buying advice:
- 2–3 concrete things to check on the live listing: size chart in cm, lid seal reviews, mounting type, seller rating, shipping realism.
- What the product is *not* (budget nonstick wears out; "water-resistant" watch means rain, not swimming). Naming the trade-off is what makes the page trustworthy.
- Why it earned its SulitScore, tied to the above.

Style rules:
- Write like the laptop-desk and luggage deals: practical, warm, zero hype. No "amazing", no "must-have", no exclamation marks.
- No invented specifics — no review counts, materials, or measurements you didn't see on the listing.
- Avoid exact peso claims (prices drift; the page already shows the price with a disclaimer).
- Escape rules for `deals.ts`: keep it one double-quoted string, `\n\n` between paragraphs, **no `{`/`}` characters and no straight `"` inside** (they break `check-product-quality.mjs` parsing) — use apostrophes and rephrase around quotes.

### 3. `seoTitle` (≤ 50 chars; " | SulitScan PH" is appended automatically)

- Unique across the site; vary the structure — don't settle into a new template.
- Lead with what a shopper would search for, not the listing's keyword-stuffed title.
- Good: `Wall Toilet Paper Holder w/ Shelf – Shopee PH` · Bad: `Toilet Paper Towel Rack Toilet Paper Box Storage…`

### 4. `seoDescription` (≤ 160 chars)

- One sentence of what it is + one hook about the check that matters ("Why mounting type is the make-or-break check…").
- Never copy another deal's pattern word-for-word. Read the last 3 you wrote before writing a new one.

## Pre-publish checklist

- [ ] `reason` unique, no price-trigger words
- [ ] `description` 100–200 words, 2 paragraphs, at least two concrete pre-purchase checks, one honest limitation
- [ ] `seoTitle` unique, ≤ 50 chars before suffix
- [ ] `seoDescription` unique, ≤ 160 chars
- [ ] No `{ } "` characters inside any of the strings
- [ ] `lastChecked` uses a parseable format (`Checked June 27, 2026` or `Affiliate datafeed price, June 2026. Confirm current price on <Platform> before buying.`)
- [ ] `npm run check:product-quality` passes
- [ ] Bonus: does the page answer "should *I* buy this?" for a specific person? If it reads like it could describe five other products, rewrite paragraph 1.

## Maintenance rhythm

- Re-check prices of indexed (described) deals every ≤ 14 days to keep "current" freshness; update `lastChecked` when you do.
- When you have writing time, promote the best non-indexed deals by writing their four fields — highest SulitScore and most-clicked first (see Vercel Analytics `affiliate_click` events by `offerId`).
- When a deal dies (delisted, price permanently up), let freshness expire it or remove it — don't leave zombie pages.
