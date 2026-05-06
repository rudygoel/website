# Rudy Goel / Brand Spec v1.0

> Email copywriting studio. Quiet luxury, editorial restraint, lived-in warmth.
> Pine & Tobacco palette, Newsreader + Geist typography.
> This document is the source of truth. If something contradicts it, this wins.

---

## 0. Quick reference

| Thing | Value |
|---|---|
| Brand name | Rudy Goel |
| Working tagline | Email copy for founders who'd rather not sound like every other newsletter. |
| Aesthetic | Quiet luxury, editorial, dark, lived-in |
| Palette | Pine & Tobacco |
| Display font | Newsreader (variable) |
| Body font | Geist |
| Mono / utility font | JetBrains Mono |
| Default theme | Dark |
| Light theme | Optional inversion (Linen surface, Charcoal text) |

---

## 1. Colour system

### 1.1 Palette tokens

| Token | Hex | Name | Role |
|---|---|---|---|
| `--color-bg` | `#16191A` | Charcoal | Primary background, ~60% of any composition |
| `--color-surface-1` | `#1F2D2A` | Pine Shadow | Cards, elevated surfaces, dividers |
| `--color-surface-2` | `#3D5852` | Pine | Secondary surfaces, hover, subtle accent fills |
| `--color-accent` | `#8B6F4E` | Tobacco | Accent only, ~5-10% of composition. Never body text. |
| `--color-text` | `#DDD3C4` | Linen | Primary text on dark, light surface in inverted sections |

### 1.2 Derived tokens

| Token | Value | Use |
|---|---|---|
| `--color-text-soft` | `rgba(221, 211, 196, 0.72)` | Secondary text, descriptions, lead-ins |
| `--color-text-faint` | `rgba(221, 211, 196, 0.48)` | Captions, metadata, eyebrows |
| `--color-text-inverse` | `#16191A` | Text on Linen surfaces |
| `--color-accent-soft` | `rgba(139, 111, 78, 0.14)` | Accent button hover, soft fills |
| `--color-accent-strong` | `#A38561` | Accent hover state, slightly brighter |
| `--color-border` | `rgba(221, 211, 196, 0.08)` | Default borders, hairlines |
| `--color-border-strong` | `rgba(221, 211, 196, 0.18)` | Active borders, focused inputs |
| `--color-overlay` | `rgba(22, 25, 26, 0.85)` | Modal backdrops |

### 1.3 Usage hierarchy (60 / 30 / 10)

- **60% Charcoal**, the page background everywhere by default
- **30% Pine Shadow + Pine + Linen**, surfaces, text, dividers
- **10% Tobacco**, the accent. Reserve for moments that need to be noticed

### 1.4 Where each colour goes

**Charcoal `#16191A`**
- Page background
- Footer background
- Body text on Linen surfaces (i.e. inverse text)
- Default body background, do not deviate without reason

**Pine Shadow `#1F2D2A`**
- Card backgrounds
- Quoted blocks
- Section background variation, used to give long pages rhythm
- Form input backgrounds
- Sticky nav background once scrolled

**Pine `#3D5852`**
- Hover state for ghost / secondary surfaces
- Subtle decorative fills like pull-quote backgrounds
- Active state on tabs / nav items
- Row striping in tables (alternating with Charcoal)
- Avoid using as text colour, contrast is borderline

**Tobacco `#8B6F4E`**
- Primary CTA button background
- Italicised phrase highlights inside display headlines
- Active link state
- Underline on hover for nav links
- Eyebrow labels (sparingly)
- Small decorative dots, rules, list markers
- The single accent in any given composition

**Linen `#DDD3C4`**
- Primary text on all dark surfaces
- Logo / wordmark colour on dark backgrounds
- Border colour at reduced alpha
- Background colour for inverted "light moment" sections (about, testimonial, CTA panels)

### 1.5 Don't list

- Don't use Tobacco for body copy. Contrast on Charcoal is fine for accents but tiring at length
- Don't use two greens at the same hierarchy in the same view (Pine and Pine Shadow side by side as equals reads muddy)
- Don't use Pine as a primary text colour on Charcoal, contrast is too low
- Don't add bright status colours (red errors, green success). Use Tobacco for emphasis, Linen with reduced opacity for muted states
- Don't introduce new colours. If something needs distinction, use opacity, weight, or whitespace instead

### 1.6 Pairing matrix

Quick reference for what works on what.

