"use client";

import { useMemo, useState } from "react";

type NeedId = "visibility" | "follow" | "automation" | "website" | "reactivation";
type PlanId = "baslangic" | "buyume" | "ozel";
type Step = 0 | 1 | 2 | 3 | 4;

type Service = {
  title: string;
  promise: string;
  demo: string[];
  measure: string;
};

const needs: Array<{ id: NeedId; label: string; help: string; symptom: string }> = [
  { id: "visibility", label: "Yeni müşteri bulmak", help: "Görünürlük, rakipler ve fırsatlar", symptom: "Yeterince yeni müşteri bulamıyoruz" },
  { id: "follow", label: "Müşteri takibini düzenlemek", help: "Talepler, dönüşler ve hatırlatmalar", symptom: "Taleplere geç dönüyor veya takibi unutuyoruz" },
  { id: "automation", label: "Tekrarlanan işleri azaltmak", help: "Uygun işleri otomatikleştirme", symptom: "Aynı işleri tekrar tekrar yapmak zaman alıyor" },
  { id: "website", label: "Web sitesini geliştirmek", help: "Daha anlaşılır ve güven veren site", symptom: "Web sitemiz hizmetimizi iyi anlatmıyor" },
  { id: "reactivation", label: "Eski müşterileri geri kazanmak", help: "İzinli listeyi yeniden değerlendirme", symptom: "Eski müşterilerimizle bağımız kopuyor" },
];

const sectorPriorities: Array<{ test: RegExp; ids: NeedId[] }> = [
  { test: /diş|klinik|sağlık|doktor/i, ids: ["follow", "reactivation", "visibility"] },
  { test: /emlak|gayrimenkul|konut/i, ids: ["follow", "visibility", "automation"] },
  { test: /restoran|kafe|lokanta|yeme/i, ids: ["follow", "reactivation", "visibility"] },
];

const serviceMap: Record<NeedId, Service> = {
  visibility: {
    title: "Müşteri Fırsat Radarı",
    promise: "Bölgenizdeki görünür talebi ve rakip boşluklarını inceler.",
    demo: ["Yakındaki rakiplerin karşılaştırılması", "Kaçırılan görünürlük fırsatları", "Öncelikli müşteri kazanma planı"],
    measure: "Nitelikli talep ve görünürlük değişimi",
  },
  follow: {
    title: "Akıllı Müşteri Takibi",
    promise: "Yeni talepleri ve geri dönüşleri tek bir düzende toplar.",
    demo: ["Yeni talep kayıt ekranı", "Dönüş zamanı hatırlatması", "Cevaplandı / bekliyor görünümü"],
    measure: "Yanıt süresi ve unutulan talep sayısı",
  },
  automation: {
    title: "İş Akışı Otomasyonu",
    promise: "Zaman alan uygun rutinleri kontrollü bir akışa dönüştürür.",
    demo: ["Tekrarlanan iş haritası", "Onay gerektiren adımlar", "Hata ve yeniden deneme kaydı"],
    measure: "Kazanılan zaman ve tamamlanan görev",
  },
  website: {
    title: "Güven Veren Web Deneyimi",
    promise: "Ziyaretçinin hizmetinizi hızlıca anlayıp doğru adıma geçmesini sağlar.",
    demo: ["İlk ekran mesaj taslağı", "Hizmet ve güven bölümleri", "Ücretsiz inceleme akışı"],
    measure: "Form başlangıcı ve tamamlanma oranı",
  },
  reactivation: {
    title: "Eski Müşteri Canlandırma",
    promise: "Uygun izinli kayıtlar için kontrollü geri kazanım planı hazırlar.",
    demo: ["İzin ve veri kalite kontrolü", "Müşteri gruplarına ayırma", "Onaylı iletişim ve sonuç takibi"],
    measure: "Yanıt ve yeniden görüşme sayısı",
  },
};

