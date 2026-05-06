/**
 * faq.ts — enforce single-open accordion behaviour and emit analytics
 * when a question is opened.
 */

import { trackFaqOpen } from "./analytics";

export function initFaq(): void {
  const items = Array.from(
    document.querySelectorAll<HTMLDetailsElement>(".faq__item"),
  );
  if (items.length === 0) return;

  for (const item of items) {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      // Close siblings
      for (const other of items) {
        if (other !== item && other.open) other.open = false;
      }
      // Track
      const q = item.querySelector(".faq__q")?.textContent?.trim();
      if (q) trackFaqOpen(q);
    });
  }
}
