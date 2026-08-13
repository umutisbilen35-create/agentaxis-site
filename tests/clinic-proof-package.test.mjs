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
  assert.match(component, /KAMUYA AÇIK KAYNAKLARDA DOĞRULANDI/);
  assert.match(component, /KLİNİKLE GÖRÜŞMEDE DOĞRULANACAK/);
  assert.match(component, /Bunlar tespit edilmiş sorunlar değildir/);
  assert.match(component, /SENTETİK DEMO · DIŞ MESAJ GÖNDERMEZ/);
  assert.match(component, /Şu an gerçek klinik sonucu ölçülmedi/);
});

test("demo ağ çağrısı yapmaz ve hasta kişisel verisi içermez", () => {
  assert.doesNotMatch(component, /fetch\s*\(/);
  assert.doesNotMatch(component, /XMLHttpRequest|axios/);
  assert.doesNotMatch(component, /05\d{9}|\+90\s*5/);
  assert.match(component, /A-104/);
});

test("bağlayıcı fiyat ve kesin sonuç vaadi yoktur", () => {
  assert.doesNotMatch(component, /₺|\$\d|garanti ediyoruz|kesin kazanç/i);
  assert.match(component, /Teklif henüz kesinleşmedi/);
  assert.match(component, /bağlayıcı teklif değildir/);
});
