# 06 — Page Architecture

Single page. Anchor navigation. Eleven sections in order. The structural skeleton you build to.

## 1. Page skeleton

```html
<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <!-- meta, fonts, tokens.css, base.css, components.css -->
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <nav class="nav" data-theme="dark">…</nav>

  <main id="main">
    <section id="hero"      class="section section--hero">…</section>
    <section id="shift"     class="section" data-reveal>…</section>
    <section id="who"       class="section" data-reveal>…</section>
    <section id="services"  class="section" data-reveal>…</section>
    <section id="how"       class="section" data-reveal>…</section>
    <section id="proof"     class="section" data-reveal data-nav-theme="dark">…</section>
    <section id="writing"   class="section" data-reveal>…</section>
    <section id="about"     class="section" data-reveal>…</section>
    <section id="faq"       class="section" data-reveal>…</section>
    <section id="cta"       class="section section--final">…</section>
  </main>

  <footer class="footer">…</footer>

  <!-- main.js, motion.js, calendly.js -->
</body>
</html>
```

Optional inverted ("light moment") testimonial sub-section *inside* `#proof` carries `data-nav-theme="light"` so the nav inverts when the user scrolls into it.

## 2. Section order, IDs, and anchor map

| # | ID | Title | Nav link | Notes |
|---|---|---|---|---|
| 1 | `#hero` | IMPACT-style hero | (no) | First viewport. Above-fold. |
| 2 | `#shift` | The shift | "The shift" | Belief-flip narrative. |
| 3 | `#who` | Who I work with | (no) | Cards. ICP block. |
| 4 | `#services` | What I actually do | "Services" | Service-row component. |
| 5 | `#how` | How a project runs | "How it works" | 4-step list. |
| 6 | `#proof` | The work, clients, receipts | "Proof" | Roster + stats + testimonials + press. Internal anchor `#testimonials` for footer/email use. |
| 7 | `#writing` | Selected writing | (no) | LinkedIn excerpts + IG embed. |
| 8 | `#about` | About me | "About" | Two-col with portrait. |
| 9 | `#faq` | Things people ask | "FAQ" | Accordion. |
| 10 | `#cta` | Final CTA panel | (no) | Pine Shadow callout. |
| 11 | `footer` | Footer | (no) | Wordmark, sitemap, social, legal. |

Nav links visible: **The shift · Services · How it works · Proof · About · FAQ.** Not all 11 — the nav is curated.

## 3. Vertical rhythm

Each `section` gets `padding-block: clamp(80px, 12vw, 160px);` by default.

Exceptions:
- `#hero` → `clamp(120px, 18vw, 240px)` top, default bottom.
- `#proof` is densest — give it more breathing room, `clamp(120px, 14vw, 200px)` block.
- `#cta` → final panel, `clamp(120px, 14vw, 200px)` block, full-width Pine Shadow inset.
- Footer → top padding `--s-9` minimum, bottom `--s-7`.

## 4. Container widths per section

| Section | Container |
|---|---|
| Hero | `--container-max` (1280px), inner content asymmetric, headline left-aligned |
| Shift | `--container-narrow` (720px) — long-read column |
| Who | `--container-max` for 3-card row |
| Services | `--container-max`; service rows go full-width inside |
| How | `--container-narrow` for the 4-step text |
| Proof: roster | `--container-max` |
| Proof: stats | `--container-max` |
| Proof: testimonials | `--container-max` (3-col video row + 2-col written grid) |
| Proof: press | `--container-wide` (1440px) for breathing space |
| Writing | `--container-max` |
| About | `--container-max` (2-col grid: portrait + narrow body) |
| FAQ | `--container-narrow` |
| Final CTA | `--container-max`, panel inside is `--container-narrow` content cap |
| Footer | `--container-max` |

## 5. Responsive rules

### Breakpoints

```
--bp-sm:  540px   small tablet
--bp-md:  768px   tablet — first major collapse
--bp-lg:  1024px  small desktop — nav becomes full
--bp-xl:  1280px  desktop — design sweet spot
--bp-2xl: 1536px  large desktop — caps gutters
```

### Mobile (≤ 768px) collapse rules

- Nav links → hamburger drawer.
- All grids → 1 column.
- Press strip → flex-wrap, smaller gap, smaller logos.
- Service rows → keep grid but reduce num column to 32px.
- Testimonial video row (3 → 1).
- About: portrait stacks above body.
- Stat tiles stack 1 column with `--s-5` gap.
- Hero headline scale: `clamp(56px, 9vw, 144px)` already handles this; just make sure the italic accent doesn't overflow.
- Reduce vertical section padding to the lower clamp value (`80px`).

### Tablet (768–1024px)

- Service-row grid stays.
- Stats become 2-col (1fr 1fr) or 3-col (1fr × 3) depending on length.
- Footer stays 4-col but tighter gap.
- About stays 2-col.

