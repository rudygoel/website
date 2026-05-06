# Reference — Demo analyses

Three saved HTML references the client supplied. Each one represents a different point on the spectrum of what to build toward (and what to avoid).

The redesign **structurally borrows** from demo3, **motion-borrows** from demo1, and **explicitly avoids** demo2.

---

## Demo 1 — Juan Mora (vibe / motion / nav inspiration) ✅ TAKE FROM HERE

`demo1/Juan Mora _ Design Director - Web and Brand Design Specialist.html`

**Stack.** Webflow base + heavy custom GSAP layer. Loads jQuery, webflow.js, gsap.min.js, SplitText, ScrollTrigger, Lenis (with `lenis.css`), CustomEase, and **UnicornStudio v2.1.1** (the WebGL shader for the hero gradient).

**Layout.** Single `<main data-barba="wrapper">` with fixed top nav + IntersectionObserver theme-swap (sections are tagged `data-nav="grey"` / `data-nav="peach"`). Hero is text-only — `<h1>` reads "16 years making users click and scroll my designs" with the word "scroll" wrapped as a separate `<span>`. Then full-bleed video panels (`.video-cont-p2.home` autoplaying mp4s), service headlines, a benefits "step1/step2" section with a silhouette PNG that parallaxes via `transform: translate3d(0,-3vw,0)`, an email CTA, and a footer with a giant displaced name treatment ("Mora" translated 10vw down inside `.gsap_split_word-mask`).

**Custom motion.** Custom ease registered `CustomEase.create("osmo", "0.625, 0.05, 0, 1")` and set as GSAP default with `duration: 0.6`. Lenis runs `lerp: 0.1, wheelMultiplier: 1`. There is a real custom cursor — `.cursor-jm` follows mouse via GSAP ticker with `1 - Math.pow(1 - 0.09, deltaRatio)` lerp; over `.cta-button-wrapper` a `.text-jm-cursor` reveals the copy "Copy my Email" and clicking copies to clipboard with a SplitText char-stagger reveal (`ease: "back.out(1.7)"`). CTA buttons (`.main-cont-button`) have a swap-icon hover where one icon shrinks (`width: 0rem, rotation: -90, ease: "power2.out"`) while another springs in.

**Type & colour.** Single typeface — custom **Goga** (declared `@font-face` in `juan-portfolio-2026.webflow.css`). Palette via CSS vars: `--bg-warm: #faf6ef`, `--bg-grey: #f4f4f4`, `--bg-cold: #e8e9ef`, `--orange1: #ffbc95` (peach), `--orange2: #f99e76`, `--grey: #96908c`, `--blue: #2e54fe`. Themed text-selection: `::selection { background:#ffbc95; color:#666 }`.

**What we take.** GSAP+Lenis+CustomEase architecture (renamed `"osmo"` → `"rg"`). The IntersectionObserver nav theme-swap (renamed `data-nav` → `data-nav-theme`). The hero SplitText word-mask reveal. The CTA icon-swap-on-hover pattern (without elastic). The case-study row hover (Pine Shadow background fill + slide-right). UnicornStudio for the optional hero shader.

**What we don't take.** Goga font (we use Newsreader + Geist). The peach-on-cream palette (we use Pine + Tobacco on Charcoal). The custom cursor in its full demo1 form — we ship a much more muted version, optional. The full-bleed autoplay mp4 panels (no autoplay video on Rudy's site).

---

## Demo 2 — Matthew Volkwyn (what to AVOID) ❌ DO NOT BUILD THIS

`demo2/Matthew Volkwyn – Email Copy That Converts.html`

**Stack.** WordPress + Astra theme + Elementor Pro + Qi Addons (Qode) + ElementsKit. The "kitchen-sink page-builder" stack — exactly why it feels overloaded.

**Layout.** Fixed sticky header via `jquery.sticky.min.js` with auto-cloned spacer. Horizontal nav (`.elementor-nav-menu--main` with `e--animation-grow` pointer effect). Below: an oversized hero name treatment (custom signature SVG path), "THIS IS ME" headline, a brand-trust marquee (two stacked `.qodef-qi-text-marquee` instances listing "TONY ROBBINS / FIVERR / PALEOHACKS / MINDVALLEY / DAN MARTELL / DAN LOK / VSHRED / CLICKFUNNELS"), "Multiple 8-Figures In Sales" stat block, a Lottie animation, an Elementor media-carousel (Swiper, autoplay 5000ms, loop) with arrows, an icon-box grid for services, and a testimonial carousel (3 slides per view, autoplay).

**Libraries.** Astra + ~25 Elementor stylesheets (sticky, swiper, e-swiper, animation-pulse, fadeInUp, lottie, media-carousel, testimonial-carousel, social-icons, etc.) + Smartmenus + jQuery sticky + lottie.min.js + animate-circle. **No GSAP, no Lenis, no custom cursor** — animations are CSS-keyframe driven (`fadeInUp`, `pulse`) plus Swiper.