const sectorOverrides: Array<{ test: RegExp; services: Partial<Record<NeedId, Partial<Service>>> }> = [
  {
    test: /diş|klinik|sağlık|doktor/i,
    services: {
      visibility: { title: "Klinik Fırsat Radarı", demo: ["Yakındaki kliniklerin görünürlük karşılaştırması", "Hizmet ve yorum boşlukları", "Öncelikli hasta kazanma planı"] },
      follow: { title: "Akıllı Randevu Takibi", demo: ["Yeni hasta talep ekranı", "Randevu onay ve hatırlatmaları", "İptal / yeniden planlama görünümü"], measure: "Yanıt süresi ve boş kalan randevu" },
      automation: { title: "Klinik İş Akışı Otomasyonu", demo: ["Randevu öncesi kontrol", "Onay gerektiren hasta iletişimi", "Hata ve yeniden deneme kaydı"] },
      reactivation: { title: "İzinli Eski Hasta Canlandırma", demo: ["İzin ve veri kalite kontrolü", "Uygun hasta grupları", "Onaylı iletişim ve randevu takibi"], measure: "Yanıt ve yeniden randevu sayısı" },
    },
  },
  {
    test: /emlak|gayrimenkul|konut/i,
    services: {
      visibility: { title: "Bölgesel Emlak Fırsat Radarı", demo: ["Bölgedeki rakip portföylerin karşılaştırılması", "Arama ve ilan görünürlüğü boşlukları", "Satıcı / alıcı kazanma planı"] },
      follow: { title: "Alıcı ve Satıcı Takibi", demo: ["Yeni talep kayıt ekranı", "Portföy eşleştirme hatırlatması", "Görüşme / bekliyor görünümü"], measure: "İlk yanıt süresi ve takip edilen talep" },
      automation: { title: "Portföy İş Akışı", demo: ["Yeni portföy bilgi kontrolü", "İlan hazırlık görevleri", "Onaylı müşteri bilgilendirmesi"] },
      reactivation: { title: "Eski Talep Canlandırma", demo: ["İzinli kayıt kontrolü", "Alıcı / satıcı ihtiyacına göre ayırma", "Onaylı yeniden iletişim"] },
    },
  },
  {
    test: /restoran|kafe|lokanta|yeme/i,
    services: {
      visibility: { title: "Yerel Restoran Fırsat Radarı", demo: ["Yakındaki işletme ve yorum karşılaştırması", "Menü / Haritalar görünürlüğü fırsatları", "Yoğun olmayan saatler için plan"] },
      follow: { title: "Rezervasyon ve Talep Takibi", demo: ["Rezervasyon kayıt ekranı", "Onay ve hatırlatma akışı", "İptal / bekleme listesi görünümü"], measure: "Yanıt süresi ve dolan masa" },
      automation: { title: "Sipariş ve Rezervasyon Akışı", demo: ["Tekrarlanan müşteri soruları", "Onaylı rezervasyon bilgilendirmesi", "Hata ve yoğunluk kaydı"] },
      reactivation: { title: "İzinli Misafir Canlandırma", demo: ["İzinli kayıt kontrolü", "Ziyaret tercihine göre gruplama", "Onaylı kampanya taslağı"] },
    },
  },
];

const plans: Array<{ id: PlanId; name: string; badge?: string; summary: string; items: string[] }> = [
  {
    id: "baslangic",
    name: "Başlangıç",
    summary: "Tek bir öncelikli sorunu çözmek isteyen işletmeler için.",
    items: ["1 çalışan hizmet akışı", "Basit sonuç ekranı", "7 günlük ücretsiz deneme"],
  },
  {
    id: "buyume",
    name: "Büyüme",
    badge: "En çok tercih edilen",
    summary: "Birbirine bağlı birkaç işi tek düzende toplamak için.",
    items: ["3 hizmet akışına kadar", "Ortak müşteri takip ekranı", "7 günlük ücretsiz deneme"],
  },
  {
    id: "ozel",
    name: "İşletmeye Özel",
    summary: "Birden fazla ekip veya özel bağlantı gereken işler için.",
    items: ["İhtiyaca özel kapsam", "Gerekli hesap bağlantıları", "7 günlük kontrollü deneme"],
  },
];

const trialDays = [
  ["1", "Kurulum ve güvenli test"],
  ["2–3", "Gerçek akışın kontrollü başlangıcı"],
  ["4–6", "İzleme ve iyileştirme"],
  ["7", "Sonuç raporu ve karar"],
];

