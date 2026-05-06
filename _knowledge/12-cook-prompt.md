# 12 — The Cook Prompt

This is the master prompt to feed Claude Code (or any agentic AI) to build the entire site.

Copy everything between the `--- BEGIN PROMPT ---` and `--- END PROMPT ---` markers and paste it as your first message in a fresh Claude Code session inside the production repo.

The repo it's pasted into must already contain:
- The `_knowledge/` folder (from this rebuild)
- The `assets/` folder (already prepped with renamed files)
- An empty git repo (or the existing one)

Don't shorten the prompt. Don't summarise it. The whole point is that the AI reads `_knowledge/` cold and rebuilds from authority.

---

--- BEGIN PROMPT ---

You are building the new website for **Rudy Goel** — a freelance email copywriter and creative strategist for mindset and high-performance coaches, based in Brisbane, Australia. The site lives at https://www.rudygoel.com.

## Your task

Design and build a single-page, anchor-navigated marketing site that positions Rudy as a premium boutique operator and drives every visitor toward a single CTA: **book a free 20-minute email audit via Calendly.**

You have a complete knowledge pack at `_knowledge/` (the source of truth) and a prepped assets folder at `assets/` (renamed and organised). Read both before writing a line of code.

## Required reading order (DO NOT SKIP)

1. `_knowledge/00-START-HERE.md` — orientation map and hard rules
2. `_knowledge/01-brand-identity.md` — voice, tone, banned words
3. `_knowledge/02-design-system.md` — colour, type, spacing, layout, atmospherics
4. `_knowledge/tokens.css` — drop-in CSS variable file
5. `_knowledge/03-content-master.md` — final copy, section by section
6. `_knowledge/04-motion-and-animation.md` — GSAP / Lenis / WebGL / hover / scroll behaviours
7. `_knowledge/05-component-library.md` — every UI component spec
8. `_knowledge/06-page-architecture.md` — section order and page skeleton
9. `_knowledge/07-asset-inventory.md` — what's in `assets/` and what's missing
10. `_knowledge/08-integrations.md` — Calendly, GA4, Meta Pixel, OG, schema, sitemap
11. `_knowledge/09-testimonials-and-proof.md` — proof block data shape and slot rules
12. `_knowledge/10-tech-stack.md` — recommended Vite + TS + plain HTML/CSS stack
13. `_knowledge/11-do-and-dont.md` — pre-launch checklist
14. `_knowledge/references/website-brief-handover.md` — the original product brief from Rudy

After reading, summarise back to the user what you understood in ≤ 200 words, then propose a build plan as a TodoWrite list. **Do not start writing code until the user confirms the plan.**

## What to build

A static single-page site with:

