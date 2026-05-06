# 04 — Motion & Animation

This site uses motion the same way it uses Tobacco — sparingly, on purpose, and never just because it can.

The motion vocabulary is borrowed in spirit from **demo1 (Juan Mora)** but stripped to ~40% of the volume. Demo1 has GSAP, Lenis, custom cursor, UnicornStudio WebGL, SplitText, ScrollTrigger, IntersectionObserver theme-swap. We will use most of those primitives — *quietly*.

We do **not** import Framer Motion or any heavy animation framework. Everything is GSAP + Lenis + vanilla CSS + a single optional WebGL shader.

Companion file: `tokens.css` already contains the motion tokens listed below.

---

## 1. Motion tokens

```css
--ease:        cubic-bezier(0.2, 0.7, 0.2, 1);  /* default */
--ease-out:    cubic-bezier(0,   0,   0.2, 1);
--ease-in:     cubic-bezier(0.4, 0,   1,   1);
--ease-in-out: cubic-bezier(0.4, 0,   0.2, 1);

--d-fast:     180ms;   /* hover, focus, micro */
--d-base:     280ms;   /* most transitions */
--d-slow:     480ms;   /* heavier reveals */
--d-pageload: 900ms;   /* hero stagger total */
```

GSAP custom ease (registered once at boot — borrows demo1's "osmo" ease, renamed):

```js
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);

CustomEase.create("rg", "0.625, 0.05, 0, 1");
gsap.defaults({ duration: 0.6, ease: "rg" });
```

**Rule:** every GSAP tween uses ease `"rg"` unless explicitly justified.

---

## 2. The forbidden list (read first)

If a temptation matches anything below, don't ship it:

- ❌ Bouncy easing (`elastic`, `back.out` higher than `1.2`).
- ❌ Spring physics (no Framer-Motion spring presets).
- ❌ 3D transforms (`rotateX/Y`, `perspective`, flip cards).
- ❌ Parallax greater than 8% movement.
- ❌ Looping animations on text, logos, or CTAs (no `infinite` keyframes anywhere).
- ❌ Section-transition wipes / curtain reveals between sections — brand prefers honest cuts.
- ❌ Typewriter / character-cycling effects.
- ❌ Gradient hue rotation, animated mesh blobs, shader noise that "wobbles".
- ❌ Scale-on-hover for buttons, cards, or images.
- ❌ Drop-shadow-on-hover.
- ❌ "Scroll-jacking" that hijacks scroll speed — Lenis smooth-scroll only, no snap-pinning except where listed in §6.

---

## 3. Page load — the landing animation

The hero is the first thing they see. It does **one** orchestrated thing then stops.

**Sequence (total ~900ms, `--d-pageload`):**

1. `t=0` — page is Charcoal, body `opacity: 0`.
2. `t=80ms` — body fades in over 200ms.
3. `t=200ms` — eyebrow ("EMAIL · CREATIVE STRATEGY · COACHES") fades up 12px, 480ms.
4. `t=320ms` — headline runs SplitText *word* mask reveal (NOT character — chars are too busy for a serif this size). Each word is wrapped in `overflow:hidden`, the inner span animates `y: 110% → 0`, stagger 60ms, duration 700ms.
5. `t=480ms` — italic accent word inside headline gets an extra `letterSpacing: 0.02em → 0` ease over 600ms (very subtle, almost-imperceptible "settle").
6. `t=700ms` — sub-headline fades up 8px, 480ms.
7. `t=900ms` — primary CTA button fades up 8px + border draws (see §5.2), 280ms.
8. `t=1080ms` — hero footer metadata (BRISBANE · AVAILABLE · 02 SPOTS) fades to Linen 48%, 280ms.
9. WebGL shader (§7) starts its 30s slow gradient drift in the background at `t=200ms` and never stops (CPU-cheap; respects `prefers-reduced-motion`).

**ScrollTrigger `kill` on first user scroll:** if the user scrolls before the hero animation finishes, fast-forward to the end state in 120ms. Don't trap them.

**Reduced motion:** skip steps 3–7 entirely. Render everything at final state. Step 1–2 stays (a 200ms body fade is acceptable).

---

## 4. Smooth scroll (Lenis)

Demo1 uses Lenis at `lerp: 0.1, wheelMultiplier: 1`. We match.

```js
import Lenis from "lenis";

const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 1,
  smoothWheel: true,
  smoothTouch: false, // never on mobile
});
function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

**Rules:**
- Smooth scroll is **desktop only**. Mobile uses native scrolling — Lenis on mobile feels broken on iOS Safari.
- `prefers-reduced-motion: reduce` → don't initialise Lenis at all.
- Anchor links route through `lenis.scrollTo(target, { offset: -80, duration: 1.2, easing: t => 1 - Math.pow(1 - t, 3) })`.

---

## 5. Hover behaviour

### 5.1 Default link hover (any `<a>` in body)

```css
a {
  text-decoration: underline;
  text-decoration-color: var(--color-text-faint);
  text-underline-offset: 4px;
  transition: text-decoration-color var(--d-base) var(--ease);
}
a:hover { text-decoration-color: var(--color-accent); }
```

That's it. No colour shift on text. No translation. The underline going Tobacco is the entire interaction.

### 5.2 Primary CTA button (Tobacco fill)

- Default: `background: var(--color-accent)` Tobacco, `color: var(--color-text-inverse)` Charcoal.
- Hover: `background: var(--color-accent-hover)` (#A38561, slightly brighter). 280ms `--d-base`. **No scale, no translate, no shadow.**
- Active: `background: var(--color-accent-active)` (#7A6044).
- Optional **icon-swap on hover** (borrowed from demo1's `.main-cont-button` pattern, refined): an arrow `→` glyph slides in from the right, default-state arrow shrinks to width 0. Use `gsap.to(icon, { width: 0, x: -8, duration: 0.3, ease: "power2.out" })` and reveal the new arrow with the inverse. Never use `elastic.out` for this swap.

### 5.3 Secondary button

- Default: transparent, 1px Linen-18% border.
- Hover: background fills `Pine Shadow`, border fades to transparent, 280ms.
- No translate, no scale.

### 5.4 Cards (services, selected-writing, testimonials)

```css
.card {
  border: 1px solid var(--color-border);
  transition: border-color var(--d-base) var(--ease), transform var(--d-base) var(--ease);
}
a.card:hover, .card:hover {
  border-color: var(--color-border-strong);
  transform: translateY(-2px);
}
```

**2px translate. That's the entire card lift.** No shadow. No background change.

### 5.5 Service-list rows (the stacked rows in §SECTION 4 of content)

This is the brand's signature row hover. Borrowed from demo1's case-study list.

- Default: full-width row, hairline top border, Charcoal background, eyebrow + title + description.
- Hover: background fills Pine Shadow (`--color-surface-1`) over 280ms; the entire row content slides right by 8px (`transform: translateX(8px)`); a small Tobacco arrow `→` fades in on the right edge. Title gets a subtle Tobacco underline appear (1px, animates in from left over 400ms via `transform: scaleX(0) → 1; transform-origin: left`).
- Click target = the whole row.

### 5.6 Nav links (top bar)

- Default: Geist 400, 14px, Linen.
- Hover: 1px Tobacco underline animates in from the **left**, 280ms (NOT centre, NOT bevel). Same scaleX trick as the row hover.
- Active section (set by ScrollTrigger / IntersectionObserver): underline stays drawn, colour shifts to Tobacco.

### 5.7 Press-logo strip

- Default: each logo at 60% opacity, monochrome (CSS `filter: grayscale(1) brightness(0.9) opacity(0.6)`).
- Hover: `opacity: 1`, no filter change. 280ms.

---

## 6. Scroll behaviour

### 6.1 Section reveal (apply to every major section ONCE — not to every element)

```js
gsap.utils.toArray("[data-reveal]").forEach((el) => {
  gsap.from(el, {
    y: 16,
    autoAlpha: 0,
    duration: 0.7,
    ease: "rg",
    scrollTrigger: {
      trigger: el,
      start: "top 82%",
      once: true,
    },
  });
});
```

Mark the section's `eyebrow + heading + lead-paragraph` cluster as `data-reveal`. Don't `data-reveal` every paragraph, every card, every image — pick one anchor per section.

### 6.2 The Shift (§SECTION 2) — pinned belief-flip

The brand's one structural moment of motion. As the user scrolls past the §02 heading:

- Heading reveals via SplitText word-mask (same primitive as hero, but only on its `<em>` accent word).
- The pull quote at the end of the section gets a slow `letter-spacing: -0.005em → -0.022em` tween over 1200ms as it enters view (very subtle settle).
- That's all. No pinning, no horizontal scroll.

### 6.3 Press-logo strip — drift, do not loop

DO NOT use a Swiper carousel or a CSS marquee. The old Wix site has a slider; demo2 has dual marquees; we're not doing either.

Instead: render a **static** row of 6 logos centered in the viewport, fade them in once on scroll-into-view at 60% opacity. If the row overflows on small screens, allow horizontal touch scroll (`overflow-x: auto; scroll-snap-type: x mandatory`) — no autoplay, no arrows.

### 6.4 Nav theme-swap on scroll

Borrowed from demo1's `data-nav` IntersectionObserver pattern, simplified.

- Above hero: nav transparent.
- After scrolling past hero: nav background = `rgba(22, 25, 26, 0.85)` with `backdrop-filter: blur(12px)`. 280ms transition.
- Inside the inverted "Testimonial" section (Linen background): nav inverts — background → `rgba(221, 211, 196, 0.9)`, text → Charcoal.
- Implementation: tag the testimonial section with `data-nav-theme="light"` and use IntersectionObserver to swap a class on `<nav>`.

### 6.5 Scroll progress indicator (optional)

- Tiny 1px Tobacco bar at the very top of the viewport, `width: scrollY / scrollMax`. Use `transform: scaleX()` for cheap GPU rendering. Cap opacity at 60%.
- Skip on mobile.

---

## 7. WebGL — UnicornStudio shader (optional, recommended)

Demo1 uses [UnicornStudio](https://unicorn.studio) for its hero gradient. It's a no-code WebGL shader engine that exports a `<div>` you mount, plus their UMD loader.

**Use it for:** a single, very subtle, very slow Charcoal-to-Pine-Shadow gradient drift behind the hero. The shader sits at `z: 0`, pointer-events none, opacity ~0.6. The hero text sits at `z: 10`.

**Brief for Rudy / designer to build the shader in UnicornStudio:**
- Background colour: `#16191A` (Charcoal)
- Two soft noise blobs:
  - Blob A — colour `#1F2D2A` (Pine Shadow), size ~80% viewport, opacity 0.5, drift speed 0.05
  - Blob B — colour `#8B6F4E` (Tobacco), size ~30% viewport, opacity 0.08, drift speed 0.03
- Noise: low-frequency Perlin, very slow
- Export as embed; load script lazily.

**Lazy mount** (don't block FCP):

```js
if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
import("unicornstudio").then(({ default: UnicornStudio }) => {
  UnicornStudio.init({ scale: 1, dpi: 1.5 });
});
```

**If you can't / don't want UnicornStudio**, the radial gradient fallback in `02-design-system.md` §8 is the alternative. The site looks complete without WebGL — the shader is a nicety, not a requirement.

**Three.js, Spline, Rive, p5.js — none of them. UnicornStudio or nothing.**

---

## 8. Custom cursor (desktop only, opt-in)

Demo1 has a beautiful custom cursor. We can have a *muted* version of it. **It is optional.** If you ship without it, the site is fine.

Spec if you build it:

- 8px Linen dot, opacity 0.7, follows mouse via GSAP ticker lerp:
  ```js
  const lerp = 1 - Math.pow(1 - 0.12, deltaRatio);
  ```
- Hover over interactive: dot scales to 32px, becomes Tobacco at 50% opacity, mix-blend-mode `difference`.
- Hover over CTA button: dot expands to a 64px circle and reveals copy "Book the audit ↗" inside (Newsreader italic, Linen). Borrows demo1's contextual-cursor-text pattern. Use SplitText char stagger with `ease: "rg"` (NOT `back.out` — read the forbidden list).
- Hide cursor on touch devices (`@media (hover: none)`).

---

## 9. Calendly modal opening

When primary CTA is clicked:

- Don't navigate. Open Calendly in a modal popup using the official Calendly inline widget.
- Modal backdrop: `rgba(22, 25, 26, 0.85)` Charcoal scrim, fades in 280ms.
- Modal panel: Pine Shadow background, max-width 720px, slides up 16px while fading in over 480ms.
- Close button: 24×24 icon top-right, Linen 72%, hover Tobacco. ESC key + backdrop click also close.
- Body scroll: locked while open (`overflow: hidden`).
- See `08-integrations.md` for full Calendly embed details.

---

## 10. Reduced motion (mandatory)

Every animation in this guide must respect `prefers-reduced-motion: reduce`. The token CSS already nukes durations to `0.01ms` globally, but a few specifics:

- Hero landing: render at end-state immediately.
- ScrollTrigger reveals: don't initialise.
- Lenis: don't initialise.
- WebGL shader: don't load.
- Custom cursor: don't render.
- Card hover: keep colour change, drop the 2px translate.
- Calendly modal: open instantly without slide-up.

Implement as a single `motion.ts` boot file that early-returns when reduced-motion is set:

```ts
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduced) {
  document.documentElement.dataset.motion = "off";
  return;
}
// ...all motion init goes here
```

---

## 11. Performance budget

If any of these are exceeded, reduce motion before shipping:

- LCP < 2.0s on 4G mobile (the hero text, not the WebGL).
- Bundle: GSAP + plugins ≤ 60 KB gzipped. Lenis ≤ 8 KB. UnicornStudio ≤ 150 KB lazy-loaded after FCP.
- No animation should keep `requestAnimationFrame` busy after the user has been idle for 3 seconds, **except** the WebGL hero shader (which is GPU-accelerated and CPU-cheap).
- ScrollTrigger: use `once: true` for any reveal. Don't keep observers alive after first fire.

---

## 12. Stack summary

| Library | Use |
|---|---|
| **GSAP** + CustomEase + SplitText + ScrollTrigger | All entrance animations, hover icon-swap, scroll reveals |
| **Lenis** | Smooth scroll, desktop only |
| **UnicornStudio** *(optional)* | Hero WebGL gradient |
| **No Framer Motion**, no three.js, no Anime.js, no Rive, no Lottie | — |

That's the entire motion stack. Anything more and we've drifted into demo2 territory.
