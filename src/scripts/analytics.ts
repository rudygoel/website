/**
 * analytics.ts — thin wrappers around gtag and fbq.
 * Both are loaded by tags injected via main.ts on idle (post-FCP).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined)?.trim();
const META_PIXEL_ID = (
  import.meta.env.VITE_META_PIXEL_ID as string | undefined
)?.trim();

const ga4Enabled = !!GA4_ID && !GA4_ID.startsWith("G-XXXX");
const metaEnabled =
  !!META_PIXEL_ID && META_PIXEL_ID !== "000000000000000";

export function loadAnalytics(): void {
  if (ga4Enabled) loadGA4(GA4_ID!);
  if (metaEnabled) loadMetaPixel(META_PIXEL_ID!);
}

function loadGA4(id: string): void {
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]): void {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, {
    send_page_view: true,
    anonymize_ip: true,
  });
}

function loadMetaPixel(id: string): void {
  /* eslint-disable */
  // Standard FB pixel snippet, typed loose.
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = !0;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(
    window as any,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );
  /* eslint-enable */
  window.fbq?.("init", id);
  window.fbq?.("track", "PageView");
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  window.gtag?.("event", name, params);
}

export function trackCalendlyBooked(): void {
  trackEvent("audit_booked", { value: 1, event_category: "conversion" });
  window.fbq?.("track", "Schedule");
  window.fbq?.("track", "Lead");
}

export function trackCtaClick(): void {
  trackEvent("cta_click", { event_category: "engagement" });
}

export function trackVideoPlay(name: string): void {
  trackEvent("video_play", { video_name: name });
}

export function trackFaqOpen(question: string): void {
  trackEvent("faq_open", { faq_question: question });
}
