# 05 — Component Library

Every interactive or repeating UI piece on the site. If it's not in this file, it doesn't exist on the site.

Each component spec gives: **purpose · markup skeleton · style rules · states · examples used in.**

---

## 1. Wordmark / Logo

**Purpose.** The brand mark in nav and footer. Type-driven, no symbol.

```html
<a href="/" class="wordmark" aria-label="Rudy Goel">
  <span class="wordmark__name">RUDY GOEL</span>
  <span class="wordmark__sub">EMAIL COPY</span>
</a>
```

```css
.wordmark__name { font-family: var(--font-display); font-weight: 400;
                  text-transform: uppercase; letter-spacing: 0.04em;
                  color: var(--color-text); font-size: 18px; }
.wordmark__sub  { display: block; font-family: var(--font-body); font-weight: 400;
                  text-transform: uppercase; letter-spacing: 0.32em;
                  color: var(--color-text-faint); font-size: 11px; margin-top: 2px; }
```

**States.** No hover state on the wordmark. It's a fixed identity mark, not an interactive flourish.

**Used in.** Nav (top-left), footer (column 1).

---

## 2. Buttons

Three variants. All use `.btn` base.

### 2.1 Base

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 48px; padding: 0 24px; border-radius: 2px;
  font-family: var(--font-body); font-size: 14px; font-weight: 500;
  letter-spacing: 0.02em; text-decoration: none; cursor: pointer;
  border: 1px solid transparent;
  transition: background var(--d-base) var(--ease),
              border-color var(--d-base) var(--ease),
              color var(--d-base) var(--ease);
}
@media (max-width: 768px) { .btn { height: 44px; } }
```

### 2.2 Primary (`.btn-primary`)

```css
.btn-primary { background: var(--color-accent); color: var(--color-text-inverse); }
.btn-primary:hover  { background: var(--color-accent-hover); }
.btn-primary:active { background: var(--color-accent-active); }
```

Optional icon-swap on hover (see `04-motion-and-animation.md` §5.2). Markup:

```html
<a href="#book" class="btn btn-primary" data-cta="primary">
  <span class="btn-label">Book the audit</span>
  <span class="btn-icon" aria-hidden="true">→</span>
</a>
```

### 2.3 Secondary (`.btn-secondary`)

```css
.btn-secondary { background: transparent; border-color: var(--color-border-strong); color: var(--color-text); }
.btn-secondary:hover  { background: var(--color-surface-1); }
.btn-secondary:active { background: var(--color-surface-2); }
```

### 2.4 Ghost / text link (`.btn-ghost` or `.link`)

Inline text link, used after a primary CTA as a soft secondary path.

```css
.link {
  background: transparent; color: var(--color-text); padding: 0; height: auto;
  text-decoration: underline; text-decoration-color: var(--color-text-faint);
  text-underline-offset: 4px;
}
.link:hover { text-decoration-color: var(--color-accent); }
```

### 2.5 Don'ts

- ❌ Never round buttons to `--radius-pill`.
- ❌ Never use `box-shadow` for elevation.
- ❌ Never `transform: scale()` on hover.
- ❌ Don't write button copy "Submit", "Click here", "Learn more", "Get started".

---

## 3. Eyebrow

```html
<span class="eyebrow">Section eyebrow</span>
```

```css
.eyebrow {
  font-family: var(--font-mono); font-size: var(--text-eyebrow);
  font-weight: 400; letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase; color: var(--color-accent); display: inline-block;
}
```

Sometimes the eyebrow is paired with a section number — render the number in mono Linen-faint to its left:

```html
<header class="section-head">
  <span class="num">02</span>
  <h2>Who this is <em>for</em>.</h2>
  <span class="meta">3 audiences</span>
</header>
```

---

## 4. Section header

The reusable pattern at the top of every numbered section.

```css
.section-head {
  display: flex; align-items: baseline; gap: var(--s-4);
  padding-bottom: var(--s-4);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--s-7);
}
.section-head .num   { font-family: var(--font-mono); font-size: var(--text-eyebrow);
                       color: var(--color-text-faint); letter-spacing: var(--tracking-eyebrow); }
.section-head h2     { flex: 1; }
.section-head h2 em  { font-style: italic; color: var(--color-text-soft); }
.section-head .meta  { font-family: var(--font-mono); font-size: var(--text-eyebrow);
                       color: var(--color-text-faint); text-transform: uppercase;
                       letter-spacing: var(--tracking-eyebrow); }
