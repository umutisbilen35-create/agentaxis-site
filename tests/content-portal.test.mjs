import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const portalHelper = fs.readFileSync(new URL("../lib/contentPortal.ts", import.meta.url), "utf8");
const portalRoute = fs.readFileSync(new URL("../app/api/content-portal/[client]/route.ts", import.meta.url), "utf8");
const portalPage = fs.readFileSync(new URL("../app/icerik/[client]/ContentPortal.tsx", import.meta.url), "utf8");
const clientRoute = fs.readFileSync(new URL("../app/api/content-clients/route.ts", import.meta.url), "utf8");
const notificationRoute = fs.readFileSync(new URL("../app/api/content-notifications/route.ts", import.meta.url), "utf8");
const approvalRoute = fs.readFileSync(new URL("../app/api/content-approvals/route.ts", import.meta.url), "utf8");

test("müşteri panel tokenı ham halde veritabanına yazılmaz", () => {
  assert.match(clientRoute, /portal_token_hash/);
  assert.match(clientRoute, /await sha256\(token\)/);
  assert.match(portalHelper, /safeEqual/);
});

test("panel hem güçlü sağlık sigortası önerileri hem özel müşteri isteği sunar", () => {
  assert.match(portalHelper, /Tamamlayıcı Sağlık Sigortası/);
  assert.match(portalHelper, /Özel Sağlık Sigortası/);
  assert.match(portalHelper, /hook:/);
  assert.match(portalPage, /Akıllı içerik önerileri/);
  assert.match(portalPage, /Benim özel paylaşım isteğim/);
  assert.match(portalRoute, /system_suggestion/);
  assert.match(portalRoute, /client_custom/);
});

test("panel kararı müşteri ve bekleyen durumla atomik sınırlar", () => {
  assert.match(portalRoute, /public_id=\? AND client_key=\? AND status='waiting_for_review'/);
  assert.match(portalRoute, /changes/);
  assert.match(portalPage, /Onayınız olmadan Instagram’da paylaşılmaz/);
});

test("e-posta bildirimi yalnız izinli müşteri için kuyruğa alınır", () => {
  assert.match(approvalRoute, /email_opt_in_at IS NOT NULL/);
  assert.match(approvalRoute, /email_content_ready/);
  assert.match(approvalRoute, /content_notifications/);
  assert.match(notificationRoute, /SERHAT_APPROVAL_ADMIN_SECRET/);
  assert.match(notificationRoute, /status IN \('pending','retry'\)/);
  assert.match(notificationRoute, /c\.email_opt_in_at/);
  assert.match(approvalRoute, /let emailNotificationQueued = false/);
});

test("müşteri e-postası panel kurulduktan sonra güvenli yönetici isteğiyle eklenebilir", () => {
  assert.match(clientRoute, /export async function PATCH/);
  assert.match(clientRoute, /emailOptIn/);
  assert.match(clientRoute, /SERHAT_APPROVAL_ADMIN_SECRET/);
  assert.match(portalPage, /E-posta adresi müşteri geldiğinde eklenecek/);
});

test("panel noindex ve erişim deneme sınırı kullanır", () => {
  assert.match(portalHelper, /portalAttemptAllowed/);
  assert.match(portalHelper, /content_portal_attempts/);
  assert.match(fs.readFileSync(new URL("../app/icerik/[client]/page.tsx", import.meta.url), "utf8"), /index: false/);
});
