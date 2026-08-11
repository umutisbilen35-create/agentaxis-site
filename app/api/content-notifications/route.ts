import { clean, privateHeaders, safeEqual, sha256, type ApprovalDb } from "@/lib/contentApproval";

function json(message: string, status: number, extra: Record<string, unknown> = {}) {
  return Response.json({ message, ...extra }, { status, headers: privateHeaders });
}

async function adminAuthorized(request: Request) {
  const { env } = await import("cloudflare:workers");
  const expected = env.SERHAT_APPROVAL_ADMIN_SECRET ?? process.env.SERHAT_APPROVAL_ADMIN_SECRET ?? "";
  const authorization = request.headers.get("authorization") ?? "";
  return Boolean(expected) && safeEqual(await sha256(authorization), await sha256(`Bearer ${expected}`));
}

export async function GET(request: Request) {
  try {
    if (!await adminAuthorized(request)) return json("Yetkisiz.", 401);
    const { env } = await import("cloudflare:workers");
    const db = env.DB as unknown as ApprovalDb;
    const rows = await db.prepare(`SELECT n.public_id,n.client_key,n.approval_public_id,n.type,n.status,n.attempts,
      c.name,c.email,c.email_opt_in_at FROM content_notifications n JOIN content_clients c ON c.client_key=n.client_key
      WHERE n.status IN ('pending','retry') AND n.type='email_content_ready'
      AND c.email IS NOT NULL AND c.email_opt_in_at IS NOT NULL
      ORDER BY n.created_at ASC LIMIT 25`).all<Record<string, unknown>>();
    return json("Bildirim kuyruğu alındı.", 200, { notifications: rows.results });
  } catch {
    return json("Bildirim kuyruğu alınamadı.", 500);
  }
}

export async function POST(request: Request) {
  try {
    if (!await adminAuthorized(request)) return json("Yetkisiz.", 401);
    const length = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(length) || length <= 0 || length > 8_000) return json("İstek gövdesi geçersiz.", 413);
    const body = await request.json() as Record<string, unknown>;
    const publicId = clean(body.publicId, 64);
    const status = clean(body.status, 20);
    const error = clean(body.error, 500);
    if (!publicId || !new Set(["sent", "retry", "failed"]).has(status)) return json("Bildirim sonucu geçersiz.", 422);
    const { env } = await import("cloudflare:workers");
    const db = env.DB as unknown as ApprovalDb;
    const result = await db.prepare(`UPDATE content_notifications SET status=?,attempts=attempts+1,last_error=?,sent_at=?
      WHERE public_id=? AND status IN ('pending','retry')`)
      .bind(status, error || null, status === "sent" ? new Date().toISOString() : null, publicId).run();
    if ((result.meta?.changes ?? 0) !== 1) return json("Bildirim daha önce işlendi veya bulunamadı.", 409);
    return json("Bildirim sonucu kaydedildi.", 200, { status });
  } catch {
    return json("Bildirim sonucu kaydedilemedi.", 500);
  }
}
