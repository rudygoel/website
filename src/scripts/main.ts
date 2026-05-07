/**
 * main.ts — entry. Imports styles, renders the data-driven Proof block,
 * mounts social SVGs, wires hamburger + video play, then loads the heavier
 * motion + analytics modules.
 */

import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/layout.css";
import "../styles/components.css";

import {
  clients,
  stats,
  testimonials,
  press,
  writingPosts,
  instagramEmbedUrl,
  type VideoTestimonial,
} from "../data/proof";

import { initFaq } from "./faq";
import { initCalendly } from "./calendly";
import { loadAnalytics } from "./analytics";
import { trackVideoPlay } from "./analytics";
import { assetUrl } from "../lib/utils";

// -----------------------------------------------
// Social SVG glyphs (currentColor; clean, monochrome)
// -----------------------------------------------

const SOCIAL_SVG: Record<string, string> = {
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.06 1.8.25 2.2.42.6.23 1 .5 1.5 1s.77.9 1 1.5c.17.4.36 1 .42 2.2.07 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.06 1.2-.25 1.8-.42 2.2-.23.6-.5 1-1 1.5s-.9.77-1.5 1c-.4.17-1 .36-2.2.42-1.2.07-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.06-1.8-.25-2.2-.42a4 4 0 0 1-1.5-1c-.5-.5-.77-.9-1-1.5-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.06-1.2.25-1.8.42-2.2.23-.6.5-1 1-1.5s.9-.77 1.5-1c.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5 0-4.7.07-1.1.05-1.7.23-2.1.39-.5.2-.85.43-1.23.81a3.3 3.3 0 0 0-.81 1.23c-.16.4-.34 1-.39 2.1C2.7 8.5 2.7 8.85 2.7 12s0 3.5.07 4.7c.05 1.1.23 1.7.39 2.1.2.5.43.85.81 1.23.38.38.73.61 1.23.81.4.16 1 .34 2.1.39 1.2.07 1.55.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.23 2.1-.39.5-.2.85-.43 1.23-.81.38-.38.61-.73.81-1.23.16-.4.34-1 .39-2.1.07-1.2.07-1.55.07-4.7s0-3.5-.07-4.7c-.05-1.1-.23-1.7-.39-2.1a3.3 3.3 0 0 0-.81-1.23 3.3 3.3 0 0 0-1.23-.81c-.4-.16-1-.34-2.1-.39C15.5 4 15.15 4 12 4zm0 3.05A4.95 4.95 0 1 1 7.05 12 4.95 4.95 0 0 1 12 7.05zm0 1.8A3.15 3.15 0 1 0 15.15 12 3.15 3.15 0 0 0 12 8.85zm6-2.05a1.15 1.15 0 1 1-1.15-1.15A1.15 1.15 0 0 1 18 6.8z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.6 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v8.43h-4.56v-7.47c0-1.78-.03-4.07-2.48-4.07-2.48 0-2.86 1.94-2.86 3.94V22H7.82V8z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.7 6.9a5.45 5.45 0 0 1-3.2-1 5.4 5.4 0 0 1-2-3.4h-3.6v13.05a2.7 2.7 0 1 1-1.95-2.6V9.3a6.4 6.4 0 1 0 5.55 6.34V9.7a8.95 8.95 0 0 0 5.2 1.65v-3.6c-.05 0 0 .15 0 .15z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5C.1 8.4.1 12 .1 12s0 3.6.4 5.5a3 3 0 0 0 2.1 2.1c1.9.4 9.4.4 9.4.4s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1c.4-1.9.4-5.5.4-5.5s0-3.6-.4-5.5zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>`,
};

function mountSocialSvgs(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-social]");
  links.forEach((a) => {
    const key = a.dataset.social;
    if (!key) return;
    const svg = SOCIAL_SVG[key];
    if (!svg) return;
    if (a.querySelector("svg")) return;
    // For drawer/footer keep the text label if there's text content already
    const hasText = a.textContent?.trim();
    a.insertAdjacentHTML("afterbegin", svg);
    if (!hasText && !a.getAttribute("aria-label")) {
      a.setAttribute("aria-label", key);
    }
  });
}

/**
 * Fetch + inline the SVG icons referenced by [data-nav-icon].
 *
 * Each file in /assets/icons/ ships with a hardcoded `<style>` block:
 *   .cls-1 { fill: #fff }
 * which paints the symbol white on top of a coloured bg circle.
 *
 * Approach: keep the FULL original artwork (bg circle + inner detail +
 * symbol) and just retheme the two layers via CSS:
 *   - `.cls-1` paths (the symbol) inherit `fill: currentColor` from CSS,
 *     so the link's `color` drives them.
 *   - All other paths inherit the SVG's CSS `fill` property, set to a
 *     dark project palette colour for the circle background.
 *
 * We strip only the embedded `<style>` so it can't override our CSS.
 */
async function mountNavIcons(): Promise<void> {
  const nodes = document.querySelectorAll<HTMLAnchorElement>("[data-nav-icon]");
  if (nodes.length === 0) return;

  await Promise.all(
    Array.from(nodes).map(async (a) => {
      const src = a.dataset.navIcon;
      if (!src) return;
      try {
        const res = await fetch(assetUrl(src));
        if (!res.ok) return;
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        const svg = doc.documentElement;
        if (!(svg instanceof SVGElement)) return;
        // Strip the embedded style block (it baked white into .cls-1).
        svg.querySelectorAll("style, defs").forEach((el) => el.remove());
        // Strip ID/data-name to avoid duplicate IDs across multiple icons.
        svg.removeAttribute("id");
        svg.removeAttribute("data-name");
        svg.removeAttribute("fill");
        svg.setAttribute("aria-hidden", "true");
        a.insertAdjacentHTML("afterbegin", svg.outerHTML);
      } catch {
        /* swallow; circle just stays empty if asset is missing */
      }
    }),
  );
}

// -----------------------------------------------
// Proof block renderers
// -----------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderRoster(): void {
  const mount = document.querySelector<HTMLElement>('[data-proof="roster"]');
  if (!mount) return;
  if (clients.length === 0) {
    mount.remove();
    return;
  }
  const items = clients
    .map(
      (c) => `
      <li>
        <strong>${escapeHtml(c.name)}</strong>
        <span>${escapeHtml(c.role)}</span>
      </li>`,
    )
    .join("");
  mount.innerHTML = `
    <header class="proof__sub-head">
      <h3>The roster, <em>so far</em>.</h3>
      <span class="meta">${clients.length} clients</span>
    </header>
    <ul class="proof__roster-row" role="list">${items}</ul>
  `;
}

function renderStats(): void {
  const grid = document.querySelector<HTMLElement>(
    '[data-proof="stats-grid"]',
  );
  const wrap = document.querySelector<HTMLElement>('[data-proof="stats"]');
  if (!grid || !wrap) return;
  if (stats.length === 0) {
    wrap.remove();
    return;
  }
  grid.innerHTML = stats
    .map(
      (s) => `
      <div class="stat-tile">
        <span class="stat-tile__num"><em>${escapeHtml(s.number)}</em></span>
        <p class="stat-tile__caption">${escapeHtml(s.caption)}</p>
      </div>`,
    )
    .join("");
}

function renderPortraitVideos(): void {
  const mount = document.querySelector<HTMLElement>('[data-proof="portraits"]');
  if (!mount) return;
  const videos = testimonials
    .filter((t): t is VideoTestimonial => t.type === "video")
    .slice(0, 2);
  if (videos.length === 0) {
    mount.remove();
    return;
  }
  mount.innerHTML = videos
    .map((v) => {
      const meta = [v.role, v.business].filter(Boolean).join(" at ");
      const author = meta ? `${v.name}, ${meta}` : v.name;
      const desc = v.caption || "[Short description of what's covered in the video. Fill in later.]";
      return `
      <figure class="portrait-video-figure">
        <div class="portrait-video"
             data-video-name="${escapeHtml(v.name)}"
             data-video-src="${v.src ? escapeHtml(assetUrl(v.src)) : ""}">
          <img src="${escapeHtml(assetUrl(v.poster))}" alt="${escapeHtml(v.name)}" loading="lazy" decoding="async" />
          <button type="button" class="portrait-video__play" aria-label="Play testimonial from ${escapeHtml(v.name)}">
            <span class="portrait-video__icon" aria-hidden="true">▶</span>
          </button>
          <span class="portrait-video__duration">${escapeHtml(v.duration)}</span>
        </div>
        <figcaption class="portrait-video__alt">
          <span class="portrait-video__alt-author">${escapeHtml(author)}</span>
          <span class="portrait-video__alt-desc">${escapeHtml(desc)}</span>
        </figcaption>
      </figure>
    `;
    })
    .join("");
}

/* StaggerTestimonials is a React island. Imported lazily so React is only
   pulled in by users who scroll to the proof section. */
function mountStaggerIsland(): void {
  if (!document.getElementById("stagger-mount")) return;
  import("./stagger-mount").then((m) => m.mountStagger()).catch(() => {
    /* fail soft — section just won't appear */
  });
}

/**
 * Sanitise an SVG markup string so it inherits colour from CSS:
 * - drop XML prolog and any <style> blocks (which can hardcode fills)
 * - drop `class` and `fill` attributes from inner elements
 * - set `fill="currentColor"` on the root <svg>
 * - drop the document `id` so duplicates in the DOM don't collide
 */
function sanitiseSvg(raw: string, label: string): string {
  let svg = raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\s(class|fill|stroke)="[^"]*"/gi, "");
  // Inject fill + a11y label on the root <svg>
  svg = svg.replace(
    /<svg([^>]*)>/i,
    `<svg$1 fill="currentColor" role="img" aria-label="${label.replace(/"/g, "&quot;")}">`,
  );
  return svg;
}