## 6. The "data-reveal" anchor

Every section has exactly **one** `[data-reveal]` element — the eyebrow+heading+lead cluster. This is the ScrollTrigger trigger (see `04-motion-and-animation.md` §6.1).

```html
<section id="services" class="section">
  <div class="container">

    <header class="section-head" data-reveal>
      <span class="num">03</span>
      <h2>What I actually <em>do</em>.</h2>
      <span class="meta">7 services</span>
    </header>

    <p class="lead">…</p>

    <ul class="service-list">
      <li><a class="service-row">…</a></li>
      …
    </ul>

  </div>
</section>
```

Don't `data-reveal` cards, rows, paragraphs individually — read `04-motion-and-animation.md` §2 forbidden list (no animating everything on scroll).

## 7. Heading hierarchy

- `<h1>` — hero only. One per page.
- `<h2>` — every section title.
- `<h3>` — pull quote rendered as a heading? No — pull quote is a `<blockquote>`.
- `<h4>` — card titles, service-row titles, FAQ questions, step titles.
- `<h5>` — footer column headers.

Skipping levels is forbidden. If a designer urge to use `<h3>` arises, ask whether it's actually a section subdivision or a UI label — most are H4.

## 8. SEO / meta block

```html
<title>Rudy Goel — Email Copy for Coaches</title>
<meta name="description" content="Done-for-you email marketing and creative strategy for mindset and high-performance coaches. Book a free 20-minute audit." />
<meta name="author" content="Rudy Goel" />
<link rel="canonical" href="https://www.rudygoel.com/" />

<meta property="og:type" content="website" />
<meta property="og:title" content="Rudy Goel — Email & Creative Strategy for Coaches" />
<meta property="og:description" content="Email copy that quietly prints money for coaches who'd rather coach." />
<meta property="og:url" content="https://www.rudygoel.com/" />
<meta property="og:image" content="https://www.rudygoel.com/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="en_AU" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Rudy Goel — Email & Creative Strategy for Coaches" />
<meta name="twitter:description" content="Email copy that quietly prints money for coaches who'd rather coach." />
<meta name="twitter:image" content="https://www.rudygoel.com/og.png" />

<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#16191A" />
```

### JSON-LD schema (paste in `<head>`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.rudygoel.com/#person",
      "name": "Rudy Goel",
      "givenName": "Rudraksh",
      "jobTitle": "Email Copywriter & Creative Strategist",
      "url": "https://www.rudygoel.com/",
      "image": "https://www.rudygoel.com/assets/images/rudy-portrait.jpeg",
      "address": { "@type": "PostalAddress", "addressLocality": "Brisbane", "addressCountry": "AU" },
      "sameAs": [
        "https://www.linkedin.com/in/rudygoel/",
        "https://www.instagram.com/rudygoel/",
        "https://www.tiktok.com/@rudygoel",
        "https://www.youtube.com/@rudygoel"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.rudygoel.com/#service",
      "name": "Rudy Goel — Email Copywriting",
      "url": "https://www.rudygoel.com/",
      "areaServed": "Worldwide",
      "serviceType": "Email copywriting and creative strategy",
      "provider": { "@id": "https://www.rudygoel.com/#person" },
      "priceRange": "$$$"
    }
  ]
}
</script>
```

## 9. Performance budget at the page level

- HTML weight (gzipped): under 30 KB.
- CSS (gzipped): under 25 KB total — `tokens.css` + `base.css` + `components.css` + `layout.css`.
- JS (gzipped): under 80 KB total — GSAP+plugins ≤ 60, Lenis ≤ 8, app code ≤ 12. UnicornStudio (~150 KB) is lazy after FCP.
- LCP < 2.0s on 4G mobile (the hero headline).
- Total fonts: 3 families, only **2 weights** of Newsreader (300, 400 + italic) and **2** of Geist (400, 500) preloaded; mono lazy.
- Images: AVIF or WebP fallback for all photos; PNG only for logos. Each image declared with explicit `width`/`height` attributes to avoid CLS.
- Preload: `rudy-portrait.jpeg`, `og.png`, both display fonts.
- Defer / lazy: WebGL, Calendly, Instagram embeds, video files (only fetched after user clicks play).

## 10. Print stylesheet

Optional but easy:

```css
@media print {
  body { background: #fff; color: #000; }
  .nav, .footer__social, video, .testimonial-video { display: none; }
  a::after { content: " (" attr(href) ")"; font-size: 80%; color: #444; }
}
```

## 11. The hard constraints (do not break)

- One H1 per page.
- One primary CTA pattern across all sections.
- No section with more than 2 headings (H2 + optional H4 cluster). If a section needs more, split it.
- Every interactive element must be reachable by Tab key in DOM order.
- Every external link gets `target="_blank" rel="noopener"`.
- Every image has alt text (or `alt=""` if decorative).
