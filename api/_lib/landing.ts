/**
 * Reads the top of an owner's landing page so the roast can check message
 * match. Public http(s) hosts only, 6 second timeout, first 600 KB, then the
 * title, meta description and the first ~3,000 characters of visible text.
 * Returns null if anything goes wrong; the roast then says the page couldn't
 * be read.
 */

const PRIVATE_HOST = /^(localhost|.*\.local|.*\.internal|\d{1,3}(\.\d{1,3}){3}|\[.*\])$/i;

export function cleanUrl(input: string): string | null {
  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    if (!/^https?:$/.test(url.protocol) || PRIVATE_HOST.test(url.hostname) || !url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function decode(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

export async function readLanding(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AdRoast/1.0; +https://rudygoel.com/roast)" },
    });
    if (!res.ok || !(res.headers.get("content-type") || "").includes("html") || !res.body) return null;

    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (size < 600_000) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.length;
    }
    reader.cancel().catch(() => {});
    const html = Buffer.concat(chunks).toString("utf8");

    const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim());
    const desc = decode(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1] || "");
    const text = decode(
      html
        .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
        .replace(/<\/(p|div|h[1-6]|li|section|br|button|a)>/gi, "\n")
        .replace(/<[^>]+>/g, " "),
    )
      .replace(/[ \t]+/g, " ")
      .replace(/\s*\n\s*/g, "\n")
      .trim()
      .slice(0, 3000);
    if (!text && !title) return null;
    return [title && `Title: ${title}`, desc && `Meta description: ${desc}`, text].filter(Boolean).join("\n");
  } catch (e) {
    console.error("landing", url, (e as Error).message);
    return null;
  }
}