async function renderPress(): Promise<void> {
  const row = document.querySelector<HTMLElement>('[data-proof="press-row"]');
  const wrap = document.querySelector<HTMLElement>('[data-proof="press"]');
  if (!row || !wrap) return;
  if (press.length === 0) {
    wrap.remove();
    return;
  }

  // Fetch + sanitise each SVG. Items that fail to load are dropped silently.
  const fetched = await Promise.all(
    press.map(async (p) => {
      try {
        const res = await fetch(assetUrl(p.logo));
        if (!res.ok) return null;
        const text = await res.text();
        if (!text.trim().toLowerCase().startsWith("<svg") &&
            !text.trim().toLowerCase().startsWith("<?xml")) return null;
        return { name: p.name, svg: sanitiseSvg(text, p.name) };
      } catch {
        return null;
      }
    }),
  );

  const items = fetched
    .filter((x): x is { name: string; svg: string } => x !== null)
    .map(
      (p) => `<span class="press-marquee__item" data-brand="${escapeHtml(p.name)}">${p.svg}</span>`,
    )
    .join("");

  // Duplicate the list so the CSS keyframe can translate -50% for a seamless loop.
  row.innerHTML = items + items;
  row.setAttribute("aria-hidden", "true");
}

function renderWriting(): void {
  const grid = document.querySelector<HTMLElement>('[data-proof="writing"]');
  if (!grid) return;
  const tiles = writingPosts.map((post) => {
    const channelLabel = post.channel === "INSTAGRAM" ? "Instagram" : post.channel === "FACEBOOK" ? "Facebook" : "LinkedIn";
    const cta =
      post.channel === "LINKEDIN"
        ? "Read on LinkedIn ↗"
        : post.channel === "INSTAGRAM"
          ? "View on Instagram ↗"
          : "Read on Facebook ↗";
    return `
      <a class="writing-tile" href="${escapeHtml(post.url)}" target="_blank" rel="noopener">
        <span class="writing-tile__date">${escapeHtml(post.date)} · ${escapeHtml(channelLabel.toUpperCase())}</span>
        <p class="writing-tile__excerpt">${escapeHtml(post.excerpt)}</p>
        <span class="link writing-tile__cta">${escapeHtml(cta)}</span>
      </a>
    `;
  });

  if (instagramEmbedUrl) {
    tiles.push(`
      <a class="writing-tile writing-tile--ig" href="${escapeHtml(instagramEmbedUrl)}" target="_blank" rel="noopener">
        <span class="writing-tile__date">INSTAGRAM</span>
        <p class="writing-tile__excerpt">[Instagram embed will load here once a public URL is supplied.]</p>
        <span class="link writing-tile__cta">View on Instagram ↗</span>
      </a>
    `);
  }

  grid.innerHTML = tiles.join("");
}

