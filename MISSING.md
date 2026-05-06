# Assets Rudy Still Owes

A short batch list. Once these land, the site has everything it needs to ship.

## Core integrations

- [ ] **Calendly URL** — the exact event slug (e.g. `https://calendly.com/rudygoel/audit`). One source of truth across the site.
- [ ] **GA4 measurement ID** — `G-XXXXXXXXXX`
- [ ] **Meta Pixel ID** — 15-digit
- [ ] **Email contact** — confirm `rudy@rudygoel.com` or alternative
- [ ] **Confirmed social handles** — Instagram, LinkedIn, TikTok, YouTube full URLs

## Imagery

- [ ] **Hero/about portrait** of Rudy — editorial, 4:5 ratio, low-saturation, warm shadow tones (replaces the Instagram-export currently in place)
- [ ] **OG image** — 1200×630 PNG, see `_knowledge/02-design-system.md` §10
- [ ] **Favicon SVG** — "RG" monogram, Linen on Charcoal, 32×32
- [ ] **Apple touch icon** — 180×180 PNG

## Testimonials

- [ ] **Matthew Volkwyn video file** — MP4 H.264, 1080p, 16:9, ≤ 50MB
- [ ] **Matthew Volkwyn video poster (16:9)** — current poster is 1:1 aspect, needs a 1920×1080 export
- [ ] **1–2 additional video testimonials** — same spec
- [ ] **3–6 written testimonials** — each = headshot 200×200 + full name + role/business + 60–250 word quote
  - 2 already drafted: Joel Edgley, Jose Williams (need their headshots)
  - 1–4 more slots open for new ones

## Client roster (logos optional)

The named-clients block works as text alone. Logos are an upgrade — supply when convenient:

- [ ] Byron Dempsey — Driven Young / Founders Retreat
- [ ] Kishan Bodalia — DJ Accelerator / Bodalia Academy
- [ ] Mike Fox — Lone Wolf Unleashed
- [ ] Rupert Bryce — Performance Strategies
- [ ] Terrence — broadcast retainers

Format: SVG preferred, transparent background, monochrome-friendly.

## Results / case-study numbers

- [ ] **3–6 stat tiles** — each = a number ≤ 6 chars (e.g. "47%", "$15K", "3.2×") + a 60-char-or-less caption naming the client/context
  - Placeholder copy currently in §SECTION 6.2 of content master

## Selected writing

- [ ] **3–5 LinkedIn post excerpts** — 60–80 words each + URL to the post
- [ ] **1 Instagram embed URL** — public IG post URL

## Final copy

- [ ] **About-Me copy** — 200–400 words in Rudy's voice, replacing the placeholder draft in §SECTION 8 of content master
- [ ] **FAQ refinements** — the 6 questions in §SECTION 9 are placeholder; Rudy's pass on tone

---

## How to deliver

Drop everything into a single Dropbox / Google Drive folder named `rudy-assets-<date>`, share the link with the builder. The builder will:

1. Sort into `assets/images/`, `assets/testimonials/`, `assets/clients/` per the structure already in place.
2. Run them through the optimisation pipeline (`_knowledge/07-asset-inventory.md` §5).
3. Update `src/data/proof.ts` with new entries.
4. Replace `[bracketed]` placeholders in HTML with Rudy's final copy.

Until everything lands, the site can render with `[brackets]` visible — it's a live placeholder, not broken.

**Delete this file before production deploy.**
