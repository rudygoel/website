/**
 * AD ROAST page, one step per screen: upload the ad, answer two questions,
 * stream the roast from /api/roast, then trade an email for the 3 fixes via
 * /api/roast-unlock.
 *
 * Images are resized here before upload. Videos never leave the device:
 * frames are pulled with a <video> + <canvas> (weighted to the first 5
 * seconds) and only those stills are sent.
 */
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./roast.css";

type Kind = "image" | "video";
interface Frame { data: string; at?: number }

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const uploadScreen = $("screen-upload");
const form = $<HTMLFormElement>("screen-details");
const drop = $("drop");
const fileInput = $<HTMLInputElement>("file");
const thumbs = $("thumbs");
const uploadError = $("upload-error");
const formError = $("form-error");
const result = $("result");
const loading = $("loading");
const loadingLine = $("loading-line");
const scoreBox = $("score");
const mdBox = $("md");
const gate = $("gate");
const gateForm = $<HTMLFormElement>("gate-form");
const gateError = $("gate-error");
const unlockBtn = $<HTMLButtonElement>("unlock");
const emailInput = $<HTMLInputElement>("email");
const fixesBox = $("fixes");
const ctaCard = $("cta-card");

let kind: Kind = "image";
let frames: Frame[] = [];
let duration: number | undefined;
let preparing = false;
let token = "";

const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const MAX_UPLOAD_CHARS = 3_900_000;

const DROP_TITLE = "Tap to pick your ad, or drop it here";

const LINES: Record<Kind, string[]> = {
  image: ["Looking at your ad", "Checking what lands in the first second", "Reading your headline cold", "Looking for who it's for", "Hunting for proof", "Counting the adjectives", "Writing it up"],
  video: ["Looking at frame 1", "Checking if anything moves", "Reading the on-screen text", "Looking for who it's for", "Hunting for proof", "Checking the ending", "Writing it up"],
};

function track(event: string, params: Record<string, unknown> = {}) {
  try { window.gtag?.("event", event, params); } catch { /* analytics never breaks the page */ }
}

function storage(): Storage | null {
  try { return window.localStorage; } catch { return null; }
}

function refTag(): string {
  const q = new URLSearchParams(location.search);
  const ref = q.get("ref") || q.get("utm_source");
  if (ref) return ref;
  try { return document.referrer ? new URL(document.referrer).hostname : "direct"; } catch { return "direct"; }
}

/* ---------- screens ---------- */

type Screen = "upload" | "details" | "result";

function show(screen: Screen) {
  uploadScreen.hidden = screen !== "upload";
  form.hidden = screen !== "details";
  result.hidden = screen !== "result";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- files ---------- */

function clearFiles() {
  frames = [];
  duration = undefined;
  thumbs.innerHTML = "";
  fileInput.value = "";
}

function showThumbs(note: string) {
  thumbs.innerHTML = "";
  frames.slice(0, kind === "video" ? 4 : 5).forEach((f) => {
    const img = new Image();
    img.src = f.data;
    img.alt = "";
    thumbs.appendChild(img);
  });
  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = note;
  thumbs.appendChild(meta);
}

function drawScaled(src: CanvasImageSource, w: number, h: number, maxSide: number, quality: number): string {
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

async function imageToFrame(file: File, maxSide = 1568, quality = 0.86): Promise<Frame> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("That image is over 25 MB. Screenshot it and upload the screenshot.");
  try {
    const bmp = await createImageBitmap(file);
    const data = drawScaled(bmp, bmp.width, bmp.height, maxSide, quality);
    bmp.close();
    return { data };
  } catch {
    throw new Error("I can't open that file. Screenshot your ad and upload the screenshot.");
  }
}

function once(el: HTMLElement, event: string, ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { cleanup(); reject(new Error("timeout")); }, ms);
    const ok = () => { cleanup(); resolve(); };
    const bad = () => { cleanup(); reject(new Error("media error")); };
    const cleanup = () => { clearTimeout(timer); el.removeEventListener(event, ok); el.removeEventListener("error", bad); };
    el.addEventListener(event, ok);
    el.addEventListener("error", bad);
  });
}