// -----------------------------------------------
// Video testimonial: lazy-mount <video> on click
// -----------------------------------------------

function initVideoTestimonials(): void {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const btn = target.closest<HTMLButtonElement>(
      ".testimonial-video__play, .portrait-video__play",
    );
    if (!btn) return;
    const figure = btn.closest<HTMLElement>(".testimonial-video, .portrait-video");
    if (!figure) return;

    const src = figure.dataset.videoSrc;
    const name = figure.dataset.videoName ?? "testimonial";
    const isPortrait = figure.classList.contains("portrait-video");

    if (!src) {
      btn.setAttribute("aria-disabled", "true");
      return;
    }

    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = src;
    video.style.position = "absolute";
    video.style.inset = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    if (!isPortrait) {
      video.style.position = "static";
      video.style.aspectRatio = "16 / 9";
      video.style.borderRadius = "var(--radius-md)";
      video.style.background = "var(--color-surface-1)";
    }

    btn.replaceWith(video);
    trackVideoPlay(name);
  });
}

// -----------------------------------------------
// Mobile nav drawer
// -----------------------------------------------

function initMobileNav(): void {
  const nav = document.querySelector<HTMLElement>(".nav");
  const btn = document.querySelector<HTMLButtonElement>(".nav__hamburger");
  const drawer = document.querySelector<HTMLElement>(".nav__drawer");
  if (!nav || !btn || !drawer) return;

  drawer.removeAttribute("hidden");

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Close on link click
  drawer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (target && target.tagName === "A") {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      btn.focus();
    }
  });
}

