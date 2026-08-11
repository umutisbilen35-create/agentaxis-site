import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const helper = fs.readFileSync(new URL("../lib/contentApproval.ts", import.meta.url), "utf8");
const createRoute = fs.readFileSync(new URL("../app/api/content-approvals/route.ts", import.meta.url), "utf8");
const decisionRoute = fs.readFileSync(new URL("../app/api/content-approvals/[id]/route.ts", import.meta.url), "utf8");
const imageRoute = fs.readFileSync(new URL("../app/api/content-approvals/[id]/image/route.ts", import.meta.url), "utf8");
const publishImageRoute = fs.readFileSync(new URL("../app/api/content-approvals/[id]/publish-image/route.ts", import.meta.url), "utf8");
const page = fs.readFileSync(new URL("../app/onay/[id]/page.tsx", import.meta.url), "utf8");

test("onay bağlantısı ham tokenı veritabanına yazmaz", () => {
  assert.match(createRoute, /tokenHash = await sha256\(token\)/);
  assert.match(createRoute, /token_hash/);
  assert.doesNotMatch(createRoute, /VALUES[^\n]*\btoken\b/);
});

test("onay kararı yalnız bekleyen kaydı atomik değiştirir", () => {
  assert.match(decisionRoute, /WHERE public_id=\? AND status='waiting_for_review'/);
  assert.match(decisionRoute, /changes/);
  assert.match(decisionRoute, /revision_requested/);
});

test("görsel ve kayıt aynı süreli token kapısından geçer", () => {
  assert.match(decisionRoute, /approvalByToken/);
  assert.match(imageRoute, /approvalByToken/);
  assert.match(helper, /expires_at/);
});

test("müşteri sayfası noindex ve no-referrer kalır", () => {
  assert.match(page, /index: false/);
  assert.match(page, /referrer: "no-referrer"/);
  assert.match(helper, /no-store/);
});

test("oluşturma API'si gizli yönetici anahtarı ve dosya sınırı ister", () => {
  assert.match(createRoute, /SERHAT_APPROVAL_ADMIN_SECRET/);
  assert.match(createRoute, /9_000_000/);
  assert.match(createRoute, /8_000_000/);
  assert.match(createRoute, /media.delete/);
  assert.match(createRoute, /verifiedImageType/);
  assert.match(createRoute, /image_sha256/);
  assert.match(createRoute, /await sha256\(authorization\)/);
});

test("başarısız token denemeleri sınırlanır ve bilinmeyen kimlik zamanlaması dengelenir", () => {
  assert.match(helper, /approvalAttemptAllowed/);
  assert.match(helper, /recordApprovalFailure/);
  assert.match(helper, /"0"\.repeat\(64\)/);
  assert.match(helper, /clearApprovalFailures/);
  assert.match(decisionRoute, /Çok fazla başarısız deneme/);
  assert.match(imageRoute, /status: 429/);
});

test("karar gövdesi küçük tutulur ve onay görseli karar sonrası kapanır", () => {
  assert.match(decisionRoute, /16_000/);
  assert.match(imageRoute, /status !== "waiting_for_review"/);
  assert.match(imageRoute, /status: 410/);
});

test("Meta için görsel yalnız onaylı kayıt ve kısa süreli HMAC ile açılır", () => {
  assert.match(createRoute, /SERHAT_MEDIA_SIGNING_SECRET/);
  assert.match(createRoute, /hmacSha256/);
  assert.match(createRoute, /contentHash: row\.content_hash/);
  assert.match(publishImageRoute, /row\.status !== "approved"/);
  assert.match(publishImageRoute, /expires > now \+ 60 \* 60/);
  assert.match(publishImageRoute, /safeEqual\(expected, signature\)/);
  assert.match(publishImageRoute, /privateHeaders/);
});
