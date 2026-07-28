"use client";

import { useMemo, useState } from "react";

type NeedId = "visibility" | "follow" | "automation" | "reactivation";
type ChatItem = { role: "jarvis" | "user"; text: string };

const needs: Array<{ id: NeedId; label: string }> = [
  { id: "visibility", label: "Daha fazla müşteriye ulaşmak" },
  { id: "follow", label: "Talepleri ve geri dönüşleri düzenlemek" },
  { id: "automation", label: "Tekrarlanan işleri azaltmak" },
  { id: "reactivation", label: "Eski müşterileri yeniden kazanmak" },
];

const serviceMap: Record<NeedId, string[]> = {
  visibility: ["Dijital durum ve rakip analizi", "Müşteri kazanma fırsatları", "Yerel görünürlük önerileri"],
  follow: ["Talep ve geri dönüş düzeni", "Müşteri takip çalışma alanı", "Hatırlatma akışı"],
  automation: ["Tekrarlanan işlerin haritası", "Uygun otomasyonların hazırlanması", "10 günlük kullanım ve iyileştirme"],
  reactivation: ["Eski müşteri listesinin güvenli segmentasyonu", "İzin durumuna uygun geri kazanım planı", "Sonuç takibi"],
};

function jarvisReply(question: string) {
  const q = question.toLocaleLowerCase("tr-TR");
  if (/sms|whatsapp|mesaj/.test(q)) {
    return "SMS veya WhatsApp zorunlu değildir. İsterseniz kendi sağlayıcınızı bağlayabilirsiniz. Bağlantı öncesinde kapsam, maliyet ve izinler açıkça gösterilir; şifrenizi istemeyiz.";
  }
  if (/fiyat|ücret|para|paket/.test(q)) {
    return "10 günlük deneme ücretsizdir ve kendiliğinden ücretliye dönüşmez. Deneme sonunda yalnız kullandığınız hizmetlere göre açık bir aylık hizmet önerisi hazırlanır; kabul etmek zorunda değilsiniz.";
  }
  if (/güven|veri|şifre|kvkk|gizli/.test(q)) {
    return "Önce herkese açık veriler ve sizin paylaştığınız bilgiler kullanılır. Gerekli olmayan erişim istenmez; parola alınmaz. Kişisel veri içeren bir çalışma varsa izin ve saklama koşulları başlamadan önce netleştirilir.";
  }
  if (/ne yap|nasıl|otomasyon|hizmet/.test(q)) {
    return "Kesin öneri vermeden önce doğrulanmış işletme analizinizi ve sizin önceliklerinizi birlikte değerlendiririm. Gerçek ihtiyaç görmediğim bir hizmeti önermem; uygun olanları 10 günlük deneme kapsamına ekleriz.";
  }
  return "Bu konuda doğrulanmış işletme verisi olmadan kesin konuşmam doğru olmaz. Sorunuzu ön görüşme notuna ekleyebilirim; analiz tamamlandığında kanıta dayalı cevap ve uygun hizmet seçenekleri sunulur.";
}

