/**
 * Sends one AD ROAST lead to Rudy's Google Sheet through an Apps Script web
 * app (LEADS_WEBHOOK_URL). The script and setup steps are in the vault:
 * "02 Projects/Lead Magnets/AD ROAST/README - AD ROAST page.md".
 * Every lead is also logged, so nothing is lost if the Sheet call fails.
 */

export interface Lead {
  email: string;
  score: number | null;
  verdict: string;
  adType: string;
  traffic: string;
  landingUrl: string;
  ref: string;
  country: string;
}

export async function saveLead(lead: Lead): Promise<boolean> {
  console.log("lead", JSON.stringify(lead));
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.LEADS_WEBHOOK_SECRET || "", ...lead }),
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean };
    if (!res.ok || !body.ok) console.error("lead sheet", res.status, JSON.stringify(body));
    return res.ok && !!body.ok;
  } catch (e) {
    console.error("lead sheet", (e as Error).message);
    return false;
  }
}