```

`.meta` is optional. Use it when a section has a meaningful counter (e.g. "7 services", "5 clients").

---

## 5. Navigation bar

**Purpose.** Sticky top nav. Theme-swaps based on the section in view (see `04-motion-and-animation.md` §6.4).

```html
<nav class="nav" data-theme="dark">
  <a href="/" class="wordmark">…</a>

  <ul class="nav__links">
    <li><a href="#shift">The shift</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#how">How it works</a></li>
    <li><a href="#proof">Proof</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>

  <ul class="nav__social" aria-label="Social">
    <li><a href="https://instagram.com/…" aria-label="Instagram"><svg>…</svg></a></li>
    <li><a href="https://linkedin.com/in/…" aria-label="LinkedIn"><svg>…</svg></a></li>
    <li><a href="https://tiktok.com/@…" aria-label="TikTok"><svg>…</svg></a></li>
    <li><a href="https://youtube.com/@…" aria-label="YouTube"><svg>…</svg></a></li>
  </ul>

  <a href="#book" class="btn btn-primary nav__cta">Book the audit</a>

  <button class="nav__hamburger" aria-label="Open menu" aria-expanded="false">
    <span></span><span></span>
  </button>
</nav>
```

**Style.**

```css
.nav {
  position: fixed; inset: 0 0 auto 0; height: var(--nav-height);
  display: flex; align-items: center; gap: var(--s-6);
  padding: 0 var(--gutter); z-index: var(--z-sticky);
  background: transparent;
  transition: background var(--d-base) var(--ease);
}
.nav.is-scrolled         { background: var(--nav-bg-scrolled); backdrop-filter: blur(var(--nav-blur)); }
.nav[data-theme="light"] { background: rgba(221,211,196,0.9); color: var(--color-text-inverse); }

.nav__links { display: flex; gap: var(--s-5); list-style: none; margin: 0 auto 0 var(--s-7); padding: 0; }
.nav__links a { font-size: 14px; font-weight: 400; letter-spacing: 0.01em;
                color: inherit; text-decoration: none; position: relative; }
.nav__links a::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -4px;
  height: 1px; background: var(--color-accent);
  transform: scaleX(0); transform-origin: left;
  transition: transform var(--d-base) var(--ease);
}
.nav__links a:hover::after,
.nav__links a.is-active::after { transform: scaleX(1); }

.nav__social { display: flex; gap: var(--s-4); list-style: none; margin: 0; padding: 0; }
.nav__social svg { width: 18px; height: 18px; fill: currentColor; opacity: 0.72; transition: opacity var(--d-fast) var(--ease); }
.nav__social a:hover svg { opacity: 1; color: var(--color-accent); }

.nav__hamburger { display: none; }

@media (max-width: 1024px) {
  .nav__links, .nav__social, .nav__cta { display: none; }
  .nav__hamburger { display: block; margin-left: auto; }
  .nav.is-open .nav__drawer { transform: translateY(0); }
}
```

**Mobile drawer.** Full-screen overlay, links stacked at Newsreader 32px, social row below, primary CTA at the bottom. Animates in `transform: translateY(-100%) → 0` over 480ms with `--ease`.

---

## 6. Card

```html
<article class="card">
  <span class="eyebrow">01</span>
  <h4>Card title goes here</h4>
  <p>Two-line body description.</p>
  <a class="link" href="#">Read more</a>
</article>
```

```css
.card {
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: var(--radius-md); padding: var(--card-padding);
  transition: border-color var(--d-base) var(--ease),
              transform var(--d-base) var(--ease);
}
.card--feature { padding: var(--s-7); }
a.card:hover, .card:hover {
  border-color: var(--color-border-strong);
  transform: translateY(-2px);
}
```

---

## 7. Service-list row (signature component)

The stacked rows in §SECTION 4 of content. NOT a card grid.

```html
<a class="service-row" href="#book">
  <span class="service-row__num">01</span>
  <div class="service-row__body">
    <h4>Weekly broadcast emails</h4>
    <p>3–5 a week, end-to-end, in your voice. Belief-shift structure baked in.</p>
  </div>
  <span class="service-row__arrow" aria-hidden="true">→</span>
</a>
```

```css
.service-row {
  display: grid; grid-template-columns: 64px 1fr 32px;
  align-items: baseline; gap: var(--s-5);
  padding: var(--s-6) var(--s-5);
  border-top: 1px solid var(--color-border);
  color: var(--color-text); text-decoration: none;
  transition: background var(--d-base) var(--ease),
              transform var(--d-base) var(--ease),
              padding var(--d-base) var(--ease);
}
.service-row:last-child { border-bottom: 1px solid var(--color-border); }
.service-row__num   { font-family: var(--font-mono); font-size: 13px;
                      color: var(--color-text-faint); letter-spacing: var(--tracking-eyebrow); }