/** Stills at 0, 0.5, 1, 1.5, 2, 2.5, 3, 4 and 5s, then the middle, 3/4 and the last moment. */
async function videoToFrames(file: File): Promise<{ frames: Frame[]; duration: number }> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = url;
  try {
    await once(video, "loadedmetadata", 20000);
    await video.play().catch(() => {});
    video.pause();
    let dur = video.duration;
    if (!isFinite(dur) || dur <= 0) dur = 15;
    const times = [0.05, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5].filter((t) => t < dur - 0.05);
    if (dur > 6) times.push(dur * 0.5, dur * 0.75, Math.max(dur - 0.4, 5.5));
    const out: Frame[] = [];
    for (const t of [...new Set(times.map((x) => Math.round(x * 10) / 10))].sort((a, b) => a - b)) {
      video.currentTime = Math.max(t, 0.05);
      await once(video, "seeked", 8000);
      if (!video.videoWidth) continue;
      out.push({ data: drawScaled(video, video.videoWidth, video.videoHeight, 768, 0.74), at: t <= 0.05 ? 0 : t });
    }
    if (!out.length) throw new Error("no frames");
    return { frames: out, duration: dur };
  } finally {
    URL.revokeObjectURL(url);
    video.removeAttribute("src");
    video.load();
  }
}

async function takeFiles(list: FileList | File[]) {
  const files = Array.from(list);
  if (!files.length || preparing) return;
  showUploadError("");
  preparing = true;
  drop.classList.add("busy");
  try {
    const video = files.find((f) => f.type.startsWith("video/"));
    if (video) {
      kind = "video";
      $("drop-title").textContent = "Pulling stills from your video...";
      const out = await videoToFrames(video).catch(() => {
        throw new Error("I couldn't read that video here. Try an MP4, or upload 3 screenshots of it instead.");
      });
      frames = out.frames;
      duration = out.duration;
      showThumbs(`${frames.length} stills from a ${Math.round(duration)}s video`);
    } else {
      kind = "image";
      const images = files.filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name)).slice(0, 5);
      if (!images.length) throw new Error("That's not an image or video I can read. A screenshot of the ad works.");
      $("drop-title").textContent = "Loading your ad...";
      frames = await Promise.all(images.map((f) => imageToFrame(f)));
      if (frames.reduce((n, f) => n + f.data.length, 0) > MAX_UPLOAD_CHARS) {
        frames = await Promise.all(images.map((f) => imageToFrame(f, 1100, 0.72)));
      }
      showThumbs(frames.length > 1 ? `${frames.length} images` : "");
    }
    $("spoken-field").hidden = kind !== "video";
    showError("");
    show("details");
    track("roast_uploaded", { kind });
  } catch (e) {
    clearFiles();
    showUploadError((e as Error).message);
  } finally {
    $("drop-title").textContent = DROP_TITLE;
    drop.classList.remove("busy");
    preparing = false;
  }
}

drop.addEventListener("click", () => fileInput.click());
drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
fileInput.addEventListener("change", () => { if (fileInput.files) takeFiles(fileInput.files); });
drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
drop.addEventListener("dragleave", () => drop.classList.remove("over"));
drop.addEventListener("drop", (e) => {
  e.preventDefault();
  drop.classList.remove("over");
  if (e.dataTransfer?.files) takeFiles(e.dataTransfer.files);
});
document.addEventListener("paste", (e) => {
  if (uploadScreen.hidden) return;
  const files = Array.from(e.clipboardData?.files || []);
  if (files.length) takeFiles(files);
});

/* ---------- rendering ---------- */

function showError(msg: string) {
  formError.textContent = msg;
  formError.hidden = !msg;
}

