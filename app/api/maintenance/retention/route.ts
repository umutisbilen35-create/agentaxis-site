type RetentionDb = {
  batch(statements: unknown[]): Promise<Array<{ meta?: { changes?: number } }>>;
  prepare(query: string): {
    bind(...values: unknown[]): ReturnType<RetentionDb["prepare"]>;
    first<T>(): Promise<T | null>;
  };
};

const RETENTION_DAYS = 365;
const APPLY_CONFIRMATION = "DELETE_EXPIRED_LEADS";
const ELIGIBLE_STATUSES_SQL = "'new','diagnosis_requested','closed'";

async function secureEqual(left: string, right: string) {
  const encode = (value: string) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const [leftHash, rightHash] = await Promise.all([encode(left), encode(right)]);
  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) difference |= leftBytes[index] ^ rightBytes[index];
  return difference === 0;
}

function response(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    const { env } = await import("cloudflare:workers");
    const runtime = env as typeof env & { RETENTION_JOB_KEY?: string };
    const configuredKey = String(runtime.RETENTION_JOB_KEY ?? "");
    const authorization = request.headers.get("authorization") ?? "";
    if (!configuredKey || !(await secureEqual(authorization, `Bearer ${configuredKey}`))) {
      return response({ message: "Yetkisiz." }, 401);
    }

    const db = runtime.DB as unknown as RetentionDb;
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const count = await db.prepare(
      `SELECT COUNT(*) AS count FROM lead_intakes WHERE created_at < ? AND status IN (${ELIGIBLE_STATUSES_SQL})`
    ).bind(cutoff).first<{ count: number }>();
    const candidateCount = Number(count?.count ?? 0);
    const apply = request.headers.get("x-retention-confirmation") === APPLY_CONFIRMATION;

    if (!apply) {
      return response({ mode: "preview", retentionDays: RETENTION_DAYS, cutoff, candidateCount, deleted: 0 });
    }

    const candidateIds = `SELECT id FROM lead_intakes WHERE created_at < ? AND status IN (${ELIGIBLE_STATUSES_SQL})`;
    const results = await db.batch([
      db.prepare(`DELETE FROM trial_runs WHERE intake_id IN (${candidateIds})`).bind(cutoff),
      db.prepare(`DELETE FROM lead_intakes WHERE created_at < ? AND status IN (${ELIGIBLE_STATUSES_SQL})`).bind(cutoff),
    ]);
    const deleted = Number(results[1]?.meta?.changes ?? 0);
    return response({ mode: "apply", retentionDays: RETENTION_DAYS, cutoff, candidateCount, deleted });
  } catch (error) {
    console.error("retention_error", error instanceof Error ? error.message : "unknown");
    return response({ message: "Saklama denetimi çalıştırılamadı." }, 500);
  }
}
