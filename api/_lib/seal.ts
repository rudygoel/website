/**
 * Seals the gated half of a roast (the 3 fixes) so the browser can hold it
 * without reading it. /api/roast-unlock opens it once an email is given.
 * AES-256-GCM, keyed from ROAST_SECRET (or, if unset, from the Anthropic key,
 * which is already a server-only secret).
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export interface Sealed {
  fixes: string;
  score: number | null;
  verdict: string;
  adType: string;
  traffic: string;
  landingUrl: string;
  exp: number;
}

function key(): Buffer {
  const secret = process.env.ROAST_SECRET || process.env.ANTHROPIC_API_KEY;
  if (!secret) throw new Error("No ROAST_SECRET or ANTHROPIC_API_KEY to seal with");
  return createHash("sha256").update(`ad-roast:${secret}`).digest();
}

export function seal(data: Sealed): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

export function unseal(token: string): Sealed | null {
  try {
    const raw = Buffer.from(token, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const text = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    const data = JSON.parse(text) as Sealed;
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}