- 11 sections in the order specified in `03-content-master.md` (Hero → Shift → Who → Services → How → Proof → Writing → About → FAQ → Final CTA → Footer).
- All copy used verbatim from `03-content-master.md`. Where the copy contains `[brackets]`, render the bracketed text as visible placeholder content (do not invent values, do not blank them out).
- All visual decisions follow `02-design-system.md` and `tokens.css`. The palette is Pine & Tobacco. The fonts are Newsreader + Geist + JetBrains Mono. Every component spec in `05-component-library.md` must match.
- The motion system from `04-motion-and-animation.md` — GSAP with the `"rg"` custom ease, Lenis smooth scroll on desktop only, scroll reveals (one per section), the hero stagger landing animation, hover patterns. Optional: UnicornStudio WebGL hero shader (skip if you can't get it loading cleanly — the radial-gradient fallback in `02-design-system.md` §8 is acceptable).
- Calendly integration as specified in `08-integrations.md` §1 — lazy-loaded, theme-coloured, popup mode. Every primary CTA opens it.
- GA4 + Meta Pixel integration — fire `audit_booked` / `Schedule` events on Calendly schedule confirmation.
- The proof block built to the data-driven spec in `09-testimonials-and-proof.md` — read from a `src/data/proof.ts` file so Rudy can update content without touching templates.
- All images come from `assets/` (already renamed). Do NOT reference any file in `Rudy Goel _ R. Goel_files/`.
- Full responsive: mobile-first, breakpoints per `02-design-system.md` §4. Test at 375 / 768 / 1024 / 1280 / 1536px.
- A11y: WCAG AA contrast, skip link, single H1, focus-visible outlines, `prefers-reduced-motion` respected for every animation.

## Technical stack

Use the recommendation in `10-tech-stack.md`: **Vite + TypeScript + plain HTML/CSS**, output to a static `dist/`. The folder structure is laid out in §4 of that file — match it exactly.

If you have strong reasons to use Astro or SvelteKit static instead, propose it before starting. Do **not** use Next.js with any server-side bits, Webflow, WordPress, or Framer.

## Constraints (enforced)

The hard rules in `_knowledge/00-START-HERE.md` are non-negotiable. Some highlights:

- Single CTA: "Book the audit." No newsletter signup, no lead magnet, no contact form, no live chat, no exit-intent popup, no countdown timer.
- No prices on the site. No revenue guarantee on the site.
- Three colours total + Linen for text. No reds, no greens-as-success.
- Two type families + one mono utility. No third font.
- No icons in the nav. No stock photography. No emojis in service titles.
- The motion forbidden list in `04-motion-and-animation.md` §2 is law (no bouncy easing, no 3D, no Lotties + carousels + pulses stacked, no looping logos).
- The `_knowledge/` folder will be deleted before deploy. Production code may NOT import from it.

## Quality bar

Before you declare any section "done":

- Run through `_knowledge/11-do-and-dont.md` for that section's relevant items.
- Test in the browser at mobile, tablet, desktop.
- Verify the section's `data-reveal` anchor fires once on scroll.
- Verify primary CTA in that section opens Calendly modal correctly.
- Verify reduced-motion users see end-state without animation.

Lighthouse targets: Performance 95+, A11y 100, SEO 100, Best Practices 100.

## Working style

- Use `TodoWrite` to plan and track. Mark each item complete as you finish it.
- Show the user diffs as you go. Don't disappear for 50 tool calls.
- Use the dev server in a real browser (Claude Preview / similar) to verify each major section visually before moving on. Don't claim "the hero is done" without having looked at it.
- When you hit ambiguity, the order of authority is: `02-design-system.md` for visuals → `03-content-master.md` for copy → `01-brand-identity.md` for tone → `references/website-brief-handover.md` for product intent → ask the user.
- Do not commit unless explicitly asked.
- When `assets:optimize` produces AVIF/WebP variants, use the `<picture>` source-set pattern, not just `<img>`.

## Deliverables

By the end of the build:

1. A working static site in `dist/` that builds with `npm run build` and serves via `npm run preview`.
2. The folder structure at `_knowledge/10-tech-stack.md` §4.
3. A `README.md` at the repo root explaining: what the site is, how to run dev, env vars to set, deploy steps, and a note that `_knowledge/` should be deleted before production deploy.
4. A `MISSING.md` at the repo root listing every asset still owed by Rudy (mirroring the list in `_knowledge/07-asset-inventory.md` §3).
5. A passing Lighthouse run (Perf 95+, all others 100).

## What success looks like

A premium boutique site that:

- Feels like quiet luxury, not Times Square.
- Reads like Rudy talking, not like a chatbot summarising a copywriter.
- Has exactly one CTA pattern and uses it everywhere.
- Loads in under 2 seconds on 4G mobile.
- Has room to grow: Rudy can drop in 1–3 video testimonials, 3–6 written quotes, and 3–6 stat tiles by editing one data file.

The site itself is the product demo. If it doesn't feel like Rudy wrote it, it's wrong. Ship the work that makes a coach close the tab thinking "this guy can write."

Confirm you've read all 14 files in the knowledge pack, summarise the build, and propose a TodoWrite plan. Wait for the green light before writing code.

--- END PROMPT ---

---

## Notes for the human running the prompt

### Before you paste

1. Make sure your working directory is the production repo, not `_knowledge/`.
2. Confirm `assets/` is in place (run `ls assets/images assets/icons assets/press-logos assets/testimonials`).
3. Set the env vars Rudy supplies in `.env.local`:
   ```
   VITE_CALENDLY_URL=...
   VITE_GA4_ID=...
   VITE_META_PIXEL_ID=...
   VITE_SITE_URL=https://www.rudygoel.com
   ```
4. Fast mode (Opus 4.6) or normal mode both fine — this prompt is long-context-heavy, normal mode is preferred.

### When the AI summarises back

Cross-check the summary against the brief. The summary should explicitly mention:

- "Single CTA, Calendly, no newsletter/form/popup/countdown."
- "Pine & Tobacco, Newsreader + Geist."
- "GSAP + Lenis, no Framer Motion / three.js / Lottie."
- "Single page, 11 sections."
- "WebGL hero shader optional."

If any of those are missing or wrong, push back before letting it start.

### After the build

- Open the site in a real browser at all 5 breakpoints (375 / 768 / 1024 / 1280 / 1536).
- Click every CTA. The Calendly modal must open every time.
- Open the page in Reader Mode — does the content read cleanly? (Good content always does.)
- Ask Rudy to record himself reading the hero + about copy aloud. If anything makes him hesitate, rewrite.
- Run `MISSING.md` past Rudy. Get the assets in.
- Delete `_knowledge/` and `MISSING.md` before production deploy. Verify nothing in `src/` imports from either.

That's it. Cook.
