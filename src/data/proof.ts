/**
 * proof.ts — single source of truth for the Proof section.
 * Update this file to add/remove testimonials or press logos.
 * Renderers in main.ts read these arrays and inject markup.
 */

export type WrittenTestimonial = {
  type: "written";
  name: string;
  role: string;
  business?: string;
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

export const testimonials: ReadonlyArray<Testimonial> = [
  /* ---------- VIDEO TESTIMONIALS (portrait) ---------- */
  {
    type: "video",
    featured: true,
    name: "Kishan",
    role: "Founder",
    business: "The DJ Accelerator",
    poster: "/assets/testimonials/kishan-dj-accelerator-poster.jpg",
    src: "/assets/testimonials/kishan-dj-accelerator.mp4",
    duration: "2:42",
    caption:
      "Kishan, founder of The DJ Accelerator, on what working with Rudy actually changed.",
  },
  {
    type: "video",
    name: "Jasmine",
    role: "Founder",
    business: "The Outlier Group",
    poster: "/assets/testimonials/jasmine-outlier-group-poster.jpg",
    src: "/assets/testimonials/jasmine-outlier-group.mp4",
    duration: "2:24",
    caption:
      "Jasmine, founder of The Outlier Group, on what it's like to hand the email channel to Rudy.",
  },

  /* ---------- WRITTEN TESTIMONIALS (real) ---------- */
  /* Order chosen so the stagger carousel features Joel's long quote at the
     central position (index 3 of 6 → position 0). Short quotes (Pav, Alfie)
     sit at the outer positions where the carousel clips them — fine, since
     their full text remains reachable via the chevrons. */
  {
    type: "written",
    name: "Pav Hareesha",
    role: "Creator",
    business: "NetWorth Digital",
    avatar: null,
    quote:
      "From start to end, everything was a breeze. Exactly what I needed. Thanks Rudy.",
  },
  {
    type: "written",
    name: "Matthew Volkwyn",
    role: "Founder",
    business: "The Dojo",
    avatar: null,
    quote:
      "A millionaire copywriter who's helped 7- and 8-figure online businesses generate millions reads, reviews, and loves my copy. Zero feedback. He calls me Rudraksh.",
  },
  {
    type: "written",
    name: "Jose Williams",
    role: "Copywriter",
    business: "Law firm and legal business specialist",
    avatar: null,
    quote:
      "If you want someone who can not only deliver great copy, drive revenue for your business but also elevate your own writing skills in the process... Rudy's your guy.",
  },
  {
    type: "written",
    name: "Joel Edgley",
    role: "Owner",
    business: "FINEDGE Media",
    avatar: null,
    brandLogo: "/assets/testimonials/finedge-media-logo.png",
    quote:
      "Rudy has provided me with more than I could ever ask for. I needed a copywriter and was initially skeptical, it's hard for someone to truly understand your voice. However, Rudy exceeded my expectations and has become a guiding force for my business and its messaging. Not only does Rudy write beautifully and help me convert potential customers into lasting relationships, but he has also acted as a valuable sounding board for ideas to help my business grow. His work has been a significant contributor to the growth of my company, FINEDGE Media.",
  },
  {
    type: "written",
    name: "Loki Kumar",
    role: "Founder",
    business: "Nunik Co.",
    avatar: null,
    quote:
      "Rudy completely transformed my business's digital presence! He crafted a custom brand identity and voice guide that speaks perfectly to my audience, significantly enhancing the impact of my content. His attention to detail is remarkable, and he truly takes the time to build a real human connection. Highly recommend!",
  },
  {
    type: "written",
    name: "Alfie Jorge",
    role: "Coach",
    business: "UnlockYou",
    avatar: null,
    quote:
      "Rudy is a brilliant email copywriter who knows exactly how to get readers to stop scrolling and start clicking. They consistently deliver crisp, persuasive, and highly engaging emails that convert.",
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

