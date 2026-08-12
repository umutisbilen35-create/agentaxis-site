import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const route = await readFile(new URL("../app/api/maintenance/retention/route.ts", import.meta.url), "utf8");

test("saklama işi önizleme ile başlar ve açık onay olmadan silmez", () => {
  assert.match(route, /RETENTION_DAYS = 365/);
  assert.match(route, /RETENTION_JOB_KEY/);
  assert.match(route, /mode: "preview"/);
  assert.match(route, /DELETE_EXPIRED_LEADS/);
  assert.match(route, /x-retention-confirmation/);
  assert.match(route, /DELETE FROM trial_runs/);
  assert.match(route, /DELETE FROM lead_intakes/);
});

test("saklama işi yalnız sonuçlanmayan veya kapanmış eski başvuruları kapsar", () => {
  assert.match(route, /status IN \('new','diagnosis_requested','closed'\)/);
  assert.doesNotMatch(route, /DELETE FROM lead_intakes WHERE created_at < \?\s*$/m);
});
