import { clean, privateHeaders, type ApprovalDb } from "@/lib/contentApproval";
import { portalClientByToken } from "@/lib/contentPortal";

type R2ObjectLike = { body: BodyInit; httpMetadata?: { contentType?: string } };
type R2BucketLike = { get(key: string): Promise<R2ObjectLike | null> };

export async function GET(request: Request, { params }: { params: Promise<{ client: string; id: string }> }) {
  try {
    const values = await params;
    const clientKey = clean(values.client, 80);
    const publicId = clean(values.id, 64);
    const token = clean(new URL(request.url).searchParams.get("token"), 128);
    const { env } = await import("cloudflare:workers");
    const db = env.DB as unknown as ApprovalDb;
    const client = await portalClientByToken(db, clientKey, token);
    if ("error" in client) return new Response("Erişim reddedildi.", { status: 403, headers: privateHeaders });
    const row = await db.prepare("SELECT image_key FROM content_approvals WHERE public_id=? AND client_key=? LIMIT 1")
      .bind(publicId, clientKey).first<{ image_key: string }>();
    if (!row) return new Response("Görsel bulunamadı.", { status: 404, headers: privateHeaders });
    const object = await (env.MEDIA as unknown as R2BucketLike).get(row.image_key);
    if (!object) return new Response("Görsel bulunamadı.", { status: 404, headers: privateHeaders });
    return new Response(object.body, { status: 200, headers: { ...privateHeaders, "content-type": object.httpMetadata?.contentType ?? "image/png" } });
  } catch {
    return new Response("Görsel alınamadı.", { status: 500, headers: privateHeaders });
  }
}
