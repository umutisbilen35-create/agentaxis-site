export const allowedDecisions = new Set(["approve", "revise", "reject"]);

export type ApprovalDb = {
  prepare(query: string): {
    bind(...values: unknown[]): ReturnType<ApprovalDb["prepare"]>;
    first<T>(): Promise<T | null>;
    run(): Promise<{ meta?: { changes?: number } }>;
    all<T>(): Promise<{ results: T[] }>;
  };
};

export type ApprovalRow = {
  public_id: string;
  client_key: string;
  token_hash: string;
  title: string;
  caption: string;
  image_key: string;
  image_sha256: string;
  planned_at: string;
  status: string;
  expires_at: string;
  client_note: string | null;
};

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((part) => part.toString(16).padStart(2, "0")).join("");
}

export async function hmacSha256(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature)).map((part) => part.toString(16).padStart(2, "0")).join("");
}

export function secureToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map((part) => part.toString(16).padStart(2, "0")).join("");
}

export function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let i = 0; i < left.length; i += 1) result |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return result === 0;
}

export async function approvalByToken(db: ApprovalDb, publicId: string, token: string) {
  const row = await db.prepare("SELECT * FROM content_approvals WHERE public_id = ? LIMIT 1")
    .bind(publicId).first<ApprovalRow>();
  const incomingHash = await sha256(token);
  const expectedHash = row?.token_hash ?? "0".repeat(64);
  if (!safeEqual(expectedHash, incomingHash) || !row) return { error: "invalid" as const };
  if (new Date(row.expires_at).getTime() <= Date.now()) return { error: "expired" as const };
  return { row };
}

function attemptWindow() {
  return String(Math.floor(Date.now() / (15 * 60 * 1000)));
}

export async function attemptIdentity(request: Request, publicId: string) {
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return sha256(`${publicId}|${ip}`);
}

export async function approvalAttemptAllowed(db: ApprovalDb, publicId: string, ipHash: string) {
  const row = await db.prepare(
    "SELECT failures FROM approval_attempts WHERE public_id=? AND ip_hash=? AND window_start=? LIMIT 1",
  ).bind(publicId, ipHash, attemptWindow()).first<{ failures: number }>();
  return Number(row?.failures ?? 0) < 10;
}

export async function recordApprovalFailure(db: ApprovalDb, publicId: string, ipHash: string) {
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO approval_attempts(public_id,ip_hash,window_start,failures,updated_at)
    SELECT ?,?,?,1,? WHERE EXISTS(SELECT 1 FROM content_approvals WHERE public_id=?)
    ON CONFLICT(public_id,ip_hash,window_start)
    DO UPDATE SET failures=failures+1,updated_at=excluded.updated_at`)
    .bind(publicId, ipHash, attemptWindow(), now, publicId).run();
}

export async function clearApprovalFailures(db: ApprovalDb, publicId: string, ipHash: string) {
  await db.prepare("DELETE FROM approval_attempts WHERE public_id=? AND ip_hash=? AND window_start=?")
    .bind(publicId, ipHash, attemptWindow()).run();
}

export const privateHeaders = {
  "cache-control": "no-store, max-age=0",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};
