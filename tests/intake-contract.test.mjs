import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ücretsiz inceleme akışı müşteri için açık ve güvenlidir", async () => {
  const form = await readFile(new URL("app/NeedFinder.tsx", root), "utf8");
  assert.match(form, /7 GÜN ÜCRETSİZ/);
  assert.match(form, /Sistem çalışmadan süre başlamaz/);
  assert.match(form, /Başlangıç/);
  assert.match(form, /Büyüme/);
  assert.match(form, /İşletmeye Özel/);
  assert.match(form, /Akıllı Randevu Takibi/);
  assert.match(form, /Alıcı ve Satıcı Takibi/);
  assert.match(form, /Rezervasyon ve Talep Takibi/);
  assert.match(form, /Hasta adı, telefon numarası, teşhis, tedavi/);
  assert.match(form, /Aydınlatma metnini/);
  assert.match(form, /30 SANİYELİK HIZLI KEŞİF/);
  assert.match(form, /İhtiyacınızı birlikte bulalım/);
  assert.match(form, /SİZE UYGUN HİZMET FİKİRLERİ/);
  assert.match(form, /Bu önerilerle forma geç/);
  assert.match(form, /Sektörünüz için önerilen/);
  assert.match(form, /Seçimlerinizi gözden geçirin/);
  assert.match(form, /items\.length >= 3/);
  assert.match(form, /3 seçim yaptınız/);
  assert.match(form, /maxLength=\{1000\}/);
  assert.match(form, /rel="noopener noreferrer"/);
  assert.doesNotMatch(form, /\bJarvis\b/i);
});

test("başvuru kapısı dış eylem başlatmadan korumaları uygular", async () => {
  const route = await readFile(new URL("app/api/intake/route.ts", root), "utf8");
  assert.match(route, /websiteField/);
  assert.match(route, /content_hash/);
  assert.match(route, /idempotency_key/);
  assert.match(route, /cf-connecting-ip/);
  assert.match(route, /waiting_for_review/);
  assert.match(route, /starts_at, ends_at/);
  assert.match(route, /needs\.length > 3/);
  assert.match(route, /needs\.length !== submittedNeeds\.length/);
  assert.match(route, /await db\.batch\(\[intakeStatement, trialStatement\]\)/);
  assert.match(route, /SELECT id, 'waiting_for_review'/);
  assert.match(route, /\.toLowerCase\(\)/);
  assert.doesNotMatch(route, /toLocaleLowerCase/);
  assert.doesNotMatch(route, /const intakeId = Number/);
  assert.doesNotMatch(route, /sendMail|sendMessage|payment|charge/i);
});
