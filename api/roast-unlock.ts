/**
 * POST /api/roast-unlock: swaps an email for the 3 fixes of a roast.
 * Body: { token, email, ref }. Saves the lead (see _lib/leads.ts), then
 * returns { ok: true, fixes } with the sealed markdown from /api/roast.
 */
import { unseal } from "./_lib/seal.js";
import { saveLead } from "./_lib/leads.js";

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i;

export async function POST(request: Request): Promise<Response> {
  let body: { token?: string; email?: string; ref?: string };
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: "Something went wrong. Refresh and try again." });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  if (!EMAIL_RE.test(email)) return json(400, { ok: false, error: "That email doesn't look right." });

  const data = typeof body.token === "string" ? unseal(body.token) : null;
  if (!data) return json(410, { ok: false, error: "This roast has expired. Run it again to get your fixes." });

  await saveLead({
    email,
    score: data.score,
    verdict: data.verdict,
    adType: data.adType,
    traffic: data.traffic,
    landingUrl: data.landingUrl,
    ref: typeof body.ref === "string" ? body.ref.slice(0, 60) : "",
    country: request.headers.get("x-vercel-ip-country") || "",
  });

  return json(200, { ok: true, fixes: data.fixes });
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
