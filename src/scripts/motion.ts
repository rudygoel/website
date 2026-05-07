/**
 * motion.ts — GSAP + scroll/hover behaviours.
 *
 * Hero stagger landing (~900ms), one [data-reveal] per section,
 * native smooth scroll, nav scroll-state + theme-swap,
 * active nav-link via IntersectionObserver, scroll-progress bar.
 *
 * Bails entirely under prefers-reduced-motion (sets data-motion="off"
 * so CSS overrides ensure all reveal-tagged content is visible).
 */

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { assetUrl } from "../lib/utils";

const root = document.documentElement;

const reduced =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Symbol set — uses PNG icons in /assets/icons/.
   Each entry: src + box width + object-position. The width range is
   intentionally wide so the wordmark visibly stretches as the symbol swaps,
   and each icon sits at a slightly different x within the box so the gap
   on one side looks bigger than the other. */
/* Symbol set. All symbols share the box's fixed size — only the PNG
   inside swaps. No per-symbol width. */
type SymbolDef = { src: string };
const SYMBOL_MAP: Record<string, SymbolDef> = {
  email:  { src: assetUrl("/assets/icons/email.png")  },
  msg:    { src: assetUrl("/assets/icons/msg.png")    },
  letter: { src: assetUrl("/assets/icons/letter.png") },
  alert:  { src: assetUrl("/assets/icons/alert.png")  },
};

const SYMBOL_KEYS = ["email", "msg", "letter", "alert"] as const;
const DEFAULT_SYMBOL = "email";

if (reduced) {
  root.dataset.motion = "off";
  // Still mount a default symbol so the wordmark looks complete.
  mountDefaultSymbol();
} else {
  root.dataset.motion = "on";
  init();
}

/* Mount all PNG symbols once into the box, then toggle .is-active.
   Crossfade is driven by CSS opacity transitions. */
function mountSymbols(box: HTMLElement): HTMLImageElement[] {
  if (box.children.length > 0) {
    return Array.from(box.querySelectorAll<HTMLImageElement>(".hero__symbol-img"));
  }
  return SYMBOL_KEYS.map((key) => {
    const def = SYMBOL_MAP[key];
    const img = document.createElement("img");
    img.src = def.src;
    img.alt = "";
    img.className = "hero__symbol-img";
    img.dataset.symbol = key;
    img.decoding = "async";
    box.appendChild(img);
    return img;
  });
}

function mountDefaultSymbol(): void {
  const box = document.querySelector<HTMLElement>("[data-symbol-box]");
  if (!box) return;
  const imgs = mountSymbols(box);
  imgs.forEach((img) => img.classList.toggle("is-active", img.dataset.symbol === DEFAULT_SYMBOL));
}

function init(): void {
  gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);
  CustomEase.create("rg", "0.625, 0.05, 0, 1");
  CustomEase.create("rgBox", "0.65, 0, 0.35, 1");
  gsap.defaults({ duration: 0.6, ease: "rg" });

  initLenis();
  setupAnchorClicks();

  initHero();
  initSectionReveals();
  initStaggerGroups();
  initNav();
  initScrollProgress();
}

/**
 * Lenis smooth scroll, tied to GSAP's ticker so ScrollTrigger
 * can read the latest scroll position on every frame.
 */
async function initLenis(): Promise<void> {
  try {
    const { default: Lenis } = await import("lenis");
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.1,
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } catch {
    /* Lenis is optional — bail silently */
  }
}

/**
 * Stagger groups: one wrapper element with [data-stagger] reveals each child
 * with a small delay between them. Used for testimonial cards and press logos.
 */
function initStaggerGroups(): void {
  if (document.hidden) return;

  const groups = gsap.utils.toArray<HTMLElement>("[data-stagger]");
  for (const group of groups) {
    const items = Array.from(group.children) as HTMLElement[];
    if (items.length === 0) continue;
    gsap.set(items, { autoAlpha: 0, y: 14 });
    ScrollTrigger.create({
      trigger: group,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "rg",
        });
      },
    });
  }
}