export default function NeedFinder() {
  const [business, setBusiness] = useState("");
  const [website, setWebsite] = useState("");
  const [selected, setSelected] = useState<NeedId[]>([]);
  const [question, setQuestion] = useState("");
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [chat, setChat] = useState<ChatItem[]>([
    { role: "jarvis", text: "Merhaba, ben Jarvis. Önceden doğrulanmış bir analiz varsa onu; yoksa yalnız sizin verdiğiniz bilgileri temel alırım. İhtiyaç uydurmam ve kesin sonuç sözü vermem." },
  ]);

  const services = useMemo(
    () => Array.from(new Set(selected.flatMap((need) => serviceMap[need]))),
    [selected],
  );

  const mailHref = useMemo(() => {
    const subject = encodeURIComponent("AgentAxis Labs — 10 günlük deneme görüşmesi");
    const needsText = selected.map((id) => needs.find((item) => item.id === id)?.label).filter(Boolean).join(", ");
    const questions = chat.filter((item) => item.role === "user").map((item) => item.text).join(" | ");
    const body = encodeURIComponent(
      `İşletme: ${business}\nWeb sitesi/harita: ${website || "Belirtilmedi"}\nİlgilenilen alanlar: ${needsText || "Görüşmede belirlenecek"}\nSorular/notlar: ${questions || "Yok"}\n\n10 günlük ücretsiz deneme için doğrulanmış analiz ve görüşme rica ediyorum.`,
    );
    return `mailto:umutisbilen35@gmail.com?subject=${subject}&body=${body}`;
  }, [business, website, selected, chat]);

  function start(event: React.FormEvent) {
    event.preventDefault();
    if (!business.trim()) return;
    setStarted(true);
    setChat((items) => [
      ...items,
      { role: "user", text: `${business.trim()} için görüşmek istiyorum.${website.trim() ? ` Bağlantı: ${website.trim()}` : ""}` },
      { role: "jarvis", text: "Teşekkür ederim. Birden fazla alan seçebilirsiniz. Seçimleriniz yalnız ön görüşme içindir; gerçek öneri doğrulanmış analizden sonra netleşir." },
    ]);
  }

  function toggleNeed(id: NeedId) {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
    setReady(false);
  }

  function buildScope() {
    if (!selected.length) return;
    setReady(true);
    const labels = selected.map((id) => needs.find((item) => item.id === id)?.label).filter(Boolean).join(", ");
    setChat((items) => [...items, { role: "user", text: labels }, { role: "jarvis", text: "Bu alanları birlikte değerlendirebiliriz. Aşağıda bir ön kapsam oluşturdum; işletme analizi bir ihtiyacı doğrulamazsa o hizmet çıkarılır, gerçek bir ihtiyaç bulunursa eklenebilir." }]);
  }

  function ask(event: React.FormEvent) {
    event.preventDefault();
    const clean = question.trim();
    if (!clean) return;
    setChat((items) => [...items, { role: "user", text: clean }, { role: "jarvis", text: jarvisReply(clean) }]);
    setQuestion("");
  }

  return (
    <div className="needAssistant">
      <div className="chatIntro">
        <span className="botDot" aria-hidden="true">J</span>
        <div><strong>Jarvis İşletme Yardımcısı</strong><p>İşletmenizi anlatın; nereden başlayabileceğinizi birlikte bulalım.</p></div>
        <i>Çevrimiçi</i>
      </div>

      <div className="chatStream" aria-live="polite">
        {chat.map((item, index) => <p className={item.role} key={`${item.role}-${index}`}>{item.text}</p>)}
      </div>

      {!started ? (
        <form className="businessForm" onSubmit={start}>
          <label htmlFor="business">İşletmenizin adı veya ne iş yaptığınız</label>
          <input id="business" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Örn. ABC Özel Eğitim Kurumu" required />
          <label htmlFor="website">Web sitesi veya Google Haritalar bağlantısı <span>(isteğe bağlı)</span></label>
          <input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
          <button className="primary finderButton" type="submit">Görüşmeyi başlat <span>→</span></button>
        </form>
      ) : (
        <>
          <fieldset className="needChoices">
            <legend>En çok hangi konularda zorlanıyorsunuz?</legend>
            <div className="goalGrid">
              {needs.map((item) => (
                <label className={selected.includes(item.id) ? "selected" : ""} key={item.id}>
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleNeed(item.id)} />
                  {item.label}
                </label>
              ))}
            </div>
            <button className="primary finderButton" type="button" disabled={!selected.length} onClick={buildScope}>Bana uygun başlangıcı göster <span>→</span></button>
          </fieldset>

          <form className="askForm" onSubmit={ask}>
            <label htmlFor="question">Aklınıza takılan şeyi Jarvis’e sorun</label>
            <div><input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Örn. SMS kullanmak zorunda mıyım?" /><button type="submit" disabled={!question.trim()} aria-label="Soruyu gönder">↑</button></div>
          </form>
        </>
      )}

      {ready && (
        <div className="recommendation" aria-live="polite">
          <small>10 GÜNLÜK ÜCRETSİZ DENEME</small>
          <h3>{business} için düşünülebilecek başlangıç hizmetleri</h3>
          <ul>{services.map((item) => <li key={item}>✓ {item}</li>)}</ul>
          <p className="scopeRule">Bu liste kesin satış teklifi değildir. Jarvis önce gerçek analiz bulgularını sizin söylediklerinizle uzlaştırır; gereksiz hizmeti çıkarır, doğrulanan ihtiyaca uygun hizmeti ekler.</p>
          <a className="primary" href={mailHref}>Ücretsiz görüşme talebi gönder <span>→</span></a>
          <em>Deneme her işletmeye bir kez sunulur, otomatik ücretliye dönüşmez ve SMS tamamen isteğe bağlıdır.</em>
        </div>
      )}
    </div>
  );
}
