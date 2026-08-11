import { clean, safeEqual, sha256, type ApprovalDb } from "@/lib/contentApproval";

export const CONTENT_SUGGESTIONS = [
  {
    key: "tss_beklenmeyen_masraf",
    category: "Tamamlayıcı Sağlık Sigortası",
    hook: "SGK'nız var; peki özel hastanede karşınıza çıkabilecek fark ücretlerine hazır mısınız?",
    angle: "Tamamlayıcı sağlık sigortasının kimler için değerlendirilebileceğini sade bir örnekle anlat.",
  },
  {
    key: "oss_esnek_koruma",
    category: "Özel Sağlık Sigortası",
    hook: "Sağlık planınız yalnız bugünü mü, beklenmedik yarını da mı koruyor?",
    angle: "Özel sağlık sigortasında kapsam, hastane ağı ve ihtiyaca göre plan seçiminin önemini anlat.",
  },
  {
    key: "tss_oss_karsilastirma",
    category: "Karşılaştırma",
    hook: "Tamamlayıcı mı, özel sağlık mı? Doğru cevap bütçenizden önce ihtiyaçlarınızda.",
    angle: "İki ürünün temel farklarını kesin vaat vermeden, kısa ve anlaşılır biçimde karşılaştır.",
  },
] as const;

export type PortalClient = {
  client_key: string;
  name: string;
  portal_token_hash: string;
  email: string | null;
  email_opt_in_at: string | null;
  whatsapp_e164: string | null;
  whatsapp_opt_in_at: string | null;
};

function windowKey() {
  return String(Math.floor(Date.now() / (15 * 60 * 1000)));
}

export async function portalIdentity(request: Request, clientKey: string) {
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return sha256(`${clientKey}|${ip}`);
}

export async function portalAttemptAllowed(db: ApprovalDb, clientKey: string, ipHash: string) {
  const row = await db.prepare("SELECT failures FROM content_portal_attempts WHERE client_key=? AND ip_hash=? AND window_start=? LIMIT 1")
    .bind(clientKey, ipHash, windowKey()).first<{ failures: number }>();
  return Number(row?.failures ?? 0) < 10;
}

export async function recordPortalFailure(db: ApprovalDb, clientKey: string, ipHash: string) {
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO content_portal_attempts(client_key,ip_hash,window_start,failures,updated_at)
    VALUES(?,?,?,1,?) ON CONFLICT(client_key,ip_hash,window_start)
    DO UPDATE SET failures=failures+1,updated_at=excluded.updated_at`)
    .bind(clientKey, ipHash, windowKey(), now).run();
}

export async function clearPortalFailures(db: ApprovalDb, clientKey: string, ipHash: string) {
  await db.prepare("DELETE FROM content_portal_attempts WHERE client_key=? AND ip_hash=? AND window_start=?")
    .bind(clientKey, ipHash, windowKey()).run();
}

export async function portalClientByToken(db: ApprovalDb, clientKeyValue: unknown, tokenValue: unknown) {
  const clientKey = clean(clientKeyValue, 80);
  const token = clean(tokenValue, 128);
  if (!clientKey || !token || !/^[a-z0-9_-]{1,80}$/.test(clientKey)) return { error: "invalid" as const };
  const row = await db.prepare("SELECT * FROM content_clients WHERE client_key=? LIMIT 1")
    .bind(clientKey).first<PortalClient>();
  const incomingHash = await sha256(token);
  const expectedHash = row?.portal_token_hash ?? "0".repeat(64);
  if (!safeEqual(expectedHash, incomingHash) || !row) return { error: "invalid" as const };
  return { row, clientKey, token };
}

export function suggestionByKey(key: string) {
  return CONTENT_SUGGESTIONS.find((suggestion) => suggestion.key === key);
}
