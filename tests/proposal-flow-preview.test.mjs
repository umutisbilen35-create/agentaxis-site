import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync(new URL("../app/onizleme/ornek-akis/FlowPreview.tsx", import.meta.url), "utf8");
const layout = fs.readFileSync(new URL("../app/onizleme/ornek-akis/layout.tsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../app/onizleme/ornek-akis/preview.module.css", import.meta.url), "utf8");
const home = fs.readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

test("onaylanan tam sürüm canlı ana sayfada önizleme etiketi olmadan kullanılır", () => {
  assert.match(home, /<HybridDraft live lumen previewFlow fullPreview showPreviewBadge=\{false\} \/>/);
  assert.doesNotMatch(home, /FlowPreview/);
});

test("önizleme indekslenmez ve canlıya uygulanmadığını söyler", () => {
  assert.match(layout, /index: false/);
  assert.match(layout, /follow: false/);
  assert.match(layout, /noarchive: true/);
  assert.match(page, /CANLI SİTEYE UYGULANMADI/);
});

test("sentetik sınırlar ve canlı bağlantı ayrımı görünürdür", () => {
  for (const text of ["ÖRNEK \/ SENTETİK AKIŞ", "Gerçek müşteri veya hasta verisi kullanılmaz", "Canlı bağlantı gerekli", "Gerçek sonuç henüz yok", "hiçbir mesaj göndermez"]) {
    assert.match(page, new RegExp(text));
  }
});

test("dört adımlı tıklanabilir örnek formdan önce gelir", () => {
  assert.match(page, /Yeni talep/);
  assert.match(page, /İhtiyacı anla/);
  assert.match(page, /İnsan onayı/);
  assert.match(page, /Takip/);
  assert.ok(page.indexOf("demoShell") < page.indexOf("<NeedFinder"));
  assert.match(page, /aria-pressed/);
});

test("kanonik koyu-altın marka paleti ve mobil okunabilirlik korunur", () => {
  assert.match(css, /--gold:#d8bf8d/);
  assert.match(css, /--night:#03040a/);
  assert.doesNotMatch(css, /--blue:#275ff3/);
  assert.match(css, /var\(--font-geist-sans\)/);
  assert.match(css, /@media\(max-width:560px\)/);
  assert.match(css, /font-size:13px/);
  assert.match(css, /\.previewBadge[^}]*font-size:9px/);
});

test("tam site önizlemesi ve canlı ana sayfa aynı onaylanan sistemi doğru etiketle kullanır", () => {
  const fullPage = fs.readFileSync(new URL("../app/onizleme/tam-site/page.tsx", import.meta.url), "utf8");
  const fullLayout = fs.readFileSync(new URL("../app/onizleme/tam-site/layout.tsx", import.meta.url), "utf8");
  const gallery = fs.readFileSync(new URL("../app/taslaklar/DraftGallery.tsx", import.meta.url), "utf8");
  assert.match(fullPage, /HybridDraft live lumen previewFlow fullPreview/);
  assert.match(fullLayout, /index:\s*false/);
  assert.match(gallery, /FullSiteFlowDemo/);
  assert.match(gallery, /previewFlow\s*&&/);
  assert.match(home, /previewFlow fullPreview showPreviewBadge=\{false\}/);
});
