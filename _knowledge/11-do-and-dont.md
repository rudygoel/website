# 11 — The Do / Don't Checklist

A printable single-pager. If something below is broken at PR-review time, the build is not done.

---

## ✅ DO

### Brand
- [ ] Wordmark only — "RUDY GOEL" in Newsreader, no symbol, no headshot-in-circle logo
- [ ] One italic accent word per headline, max
- [ ] Eyebrows in JetBrains Mono uppercase, Tobacco
- [ ] Section numbers (01, 02 …) in mono Linen-faint
- [ ] Asymmetric layouts (headline left, body indented)
- [ ] Pull quotes: Newsreader italic, Tobacco hairline above, no rendered `"`
- [ ] Hairline borders (1px, Linen 8% / 18%) for elevation — never shadows

### Colour
- [ ] Charcoal `#16191A` is the page background, ~60% of any view
- [ ] Pine Shadow `#1F2D2A` is the only card/elevated surface colour
- [ ] Tobacco `#8B6F4E` appears only as: CTA, italic accent, eyebrow, link hover, hairline rule
- [ ] Linen `#DDD3C4` is body text on dark, plus the inverted "light moment" testimonial section background

### Typography
- [ ] Newsreader for H1–H3 + pull quotes; Geist for H4–H5 + body; JetBrains Mono for eyebrows / numbers / metadata
- [ ] Body line-height ≥ 1.5
- [ ] Display headlines tracking around `-0.022em`
- [ ] Body left-aligned, ragged right
- [ ] Optical sizing: `font-variation-settings: "opsz" 72` on display headlines

### Motion
- [ ] Default GSAP ease registered as `"rg"` = `cubic-bezier(0.625, 0.05, 0, 1)`, default duration 0.6s
- [ ] Hero stagger reveals once on load, then stops
- [ ] Lenis smooth scroll on desktop only (`smoothTouch: false`)
- [ ] One `[data-reveal]` per section — eyebrow+heading cluster only
- [ ] All animations check `prefers-reduced-motion` and bail if set
- [ ] Buttons hover by colour change only (no scale, no translate, no shadow)
- [ ] Cards hover by border colour + 2px translateY (no shadow)
- [ ] Service rows hover: Pine Shadow background fill + 8px translateX + Tobacco arrow fade-in

### Content
- [ ] One CTA pattern across the site: "Book the audit" / "Book a free 20-minute email audit"
- [ ] Final CTA panel renders Pine Shadow with Display L italic-accent headline
- [ ] FAQ uses native `<details>`/`<summary>`, JS enforces single-open
- [ ] Testimonial section accommodates 1–3 video + 3–6 written, with a featured slot
- [ ] Stats tile component uses oversized Newsreader 300 number, Tobacco for the figure, Linen for `%/$/×`
- [ ] Press strip is a static row (no carousel)

### Tech
- [ ] Tokens.css is the first import in any stylesheet
- [ ] All env vars read from `import.meta.env.VITE_*` with sensible defaults
- [ ] Calendly is lazy-loaded on first hover/interaction
- [ ] GA4 + Meta Pixel fire `audit_booked` / `Schedule` on Calendly confirmation
- [ ] All images have `width`/`height` attributes
- [ ] All images have `alt` text (or `alt=""` if decorative)
- [ ] AVIF / WebP / JPEG fallback chain on hero photos
- [ ] Skip-link first child of `<body>`
- [ ] `<html lang="en">` set
- [ ] One `<h1>` per page (the hero)
- [ ] OG / Twitter meta filled
- [ ] Schema.org JSON-LD validates (Person + ProfessionalService)
- [ ] `robots.txt` + `sitemap.xml` present
- [ ] Lighthouse Perf 95+, A11y 100, SEO 100, Best Practices 100

---

## ❌ DON'T

