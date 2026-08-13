import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const component = fs.readFileSync(path.join(root, "app/inceleme/doga-dent-corlu/ClinicPackage.tsx"), "utf8");
const layout = fs.readFileSync(path.join(root, "app/inceleme/doga-dent-corlu/layout.tsx"), "utf8");

test("özel inceleme arama motorlarına kapalıdır", () => {
  assert.match(layout, /index:\s*false/);
  assert.match(layout, /follow:\s*false/);
  assert.match(layout, /noarchive:\s*true/);
});

test("kanıt, açık sorular ve sentetik demo net ayrılmıştır", () => {
  assert.match(component, /KAMUYA AÇIK KAYNAKLARDA GÖRÜLDÜ/);
  assert.match(component, /GÖRÜŞMEDE ÖLÇÜLECEK/);
  assert.match(component, /tek başına işletmede sorun olduğu anlamına gelmez/);
  assert.match(component, /SENTETİK · DIŞ MESAJ YOK/);
  assert.match(component, /Henüz gerçek klinik sonucu yok/);
});

test("demo ağ çağrısı yapmaz ve hasta kişisel verisi içermez", () => {
  assert.doesNotMatch(component, /fetch\s*\(/);
  assert.doesNotMatch(component, /XMLHttpRequest|axios/);
  assert.doesNotMatch(component, /05\d{9}|\+90\s*5/);
  assert.match(component, /A-104/);
});

test("üç doğrulama noktası ve dört güvenli demo senaryosu vardır", () => {
  assert.match(component, /ÜÇ DOĞRULAMA NOKTASI/);
  assert.equal((component.match(/title: "/g) ?? []).length, 7);
  assert.match(component, /Randevu teyidi/);
  assert.match(component, /Yanıt gelmedi/);
  assert.match(component, /İnsan desteği/);
  assert.match(component, /DUR isteği/);
});

test("fiyat üç satırdır ve bağlayıcı sonuç vaadi yoktur", () => {
  assert.match(component, /KURULUM/);
  assert.match(component, /AYLIK YÖNETİM/);
  assert.match(component, /HARİCİ GİDERLER/);
  assert.match(component, /5\.000 TL/);
  assert.match(component, /3\.000 TL \/ ay/);
  assert.doesNotMatch(component, /garanti ediyoruz|kesin kazanç|%\d+ azal/i);
  assert.match(component, /bağlayıcı teklif değildir/);
});

test("web sitesi hizmeti kapsam dışıdır ve Akıllı İşletme Asistanı adı kullanılır", () => {
  assert.match(component, /Web sitesi hizmeti bu kapsamda değildir/);
  assert.match(component, /Akıllı İşletme Asistanı/);
  assert.doesNotMatch(component, />Jarvis</);
});
