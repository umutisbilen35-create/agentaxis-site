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
  assert.match(gallery, /showPreviewBadge=\{showPreviewBadge\}/);
  assert.match(gallery, /showPreviewBadge && <span>CANLI SİTEYE UYGULANMADI<\/span>/);
  assert.match(home, /previewFlow fullPreview showPreviewBadge=\{false\}/);
});

test("canlı marka, modal erişilebilirliği ve paket sınırları doğrulanır", () => {
  const gallery = fs.readFileSync(new URL("../app/taslaklar/DraftGallery.tsx", import.meta.url), "utf8");
  const particles = fs.readFileSync(new URL("../app/taslaklar/ParticleCanvas.tsx", import.meta.url), "utf8");
  const moduleCss = fs.readFileSync(new URL("../app/taslaklar/taslaklar.module.css", import.meta.url), "utf8");
  assert.match(particles, /\["#d8bf8d", "#b99a61", "#f7f4ed"\]/);
  assert.doesNotMatch(particles, /#3566f5|#7d70ff|#ff805c/);
  assert.match(moduleCss, /\.fullPreviewRoot \.livePill>i\{background:var\(--preview-gold\)/);
  assert.match(moduleCss, /\.fullPreviewRoot \.livePill>b\{[^}]*background:rgba\(216,191,141,\.12\)[^}]*color:var\(--preview-gold\)/);
  assert.match(moduleCss, /\.fullPreviewRoot \.valuePanelTop>span>i\{background:#d8bf8d/);
  assert.match(moduleCss, /\.fullPreviewRoot \.valuePanelTrust span\{[^}]*background:#f2eee6[^}]*color:#332b20/);
  assert.match(gallery, /tabIndex=\{-1\}/);
  assert.match(gallery, /child\.inert = Boolean\(livePanel\)/);
  assert.match(gallery, /event\.key !== "Tab"/);
  assert.match(gallery, /const focusables = Array\.from\(modal\.querySelectorAll<HTMLElement>\(focusableSelector\)\)/);
  assert.doesNotMatch(gallery, /Referans Pilotu/);
  assert.match(gallery, /catalogTier}>BAŞLANGIÇ<\/strong>/);
  assert.match(gallery, /catalogSubtitle}>Randevu Takibi<\/h3>/);
  assert.match(gallery, /7\.500 TL/);
  assert.match(gallery, /4\.000 TL/);
  assert.match(gallery, /Aylık kontrol, destek ve kısa sonuç raporu/);
  assert.match(gallery, /catalogTier}>GELİŞMİŞ<\/strong>/);
  assert.match(gallery, /catalogSubtitle}>Randevu ve Müşteri Takibi<\/h3>/);
  assert.match(gallery, /12\.000 TL/);
  assert.match(gallery, /7\.000 TL/);
  assert.equal((gallery.match(/tek seferlik ücret/g) || []).length, 2);
  assert.match(moduleCss, /\.catalogGrid \.catalogSubtitle\{[^}]*font-size:22px;[^}]*font-weight:700/);
  assert.match(gallery, /Başlangıç paketindeki tüm hizmetler/);
  assert.match(gallery, /Yeni müşteri taleplerini tek yerde takip etme/);
  assert.match(gallery, /Yanıtsız kalan talepleri yeniden takip etme/);
  assert.match(gallery, /Yalnız izin veren eski müşterilerle yeniden iletişim/);
  assert.match(gallery, /Aylık kontrol, hata düzeltme, destek ve ayrıntılı sonuç raporu/);
  assert.match(gallery, /İhtiyaca göre küçük iyileştirmeler/);
  assert.doesNotMatch(gallery, /birbirine bağlı 2-3 çalışma akışı/i);
  assert.match(gallery, /Tek işletme adresi ve tek WhatsApp numarası için geçerlidir/);
  assert.match(gallery, /WhatsApp mesajları, kullanılan ek hizmetler ve vergiler teklifte ayrı gösterilir/);
});
