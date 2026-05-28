---
name: Rudy Goel
description: Quiet-luxury editorial site for a freelance email copywriter
colors:
  charcoal: "#16191A"
  pine-shadow: "#1F2D2A"
  pine: "#3D5852"
  tobacco: "#8B6F4E"
  tobacco-strong: "#A38561"
  tobacco-deep: "#7A6044"
  linen: "#DDD3C4"
typography:
  display-xl:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(56px, 9vw, 144px)"
    fontWeight: 300
    lineHeight: 0.96
    letterSpacing: "-0.025em"
  display-l:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(44px, 7vw, 96px)"
    fontWeight: 300
    lineHeight: 0.96
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(36px, 5vw, 64px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(22px, 3vw, 32px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.005em"
  body-large:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 19px)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.005em"
  label:
    fontFamily: "JetBrains Mono, 'SF Mono', Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.18em"
  quote:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(20px, 2.4vw, 28px)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.015em"
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
  pill: "999px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
  s-9: "96px"
  s-10: "128px"
  s-11: "160px"
components:
  button-primary:
    backgroundColor: "{colors.tobacco}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.tobacco-strong}"
    textColor: "{colors.charcoal}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.linen}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "48px"
  card:
    backgroundColor: "{colors.pine-shadow}"
    textColor: "{colors.linen}"
    rounded: "{rounded.md}"
    padding: "32px"
  nav-pill:
    backgroundColor: "{colors.pine-shadow}"
    textColor: "{colors.linen}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
---

# Design System: Rudy Goel

## 1. Overview

**Creative North Star: "The Lived-in Editorial Hotel"**

A dim, quiet space where every surface is considered and nothing shouts. Charcoal walls, lamp-warm Tobacco accents, restrained editorial typography — the visual equivalent of a small luxury hotel in winter. The brand pillar is **editorial restraint**: whitespace doing work, one italic accent word per headline, no caps-lock claims, no exclamation marks, no growth-chart screenshots, no purple gradients pretending to be premium. The site itself is the product demo for Rudy's craft, so its surfaces have to read the way his copy reads — thoughtful, direct, confident without bragging.

This system explicitly rejects the surrounding category. **Marketing-agency energy** (stock people on laptops, "trusted by 10,000+ teams" lies), **direct-response screamer pages** (red CTAs, countdown timers, "ONLY 3 SPOTS LEFT" badges), **Web 2.0 freelancer sites** (purple gradients, sparkle emoji framing, glassmorphism), **generic SaaS** (mesh gradients, isometric illustrations, the hero-metric template), and **Demo2 energy** (stacked marquees + pulsing socials + Anton on Anton + autoplay carousel + Lottie + testimonial slider firing in the same viewport) are all out. Quiet luxury hotel, not Times Square billboard.

**Key Characteristics:**

- Dark by default. Charcoal carries ~60% of any view; lamp-warm Tobacco appears only when something must be noticed.
- Editorial serif up top, sans-serif body, mono for eyebrows and metadata. No fourth family. Ever.
- Sharp corners (2–4px). No round-rect SaaS softness. No glassmorphism. No mesh gradients.
- Hairline borders for elevation, not shadows. Cards lift via border-color shift + 2px translateY.
- Left-asymmetric layouts. One italic accent word per headline. One `[data-reveal]` per section. Restful for ≥80% of any 5-second motion window.

## 2. Colors: The Pine & Tobacco Palette

A four-tone editorial palette anchored on warm charcoal, with a single lamp-warm accent. Every neutral is tinted (no `#000`, no `#fff`); the accent is reserved.

### Primary
- **Tobacco** (`#8B6F4E`): the only accent. Used on the primary CTA, the single italic accent word inside display headlines, JetBrains-Mono eyebrows, link hover, and hairline rules. That is the entire list. Hover lifts to **Tobacco Strong** (`#A38561`), active drops to **Tobacco Deep** (`#7A6044`).

### Neutral
- **Charcoal** (`#16191A`): page background. The floor. ~60% of any given view.
- **Pine Shadow** (`#1F2D2A`): the only card / elevated surface color. Sticky-nav background, form inputs, alternating section bands. Cool counterweight to Tobacco's warmth.
- **Pine** (`#3D5852`): hover state for ghost surfaces, table row stripe, decorative fills. Use carefully — never side-by-side with Pine Shadow at the same hierarchy.
- **Linen** (`#DDD3C4`): primary text on dark, wordmark color, and the background of the inverted "light moment" testimonial panel. Body sits at full opacity; secondary at 72% (`rgba(221, 211, 196, 0.72)`); faint at 48%; mute at 32%.

### Named Rules

**The 60/30/10 Rule.** Every viewport reads as ~60% Charcoal, ~30% Pine Shadow + Linen text, ~10% Tobacco. If a screenshot has Tobacco on more than 10% of pixels, the page is overheated. Pull it back.

**The Tobacco Budget.** Tobacco appears only as: (1) the primary CTA, (2) the single italic accent word inside a display headline, (3) JetBrains-Mono eyebrows, (4) link hover, (5) hairline rules. Five slots, total. Body copy in Tobacco is a build-breaker.

**The No-Status-Color Rule.** No bright red error, no green success, no traffic-light states. State changes use weight, opacity, underline, or border-color shift. Tobacco is the only saturated color in the system; everything else is the Pine/Linen family.

**The Anti-Mid-Section Rule.** Pine and Pine Shadow may not share the same hierarchy in one view — they read muddy together. Pick one elevation per section.

## 3. Typography: Newsreader Serif × Geist Sans × JetBrains Mono

**Display Font:** Newsreader (variable serif, Google Fonts) with fallback `Georgia, 'Times New Roman', serif`.
**Body Font:** Geist (variable sans-serif) with fallback `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`.
**Label/Mono Font:** JetBrains Mono with fallback `'SF Mono', Menlo, Consolas, monospace`.

**Character:** Newsreader is the voice — editorial, slightly literary, 300-weight for display so the letterforms feel airy rather than declarative. Geist is the conversation — clean, neutral, doesn't draw attention to itself. JetBrains Mono is the timestamp — a sliver of utility for eyebrows, section numbers, and metadata only. The pairing reads like the spine of a paperback, not the front of a SaaS dashboard.

### Hierarchy
- **Display XL** (Newsreader 300, `clamp(56px, 9vw, 144px)`, line-height 0.96, tracking `-0.025em`): hero headline only. One per page. Optical sizing on: `font-variation-settings: "opsz" 72`.
- **Display L** (Newsreader 300, `clamp(44px, 7vw, 96px)`, line-height 0.96): section openers and the final CTA panel headline.
- **Headline** (Newsreader 400, `clamp(36px, 5vw, 64px)`, line-height 1.04, tracking `-0.015em`): standard section headings (`<h1>` semantics elsewhere reserved for hero).
- **Title** (Newsreader 400, `clamp(22px, 3vw, 32px)`, line-height 1.1): H3 and pull-quote scale.
- **Body Large** (Geist 400, `clamp(17px, 1.4vw, 19px)`, line-height 1.6): lead paragraphs only.
- **Body** (Geist 400, 16px, line-height 1.6, tracking `0.005em`): default. Cap line length at 65–75ch.
- **Label** (JetBrains Mono 400, 11px, line-height 1.4, tracking `0.18em`, uppercase): eyebrows, section numbers, metadata. The only place caps are allowed.
- **Quote** (Newsreader 400 italic, `clamp(20px, 2.4vw, 28px)`, line-height 1.45): pull quotes and testimonial copy. Rendered without `"` characters — a hairline Tobacco rule above stands in for the quotation marks.

### Named Rules

**The One Italic Rule.** A display headline gets one — and only one — italic accent word. *"Email copy that quietly prints money."* The italic is the emphasis; weight contrast is not added on top. Two italics in a headline is a build-breaker.

**The Serif-Up Sans-Down Rule.** Newsreader for H1–H3 + pull quotes. Geist for H4–H5 + body. JetBrains Mono for eyebrows / numbers / metadata only. Geist anywhere above H4 — wrong. A fourth typeface — wrong.

**The No-Italic-Body Rule.** Newsreader italic carries personality and is reserved for headline accents. Body copy stays roman, even when emphasis is wanted; reach for weight or a structural break instead.

**The 1.5+ Line-Height Floor.** Body line-height is never below 1.5. Reads cramped otherwise and breaks the editorial mood.

## 4. Elevation

Borders, not shadows. The system has three shadow tokens defined for the rare elevated overlay (modal scrim, sticky nav blur background), but the rest of the surface treatment is **tonal layering through color and hairline borders**. Cards lift via border-color shift on hover plus a 2px translateY — not a box-shadow swap.

### Shadow Vocabulary

- **Shadow Sm** (`box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2)`): reserved for one-off depth on overlays. Not for cards at rest.
- **Shadow Md** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3)`): scrim under the Calendly modal. Not for marketing surfaces.
- **Shadow Lg** (`box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4)`): not used at the time of writing; available for full-screen overlays.

The sticky nav uses backdrop blur (`backdrop-filter: blur(12px)`) over a 85%-opacity Charcoal background instead of a shadow, so the surface beneath shows through softly without a hard drop edge.

### Named Rules

**The Borders-Over-Shadows Rule.** Card depth is conveyed by 1px hairline borders at `rgba(221, 211, 196, 0.08)` (raised to `0.18` on hover), never by box-shadow. Shadow tokens exist for overlays only.

**The No-Drop-Shadow-On-Text Rule.** Text is never elevated with `text-shadow`. Hierarchy comes from scale, weight, and color, not from atmospherics.

**The Flat-By-Default Rule.** Surfaces are flat at rest. Elevation appears only as a response to state (hover lifts a card by 2px and shifts its border color toward Linen, focus rings show a 2px Tobacco outline).

## 5. Components

### Buttons
- **Shape:** sharp, editorial corners (radius 2px / `--radius-sm`). No SaaS round-rect.
- **Primary:** Tobacco background, Charcoal text, 48px tall, 24px horizontal padding, Geist 14px weight 500, tracking `0.02em`. Hover swaps background to Tobacco Strong (`#A38561`) via color change only — **no scale, no translate, no shadow on hover.** Active drops to Tobacco Deep.
- **Ghost:** transparent background, Linen text, same height/padding/typography. Hover fills the background with Pine Shadow (`#1F2D2A`) and (on long list items only) translates 8px to the right while a Tobacco arrow fades in.
- **Focus:** `outline: 2px solid var(--color-accent); outline-offset: 2px;` — visible, not removed.
- **The CTA copy is "Book the audit"** across every primary button on the site. One phrasing per page. Banned button microcopy: *Submit, Click here, Learn more, Get started, Sign up, Join now.*

