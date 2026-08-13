import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const privateRoute = "doga-dent-corlu-195ad912147e82032b7237373d433874";
const component = fs.readFileSync(path.join(root, `app/inceleme/${privateRoute}/ClinicPackage.tsx`), "utf8");
const layout = fs.readFileSync(path.join(root, `app/inceleme/${privateRoute}/layout.tsx`), "utf8");
const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");

test("özel ilk temas demosu arama motorlarına kapalıdır", () => {
  assert.match(layout, /index:\s*false/);
  assert.match(layout, /follow:\s*false/);
  assert.match(layout, /noarchive:\s*true/);
});

test("ilk temas metni sorun varsaymaz ve fiyat göstermez", () => {
  assert.match(component, /Kamuya açık bilgilerinizden yola çıkarak/);
  assert.match(component, /kliniğinize özel kısa bir örnek hazırladık/);
  assert.match(component, /Bu bir sorun iddiası değildir/);
  assert.match(component, /Fiyat ve kapsam görüşmeden sonra hazırlanır/);
  assert.doesNotMatch(component, /5\.000 TL|3\.000 TL|Aylık yönetim|Harici gider/);
});

test("doğrulanmış analiz ve üç hizmet birlikte gösterilir", () => {
  assert.match(component, /4,9/);
  assert.match(component, /140/);
  assert.match(component, /Telefon · WhatsApp · e-posta · form/);
  assert.match(component, /Randevu iletişimi/);
  assert.match(component, /Hasta takibi/);
  assert.match(component, /Eski hastalarla yeniden iletişim/);
  assert.match(component, /AgentAxis Labs hizmetlerini inceleyin/);
  assert.match(component, /https:\/\/agentaxislabs\.com\/#hizmetler/);
});

test("demo ağ çağrısı yapmaz ve hasta kişisel verisi içermez", () => {
  assert.doesNotMatch(component, /fetch\s*\(|XMLHttpRequest|axios/);
  assert.doesNotMatch(component, /05\d{9}|\+90\s*5/);
  assert.match(component, /Gerçek hasta verisi yok/);
  assert.match(component, /dışarı mesaj göndermez/);
});

test("güvenlik sınırları ve müşteri adı doğrudur", () => {
  assert.match(component, /tıbbi karar vermez/);
  assert.match(component, /Bu bir sorun iddiası değildir/);
  assert.match(component, /Görüşme talebi henüz gönderilmedi/);
  assert.doesNotMatch(component, />Jarvis</);
});

test("60 saniyelik incelemeden sonra sayfa dikey kaydırılabilir", () => {
  assert.match(component, /document\.body\.style\.overflowY = "auto"/);
  assert.match(component, /document\.body\.style\.overflowY = previousOverflowY/);
});

test("özel bağlantı uzun ve sunucu korumaları eksiksizdir", () => {
  assert.match(privateRoute, /-[a-f0-9]{32}$/);
  assert.match(nextConfig, new RegExp(privateRoute));
  assert.match(nextConfig, /X-Robots-Tag/);
  assert.match(nextConfig, /noindex, nofollow, noarchive, nosnippet, noimageindex/);
  assert.match(nextConfig, /Referrer-Policy/);
  assert.match(nextConfig, /no-referrer/);
  assert.match(nextConfig, /Cache-Control/);
  assert.match(nextConfig, /private, no-store, max-age=0/);
});
