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
  assert.match(html, /Müşteriyi kaçırmayın/);
  assert.match(html, /Hangi sektörde olursanız olun/);
  assert.match(html, /İşletmemdeki fırsatları göster/);
  assert.match(html, /Her önemli adım sizin onayınızda/);
  assert.match(html, /Jarvis İşletme Danışmanı/);
  assert.match(html, /İşletmenize hazır bir paket dayatmıyoruz/);
  assert.match(html, /10<\/b><span>GÜNLÜK/);
  assert.match(html, /Bu deneme her işletmeye bir kez sunulur/);
  assert.match(html, /tek çözümlük kısıt değil/);
  assert.match(html, /İhtiyaç uydurmam ve kesin sonuç sözü vermem/);
  assert.match(html, /Web sitesi veya Google Haritalar bağlantısı/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("ana donusum ve guvenlik unsurlari korunur", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /href="#iletisim"/);
  assert.match(html, /Kanıta dayalı analiz/);
  assert.match(html, /Abartılı garanti yok/);
  assert.match(html, /Google Haritalar Dijital Durum Raporu/);
  assert.match(html, /mailto:umutisbilen35@gmail.com/);
});
