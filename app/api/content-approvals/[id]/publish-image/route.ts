import { clean, hmacSha256, privateHeaders, safeEqual, type ApprovalDb } from "@/lib/contentApproval";

type R2ObjectLike = { body: BodyInit; httpMetadata?: { contentType?: string } };
type R2BucketLike = { get(key: string): Promise<R2ObjectLike | null> };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { env } = await import("cloudflare:workers");
    const publicId = clean((await params).id, 64);
    const url = new URL(request.url);
    const expires = Number(url.searchParams.get("expires") ?? "0");
    const signature = clean(url.searchParams.get("signature"), 128);
    const now = Math.floor(Date.now() / 1000);
    if (!publicId || !Number.isSafeInteger(expires) || expires <= now || expires > now + 60 * 60 || signature.length !== 64) {
      return new Response("Erişim reddedildi.", { status: 403, headers: privateHeaders });
    }
    const secret = env.SERHAT_MEDIA_SIGNING_SECRET ?? "";
    if (!secret) return new Response("Erişim reddedildi.", { status: 403, headers: privateHeaders });
    const db = env.DB as unknown as ApprovalDb;
    const row = await db.prepare(
      "SELECT image_key,image_sha256,status FROM content_approvals WHERE public_id=? LIMIT 1",
    ).bind(publicId).first<{ image_key: string; image_sha256: string; status: string }>();
    if (!row || row.status !== "approved") return new Response("Erişim reddedildi.", { status: 403, headers: privateHeaders });
    const expected = await hmacSha256(secret, `${publicId}|${expires}|${row.image_sha256}`);
    if (!safeEqual(expected, signature)) return new Response("Erişim reddedildi.", { status: 403, headers: privateHeaders });
    const object = await (env.MEDIA as unknown as R2BucketLike).get(row.image_key);
    if (!object) return new Response("Görsel bulunamadı.", { status: 404, headers: privateHeaders });
    return new Response(object.body, {
      status: 200,
      headers: { ...privateHeaders, "content-type": object.httpMetadata?.contentType ?? "image/png" },
    });
  } catch {
    return new Response("Görsel alınamadı.", { status: 500, headers: privateHeaders });
  }
}