| Background | Primary text | Secondary text | Accent | Notes |
|---|---|---|---|---|
| Charcoal | Linen | Linen 72% | Tobacco | Default |
| Pine Shadow | Linen | Linen 72% | Tobacco | Card / elevated |
| Pine | Linen | Linen 80% | Tobacco | Use carefully, busier |
| Tobacco | Charcoal | Charcoal 80% | Linen | CTA button only |
| Linen | Charcoal | Charcoal 70% | Tobacco | Inverted section |

---

## 2. Typography

### 2.1 Fonts

- **Display: Newsreader** (Google Fonts, variable). Used for everything from hero headlines down to H3. Weight 300 for display sizes, 400 for smaller headings. Italic for accent phrases.
- **Body: Geist** (Google Fonts / Vercel). Used for everything from H4 down. Weight 400 default, 500 for emphasis, 350 for ambient labels.
- **Utility: JetBrains Mono**. Eyebrows, metadata, hex codes, version tags, timestamps. Weight 400.

### 2.2 Type scale

Mobile size first, desktop after with `clamp()` where it scales. Line height assumes display rhythm.

| Token | Use | Family | Weight | Size (mobile / fluid) | Line-height | Tracking |
|---|---|---|---|---|---|---|
| `--text-display-xl` | Hero headline, biggest moment | Newsreader | 300 | `clamp(56px, 9vw, 144px)` | 0.96 | -0.025em |
| `--text-display-l` | Section opener | Newsreader | 300 | `clamp(44px, 7vw, 96px)` | 0.98 | -0.022em |
| `--text-h1` | Page-level heading | Newsreader | 400 | `clamp(36px, 5vw, 64px)` | 1.04 | -0.02em |
| `--text-h2` | Major section heading | Newsreader | 400 | `clamp(28px, 4vw, 44px)` | 1.1 | -0.015em |
| `--text-h3` | Subsection heading | Newsreader | 400 | `clamp(22px, 3vw, 32px)` | 1.15 | -0.01em |
| `--text-h4` | Card titles, small sections | Geist | 500 | `20px` | 1.3 | -0.005em |
| `--text-h5` | Inline labels, list headers | Geist | 500 | `16px` | 1.4 | 0 |
| `--text-body-l` | Lead paragraph, intros | Geist | 400 | `clamp(17px, 1.4vw, 19px)` | 1.55 | 0.005em |
| `--text-body` | Default paragraph | Geist | 400 | `16px` | 1.6 | 0.005em |
| `--text-body-s` | Secondary paragraph, footnotes | Geist | 400 | `14px` | 1.55 | 0.01em |
| `--text-caption` | Image captions, microcopy | Geist | 400 | `13px` | 1.5 | 0.015em |
| `--text-eyebrow` | Small uppercase label, kicker | JetBrains Mono | 400 | `11px` | 1.4 | 0.18em uppercase |
| `--text-quote` | Pull quotes, testimonials | Newsreader italic | 300 | `clamp(20px, 2.4vw, 28px)` | 1.45 | -0.005em |

### 2.3 Italic usage

- **Newsreader Italic** carries personality. Use it for the accent word inside a display headline (e.g. "Better *emails*."), for pull quotes, and for occasional emphasis.
- Don't italicise body copy. Geist has italic but it's not part of this brand's voice.
- One italic emphasis per headline maximum.

### 2.4 Variable font settings

Newsreader is variable on optical size. At display sizes use `font-optical-sizing: auto` or set `font-variation-settings: "opsz" 72`. At body H3/H4 use `"opsz" 24`. Browser default is fine for most cases.

```css
.headline {
  font-family: 'Newsreader', serif;
  font-weight: 300;
  font-variation-settings: "opsz" 72;
  letter-spacing: -0.022em;
  line-height: 0.98;
}
```

### 2.5 Don't list

- Don't mix Newsreader with another serif. Geist is the only sans here.
- Don't use Geist for anything above H4. The rhythm is "serif up top, sans below".
- Don't tighten body line-height below 1.5.
- Don't justify text. Left-aligned only, ragged right.
- Don't use ALL CAPS for body. Reserve uppercase for eyebrows and small mono labels.
- Don't use more than two type sizes inside a single short component (card, button, badge).
- Don't use drop shadows on text.

---

## 3. Spacing

### 3.1 Scale

Multiples of 4. Use names not pixel values.