function showUploadError(msg: string) {
  uploadError.textContent = msg;
  uploadError.hidden = !msg;
}

/* ---------- ad link ---------- */

// Facebook won't serve the Ad Library to a server, so a link can't be read here.
// It opens in a new tab and the visitor screenshots the ad into the box.
function adLink(raw: string): URL | null {
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!/(^|\.)(facebook\.com|instagram\.com|fb\.com|fb\.me|fb\.watch)$/i.test(u.hostname)) return null;
    u.protocol = "https:";
    return u;
  } catch {
    return null;
  }
}

$("link-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const note = $("link-note");
  const url = adLink(($("ad-link") as HTMLInputElement).value.trim());
  note.classList.toggle("error", !url);
  if (!url) {
    note.textContent = "That doesn't look like a Facebook or Instagram link.";
    return;
  }
  window.open(url.href, "_blank", "noopener");
  note.textContent = "It's open in a new tab. Screenshot your ad, then add it in the box above.";
  track("roast_link_open");
});

$("change").addEventListener("click", () => {
  clearFiles();
  show("upload");
});

function md(text: string): string {
  const html = DOMPurify.sanitize(marked.parse(text, { async: false, gfm: true, breaks: true }) as string);
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  tpl.content.querySelectorAll("table").forEach((table) => {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    table.replaceWith(wrap);
    wrap.appendChild(table);
    table.querySelectorAll("tbody tr").forEach((tr) => {
      const cell = tr.children[1] as HTMLElement | undefined;
      const m = cell?.textContent?.match(/(\d+)\s*\/\s*(\d+)/);
      if (cell && m) {
        const r = Number(m[1]) / Number(m[2]);
        if (r >= 0.8) cell.classList.add("good");
        else if (r >= 0.5) cell.classList.add("ok");
      }
    });
  });
  return tpl.innerHTML;
}

function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
}

function scoreColour(n: number): string {
  return n < 50 ? mix("#E2552B", "#E8A33A", n / 50) : mix("#E8A33A", "#1F9A62", (n - 50) / 50);
}

function showScore(headLine: string) {
  const m = headLine.match(/AD ROAST\s*(\(copy only\))?\s*:\s*(\d{1,3})\s*\/\s*100\s*·?\s*(.*)$/i);
  scoreBox.hidden = false;
  const fill = $("dial-fill") as unknown as SVGCircleElement;
  if (!m) {
    $("score-num").textContent = "?";
    $("score-kind").textContent = "Your score";
    $("verdict").textContent = headLine.replace(/^#\s*/, "").replace(/^🔥\s*AD ROAST:?\s*/i, "") || "Can't score this";
    return;
  }
  const n = Math.min(100, Number(m[2]));
  $("score-kind").textContent = m[1] ? "Provisional score" : "Your score";
  $("verdict").textContent = m[1] ? "Provisional score. Add the image or video for the full roast." : m[3].trim();
  fill.style.stroke = scoreColour(n);
  requestAnimationFrame(() => { fill.style.strokeDashoffset = String(326.7 * (1 - n / 100)); });
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / 1100);
    $("score-num").textContent = String(Math.round(n * (1 - Math.pow(1 - t, 3))));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  track("roast_scored", { score: n, kind });
}

/* ---------- roast ---------- */

