const allowedNeeds = new Set(["visibility", "appointments", "follow", "automation", "reactivation"]);
const allowedPlans = new Set(["teshis"]);
const MAX_INTAKE_BODY_BYTES = 16_384;

async function readBodyWithinLimit(request: Request) {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) return body + decoder.decode();
    totalBytes += value.byteLength;
    if (totalBytes > MAX_INTAKE_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(value, { stream: true });
  }
}

const diagnosisChecks: Record<string, string[]> = {
  visibility: ["ai_search_visibility", "source_citation", "incorrect_brand_info"],
  appointments: ["booking_creation", "confirmation_reminder", "reschedule_flow"],
  follow: ["first_response_time", "next_step", "human_handoff"],
  automation: ["manual_repetition", "approval_points", "measurable_time_loss"],
  reactivation: ["consent_quality", "unfollowed_segments", "next_step"],
};

type IntakeBody = {
  business?: unknown;
  sector?: unknown;
  website?: unknown;
  needs?: unknown;
  plan?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  note?: unknown;
  customNeed?: unknown;
  consent?: unknown;
  marketingConsent?: unknown;
  websiteField?: unknown;
  attribution?: unknown;
};

const attributionKeys = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]);
const piiPattern = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|(?:\+?\d[\d\s().-]{8,}\d)/;
const sensitiveHealthPattern = /(?<![\p{L}\p{N}])(tanı|tani|teşhis|teshis|hastalık|hastalik|tedavi|ilaç|ilac|röntgen|rontgen|tahlil|reçete|recete|kanser|diyabet|hamile|ameliyat|enfeksiyon|ağrı|agri)(?![\p{L}\p{N}])/u;

function turkceKucuk(value: string) {
  return value.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
}

function saglikBilgisiIcerir(value: string) {
  return sensitiveHealthPattern.test(turkceKucuk(value));
}

function cleanAttribution(value: unknown) {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const result: Record<string, string | null> = {};
  for (const key of attributionKeys) {
    const original = clean(input[key], 200);
    const cleaned = original.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
    result[key] = cleaned && !piiPattern.test(original) ? cleaned : null;
  }
  return result;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function json(message: string, status: number, extra: Record<string, string> = {}) {
  return Response.json({ message, ...extra }, { status, headers: { "cache-control": "no-store" } });
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((part) => part.toString(16).padStart(2, "0")).join("");
}

function referenceNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  return `AX-${date}-${random}`;
}

type IntakeDb = {
  batch(statements: unknown[]): Promise<Array<{ meta: { last_row_id?: number | string } }>>;
  prepare(query: string): {
    bind(...values: unknown[]): ReturnType<IntakeDb["prepare"]>;
    first<T>(): Promise<T | null>;
    run(): Promise<{ meta: { last_row_id?: number | string } }>;
  };
};