/* ---------------------------------------------------------------
   Anchor clicks — native smooth scroll, offset for sticky nav
--------------------------------------------------------------- */

function setupAnchorClicks(): void {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const anchor = target.closest('a[href^="#"]');
    if (!anchor) return;

    // Skip Calendly CTAs — they intercept this click separately.
    if (anchor.hasAttribute("data-cta")) return;

    const href = anchor.getAttribute("href");
    if (!href || href.length < 2) return;

    const el = document.querySelector(href);
    if (!el) return;

    e.preventDefault();
    closeMobileNav();

    const top =
      (el as HTMLElement).getBoundingClientRect().top +
      window.scrollY -
      80;
    window.scrollTo({ top, behavior: "smooth" });
  });
}

function closeMobileNav(): void {
  const nav = document.querySelector(".nav");
  const btn = document.querySelector(".nav__hamburger");
  if (nav?.classList.contains("is-open")) {
    nav.classList.remove("is-open");
    btn?.setAttribute("aria-expanded", "false");
  }
}

/* ---------------------------------------------------------------
   Hero landing animation (~900ms)
--------------------------------------------------------------- */

function initHero(): void {
  // New hero: Rudy [image] Goel
  const nameEl = document.querySelector<HTMLElement>(
    '[data-hero-anim="name"]',
  );
  if (nameEl) {
    initJmHero(nameEl);
    return;
  }

  // Legacy IMPACT hero (kept for completeness, never matches in v3)
  const impactEl = document.querySelector<HTMLElement>(
    '[data-hero-anim="impact"]',
  );
  const subEl = document.querySelector<HTMLElement>('[data-hero-anim="sub"]');
  const ctaEl = document.querySelector<HTMLElement>('[data-hero-anim="cta"]');
  const metaEl = document.querySelector<HTMLElement>(
    '[data-hero-anim="meta"]',
  );

  if (!impactEl) return;

  // Letter-mask the IMPACT word
  const letters = letterMask(impactEl);

  // If the document is hidden (some preview tools, background tabs), GSAP
  // throttles its ticker and animations stall mid-flight. Skip the entrance
  // entirely so content is visible at end-state.
  if (document.hidden) {
    return;
  }

  // Initial states
  gsap.set([subEl, ctaEl, metaEl], { autoAlpha: 0, y: 12 });
  gsap.set(
    letters.map((l) => l.inner),
    { yPercent: 110 },
  );

  let heroAnimDone = false;

  const tl = gsap.timeline({
    delay: 0.12,
    onComplete: () => {
      heroAnimDone = true;
    },
  });

  tl.to(
    letters.map((l) => l.inner),
    { yPercent: 0, duration: 1.05, stagger: { each: 0.06, from: "start" }, ease: "rg" },
    0,
  )
    .to(subEl, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.65)
    .to(ctaEl, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.88)
    .to(metaEl, { autoAlpha: 1, y: 0, duration: 0.45 }, 1.02);

  // Fast-forward on first user scroll
  const ff = (): void => {
    if (heroAnimDone) return;
    tl.timeScale(6);
  };
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 4) ff();
    },
    { once: true, passive: true },
  );
}

/**
 * Hero: Rudy [symbol-box] Goel.
 *
 * - Two rigid words flank an animated PNG-symbol box.
 * - Mouse X across the hero divides into 4 regions, one symbol each.
 * - Each symbol has a target box width; the box width animates between them.
 * - Triggers (data-trigger pills) provide a keyboard/click-accessible path.
 * - SplitText slides chars up on load.
 * - Default rest state: email symbol, mouseleave returns here.
 */
