import { allowedDecisions, clean, privateHeaders, type ApprovalDb } from "@/lib/contentApproval";
import { CONTENT_SUGGESTIONS, clearPortalFailures, portalAttemptAllowed, portalClientByToken, portalIdentity, recordPortalFailure, suggestionByKey } from "@/lib/contentPortal";

function json(message: string, status: number, extra: Record<string, unknown> = {}) {
  return Response.json({ message, ...extra }, { status, headers: privateHeaders });
}

async function context(request: Request, params: Promise<{ client: string }>) {
  const { env } = await import("cloudflare:workers");
  const db = env.DB as unknown as ApprovalDb;
  const clientKey = clean((await params).client, 80);
  const token = clean(new URL(request.url).searchParams.get("token"), 128);
  const ipHash = await portalIdentity(request, clientKey);
  if (!await portalAttemptAllowed(db, clientKey, ipHash)) return { error: json("Çok fazla başarısız deneme.", 429) };
  const result = await portalClientByToken(db, clientKey, token);
  if ("error" in result) {
    await recordPortalFailure(db, clientKey, ipHash);
    return { error: json("Panel bağlantısı geçersiz.", 403) };
  }
  await clearPortalFailures(db, clientKey, ipHash);
  return { db, client: result.row, clientKey, token };
}

export async function GET(request: Request, { params }: { params: Promise<{ client: string }> }) {
  try {
    const ctx = await context(request, params); if ("error" in ctx) return ctx.error;
    const approvals = await ctx.db.prepare(`SELECT public_id,title,caption,planned_at,status,client_note,created_at
      FROM content_approvals WHERE client_key=? ORDER BY created_at DESC LIMIT 50`)
      .bind(ctx.clientKey).all<Record<string, unknown>>();
    const requests = await ctx.db.prepare(`SELECT public_id,source,suggestion_key,topic,note,status,created_at
      FROM content_requests WHERE client_key=? ORDER BY created_at DESC LIMIT 50`)
      .bind(ctx.clientKey).all<Record<string, unknown>>();
    const notifications = await ctx.db.prepare(`SELECT public_id,type,status,created_at,sent_at
      FROM content_notifications WHERE client_key=? ORDER BY created_at DESC LIMIT 50`)
      .bind(ctx.clientKey).all<Record<string, unknown>>();
    return json("Panel hazır.", 200, {
      client: { name: ctx.client.name, emailNotifications: Boolean(ctx.client.email && ctx.client.email_opt_in_at) },
      suggestions: CONTENT_SUGGESTIONS,
      approvals: approvals.results.map((item) => ({ ...item,
        imageUrl: `/api/content-portal/${encodeURIComponent(ctx.clientKey)}/approval/${encodeURIComponent(String(item.public_id))}/image?token=${encodeURIComponent(ctx.token)}`,
      })),
      requests: requests.results,
      notifications: notifications.results,
    });
  } catch {
    return json("Panel şu anda alınamadı.", 500);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ client: string }> }) {
  try {
    const ctx = await context(request, params); if ("error" in ctx) return ctx.error;
    const length = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(length) || length <= 0 || length > 16_000) return json("İstek gövdesi geçersiz.", 413);
    const body = await request.json() as Record<string, unknown>;
    const action = clean(body.action, 30);
    if (action === "request") {
      const source = clean(body.source, 30);
      const suggestionKey = clean(body.suggestionKey, 80);
      const note = clean(body.note, 1000);
      let topic = clean(body.topic, 300);
      if (source === "system_suggestion") {
        const suggestion = suggestionByKey(suggestionKey);
        if (!suggestion) return json("İçerik önerisi geçersiz.", 422);
        topic = `${suggestion.category}: ${suggestion.hook} — ${suggestion.angle}`;
      } else if (source !== "client_custom" || !topic) {
        return json("Paylaşım konusu eksik.", 422);
      }
      const publicId = crypto.randomUUID().replaceAll("-", "");
      await ctx.db.prepare(`INSERT INTO content_requests
        (public_id,client_key,source,suggestion_key,topic,note,status,created_at)
        VALUES(?,?,?,?,?,?,'new',?)`)
        .bind(publicId, ctx.clientKey, source, suggestionKey || null, topic, note || null, new Date().toISOString()).run();
      return json("İçerik isteğiniz alındı.", 201, { publicId, status: "new" });
    }
    if (action === "decision") {
      const publicId = clean(body.publicId, 64);
      const decision = clean(body.decision, 20);
      const note = clean(body.note, 1000);
      if (!publicId || !allowedDecisions.has(decision) || (decision === "revise" && !note)) return json("Karar veya not eksik.", 422);
      const status = decision === "approve" ? "approved" : decision === "revise" ? "revision_requested" : "rejected";
      const result = await ctx.db.prepare(`UPDATE content_approvals SET status=?,client_note=?,decided_at=?
        WHERE public_id=? AND client_key=? AND status='waiting_for_review'`)
        .bind(status, note || null, new Date().toISOString(), publicId, ctx.clientKey).run();
      if ((result.meta?.changes ?? 0) !== 1) return json("Bu içerik daha önce karara bağlandı.", 409);
      return json("Kararınız kaydedildi.", 200, { status });
    }
    return json("İşlem geçersiz.", 422);
  } catch {
    return json("İşlem şu anda kaydedilemedi.", 500);
  }
}
