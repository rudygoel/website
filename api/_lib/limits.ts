/**
 * Spend guard for /api/roast: a per-IP hourly limit and a site-wide daily cap.
 *
 * With Upstash/Vercel KV env vars set (KV_REST_API_URL + KV_REST_API_TOKEN, or
 * UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) the counts are shared by
 * every server instance. Without them they live in this instance's memory,
 * which only holds while the instance stays warm. The Anthropic console spend
 * limit on the key is the real backstop either way.
 */

const PER_IP_PER_HOUR = Number(process.env.ROAST_PER_IP_HOUR || 5);
const DAILY_CAP = Number(process.env.ROAST_DAILY_CAP || 50);

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const memory = new Map<string, { n: number; exp: number }>();

/** Brisbane calendar date, so the daily cap resets at midnight for Rudy. */
function today(): string {
  return new Date(Date.now() + 10 * 3600_000).toISOString().slice(0, 10);
}

async function incr(key: string, ttlSec: number): Promise<number> {
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify([["INCR", key], ["EXPIRE", key, String(ttlSec), "NX"]]),
      });
      if (res.ok) {
        const out = (await res.json()) as { result: number }[];
        return Number(out[0]?.result ?? 0);
      }
      console.error("kv", res.status);
    } catch (e) {
      console.error("kv", (e as Error).message);
    }
  }
  const now = Date.now();
  const hit = memory.get(key);
  if (!hit || hit.exp < now) {
    memory.set(key, { n: 1, exp: now + ttlSec * 1000 });
    return 1;
  }
  hit.n += 1;
  return hit.n;
}

export type LimitResult = { ok: true } | { ok: false; reason: "ip" | "daily" };

export async function checkLimits(ip: string): Promise<LimitResult> {
  const hour = Math.floor(Date.now() / 3600_000);
  const perIp = await incr(`roast:ip:${ip}:${hour}`, 3600);
  if (perIp > PER_IP_PER_HOUR) return { ok: false, reason: "ip" };
  const daily = await incr(`roast:day:${today()}`, 2 * 86400);
  if (daily > DAILY_CAP) return { ok: false, reason: "daily" };
  return { ok: true };
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}
