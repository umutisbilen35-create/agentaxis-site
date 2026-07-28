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
    text: "Dijital görünürlüğünüzü, rakiplerinizi ve müşteri kaybettiğiniz noktaları analiz eder; uygulanabilir bir başlangıç planı hazırlarız.",
    items: ["Dijital durum analizi", "Rakip karşılaştırması", "30 günlük öncelik planı"],
  },
  follow: {
    name: "Müşteri Takip Paketi",
    text: "Gelen taleplerin düzenli kaydedildiği, unutulmadığı ve doğru zamanda takip edildiği onaylı bir sistem kurarız.",
    items: ["Talep akışı analizi", "CRM ve takip düzeni", "Onaylı mesaj taslakları"],
  },
  time: {
    name: "Özel Otomasyon Paketi",
    text: "Ekibinizin her gün tekrar ettiği işleri belirler, en çok zaman kazandıracak süreci güvenli biçimde otomatikleştiririz.",
    items: ["İş akışı haritası", "Tek otomasyon pilotu", "Test ve kullanım eğitimi"],
  },
  unknown: {
    name: "Ücretsiz İhtiyaç Analizi",
    text: "Kısa bir görüşmeyle mevcut düzeninizi inceler, önce hangi sorunun çözülmesinin en çok fayda sağlayacağını birlikte belirleriz.",
    items: ["Kısa ihtiyaç görüşmesi", "Öncelik tespiti", "Size uygun paket önerisi"],
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
          <em>Bu yalnızca ilk öneridir; kısa görüşmeden sonra ihtiyaçlarınıza göre kapsam netleştirilir.</em>
        </div>
      )}
    </div>
  );
}
