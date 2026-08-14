import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const worker = fs.readFileSync(path.join(root, "worker/index.ts"), "utf8");
const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
const intake = fs.readFileSync(path.join(root, "app/api/intake/route.ts"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

test("global güvenlik başlıkları Sites worker katmanında uygulanır", () => {
  for (const header of [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Cross-Origin-Opener-Policy",
    "Cross-Origin-Resource-Policy",
  ]) {
    assert.match(worker, new RegExp(header));
  }
  assert.match(worker, /withSecurityHeaders\(await handler\.fetch/);
  assert.match(worker, /frame-ancestors 'none'/);
  assert.match(worker, /object-src 'none'/);
  assert.match(worker, /form-action 'self'/);
});

test("özel demo ve API yanıtları ayrıca korunur", () => {
  assert.match(worker, /noindex, nofollow, noarchive, nosnippet, noimageindex/);
  assert.match(worker, /private, no-store, max-age=0/);
  assert.match(worker, /pathname\.startsWith\("\/api\/"\)/);
  assert.match(worker, /headers\.set\("Cache-Control", "no-store"\)/);
});

test("global başlıkların tek doğruluk kaynağı Sites worker katmanıdır", () => {
  assert.doesNotMatch(nextConfig, /source: "\/:path\*"/);
  assert.doesNotMatch(nextConfig, /Content-Security-Policy/);
  assert.match(worker, /https:\/\/www\.googletagmanager\.com/);
});

test("başvuru API'si büyük ve yabancı kökenli istekleri reddeder", () => {
  assert.match(intake, /MAX_INTAKE_BODY_BYTES = 16_384/);
  assert.match(intake, /contentLength > MAX_INTAKE_BODY_BYTES/);
  assert.match(intake, /requestOrigin !== new URL\(request\.url\)\.origin/);
  assert.match(intake, /request\.body\.getReader\(\)/);
  assert.match(intake, /totalBytes > MAX_INTAKE_BODY_BYTES/);
  assert.doesNotMatch(intake, /request\.text\(\)/);
});

test("nanoid güvenli alt sürüme sabitlenir", () => {
  assert.equal(packageJson.overrides.nanoid, "3.3.18");
});