### Brand
- [ ] **Don't** use the old circular face logo as the new wordmark
- [ ] **Don't** include the old "$15K in 90 days" guarantee anywhere on the site
- [ ] **Don't** list pricing on the page
- [ ] **Don't** add a tagline that contains "premium," "world-class," "elevate," "transform," "leverage" — see banned word list in `01-brand-identity.md` §7.2
- [ ] **Don't** italicise more than one word per headline
- [ ] **Don't** italicise body copy
- [ ] **Don't** use ALL CAPS for body
- [ ] **Don't** centre body copy

### Colour
- [ ] **Don't** introduce any colour outside Charcoal / Pine Shadow / Pine / Tobacco / Linen
- [ ] **Don't** use Pine and Pine Shadow side-by-side at the same hierarchy
- [ ] **Don't** use Tobacco for body text
- [ ] **Don't** use red error / green success colours
- [ ] **Don't** use coloured Instagram-gradient social icons

### Typography
- [ ] **Don't** mix in a third typeface
- [ ] **Don't** use Geist above H4
- [ ] **Don't** justify text
- [ ] **Don't** drop body line-height under 1.5
- [ ] **Don't** put more than two type sizes inside one component (button, card, badge)
- [ ] **Don't** use drop shadows on text

### Motion
- [ ] **Don't** use bouncy or elastic easing
- [ ] **Don't** scale buttons on hover
- [ ] **Don't** shadow-on-hover anything
- [ ] **Don't** loop animations on text or logos
- [ ] **Don't** do 3D transforms or perspective tricks
- [ ] **Don't** parallax beyond ~8% movement
- [ ] **Don't** scroll-jack — Lenis smooth-scroll only
- [ ] **Don't** stack marquees (demo2's mistake)
- [ ] **Don't** run a Lottie + carousel + autoplaying video in the same viewport
- [ ] **Don't** add a typewriter / character-cycling animation
- [ ] **Don't** ship a custom cursor unless it respects `@media (hover: none)` (no cursor on touch)

### Components
- [ ] **Don't** build a press-logo carousel — it's a static row
- [ ] **Don't** build a testimonial slider with autoplay
- [ ] **Don't** add icons to the nav
- [ ] **Don't** round corners above 8px
- [ ] **Don't** add a live chat widget
- [ ] **Don't** add a newsletter / lead-magnet opt-in form
- [ ] **Don't** add an exit-intent popup
- [ ] **Don't** add a countdown timer / "ONLY 3 SPOTS LEFT" badge with JS-changing numbers
- [ ] **Don't** add a contact form — `mailto:` only

### Content
- [ ] **Don't** put services as emoji-prefixed cards (the v1 mockup did — drop the emojis, use eyebrow numbers)
- [ ] **Don't** use stock photography of "happy people on laptops"
- [ ] **Don't** fake "as seen in" logos that aren't real
- [ ] **Don't** render dummy "Lorem ipsum" — use the actual content from `03-content-master.md` or `[bracketed placeholders]` Rudy can replace

### Tech
- [ ] **Don't** ship Webflow, WordPress, or Wix output
- [ ] **Don't** import Framer Motion, three.js, Spline, Rive, p5.js, or Anime.js
- [ ] **Don't** include jQuery
- [ ] **Don't** use server-side rendering / serverless functions — site is static
- [ ] **Don't** load Calendly script in initial `<head>` — lazy on first interaction
- [ ] **Don't** load Instagram embed script unless an IG embed is actually visible
- [ ] **Don't** preload all fonts — only the 2 weights of Newsreader and 2 of Geist that the above-fold uses
- [ ] **Don't** commit real env values
- [ ] **Don't** write any code that imports from `_knowledge/` — that folder is deleted before deploy

---

## The 60-second sniff test

Before any commit, look at the page and ask:

1. Does it feel like the inside of a quiet luxury hotel, not the inside of a Times Square billboard?
2. Is there exactly one CTA on the screen at all times?
3. Is the page restful for ≥ 80% of any 5-second window of motion?
4. Could a coach reading this on the train at 7am understand what Rudy does in under 10 seconds?
5. Does any copy make me think "this could be on a different site"? If yes — fix.

If all five are yes, ship it.
