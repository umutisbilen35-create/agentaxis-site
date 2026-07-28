"use client";

import { useMemo, useState } from "react";

const goals = [
  { id: "customer", label: "Daha fazla müşteri kazanmak" },
  { id: "follow", label: "Talepleri ve geri dönüşleri kaçırmamak" },
  { id: "time", label: "Tekrarlanan işleri azaltmak" },
  { id: "unknown", label: "Neye ihtiyacım olduğunu bilmiyorum" },
];

const packages = {
  customer: {
    name: "Görünürlük Başlangıç Paketi",
    text: "10 günlük pilotta müşteri kaybettiğiniz noktayı bulur, görünürlüğünüz için çalışan bir başlangıç sistemi kurarız.",
    items: ["Dijital durum analizi", "Rakip karşılaştırması", "Tek gerçek süreçte 10 günlük pilot"],
  },
  follow: {
    name: "Müşteri Takip Paketi",
    text: "10 günlük pilotta gelen taleplerin kaydedildiği, unutulmadığı ve doğru zamanda takip edildiği çalışan bir düzen kurarız.",
    items: ["Talep akışı analizi", "CRM ve takip düzeni", "10 günlük canlı kullanım ve sonuç raporu"],
  },
  time: {
    name: "Özel Otomasyon Paketi",
    text: "Ekibinizin her gün tekrar ettiği işleri belirler, en çok zaman kazandıracak tek süreci 10 gün boyunca gerçek ortamda deneriz.",
    items: ["İş akışı haritası", "Tek çalışan otomasyon pilotu", "Test, ölçüm ve kullanım eğitimi"],
  },
  unknown: {
    name: "Ücretsiz İhtiyaç Analizi",
    text: "Kısa bir görüşmeyle mevcut düzeninizi inceler, 10 günlük pilotta hangi sorunun çözülmesinin en çok fayda sağlayacağını birlikte belirleriz.",
    items: ["Kısa ihtiyaç görüşmesi", "Öncelik tespiti", "Size uygun pilot önerisi"],
  },
};

export default function NeedFinder() {
  const [business, setBusiness] = useState("");
  const [goal, setGoal] = useState<keyof typeof packages | "">("");
  const [shown, setShown] = useState(false);
  const result = goal ? packages[goal] : null;
  const mailHref = useMemo(() => {
    const subject = encodeURIComponent("AgentAxis Labs ihtiyaç analizi");
    const body = encodeURIComponent(
      `Merhaba, işletme türüm: ${business || "Belirtilmedi"}. Önceliğim: ${goals.find((item) => item.id === goal)?.label || "Belirtilmedi"}. Kısa bir ihtiyaç analizi rica ediyorum.`,
    );
    return `mailto:umutisbilen35@gmail.com?subject=${subject}&body=${body}`;
  }, [business, goal]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (goal) setShown(true);
  }

  return (
    <div className="needAssistant">
      <div className="chatIntro">
        <span className="botDot" aria-hidden="true">A</span>
        <div>
          <strong>AgentAxis İhtiyaç Asistanı</strong>
          <p>Size neyin fayda sağlayacağını birlikte bulalım. İki kısa cevap yeterli.</p>
        </div>
      </div>

      <form onSubmit={submit}>
        <label htmlFor="business">İşletmeniz hangi alanda hizmet veriyor?</label>
        <input
          id="business"
          value={business}
          onChange={(event) => setBusiness(event.target.value)}
          placeholder="Örn. özel okul, market, danışmanlık..."
        />

        <fieldset>
          <legend>Şu anda en çok hangi konuda zorlanıyorsunuz?</legend>
          <div className="goalGrid">
            {goals.map((item) => (
              <label className={goal === item.id ? "selected" : ""} key={item.id}>
                <input
                  type="radio"
                  name="goal"
                  value={item.id}
                  checked={goal === item.id}
                  onChange={() => { setGoal(item.id as keyof typeof packages); setShown(false); }}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>
        <button className="primary finderButton" type="submit" disabled={!goal}>Bana uygun yolu göster <span>→</span></button>
      </form>

      {shown && result && (
        <div className="recommendation" aria-live="polite">
          <small>SİZE UYGUN BAŞLANGIÇ</small>
          <h3>{result.name}</h3>
          <p>{result.text}</p>
          <ul>{result.items.map((item) => <li key={item}>✓ {item}</li>)}</ul>
          <a className="primary" href={mailHref}>Ücretsiz görüşme iste <span>→</span></a>
          <em>Pilot otomatik olarak ücretliye dönüşmez. 10. günün sonunda sonuçlar birlikte değerlendirilir; devam kararı size aittir.</em>
        </div>
      )}
    </div>
  );
}