export async function POST(request: Request) {
  try {
    const { env } = await import("cloudflare:workers");
    const db = env.DB as unknown as IntakeDb;
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_INTAKE_BODY_BYTES) {
      return json("Talep alınamadı.", 413);
    }

    const requestOrigin = request.headers.get("origin");
    if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
      return json("Talep alınamadı.", 403);
    }

    const rawBody = await readBodyWithinLimit(request);
    if (rawBody === null) return json("Talep alınamadı.", 413);
    const body = JSON.parse(rawBody) as IntakeBody;
    if (clean(body.websiteField, 100)) return json("Talep alınamadı.", 400);

    const business = clean(body.business, 120);
    const sector = clean(body.sector, 100);
    const website = clean(body.website, 300);
    const contactName = clean(body.contactName, 120);
    const email = clean(body.email, 180).toLowerCase();
    const phone = clean(body.phone, 40);
    const note = clean(body.note, 1000);
    const customNeed = clean(body.customNeed, 500);
    const plan = clean(body.plan, 30);
    const submittedNeeds = Array.isArray(body.needs) ? body.needs : [];
    const needs = [...new Set(submittedNeeds.filter((item): item is string => typeof item === "string" && allowedNeeds.has(item)))];
    const idempotencyKey = clean(request.headers.get("x-idempotency-key"), 100);
    const attribution = cleanAttribution(body.attribution);

    if (!business || !sector || !contactName || !email || !needs.length || needs.length > allowedNeeds.size || needs.length !== submittedNeeds.length || !allowedPlans.has(plan) || body.consent !== true || !idempotencyKey) {
      return json("Lütfen zorunlu alanları kontrol edin.", 422);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json("Geçerli bir e-posta adresi girin.", 422);
    if (website && !/^https?:\/\//i.test(website)) return json("Web bağlantısı http:// veya https:// ile başlamalıdır.", 422);
    if (note && (saglikBilgisiIcerir(note) || piiPattern.test(note))) {
      return json("Not alanına hasta, sağlık veya başka kişiye ait iletişim bilgisi yazmayın.", 422);
    }
    if (customNeed && (saglikBilgisiIcerir(customNeed) || piiPattern.test(customNeed))) {
      return json("İhtiyaç alanına hasta, sağlık veya başka kişiye ait iletişim bilgisi yazmayın.", 422);
    }
    const storedNote = [customNeed ? `Müşterinin yazdığı ihtiyaç: ${customNeed}` : "", note].filter(Boolean).join("\n\n").slice(0, 1000);

    const trustedIp = request.headers.get("cf-connecting-ip");
    if (!trustedIp && process.env.NODE_ENV === "production") {
      return json("Güvenli istek bilgisi doğrulanamadı. Lütfen yeniden deneyin.", 429);
    }
    const rateIdentity = trustedIp ? `ip:${trustedIp}` : `idempotency:${idempotencyKey}`;
    const ipHash = await sha256(`agentaxis-intake:${rateIdentity}`);
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const rate = await db.prepare("SELECT COUNT(*) AS count FROM lead_intakes WHERE ip_hash = ? AND created_at >= ?").bind(ipHash, oneHourAgo).first<{ count: number }>();
    if ((rate?.count ?? 0) >= 5) return json("Çok sayıda talep alındı. Lütfen bir süre sonra tekrar deneyin.", 429);

    const existing = await db.prepare("SELECT reference FROM lead_intakes WHERE idempotency_key = ?").bind(idempotencyKey).first<{ reference: string }>();
    if (existing?.reference) return json("Talebiniz daha önce alınmıştı.", 200, { reference: existing.reference });

    const normalizedBusiness = business.toLowerCase().replace(/\s+/g, " ");
    const contentHash = await sha256(`${email}|${normalizedBusiness}`);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const contentDuplicate = await db.prepare("SELECT reference FROM lead_intakes WHERE content_hash = ? AND created_at >= ? ORDER BY id DESC LIMIT 1").bind(contentHash, oneDayAgo).first<{ reference: string }>();
    if (contentDuplicate?.reference) return json("Talebiniz daha önce alınmıştı.", 200, { reference: contentDuplicate.reference });

    const createdAt = now.toISOString();
    let reference = referenceNumber();
    let kayitTamam = false;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const intakeStatement = db.prepare(`INSERT INTO lead_intakes
          (reference, business, sector, website, needs_json, plan, diagnosis_json, contact_name, email, phone, note, consent_at, idempotency_key, content_hash, ip_hash, marketing_consent_at, utm_source, utm_medium, utm_campaign, utm_content, utm_term, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'diagnosis_requested', ?)`)
          .bind(reference, business, sector, website || null, JSON.stringify(needs), plan,
            JSON.stringify(needs.flatMap((need) => diagnosisChecks[need] ?? [])),
            contactName, email, phone || null, storedNote || null, createdAt, idempotencyKey, contentHash, ipHash,
            body.marketingConsent === true ? createdAt : null, attribution.utm_source, attribution.utm_medium,
            attribution.utm_campaign, attribution.utm_content, attribution.utm_term, createdAt);
        const trialStatement = db.prepare(`INSERT INTO trial_runs
          (intake_id, status, starts_at, ends_at, milestones_json, metrics_json, created_at)
          SELECT id, 'diagnosis_requested', NULL, NULL, ?, ?, ? FROM lead_intakes WHERE reference = ?`)
          .bind(JSON.stringify(["public_evidence", "mini_diagnosis", "customer_review", "solution_only_if_confirmed"]), JSON.stringify({}), createdAt, reference);
        await db.batch([intakeStatement, trialStatement]);
        kayitTamam = true;
        break;
      } catch (error) {
        const concurrentExisting = await db.prepare("SELECT reference FROM lead_intakes WHERE idempotency_key = ?").bind(idempotencyKey).first<{ reference: string }>();
        if (concurrentExisting?.reference) {
          return json("Talebiniz daha önce alınmıştı.", 200, { reference: concurrentExisting.reference });
        }
        if (attempt === 1) throw error;
        reference = referenceNumber();
      }
    }
    if (!kayitTamam) throw new Error("intake_insert_failed");

    return json("Talebiniz güvenle alındı.", 201, { reference });
  } catch (error) {
    console.error("intake_error", error instanceof Error ? error.message : "unknown");
    return json("Talep şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyin.", 500);
  }
}
