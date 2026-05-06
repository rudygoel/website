/**
 * proof.ts — single source of truth for the Proof section.
 * Update this file to add/remove clients, stats, testimonials, or press.
 * Renderers in main.ts read these arrays and inject markup.
 */

export type Client = {
  name: string;
  role: string;
  logo: string | null;
};

export type Stat = {
  number: string;
  caption: string;
};

export type WrittenTestimonial = {
  type: "written";
  name: string;
  role: string;
  business?: string;
  location?: string;
  avatar: string | null;
  brandLogo?: string | null;
  quote: string;
};

export type VideoTestimonial = {
  type: "video";
  featured?: boolean;
  name: string;
  role: string;
  business?: string;
  location?: string;
  poster: string;
  src: string | null;
  duration: string;
  caption?: string;
};

export type Testimonial = WrittenTestimonial | VideoTestimonial;

export type Press = {
  name: string;
  logo: string;
};

export type WritingPost = {
  date: string;
  channel: "LINKEDIN" | "INSTAGRAM" | "FACEBOOK";
  excerpt: string;
  url: string;
};

export const clients: ReadonlyArray<Client> = [
  { name: "Byron Dempsey", role: "Driven Young / Founders Retreat", logo: null },
  { name: "Kishan Bodalia", role: "DJ Accelerator / Bodalia Academy", logo: null },
  { name: "Mike Fox", role: "Lone Wolf Unleashed", logo: null },
  { name: "Rupert Bryce", role: "Performance Strategies", logo: null },
  { name: "Terrence", role: "Broadcast retainers", logo: null },
];

export const stats: ReadonlyArray<Stat> = [
  { number: "[47%]", caption: "Open rate on Easter promo for [Client]" },
  { number: "[$15K]", caption: "Recovered from a re-engagement sequence in 14 days" },
  { number: "[3.2×]", caption: "Reply rate after voice rebuild for a mastermind launch" },
];

