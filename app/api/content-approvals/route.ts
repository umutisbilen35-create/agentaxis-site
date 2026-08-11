import { clean, hmacSha256, privateHeaders, safeEqual, secureToken, sha256, type ApprovalDb } from "@/lib/contentApproval";

type R2BucketLike = {
  put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string> }): Promise<unknown>;
  delete(key: string): Promise<void>;
};

function json(message: string, status: number, extra: Record<string, unknown> = {}) {
  return Response.json({ message, ...extra }, { status, headers: privateHeaders });
}

async function adminAuthorized(request: Request) {
  const { env } = await import("cloudflare:workers");
  const expected = env.SERHAT_APPROVAL_ADMIN_SECRET ?? process.env.SERHAT_APPROVAL_ADMIN_SECRET ?? "";
  const authorization = request.headers.get("authorization") ?? "";
  if (!expected) return false;
  return safeEqual(await sha256(authorization), await sha256(`Bearer ${expected}`));
}

function verifiedImageType(bytes: Uint8Array) {
  const png = bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    .every((value, index) => bytes[index] === value);
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const webp = bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF"
    && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  return png ? { mime: "image/png", extension: "png" } : jpeg ? { mime: "image/jpeg", extension: "jpg" }
    : webp ? { mime: "image/webp", extension: "webp" } : null;
}

export async function GET(request: Request) {
  try {
    if (!await adminAuthorized(request)) return json("Yetkisiz.", 401);
    const publicId = clean(new URL(request.url).searchParams.get("publicId"), 64);
    if (!publicId) return json("İçerik kimliği gerekli.", 422);
    const { env } = await import("cloudflare:workers");
    const db = env.DB as unknown as ApprovalDb;
    const row = await db.prepare(
      "SELECT public_id,status,client_note,planned_at,expires_at,decided_at,image_sha256,content_hash FROM content_approvals WHERE public_id=? LIMIT 1",
    ).bind(publicId).first<{
      public_id: string; status: string; client_note: string | null; planned_at: string;
      expires_at: string; decided_at: string | null; image_sha256: string; content_hash: string;
    }>();
    if (!row) return json("Onay kaydı bulunamadı.", 404);
    const mediaSecret = env.SERHAT_MEDIA_SIGNING_SECRET ?? "";
    let publishImageUrl: string | null = null;
    if (row.status === "approved" && mediaSecret) {
      const expires = Math.floor(Date.now() / 1000) + 45 * 60;
      const signature = await hmacSha256(mediaSecret, `${row.public_id}|${expires}|${row.image_sha256}`);
      const origin = new URL(request.url).origin;
      publishImageUrl = `${origin}/api/content-approvals/${row.public_id}/publish-image?expires=${expires}&signature=${signature}`;
    }
    return json("Onay durumu alındı.", 200, {
      publicId: row.public_id, status: row.status, clientNote: row.client_note,
      plannedAt: row.planned_at, expiresAt: row.expires_at, decidedAt: row.decided_at,
      imageSha256: row.image_sha256,
      contentHash: row.content_hash,
      publishImageUrl,
    });
  } catch (error) {
    console.error("content_approval_status", error instanceof Error ? error.message : "unknown");
    return json("Onay durumu şu anda alınamadı.", 500);
  }
}

