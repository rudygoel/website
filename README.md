# Rudy Goel — Website Rebuild

Staging area for the rebuild of [www.rudygoel.com](https://www.rudygoel.com). This folder is what you copy to the production repo before letting the AI cook.

## What's here

```
rudy website/
├── README.md                       ← you are here
├── _knowledge/                     ← AI knowledge pack — DELETE BEFORE PRODUCTION DEPLOY
│   ├── 00-START-HERE.md            ← entry point (the AI reads this first)
│   ├── 01-brand-identity.md
│   ├── 02-design-system.md
│   ├── 03-content-master.md
│   ├── 04-motion-and-animation.md
│   ├── 05-component-library.md
│   ├── 06-page-architecture.md
│   ├── 07-asset-inventory.md
│   ├── 08-integrations.md
│   ├── 09-testimonials-and-proof.md
│   ├── 10-tech-stack.md
│   ├── 11-do-and-dont.md
│   ├── 12-cook-prompt.md            ← the master prompt to feed Claude Code
│   ├── tokens.css                   ← drop-in CSS variable file
│   └── references/
│       ├── brand-spec-v1.md         ← original 600-line brand spec
│       ├── website-brief-handover.md← original product brief from Rudy
│       ├── live-site-content.md     ← audit of current rudygoel.com
│       └── demo-analyses.md         ← writeups of demo1/2/3 references
│
├── assets/                         ← production image assets (keep)
│   ├── images/                     (rudy-portrait, rudy-logo-headshot, etc.)
│   ├── icons/                      (instagram, linkedin, tiktok, youtube)
│   ├── press-logos/                (yahoo-finance, nbc, forbes, etc.)
│   ├── testimonials/               (matthew-volkwyn-headshot + video poster, finedge-media-logo)
│   └── clients/                    (empty — Rudy will supply)
│
├── Rudy Goel _ R. Goel.html        ← live-site scrape (reference only)
├── Rudy Goel _ R. Goel_files/      ← live-site assets (reference only)
├── [C] Website Brief — Designer Handover.md  ← original brief
├── [C] Website Mockup v1.html      ← rough mockup
├── rudy-combinations.html          ← old experimentation
├── demo1/                          ← Juan Mora vibe inspiration
├── demo2/                          ← Matthew Volkwyn (avoid)
├── demo3/                          ← Cameron Cruz simplicity inspiration
└── vibes/                          ← original brand-spec / tokens / system files
```

## How to use this

### Path A — Hand it to Claude Code (recommended)

1. Initialise a fresh git repo for the production site.
2. Copy `_knowledge/` and `assets/` into the new repo root.
3. Open the new repo in Claude Code.
4. Open `_knowledge/12-cook-prompt.md`, copy the prompt between the markers, paste into Claude.
5. Confirm the build plan it summarises back, then let it cook.
6. After the site is shipped: **delete `_knowledge/`** before the production deploy and verify nothing in `src/` imports from it.

### Path B — Hand it to a designer / dev

1. Send them this folder zipped.
2. Tell them to start at `_knowledge/00-START-HERE.md` and read top-down.
3. The brief, brand spec, content master, and motion guide all stand alone. They don't need anything outside the folder.

## What's in `_knowledge/` and why

| File | What it does |
|---|---|
| `00-START-HERE.md` | Map of the pack + 10 hard rules + ambiguity-resolution order |
| `01-brand-identity.md` | Voice, tone, banned words, what the brand IS NOT |
| `02-design-system.md` | Pine & Tobacco palette, Newsreader + Geist, spacing, layout |
| `03-content-master.md` | Final word-for-word copy for every section, ready to use |
| `04-motion-and-animation.md` | GSAP / Lenis / WebGL / hover / scroll / landing — every motion spec |
| `05-component-library.md` | Every UI component with markup + CSS + states |
| `06-page-architecture.md` | Section order, IDs, anchor map, responsive rules, SEO meta |
| `07-asset-inventory.md` | What's in `assets/`, the rename map, what's still missing |
| `08-integrations.md` | Calendly, GA4, Meta Pixel, OG, schema.org, sitemap |
| `09-testimonials-and-proof.md` | Data shape + slot rules for video + written testimonials |
| `10-tech-stack.md` | Vite + TS + plain HTML/CSS recommendation, folder structure |
| `11-do-and-dont.md` | Single-page printable launch checklist |
| `12-cook-prompt.md` | The master prompt (copy/paste into Claude Code) |
| `tokens.css` | Drop-in CSS variable file |
| `references/` | Original brief, original brand spec, live-site audit, demo writeups |

## What Rudy still owes

A short list, mirrored in `_knowledge/07-asset-inventory.md` §3. Get these to the AI / designer in one batch:

- Final Calendly URL (slug)
- Final email address (probably `rudy@rudygoel.com`)
- Confirmed social URLs (IG / LinkedIn / TikTok / YouTube handles)
- Hero/about portrait of Rudy (4:5, editorial)
- Matthew Volkwyn video file (.mp4) + 16:9 poster export
- 1–2 additional video testimonials
- 3–6 written testimonials (headshot 200×200 + name + role + 60–250 word quote)
- 5 client logos (SVG preferred): Byron Dempsey · Kishan Bodalia · Mike Fox · Rupert Bryce · Terrence
- 3–6 results stats (number + 1-line caption)
- 3–5 LinkedIn post excerpts (60–80 words each + post URL)
- 1 Instagram embed URL
- Final About-Me copy (200–400 words; placeholder in §SECTION 8 of `03-content-master.md` is a starter)
- Open Graph image + favicon (specs in `02-design-system.md` §10)

## Critical rules (don't break)

- **One CTA only:** "Book a free 20-minute email audit" → Calendly. Everywhere. No newsletter, no PDF, no exit-intent popup, no live chat.
- **No prices on the site.** No revenue guarantee on the site.
- **Three colours total:** Charcoal, Pine Shadow / Pine, Tobacco — plus Linen for text.
- **Two type families:** Newsreader + Geist (JetBrains Mono for utility eyebrows only).
- **Real photos of Rudy or no photos.** No stock photography.
- **Calendly is the only paid-CTA integration.**

The full hard-rules list lives in `_knowledge/00-START-HERE.md`.

## Pre-deploy checklist

Before pushing the production repo live:

- [ ] Lighthouse: Perf 95+, A11y 100, SEO 100, Best Practices 100
- [ ] Tested at 375 / 768 / 1024 / 1280 / 1536 px
- [ ] Calendly opens correctly from every primary CTA
- [ ] GA4 + Meta Pixel fire on Calendly schedule confirmation
- [ ] OG card validates on opengraph.xyz, X validator, LinkedIn post inspector
- [ ] `prefers-reduced-motion` is respected (test in OS settings)
- [ ] Schema.org JSON-LD validates on validator.schema.org
- [ ] All `[bracketed]` placeholders replaced with real content from Rudy
- [ ] **`_knowledge/` folder removed**
- [ ] Nothing in `src/` imports from `_knowledge/`

When all boxes are ticked, deploy.
