/**
 * sales.ts — entry for /ads. Reuses the main site's boot (fonts, motion,
 * video testimonials, analytics) and adds the sales page styles on top.
 * Booking buttons ([data-cta="book"]) all point at the one URL set on
 * <body data-booking-url="...">, so swapping the calendar link is one edit.
 */
import "./main";
import "../styles/sales.css";

import { trackCtaClick } from "./analytics";

const bookingUrl = document.body.dataset.bookingUrl?.trim();
document.querySelectorAll<HTMLAnchorElement>('[data-cta="book"]').forEach((a) => {
  if (bookingUrl) {
    a.href = bookingUrl;
    a.target = "_blank";
    a.rel = "noopener";
  }
  a.addEventListener("click", () => trackCtaClick());
});
