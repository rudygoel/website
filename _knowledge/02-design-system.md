# 02 — Design System

This file is the visual law. The full token file is `_knowledge/tokens.css` — copy it into the production stylesheet directory verbatim and `@import` it before any other CSS.

The longer-form spec it derives from is `references/brand-spec-v1.md`. Where this file disagrees with anything else, this file wins.

## 1. The palette — Pine & Tobacco

| Token | Hex | Name | Where it goes |
|---|---|---|---|
| `--color-bg` | `#16191A` | **Charcoal** | Page background. ~60% of any view. |
| `--color-surface-1` | `#1F2D2A` | **Pine Shadow** | Cards, sticky-nav background, form inputs, alternating section bands |
| `--color-surface-2` | `#3D5852` | **Pine** | Hover state for ghost surfaces, table row stripe, decorative fills |
| `--color-accent` | `#8B6F4E` | **Tobacco** | Primary CTA, italic accent words in headlines, eyebrows, link hover, decorative rules |
| `--color-text` | `#DDD3C4` | **Linen** | Primary text on dark. Wordmark colour. Inverted "light moment" background. |

Hierarchy: **60% Charcoal · 30% Pine Shadow + Linen · 10% Tobacco.**
The Tobacco budget is small. Reserve it for moments that need to be noticed.

### 1.1 Don't list (palette)

- ❌ Tobacco for body text.
- ❌ Pine and Pine Shadow side-by-side at the same hierarchy in one view (reads muddy).
- ❌ Pine as primary text on Charcoal (contrast borderline).
- ❌ Bright status colours (red errors, green success). Use Tobacco for emphasis, Linen at reduced opacity for muted states.
- ❌ Adding any colour not in the table above. If something needs distinction, use opacity, weight, or whitespace.

### 1.2 Pairing matrix

| Background | Primary text | Secondary text | Accent | Notes |
|---|---|---|---|---|
| Charcoal | Linen | Linen 72% | Tobacco | Default everywhere |
| Pine Shadow | Linen | Linen 72% | Tobacco | Cards, elevated |
| Pine | Linen | Linen 80% | Tobacco | Use carefully, busier |
| Tobacco | Charcoal | Charcoal 80% | Linen | CTA button only |
| Linen | Charcoal | Charcoal 70% | Tobacco | Inverted "light moment" testimonial section |

## 2. Typography

| Family | Use | Weight |
|---|---|---|
| **Newsreader** (variable serif, Google Fonts) | Display + H1–H3, italic accent words, pull quotes | 300 for display, 400 smaller, italic for accents |
| **Geist** (sans, Vercel/Google Fonts) | H4–H5, body, buttons, nav | 400 default, 500 emphasis, 350 ambient labels |
| **JetBrains Mono** | Eyebrows, section numbers, metadata, timestamps only | 400 |