function initJmHero(nameEl: HTMLElement): void {
  const heroEl = document.getElementById("hero");
  const taglineEl = document.querySelector<HTMLElement>(
    '[data-hero-anim="tagline"]',
  );
  const roleEl = document.querySelector<HTMLElement>(
    '[data-hero-anim="role"]',
  );
  const triggersEl = document.querySelector<HTMLElement>(
    '[data-hero-anim="triggers"]',
  );
  const symbolBox = nameEl.querySelector<HTMLElement>("[data-symbol-box]");
  const leftWord = nameEl.querySelector<HTMLElement>(
    '.hero__word[data-word="rudy"]',
  );
  const rightWord = nameEl.querySelector<HTMLElement>(
    '.hero__word[data-word="goel"]',
  );
  if (!symbolBox || !heroEl || !leftWord || !rightWord) return;

  const symbolImgs = mountSymbols(symbolBox);
  const setSymbol = (key: string): void => {
    symbolImgs.forEach((img) =>
      img.classList.toggle("is-active", img.dataset.symbol === key),
    );
  };
  setSymbol(DEFAULT_SYMBOL);

  /* ---------------------------------------------------------------
     Continuous-stretch loop.

     - targetX: where the mouse currently is (0 to 1 across the hero).
     - currentX: the eased follower; lerps toward targetX every frame.
     - At currentX = 0.5 (rest), both words are scaleX 1 and the box
       sits centred between them.
     - As currentX moves, the FAR word stretches and the NEAR word
       compresses. The box translates along with the mouse.
     - Damping factor 0.12 → ~6 frames to settle, the smooth ease feel.
  --------------------------------------------------------------- */

  // Min word scale (most squished). Max stretch is derived per-frame so
  // the far word always reaches the box edge.
  const MIN_SCALE = 0.55;
  const DAMP = 0.12;

  // Landing state: x = 0 (box on left, Rudy squished, email symbol).
  let targetX = 0;
  let currentX = 0;
  let active = false; // pointer is over the hero
  let raf = 0;

  // Bounds cache. Refreshed on resize.
  // - heroLeft / heroWidth: viewport bounds of the hero (used for mouse → x).
  // - innerWidth: width of the .hero__name-inner box (the words' coord system).
  //   leftPad/rightPad/word positions/box position are all in this space.
  const innerEl = nameEl.querySelector<HTMLElement>(".hero__name-inner");
  let heroLeft = 0;
  let heroWidth = 1;
  let innerWidth = 1;
  let leftNat = 0;
  let rightNat = 0;
  const measure = (): void => {
    const hr = heroEl.getBoundingClientRect();
    heroLeft = hr.left;
    heroWidth = hr.width || 1;
    if (innerEl) innerWidth = innerEl.getBoundingClientRect().width || 1;
    leftWord.style.transform = "translateY(-50%) scaleX(1)";
    rightWord.style.transform = "translateY(-50%) scaleX(1)";
    leftNat = leftWord.getBoundingClientRect().width;
    rightNat = rightWord.getBoundingClientRect().width;
  };

  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

  const leftPad = () => parseFloat(getComputedStyle(leftWord).left) || 56;
  const rightPad = () => parseFloat(getComputedStyle(rightWord).right) || 56;

  const apply = (x: number): void => {
    // All x-coordinates here are in the .hero__name-inner space.
    // Rudy is anchored at left:lp, Goel at right:rp. The box uses style.left
    // which is also in inner-space. So we use innerWidth, NOT heroWidth.
    const lp = leftPad();
    const rp = rightPad();
    const boxW = symbolBox.offsetWidth || 1;

    const minCx = lp + leftNat * MIN_SCALE + boxW / 2;
    const maxCx = innerWidth - rp - rightNat * MIN_SCALE - boxW / 2;
    const cx = lerp(minCx, maxCx, x);

    const boxLeft = cx - boxW / 2;
    const boxRight = cx + boxW / 2;

    // Word scales chosen so each word's bounding-box inner edge touches the
    // matching box edge. For Newsreader 700 the visible y/G glyphs sit right
    // at the bounding-box edge, so bounding-box-touching = visible-touching.
    const leftScale = Math.max(MIN_SCALE, (boxLeft - lp) / leftNat);
    const rightScale = Math.max(MIN_SCALE, (innerWidth - rp - boxRight) / rightNat);

    leftWord.style.transform = `translateY(-50%) scaleX(${leftScale.toFixed(3)})`;
    rightWord.style.transform = `translateY(-50%) scaleX(${rightScale.toFixed(3)})`;
    symbolBox.style.left = `${boxLeft.toFixed(1)}px`;

    // Symbol per region (4 zones), default when not active.
    const idx = active
      ? Math.min(SYMBOL_KEYS.length - 1, Math.floor(x * SYMBOL_KEYS.length))
      : SYMBOL_KEYS.indexOf(DEFAULT_SYMBOL as typeof SYMBOL_KEYS[number]);
    const key = SYMBOL_KEYS[idx];
    const currentActive = symbolImgs.find((i) => i.classList.contains("is-active"));
    if (currentActive?.dataset.symbol !== key) {
      setSymbol(key);
    }
  };

  const tick = (): void => {
    currentX = lerp(currentX, targetX, DAMP);
    apply(currentX);
    if (Math.abs(currentX - targetX) > 0.0005 || active) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };
  const startLoop = (): void => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onMove = (e: PointerEvent): void => {
    active = true;
    targetX = Math.max(0, Math.min(1, (e.clientX - heroLeft) / heroWidth));
    startLoop();
  };
  const onLeave = (): void => {
    active = false;
    targetX = 0; // ease back to landing state on exit
    startLoop();
  };

  heroEl.addEventListener("pointermove", onMove);
  heroEl.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", measure);

  // Trigger pills (sr-only, keyboard a11y): nudge target to the symbol's region.
  document.querySelectorAll<HTMLElement>("[data-trigger]").forEach((t) => {
    const idx = SYMBOL_KEYS.indexOf((t.dataset.symbol || DEFAULT_SYMBOL) as typeof SYMBOL_KEYS[number]);
    if (idx < 0) return;
    const center = (idx + 0.5) / SYMBOL_KEYS.length;
    const focus = (): void => { active = true; targetX = center; startLoop(); };
    const blur = (): void => { active = false; targetX = 0; startLoop(); };
    t.addEventListener("focusin", focus);
    t.addEventListener("focusout", blur);
  });

  // Initial measure + paint at rest after fonts load.
  const ready =
    (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts
      ?.ready ?? Promise.resolve();

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    ready.then(() => {
      measure();
      apply(0);
      gsap.set([taglineEl, roleEl, triggersEl], { autoAlpha: 1, y: 0 });
    });
    return;
  }

  // Entrance: only autoAlpha is animated by GSAP. The scale + position
  // come from apply()'s inline transform on the box, so GSAP must not
  // touch transform on .hero__symbol-box.
  gsap.set([taglineEl, roleEl, triggersEl], { autoAlpha: 0, y: 14 });
  symbolBox.style.opacity = "0";

  ready.then(() => {
    measure();
    apply(0);

    if (document.hidden) {
      gsap.set([taglineEl, roleEl, triggersEl], { autoAlpha: 1, y: 0 });
      symbolBox.style.opacity = "1";
      return;
    }

    const splits = [leftWord, rightWord].map(
      (el) => new SplitText(el, { type: "chars", charsClass: "hero__char" }),
    );
    const allChars = splits.flatMap((s) => s.chars as HTMLElement[]);
    allChars.forEach((c) => {
      c.style.display = "inline-block";
      c.style.overflow = "hidden";
      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.style.willChange = "transform";
      inner.textContent = c.textContent;
      c.textContent = "";
      c.appendChild(inner);
    });
    const innerChars = allChars
      .map((c) => c.firstElementChild)
      .filter((n): n is HTMLElement => n instanceof HTMLElement);

    gsap.set(innerChars, { yPercent: 110 });

    const tl = gsap.timeline({ delay: 0.2, onComplete: () => measure() });
    tl.to(taglineEl, { autoAlpha: 1, y: 0, duration: 0.7 }, 0)
      .to(innerChars, { yPercent: 0, duration: 1, stagger: 0.04, ease: "power3.out" }, 0.05)
      .to(symbolBox, { opacity: 1, duration: 0.7, ease: "rgBox" }, 0.55)
      .to(roleEl, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.85)
      .to(triggersEl, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.95);
  });
}