.service-row__body h4 { font-size: var(--text-h3); font-family: var(--font-display);
                        font-weight: 400; margin: 0 0 var(--s-2); }
.service-row__body p  { color: var(--color-text-soft); margin: 0; max-width: 60ch; }
.service-row__arrow   { opacity: 0; color: var(--color-accent);
                        transition: opacity var(--d-base) var(--ease),
                                    transform var(--d-base) var(--ease); }
.service-row:hover {
  background: var(--color-surface-1);
  padding-left: calc(var(--s-5) + 8px);
}
.service-row:hover .service-row__arrow { opacity: 1; transform: translateX(4px); }
```

---

## 8. Stat tile (results numbers)

```html
<div class="stat-tile">
  <span class="stat-tile__num"><em>47%</em></span>
  <p class="stat-tile__caption">Open rate on Easter promo for [Client]</p>
</div>
```

```css
.stat-tile { background: var(--color-surface-1); border: 1px solid var(--color-border);
             border-radius: var(--radius-md); padding: var(--s-7); }
.stat-tile__num { font-family: var(--font-display); font-weight: 300;
                  font-size: clamp(56px, 8vw, 96px); line-height: 0.96;
                  letter-spacing: -0.025em; color: var(--color-text); display: block; }
.stat-tile__num em { color: var(--color-accent); font-style: normal; }
.stat-tile__caption { font-family: var(--font-body); font-size: 14px;
                      color: var(--color-text-soft); margin-top: var(--s-4); max-width: 30ch; }
```

The number `<em>` is Tobacco. The `%`/`×`/`$` glyph stays Linen — the optical contrast highlights the figure.

Layout: 3 tiles in a row on desktop (1fr 1fr 1fr, gap `--s-5`); 1 column on mobile.

---

## 9. Testimonial — written

```html
<figure class="testimonial">
  <blockquote class="testimonial__quote">
    Rudy has provided me with more than I could ever ask for…
  </blockquote>
  <figcaption class="testimonial__attr">
    <img src="/assets/testimonials/joel-edgley.jpg" alt="" class="testimonial__avatar"/>
    <div>
      <strong>Joel Edgley</strong>
      <span>Owner, FINEDGE Media</span>
    </div>
  </figcaption>
</figure>
```

```css
.testimonial { background: var(--color-surface-1); border: 1px solid var(--color-border);
               border-radius: var(--radius-md); padding: var(--s-7); position: relative; }
.testimonial::before { /* big oversized open-quote behind the text */
  content: "\201C"; position: absolute; top: -12px; left: 16px;
  font-family: var(--font-display); font-size: 120px; line-height: 1;
  color: var(--color-accent); opacity: 0.4; pointer-events: none; }
.testimonial__quote { font-family: var(--font-display); font-style: italic; font-weight: 300;
                      font-size: var(--text-quote); line-height: 1.45; margin: 0 0 var(--s-5);
                      color: var(--color-text); }
.testimonial__attr  { display: flex; gap: var(--s-4); align-items: center; }
.testimonial__avatar { width: 48px; height: 48px; border-radius: 999px; object-fit: cover; }
.testimonial__attr strong { display: block; font-size: 15px; color: var(--color-text); }
.testimonial__attr span   { font-size: 13px; color: var(--color-text-soft); }
```

**No rendered `"…"` quotation marks in the text** — the oversized Tobacco glyph behind handles it. If a quote needs them visually, the `::before` pseudo handles it once.

---

## 10. Testimonial — video (featured slot)

The video testimonial is the centrepiece of the proof block. It must be lazy-loaded, accessible, and mobile-graceful.

```html
<figure class="testimonial-video" data-video-src="/assets/testimonials/matthew-volkwyn.mp4">
  <button class="testimonial-video__play" aria-label="Play testimonial">
    <img src="/assets/testimonials/matthew-volkwyn-video-poster.jpg" alt="Matthew Volkwyn" />
    <span class="testimonial-video__play-icon" aria-hidden="true">▶</span>
    <span class="testimonial-video__duration">1:24</span>
  </button>
  <figcaption class="testimonial-video__attr">
    <strong>Matthew Volkwyn</strong>
    <span>Founder, The Dojo · $10M+ generated via copywriting</span>
    <p class="testimonial-video__caption">
      A millionaire copywriter reads, reviews, and loves my copy. Zero feedback.
    </p>
  </figcaption>
