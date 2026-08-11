import { approvalAttemptAllowed, approvalByToken, attemptIdentity, clean, clearApprovalFailures, privateHeaders, recordApprovalFailure, type ApprovalDb } from "@/lib/contentApproval";

type R2ObjectLike = { body: BodyInit; httpMetadata?: { contentType?: string } };
type R2BucketLike = { get(key: string): Promise<R2ObjectLike | null> };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { env } = await import("cloudflare:workers");
    const db = env.DB as unknown as ApprovalDb;
    const publicId = clean((await params).id, 64);
    const token = clean(new URL(request.url).searchParams.get("token"), 128);
    const ipHash = await attemptIdentity(request, publicId);
    if (!await approvalAttemptAllowed(db, publicId, ipHash)) {
      return new Response("Çok fazla başarısız deneme.", { status: 429, headers: privateHeaders });
    }
    const result = await approvalByToken(db, publicId, token);
    if ("error" in result) {
      await recordApprovalFailure(db, publicId, ipHash);
      return new Response("Erişim reddedildi.", { status: 403, headers: privateHeaders });
    }
    await clearApprovalFailures(db, publicId, ipHash);
    if (result.row.status !== "waiting_for_review") {
      return new Response("Bu bağlantı kapatıldı.", { status: 410, headers: privateHeaders });
    }
    const media = env.MEDIA as unknown as R2BucketLike;
    const object = await media.get(result.row.image_key);
    if (!object) return new Response("Görsel bulunamadı.", { status: 404, headers: privateHeaders });
    return new Response(object.body, { status: 200, headers: { ...privateHeaders, "content-type": object.httpMetadata?.contentType ?? "image/png" } });
  } catch {
    return new Response("Görsel alınamadı.", { status: 500, headers: privateHeaders });
  }
}
