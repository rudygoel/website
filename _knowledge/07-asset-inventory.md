# 07 — Asset Inventory

Every file in `assets/`, what it's for, and what's still missing.

## 1. Files already prepared

All files have been copied from the live-site scrape into `assets/` with clean names. The originals live in `Rudy Goel _ R. Goel_files/` (do not reference those — they're cluttered Wix filenames).

### `assets/images/` — brand and hero imagery

| File | Original | What it's for | Notes |
|---|---|---|---|
| `rudy-logo-headshot.png` | `Rudy_edited.png` | OLD circular face logo | **Do not use as the new wordmark.** Available if useful for an old-site comparison or fallback avatar. |
| `rudy-portrait.jpeg` | `475835447_…n.jpeg` | About-section portrait | 325×407, Instagram-named export. Crop to 4:5 for §SECTION 8. Apply subtle grain in CSS. |
| `rudy-avatar-small.png` | `87e84b_8b74…mv2.png` | Small avatar / accent | 80×80. Useful for footer or testimonial reply attribution. |
| `frequentis-blur.png` | `FrequentisBlur.png` | Decorative blur of Rudy's previous employer (Frequentis) | The old hero used this — the redesign **does not** need it. Keep file in case Rudy wants a "left engineering" visual moment in §SECTION 8. |
| `hero-video-poster.jpg` | `87e84b_fe5d4…f000.jpg` | Old-site hero video poster | 259×317. Probably won't be used in v1 unless Rudy supplies a hero video. Keep on file. |

### `assets/icons/` — social icons

| File | Channel | Notes |
|---|---|---|
| `instagram.png` | Instagram | 24×24 raster. **Replace with clean monochrome SVG at 20×20.** |
| `linkedin.png` | LinkedIn | Same. |
| `tiktok.png` | TikTok | Same. |
| `youtube.png` | YouTube | Same. |

> Builder action: replace these PNGs with hand-built SVGs of the official wordmark/glyph for each channel. Use `currentColor` fill so the icon inherits Linen / Tobacco from CSS. Don't use coloured Instagram logo gradients — keep monochrome.

### `assets/press-logos/` — "featured in" strip

| File | Outlet |
|---|---|
| `yahoo-finance.png` | Yahoo Finance |
| `nbc.png` | NBC |
| `forbes.png` | Forbes |
| `daily-mail.png` | Daily Mail |
| `kivodaily.png` | KivoDaily |
| `sam-robson-1.png` | Sam Robson |
| `sam-robson-2.png` | Sam Robson (alt) |

> All 6 (use `sam-robson-1.png`, drop the duplicate) render in §SECTION 6.4 press strip. Apply CSS `filter: grayscale(1) brightness(0.9)` and 60% opacity by default, full opacity on hover. See `05-component-library.md` §11.

### `assets/testimonials/` — testimonial assets

| File | What it's for | Notes |
|---|---|---|
| `5-star-rating.png` | 5-star rating graphic from old Wix site | **Don't render this image.** Use a 5-glyph star row in CSS or inline SVG, Tobacco fill. The PNG is for reference only. |
| `matthew-volkwyn-headshot.png` | Matthew Volkwyn portrait | 283×283. Use as the avatar in his testimonial card. Crop to 1:1, CSS `border-radius: 999px`. |
| `matthew-volkwyn-video-poster.jpg` | Matthew's "copy review" video poster | 380×371. Aspect needs to be 16:9 — Rudy will need to re-export, OR the video player letterboxes. Document this in `_knowledge/MISSING.md` (see §3). |
| `finedge-media-logo.png` | FINEDGE Media brand mark | Optional — render next to Joel Edgley's testimonial as small mark, `height: 24px`, Linen 60% opacity. |

### `assets/clients/` — client logos (empty for now)

This folder is reserved. As Rudy supplies logos for Driven Young, DJ Accelerator, Lone Wolf Unleashed, Performance Strategies, place them here named `byron-dempsey.svg`, `kishan-bodalia.svg`, etc.

The named-clients block in §SECTION 6.1 doesn't require logos — it works as text only. Logos are an optional upgrade.

---

## 2. Asset technical guidelines

| Type | Format | Compression |
|---|---|---|
| Photos (Rudy, testimonial headshots) | AVIF primary + WebP fallback + JPEG legacy | AVIF q=60, WebP q=80 |
| Logos (clients, press) | SVG if possible, otherwise PNG with transparent bg | SVGO; PNG via pngquant ~85% |
| Icons (social, UI glyphs) | Inline SVG only | hand-written, single path where possible |
| Open Graph card | PNG 1200×630 | optimized to ≤ 150 KB |
| Favicon | SVG primary + 32×32 PNG fallback | — |

Always supply explicit `width` and `height` attributes on `<img>` to prevent layout shift. Use `loading="lazy"` for everything below the fold; `loading="eager"` and `fetchpriority="high"` only on the hero portrait if it's above-fold.

---

## 3. What's missing (Rudy will supply)

A short list of assets the site needs that aren't in this folder yet. Surface these in a top-level `MISSING.md` so Rudy can knock them out in one batch.

| Asset | Spec | Used in |
|---|---|---|
| **Open Graph card** | 1200×630 PNG, see `02-design-system.md` §10 | OG meta |
| **Favicon SVG** | "RG" monogram, Linen on Charcoal | Browser tab |
| **Apple touch icon** | 180×180 PNG, rounded mask handled by iOS | iOS home screen |
| **Hero portrait (preferred)** | Editorial portrait of Rudy, 4:5, low-saturation, warm shadow tones | About §8 (replacing the IG-export currently there) |
| **Matthew Volkwyn video file** | MP4 H.264, 1080p, 16:9, ≤ 50MB | Featured testimonial §6.3 |
| **Matthew Volkwyn video poster (16:9)** | Re-export at 1920×1080 | Featured testimonial §6.3 |
| **Additional video testimonials (1–2)** | Same spec as Matthew's | Testimonial row §6.3 |
| **3–6 written testimonials** | Headshot 200×200 + name + role + 60–120 word quote | Testimonial grid §6.3 |
| **Client logos (5)** | SVG preferred, transparent bg | Client roster §6.1 |
| **3–6 results stats** | Number + 1-line caption | Stats tiles §6.2 |
| **3–5 LinkedIn post excerpts** | 60–80 words each + post URL | Selected writing §7 |
| **1 Instagram embed URL** | Public IG post URL | Selected writing §7 |
| **Calendly booking URL** | The actual `calendly.com/rudygoel/audit` URL | All CTA buttons |
| **Final About-Me copy** | 200–400 words in Rudy's voice | About §8 (placeholder copy in `03-content-master.md` is a starter) |
| **Final email address** | `rudy@rudygoel.com` (or whatever) | Footer + final CTA soft link |
| **Social handles** | Confirmed URLs for IG / LinkedIn / TikTok / YouTube | Nav + footer + JSON-LD `sameAs` |

The builder should render the site with placeholder values for these, marked clearly with `[brackets]` in the rendered text, so Rudy can do a single pass replacement.

---

## 4. Image rename map (full audit trail)

For traceability between the messy Wix names and the clean asset folder. Keep this map until v1 ships.

| Old (Wix) name | New (clean) name |
|---|---|
| `Rudy_edited.png` | `images/rudy-logo-headshot.png` |
| `475835447_17892304533167632_6790069126854986577_n.jpeg` | `images/rudy-portrait.jpeg` |
| `87e84b_8b74ccc6ef7a44ec8561c5cfeb1ee0a7~mv2.png` | `images/rudy-avatar-small.png` |
| `FrequentisBlur.png` | `images/frequentis-blur.png` |
| `87e84b_fe5d4c56c1f64f12bd58d9eb3cab23ccf000.jpg` | `images/hero-video-poster.jpg` |
| `01c3aff52f2a4dffa526d7a9843d46ea.png` | `icons/instagram.png` |
| `11062b_72c275822d4344358ee379f14e7e115f~mv2.png` | `icons/linkedin.png` |
| `11062b_7fc95bac711041dcb9691b6a09192a84~mv2.png` | `icons/tiktok.png` |
| `11062b_6fc54c8957474101ba6e80b01907ae50~mv2.png` | `icons/youtube.png` |
| `87e84b_2f0a4fd11d46432aa3969aee69af1acf~mv2.png` | `press-logos/yahoo-finance.png` |
| `87e84b_120cdac57c0c460c9119100d0d0fd206~mv2.png` | `press-logos/nbc.png` |
| `87e84b_597378d628cc492fbd20133ea1327f27~mv2.png` | `press-logos/kivodaily.png` |
| `87e84b_3903f9f79d89468ea7f8db8e2564147b~mv2.png` | `press-logos/sam-robson-1.png` |
| `87e84b_11bed42b525c4096838622b3844061b8~mv2.png` | `press-logos/sam-robson-2.png` |
| `87e84b_878a001e1f19436f9575ee0e8e9f1a6d~mv2.png` | `press-logos/forbes.png` |
| `87e84b_a44c6988e5c240439b9e6b9d4653d9fa~mv2.png` | `press-logos/daily-mail.png` |
| `5 Star (1).png` | `testimonials/5-star-rating.png` (reference only) |
| `87e84b_2c49974a22694a6aafab5748db2f11e3~mv2.png` | `testimonials/matthew-volkwyn-headshot.png` |
| `87e84b_c2e853761e1c4fd298026657074cc00df000.jpg` | `testimonials/matthew-volkwyn-video-poster.jpg` |
| `Layer-01-e1739601013736-2.png` | `testimonials/finedge-media-logo.png` |

---

## 5. Optimisation pipeline (recommended)

After Rudy supplies missing assets, run them through:

```bash
# raster photos
cwebp -q 80 input.jpg -o output.webp
avifenc -j 4 -s 6 -y 420 input.jpg output.avif

# PNGs
pngquant --quality=70-90 --force --output input.png input.png
svgo -i input.svg
```

A `package.json` script `assets:optimize` should automate this in the production repo.
