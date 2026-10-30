/**
 * POST /api/roast: roasts one Meta ad with Claude and streams the result.
 *
 * Body (JSON): kind ("image" | "video" | "copy"), images (data URLs, already
 * resized in the browser; video = frames with their timestamps), plus the
 * optional form fields below.
 *
 * Response: NDJSON events, one per line:
 *   {"t":"d","v":"..."}       markdown text, up to the "## 🛠 The 3 fixes" heading
 *   {"t":"lock","token":"..."} the fixes, sealed until /api/roast-unlock gets an email
 *   {"t":"err","v":"..."}     a message to show instead of the roast
 *   {"t":"end"}
 *
 * Env: ANTHROPIC_API_KEY (required), ROAST_MODEL (default claude-opus-5-5),
 * ROAST_EFFORT (default medium), ROAST_DAILY_CAP, ROAST_PER_IP_HOUR,
 * ROAST_SECRET (optional, see _lib/seal.ts).
 */
import Anthropic from "@anthropic-ai/sdk";
import { INSTRUCTIONS } from "./_lib/instructions.js";
import { RUBRIC } from "./_lib/rubric.js";
import { checkLimits, clientIp } from "./_lib/limits.js";
import { seal } from "./_lib/seal.js";
import { cleanUrl, readLanding } from "./_lib/landing.js";
import { MOCK_ROAST } from "./_lib/mock.js";

const MODEL = process.env.ROAST_MODEL || "claude-opus-5-5";
const EFFORT = (process.env.ROAST_EFFORT || "medium") as "low" | "medium" | "high";
const MAX_IMAGE_CHARS = 4_000_000;
const IMAGE_RE = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/;
const FIXES_HEADING = /^##\s*🛠/u;

const SYSTEM = `${INSTRUCTIONS}\n\n# AD ROAST Rubric\n\n${RUBRIC}`;

// ROAST_MOCK=1 replays a canned roast instead of calling Claude, for testing the
// page, the gate and the lead capture. Never on production.
const MOCK = process.env.ROAST_MOCK === "1" && process.env.VERCEL_ENV !== "production";

