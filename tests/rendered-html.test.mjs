import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("AgentAxis ana sayfasi guclu giris metniyle sunulur", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>AgentAxis Labs \| İşletmeler için AI Sistemleri<\/title>/i);
  assert.match(html, /Müşteriyi kaçırmayın/);
  assert.match(html, /Takibi sisteme bırakın/);
  assert.match(html, /Gönderme ve hesap işlemleri sizin onayınızla ilerler/);
  assert.match(html, /Ücretsiz inceleme/);
  assert.doesNotMatch(html, /Önemli işlemler sizin onayınızda/);
  assert.match(html, /Müşteri kazanma/);
  assert.match(html, /Randevu ve rezervasyon/);
  assert.doesNotMatch(html, />Demolar</);
  assert.match(html, /Paketler/);
  assert.match(html, /İhtiyacınızı anlatın/);
  assert.match(html, /Önemli işler sizin onayınızda/);
  assert.match(html, /Akıllı İşletme Asistanı/);
  assert.match(html, /Randevu ve hasta takibini tek düzende görün/);
  assert.doesNotMatch(html, /7 gün ücretsiz deneyin/);
  assert.doesNotMatch(html, /10\s*\.? *gün/i);
  assert.match(html, /Ücretsiz incelemeyi başlat|Ücretsiz mini teşhis/);
  assert.doesNotMatch(html, /Jarvis/i);
  assert.doesNotMatch(html, /pilot|kesin sonuç sözü|sonuç garantisi/i);
  assert.doesNotMatch(html, /ŞEFFAF ÇALIŞMA KANITI/);
  assert.doesNotMatch(html, /Henüz büyük sonuçlar uydurmuyoruz|büyük sonuçlar uydurmuyoruz/i);
  assert.match(html, /href="\/gizlilik"/);
  assert.match(html, /href="\/kullanim-kosullari"/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("ana donusum ve guvenlik unsurlari korunur", async () => {
  const response = await render();
  const html = await response.text();
  assert.doesNotMatch(html, /role="tab"/);
  assert.doesNotMatch(html, /href="#(?:hizmetler|surec|kanit|iletisim)"/);
  assert.doesNotMatch(html, /ŞEFFAF ÇALIŞMA KANITI/);
  assert.doesNotMatch(html, /Otomatik ödeme yok/);
  assert.match(html, /Müşteri takibi/);
  assert.match(html, /İş otomasyonu/);
  assert.match(html, /Randevu yönetimi/);
  assert.match(html, /mailto:agentaxislabs@gmail.com/);
  assert.doesNotMatch(html, /Ne yapıldığını görür/);
  assert.doesNotMatch(html, /<strong>3<\/strong>|<strong>0<\/strong>/);
});

test("ucretsiz inceleme basligi SSS alaninin ustune yapismaz", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.match(css, /\.finderCopy\s*\{[^}]*position:static/);
  assert.doesNotMatch(css, /\.finderCopy\s*\{[^}]*position:sticky/);
});