export async function POST(request: Request) {
  try {
    if (!await adminAuthorized(request)) return json("Yetkisiz.", 401);
    const length = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(length) || length <= 0 || length > 9_000_000) return json("Dosya boyutu geçersiz.", 413);

    const data = await request.formData();
    const image = data.get("image");
    const clientKey = clean(data.get("clientKey"), 80);
    const title = clean(data.get("title"), 160);
    const caption = clean(data.get("caption"), 2200);
    const plannedAt = clean(data.get("plannedAt"), 40);
    const expiresHours = Math.max(1, Math.min(Number(data.get("expiresHours") ?? 72), 168));
    if (!(image instanceof File) || !clientKey || !title || !caption || !plannedAt) return json("Zorunlu alanlar eksik.", 422);
    if (!/^[a-z0-9_-]{1,80}$/.test(clientKey)) return json("Müşteri anahtarı geçersiz.", 422);
    if (!new Set(["image/png", "image/jpeg", "image/webp"]).has(image.type) || image.size > 8_000_000) return json("Görsel biçimi veya boyutu geçersiz.", 422);
    const planned = new Date(plannedAt);
    if (Number.isNaN(planned.getTime())) return json("Yayın zamanı geçersiz.", 422);
    const now = new Date();
    if (planned.getTime() <= now.getTime() || planned.getTime() > now.getTime() + 365 * 24 * 60 * 60 * 1000) {
      return json("Yayın zamanı geçersiz.", 422);
    }

    const bytes = await image.arrayBuffer();
    const verified = verifiedImageType(new Uint8Array(bytes));
    if (!verified || verified.mime !== image.type) return json("Görsel biçimi geçersiz.", 422);
    const imageHash = await crypto.subtle.digest("SHA-256", bytes);
    const imageHashHex = Array.from(new Uint8Array(imageHash)).map((part) => part.toString(16).padStart(2, "0")).join("");
    const publicId = crypto.randomUUID().replaceAll("-", "");
    const token = secureToken();
    const tokenHash = await sha256(token);
    const contentHash = await sha256(`${clientKey}|${title}|${caption}|${planned.toISOString()}|${imageHashHex}`);
    const imageKey = `approvals/${clientKey}/${publicId}.${verified.extension}`;
    const expiresAt = new Date(now.getTime() + expiresHours * 60 * 60 * 1000).toISOString();

    const { env } = await import("cloudflare:workers");
    const db = env.DB as unknown as ApprovalDb;
    const media = env.MEDIA as unknown as R2BucketLike;
    const existing = await db.prepare("SELECT public_id FROM content_approvals WHERE content_hash = ? LIMIT 1")
      .bind(contentHash).first<{ public_id: string }>();
    if (existing?.public_id) return json("Aynı içerik daha önce oluşturuldu.", 409, { publicId: existing.public_id });

    await media.put(imageKey, bytes, { httpMetadata: { contentType: verified.mime }, customMetadata: { clientKey, publicId, imageHash: imageHashHex } });
    try {
      await db.prepare(`INSERT INTO content_approvals
        (public_id,client_key,token_hash,title,caption,image_key,image_sha256,planned_at,status,expires_at,content_hash,created_at)
        VALUES (?,?,?,?,?,?,?,?,'waiting_for_review',?,?,?)`)
        .bind(publicId, clientKey, tokenHash, title, caption, imageKey, imageHashHex,
          planned.toISOString(), expiresAt, contentHash, now.toISOString()).run();
    } catch (error) {
      await media.delete(imageKey);
      const duplicate = await db.prepare("SELECT public_id FROM content_approvals WHERE content_hash = ? LIMIT 1")
        .bind(contentHash).first<{ public_id: string }>();
      if (duplicate?.public_id) return json("Aynı içerik daha önce oluşturuldu.", 409, { publicId: duplicate.public_id });
      throw error;
    }
    let emailNotificationQueued = false;
    try {
      await db.prepare(`INSERT INTO content_notifications
        (public_id,client_key,approval_public_id,type,status,attempts,created_at)
        SELECT ?,?,?, 'email_content_ready', 'pending', 0, ?
        WHERE EXISTS(SELECT 1 FROM content_clients WHERE client_key=? AND email IS NOT NULL AND email_opt_in_at IS NOT NULL)
        ON CONFLICT(approval_public_id,type) DO NOTHING`)
        .bind(crypto.randomUUID().replaceAll("-", ""), clientKey, publicId, now.toISOString(), clientKey).run();
      emailNotificationQueued = Boolean(await db.prepare(
        "SELECT public_id FROM content_notifications WHERE approval_public_id=? AND type='email_content_ready' LIMIT 1",
      ).bind(publicId).first());
    } catch (error) {
      console.error("content_approval_notification_queue", error instanceof Error ? error.message : "unknown");
    }
    const origin = new URL(request.url).origin;
    return json("Onay bağlantısı oluşturuldu.", 201, {
      publicId, approvalUrl: `${origin}/onay/${publicId}?token=${token}`, expiresAt,
      emailNotificationQueued,
    });
  } catch (error) {
    console.error("content_approval_create", error instanceof Error ? error.message : "unknown");
    return json("Onay bağlantısı şu anda oluşturulamadı.", 500);
  }
}
