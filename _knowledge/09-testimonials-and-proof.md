# 09 — Testimonials & Proof

The proof block is the heaviest section on the site. It carries the social weight that converts. Spec it for room to grow — Rudy will be adding more testimonials and case studies post-launch and we don't want the layout to fight him.

## 1. The four sub-blocks (rendered in this order inside `#proof`)

1. **Client roster** — named clients, no logos required.
2. **Results stats** — three big-number tiles.
3. **Testimonials** — featured video + written grid.
4. **Press strip** — six monochrome logos.

Each sub-block has a single `data-reveal` anchor on its sub-heading; do not animate every tile.

## 2. Data shape (use this in code)

A single config file holds everything. The component renderers read from it. When Rudy supplies more testimonials, he edits this file only.

`src/data/proof.ts`:

```ts
export const clients = [
  { name: "Byron Dempsey", role: "Driven Young / Founders Retreat", logo: null },
  { name: "Kishan Bodalia", role: "DJ Accelerator / Bodalia Academy", logo: null },
  { name: "Mike Fox", role: "Lone Wolf Unleashed", logo: null },
  { name: "Rupert Bryce", role: "Performance Strategies", logo: null },
  { name: "Terrence", role: "Broadcast retainers", logo: null },
] as const;

export const stats = [
  { number: "47%",  caption: "Open rate on Easter promo for [Client]" },
  { number: "$15K", caption: "Recovered from a re-engagement sequence in 14 days" },
  { number: "3.2×", caption: "Reply rate after voice rebuild for a mastermind launch" },
];

export const testimonials = [
  {
    type: "video",
    featured: true,
    name: "Matthew Volkwyn",
    role: "Founder, The Dojo · $10M+ generated via copywriting",
    poster: "/assets/testimonials/matthew-volkwyn-video-poster.jpg",
    src: "/assets/testimonials/matthew-volkwyn.mp4",  // Rudy supplies
    duration: "1:24",
    caption: "A millionaire copywriter reads, reviews, and loves my copy. Zero feedback.",
  },
  {
    type: "written",
    name: "Joel Edgley",
    role: "Owner, FINEDGE Media",
    avatar: "/assets/testimonials/joel-edgley.jpg",   // Rudy supplies
    quote: "Rudy has provided me with more than I could ever ask for…",
  },
  {
    type: "written",
    name: "Jose Williams",
    role: "Copywriter for law firms and legal businesses",
    avatar: "/assets/testimonials/jose-williams.jpg", // Rudy supplies
    quote: "If you want someone who can not only deliver great copy and drive revenue…",
  },
  // SLOTS 4–6: empty for Rudy to fill.
];

export const press = [
  { name: "Yahoo Finance", logo: "/assets/press-logos/yahoo-finance.png" },
  { name: "NBC",           logo: "/assets/press-logos/nbc.png" },
  { name: "Forbes",        logo: "/assets/press-logos/forbes.png" },
  { name: "Daily Mail",    logo: "/assets/press-logos/daily-mail.png" },
  { name: "KivoDaily",     logo: "/assets/press-logos/kivodaily.png" },
  { name: "Sam Robson",    logo: "/assets/press-logos/sam-robson-1.png" },
];
```

## 3. Layout — testimonial section

```
┌─────────────────────────────────────────┐
│  [Featured video — single, 16:9]        │   ← only if testimonials[0].featured
└─────────────────────────────────────────┘

┌──────────┬──────────┬──────────┐
│ written  │ written  │ written  │           ← grid: 1 / 2 / 3 columns
└──────────┴──────────┴──────────┘             responsive: 3 → 2 → 1
┌──────────┬──────────┬──────────┐
│ written  │ written  │ written  │
└──────────┴──────────┴──────────┘
```

### 3.1 Renderer logic

```ts
const featuredVideo = testimonials.find(t => t.type === "video" && t.featured);
const others = testimonials.filter(t => t !== featuredVideo);
const writtenOnly = others.filter(t => t.type === "written");
const additionalVideos = others.filter(t => t.type === "video");
```

- If 0 video testimonials: render a 2- or 3-column grid of written testimonials only.
- If 1 video, mark it featured: render at full width above the written grid.
- If 2–3 videos: top row = 1fr×N video grid, then written grid below.
- Min written quotes: 3. Max written quotes: 6 (after that the grid feels chaotic — split into two rows).

### 3.2 Responsive