| Token | Pixels | Use |
|---|---|---|
| `--s-1` | 4px | Hairline gaps, icon-text spacing |
| `--s-2` | 8px | Tight stacking inside components |
| `--s-3` | 12px | Default small gap |
| `--s-4` | 16px | Standard component padding |
| `--s-5` | 24px | Default block spacing |
| `--s-6` | 32px | Section subgrouping |
| `--s-7` | 48px | Between component groups |
| `--s-8` | 64px | Between sections (mobile) |
| `--s-9` | 96px | Between sections (tablet) |
| `--s-10` | 128px | Between sections (desktop) |
| `--s-11` | 160px | Hero / dramatic openers |

### 3.2 Section padding rule

Use `padding-block: clamp(80px, 12vw, 160px)` as default vertical section padding. Hero gets `clamp(120px, 18vw, 240px)` top, normal bottom.

### 3.3 Container

- `--container-max: 1280px` for general content
- `--container-narrow: 720px` for long reading copy and case studies
- `--container-wide: 1440px` for full-bleed atmospheric sections
- `--gutter: 24px` desktop, `16px` mobile

---

## 4. Layout & breakpoints

### 4.1 Breakpoints

```css
/* Mobile first. Min-width queries. */
--bp-sm: 540px;   /* small tablet */
--bp-md: 768px;   /* tablet */
--bp-lg: 1024px;  /* small desktop */
--bp-xl: 1280px;  /* desktop */
--bp-2xl: 1536px; /* large desktop */
```

### 4.2 Grid

- Desktop: 12 column, 24px gutter
- Tablet: 8 column, 20px gutter
- Mobile: 4 column, 16px gutter
- For most content, ignore the grid and use single-column with max-widths. The grid is for hero arrangements, image+text rows, case study layouts.

### 4.3 Asymmetry

This brand prefers asymmetry to centred layouts.
- Headlines often sit left, with a wide right margin
- Body copy often capped at 60-70 characters per line, indented from headline
- Eyebrows often offset, sitting above and slightly indented
- Section heads often have right-aligned metadata (date, number, status)

---

## 5. Components

### 5.1 Logo / Wordmark

- Wordmark only, no symbol. Type-driven brand.
- "RUDY GOEL" in Newsreader 400, uppercase, tracking `0.04em`
- Optional descriptor below: "EMAIL COPY" in Geist 400, uppercase, 11px, tracking `0.32em`
- Min size: 24px wordmark height
- Clearspace: equal to the cap height of the wordmark, on all sides
- Always Linen on dark, always Charcoal on Linen

### 5.2 Buttons

Three variants. All buttons use Geist 500, 14-15px, tracking `0.02em`, height 48px desktop / 44px mobile.

#### Primary CTA
- Background: Tobacco `#8B6F4E`
- Text: Charcoal `#16191A`
- Hover: background shifts to `#A38561` (Tobacco strong), text unchanged
- Active: background shifts to `#7A6044`, text unchanged
- Border-radius: 2px (sharp, editorial)
- Padding: `0 24px`
- Use for: the single most important action on a page (book a call, get in touch). One per section, ideally one per page above the fold.

#### Secondary
- Background: transparent
- Border: 1px solid Linen `--color-border-strong`
- Text: Linen
- Hover: background fills `Pine Shadow` `#1F2D2A`, border fades, text stays Linen
- Active: background `Pine` `#3D5852`
- Use for: secondary actions like "view case study", "see all work"

#### Ghost / text link
- Background: none
- Text: Linen
- Underline: 1px solid `--color-text-faint`, offset 4px
- Hover: underline becomes Tobacco, text stays Linen
- Use for: in-text links, footer links, supporting nav

```html
<a class="btn btn-primary" href="#contact">Book a call</a>
<a class="btn btn-secondary" href="#work">See the work</a>
<a class="link" href="#about">About Rudy</a>
```

### 5.3 Cards

- Background: Pine Shadow `#1F2D2A`
- Border: 1px solid `--color-border`
- Border-radius: 4px
- Padding: `--s-6` (32px) standard, `--s-7` (48px) for feature cards
- Hover (when interactive): border becomes `--color-border-strong`, lifts 2px

```html
<article class="card">
  <span class="eyebrow">Case 01</span>
  <h3>Welcome flow rebuild for a Series B SaaS</h3>
  <p class="body-soft">A six-email sequence...</p>
  <a class="link">Read more</a>
</article>
```

### 5.4 Inputs / Forms

