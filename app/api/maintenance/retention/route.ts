type RetentionDb = {
  batch(statements: unknown[]): Promise<unknown[]>;
  prepare(query: string): {
    bind(...values: unknown[]): ReturnType<RetentionDb["prepare"]>;
    first<T>(): Promise<T | null>;
  };
};

const RETENTION_DAYS = 365;
const APPLY_CONFIRMATION = "DELETE_EXPIRED_LEADS";

function response(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    const { env } = await import("cloudflare:workers");
    const runtime = env as typeof env & { RETENTION_JOB_KEY?: string };
    const configuredKey = String(runtime.RETENTION_JOB_KEY ?? "");
    const authorization = request.headers.get("authorization") ?? "";
    if (!configuredKey || authorization !== `Bearer ${configuredKey}`) {
      return response({ message: "Yetkisiz." }, 401);
    }

    const db = runtime.DB as unknown as RetentionDb;
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const count = await db.prepare(
      "SELECT COUNT(*) AS count FROM lead_intakes WHERE created_at < ? AND status IN ('new','diagnosis_requested','closed')"
    ).bind(cutoff).first<{ count: number }>();
    const candidateCount = Number(count?.count ?? 0);
    const apply = request.headers.get("x-retention-confirmation") === APPLY_CONFIRMATION;

    if (!apply) {
      return response({ mode: "preview", retentionDays: RETENTION_DAYS, cutoff, candidateCount, deleted: 0 });
    }

    const candidateIds = "SELECT id FROM lead_intakes WHERE created_at < ? AND status IN ('new','diagnosis_requested','closed')";
    await db.batch([
      db.prepare(`DELETE FROM trial_runs WHERE intake_id IN (${candidateIds})`).bind(cutoff),
      db.prepare("DELETE FROM lead_intakes WHERE created_at < ? AND status IN ('new','diagnosis_requested','closed')").bind(cutoff),
    ]);
    return response({ mode: "apply", retentionDays: RETENTION_DAYS, cutoff, candidateCount, deleted: candidateCount });
  } catch (error) {
    console.error("retention_error", error instanceof Error ? error.message : "unknown");
    return response({ message: "Saklama denetimi çalıştırılamadı." }, 500);
  }
}
