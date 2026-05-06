# 10 — Tech Stack

The site is small. The motion is the most demanding thing in it. The stack is chosen to ship fast, run lean, and never get in the way.

## 1. The recommendation

**Vite + vanilla TS + plain HTML/CSS, deployed to Vercel or Netlify.**

That's the boring, correct answer. Reasons:

- Single-page, no routing, no auth, no CMS — frameworks are overkill.
- The site benefits from raw control over `<head>`, font loading, and motion code paths. SSR doesn't help here because there's nothing dynamic.
- Lighthouse 100/100 is achievable on a static page; harder once a framework is in.
- Build time stays under 5 seconds, deploy under 30.

## 2. Acceptable alternatives

If the builder has strong preferences, these are also fine:

| Stack | When it's fine | Watch-outs |
|---|---|---|
| **Astro** | Builder is comfortable with islands. Astro gives clean static output by default. | Don't pull in React unless an island actually needs it. |
| **Next.js (App Router, static export)** | Builder is already in a Next ecosystem. | Forbid `next dev`'s default fonts API for these fonts (use direct Google Fonts link). Static export only. No serverless functions. |
| **SvelteKit (static adapter)** | Builder prefers Svelte. | Same constraints. |
| **Plain HTML + CSS + JS (no bundler)** | If the builder wants the literally-zero-tooling path. | You'll lose hot-reload and TS. Acceptable. |

**Not acceptable:** WordPress (the brief explicitly avoids the demo2 stack). Webflow (no, even though demo1 uses it — Webflow's bundle bloat conflicts with the perf budget). Wix (we are explicitly leaving Wix). Framer hosted (limits motion control).

## 3. Final stack (if you go with the recommendation)

```
Build:     Vite 5
Language:  TypeScript (motion code is type-checked; HTML stays HTML)
HTML:      single index.html with <%= %> partials inlined (or just one file — it's small)
CSS:       hand-written, 4 stylesheets (tokens / base / components / layout)
JS:        ~150 LOC of TS for motion + Calendly + nav scroll-state
Animation: GSAP 3 + plugins (CustomEase, SplitText, ScrollTrigger) + Lenis
WebGL:     UnicornStudio (optional, lazy)
Hosting:   Vercel or Netlify or Cloudflare Pages
DNS:       point rudygoel.com → host
SSL:       handled by host
Analytics: GA4 + Meta Pixel (see 08-integrations.md)
```

## 4. Folder structure (production repo)

What the repo looks like after `_knowledge/` is removed.

```
rudy-goel-site/
├── public/
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og.png
│   ├── robots.txt
│   └── sitemap.xml
├── assets/
│   ├── images/
│   │   ├── rudy-portrait.jpeg
│   │   ├── rudy-portrait.webp        ← derived
│   │   └── rudy-portrait.avif        ← derived
│   ├── icons/
│   │   ├── instagram.svg
│   │   ├── linkedin.svg
│   │   ├── tiktok.svg
│   │   └── youtube.svg
│   ├── press-logos/
│   │   └── *.png
│   ├── testimonials/
│   │   ├── matthew-volkwyn-headshot.png
│   │   ├── matthew-volkwyn-video-poster.jpg
│   │   └── matthew-volkwyn.mp4
│   └── clients/                       (empty until logos arrive)
├── src/
│   ├── styles/
│   │   ├── tokens.css                ← from _knowledge/tokens.css
│   │   ├── base.css                  ← resets, typography defaults, atmospherics
│   │   ├── components.css            ← every component from 05-component-library.md
│   │   └── layout.css                ← container, section, grid utilities
│   ├── scripts/
│   │   ├── main.ts                   ← bootstrap, nav, anchor scroll
│   │   ├── motion.ts                 ← GSAP + Lenis + reveals (gated by reduced-motion)
│   │   ├── calendly.ts               ← lazy loader + popup trigger
│   │   ├── analytics.ts              ← gtag + fbq event helpers
│   │   └── faq.ts                    ← single-open accordion enforcement
│   └── data/
│       └── proof.ts                  ← clients, stats, testimonials, press (see 09)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

## 5. `package.json` essentials

```json
{
  "name": "rudy-goel-site",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "assets:optimize": "node scripts/optimize-assets.mjs",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write src"
  },
  "dependencies": {
    "gsap": "^3.12.0",
    "lenis": "^1.1.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "typescript": "^5.5.0"
  }
}
```

UnicornStudio is loaded via CDN dynamically; not a npm dep. GSAP plugins (CustomEase, SplitText, ScrollTrigger) are in the `gsap` package — the bonus plugins (SplitText, MorphSVG, etc.) require a Club GreenSock licence; if Rudy doesn't have one, swap SplitText for an inline reimplementation (≈30 LOC, see `motion.ts` in §6 below) or for Splitting.js (MIT).

## 6. `vite.config.ts`

```ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["gsap", "lenis"],
        },
      },
    },
  },
  server: { port: 5173, host: true },
});
```

## 7. CI/CD

Minimum:
- On push to `main`: build + deploy preview (Vercel/Netlify do this automatically).
- On merge to `main`: production deploy with `lastmod` of `sitemap.xml` updated to current date (a single `prebuild` script that rewrites the file).

Nice-to-haves (later):
- Lighthouse CI run on each preview, fail the build if perf < 95.
- HTML validation (`html-validate`) in CI.

## 8. Browser support

- Modern evergreen: Chrome 110+, Edge 110+, Firefox 110+, Safari 16+.
- iOS Safari 16+, Android Chrome current.
- IE 11: not supported. (Per the brief — no fallback work for legacy browsers.)
- Mobile is mandatory; the site must look correct at 375px width.

## 9. Performance targets

| Metric | Target |
|---|---|
| LCP (mobile, 4G) | < 2.0s |
| CLS | < 0.05 |
| INP | < 100ms |
| FCP | < 1.0s |
| Total JS (gzip) | < 80 KB |
| Total CSS (gzip) | < 25 KB |
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |

If any is missing the target after first build, profile before adding code. Most fixes are: image format, font-display, lazy-loading, and JS bundle splitting.

## 10. Local dev quick-start

```bash
git clone <repo>
cd rudy-goel-site
cp .env.example .env.local        # fill in CALENDLY_URL, GA4_ID, META_PIXEL_ID
npm install
npm run dev                       # http://localhost:5173
```

That's it. No database, no server, no auth.
