/**
 * GET /api/instagram: profile header + latest 6 posts for the /portfolio grid.
 *
 * Needs IG_TOKEN in the Vercel env. Two token types work:
 *  - Instagram Login token (starts with "IG"): reads graph.instagram.com/me.
 *  - Facebook Page token: reads graph.facebook.com/{IG_USER_ID}, so IG_USER_ID
 *    must be set too. This is the one that never expires.
 * With no token, or if Instagram errors, it returns { ok: false } and the page
 * falls back to a plain link to the profile.
 *
 * The CDN caches the response for an hour, so visitors never hit Instagram.
 */

const VERSION = "v23.0";
const FIELDS = [
  "username",
  "followers_count",
  "media_count",
  "profile_picture_url",
  "media.limit(6){media_type,media_product_type,media_url,thumbnail_url,permalink,caption}",
].join(",");

interface GraphMedia {
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
}

interface GraphProfile {
  username: string;
  followers_count?: number;
  media_count?: number;
  profile_picture_url?: string;
  media?: { data: GraphMedia[] };
}

export async function GET(): Promise<Response> {
  const token = process.env.IG_TOKEN;
  const igUserId = process.env.IG_USER_ID;
  if (!token) return json({ ok: false, reason: "not-configured" }, 300);

  const igLogin = token.startsWith("IG");
  if (!igLogin && !igUserId) return json({ ok: false, reason: "not-configured" }, 300);

  const url = igLogin
    ? `https://graph.instagram.com/${VERSION}/me`
    : `https://graph.facebook.com/${VERSION}/${igUserId}`;

  try {
    const res = await fetch(`${url}?${new URLSearchParams({ fields: FIELDS, access_token: token })}`);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
      console.error("instagram", res.status, body.error?.message);
      return json({ ok: false, reason: "upstream" }, 300);
    }
    const p = (await res.json()) as GraphProfile;
    const posts = (p.media?.data ?? [])
      .map((m) => ({
        image: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
        url: m.permalink,
        kind: m.media_product_type === "REELS" || m.media_type === "VIDEO" ? "reel" : m.media_type === "CAROUSEL_ALBUM" ? "carousel" : "post",
        caption: (m.caption ?? "").replace(/\s+/g, " ").trim().slice(0, 140),
      }))
      .filter((m) => m.image);

    return json(
      {
        ok: true,
        profile: {
          username: p.username,
          followers: p.followers_count ?? null,
          posts: p.media_count ?? null,
          avatar: p.profile_picture_url ?? null,
        },
        posts,
      },
      3600
    );
  } catch (err) {
    console.error("instagram", err);
    return json({ ok: false, reason: "upstream" }, 300);
  }
}

function json(body: unknown, maxAge: number): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=86400`,
    },
  });
}