Google Fonts import line (paste in `<head>`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Geist:wght@100..900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 2.1 Type scale (already in `tokens.css`)

| Token | Use |
|---|---|
| `--text-display-xl` | Hero headline (clamp 56→144px) |
| `--text-display-l` | Section opener (clamp 44→96px) |
| `--text-h1` → `--text-h5` | Standard headings |
| `--text-body-l` | Lead paragraph |
| `--text-body` | Default 16px |
| `--text-eyebrow` | Mono uppercase 11px, tracking 0.18em, Tobacco |
| `--text-quote` | Pull quotes, testimonials |

### 2.2 Italic rule

Newsreader Italic carries personality. Use it for **one** accent word inside a display headline (e.g. "Email copy that *quietly* prints money."). One italic emphasis per headline, never more.

Don't italicise body copy. Geist has italics — don't use them.

### 2.3 Type don'ts

- ❌ Geist for anything above H4. (Serif up top, sans below.)
- ❌ Body line-height under 1.5.
- ❌ Justified text. Left-aligned, ragged right, always.
- ❌ ALL CAPS for body. Eyebrows and short mono labels only.
- ❌ Drop shadows on text.
- ❌ More than two type sizes inside a single short component (button, card, badge).
- ❌ Mixing in any other typeface — Newsreader and Geist alone.

## 3. Spacing

Multiples of 4. Names not pixels.

```
--s-1: 4px   --s-7: 48px
--s-2: 8px   --s-8: 64px
--s-3: 12px  --s-9: 96px   (between sections, tablet)
--s-4: 16px  --s-10: 128px (between sections, desktop)
--s-5: 24px  --s-11: 160px (hero / dramatic)
--s-6: 32px
```

**Section padding:** `padding-block: clamp(80px, 12vw, 160px);` default. Hero gets `clamp(120px, 18vw, 240px)` top.

## 4. Layout

- `--container-max: 1280px` general
- `--container-narrow: 720px` long reading copy
- `--container-wide: 1440px` full-bleed atmosphere
- `--gutter: 24px` desktop / `16px` mobile
- 12-col desktop / 8-col tablet / 4-col mobile, but the brand prefers **single-column with max-widths over grid**. Use the grid only for hero arrangements, image+text rows, case-study layouts.

### 4.1 Asymmetry rule

This brand prefers asymmetry to centred layouts:

- Headlines sit **left**, with a wide right margin
- Body capped at 60–70 characters per line, indented from headline
- Eyebrows offset above and slightly indented
- Section heads have right-aligned metadata (date, number, status)

The only centred layout permitted is the inverted "light moment" testimonial panel.

## 5. Radius

```
--radius-sm: 2px    (buttons, inputs — sharp / editorial)
--radius-md: 4px    (cards)
--radius-lg: 8px    (rare — large media wrappers)
--radius-pill: 999px (avoid; only badges if needed)
```

Never go above 8px. Sharp corners are part of the editorial feel.

## 6. Elevation

Borders over shadows. The brand has shadow tokens defined but use them sparingly.

```
--shadow-sm: 0 1px 2px rgba(0,0,0,0.2);
--shadow-md: 0 8px 24px rgba(0,0,0,0.3);
--shadow-lg: 0 24px 48px rgba(0,0,0,0.4);
```

Card hover = border colour change + 2px translateY, not shadow.

## 7. Iconography

This is a **type-led** brand. Default to no icons.

- ❌ No icons in nav.
- ❌ No icons in service cards (the live demo3 reference has zero icons — match that).
- ✅ Allowed: small Tobacco rule (`<hr>`-style) as a section accent.
- ✅ Allowed: footer social icons (Instagram, LinkedIn, TikTok, YouTube). Simple monochrome SVG, Linen colour. Use the existing icon files in `assets/icons/` as visual reference but redraw as clean SVGs at 20×20.
- ✅ Allowed: a single oversized Tobacco glyph (open quote `“` at 0.4 opacity) as a decorative background behind a pull quote.

## 8. Background atmospherics

Charcoal is the floor. To break monotony on long scroll:

```css
body::before {
  content: "";
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,111,78,0.06), transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(61,88,82,0.05), transparent 60%);
}
```

Optional: SVG noise overlay at 5–6% opacity for subtle film grain.

**Forbidden atmospherics:** mesh gradients, glassmorphism, animated blobs, any gradient that isn't the two radial whispers above.

## 9. Logo / wordmark

- **Wordmark only — no symbol, no monogram, no headshot-in-circle logo.** This is a type-driven brand.
- "RUDY GOEL" — Newsreader 400, uppercase, tracking `0.04em`.
- Optional descriptor below: "EMAIL COPY" — Geist 400, uppercase, 11px, tracking `0.32em`.
- Min size: 24px wordmark height.
- Clearspace = cap height of the wordmark on all sides.
- Always Linen on dark. Always Charcoal on Linen.

The existing `rudy-logo-headshot.png` (Rudy's face inside a circle) from the old Wix site **is not the new logo.** Don't use it as the brand mark. It can appear as a portrait inside an About section, but the wordmark replaces it for nav, OG card, favicon.

## 10. Favicon / OG image

- **Favicon:** SVG, "RG" monogram in Newsreader, Linen on Charcoal, 32×32. Round-square mask for Apple touch icon.
- **OG image (1200×630):** Charcoal background. Wordmark "RUDY GOEL" centre-ish-left at 80px height. Below it, in Geist 28px, Linen 72%: "Email & Creative Strategy for Coaches." Tobacco hairline rule (1px × 64px) bottom-left as accent.

## 11. Accessibility

- All text must hit WCAG AA contrast.
- Don't rely on Tobacco alone to indicate state — also use weight, underline, or border.
- Visible focus everywhere: `outline: 2px solid var(--color-accent); outline-offset: 2px;`
- `prefers-reduced-motion` must kill all motion (already in `tokens.css`).
- Sensible heading hierarchy: only one `<h1>` per page (the hero), no skipping levels.
- All images need `alt` text. Decorative images get `alt=""` (empty, not absent).

## 12. The "did I do it right?" sniff test

Before declaring a section done, check:

- [ ] Charcoal background or Pine Shadow card — nothing else.
- [ ] Tobacco appears only as: CTA, eyebrow, italic accent word, link hover, or hairline.
- [ ] Headlines are Newsreader. Body is Geist. Mono only for eyebrows/numbers.
- [ ] One italic word maximum per headline.
- [ ] No icons except (maybe) social bar in footer.
- [ ] Layout is left-asymmetric, not centred (testimonial panel excepted).
- [ ] No shadows. Borders only.
- [ ] No gradients except the two-layer radial whispers from §8.
