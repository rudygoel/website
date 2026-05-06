# 08 — Integrations

Third-party services the site connects to. Each one has a single concrete spec.

## 1. Calendly (PRIMARY — non-negotiable)

The single CTA across the site is "Book a free 20-minute email audit" and it deep-links into Rudy's Calendly event.

### 1.1 The URL

`https://calendly.com/rudygoel/audit` *(placeholder — Rudy will confirm the exact slug. Until then, treat the URL as configurable via a single constant.)*

Store as a build-time env var: `VITE_CALENDLY_URL=https://calendly.com/rudygoel/audit`. Every CTA reads from this. One source of truth.

### 1.2 Open as modal popup (recommended)

Use the official Calendly inline-widget script. Lazy-load on first CTA hover or after first user interaction (whichever comes first).

```html
<!-- Lazy: do not include in initial <head>. Load via JS. -->
<script>
  let calendlyLoaded = false;
  function loadCalendly() {
    if (calendlyLoaded) return;
    calendlyLoaded = true;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }

  // Pre-warm on first hover or interaction
  ["mouseover", "touchstart", "focus"].forEach(evt =>
    document.addEventListener(evt, loadCalendly, { once: true, passive: true })
  );

  // Click handler on every primary CTA
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest('[data-cta="primary"]');
    if (!trigger) return;
    e.preventDefault();
    loadCalendly();
    // Calendly.initPopupWidget loads even if assets are still fetching
    requestAnimationFrame(() => {
      window.Calendly?.initPopupWidget({
        url: import.meta.env.VITE_CALENDLY_URL,
        prefill: {},
        utm: {
          utmSource: "rudygoel.com",
          utmMedium: "website",
          utmCampaign: "audit-cta",
        },
      });
    });
  });
</script>
```

Mark every primary CTA with `data-cta="primary"` so a single delegated listener handles all of them. Don't attach individual handlers per button.

### 1.3 Styling Calendly's popup

Calendly's modal isn't fully themeable, but you can pass these query params to match brand:

```
?background_color=16191A
&text_color=DDD3C4
&primary_color=8B6F4E
&hide_landing_page_details=1
&hide_gdpr_banner=1
```

Final URL form for the popup:
```
https://calendly.com/rudygoel/audit?background_color=16191A&text_color=DDD3C4&primary_color=8B6F4E&hide_landing_page_details=1&hide_gdpr_banner=1
```

### 1.4 Confirmation event tracking

Calendly fires a `postMessage` with `event: "calendly.event_scheduled"` when a booking completes. Listen for it to fire analytics:

```js
window.addEventListener("message", (e) => {
  if (e.data?.event === "calendly.event_scheduled") {
    // GA4
    window.gtag?.("event", "audit_booked", { value: 1, event_category: "conversion" });
    // Meta Pixel
    window.fbq?.("track", "Schedule");
  }
});
```

### 1.5 Mobile fallback

If `window.innerWidth < 540` OR Calendly script fails to load within 3 seconds, fall back to opening the URL directly in a new tab. Better than a broken modal on iOS Safari.

---

## 2. Google Analytics 4

Required per the brief. Single-page site, so we want enhanced measurement and a manual "audit_booked" event (above).

```html
<!-- in <head>, after meta tags, before tokens.css -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX", {
    send_page_view: true,
    anonymize_ip: true,
  });
</script>
```

Replace `G-XXXXXXXXXX` with Rudy's GA4 measurement ID (env var: `VITE_GA4_ID`).

**Custom events to fire:**
- `audit_booked` — Calendly schedule confirmed (above).
- `cta_click` — any primary CTA click (before Calendly opens). Useful to compare click→book conversion.
- `video_play` — testimonial video play.
- `faq_open` — FAQ accordion expand (with `faq_question` param).
- `scroll_depth` — 25 / 50 / 75 / 100 — handled by GA4 enhanced measurement, no manual code needed.

### 2.1 Privacy

- Use `anonymize_ip: true`.
- Do not load before user consent if Rudy decides to add a consent banner (out of scope for v1 in Australia).
- If a consent banner is later added, gate `gtag.js` behind it.

---

## 3. Meta (Facebook) Pixel

```html
<script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL_ID_HERE');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=PIXEL_ID_HERE&ev=PageView&noscript=1"/></noscript>
```

Replace `PIXEL_ID_HERE` with Rudy's pixel ID (env var: `VITE_META_PIXEL_ID`).

**Events fired:**
- `PageView` — automatic on load.
- `Schedule` — Calendly booking confirmed (above).
- `Lead` — same trigger as Schedule (used for ad optimisation; some campaigns map to Lead instead of Schedule).

Defer-load if needed for performance — pixel can sit in a `requestIdleCallback`.

---

## 4. Open Graph / Twitter card

Already drafted in `06-page-architecture.md` §8. The OG image (`/og.png`, 1200×630) lives in `public/`.

When Rudy shares the site link in DMs or on Slack, this is what appears. It must look sharp — see `02-design-system.md` §10 for the OG image spec.

**Validation:** before launch, paste the URL into:
- https://www.opengraph.xyz/
- https://cards-dev.twitter.com/validator (or X equivalent)
- https://www.linkedin.com/post-inspector/

Fix anything that renders wrong.

---

## 5. Schema.org JSON-LD

Already drafted in `06-page-architecture.md` §8. Validates the site as a `Person` and `ProfessionalService`. Test with https://validator.schema.org/ before shipping.

---

## 6. Sitemap + robots.txt

Single-page site, but search engines still expect both.

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://www.rudygoel.com/sitemap.xml
```

`public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.rudygoel.com/</loc>
    <lastmod>2026-05-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

Update `lastmod` on each deploy (CI step).

---

## 7. Email contact

The footer + final-CTA soft link both reference an email address. Use `mailto:rudy@rudygoel.com` — simple. No third-party form.

If Rudy wants spam protection, use a CSS-pseudo trick or a simple obfuscation (`data-user="rudy" data-host="rudygoel.com"` + JS rebuild). Don't rely on JS-only — falls back gracefully.

---

## 8. Hosting & DNS

Recommended (low effort, maximum performance):
- **Hosting:** Vercel or Netlify or Cloudflare Pages. All three give free SSL, edge CDN, instant rollback.
- **Domain:** Rudy already owns `rudygoel.com`. Point DNS A/CNAME at the host.
- **HTTPS:** automatic via host.
- **Cache headers:** static assets `Cache-Control: public, max-age=31536000, immutable` (assuming hashed filenames). HTML `Cache-Control: public, max-age=0, must-revalidate`.

---

## 9. What we are NOT integrating

To keep the brief intact:

- ❌ No newsletter / email-capture (Mailchimp, ConvertKit, Beehiiv, Substack).
- ❌ No live chat (Intercom, Drift, Crisp, Tawk).
- ❌ No exit-intent popup (Sumo, OptinMonster).
- ❌ No A/B testing framework on v1 (VWO, Optimizely).
- ❌ No CMS (Contentful, Sanity, Notion). The site is small; copy lives in source.
- ❌ No CRM webhook on submit — the only "submit" event is Calendly, which Rudy already manages inside Calendly + his own systems.

If Rudy asks for any of these later, they get added behind a feature flag — not retrofitted into v1.

---

## 10. Environment variables (final list)

```
VITE_CALENDLY_URL=https://calendly.com/rudygoel/audit
VITE_GA4_ID=G-XXXXXXXXXX
VITE_META_PIXEL_ID=000000000000000
VITE_SITE_URL=https://www.rudygoel.com
```

Document these in the production repo's `README.md` and `.env.example`. Never commit real values.
