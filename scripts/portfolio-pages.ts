import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sirv from "sirv";
import type { Plugin } from "vite";

/**
 * Renders the /portfolio PDFs into WebP strips so they read natively on the
 * page (no download, no PDF viewer, works on every phone). Runs on every
 * build, so swapping a PDF in public/portfolio/ and pushing is still the
 * whole update. Output is cached by PDF hash in node_modules/.cache.
 *
 * In a viewer page, <!--pdf-pages:slug--> is replaced with the page markup.
 */

export interface PortfolioDoc {
  slug: string;
  pdf: string; // path relative to the project root
  title: string;
}

interface Tile { w800: string; w1600: string; height1600: number }
interface Link { url: string; left: number; top: number; width: number; height: number }
interface Page { width: number; height: number; tiles: Tile[]; links: Link[]; text: string }

const RENDER_WIDTH = 1600;
const TILE_HEIGHT = 1600; // keeps every image well under iOS decode limits
const QUALITY = 0.9;
const URL_BASE = "/portfolio/pages";

export function portfolioPages(docs: PortfolioDoc[]): Plugin {
  const root = process.cwd();
  const cacheDir = path.resolve(root, "node_modules/.cache/portfolio-pages");
  let rendered: Promise<Map<string, Page[]>> | undefined;
  const render = () => (rendered ??= renderAll(docs, root, cacheDir));

  return {
    name: "rg-portfolio-pages",
    configureServer(server) {
      server.middlewares.use(URL_BASE, sirv(cacheDir, { dev: true }));
    },
    async buildStart() {
      await render();
    },
    async generateBundle() {
      const files = await fs.readdir(cacheDir);
      const wanted = new Set(
        [...(await render()).values()].flat().flatMap((p) => p.tiles.flatMap((t) => [t.w800, t.w1600]))
      );
      for (const name of files) {
        if (!wanted.has(name)) continue;
        this.emitFile({
          type: "asset",
          fileName: `${URL_BASE.slice(1)}/${name}`,
          source: await fs.readFile(path.join(cacheDir, name)),
        });
      }
    },
    async transformIndexHtml(html) {
      if (!html.includes("<!--pdf-pages:")) return html;
      const pages = await render();
      return html.replace(/<!--pdf-pages:([a-z0-9-]+)-->/g, (_, slug: string) => {
        const doc = docs.find((d) => d.slug === slug);
        const docPages = pages.get(slug);
        if (!doc || !docPages) throw new Error(`portfolio-pages: unknown doc "${slug}"`);
        return docPages.map((p, i) => pageMarkup(doc, p, i, docPages.length)).join("\n");
      });
    },
  };
}

async function renderAll(docs: PortfolioDoc[], root: string, cacheDir: string) {
  await fs.mkdir(cacheDir, { recursive: true });
  const out = new Map<string, Page[]>();
  for (const doc of docs) out.set(doc.slug, await renderDoc(doc, root, cacheDir));
  return out;
}

async function renderDoc(doc: PortfolioDoc, root: string, cacheDir: string): Promise<Page[]> {
  const data = await fs.readFile(path.resolve(root, doc.pdf));
  const hash = createHash("sha1").update(data).update(`${RENDER_WIDTH}:${TILE_HEIGHT}:${QUALITY}`).digest("hex").slice(0, 10);
  const manifestPath = path.join(cacheDir, `${doc.slug}-${hash}.json`);
  try {
    return JSON.parse(await fs.readFile(manifestPath, "utf8")) as Page[];
  } catch {
    // not cached yet
  }

  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const { createCanvas } = await import("@napi-rs/canvas");
  const pdf = await getDocument({ data: new Uint8Array(data), verbosity: 0 }).promise;
  const pages: Page[] = [];

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: RENDER_WIDTH / base.width });
    const fullH = Math.round(viewport.height);

    const full = createCanvas(RENDER_WIDTH, fullH);
    const ctx = full.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, RENDER_WIDTH, fullH);
    // pdf.js accepts the @napi-rs canvas in Node; its DOM typings don't know that.
    await page.render({ canvas: full as never, canvasContext: ctx as never, viewport }).promise;

    const tiles: Tile[] = [];
    for (let y = 0, t = 1; y < fullH; y += TILE_HEIGHT, t++) {
      const h = Math.min(TILE_HEIGHT, fullH - y);
      const stem = `${doc.slug}-${hash}-p${n}-${t}`;
      for (const w of [1600, 800]) {
        const scale = w / RENDER_WIDTH;
        const tile = createCanvas(w, Math.round(h * scale));
        tile.getContext("2d").drawImage(full, 0, y, RENDER_WIDTH, h, 0, 0, w, Math.round(h * scale));
        await fs.writeFile(path.join(cacheDir, `${stem}-${w}.webp`), await tile.encode("webp", QUALITY * 100));
      }
      tiles.push({ w800: `${stem}-800.webp`, w1600: `${stem}-1600.webp`, height1600: h });
    }

    const links: Link[] = [];
    for (const a of await page.getAnnotations()) {
      if (a.subtype !== "Link" || !a.url) continue;
      const [x1, y1] = base.convertToViewportPoint(a.rect[0], a.rect[1]) as number[];
      const [x2, y2] = base.convertToViewportPoint(a.rect[2], a.rect[3]) as number[];
      links.push({
        url: a.url,
        left: pct(Math.min(x1, x2) / base.width),
        top: pct(Math.min(y1, y2) / base.height),
        width: pct(Math.abs(x2 - x1) / base.width),
        height: pct(Math.abs(y2 - y1) / base.height),
      });
    }

    const content = await page.getTextContent();
    const text = content.items
      .map((i) => ("str" in i ? i.str + (i.hasEOL ? "\n" : "") : ""))
      .join("")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    pages.push({ width: RENDER_WIDTH, height: fullH, tiles, links, text });
  }

  await fs.writeFile(manifestPath, JSON.stringify(pages));
  return pages;
}

function pageMarkup(doc: PortfolioDoc, page: Page, index: number, total: number): string {
  const tiles = page.tiles
    .map((t, i) => {
      const eager = index === 0 && i === 0;
      return `<img src="${URL_BASE}/${t.w1600}" srcset="${URL_BASE}/${t.w800} 800w, ${URL_BASE}/${t.w1600} 1600w" sizes="(min-width: 880px) 820px, 100vw" width="1600" height="${t.height1600}" alt="" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} />`;
    })
    .join("");
  const links = page.links
    .map((l) => {
      const label = l.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
      return `<a class="pdf-link" href="${esc(l.url)}" target="_blank" rel="noopener" aria-label="${esc(label)}" style="left:${l.left}%;top:${l.top}%;width:${l.width}%;height:${l.height}%"></a>`;
    })
    .join("");
  const label = total > 1 ? `${doc.title}, page ${index + 1} of ${total}` : doc.title;
  return `<figure class="pdf-page" aria-label="${esc(label)}">${tiles}${links}<figcaption class="sr-only">${esc(page.text)}</figcaption></figure>`;
}

const pct = (n: number) => Math.round(n * 100000) / 1000;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
