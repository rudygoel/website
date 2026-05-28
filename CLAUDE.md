# CLAUDE.md

Notes for future Claude sessions working on this codebase.

## Design Context

Before any UI, copy, or visual change:

1. Read [PRODUCT.md](PRODUCT.md) — strategic brief: register, users, brand personality, anti-references, design principles, accessibility target.
2. Read [DESIGN.md](DESIGN.md) — visual law: Pine & Tobacco palette, Newsreader × Geist × JetBrains Mono type system, named rules, do's and don'ts.
3. For deeper background, [_knowledge/](_knowledge/) has the original full pack (brand identity, motion spec, component library, content master). Authority order when something disagrees: DESIGN.md → _knowledge/02-design-system.md → _knowledge/03-content-master.md → _knowledge/01-brand-identity.md → ask the user.

The site has one job: get the visitor to book a free 20-minute email audit via Calendly. Calendly is the only conversion surface — no newsletter signup, no PDF download, no exit-intent overlay, no live chat, no contact form. Don't add one.

## Hard rules (carry through every change)

- **Three families only**: Newsreader (display), Geist (body), JetBrains Mono (eyebrows/numbers). No fourth.
- **Five colors only**: Charcoal, Pine Shadow, Pine, Tobacco, Linen. No red/green status colors.
- **One CTA phrasing per page**: "Book the audit" (or the long form). Don't oscillate.
- **One italic accent word per display headline.** Zero or one — never two.
- **Borders over shadows** for card elevation. Shadow tokens exist for overlays only.
- **Respect `prefers-reduced-motion`** in every motion path. Already wired through [src/scripts/motion.ts](src/scripts/motion.ts).
- **Don't import from [_knowledge/](_knowledge/)** in production code — that folder is reference-only and will be removed before deploy per its own [00-START-HERE.md](_knowledge/00-START-HERE.md).
