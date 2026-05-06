# Rudy Goel — Website

Single-page boutique site for **Rudy Goel** — freelance email copywriter and creative strategist for mindset and high-performance coaches. The site has one job: get a visitor to **book a free 20-minute email audit** via Calendly.

Production: https://www.rudygoel.com

---

## Stack

- **Vite 5** + **TypeScript** + plain HTML/CSS, deployed as a static `dist/`
- **GSAP** (CustomEase + ScrollTrigger) + **Lenis** for motion
- **Calendly** as the only paid integration (lazy-loaded on first interaction)
- **GA4** + **Meta Pixel** for analytics, deferred to idle

No framework. No SSR. No CMS. The proof block (clients, stats, testimonials, press, writing) is rendered at runtime from a single TypeScript data file (`src/data/proof.ts`) so Rudy can update content without touching templates.

## Project structure

```
.
├── public/                  ← copied verbatim into dist/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── assets/                  ← served at /assets/* (custom Vite plugin)
│   ├── images/
│   ├── icons/               (raster — replaced by inline SVG in main.ts)
│   ├── press-logos/
│   ├── testimonials/
│   └── clients/
├── src/
│   ├── styles/
│   │   ├── tokens.css       ← variables (Pine & Tobacco palette, type, motion)
│   │   ├── base.css         ← reset, typography defaults, atmospherics
│   │   ├── layout.css       ← container, section, grid utilities
│   │   └── components.css   ← every component from spec
│   ├── scripts/
│   │   ├── main.ts          ← entry: renders proof block, mounts SVGs, boots motion/calendly
│   │   ├── motion.ts        ← GSAP "rg" ease, hero stagger, reveals, Lenis, nav theme
│   │   ├── calendly.ts      ← lazy loader, popup trigger, mobile fallback
│   │   ├── analytics.ts     ← gtag + fbq wrappers (audit_booked, Schedule, Lead)
│   │   └── faq.ts           ← single-open accordion enforcement
│   └── data/
│       └── proof.ts         ← clients, stats, testimonials, press, writing posts
├── index.html               ← all 11 sections + meta + JSON-LD
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── README.md
└── MISSING.md               ← assets/copy still owed by Rudy
```

## Local dev

```bash
git clone <repo>
cd rudy-goel-site
cp .env.example .env.local            # fill in real values
npm install
npm run dev                           # http://localhost:5173
```

## Environment variables

Set these in `.env.local` (never commit real values):

| Var | Purpose |
|---|---|
| `VITE_CALENDLY_URL` | Full Calendly event URL, e.g. `https://calendly.com/rudygoel/audit` |
| `VITE_GA4_ID` | GA4 measurement ID (`G-XXXXXXXXXX`) — left as default disables GA4 |
| `VITE_META_PIXEL_ID` | 15-digit Meta pixel ID — left as default disables the pixel |
| `VITE_SITE_URL` | Canonical site URL (used in OG/sitemap, default `https://www.rudygoel.com`) |

The brand-themed Calendly query params (`background_color=16191A&text_color=DDD3C4&primary_color=8B6F4E&hide_landing_page_details=1&hide_gdpr_banner=1`) are appended automatically by `calendly.ts`.

## Build & preview

```bash
npm run build      # tsc --noEmit + vite build → dist/
npm run preview    # serve dist/ at http://localhost:4173
```

A successful build is around:

| File | gzip |
|---|---|
| `index.html` | ~7 KB |
| CSS | ~7 KB |
| Main JS | ~6 KB |
| Motion chunk (GSAP+Lenis, lazy) | ~55 KB |

## Deploy

The repo deploys cleanly to **Vercel**, **Netlify**, or **Cloudflare Pages**:

1. Connect repo, set framework to "Vite".
2. Set the env vars above in the host's project settings.
3. Build command: `npm run build` · Output dir: `dist`.
4. Point `rudygoel.com` DNS at the host (A/CNAME).
5. SSL is automatic.

Cache headers (recommended at the host):
- Hashed assets: `Cache-Control: public, max-age=31536000, immutable`
- HTML: `Cache-Control: public, max-age=0, must-revalidate`

## What lives where

- **Copy** — directly inline in `index.html`. Bracketed text like `[47%]` is intentional placeholder; replace when Rudy supplies real values.
- **Proof content** (clients / stats / testimonials / press / writing) — `src/data/proof.ts`. Edit this file to add or change items; the page re-renders without touching markup.
- **Brand tokens** — `src/styles/tokens.css`. Pine & Tobacco palette, Newsreader + Geist + JetBrains Mono.
- **Motion vocabulary** — `src/scripts/motion.ts`. Custom ease registered as `"rg"`; SplitText reimplemented inline (~30 LOC) so we don't need a Club GreenSock licence.

## Updating the site after launch

| Task | Where |
|---|---|
| Add a written testimonial | `src/data/proof.ts` → `testimonials` array |
| Add a video testimonial | Drop the file in `assets/testimonials/`, add an entry to `testimonials` (`type: "video"`, `featured?: true`) |
| Update stat tiles | `src/data/proof.ts` → `stats` |
| Update client roster | `src/data/proof.ts` → `clients` |
| Add a LinkedIn post excerpt | `src/data/proof.ts` → `writingPosts` |
| Update FAQ | `index.html` (look for `<details class="faq__item">`) |
| Update About copy | `index.html` (look for `id="about"`) |

## Quality bar

- Lighthouse targets: Performance 95+, Accessibility 100, Best Practices 100, SEO 100.
- WCAG AA contrast on every text/background combination.
- `prefers-reduced-motion` respected everywhere (Lenis disabled, hero stagger skipped, reveals skipped, custom cursor never mounted).
- Tested at 375 / 768 / 1024 / 1280 / 1536px.

## Hard rules (don't break)

- One CTA pattern across the entire site: **"Book the audit"**. No newsletter signup, no PDF download, no exit-intent popup, no live chat, no contact form.
- No prices. No revenue guarantees on the site.
- Three colours total + Linen for text (Charcoal · Pine Shadow · Pine · Tobacco · Linen).
- Two type families + one mono utility (Newsreader · Geist · JetBrains Mono).
- No icons in the nav. No stock photography.

If a future feature would break any of these, ask Rudy first.

---

## Note on `_knowledge/`

If you've been handed this repo with a `_knowledge/` folder at the root: that folder is the AI knowledge pack used to brief the build. **Delete it before deploying to production** — nothing in `src/` imports from it, and the production deploy must not include it.

Verify with:

```bash
grep -r "_knowledge" src/ index.html
```

Should return no results.