</figure>
```

**Behaviour.**
- Default: poster image with `▶` overlay, no `<video>` element in the DOM yet.
- Click: replace the `<button>` with a `<video controls autoplay playsinline>` element. Video file is fetched only on click — saves bandwidth on first paint.
- Aspect ratio: 16:9 (poster image must be at this ratio — current asset is 380×371 ~ 1:1, the renderer will need to letterbox or Rudy supplies a 16:9 export).
- ESC / click-outside: pause video.
- Captions: include `<track kind="captions">` if available.

**Style.**

```css
.testimonial-video__play {
  position: relative; width: 100%; aspect-ratio: 16/9;
  border-radius: var(--radius-md); overflow: hidden; padding: 0; cursor: pointer;
  background: var(--color-surface-1); border: 1px solid var(--color-border);
}
.testimonial-video__play img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; }
.testimonial-video__play-icon {
  position: absolute; inset: 50% auto auto 50%; transform: translate(-50%, -50%);
  width: 64px; height: 64px; border-radius: 999px;
  background: rgba(139, 111, 78, 0.9); color: var(--color-text-inverse);
  display: grid; place-items: center; font-size: 18px; padding-left: 4px;
  transition: transform var(--d-base) var(--ease), background var(--d-base) var(--ease);
}
.testimonial-video__play:hover .testimonial-video__play-icon {
  background: var(--color-accent-hover);
}
.testimonial-video__duration {
  position: absolute; bottom: var(--s-3); right: var(--s-3);
  font-family: var(--font-mono); font-size: 12px;
  background: rgba(22,25,26,0.7); color: var(--color-text);
  padding: 4px 8px; border-radius: 2px;
}
```

This component must be **future-proof for 1–3 video testimonials** (Rudy will add more). Render up to 3 in a row on desktop (1fr × 3, gap `--s-5`); stack on mobile. If only 1 supplied, render full-width capped at `--container-narrow`.

---

## 11. Press-logo strip

```html
<section class="press-strip" aria-labelledby="press-strip-label">
  <p id="press-strip-label" class="eyebrow press-strip__caption">Taught by leaders featured in</p>
  <ul class="press-strip__row">
    <li><img src="/assets/press-logos/yahoo-finance.png" alt="Yahoo Finance" /></li>
    <li><img src="/assets/press-logos/nbc.png" alt="NBC" /></li>
    <li><img src="/assets/press-logos/forbes.png" alt="Forbes" /></li>
    <li><img src="/assets/press-logos/daily-mail.png" alt="Daily Mail" /></li>
    <li><img src="/assets/press-logos/kivodaily.png" alt="KivoDaily" /></li>
    <li><img src="/assets/press-logos/sam-robson-1.png" alt="Sam Robson" /></li>
  </ul>
</section>
```

```css
.press-strip { padding-block: var(--s-9); border-block: 1px solid var(--color-border); }
.press-strip__caption { display: block; text-align: center; color: var(--color-text-faint); margin-bottom: var(--s-7); }
.press-strip__row { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--s-8);
                    list-style: none; margin: 0; padding: 0; }
.press-strip__row img { height: 32px; width: auto;
                        filter: grayscale(1) brightness(0.9); opacity: 0.6;
                        transition: opacity var(--d-base) var(--ease), filter var(--d-base) var(--ease); }
.press-strip__row li:hover img { opacity: 1; filter: grayscale(1) brightness(1); }
@media (max-width: 768px) { .press-strip__row { gap: var(--s-5); } .press-strip__row img { height: 24px; } }
```

No carousel. No autoplay. Static row.

---

## 12. Selected-writing tile

```html
<a class="writing-tile" href="https://linkedin.com/posts/…" target="_blank" rel="noopener">
  <span class="writing-tile__date">2026 · MAR 12 · LINKEDIN</span>
  <p class="writing-tile__excerpt">[60–80 word excerpt in Newsreader 300]</p>
  <span class="link writing-tile__cta">Read on LinkedIn ↗</span>
</a>
```

```css
.writing-tile { display: flex; flex-direction: column; gap: var(--s-4);
                background: var(--color-surface-1); border: 1px solid var(--color-border);
                border-radius: var(--radius-md); padding: var(--s-6);
                color: var(--color-text); text-decoration: none;
                transition: border-color var(--d-base) var(--ease), transform var(--d-base) var(--ease); }
.writing-tile:hover { border-color: var(--color-border-strong); transform: translateY(-2px); }
.writing-tile__date    { font-family: var(--font-mono); font-size: 11px;
                         color: var(--color-text-faint); letter-spacing: var(--tracking-eyebrow);
                         text-transform: uppercase; }
.writing-tile__excerpt { font-family: var(--font-display); font-weight: 300;
                         font-size: 18px; line-height: 1.5; color: var(--color-text-soft); }