### Cards
- **Corner Style:** 4px radius (`--radius-md`).
- **Background:** Pine Shadow (`#1F2D2A`). The only elevated surface color in the system.
- **Border:** 1px hairline at `rgba(221, 211, 196, 0.08)`. On hover, the border lifts to `rgba(221, 211, 196, 0.18)` and the card translates 2px up.
- **Internal Padding:** 32px default (`--card-padding`), 48px on the featured card (`--card-padding-feature`).
- **Shadow Strategy:** none. See Elevation §4.
- **Nested cards are a build-breaker.**

### Navigation
- **Style:** a small Pine-Shadow pill (44px height, 999px radius) floating top-center, with the brand wordmark to its left and a row of social link circles to its right.
- **Typography:** Geist 14px weight 400 for the pill links.
- **States:** default — Linen 72%; hover — Linen 100%; active route — Tobacco underline (1px hairline, not a fill). No icons in the nav itself; social circles are a separate row, monochrome SVG at 20×20, Linen-on-Pine-Shadow.
- **Scrolled state:** 85%-opacity Charcoal background with 12px backdrop blur appears once the page scrolls past the hero. Theme attribute `data-theme="dark"` carries through.
- **Mobile:** the pill collapses into a hamburger that opens a full-bleed drawer (Charcoal background, Newsreader 400 link list at H3 scale, social row pinned to the bottom).