function resetResult() {
  token = "";
  scoreBox.hidden = true;
  ($("dial-fill") as unknown as SVGCircleElement).style.strokeDashoffset = "326.7";
  mdBox.innerHTML = "";
  fixesBox.innerHTML = "";
  fixesBox.hidden = true;
  gate.hidden = true;
  ctaCard.hidden = true;
  gateError.hidden = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (preparing) return;
  const val = (id: string) => ($(id) as HTMLInputElement).value.trim();
  if (!frames.length) {
    show("upload");
    return showUploadError("Add your ad first.");
  }
  showError("");
  const traffic = (form.querySelector<HTMLInputElement>('input[name="traffic"]:checked')?.value) || "";

  const payload = {
    kind,
    images: frames,
    duration,
    primaryText: val("primaryText"),
    headline: val("headline"),
    traffic,
    about: val("about"),
    spoken: kind === "video" ? val("spoken") : "",
    landingUrl: val("landingUrl"),
  };

  resetResult();
  show("result");
  loading.hidden = false;
  track("roast_start", { kind });

  const lines = LINES[kind];
  let li = 0;
  loadingLine.textContent = lines[0];
  const ticker = setInterval(() => { li = Math.min(li + 1, lines.length - 1); loadingLine.textContent = lines[li]; }, 4200);

  let text = "";
  let head = "";
  let frame = 0;
  const paint = () => {
    frame = 0;
    const nl = text.indexOf("\n");
    if (!head && nl >= 0 && text.startsWith("#")) {
      head = text.slice(0, nl);
      loading.hidden = true;
      showScore(head);
    }
    const body = head ? text.slice(head.length + 1) : text.startsWith("#") ? "" : text;
    if (body) { loading.hidden = true; mdBox.innerHTML = md(body); }
  };

  try {
    const res = await fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.body) throw new Error("no body");
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let failed = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (!line.trim()) continue;
        const ev = JSON.parse(line) as { t: string; v?: string; token?: string };
        if (ev.t === "d" && ev.v) {
          text += ev.v;
          if (!frame) frame = requestAnimationFrame(paint);
        } else if (ev.t === "lock" && ev.token) {
          token = ev.token;
        } else if (ev.t === "err") {
          failed = ev.v || "Something broke on my end. Try again in a minute.";
        }
      }
    }
    if (frame) cancelAnimationFrame(frame);
    paint();

    if (failed && !text) {
      show("details");
      showError(failed);
      track("roast_error", { kind, status: res.status });
      return;
    }
    if (failed) mdBox.insertAdjacentHTML("beforeend", `<p class="error">${DOMPurify.sanitize(failed)}</p>`);
    track("roast_done", { kind, gated: !!token });

    if (token) {
      gate.hidden = false;
      const saved = storage()?.getItem("roast-email");
      if (saved) {
        emailInput.value = saved;
        unlock();
      }
    } else {
      ctaCard.hidden = false;
    }
  } catch {
    loading.hidden = true;
    mdBox.insertAdjacentHTML("beforeend", `<p class="error">The connection dropped. Try again.</p>`);
    ctaCard.hidden = false;
  } finally {
    clearInterval(ticker);
    loading.hidden = true;
  }
});

/* ---------- email gate ---------- */

async function unlock() {
  const email = emailInput.value.trim();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i.test(email)) {
    gateError.textContent = "That email doesn't look right.";
    gateError.hidden = false;
    return;
  }
  gateError.hidden = true;
  unlockBtn.disabled = true;
  unlockBtn.textContent = "Opening...";
  try {
    const res = await fetch("/api/roast-unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, ref: refTag() }),
    });
    const body = (await res.json()) as { ok: boolean; fixes?: string; error?: string };
    if (!body.ok || !body.fixes) throw new Error(body.error || "Something went wrong. Try again.");
    storage()?.setItem("roast-email", email);
    gate.hidden = true;
    fixesBox.innerHTML = md(body.fixes);
    fixesBox.hidden = false;
    ctaCard.hidden = false;
    track("roast_unlock", { kind });
    fixesBox.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (e) {
    gateError.textContent = (e as Error).message;
    gateError.hidden = false;
  } finally {
    unlockBtn.disabled = false;
    unlockBtn.textContent = "Show my fixes";
  }
}

gateForm.addEventListener("submit", (e) => { e.preventDefault(); unlock(); });

$("dm").addEventListener("click", () => track("roast_dm_click", { kind }));
$("again").addEventListener("click", () => {
  resetResult();
  clearFiles();
  form.reset();
  show("upload");
});