```

For the optional Instagram tile, drop the official `<blockquote class="instagram-media">` embed and lazy-load `embed.js` on viewport intersection.

---

## 13. FAQ accordion

Native `<details>` / `<summary>`, JS-augmented to open one at a time.

```html
<dl class="faq">
  <details class="faq__item">
    <summary class="faq__q">What does it cost?</summary>
    <div class="faq__a"><p>Retainers start at $2K–$3K USD/month…</p></div>
  </details>
  …
</dl>
```

```css
.faq__item { border-bottom: 1px solid var(--color-border); padding: var(--s-5) 0; }
.faq__q { display: flex; justify-content: space-between; align-items: center;
          font-family: var(--font-display); font-weight: 400; font-size: var(--text-h3);
          cursor: pointer; list-style: none; }
.faq__q::-webkit-details-marker { display: none; }
.faq__q::after { content: "+"; font-family: var(--font-mono); font-size: 20px;
                 color: var(--color-text-faint); transition: transform var(--d-base) var(--ease); }
.faq__item[open] .faq__q::after { content: "−"; }
.faq__a { padding-top: var(--s-4); color: var(--color-text-soft); max-width: 70ch; }
```

JS: when one `<details>` opens, close the others.

---

## 14. Inputs (used only on the contact form, if any)

```css
.input { width: 100%; height: 48px; padding: 0 16px;
         background: var(--input-bg); border: 1px solid var(--input-border);
         border-radius: var(--radius-sm); color: var(--input-text);
         font-family: var(--font-body); font-size: 16px;
         transition: border-color var(--d-base) var(--ease); }
.input::placeholder { color: var(--input-placeholder); }
.input:focus { border-color: var(--input-border-focus); outline: none; }
.input-label { font-family: var(--font-mono); font-size: var(--text-eyebrow);
               color: var(--color-text-faint); letter-spacing: var(--tracking-eyebrow);
               text-transform: uppercase; display: block; margin-bottom: var(--s-2); }
```

(Reminder: v1 has **no contact form**. Form styles live here for completeness only.)

---

## 15. Footer

Layout = 4 columns desktop, stack mobile. Already drafted in `03-content-master.md` §11. Component class is `.footer`. Bottom row uses `.footer__legal` with mono text.

```css
.footer { background: var(--color-bg); border-top: 1px solid var(--color-border);
          padding: var(--s-9) var(--gutter) var(--s-7); }
.footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
                gap: var(--s-7); max-width: var(--container-max); margin: 0 auto; }
@media (max-width: 768px) { .footer__grid { grid-template-columns: 1fr; gap: var(--s-6); } }
.footer__col h5 { font-family: var(--font-mono); font-size: var(--text-eyebrow);
                  letter-spacing: var(--tracking-eyebrow); color: var(--color-text-faint);
                  text-transform: uppercase; margin-bottom: var(--s-4); }
.footer__col ul { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--s-3); }
.footer__col a  { color: var(--color-text); text-decoration: none; font-size: 14px; }
.footer__col a:hover { color: var(--color-accent); }
.footer__legal { display: flex; justify-content: space-between; gap: var(--s-5);
                 max-width: var(--container-max); margin: var(--s-7) auto 0;
                 padding-top: var(--s-5); border-top: 1px solid var(--color-border);
                 font-family: var(--font-mono); font-size: 11px;
                 letter-spacing: var(--tracking-eyebrow); text-transform: uppercase;
                 color: var(--color-text-faint); }
```

---

## 16. Calendly modal

See `08-integrations.md` §1 for embed code. Component class `.calendly-modal`. The trigger element is any `[data-cta="primary"]` button — the JS hooks `click` and prevents default.

---

## 17. Skip-to-content link (a11y)

```html
<a href="#main" class="skip-link">Skip to content</a>
```

```css
.skip-link { position: absolute; left: -9999px; top: 0;
             background: var(--color-accent); color: var(--color-text-inverse);
             padding: var(--s-3) var(--s-5); z-index: 9999; }
.skip-link:focus { left: var(--s-3); top: var(--s-3); }
```

---

## 18. Naming conventions

- BEM-ish: `.block`, `.block__element`, `.block--modifier`. No deep nesting.
- Utility classes prefixed `u-`: `.u-narrow`, `.u-center` — use sparingly.
- Data-attrs for JS hooks: `data-reveal`, `data-cta`, `data-nav-theme`. Never hook off CSS classes.
- File-level CSS split: `tokens.css` → `base.css` (resets, typography defaults) → `components.css` (everything in this file) → `layout.css` (containers, sections, grid utilities). Import in that order.