### Inputs (low priority — Calendly handles all forms)
- **Style:** Pine Shadow background, 1px hairline border, 2px corner radius, 48px tall, 16px horizontal padding. Geist 16px body weight, Linen text, Linen-48% placeholder.
- **Focus:** border shifts to Tobacco (`var(--color-accent)`). No glow, no shadow.
- The site itself has no forms in production; this spec exists so any future inline form (a contact field, a survey) stays on-brand.

### Eyebrow + Section Number (signature)
A small piece of metadata that appears above every section heading: a `01–11`-style mono number in Linen-faint, with a Tobacco JetBrains-Mono eyebrow label beside or below it (uppercase, tracking `0.18em`, 11px). It sets the editorial tone before the headline even loads.

### Pull Quote (signature)
Newsreader 400 italic at the Quote scale (`clamp(20px, 2.4vw, 28px)`), preceded by a 24px-wide, 1px Tobacco hairline rule above the first word. **No rendered `"` characters** — the Tobacco rule is the quotation mark stand-in. Attribution sits below in JetBrains Mono 11px Linen-72%.

### Portrait Video Testimonial (signature)
Portrait-orientation MP4 inside a 9:16 aspect-ratio frame, Pine Shadow background, 4px corner radius. A circular Tobacco play button (48px) overlays center, lamp-warm and clearly clickable. Duration label sits bottom-right in JetBrains Mono 11px. On click, the video element replaces the poster + button inline (no modal). Below the frame: a single Geist line with the speaker's name + role + business, then a second Geist line at Linen-72% summarising what the clip covers.

