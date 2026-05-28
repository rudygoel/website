/**
 * calendly.ts — lazy-load Calendly widget, handle every [data-cta="primary"]
 * click, fire analytics on booking confirmation, fall back to a new tab on
 * mobile or load timeout.
 */

import { trackCalendlyBooked, trackCtaClick } from "./analytics";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: {
        url: string;
        prefill?: Record<string, string>;
        utm?: Record<string, string>;
      }) => void;
    };
  }
}

const RAW_URL =
  (import.meta.env.VITE_CALENDLY_URL as string | undefined)?.trim() ||
  "https://calendly.com/rudygoel/email-strategy-audit";

const CALENDLY_URL = withBrandTheme(RAW_URL);

function withBrandTheme(url: string): string {
  const params = new URLSearchParams({
    background_color: "16191A",
    text_color: "DDD3C4",
    primary_color: "8B6F4E",
    hide_landing_page_details: "1",
    hide_gdpr_banner: "1",
  });
  return url.includes("?")
    ? `${url}&${params.toString()}`
    : `${url}?${params.toString()}`;
}

let loadStarted = false;
let loadResolved = false;
let loadPromise: Promise<void> | null = null;

function loadCalendly(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadStarted = true;

  loadPromise = new Promise<void>((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => {
      loadResolved = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Calendly script failed to load"));
    document.head.appendChild(script);

    // 3s timeout fallback
    setTimeout(() => {
      if (!loadResolved) reject(new Error("Calendly load timeout"));
    }, 3000);
  });

  return loadPromise;
}

function preWarm(): void {
  if (loadStarted) return;
  loadCalendly().catch(() => {
    /* swallow — we'll fall back on click */
  });
}

function openCalendly(): void {
  trackCtaClick();

  // Mobile fallback — Calendly modal feels broken on iOS Safari
  if (window.innerWidth < 540) {
    window.open(CALENDLY_URL, "_blank", "noopener");
    return;
  }

  loadCalendly()
    .then(() => {
      // Defer one frame to let widget.js attach
      requestAnimationFrame(() => {
        if (window.Calendly) {
          window.Calendly.initPopupWidget({
            url: CALENDLY_URL,
            utm: {
              utmSource: "rudygoel.com",
              utmMedium: "website",
              utmCampaign: "audit-cta",
            },
          });
        } else {
          window.open(CALENDLY_URL, "_blank", "noopener");
        }
      });
    })
    .catch(() => {
      window.open(CALENDLY_URL, "_blank", "noopener");
    });
}

export function initCalendly(): void {
  // Pre-warm on first interaction (cheap, doesn't open modal yet)
  const warmEvents: Array<keyof DocumentEventMap> = [
    "mouseover",
    "touchstart",
    "focus",
  ];
  warmEvents.forEach((ev) => {
    document.addEventListener(ev as string, preWarm, {
      once: true,
      passive: true,
      capture: true,
    });
  });

  // Click delegation for every primary CTA
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const trigger = target.closest<HTMLElement>('[data-cta="primary"]');
    if (!trigger) return;
    e.preventDefault();
    openCalendly();
  });

  // Calendly fires postMessage on schedule confirmation
  window.addEventListener("message", (e) => {
    const data = e.data as { event?: string } | null;
    if (data?.event === "calendly.event_scheduled") {
      trackCalendlyBooked();
    }
  });
}
