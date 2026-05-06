# Assets Rudy Still Owes

A short batch list. Once these land, the site has everything it needs to ship. Mirrors `_knowledge/07-asset-inventory.md` §3.

> **Delete this file before production deploy.**

## Core integrations (env vars)

- [ ] **Calendly URL** — confirm slug (default placeholder: `https://calendly.com/rudygoel/audit`). Set `VITE_CALENDLY_URL` in production env.
- [ ] **GA4 measurement ID** (`G-XXXXXXXXXX`). Set `VITE_GA4_ID`. Left as default → GA4 doesn't load.
- [ ] **Meta Pixel ID** (15 digits). Set `VITE_META_PIXEL_ID`. Left as default → pixel doesn't load.
- [ ] **Email contact** — confirm `rudy@rudygoel.com` (currently hardcoded in footer + final CTA soft link).
- [ ] **Confirmed social URLs** — Instagram, LinkedIn, TikTok, YouTube. Currently using `rudygoel` handle on each; replace if any differ.

## Imagery

- [ ] **Open Graph card** — 1200×630 PNG at `public/og.png`. Spec in `_knowledge/02-design-system.md` §10.
- [ ] **Apple touch icon** — 180×180 PNG at `public/apple-touch-icon.png`.
- [ ] **Hero/about portrait** — editorial 4:5 of Rudy, low-saturation, warm shadow tones. Replaces the IG-export currently at `assets/images/rudy-portrait.jpeg`.

## Testimonials

- [ ] **Matthew Volkwyn video file** — MP4 H.264, 1080p, 16:9, ≤ 50 MB. Drop in `assets/testimonials/matthew-volkwyn.mp4` and update `src` in `src/data/proof.ts`.
- [ ] **Matthew Volkwyn poster (16:9)** — current poster is ~1:1; re-export at 1920×1080 to replace `assets/testimonials/matthew-volkwyn-video-poster.jpg`.
- [ ] **1–2 additional video testimonials** — same spec.
- [ ] **3–6 written testimonials** — each = headshot 200×200 + full name + role/business + 60–250 word quote.
  - 2 already drafted in `src/data/proof.ts`: Joel Edgley, Jose Williams (need their headshots).
  - Slots open for 1–4 more.

## Client roster (logos optional)

The named-clients block reads as text only by default. Add logos to upgrade. Format: SVG preferred, transparent background, monochrome-friendly. Drop in `assets/clients/`, then set `logo` on the matching client in `src/data/proof.ts`.

- [ ] Byron Dempsey — Driven Young / Founders Retreat
- [ ] Kishan Bodalia — DJ Accelerator / Bodalia Academy
- [ ] Mike Fox — Lone Wolf Unleashed
- [ ] Rupert Bryce — Performance Strategies
- [ ] Terrence — Broadcast retainers

## Results / case-study numbers

- [ ] **3–6 stat tiles** — each = a number ≤ 6 chars (e.g. "47%", "$15K", "3.2×") + a 60-char-or-less caption naming the client/context. Currently rendered as `[bracketed]` placeholders in `src/data/proof.ts`.

## Selected writing

- [ ] **3–5 LinkedIn post excerpts** — 60–80 words each + URL. Replace placeholder copy in `src/data/proof.ts` → `writingPosts`.
- [ ] **1 Instagram embed URL** — public IG post URL. Set `instagramEmbedUrl` in `src/data/proof.ts` (currently `null` so the IG tile doesn't render).

## Final copy passes

- [ ] **About-Me copy** — Rudy's pass on the 200–400-word block in `index.html` §SECTION 8. The placeholder draft is decent but his voice will sharpen it.
- [ ] **FAQ refinements** — the 6 questions in `index.html` §SECTION 9 are placeholder-quality; let Rudy retune tone.
- [ ] **"02 SPOTS / Q3" scarcity line** — manually update text in hero + final CTA when capacity changes (no JS counter; intentional).

---

## How to deliver

Drop everything into a single Dropbox / Google Drive folder named `rudy-assets-<date>`, share with the builder. The builder will:

1. Sort into `assets/images/`, `assets/testimonials/`, `assets/clients/` per the structure already in place.
2. Optimise (AVIF + WebP for photos, SVGO for SVGs, pngquant for PNGs).
3. Update `src/data/proof.ts` with new entries.
4. Replace `[bracketed]` placeholders in `index.html` and `proof.ts`.

Until the assets land, the site renders cleanly with `[brackets]` showing — that's a deliberate live placeholder, not a bug.