/**
 * Letter mask: wraps each character of an element in an overflow:hidden span
 * with an inner span that can be yPercent translated.
 */
function letterMask(el: HTMLElement): { inner: HTMLElement }[] {
  const text = el.textContent || "";
  el.innerHTML = "";
  el.style.display = "block";
  const out: { inner: HTMLElement }[] = [];
  for (const char of text) {
    if (char === " ") {
      el.appendChild(document.createTextNode(" "));
      continue;
    }
    const wrap = document.createElement("span");
    wrap.style.display = "inline-block";
    wrap.style.overflow = "hidden";
    wrap.style.lineHeight = "1";
    wrap.style.verticalAlign = "top";
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = char;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    out.push({ inner });
  }
  return out;
}

/* ---------------------------------------------------------------
   Section reveals (one per section)
--------------------------------------------------------------- */

function initSectionReveals(): void {
  // If the page is hidden (preview, background tab) GSAP's ticker is
  // throttled and reveals can stall. Skip the hide-then-reveal entirely.
  if (document.hidden) return;

  const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  for (const el of items) {
    gsap.set(el, { autoAlpha: 0, y: 16 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "rg",
        });
      },
    });
  }
  // Catch any element already in viewport at load time
  requestAnimationFrame(() => ScrollTrigger.refresh());

  // Safety: if visibility flips back to hidden mid-animation,
  // jump remaining reveals to their end state.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      for (const el of items) gsap.set(el, { autoAlpha: 1, y: 0 });
    }
  });
}

