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

const root = document.documentElement;

const reduced =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduced) {
  root.dataset.motion = "off";
} else {
  root.dataset.motion = "on";
  init();
}

function init(): void {
  gsap.registerPlugin(CustomEase, ScrollTrigger);
  CustomEase.create("rg", "0.625, 0.05, 0, 1");
  gsap.defaults({ duration: 0.6, ease: "rg" });

  setupAnchorClicks();

  initHero();
  initSectionReveals();
  initStaggerGroups();
  initNav();
  initScrollProgress();
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
 * Juan Mora style hero: Rudy [image] Goel.
 * - Two name halves slide up from below in a single mask
 * - Image cycles through ~3 photos every 3.6s with cross-fade
 * - Top-left tagline + bottom-right role fade up
 */
function initJmHero(nameEl: HTMLElement): void {
  const taglineEl = document.querySelector<HTMLElement>(
    '[data-hero-anim="tagline"]',
  );
  const roleEl = document.querySelector<HTMLElement>(
    '[data-hero-anim="role"]',
  );
  const cycleImgs = Array.from(
    nameEl.querySelectorAll<HTMLElement>(".hero__cycle-img"),
  );
  const nameParts = Array.from(
    nameEl.querySelectorAll<HTMLElement>(".hero__name-part"),
  );

  // Wrap each name part in an overflow:hidden mask
  const innerEls: HTMLElement[] = [];
  nameParts.forEach((part) => {
    const wrap = document.createElement("span");
    wrap.className = "hero__name-part";
    wrap.style.display = "inline-block";
    wrap.style.overflow = "hidden";
    wrap.style.lineHeight = "0.9";
    wrap.style.paddingBottom = "0.08em";
    wrap.style.flexShrink = "0";
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = part.textContent || "";
    wrap.appendChild(inner);
    part.replaceWith(wrap);
    innerEls.push(inner);
  });

  // Mouse-driven interaction: name halves stretch on the X axis,
  // cycle image follows mouse, symbol changes per region of 4.
  initMouseDrivenName(nameEl, cycleImgs);

  // If page is hidden, skip the entrance (preview tools, background tabs)
  if (document.hidden) return;

  // Initial states
  gsap.set([taglineEl, roleEl], { autoAlpha: 0, y: 14 });
  gsap.set(innerEls, { yPercent: 105 });
  gsap.set(cycleImgs[0], { autoAlpha: 0, scale: 1.04 });

  const tl = gsap.timeline({ delay: 0.2 });
  tl.to(taglineEl, { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
    .to(
      innerEls,
      { yPercent: 0, duration: 1.05, stagger: 0.12, ease: "rg" },
      0.05,
    )
    .to(
      cycleImgs[0],
      { autoAlpha: 1, scale: 1, duration: 0.95, ease: "rg" },
      0.5,
    )
    .to(roleEl, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.85);
}

/**
 * Mouse-driven name interaction.
 *
 * - Two halves of the name are absolutely positioned, anchored to opposite
 *   edges of the hero name container. `transform: scaleX(N)` is set on each
 *   from JS so the half close to the mouse smooshes (small scaleX) while
 *   the far half expands (large scaleX).
 * - The cycle card follows mouse X (clamped within container) via translateX.
 * - 4 regions split horizontally across the container; each region activates
 *   a different symbol, swapped with .is-active class so the CSS cross-fade
 *   handles the transition.
 * - On mouseleave the layout settles back to the rest position (centered,
 *   both halves at scaleX 1, region-0 symbol active).
 */
function initMouseDrivenName(
  nameEl: HTMLElement,
  cycleImgs: HTMLElement[],
): void {
  const leftEl = nameEl.querySelector<HTMLElement>(
    '.hero__name-part--left',
  );
  const rightEl = nameEl.querySelector<HTMLElement>(
    '.hero__name-part--right',
  );
  const cycleEl = nameEl.querySelector<HTMLElement>(
    '.hero__cycle--symbols',
  );
  if (!leftEl || !rightEl || !cycleEl) return;

  // Range constants
  const SCALE_MIN = 0.32;
  const SCALE_MAX = 1.7;

  // Cached natural widths (measured at scaleX 1 with fonts ready)
  let leftNat = 0;
  let rightNat = 0;
  let containerW = 0;
  let cycleW = 0;
  let containerLeft = 0;
  let activeRegion = 0;

  const measure = (): void => {
    // Reset transforms to measure natural width
    leftEl.style.transform = 'translateY(-50%) scaleX(1)';
    rightEl.style.transform = 'translateY(-50%) scaleX(1)';
    cycleEl.style.transform = 'translate3d(0, 0, 0)';
    const lr = leftEl.getBoundingClientRect();
    const rr = rightEl.getBoundingClientRect();
    const nr = nameEl.getBoundingClientRect();
    const cr = cycleEl.getBoundingClientRect();
    leftNat = lr.width;
    rightNat = rr.width;
    containerW = nr.width;
    containerLeft = nr.left;
    cycleW = cr.width;
    // Apply rest position
    applyRestState();
  };

  const setRegion = (region: number): void => {
    if (region === activeRegion) return;
    cycleImgs.forEach((img) => img.classList.remove('is-active'));
    if (cycleImgs[region]) {
      cycleImgs[region].classList.add('is-active');
      activeRegion = region;
    }
  };

  const applyRestState = (): void => {
    // Image centered, both halves slightly expanded to fill space evenly
    const targetCx = containerW / 2;
    const leftAvail = targetCx - cycleW / 2;
    const rightAvail = containerW - targetCx - cycleW / 2;
    const leftScale = clamp(leftAvail / leftNat, SCALE_MIN, SCALE_MAX);
    const rightScale = clamp(rightAvail / rightNat, SCALE_MIN, SCALE_MAX);
    leftEl.style.transform = `translateY(-50%) scaleX(${leftScale})`;
    rightEl.style.transform = `translateY(-50%) scaleX(${rightScale})`;
    cycleEl.style.transform = `translate3d(${targetCx - cycleW / 2}px, 0, 0)`;
    setRegion(0);
  };

  const onMove = (e: PointerEvent): void => {
    if (containerW === 0) return;
    const localX = clamp(e.clientX - containerLeft, 0, containerW);
    const ratio = localX / containerW;
    // Image x center, clamped so it never clips the edges
    const imgCx = clamp(localX, cycleW / 2 + 8, containerW - cycleW / 2 - 8);
    const leftAvail = imgCx - cycleW / 2;
    const rightAvail = containerW - imgCx - cycleW / 2;
    const leftScale = clamp(leftAvail / leftNat, SCALE_MIN, SCALE_MAX);
    const rightScale = clamp(rightAvail / rightNat, SCALE_MIN, SCALE_MAX);

    leftEl.style.transform = `translateY(-50%) scaleX(${leftScale})`;
    rightEl.style.transform = `translateY(-50%) scaleX(${rightScale})`;
    cycleEl.style.transform = `translate3d(${imgCx - cycleW / 2}px, 0, 0)`;

    // Region: 0..3 based on horizontal position
    setRegion(Math.min(3, Math.floor(ratio * 4)));
  };

  const onLeave = (): void => {
    applyRestState();
  };

  // Wait for fonts before measuring
  const ready = (
    document as unknown as { fonts?: { ready?: Promise<unknown> } }
  ).fonts?.ready ?? Promise.resolve();
  ready.then(() => measure());
  window.addEventListener('resize', measure);

  const heroEl = document.getElementById('hero');
  if (!heroEl) return;
  heroEl.addEventListener('pointermove', onMove);
  heroEl.addEventListener('pointerleave', onLeave);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
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

/**
 * Lightweight word-mask: wraps each word in <span class="split-word">
 * with an inner <span class="split-word__inner"> we can yPercent.
 */
type WordMask = { inner: HTMLElement };

function wordMask(el: HTMLElement): WordMask[] {
  const html = el.innerHTML;
  const result: WordMask[] = [];

  // Tokenise: keep whitespace, em tags. We split by whitespace but preserve <em>...</em> as one word.
  const frag = document.createElement("div");
  frag.innerHTML = html;

  const out: string[] = [];
  flatten(frag, out);

  el.innerHTML = "";
  for (const piece of out) {
    if (piece.trim() === "") {
      el.appendChild(document.createTextNode(piece));
      continue;
    }
    const word = document.createElement("span");
    word.className = "split-word";
    const inner = document.createElement("span");
    inner.className = "split-word__inner";
    inner.innerHTML = piece;
    word.appendChild(inner);
    el.appendChild(word);
    result.push({ inner });
  }

  return result;
}

function flatten(node: Node, out: string[]): void {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
      const tokens = text.split(/(\s+)/);
      for (const t of tokens) if (t.length) out.push(t);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      // Treat the whole <em> (or any inline element) as a single word token.
      out.push((child as HTMLElement).outerHTML);
    }
  }
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
