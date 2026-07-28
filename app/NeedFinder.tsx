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
    text: "10 günlük denemede müşteri kaybettiğiniz noktaları bulur, ihtiyacınıza uygun görünürlük ve müşteri kazanma çalışmalarını birlikte yürütürüz.",
    items: ["Dijital durum ve rakip analizi", "Müşteri kazanma fırsatları", "İhtiyaca göre 10 günlük uygulama"],
  },
  follow: {
    name: "Müşteri Takip Paketi",
    text: "10 günlük denemede gelen talepleri, geri dönüşleri ve müşteri takibini işletmenizin ihtiyacına göre düzenler ve çalıştırırız.",
    items: ["Talep akışı analizi", "CRM ve takip düzeni", "Canlı kullanım, iyileştirme ve sonuç raporu"],
  },
  time: {
    name: "Özel Otomasyon Paketi",
    text: "Ekibinizin tekrar eden işlerini belirler, 10 gün içinde uygulanabilecek yararlı otomasyonları ihtiyacınıza göre kurup gerçek ortamda deneriz.",
    items: ["İş akışı haritası", "Uygun otomasyonların kurulumu", "Test, ölçüm ve kullanım eğitimi"],
  },
  unknown: {
    name: "Ücretsiz İhtiyaç Analizi",
    text: "Kısa bir görüşmeyle mevcut düzeninizi inceler, 10 günlük denemede size gerçekten fayda sağlayacak hizmet kapsamını birlikte belirleriz.",
    items: ["Kısa ihtiyaç görüşmesi", "Fayda ve öncelik tespiti", "Size özel deneme kapsamı"],
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
