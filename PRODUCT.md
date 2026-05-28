# Product

## Register

brand

## Users

A mindset or high-performance coach with a 3K–50K email list, doing $10K–$100K/month, who knows email is leaving money on the table but is too busy coaching to write 3–5 emails a week. Reads the site on a phone, usually inbound from LinkedIn or Instagram, between sessions. Decision-maker, not a buying committee. Skims first, books second.

The site has exactly one job: get that visitor to book a free 20-minute email audit via Calendly. No newsletter signup, no PDF download, no exit-intent overlay, no live chat, no contact form. Calendly is the only conversion surface.

## Product Purpose

Single-page boutique site for **Rudy Goel**, freelance email copywriter and creative strategist. Brisbane, Australia. Solo operator — no agency, no team, every email written by him.

Success is one conversion: audit booked. Everything else (press marquee, testimonials, about, work, FAQ) is in service of removing the last reason not to book.

The site itself is the product demo. It has to read like Rudy wrote it. If a section could appear on any other copywriter's site, it's failed.

## Brand Personality

Six words: **quiet luxury for coaches' email channels.**

Three words: **thoughtful, direct, restrained.**

- Writes like he talks. Sentence fragments. Mixed rhythm. Specific.
- Confident, not arrogant. Doesn't brag.
- States the truth instead of burying it.
- Premium boutique — not corporate, not hustle-bro.

Three pillars: **editorial restraint** (whitespace, no caps-lock claims, no exclamation marks), **founder-led** (his face, his name, his words — wordmark only, never an agency logo), **belief-shift, not hype** (psychology-aware, no countdown timers, no fake scarcity).

CTA microcopy is verb-led, 2–4 words. One primary phrasing per page: **"Book the audit"** (or the longer "Book a free 20-minute email audit" when a section needs the explainer). Don't oscillate between phrasings within a page.

Voice banned-list (do not ship in body copy): *leverage, synergy, unlock, elevate, transform (verb), journey, ecosystem, solutions, world-class, cutting-edge, game-changing, rockstar/ninja/guru as self-description.* CTA banned-list: *Submit, Click here, Learn more, Get started, Sign up, Join now.* See [_knowledge/01-brand-identity.md](_knowledge/01-brand-identity.md) §7.2 for the full list.

AI-tells to scrub: em dashes flexed every sentence, "it's not just X, it's Y" structures, forced staccato ("This. Changes. Everything."), "imagine a world where…", "in a sea of X, one Y stands out."

## Anti-references

Hard nos. If output reads like any of these, redo it.

- **Marketing-agency energy** — stock photos of laptops/lightbulbs/growth charts, "team" pages, "trusted by 10,000+ teams" lies.
- **Direct-response screamer page** — big red CTAs, "ONLY 3 SPOTS LEFT" badges, fake urgency timers, countdown clocks.
- **Web 2.0 freelancer site** — purple gradients, "I'm a creative ✨" framing, glassmorphism, drop shadows on text.
- **Generic SaaS** — mesh gradients, isometric illustrations, hero-metric template (big number + small label + supporting stats + gradient accent).
- **Demo2 energy** (the named anti-reference in the knowledge pack) — stacked marquees, pulsing socials, Anton on Anton, autoplay carousel + Lottie + testimonial slider firing at once.
- **Old Rudy site moves** — circular face logo, "$15K in 90 days" guarantee, listed pricing, emoji-prefixed service cards.

Tone references that are right: the inside of a quiet luxury hotel, not the inside of a Times Square billboard.

## Design Principles

1. **One CTA, everywhere.** "Book the audit." Every primary button. Every nav. Every section close. No second conversion path competes for the click.
2. **Show, don't tell.** The site is the demo. If a paragraph says "premium," it's failed — the typography, spacing, and restraint should make the reader feel it without naming it.
3. **Editorial restraint > information density.** Whitespace is doing work. One italic accent word per headline, max. One `[data-reveal]` per section. Pages should be restful for ≥80% of any 5-second window of motion.
4. **Founder-led, not agency-fronted.** Wordmark only. Real photos of Rudy or no photo at all. First-person voice in body copy ("I write…" not "we deliver…").
5. **Belief-shift over pressure tactics.** No countdown timers, no fake scarcity, no red error / green success cues. Persuasion comes from voice and proof, not interface aggression.

When ambiguity hits, authority order: [_knowledge/02-design-system.md](_knowledge/02-design-system.md) for visuals → [_knowledge/03-content-master.md](_knowledge/03-content-master.md) for copy → [_knowledge/01-brand-identity.md](_knowledge/01-brand-identity.md) for tone calls → ask Rudy.

## Accessibility & Inclusion

- Target **WCAG 2.2 AA**. The Pine/Tobacco/Linen palette on Charcoal already clears AA for body and large text; verify any new combination before shipping.
- **Respect `prefers-reduced-motion`.** Every GSAP timeline, every Lenis instance, every reveal must bail when the user has it set. Already wired through [src/scripts/motion.ts](src/scripts/motion.ts); preserve it.
- **Mobile-first.** Most prospects come from phones (LinkedIn/Instagram inbound). All interaction targets ≥44×44px, no hover-only affordances, custom cursor must respect `@media (hover: none)`.
- **Semantic structure.** One `<h1>` (the hero). Skip-link first child of `<body>`. Native `<details>`/`<summary>` for FAQ. `<html lang="en">`. All images get `alt` (or `alt=""` if decorative) plus `width`/`height`.
- **Cognitive load.** A coach skimming on the train at 7am must understand what Rudy does in under 10 seconds. If the hero needs explanation, the hero is wrong.
