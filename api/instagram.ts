/**
 * GET /api/instagram: profile header + latest 6 posts for the /portfolio grid.
 *
 * Sources, first one configured wins:
 *  - BEHOLD_FEED_URL: a Behold.so JSON feed (feeds.behold.so/<id>). Behold
 *    handles the Instagram login and re-hosts the images. Free plan refreshes
 *    once a day, so this is cached for 6 hours to stay inside its view limit.
 *  - IG_TOKEN, in one of two flavours:
 *  - Instagram Login token (starts with "IG"): reads graph.instagram.com/me.
 *  - Facebook Page token: reads graph.facebook.com/{IG_USER_ID}, so IG_USER_ID
 *    must be set too. This is the one that never expires.
 * With no token, or if Instagram errors, it returns { ok: false } and the page
 * falls back to a plain link to the profile.
 *
 * The CDN caches the response, so visitors never hit Instagram or Behold.
 */

const VERSION = "v23.0";
const FIELDS = [
  "username",
  "biography",
  "website",
  "followers_count",
  "follows_count",
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
  biography?: string;
  website?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  profile_picture_url?: string;
  media?: { data: GraphMedia[] };
}

interface BeholdSize { mediaUrl: string }
interface BeholdPost {
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  isReel?: boolean;
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: { small?: BeholdSize; medium?: BeholdSize; large?: BeholdSize };
  prunedCaption?: string;
  caption?: string;
}
interface BeholdFeed {
  username: string;
  biography?: string;
  website?: string;
  followersCount?: number;
  followsCount?: number;
  profilePictureUrl?: string;
  posts?: BeholdPost[];
}

async function fromBehold(feedUrl: string): Promise<Response> {
  try {
    const res = await fetch(feedUrl);
    if (!res.ok) {
      console.error("behold", res.status);
      return json({ ok: false, reason: "upstream" }, 300);
    }
    const f = (await res.json()) as BeholdFeed;
    const posts = (f.posts ?? [])
      .slice(0, 6)
      .map((m) => ({
        image: m.sizes?.medium?.mediaUrl ?? (m.mediaType === "VIDEO" ? m.thumbnailUrl : m.mediaUrl),
        url: m.permalink,
        kind: m.isReel || m.mediaType === "VIDEO" ? "reel" : m.mediaType === "CAROUSEL_ALBUM" ? "carousel" : "post",
        caption: (m.prunedCaption ?? m.caption ?? "").replace(/\s+/g, " ").trim().slice(0, 140),
      }))
      .filter((m) => m.image);
    return json(
      {
        ok: true,
        profile: {
          username: f.username,
          bio: f.biography ?? null,
          website: f.website ?? null,
          followers: f.followersCount ?? null,
          following: f.followsCount ?? null,
          posts: null,
          avatar: f.profilePictureUrl ?? null,
        },
        posts,
      },
      21600
    );
  } catch (err) {
    console.error("behold", err);
    return json({ ok: false, reason: "upstream" }, 300);
  }
}

export async function GET(): Promise<Response> {
  const behold = process.env.BEHOLD_FEED_URL;
  if (behold) return fromBehold(behold);

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
          bio: p.biography ?? null,
          website: p.website ?? null,
          followers: p.followers_count ?? null,
          following: p.follows_count ?? null,
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