## 6. Do's and Don'ts

### Do:

- **Do** use Charcoal (`#16191A`) for ~60% of every view, Pine Shadow (`#1F2D2A`) for any elevated surface, and Tobacco (`#8B6F4E`) only as CTA / italic accent / eyebrow / link hover / hairline.
- **Do** keep type strictly within Newsreader + Geist + JetBrains Mono. Three families. Final.
- **Do** italicise exactly one accent word per display headline. Zero or one — never two.
- **Do** lift cards on hover by 2px translateY + border color shift to `rgba(221, 211, 196, 0.18)`. Border, not shadow.
- **Do** cap body line length at 65–75ch and keep body line-height at 1.5 or above.
- **Do** keep the site restful for at least 80% of any 5-second motion window. One `[data-reveal]` per section.
- **Do** make every primary CTA read "Book the audit" (or, in long-form sections, "Book a free 20-minute email audit"). Pick one phrasing per page and stay with it.
- **Do** respect `prefers-reduced-motion` — every GSAP timeline, every Lenis instance, every reveal bails when it's set.
- **Do** keep focus rings visible: `outline: 2px solid var(--color-accent); outline-offset: 2px;`. Never `outline: none` without an equivalent replacement.

### Don't:

- **Don't** introduce any color outside Charcoal / Pine Shadow / Pine / Tobacco / Linen. No red error, no green success, no Instagram-gradient social icons.
- **Don't** put Tobacco on body text. Tobacco is the lamp, not the wallpaper.
- **Don't** place Pine and Pine Shadow side-by-side at the same hierarchy in one view — reads muddy.
- **Don't** mix in a third typeface, use Geist above H4, justify text, italicise body copy, or center body copy.
- **Don't** round corners above 8px. Sharp corners are the editorial signature.
- **Don't** ship **gradient text**, **side-stripe borders** (`border-left` greater than 1px as a colored accent), or **glassmorphism as default** — see the impeccable absolute bans.
- **Don't** ship the **hero-metric template** (big number + small label + supporting stats + gradient accent). It's SaaS cliché and it's on PRODUCT.md's anti-reference list.
- **Don't** ship **identical card grids** (same-sized icon + heading + text cards, repeated). Vary structure and density.
- **Don't** scale, translate, or drop-shadow buttons on hover. Color change only.
- **Don't** loop animations on text or logos. No bouncy or elastic easing. No 3D transforms, no perspective tricks, no parallax beyond ~8% movement.
- **Don't** ship **direct-response screamer page** moves — no big red CTAs, no "ONLY 3 SPOTS LEFT" badges, no countdown timers, no fake urgency.
- **Don't** ship **Web 2.0 freelancer site** moves — no purple gradients, no "I'm a creative ✨" framing, no drop shadows on text.
- **Don't** ship **generic SaaS** moves — no mesh gradients, no isometric illustrations, no "trusted by 10,000+" lies.
- **Don't** ship **Demo2 energy** — stacked marquees, pulsing socials, Anton on Anton, autoplay carousel + Lottie + testimonial slider firing at once. The opposite of that.
- **Don't** ship **marketing-agency energy** — stock photos of laptops/lightbulbs/growth charts, "team" pages.
- **Don't** reintroduce the old Rudy moves: circular face logo, the "$15K in 90 days" guarantee, listed pricing, emoji-prefixed service cards.
- **Don't** add a second integration with its own CTA. Calendly is the only conversion surface; no newsletter signup, no PDF download, no exit-intent overlay, no live chat, no contact form.