/* ---------------------------------------------------------------
   Nav: scrolled background + theme swap + active link
--------------------------------------------------------------- */

function initNav(): void {
  const nav = document.querySelector<HTMLElement>(".nav");
  if (!nav) return;

  // Scrolled background after passing hero
  const hero = document.querySelector<HTMLElement>("#hero");
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: "bottom top+=80",
      onEnter: () => nav.classList.add("is-scrolled"),
      onLeaveBack: () => nav.classList.remove("is-scrolled"),
    });
  }

  // Theme swap from sections marked data-nav-theme
  const themed = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
  themed.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 60%",
      end: "bottom 60%",
      onToggle: (st) => {
        if (st.isActive) {
          nav.dataset.theme = sec.dataset.navTheme || "dark";
        } else {
          nav.dataset.theme = "dark";
        }
      },
    });
  });

  // Active nav link via IntersectionObserver on each #section
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(
    "[data-nav-link]",
  );
  const idToLinks = new Map<string, HTMLAnchorElement[]>();
  navLinks.forEach((a) => {
    const id = a.getAttribute("href")?.slice(1);
    if (!id) return;
    const arr = idToLinks.get(id) ?? [];
    arr.push(a);
    idToLinks.set(id, arr);
  });

  const sectionIds = Array.from(idToLinks.keys());
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          for (const [id, links] of idToLinks) {
            for (const link of links) {
              link.classList.toggle("is-active", id === entry.target.id);
            }
          }
        }
      }
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
  );

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  }
}

/* ---------------------------------------------------------------
   Scroll progress bar
--------------------------------------------------------------- */

function initScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>(".scroll-progress");
  if (!bar) return;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
    },
  });
}
