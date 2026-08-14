import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const privateRoute = "doga-dent-corlu-195ad912147e82032b7237373d433874";
const component = fs.readFileSync(path.join(root, `app/inceleme/${privateRoute}/ClinicPackage.tsx`), "utf8");
const data = fs.readFileSync(path.join(root, `app/inceleme/${privateRoute}/demoData.ts`), "utf8");
const layout = fs.readFileSync(path.join(root, `app/inceleme/${privateRoute}/layout.tsx`), "utf8");
const shared = fs.readFileSync(path.join(root, "app/inceleme/_shared/PremiumClinicDemo.tsx"), "utf8");
const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");

test("özel ilk temas demosu arama motorlarına kapalıdır", () => {
  assert.match(layout, /index:\s*false/);
  assert.match(layout, /follow:\s*false/);
  assert.match(layout, /noarchive:\s*true/);
});

test("ilk temas metni sorun varsaymaz ve fiyat göstermez", () => {
  assert.match(shared, /Kamuya açık bilgilerinizden yola çıkarak/);
  assert.match(shared, /kliniğinize özel kısa bir örnek hazırladık/);
  assert.match(shared, /Bu bir sorun iddiası değildir/);
  assert.match(shared, /Fiyat ve kapsam görüşmeden sonra hazırlanır/);
  assert.doesNotMatch(shared, /5\.000 TL|3\.000 TL|Aylık yönetim|Harici gider/);
});

test("doğrulanmış analiz ve üç hizmet birlikte gösterilir", () => {
  assert.match(data, /4,9/);
  assert.match(data, /140/);
  assert.match(data, /Telefon · WhatsApp · e-posta · form/);
  assert.match(data, /Randevu iletişimi/);
  assert.match(data, /Hasta takibi/);
  assert.match(data, /Eski hastalarla yeniden iletişim/);
  assert.match(shared, /AgentAxis Labs hizmetlerini inceleyin/);
  assert.match(shared, /https:\/\/agentaxislabs\.com\/#hizmetler/);
});

test("demo ağ çağrısı yapmaz ve hasta kişisel verisi içermez", () => {
  assert.doesNotMatch(shared, /fetch\s*\(|XMLHttpRequest|axios/);
  assert.doesNotMatch(data, /05\d{9}|\+90\s*5/);
  assert.match(shared, /Gerçek hasta verisi yok/);
  assert.match(shared, /dışarı mesaj göndermez/);
});

test("güvenlik sınırları ve müşteri adı doğrudur", () => {
  assert.match(shared, /tıbbi karar vermez/);
  assert.match(shared, /Bu bir sorun iddiası değildir/);
  assert.match(shared, /Görüşme talebi henüz gönderilmedi/);
  assert.doesNotMatch(shared, />Jarvis</);
});

test("60 saniyelik incelemeden sonra sayfa dikey kaydırılabilir", () => {
  assert.match(shared, /document\.body\.style\.overflowY = "auto"/);
  assert.match(shared, /document\.body\.style\.overflowY = previousOverflowY/);
});

test("özel bağlantı uzun ve sunucu korumaları eksiksizdir", () => {
  assert.match(privateRoute, /-[a-f0-9]{32}$/);
  assert.match(nextConfig, /source:\s*"\/inceleme\/:path\*"/);
  assert.match(nextConfig, /X-Robots-Tag/);
  assert.match(nextConfig, /noindex, nofollow, noarchive, nosnippet, noimageindex/);
  assert.match(nextConfig, /Referrer-Policy/);
  assert.match(nextConfig, /no-referrer/);
  assert.match(nextConfig, /Cache-Control/);
  assert.match(nextConfig, /private, no-store, max-age=0/);
});

test("canlı Doğa Dent sayfası aynı ortak premium tasarımı ve aynı veriyi kullanır", () => {
  assert.match(component, /PremiumClinicDemo/);
  assert.match(component, /demoData/);
  assert.match(data, /Doğa Dent Çorlu/);
  assert.match(data, /https:\/\/www\.dogadentcorlu\.com\/iletisim/);
});
