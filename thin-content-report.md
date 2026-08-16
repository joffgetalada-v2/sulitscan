# Thin / Duplicate Content Report — SulitScan PH

**Date:** August 16, 2026
**Scope:** All 169 live deal pages (deals with an active platform + product image, per `isPublicDeal()` in `src/data/deals.ts`)

## Summary

| Finding | Pages affected |
|---|---|
| Live deal pages scanned | **169** |
| Pages sharing an **identical** `reason` string with at least one other page (8 template strings) | **44** |
| Pages whose `reason` mentions price/discount and therefore currently renders as the **identical** fallback sentence "Explore {Category} options from {Platform} and review the live listing…" (all deals are in "reference" freshness status as of this audit) | **94** |
| Meta titles generated from a single template (`{Title} – {Platform} \| SulitScan PH`) | 169 |
| Meta descriptions generated from a single template (`{Title} on {Platform}: Practical {category} pick… Confirm current price…`) | 169 |

**Why this matters:** every deal page shares the same page skeleton (checklist, "Best for / Skip if", disclaimers). The only page-unique prose was the 1–2 sentence `reason` — and for 44 pages even that was identical boilerplate, while 94 more collapse to one identical fallback sentence whenever a deal ages past 14 days. To Google, the catalog looks like ~169 near-duplicate pages with templated titles and descriptions. This is the classic "thin/doorway content" profile that keeps a 2-month-old affiliate site out of the index.

## Group A — 44 pages with identical boilerplate reasons

All 44 came from the bulk Shopee import (`scripts/_gen-shopee-deals.mjs`) using 8 template strings.

### Template 1 — "Practical home and organization pick from a Shopee PH Preferred seller…" (9 pages)
- tanle-silicone-foldable-water-bottle-is-leak-proof-a-702052 ★ rewritten
- tumbler-hot-and-cold-thermos-double-wall-vacuum-insu-634012 ★ rewritten
- triangle-coat-rack-floor-bedroom-multi-function-clot-181276 ★ rewritten
- flip-top-storage-box-stackable-storage-box-plastic-118125
- stainless-steel-thermos-double-drinking-spout-handle-015031
- videveckmal-dish-brush-with-soap-dispenser-527858 ★ rewritten
- 1pctoothbrush-storage-rack-stainless-steel-toothbrus-875980
- food-grade-fresh-keeping-box-refrigerator-storage-bo-443059 ★ rewritten
- toilet-paper-towel-rack-toilet-paper-box-storage-rac-281926 ★ rewritten

### Template 2 — "Practical desk and tech accessory pick from a Shopee PH marketplace seller…" (9 pages)
- ugreen-s5wireless-earphone-case-hitune-s5cute-earpho-744890
- smilee-three-legged-bracket-ring-light-camera-portab-201242
- yamy-projector-stand-tripod-adjustable-universal-por-708587
- lazy-pad-phone-holder-for-cellphone-universal-190135
- camera-tripod-head-interface-conversion-screw-14-to-593850
- kfy-deformed-car-multi-function-mobile-phone-holder-820784
- shelf-phone-and-tablet-stand-for-easy-learning-onlin-920771
- otg-micro-card-reader-mini-sd-1-gb-1-package-492197
- 14-38-crab-claw-clamp-mounts-camera-accessories-camc-102559

### Template 3 — "Practical home and organization pick from a Shopee PH marketplace seller…" (7 pages)
- metal-mesh-coated-hook-style-open-basket-hanging-sto-005045
- shelves-for-shoes-9-layer-folding-multi-tier-shoe-ra-036787
- uhome-3-in1-children-lunchbag-set-lunchbaglunchboxtu-305627
- desktop-stationery-storage-box-iron-net-7-grid-pen-h-497196
- 345-layer-kitchen-organizer-storage-rack-367825
- pen-holder-student-desktop-creative-pen-bucket-fashi-517684
- acrylic-storage-box-cosmetic-storage-box-desktop-org-126639

### Template 4 — "Practical everyday fashion pick from a Shopee PH Preferred seller…" (7 pages)
- uisn-v06-womens-pu-leather-tote-bag-medium-shoulder-600118 ★ rewritten
- sy-s607-new-simple-japanese-shoulder-bag-large-capac-765230 ★ rewritten
- york-letter-embroidery-brooklyn-soft-top-baseball-ca-233350 ★ rewritten
- a02-set-womens-camisole-headband-body-hugging-form-197484 ★ rewritten
- big-bow-pearl-ribbon-hairpin-female-high-end-back-of-189941 ★ rewritten
- yoyo-stylish-womens-handbag-shoulder-bag-crossbody-b-166150
- cycling-sunglasses-outdoor-windproof-mountaineering-664776 ★ rewritten

### Template 5 — "Practical everyday fashion pick from a Shopee PH marketplace seller…" (4 pages)
- yqy-new-canvas-large-capacity-shoulder-bag-025078
- jys-womens-versatile-multi-pocket-crossbody-bag-448992
- emma-with-box-shoulder-bagsling-bag-for-women-b1617-169524
- printed-black-tote-bag-baguio-city-33x37cm-253678

### Template 6 — "Practical desk and tech accessory pick from a Shopee PH Preferred seller…" (3 pages)
- love-style-6in1-set-charger-protector-set-804547
- cellphone-tripod-camera-long-tripod-free-phone-holde-700512
- bathroom-waterproof-mobile-phone-box-touch-screen-ba-509973

### Template 7 — "Practical travel and packing pick from a Shopee PH marketplace seller…" (3 pages)
- cheznara-aesthetic-quilted-pouch-894831
- korean-travel-toiletry-bag-hanging-high-quality-wate-796289
- zipper-lock-zipper-storage-bag-zipper-travel-pouch-565597

### Template 8 — "Practical beauty pick from a Shopee PH marketplace seller…" (2 pages)
- hokkaido-blue-personal-makeup-brush-set-8-piece-647464
- makeup-brush-holder-with-beads-017149

## Group B — 94 pages that collapse to the identical freshness fallback

`getFreshnessSafeReason()` (src/lib/deal-freshness.ts) replaces any price-mentioning `reason` with the same one-sentence fallback once a deal leaves "current" status (14 days). Every live deal was last checked in June 2026, so as of this audit **94 pages render the same sentence** as their only unique prose. These pages have real hand-written reasons underneath — the content resurfaces if `lastChecked` is refreshed — but until then they are effectively duplicates of each other.

## Fix applied (August 2026)

1. **Top 40 deals rewritten** (marked ★ above, plus the strongest Temu/Sephora pages — full list in `AUDIT-REPORT.md`). Each now has:
   - a unique 100–200-word `description` (what it is, who it's for, what to check before buying, why the SulitScore) rendered on the page as "Editor's notes";
   - a hand-written, unique `seoTitle` and `seoDescription` (no shared template);
   - a unique short `reason` where it previously used a Group A template string.
2. **Automatic noindex for thin pages:** deal pages are now indexed **only when they carry a unique `description`** (`isDealIndexable()` in `src/lib/deal-seo.ts`). The remaining 129 pages stay fully browsable and linked, but send `noindex` to Google and are excluded from the sitemap so they stop diluting site quality.
   - **To re-index any page later:** write a unique `description` for that deal — indexing and sitemap inclusion switch back on automatically.
   - **To force-exclude a page that has a description:** set `noindex: true` on the deal.
3. **Prevention:** `deal-content-guide.md` documents the content checklist for new listings; new deals without a description default to noindex, so bulk imports can never re-create this problem.
