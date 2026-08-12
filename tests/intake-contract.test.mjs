import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ücretsiz inceleme akışı müşteri için açık ve güvenlidir", async () => {
  const form = await readFile(new URL("app/NeedFinder.tsx", root), "utf8");
  assert.match(form, /60 SANİYELİK MİNİ TEŞHİS/);
  assert.match(form, /Önce problemi görünür yapalım/);
  assert.match(form, /Henüz hizmet veya paket önermiyoruz/);
  assert.match(form, /ÖNCE TEŞHİS/);
  assert.match(form, /Mini teşhis iste/);
  assert.match(form, /Akıllı Klinik Randevu Sistemi/);
  assert.match(form, /Alıcı ve Satıcı Takibi/);
  assert.match(form, /Akıllı Rezervasyon Sistemi/);
  assert.match(form, /Hasta adı, telefon numarası, teşhis, tedavi/);
  assert.match(form, /Aydınlatma metnini/);
  assert.match(form, /30 SANİYELİK HIZLI KEŞİF/);
  assert.match(form, /İhtiyacınızı birlikte bulalım/);
  assert.match(form, /SİZE UYGUN MİNİ TEŞHİSLER/);
  assert.match(form, /Bu teşhislerle forma geç/);
  assert.match(form, /Sektörünüz için önerilen/);
  assert.match(form, /Seçimlerinizi gözden geçirin/);
  assert.match(form, /İşletmenizde neyi geliştirmek istersiniz/);
  assert.match(form, /Randevu ve rezervasyonları otomatik yönetmek/);
  assert.match(form, /Gelen talepleri düzenli takip etmek/);
  assert.match(form, /Eski müşterileri yeniden kazanmak/);
  assert.match(form, /uygun olanların tamamını seçebilirsiniz/);
  assert.match(form, /selected\.map\(\(need\)/);
  assert.doesNotMatch(form, /items\.length >= 3|3 seçim yaptınız|en fazla 3/);
  assert.match(form, /maxLength=\{1000\}/);
  assert.match(form, /rel="noopener noreferrer"/);
  assert.match(form, /utm_source/);
  assert.match(form, /attribution/);
  assert.doesNotMatch(form, /\bJarvis\b/i);
});

test("başvuru kapısı dış eylem başlatmadan korumaları uygular", async () => {
  const route = await readFile(new URL("app/api/intake/route.ts", root), "utf8");
  assert.match(route, /websiteField/);
  assert.match(route, /content_hash/);
  assert.match(route, /idempotency_key/);
  assert.match(route, /cf-connecting-ip/);
  assert.match(route, /diagnosis_requested/);
  assert.match(route, /diagnosis_json/);
  assert.match(route, /solution_only_if_confirmed/);
  assert.match(route, /starts_at, ends_at/);
  assert.match(route, /new Set\(submittedNeeds/);
  assert.match(route, /"appointments"/);
  assert.match(route, /needs\.length > allowedNeeds\.size/);
  assert.match(route, /needs\.length !== submittedNeeds\.length/);
  assert.match(route, /await db\.batch\(\[intakeStatement, trialStatement\]\)/);
  assert.match(route, /concurrentExisting/);
  assert.match(route, /SELECT reference FROM lead_intakes WHERE idempotency_key = \?/);
  assert.doesNotMatch(route, /if \(trustedIp\) \{\s*const rate/);
  assert.match(route, /SELECT id, 'diagnosis_requested'/);
  assert.match(route, /utm_source, utm_medium, utm_campaign/);
  assert.match(route, /cleanAttribution/);
  assert.match(route, /sensitiveHealthPattern/);
  assert.match(route, /Not alanına hasta, sağlık veya başka kişiye ait iletişim bilgisi yazmayın/);
  assert.match(route, /idempotency:\$\{idempotencyKey\}/);
  assert.doesNotMatch(route, /ipHash = trustedIp \? .* : "not-available"/);
  assert.match(route, /\.toLowerCase\(\)/);
  assert.doesNotMatch(route, /toLocaleLowerCase/);
  assert.doesNotMatch(route, /const intakeId = Number/);
  assert.doesNotMatch(route, /sendMail|sendMessage|payment|charge/i);
});

test("aydınlatma metni IP özetini geri döndürülemez diye tanımlamaz", async () => {
  const privacy = await readFile(new URL("app/gizlilik/page.tsx", root), "utf8");
  assert.match(privacy, /doğrudan adres yerine kullanılan teknik özeti/);
  assert.match(privacy, /yalnız açık tercihinizden sonra çalışır/);
  assert.doesNotMatch(privacy, /geri döndürülemez özeti/);
});

test("GA4 yalnız geçerli kimlik ve açık izinle yüklenir", async () => {
  const component = await readFile(new URL("app/PrivacyAnalytics.tsx", root), "utf8");
  assert.match(component, /NEXT_PUBLIC_GA4_ID/);
  assert.match(component, /agentaxis_analytics_consent/);
  assert.match(component, /stored === "granted"/);
  assert.match(component, /anonymize_ip: true/);
});

test("eski lead bulunan D1 veritabanı güvenli biçimde yükseltilebilir", async () => {
  const migration = await readFile(new URL("drizzle/0002_bitter_the_anarchist.sql", root), "utf8");
  assert.match(migration, /content_hash` text NOT NULL DEFAULT ''/);
});
