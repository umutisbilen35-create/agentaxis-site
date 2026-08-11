import { allowedDecisions, approvalAttemptAllowed, approvalByToken, attemptIdentity, clean, clearApprovalFailures, privateHeaders, recordApprovalFailure, type ApprovalDb } from "@/lib/contentApproval";

function json(message: string, status: number, extra: Record<string, unknown> = {}) {
  return Response.json({ message, ...extra }, { status, headers: privateHeaders });
}

async function context(request: Request, params: Promise<{ id: string }>) {
  const { env } = await import("cloudflare:workers");
  const db = env.DB as unknown as ApprovalDb;
  const publicId = clean((await params).id, 64);
  const token = clean(new URL(request.url).searchParams.get("token"), 128);
  if (!publicId || !token) return { error: json("Bağlantı geçersiz.", 403) };
  const ipHash = await attemptIdentity(request, publicId);
  if (!await approvalAttemptAllowed(db, publicId, ipHash)) return { error: json("Çok fazla başarısız deneme.", 429) };
  const result = await approvalByToken(db, publicId, token);
  if ("error" in result) {
    await recordApprovalFailure(db, publicId, ipHash);
    return { error: json("Bağlantı geçersiz veya süresi dolmuş.", 403) };
  }
  await clearApprovalFailures(db, publicId, ipHash);
  return { db, row: result.row, publicId, token };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await context(request, params); if ("error" in ctx) return ctx.error;
    const { row, publicId, token } = ctx;
    return json("İçerik bulundu.", 200, {
      title: row.title, caption: row.caption, plannedAt: row.planned_at,
      status: row.status, clientNote: row.client_note,
      imageUrl: `/api/content-approvals/${publicId}/image?token=${encodeURIComponent(token)}`,
    });
  } catch {
    return json("İçerik şu anda alınamadı.", 500);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await context(request, params); if ("error" in ctx) return ctx.error;
    if (ctx.row.status !== "waiting_for_review") return json("Bu bağlantı daha önce kullanıldı.", 409);
    const length = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(length) || length <= 0 || length > 16_000) return json("İstek gövdesi çok büyük.", 413);
    const body = await request.json() as { decision?: unknown; note?: unknown };
    const decision = clean(body.decision, 20); const note = clean(body.note, 1000);
    if (!allowedDecisions.has(decision) || (decision === "revise" && !note)) return json("Karar veya düzeltme notu eksik.", 422);
    const status = decision === "approve" ? "approved" : decision === "revise" ? "revision_requested" : "rejected";
    const result = await ctx.db.prepare("UPDATE content_approvals SET status=?,client_note=?,decided_at=? WHERE public_id=? AND status='waiting_for_review'")
      .bind(status, note || null, new Date().toISOString(), ctx.publicId).run();
    if ((result.meta?.changes ?? 0) !== 1) return json("Bu bağlantı daha önce kullanıldı.", 409);
    return json(status === "approved" ? "İçerik onaylandı." : status === "revision_requested" ? "Düzeltme talebi kaydedildi." : "İçerik reddedildi.", 200, { status });
  } catch {
    return json("Karar şu anda kaydedilemedi.", 500);
  }
}
