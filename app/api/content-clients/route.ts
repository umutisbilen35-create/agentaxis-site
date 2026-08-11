import { clean, privateHeaders, safeEqual, secureToken, sha256, type ApprovalDb } from "@/lib/contentApproval";

function json(message: string, status: number, extra: Record<string, unknown> = {}) {
  return Response.json({ message, ...extra }, { status, headers: privateHeaders });
}

async function adminAuthorized(request: Request) {
  const { env } = await import("cloudflare:workers");
  const expected = env.SERHAT_APPROVAL_ADMIN_SECRET ?? process.env.SERHAT_APPROVAL_ADMIN_SECRET ?? "";
  const authorization = request.headers.get("authorization") ?? "";
  return Boolean(expected) && safeEqual(await sha256(authorization), await sha256(`Bearer ${expected}`));
}

function emailValue(value: unknown) {
  const email = clean(value, 254).toLowerCase();
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

export async function POST(request: Request) {
  try {
    if (!await adminAuthorized(request)) return json("Yetkisiz.", 401);
    const length = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(length) || length <= 0 || length > 8_000) return json("İstek gövdesi geçersiz.", 413);
    const body = await request.json() as Record<string, unknown>;
    const clientKey = clean(body.clientKey, 80);
    const name = clean(body.name, 120);
    const email = emailValue(body.email);
    const emailOptIn = body.emailOptIn === true;
    if (!/^[a-z0-9_-]{1,80}$/.test(clientKey) || !name) return json("Müşteri bilgileri geçersiz.", 422);
    if (body.email && !email) return json("E-posta adresi geçersiz.", 422);
    if (emailOptIn && !email) return json("E-posta bildirim izni için adres gereklidir.", 422);

    const { env } = await import("cloudflare:workers");
    const db = env.DB as unknown as ApprovalDb;
    const existing = await db.prepare("SELECT client_key FROM content_clients WHERE client_key=? LIMIT 1")
      .bind(clientKey).first<{ client_key: string }>();
    if (existing) return json("Müşteri paneli daha önce oluşturuldu.", 409);
    const token = secureToken();
    const now = new Date().toISOString();
    await db.prepare(`INSERT INTO content_clients
      (client_key,name,portal_token_hash,email,email_opt_in_at,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?)`)
      .bind(clientKey, name, await sha256(token), email || null,
        email && emailOptIn ? now : null, now, now).run();
    const origin = new URL(request.url).origin;
    return json("Müşteri paneli oluşturuldu.", 201, {
      clientKey,
      portalUrl: `${origin}/icerik/${clientKey}?token=${token}`,
      emailReady: Boolean(email && emailOptIn),
    });
  } catch {
    return json("Müşteri paneli oluşturulamadı.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    if (!await adminAuthorized(request)) return json("Yetkisiz.", 401);
    const length = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(length) || length <= 0 || length > 8_000) return json("İstek gövdesi geçersiz.", 413);
    const body = await request.json() as Record<string, unknown>;
    const clientKey = clean(body.clientKey, 80);
    const email = emailValue(body.email);
    const emailOptIn = body.emailOptIn === true;
    if (!/^[a-z0-9_-]{1,80}$/.test(clientKey) || !email) return json("Müşteri veya e-posta bilgisi geçersiz.", 422);
    const now = new Date().toISOString();
    const { env } = await import("cloudflare:workers");
    const db = env.DB as unknown as ApprovalDb;
    const result = await db.prepare(`UPDATE content_clients SET email=?,email_opt_in_at=?,updated_at=? WHERE client_key=?`)
      .bind(email, emailOptIn ? now : null, now, clientKey).run();
    if ((result.meta?.changes ?? 0) !== 1) return json("Müşteri paneli bulunamadı.", 404);
    return json("E-posta bildirim ayarı güncellendi.", 200, { clientKey, emailReady: emailOptIn });
  } catch {
    return json("E-posta bildirim ayarı güncellenemedi.", 500);
  }
}
