# 00 — START HERE

You are an AI builder/designer being given the full knowledge pack for the **Rudy Goel** website rebuild.

This folder is the single source of truth. Read every file in this folder before writing a single line of code.

## TL;DR — what you are building

A premium boutique single-page site for **Rudy Goel**, a freelance email copywriter and creative strategist for mindset and high-performance coaches. The single goal of the site: **get the visitor to book a free 20-minute email audit call via Calendly.**

- Aesthetic: **quiet luxury, editorial, dark, lived-in.** Pine & Tobacco palette, Newsreader serif + Geist sans.
- Vibe inspiration (motion + nav): **demo1** (Juan Mora — Webflow/GSAP/Lenis/UnicornStudio).
- Vibe inspiration (simplicity / restraint): **demo3** (Cameron Cruz — Framer minimum).
- What to AVOID: **demo2** energy (stacked marquees, pulsing icons, Anton on Anton, kitchen-sink chaos).
- Sole CTA repeated everywhere: **Book a free 20-minute email audit** → Calendly.
- Must accommodate: 4–8 written testimonials AND 1–3 video testimonials (without retrofitting later).

## Reading order

| # | File | Why |
|---|---|---|
| 00 | **`00-START-HERE.md`** | (You are here) the map |
| 01 | `01-brand-identity.md` | Who Rudy is, voice, what to never sound like |
| 02 | `02-design-system.md` | Colour, type, spacing, radius, motion tokens |
| 03 | `03-content-master.md` | Final copy, section by section, word for word |
| 04 | `04-motion-and-animation.md` | Landing animation, hover, scroll, GSAP/Lenis/WebGL |
| 05 | `05-component-library.md` | Buttons, cards, nav, testimonial, etc. |
| 06 | `06-page-architecture.md` | Section order, layout, responsive rules |
| 07 | `07-asset-inventory.md` | Every image, where it goes, what's missing |
| 08 | `08-integrations.md` | Calendly, GA4, Meta Pixel, OG, schema |
| 09 | `09-testimonials-and-proof.md` | Slot structure for written + video testimonials |
| 10 | `10-tech-stack.md` | Recommended stack and why |
| 11 | `11-do-and-dont.md` | A printable checklist |
| 12 | `12-cook-prompt.md` | The master prompt to feed Claude Code (or similar) to build the site |
| — | `tokens.css` | Drop-in CSS variable file |
| — | `references/` | Original brief + brand-spec + analysis of the three demo references and the live site |

## Hard rules (do not break)

1. **One CTA only.** "Book a free 20-minute email audit." Everywhere. No newsletter signups, no PDF downloads, no exit-intent overlays, no live chat.
2. **Never quote a price.** Pricing is discussed on the audit call only.
3. **Do not show any revenue guarantee.** The "$15K in 90 days" line lives on social only — never on the site.
4. **Three colours total** — Charcoal, Pine, Tobacco — plus Linen as text. No reds, no greens-as-success, no extras.
5. **Two type families only** — Newsreader (display) + Geist (body). JetBrains Mono is a utility eyebrow only.
6. **No stock photography of "happy people on laptops."** Real photos of Rudy, or no photo at all.
7. **No pulsing/loop animations on text or logos.** No bouncy easing. No 3D transforms. No mesh gradients.
8. **Mobile-first.** Most prospects come from LinkedIn / Instagram on phones.
9. **Calendly is the only integration that gets a CTA.** Embed or deep-link only — no third-party calendaring.
10. **The knowledge folder will be deleted post-deploy.** Do not import from `_knowledge/` in any production code.

## Output structure (final repo, what survives deploy)

```
/                          ← root
├── index.html             ← single page
├── /src
│   ├── /styles            tokens.css, base.css, components.css, layout.css
│   ├── /scripts           main.ts, motion.ts, calendly.ts
│   └── /components        (if framework used)
├── /assets
│   ├── /images
│   ├── /icons
│   ├── /press-logos
│   ├── /testimonials      (video posters + headshots)
│   └── /clients           (client logos when supplied)
├── /public                favicon, og image, robots.txt, sitemap.xml
├── package.json
└── README.md
```

The `_knowledge/` folder gets removed before going live.

## When something is ambiguous

The order of authority:
1. `02-design-system.md` for visual decisions
2. `03-content-master.md` for copy
3. `01-brand-identity.md` for tone/voice judgement calls
4. `references/website-brief-handover.md` for original product intent
5. Ask the user.

Build it well. The site itself is the product demo — it has to read like Rudy wrote it.