**Type & colour.** Three Google fonts — **Anton** (giant condensed display caps used for "TONY ROBBINS / 8-FIGURES / $10K/MO"), **Montserrat**, **Roboto**. Anton-on-anton-on-anton is the loud-typography signature. Inline-styled accents: `#FFBC7D` (warm peach), white, `#ffd029`/`#efb203`, reds (`#e94940`, `#ff655c`, `#e32e23`), and a lavender (`#a28df8`/`#845ff3`).

**Why client says "too much."** Pulsing socials + dual marquees + autoplay carousel + Lottie + autoplay testimonial slider + Anton-caps screaming on every block, on a saturated peach/orange background. There is no breathing room and no single focal point — five things move at all times.

**What we explicitly avoid.**
- Stacked horizontal text marquees.
- Pulsing social icon animations (`elementor-animation-pulse`).
- Autoplay testimonial carousels.
- Stacked Lottie + carousel + autoplay video in the same viewport.
- Anton-everywhere display type.
- Page-builder markup bloat (`.elementor-element-…` 3–4 levels deep).

**What we cautiously keep (very different form).**
- The "logos of clients you trust" idea — but as a single calm static row, not dual marquees.
- The warm-peach palette spirit — replaced with our Tobacco accent on Charcoal base.
- The bold name signature SVG — not as the brand mark, but available as a one-off accent in the About section if it earns its place.
- The testimonial section pattern — without the carousel.

---

## Demo 3 — Cameron Cruz (simplicity model) ✅ STRUCTURE FROM HERE

`demo3/Cameron Cruz.html`

**Stack.** Pure Framer export. Bundle preloads `react.BK8X7ojG.mjs`, `motion.lcrA4GLV.mjs` (Framer Motion), `framer.85BZGi9-.mjs`, `rolldown-runtime.C5V3rOZD.mjs` from `framerusercontent.com`. **No jQuery, no Webflow, no Elementor, no GSAP, no custom cursor.**

**Layout.** Three named regions only — `data-framer-name="Header"`, `data-framer-name="Work"`, `data-framer-name="Footer"`. Header = `<h3>Cameron Cruz</h3>` plus a centred `<h1>Offer Consultant, Copywriter, & VSLs.</h1>`. Work = a single `data-framer-name="Feature Image"` (one big 1080×1035 portrait JPG of him plus a logo strip), three `<p>` paragraphs of body copy, and **one** CTA button labelled "Newsletter" (rgb(242,242,242), border-radius 3px). Footer lists socials inline as plain text `<h3>` ("Instagram: @cameroncruz / Facebook: … / Youtube: …"), Bookmarks row (Privacy / Refund / Terms / Product Description), and a "Credits" address block.

**Motion.** Almost none. Framer's appear-on-load wrapper (`data-framer-appear-id="1b6l2t1"` with `style="opacity: 1; transform: perspective(1200px); will-change: transform"`) — that's the only motion primitive. No marquee, carousel, parallax, Lottie, custom cursor, scroll triggers. Framer Motion is loaded but used only for the static appear transition.

**Type & colour.** Body and CTA use **DM Sans** (`--framer-font-family: "DM Sans", sans-serif`, weight 500, 18–20px, `letter-spacing: -0.2px`, `line-height: 1.7em`); headings fall back to Inter / Inter Display. Palette is brutally minimal: `rgb(16,16,16)` page bg, `rgb(255,255,255)` headings, `rgb(230,230,230)` body, `rgb(179,179,179)` muted, `rgb(242,242,242)` CTA. **Five greys plus one image. No accent colour anywhere.**

**Why the client likes it.** Single-screen "business card" composition: name at top, one massive photograph as the hero/work piece, a paragraph of who-I-am / what-I-do, one CTA, contact + policy links in the footer. No animation, no carousel, no nav. The only "design" is typography rhythm + one hero image.

**What we take.** The structural minimalism — start from the simplest thing that works. The mono-on-near-mono palette discipline. The dark base (`rgb(16,16,16)` is conceptually our Charcoal `#16191A`). The single CTA pattern. The "let typography do the work" approach. The footer pattern of inline text social links.

**What we don't take.** Framer as the engine (we want raw HTML/CSS/TS for control + perf). The total absence of motion (we want the demo1 reveal layer applied sparingly). The lack of any accent (we have Tobacco). The "one giant photo" hero (Rudy's site has more sections — we keep the photo for §SECTION 8 About).

---

## Synthesis — the redesign in one sentence

**Demo3's restraint, demo1's motion vocabulary, demo2 nowhere in sight, plus Pine & Tobacco's editorial palette and Newsreader/Geist's serif-up-top discipline.**
