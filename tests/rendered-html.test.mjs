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
  assert.match(html, /İşletmenizi büyüten dijital sistemi/);
  assert.match(html, /Uygulama sizin bilginiz ve kontrolünüz altında ilerler/);
  assert.match(html, /Ücretsiz ön inceleme iste/);
  assert.match(html, /Önemli işlemler sizin onayınızda/);
  assert.match(html, /Müşteri kazanma/);
  assert.match(html, /Eski müşterileri kazanma/);
  assert.match(html, /Güven sözümüz/);
  assert.match(html, /Sektörünüzü söyleyin, size nasıl yardımcı olabileceğimizi gösterelim/);
  assert.match(html, /Hangi sektörde hizmet veriyorsunuz/);
  assert.match(html, /Önemli işleri siz onaylarsınız/);
  assert.match(html, /Yapılan işi açıkça görürsünüz/);
  assert.match(html, /Jarvis — Dijital İş Asistanınız/);
  assert.match(html, /İşletmenizi anlatın, uygun başlangıcı/);
  assert.match(html, /10 günlük ücretsiz Jarvis denemesi/);
  assert.match(html, /işletmenizin dijital iş asistanıdır/i);
  assert.match(html, /Neden AgentAxis ve Jarvis’e güvenebilirim/);
  assert.doesNotMatch(html, /pilot|kesin sonuç sözü|sonuç garantisi/i);
  assert.match(html, /Web sitesi veya Google Haritalar bağlantısı/);
  assert.match(html, /Şeffaf çalışma kanıtı/);
  assert.match(html, /Örnek analizleri gerçek müşteri sonucu gibi sunmayız/);
  assert.doesNotMatch(html, /Henüz büyük sonuçlar uydurmuyoruz|büyük sonuçlar uydurmuyoruz/i);
  assert.match(html, /href="\/gizlilik"/);
  assert.match(html, /href="\/kullanim-kosullari"/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("ana donusum ve guvenlik unsurlari korunur", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /role="tab"/);
  assert.doesNotMatch(html, /href="#(?:hizmetler|surec|kanit|iletisim)"/);
  assert.match(html, /Şeffaf çalışma kanıtı/);
  assert.match(html, /Otomatik ödeme yok/);
  assert.match(html, /Müşteri takibi/);
  assert.match(html, /İş otomasyonu/);
  assert.match(html, /Web sitesi/);
  assert.match(html, /mailto:umutisbilen35@gmail.com/);
  assert.match(html, /Yaptığımız işi açık ve doğrulanabilir biçimde gösteriyoruz/);
  assert.doesNotMatch(html, /<strong>3<\/strong>|<strong>0<\/strong>/);
});