- Background: Pine Shadow `#1F2D2A`
- Border: 1px solid `--color-border`
- Text: Linen
- Placeholder: `--color-text-faint`
- Focus border: Tobacco `#8B6F4E`
- Height: 48px
- Padding: `0 16px`
- Border-radius: 2px
- Label: above input, `--text-eyebrow` style (mono, uppercase, tracked, faint)

### 5.5 Navigation

- Position: top, transparent over hero, sticky on scroll
- Sticky state: background `rgba(22, 25, 26, 0.85)` with backdrop blur 12px
- Logo on left, nav links on right
- Nav link style: Geist 400, 14px, Linen, tracking 0.01em
- Active link: Tobacco
- Hover: underline animates in from left (1px Tobacco)
- Mobile: hamburger menu opens full-screen drawer with stacked links in larger size (Newsreader 32px)

### 5.6 Section header pattern

Reusable pattern, used at the top of most page sections.

```html
<header class="section-head">
  <span class="num">02</span>
  <h2>Section heading <em>with italic accent</em></h2>
  <span class="meta">Optional metadata</span>
</header>
```

- Number in mono, faint
- Heading in Newsreader, weight 300 at large, italic word inside is the accent
- Optional metadata right-aligned in mono uppercase faint
- Bottom border 1px `--color-border`, padding-bottom `--s-4`

### 5.7 Pull quote / testimonial

- Background: optional, can be on Pine Shadow card or just Charcoal
- Quote text: Newsreader italic, weight 300, `--text-quote` size
- Attribution: Geist 400, 14px, Linen 72%
- No quotation marks rendered as text. If decorative quote marks are wanted, use a single Tobacco oversized quotation glyph as background, opacity 0.4, behind the text.

### 5.8 Footer

- Background: Charcoal (same as page) with 1px top border
- Layout: 4 columns desktop, stack on mobile
- Wordmark + tagline left, link columns right
- Bottom row: copyright in mono faint, social links right
- Generous padding, `--s-9` minimum top

---

## 6. Imagery

This is a typography-led brand, photography is optional and minimal.

### 6.1 If using photography

- Editorial, low-saturation, slightly desaturated
- Warm shadow tones over cool ones
- Subjects: workspace details, paper, screens with email drafts, hands writing, ambient interiors. No stock-y "happy people on laptops"
- Treatment: optional duotone using Charcoal + Linen
- Aspect: prefer 4:5 or 3:4 portrait, or 16:9 wide. Avoid square.
- Don't use icons or illustrations. If a visual is needed, use type or a thin rule.

### 6.2 Backgrounds & atmosphere

- Allowed: extremely subtle radial gradients using Tobacco at 4-8% over Charcoal
- Allowed: SVG noise overlay at 5-6% opacity for grain
- Not allowed: bright gradients, mesh gradients, colourful blobs, glassmorphism

```css
body::before {
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139, 111, 78, 0.06), transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(61, 88, 82, 0.05), transparent 60%);
}
```

---

## 7. Motion

### 7.1 Tokens

```css
--ease: cubic-bezier(0.2, 0.7, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--d-fast: 180ms;
--d-base: 280ms;
--d-slow: 480ms;
--d-pageload: 900ms;
```

### 7.2 Where to use

- **Page load**: staggered fade-up of hero elements, 12px translateY, 100-400ms delays cascading. Use `--d-pageload`.
- **Hover**: colour and border transitions only. Avoid scale or shadow.
- **Scroll reveals**: optional, very subtle. 8-12px translateY, 600ms duration. Don't animate every element, pick one per section.
- **Section transitions**: none. Brand prefers honest cuts.

### 7.3 Don't list

- No bouncy easing
- No spring physics
- No 3D transforms
- No parallax beyond very subtle (5-10% movement)
- No looping animations on text or logos

---

## 8. Voice & tone

This matters because Rudy IS a copywriter. The website's copy is the product demo.

### 8.1 Principles

- **Direct over clever**. State what's true. Don't bury it.
- **Confident without bragging**. "I write welcome flows that hold attention" not "I'm an award-winning conversion-focused copywriter".
- **Specific over vague**. Mention the kinds of clients (Series A founders, DTC brands), the kinds of work (welcome flows, launches, abandonment sequences). Avoid "various industries".
- **Rhythm matters**. Mix short sentences with longer ones. Sentence fragments. They land harder.
- **Avoid the AI-copywriter cliches**. No "in today's fast-paced digital landscape". No "unlock your potential". No "elevate your brand". No "let's chat".

### 8.2 Sentence patterns to use

