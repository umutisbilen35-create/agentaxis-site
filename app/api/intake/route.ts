const allowedNeeds = new Set(["visibility", "follow", "automation", "website", "reactivation"]);
const allowedPlans = new Set(["teshis"]);

const diagnosisChecks: Record<string, string[]> = {
  visibility: ["ai_search_visibility", "source_citation", "incorrect_brand_info"],
  follow: ["first_response_time", "next_step", "human_handoff"],
  automation: ["manual_repetition", "approval_points", "measurable_time_loss"],
  website: ["first_screen_clarity", "primary_cta", "mobile_contact_path"],
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
  consent?: unknown;
  marketingConsent?: unknown;
  websiteField?: unknown;
};

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
    const body = await request.json() as IntakeBody;
    if (clean(body.websiteField, 100)) return json("Talep alınamadı.", 400);

    const business = clean(body.business, 120);
    const sector = clean(body.sector, 100);
    const website = clean(body.website, 300);
    const contactName = clean(body.contactName, 120);
    const email = clean(body.email, 180).toLowerCase();
    const phone = clean(body.phone, 40);
    const note = clean(body.note, 1000);
    const plan = clean(body.plan, 30);
    const submittedNeeds = Array.isArray(body.needs) ? body.needs : [];
    const needs = submittedNeeds.filter((item): item is string => typeof item === "string" && allowedNeeds.has(item));
    const idempotencyKey = clean(request.headers.get("x-idempotency-key"), 100);

    if (!business || !sector || !contactName || !email || !needs.length || needs.length > 3 || needs.length !== submittedNeeds.length || !allowedPlans.has(plan) || body.consent !== true || !idempotencyKey) {
      return json("Lütfen zorunlu alanları kontrol edin.", 422);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json("Geçerli bir e-posta adresi girin.", 422);
    if (website && !/^https?:\/\//i.test(website)) return json("Web bağlantısı http:// veya https:// ile başlamalıdır.", 422);

    const trustedIp = request.headers.get("cf-connecting-ip");
    const ipHash = trustedIp ? await sha256(`agentaxis-intake:${trustedIp}`) : "not-available";
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    if (trustedIp) {
      const rate = await db.prepare("SELECT COUNT(*) AS count FROM lead_intakes WHERE ip_hash = ? AND created_at >= ?").bind(ipHash, oneHourAgo).first<{ count: number }>();
      if ((rate?.count ?? 0) >= 5) return json("Çok sayıda talep alındı. Lütfen bir süre sonra tekrar deneyin.", 429);
    }

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
          (reference, business, sector, website, needs_json, plan, diagnosis_json, contact_name, email, phone, note, consent_at, idempotency_key, content_hash, ip_hash, marketing_consent_at, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'diagnosis_requested', ?)`)
          .bind(reference, business, sector, website || null, JSON.stringify(needs), plan,
            JSON.stringify(needs.flatMap((need) => diagnosisChecks[need] ?? [])),
            contactName, email, phone || null, note || null, createdAt, idempotencyKey, contentHash, ipHash, body.marketingConsent === true ? createdAt : null, createdAt);
        const trialStatement = db.prepare(`INSERT INTO trial_runs
          (intake_id, status, starts_at, ends_at, milestones_json, metrics_json, created_at)
          SELECT id, 'diagnosis_requested', NULL, NULL, ?, ?, ? FROM lead_intakes WHERE reference = ?`)
          .bind(JSON.stringify(["public_evidence", "mini_diagnosis", "customer_review", "solution_only_if_confirmed"]), JSON.stringify({}), createdAt, reference);
        await db.batch([intakeStatement, trialStatement]);
        kayitTamam = true;
        break;
      } catch (error) {
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