- Desktop (≥ 1024px): 3-column written grid; featured video full container width.
- Tablet (768–1023px): 2-column written grid; featured video full container width.
- Mobile (≤ 767px): 1-column for everything.

### 3.3 Spacing

- Gap between video block and written grid: `--s-9` (96px).
- Gap inside grids: `--s-5` (24px).
- Section block padding: `clamp(120px, 14vw, 200px)` — see `06-page-architecture.md` §3.

## 4. Component contracts

### 4.1 `<TestimonialVideo>` — see `05-component-library.md` §10

Props: `name`, `role`, `poster`, `src`, `duration`, `caption?`, `featured?`.

Behaviour: lazy-mount video on click (don't load video bytes on page load). Captions track if `captions` prop supplied. ESC closes the video (returns to poster).

### 4.2 `<TestimonialWritten>` — see `05-component-library.md` §9

Props: `name`, `role`, `avatar`, `quote`.

Constraints:
- Quote length: 60–250 words. Anything shorter feels weak; longer breaks the grid rhythm.
- Avatar: 200×200 minimum, square crop, soft compression.
- No `<img>` if avatar is missing — render a Newsreader-italic monogram on Pine Shadow as fallback.

### 4.3 `<StatTile>` — see `05-component-library.md` §8

Props: `number`, `caption`.

Constraints:
- `number` must be 6 chars or fewer (otherwise it breaks the type scale). "$1.2M" yes. "$1,234,567" no.
- `caption` capped at 60 chars.

### 4.4 `<ClientRoster>`

Props: `clients` array.

Layout: 5-column row desktop (5 clients ≈ 1 per column); flex-wrap on tablet; 2-column on mobile. Each item is `<strong>name</strong> · <span>role</span>` with hairline divider between rows on mobile.

If `client.logo` is supplied, render it 24px tall to the left of the name in Linen 60% with a hover bump to 100% — but the default is text-only. Logos optional.

## 5. Empty / partial states

The site must look correct in all of these:

| State | Render |
|---|---|
| 0 testimonials | Hide the testimonials sub-block entirely. Keep stats + roster + press. |
| 1 written testimonial | Centre it in `--container-narrow`. Don't grid a single quote. |
| 1 video, 0 written | Render only the featured video. |
| 5 written, 1 video | Featured video + 2-row × 3-col grid. |
| 6+ written | Cap at 6 visible; Rudy will rotate. |
| 0 stats | Hide stats sub-block. (Stats are optional v1 — placeholder copy in `03-content-master.md` is acceptable until Rudy supplies real numbers.) |
| 0 client logos | Render names as text, no logos. (Default state.) |

## 6. Quality bar — what makes a testimonial usable

Reject quotes that don't meet **all** of these:

- ✅ Specific. Names a deliverable, an outcome, or a moment. ("welcome flow," "launch sequence," "voice profile")
- ✅ Sounds like the person, not like a template. Reads like a Slack DM.
- ✅ Identifies the client by full name + their business or role.
- ✅ ≤ 250 words. Trim ruthlessly.
- ✅ No clichés ("game-changer", "next-level", "took us to the next level"). Reword or drop.

Apply this filter when Rudy adds new ones.

## 7. Future-proof: case studies

Out of scope for v1, but leave the door open. If Rudy decides to add 2–3 case studies later, the natural home is a new `#cases` section between `#proof` and `#writing`, using the service-row component (with longer body copy and a "Read the case →" link).

When that happens, add:

```ts
export const cases = [
  { id: "byron-dempsey-2026", title: "…", client: "…", numbers: ["…"], summary: "…", url: "…" },
  …
];
```

…and a new section block in the page.

For v1, do not build empty case-study scaffolding. YAGNI.

## 8. Press strip — what counts as "press"

The list of 6 outlets in `assets/press-logos/` was vetted from Rudy's existing site. Adding new ones requires:
1. Verified appearance (URL to the article / mention).
2. Logo permission (most major outlets allow editorial use of their logo).
3. Same monochrome treatment.

If something is just "I commented on a LinkedIn post by [outlet]," it doesn't go on the press strip.

## 9. The "$15K in 90 days" rule (one more time)

**This number does not appear in the proof block, in any other section, or anywhere on the site.** It lives on social and on calls. The brief is unambiguous on this — see `references/website-brief-handover.md` §4.3.

If a stat tile drifts toward that claim, rewrite the caption.
