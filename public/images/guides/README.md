# Guide Images

Blog cards and guide heroes use the image path declared in `src/data/posts.ts`. Posts without a
`coverImage` declaration use their gradient placeholder; a declared image path is expected to
resolve to a real asset.

## Weekly guide banners generated 2026-07-24

| Filename | Guide concept |
|---|---|
| `online-shoe-size-guide-philippines.jpg` | Plain shoes with unnumbered measurement and foot-outline cues |
| `unboxing-video-evidence-online-shopping-philippines.jpg` | Parcel documentation with a recording phone and obscured address area |
| `travel-packing-organizers-philippines-buying-guide.jpg` | Open carry-on with packing cubes, pouches, and a toiletry organizer |
| `first-apartment-essentials-under-1000-philippines.jpg` | Practical storage, lighting, cookware, and cleaning basics |
| `power-bank-buying-guide-philippines.jpg` | Generic power bank, USB-C cables, phone, pouch, and abstract capacity cues |

These five original, brand-neutral banners were generated separately with OpenAI's built-in image
generator. The selected PNG outputs were normalized to 1600x900 JPEG at quality 88 using
high-quality bicubic resizing. Prompts prohibited logos, trademarks, watermarks, fake interfaces,
certification marks, and promotional text. Each final JPEG was visually inspected at original
detail before commit.

Earlier core guide assets in this folder include `fake-discount-check-guide.jpg`,
`voucher-shipping-return-checklist.jpg`, and `final-price-checkout-guide.jpg`.
