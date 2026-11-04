/**
 * home.ts — homepage. Plain DOM, no motion library, so the page paints
 * straight away and #anchors work. Every [data-cta] reads one URL from
 * <body data-booking-url>.
 */
import "./home.css";
import { initFaq } from "../scripts/faq";
import { loadAnalytics, trackCtaClick, trackVideoPlay } from "../scripts/analytics";

function initCtas(): void {
  const url = document.body.dataset.bookingUrl;
  document.querySelectorAll<HTMLAnchorElement>("[data-cta]").forEach((a) => {
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    }
    a.addEventListener("click", () => trackCtaClick());
  });
}

function initVideos(): void {
  document.querySelectorAll<HTMLElement>("[data-video]").forEach((fig) => {
    const btn = fig.querySelector("button");
    const img = fig.querySelector("img");
    if (!btn || !img) return;
    btn.addEventListener("click", () => {
      const video = document.createElement("video");
      video.src = fig.dataset.video ?? "";
      video.poster = img.currentSrc || img.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      img.replaceWith(video);
      btn.remove();
      trackVideoPlay(fig.dataset.name ?? "video");
    });
  });
}

initCtas();
initVideos();
initFaq();

const idle =
  (window as unknown as { requestIdleCallback?: (cb: () => void) => void })
    .requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000));
idle(() => loadAnalytics());