interface Frame { data: string; at?: number }
interface RoastBody {
  kind?: string;
  images?: Frame[];
  duration?: number;
  primaryText?: string;
  headline?: string;
  cta?: string;
  traffic?: string;
  about?: string;
  spoken?: string;
  landingUrl?: string;
  numbers?: string;
}

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY && !MOCK) {
    console.error("roast: ANTHROPIC_API_KEY is not set");
    return fail(503, "Roasts are offline for a moment. Try again soon, or DM ROASTED to @rudygoel_ on Instagram.");
  }
  if (Number(request.headers.get("content-length") || 0) > 4_400_000) {
    return fail(413, "That upload is too big. Try a smaller file.");
  }

  let body: RoastBody;
  try {
    body = (await request.json()) as RoastBody;
  } catch {
    return fail(400, "Something went wrong reading your upload. Refresh and try again.");
  }

  const kind = body.kind === "video" || body.kind === "copy" ? body.kind : "image";
  const frames = Array.isArray(body.images) ? body.images.slice(0, kind === "video" ? 14 : 5) : [];
  const f = {
    primaryText: clip(body.primaryText, 3000),
    headline: clip(body.headline, 200),
    cta: clip(body.cta, 40),
    traffic: body.traffic === "warm" ? "warm" : body.traffic === "cold" ? "cold" : "",
    about: clip(body.about, 400),
    spoken: clip(body.spoken, 600),
    numbers: clip(body.numbers, 400),
  };
  const landingUrl = body.landingUrl ? cleanUrl(clip(body.landingUrl, 500)) : null;

  if (kind === "copy" ? !f.primaryText && !f.headline : frames.length === 0) {
    return fail(400, kind === "copy" ? "Paste your ad copy first." : "Add your ad first.");
  }
  if (kind === "copy") frames.length = 0;
  let imageChars = 0;
  const parsed: { media: "image/jpeg" | "image/png" | "image/webp"; data: string; at?: number }[] = [];
  for (const fr of frames) {
    const m = typeof fr?.data === "string" ? fr.data.match(IMAGE_RE) : null;
    if (!m) return fail(400, "One of those files isn't an image I can read. Use a JPG, PNG or WebP.");
    imageChars += m[2].length;
    parsed.push({ media: m[1] as "image/jpeg", data: m[2], at: typeof fr.at === "number" ? fr.at : undefined });
  }
  if (imageChars > MAX_IMAGE_CHARS) return fail(413, "That upload is too big. Try a smaller file.");

  const limit = await checkLimits(clientIp(request));
  if (!limit.ok) {
    return fail(
      429,
      limit.reason === "ip"
        ? "You've hit the roast limit for this hour. Come back in a bit."
        : "The roaster's done for today. Come back tomorrow, or DM ROASTED to @rudygoel_ on Instagram.",
    );
  }

  const landing = landingUrl ? await readLanding(landingUrl) : null;

  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  if (kind === "video") {
    const dur = typeof body.duration === "number" ? `${body.duration.toFixed(1)} seconds long` : "length unknown";
    content.push({ type: "text", text: `A video ad, ${dur}. Still frames with timestamps:` });
  } else if (parsed.length > 1) {
    content.push({ type: "text", text: `A carousel or multi-image ad, ${parsed.length} images in order:` });
  } else if (parsed.length === 1) {
    content.push({ type: "text", text: "A static image ad:" });
  }
  parsed.forEach((p, i) => {
    if (kind === "video") content.push({ type: "text", text: `Frame at ${(p.at ?? 0).toFixed(1)}s` });
    else if (parsed.length > 1) content.push({ type: "text", text: `Image ${i + 1}` });
    content.push({ type: "image", source: { type: "base64", media_type: p.media, data: p.data } });
  });

  const form = [
    kind === "copy" && "Copy only: no image or video was sent.",
    f.primaryText && `Primary text:\n${f.primaryText}`,
    f.headline && `Headline: ${f.headline}`,
    f.cta && `CTA button: ${f.cta}`,
    `Traffic: ${f.traffic || "not given"}`,
    f.about && `What they sell and who it's for: ${f.about}`,
    kind === "video" && `First words said in the video: ${f.spoken || "not given"}`,
    f.numbers && `Their numbers: ${f.numbers}`,
    landingUrl && (landing ? `Landing page ${landingUrl} (top of the page only):\n${landing}` : `Landing page ${landingUrl} couldn't be read.`),
  ].filter(Boolean);
  content.push({
    type: "text",
    text: `<form>\n${form.join("\n\n")}\n</form>\n\nRoast this ad.`,
  });

  const enc = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (ev: object) => controller.enqueue(enc.encode(JSON.stringify(ev) + "\n"));
      let pending = "";
      let gated = false;
      let shown = "";
      let held = "";
      const take = (line: string) => {
        if (!gated && FIXES_HEADING.test(line)) gated = true;
        if (gated) held += line;
        else {
          shown += line;
          send({ t: "d", v: line });
        }
      };

      try {
        let refused = false;
        const pieces = MOCK ? mockText() : claudeText(content, kind, parsed.length, () => (refused = true));
        for await (const piece of pieces) {
          pending += piece;
          let nl: number;
          while ((nl = pending.indexOf("\n")) >= 0) {
            take(pending.slice(0, nl + 1));
            pending = pending.slice(nl + 1);
          }
        }
        if (pending) take(pending);

        if (refused && !shown) {
          send({ t: "err", v: "I couldn't roast that one. Try a different ad, or DM ROASTED to @rudygoel_ on Instagram." });
        } else if (held.trim()) {
          const head = shown.match(/AD ROAST[^:\n]*:\s*(\d{1,3})\s*\/\s*100\s*·?\s*([^\n]*)/);
          send({
            t: "lock",
            token: seal({
              fixes: held,
              score: head ? Number(head[1]) : null,
              verdict: head ? head[2].trim() : "",
              adType: kind,
              traffic: f.traffic,
              landingUrl: landingUrl || "",
              exp: Date.now() + 24 * 3600_000,
            }),
          });
        }
      } catch (e) {
        if (e instanceof Anthropic.RateLimitError || e instanceof Anthropic.InternalServerError) {
          console.error("roast busy", e.status, e.message);
          send({ t: "err", v: "The roaster's swamped right now. Give it a minute and try again." });
        } else if (e instanceof Anthropic.APIError) {
          console.error("roast api", e.status, e.message);
          send({ t: "err", v: "Something broke on my end. Try again in a minute." });
        } else {
          console.error("roast", (e as Error).message);
          send({ t: "err", v: "Something broke on my end. Try again in a minute." });
        }
      }
      send({ t: "end" });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

/** Streams the roast text from Claude. Calls onRefusal if the whole fallback chain declined. */
async function* claudeText(
  content: Anthropic.Beta.BetaContentBlockParam[],
  kind: string,
  images: number,
  onRefusal: () => void,
): AsyncGenerator<string> {
  const run = new Anthropic().beta.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content }],
    output_config: { effort: EFFORT },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });
  for await (const ev of run) {
    if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") yield ev.delta.text;
  }
  const final = await run.finalMessage();
  const u = final.usage;
  console.log(
    "roast",
    JSON.stringify({
      kind,
      images,
      model: final.model,
      stop: final.stop_reason,
      in: u.input_tokens,
      cacheRead: u.cache_read_input_tokens,
      cacheWrite: u.cache_creation_input_tokens,
      out: u.output_tokens,
    }),
  );
  if (final.stop_reason === "refusal") onRefusal();
}

async function* mockText(): AsyncGenerator<string> {
  await new Promise((r) => setTimeout(r, 1500));
  for (let i = 0; i < MOCK_ROAST.length; i += 24) {
    yield MOCK_ROAST.slice(i, i + 24);
    await new Promise((r) => setTimeout(r, 12));
  }
}

function fail(status: number, message: string): Response {
  return new Response(JSON.stringify({ t: "err", v: message }) + "\n", {
    status,
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