export const testimonials: ReadonlyArray<Testimonial> = [
  /* ---------- VIDEO TESTIMONIALS (portrait) ---------- */
  {
    type: "video",
    featured: true,
    name: "Matthew Volkwyn",
    role: "Founder",
    business: "The Dojo",
    location: "[CITY · COUNTRY]",
    poster: "/assets/testimonials/matthew-volkwyn-video-poster.jpg",
    src: null,
    duration: "1:24",
    caption:
      "A millionaire copywriter reads, reviews, and loves my copy. Zero feedback. He calls me by my full name, Rudraksh.",
  },
  {
    type: "video",
    name: "[CLIENT NAME]",
    role: "[ROLE]",
    business: "[BUSINESS]",
    location: "[CITY · COUNTRY]",
    poster: "/assets/testimonials/matthew-volkwyn-video-poster.jpg",
    src: null,
    duration: "0:58",
    caption: "[Second short-form video testimonial. Portrait orientation.]",
  },

  /* ---------- WRITTEN TESTIMONIALS (real) ---------- */
  {
    type: "written",
    name: "Joel Edgley",
    role: "Owner",
    business: "FINEDGE Media",
    location: "[CITY · COUNTRY]",
    avatar: null,
    brandLogo: "/assets/testimonials/finedge-media-logo.png",
    quote:
      "Rudy has provided me with more than I could ever ask for. I needed a copywriter and was initially skeptical. It is hard for someone to truly understand your voice. He exceeded my expectations and has become a guiding force for my business and its messaging. Not only does Rudy write beautifully and convert potential customers into lasting relationships, but he has also acted as a sounding board for ideas. His work has been a significant contributor to the growth of FINEDGE Media.",
  },
  {
    type: "written",
    name: "Jose Williams",
    role: "Copywriter",
    business: "Law firm and legal business specialist",
    location: "[CITY · COUNTRY]",
    avatar: null,
    quote:
      "If you want someone who can not only deliver great copy and drive revenue for your business, but also elevate your own writing skills in the process. Rudy's your guy.",
  },

  /* ---------- WRITTEN TESTIMONIALS (placeholder — replace with real) ---------- */
  {
    type: "written",
    name: "[CLIENT NAME]",
    role: "Performance Coach",
    business: "[BUSINESS NAME]",
    location: "[CITY · COUNTRY]",
    avatar: null,
    quote:
      "Hired Rudy after our welcome sequence converted at 0%. Three weeks later it's pulling 28%. He just gets the voice on draft one, every time.",
  },
  {
    type: "written",
    name: "[CLIENT NAME]",
    role: "Mindset Coach",
    business: "[BUSINESS NAME]",
    location: "[CITY · COUNTRY]",
    avatar: null,
    quote:
      "The first broadcast Rudy sent under my name made $11K. I'm not rounding up. He moves my list like nobody else has.",
  },
  {
    type: "written",
    name: "[CLIENT NAME]",
    role: "High-performance Coach",
    business: "[BUSINESS NAME]",
    location: "[CITY · COUNTRY]",
    avatar: null,
    quote:
      "I've worked with five copywriters. Rudy is the only one who got me on draft one. Saves me an hour a week, easy.",
  },
  {
    type: "written",
    name: "[CLIENT NAME]",
    role: "Founder",
    business: "[BUSINESS NAME]",
    location: "[CITY · COUNTRY]",
    avatar: null,
    quote:
      "Rudy doesn't just write. He thinks. The strategy calls alone are worth the retainer. The emails are a bonus.",
  },
  {
    type: "written",
    name: "[CLIENT NAME]",
    role: "Course Creator",
    business: "[BUSINESS NAME]",
    location: "[CITY · COUNTRY]",
    avatar: null,
    quote:
      "Best decision we made this year was bringing Rudy on for our launch sequence. List has never been hotter.",
  },
  {
    type: "written",
    name: "[CLIENT NAME]",
    role: "Coach",
    business: "[BUSINESS NAME]",
    location: "[CITY · COUNTRY]",
    avatar: null,
    quote:
      "Replies started coming in the same day. Real ones, from real readers. That's the difference Rudy makes.",
  },
];

/* Press logos: SVGs are inlined at runtime by renderPress() so currentColor
   theming works. Each logo renders at a constant height; aspect ratio
   preserves wider/narrower marks naturally. */
export const press: ReadonlyArray<Press> = [
  { name: "Yahoo Finance", logo: "/assets/icons/yahoof.svg" },
  { name: "NBC",          logo: "/assets/icons/nbc.svg" },
  { name: "Forbes",       logo: "/assets/icons/forbes.svg" },
  { name: "KivoDaily",    logo: "/assets/icons/kivodaily.svg" },
  { name: "Entrepreneur", logo: "/assets/icons/entrepreneur.svg" },
  { name: "Amazon",       logo: "/assets/icons/amazon.svg" },
];

export const writingPosts: ReadonlyArray<WritingPost> = [
  {
    date: "[2026 · MAR 12]",
    channel: "LINKEDIN",
    excerpt:
      "[60 to 80 word LinkedIn post excerpt. Rudy will paste in a recent post that proves the writing on its own, no setup required. The best ones land a single belief shift in five sentences and end on a turn.]",
    url: "#",
  },
  {
    date: "[2026 · MAR 09]",
    channel: "LINKEDIN",
    excerpt:
      "[Second LinkedIn excerpt. 60 to 80 words. Goes here verbatim from Rudy's feed. Pick the post that prompted the most replies that week, not the one with the highest reach.]",
    url: "#",
  },
  {
    date: "[2026 · MAR 06]",
    channel: "LINKEDIN",
    excerpt:
      "[Third LinkedIn excerpt. The one your favourite client DMs you about. Keep it tight. This card is craft proof, not the whole post.]",
    url: "#",
  },
];

export const instagramEmbedUrl: string | null = null;