export default function NeedFinder({ initialBusiness = "" }: { initialBusiness?: string }) {
  const [step, setStep] = useState<Step>(0);
  const [business, setBusiness] = useState("");
  const [sector, setSector] = useState(() => initialBusiness.trim());
  const [website, setWebsite] = useState("");
  const [selected, setSelected] = useState<NeedId[]>([]);
  const [plan, setPlan] = useState<PlanId>("buyume");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [websiteField, setWebsiteField] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [idempotencyKey] = useState(() => typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

  const services = useMemo(() => {
    const matched = sectorOverrides.find((profile) => profile.test.test(sector));
    return selected.map((need) => ({ ...serviceMap[need], ...(matched?.services[need] ?? {}) }));
  }, [selected, sector]);
  const matchedSectorPriority = useMemo(() => sectorPriorities.find((profile) => profile.test.test(sector)), [sector]);
  const priorityNeeds = matchedSectorPriority?.ids ?? ([] as NeedId[]);
  const selectedPlan = plans.find((item) => item.id === plan) ?? plans[1];

  function toggleNeed(id: NeedId) {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : items.length >= 3 ? items : [...items, id]);
  }

  function nextFromBusiness(event: React.FormEvent) {
    event.preventDefault();
    if (!business.trim() || !sector.trim()) return;
    setStep(2);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!contactName.trim() || !email.trim() || !consent) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json", "x-idempotency-key": idempotencyKey },
        body: JSON.stringify({
          business: business.trim(), sector: sector.trim(), website: website.trim(),
          needs: selected, plan, contactName: contactName.trim(), email: email.trim(),
          phone: phone.trim(), note: note.trim(), consent, marketingConsent, websiteField,
        }),
      });
      const result = await response.json() as { reference?: string; message?: string };
      if (!response.ok || !result.reference) throw new Error(result.message || "Talep kaydedilemedi.");
      setReference(result.reference);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Talep kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  }

  if (reference) {
    return (
      <div className="needAssistant intakeSuccess" role="status" aria-live="polite">
        <div className="successMark" aria-hidden="true">✓</div>
        <p className="intakeEyebrow">TALEBİNİZ GÜVENLE ALINDI</p>
        <h3>Ücretsiz incelemeniz sıraya alındı.</h3>
        <p>Referans numaranız: <strong>{reference}</strong></p>
        <div className="successNext">
          <span><b>1</b> Bilgiler kontrol edilir</span>
          <span><b>2</b> Size özel demo hazırlanır</span>
          <span><b>3</b> Onayınızla 7 günlük deneme kurulur</span>
        </div>
        <small>Otomatik ödeme yapılmaz. Hesap erişimi ve canlı iletişim sizin açık onayınız olmadan başlatılmaz.</small>
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className="needAssistant discoveryFlow">
        <div className="discoveryTop">
          <span className="botDot" aria-hidden="true">Aİ</span>
          <div><small>30 SANİYELİK HIZLI KEŞİF</small><h3>İhtiyacınızı birlikte bulalım.</h3><p>Teknik hizmet seçmeniz gerekmez. Yaşadığınız sorunu söyleyin; size uygun başlangıç fikirlerini gösterelim.</p></div>
        </div>

        <label className="discoverySector">Hangi sektörde hizmet veriyorsunuz?<input value={sector} onChange={(event) => setSector(event.target.value)} placeholder="Örn. diş kliniği, emlak, restoran…" maxLength={100} autoComplete="organization-title" /></label>

        <fieldset className="discoveryProblems">
          <legend>Size en yakın sorunları seçin <span>(en fazla 3)</span></legend>
          <div className="problemGrid">
            {needs.map((item) => {
              const recommended = Boolean(matchedSectorPriority && priorityNeeds.includes(item.id));
              const checked = selected.includes(item.id);
              return (
                <label className={checked ? "selected" : selected.length >= 3 ? "limitReached" : recommended ? "recommended" : ""} key={item.id}>
                  <input type="checkbox" checked={checked} disabled={!checked && selected.length >= 3} aria-describedby="discoveryLimit" onChange={() => toggleNeed(item.id)} />
                  <span aria-hidden="true">{checked ? "✓" : "+"}</span>
                  <strong>{item.symptom}</strong>
                  {recommended && <em>Sektörünüz için önerilen</em>}
                </label>
              );
            })}
          </div>
          <p className="selectionLimit" id="discoveryLimit">{selected.length >= 3 ? "3 seçim yaptınız. Başka birini seçmek için önce bir seçimi kaldırın." : `${selected.length}/3 seçim yaptınız.`}</p>
        </fieldset>

        {selected.length > 0 && (
          <section className="instantSuggestions" aria-label="Size uygun hizmet fikirleri">
            <div className="suggestionHeading"><small>SİZE UYGUN HİZMET FİKİRLERİ</small><strong role="status" aria-live="polite">{selected.length} başlangıç önerisi bulundu</strong></div>
            <div className="suggestionCards">
              {services.slice(0, 3).map((service) => <article key={service.title}><span>✓</span><div><strong>{service.title}</strong><p>{service.promise}</p><small>Ölçüm: {service.measure}</small></div></article>)}
            </div>
            <p className="suggestionNote">Bunlar ilk fikirlerdir. Ücretsiz incelemede işletmenize uygunluğu doğrulanır; istemediğiniz hiçbir hizmet kurulmaz.</p>
          </section>
        )}

        <div className="discoveryActions">
          <span>🔒 Şifre veya müşteri bilgisi istemiyoruz</span>
          <button className="primary finderButton" type="button" disabled={!sector.trim() || !selected.length} onClick={() => setStep(1)}>Bu önerilerle forma geç <b>→</b></button>
        </div>
      </div>
    );
  }

  return (
    <div className="needAssistant intakeFlow">
      <div className="intakeHeader">
        <div className="chatIntro">
          <span className="botDot" aria-hidden="true">Aİ</span>
          <div><strong>Ücretsiz işletme incelemesi</strong><p>Yaklaşık 2 dakika sürer. Teknik bilgi gerekmez.</p></div>
          <i>Güvenli ön başvuru</i>
        </div>
        <ol className="stepper" aria-label="Başvuru adımları">
          {["İşletme", "İhtiyaç", "Demo", "Başvuru"].map((label, index) => (
            <li key={label} className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""}>
              <span>{step > index + 1 ? "✓" : index + 1}</span><small>{label}</small>
            </li>
          ))}
        </ol>
      </div>

      {step === 1 && (
        <form className="intakeBody businessForm" onSubmit={nextFromBusiness}>
          <div className="stepTitle"><small>ADIM 1 / 4</small><h3>Önce işletmenizi tanıyalım.</h3><p>Yalnız doğru hizmeti önerebilmek için gerekli temel bilgileri soruyoruz.</p></div>
          <p className="formRequired">* Zorunlu alan</p>
          <div className="fieldPair">
            <label>İşletmenizin adı *<input value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="Örn. Gülüş Diş Kliniği" maxLength={120} autoComplete="organization" required /></label>
            <label>Sektörünüz *<input value={sector} onChange={(event) => setSector(event.target.value)} placeholder="Örn. diş kliniği" maxLength={100} autoComplete="organization-title" required /></label>
          </div>
          <label>Web sitesi veya Google Haritalar bağlantısı <span>(isteğe bağlı)</span><input type="url" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://..." inputMode="url" maxLength={300} autoComplete="url" /></label>
          <div className="formTrust"><span>🔒 Şifre istemeyiz</span><span>✓ Otomatik ödeme yok</span><span>✓ Kontrol sizde</span></div>
          <div className="flowActions"><button className="secondary" type="button" onClick={() => setStep(0)}>← Önerilere dön</button><button className="primary finderButton" type="submit">İhtiyaçlarımı seç <span>→</span></button></div>
        </form>
      )}

      {step === 2 && (
        <div className="intakeBody">
          <div className="stepTitle"><small>ADIM 2 / 4</small><h3>Seçimlerinizi gözden geçirin.</h3><p>Hızlı keşifte seçtiklerinizi işaretledik. En fazla 3 ihtiyacı değiştirebilir veya onaylayabilirsiniz.</p></div>
          <div className="goalGrid clearGoals">
            {needs.map((item) => (
              <label className={selected.includes(item.id) ? "selected" : selected.length >= 3 ? "limitReached" : ""} key={item.id}>
                <input type="checkbox" checked={selected.includes(item.id)} disabled={!selected.includes(item.id) && selected.length >= 3} aria-describedby="formNeedLimit" onChange={() => toggleNeed(item.id)} />
                <strong>{item.label}</strong><small>{item.help}</small>{matchedSectorPriority && priorityNeeds.includes(item.id) && <em>Sektörünüze uygun olabilir</em>}
              </label>
            ))}
          </div>
          <p className="selectionLimit" id="formNeedLimit">{selected.length >= 3 ? "3 seçim yaptınız. Başka birini seçmek için önce bir seçimi kaldırın." : `${selected.length}/3 seçim yaptınız.`}</p>
          <div className="flowActions"><button className="secondary" type="button" onClick={() => setStep(1)}>← Geri</button><button className="primary finderButton" type="button" disabled={!selected.length} onClick={() => setStep(3)}>Bana uygun demoyu göster <span>→</span></button></div>
        </div>
      )}

      {step === 3 && (
        <div className="intakeBody">
          <div className="stepTitle"><small>ADIM 3 / 4 · KİŞİSELLEŞTİRİLMİŞ ÖN DEMO</small><h3>{business} için düşünülebilecek hizmetler</h3><p>Bu ekran bir ön taslaktır. Kesin kapsam, işletme incelemesi ve sizin onayınızla belirlenir.</p></div>
          <div className="serviceDemoList">
            {services.map((service, index) => (
              <article key={service.title}>
                <div className="demoNumber">0{index + 1}</div>
                <div><h4>{service.title}</h4><p>{service.promise}</p><ul>{service.demo.map((item) => <li key={item}>✓ {item}</li>)}</ul><small>Ölçüm: {service.measure}</small></div>
              </article>
            ))}
          </div>
          <section className="trialPreview" aria-label="7 günlük ücretsiz deneme planı">
            <div><span>7 GÜN ÜCRETSİZ</span><h4>Sistem çalışmadan süre başlamaz.</h4><p>Önce test ederiz; deneme yalnız çalışan bağlantılar doğrulandıktan sonra başlar.</p></div>
            <ol>{trialDays.map(([day, text]) => <li key={day}><b>{day}. gün</b><span>{text}</span></li>)}</ol>
          </section>
          <div className="flowActions"><button className="secondary" type="button" onClick={() => setStep(2)}>← Değiştir</button><button className="primary finderButton" type="button" onClick={() => setStep(4)}>Planları gör <span>→</span></button></div>
        </div>
      )}

      {step === 4 && (
        <form className="intakeBody" onSubmit={submit}>
          <div className="stepTitle"><small>ADIM 4 / 4</small><h3>Size uygun çalışma şeklini seçin.</h3><p>Bu seçim fiyat veya sözleşme değildir. İncelemede hangi kapsamın konuşulacağını belirler.</p></div>
          <p className="formRequired">* Zorunlu alan</p>
          <div className="planGrid">
            {plans.map((item) => (
              <label className={plan === item.id ? "selected" : ""} key={item.id}>
                <input type="radio" name="plan" value={item.id} checked={plan === item.id} onChange={() => setPlan(item.id)} />
                {item.badge && <em>{item.badge}</em>}<strong>{item.name}</strong><p>{item.summary}</p><ul>{item.items.map((line) => <li key={line}>✓ {line}</li>)}</ul>
              </label>
            ))}
          </div>
          <div className="contactFields">
            <label>Adınız *<input value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Ad soyad" maxLength={120} autoComplete="name" required /></label>
            <label>E-posta adresiniz *<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ornek@firma.com" maxLength={180} autoComplete="email" required /></label>
            <label>Telefon <span>(isteğe bağlı)</span><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="05xx..." inputMode="tel" maxLength={40} autoComplete="tel" /></label>
            <label className="wideField">Eklemek istediğiniz not <span>(isteğe bağlı)</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Önceliğiniz veya yaşadığınız sorun..." rows={3} maxLength={1000} /><small>Hasta adı, telefon numarası, teşhis, tedavi veya başka bir kişiye ait özel bilgi yazmayın.</small></label>
            <label className="websiteTrap" aria-hidden="true">Web<input value={websiteField} onChange={(event) => setWebsiteField(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
          </div>
          <label className="consentCheck"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>Ücretsiz inceleme talebim için bilgilerimin nasıl kullanılacağını açıklayan <a href="/gizlilik" target="_blank" rel="noopener noreferrer">Aydınlatma metnini</a> okudum. *</span></label>
          <label className="consentCheck optionalConsent"><input type="checkbox" checked={marketingConsent} onChange={(event) => setMarketingConsent(event.target.checked)} /><span>İleride sunulabilecek hizmet ve yenilikler hakkında bilgilendirme almak istiyorum. <b>(İsteğe bağlı)</b></span></label>
          <div className="selectionSummary"><span>Seçilen plan</span><strong>{selectedPlan.name}</strong><small>7 günlük ücretsiz deneme · otomatik ödeme yok</small></div>
          {error && <p className="formError" role="alert">{error}</p>}
          <div className="flowActions"><button className="secondary" type="button" onClick={() => setStep(3)}>← Geri</button><button className="primary finderButton" type="submit" disabled={sending || !consent}>{sending ? "Güvenle kaydediliyor…" : "Ücretsiz incelemeyi gönder"} <span>→</span></button></div>
        </form>
      )}
    </div>
  );
}
