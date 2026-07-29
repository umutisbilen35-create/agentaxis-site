import assert from "node:assert/strict";
import test from "node:test";

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
  assert.match(html, /Kaçan müşterileri ve tekrar eden işleri/);
  assert.match(html, /müşteri takibi, iş otomasyonu veya web sitesi/);
  assert.match(html, /Ücretsiz ön inceleme iste/);
  assert.match(html, /Önemli işlemler sizin onayınızda/);
  assert.match(html, /Jarvis İşletme Yardımcısı/);
  assert.match(html, /İşletmenizi anlatın, uygun başlangıcı/);
  assert.match(html, /10 günlük ücretsiz pilot/);
  assert.match(html, /İhtiyaç uydurmam ve kesin sonuç sözü vermem/);
  assert.match(html, /Web sitesi veya Google Haritalar bağlantısı/);
  assert.match(html, /Şeffaf çalışma kanıtı/);
  assert.match(html, /Herkese açık verilerle hazırlanmış örnek işletme analizi/);
  assert.match(html, /Henüz büyük sonuçlar uydurmuyoruz/);
  assert.match(html, /Sık sorulanlar/);
  assert.match(html, /href="\/gizlilik"/);
  assert.match(html, /href="\/kullanim-kosullari"/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("ana donusum ve guvenlik unsurlari korunur", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /href="#iletisim"/);
  assert.match(html, /Şeffaf çalışma kanıtı/);
  assert.match(html, /Kesin müşteri veya gelir garantisi/);
  assert.match(html, /Müşteri takibi/);
  assert.match(html, /İş otomasyonu/);
  assert.match(html, /Web sitesi/);
  assert.match(html, /mailto:umutisbilen35@gmail.com/);
});