- Statement, then qualifier: "I write emails. The kind people actually finish."
- The list-of-three: "Welcome flows. Launches. The boring middle-of-the-flow stuff."
- The understatement: "Quietly does most of the selling."

### 8.3 Words to avoid

leverage, synergy, unlock, elevate, transform, journey, ecosystem, solutions, premium, world-class, cutting-edge, game-changing, in today's, fast-paced, dive deep, circle back, low-hanging fruit

### 8.4 Microcopy specifics

- CTA buttons: verbs, two to four words. "Book a call", "See the work", "Read the case", "Get in touch". Not "Submit" or "Click here" or "Learn more".
- Form labels: short, lowercase ok. "your email", "what's the project".
- Empty states: write actual sentences not "no items found". e.g. "Nothing here yet. Check back when the case studies go up."

---

## 9. Accessibility

- All text must hit WCAG AA contrast minimum
  - Linen on Charcoal: 13.8:1 (passes AAA)
  - Linen 72% on Charcoal: 9.9:1 (passes AAA)
  - Tobacco on Charcoal: 4.5:1 (passes AA, just)
  - Charcoal on Tobacco (button): 4.5:1 (passes AA)
- Don't rely on Tobacco alone to indicate state, also use weight or underline
- Focus states must be visible. Use 2px Tobacco outline with 2px offset on all interactive elements
- Don't use `outline: none` without replacement
- Respect `prefers-reduced-motion`

```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Section recipes

Quick reference for what common page sections look like.

### 10.1 Hero
- Eyebrow (mono, Tobacco)
- Display XL headline (Newsreader 300, italic accent on key word)
- Lead paragraph (Newsreader 300, max 60ch, Linen 72%)
- Primary CTA + secondary CTA
- Generous top padding (160-240px), large bottom

### 10.2 About / story
- Section head with number 01
- Two-column desktop: H2 left, body copy right
- Body capped at `--container-narrow` (720px)
- Optional pull quote

### 10.3 Services / what I do
- Section head 02
- 3-column card grid desktop, 1-column mobile
- Each card: eyebrow + H4 + 2-3 sentence body + small "see example" link
- Pine Shadow cards on Charcoal background

### 10.4 Case study list
- Section head 03
- Stacked rows, each row clickable
- Layout per row: eyebrow + H3 + one-line summary + meta (year, client type)
- Hover: row gets Pine Shadow background, slight slide-right
- 1px hairline border between rows

### 10.5 Testimonial
- Inverted section: Linen background, Charcoal text
- Pull quote centred or left, large
- Attribution below
- Optional small Tobacco rule above the quote

### 10.6 Contact / CTA panel
- Pine Shadow background panel inside Charcoal page
- Display L headline, italic accent
- Short body
- Primary CTA
- Secondary text-link below ("or email me directly")

### 10.7 Footer
- Wordmark + tagline left
- Two columns of links right (work / contact / social)
- Bottom row: copyright + small mono timestamp

---

## 11. CSS variables (drop-in)

Save as `tokens.css` and `@import` it as the first thing in any project stylesheet.

See accompanying file `tokens.css`.

---

## 12. Common mistakes to avoid

These are the tells that someone built it without reading the spec.

1. Using Tobacco for body text or large fills
2. Adding a green status colour or red error colour
3. Using Geist for big headlines
4. Centring all body copy
5. Using rounded corners larger than 8px
6. Using shadows instead of borders for elevation
7. Stock photography of people in offices
8. Icons in the navigation
9. Gradient buttons
10. ALL CAPS body copy
11. Tight line-height on body (below 1.5)
12. Multiple italic words in one headline
13. CTA copy like "Submit" or "Click here"
14. Missing focus states
15. Animating everything on scroll

---

## 13. File structure suggestion

```
/src
  /styles
    tokens.css              # the variable file
    base.css                # resets, body, typography defaults
    components.css          # buttons, cards, forms, nav
    layout.css              # containers, grid, sections
    utilities.css           # helpers
  /assets
    /fonts                  # if self-hosted, otherwise Google Fonts link
    /images
  /components
    button.tsx (or .html)
    card.tsx
    nav.tsx
    section-head.tsx
```

---

## 14. Google Fonts import (one line)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Geist:wght@100..900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 15. Versioning

| Version | Date | Notes |
|---|---|---|
| v1.0 | 06.05.26 | Initial spec, Pine & Tobacco, Newsreader + Geist confirmed by Rudy |

---

End of spec. Build accordingly.