// -----------------------------------------------
// Footer "last updated" date
// -----------------------------------------------

function setFooterDate(): void {
  const node = document.querySelector(".footer__legal span:last-child");
  if (!node) return;
  const d = new Date();
  const month = d.toLocaleString("en-AU", { month: "short" }).toUpperCase();
  const txt = `BUILT IN BRISBANE · LAST UPDATED ${d.getFullYear()} · ${month}`;
  node.textContent = txt;
}

// -----------------------------------------------
// Boot
// -----------------------------------------------

function boot(): void {
  mountSocialSvgs();
  mountNavIcons();
  renderRoster();
  renderStats();
  renderPortraitVideos();
  mountStaggerIsland();
  renderPress();
  renderWriting();
  initVideoTestimonials();
  initMobileNav();
  initFaq();
  initCalendly();
  setFooterDate();

  initPreloader();

  // Motion is heaviest — load via dynamic import so it can be a separate chunk.
  import("./motion").catch(() => {
    /* if motion fails, page is still usable */
  });

  // Defer analytics until idle
  const idle =
    (window as unknown as { requestIdleCallback?: (cb: () => void) => void })
      .requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000));
  idle(() => loadAnalytics());
}

/**
 * Preloader. Wait for fonts + DOM ready + a short minimum so the bar fill
 * animation has time to play. Then mark done; CSS transitions it out.
 */
function initPreloader(): void {
  const node = document.getElementById("preloader");
  if (!node) return;

  const minDelay = new Promise<void>((r) => setTimeout(r, 1100));
  const fontsReady =
    (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts
      ?.ready ?? Promise.resolve();

  // Failsafe: never block the page longer than 2.6s total
  const failsafe = new Promise<void>((r) => setTimeout(r, 2600));

  Promise.race([Promise.all([minDelay, fontsReady]), failsafe]).then(() => {
    node.dataset.state = "done";
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
