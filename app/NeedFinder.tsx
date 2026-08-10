"use client";

import { useMemo, useState } from "react";

type NeedId = "visibility" | "appointments" | "follow" | "automation" | "website" | "reactivation";
type PlanId = "teshis";
type Step = 0 | 1 | 2 | 3 | 4;

type Service = {
  title: string;
  promise: string;
  demo: string[];
  measure: string;
};

const needs: Array<{ id: NeedId; label: string; help: string; symptom: string }> = [
  { id: "visibility", label: "Daha fazla doğru müşteriye ulaşmak", help: "Görünürlük, rakipler ve yeni fırsatlar", symptom: "Daha fazla doğru müşteriye ulaşmak" },
  { id: "appointments", label: "Randevu ve rezervasyonları otomatik yönetmek", help: "Oluşturma, onay, hatırlatma ve yeniden planlama", symptom: "Randevu ve rezervasyonları otomatik yönetmek" },
  { id: "follow", label: "Gelen talepleri düzenli takip etmek", help: "Yeni talepler, geri dönüşler ve sonraki adımlar", symptom: "Gelen talepleri düzenli takip etmek" },
  { id: "automation", label: "Tekrarlanan işleri otomatikleştirmek", help: "Zaman alan uygun işleri kontrollü hızlandırmak", symptom: "Tekrarlanan işleri otomatikleştirmek" },
  { id: "reactivation", label: "Eski müşterileri yeniden kazanmak", help: "İzinli müşterileri uygun teklif ve hatırlatmalarla canlandırmak", symptom: "Eski müşterileri yeniden kazanmak" },
  { id: "website", label: "Web sitesini daha etkili hâle getirmek", help: "Hizmeti net anlatan ve iletişime yönlendiren site", symptom: "Web sitesini daha etkili hâle getirmek" },
];

const sectorPriorities: Array<{ test: RegExp; ids: NeedId[] }> = [
  { test: /diş|klinik|sağlık|doktor/i, ids: ["appointments", "follow", "reactivation", "visibility"] },
  { test: /emlak|gayrimenkul|konut/i, ids: ["follow", "visibility", "automation"] },
  { test: /restoran|kafe|lokanta|yeme/i, ids: ["appointments", "follow", "reactivation", "visibility"] },
];

const serviceMap: Record<NeedId, Service> = {
  visibility: {
    title: "Müşteri Fırsat Radarı",
    promise: "Bölgenizdeki görünür talebi ve rakip boşluklarını inceler.",
    demo: ["Yakındaki rakiplerin karşılaştırılması", "Kaçırılan görünürlük fırsatları", "Öncelikli müşteri kazanma planı"],
    measure: "Nitelikli talep ve görünürlük değişimi",
  },
  appointments: {
    title: "Akıllı Randevu ve Rezervasyon",
    promise: "Randevu talebini oluşturma, onay ve hatırlatma adımlarıyla düzenler.",
    demo: ["Randevu talep ekranı", "Onay ve hatırlatma akışı", "İptal / yeniden planlama görünümü"],
    measure: "Tamamlanan randevu ve unutulan takip sayısı",
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

const diagnosisMap: Record<NeedId, { title: string; checks: string[] }> = {
  visibility: { title: "AI ve yerel görünürlük mini teşhisi", checks: ["Gerçek müşteri arama senaryoları", "Markanın AI cevaplarında görünmesi", "Kaynak gösterimi ve yanlış bilgi"] },
  appointments: { title: "Randevu ve rezervasyon akışı mini teşhisi", checks: ["Talebin randevuya dönüşmesi", "Onay ve hatırlatma adımları", "İptal veya yeniden planlama akışı"] },
  follow: { title: "Müşteri talebi takip mini teşhisi", checks: ["İlk yanıt süresi", "Talebin net sonraki adıma taşınması", "Gerektiğinde insan devri"] },
  automation: { title: "Tekrarlanan iş mini teşhisi", checks: ["Elle tekrarlanan adımlar", "Onay ve hata noktaları", "Ölçülebilecek zaman kaybı"] },
  website: { title: "Web dönüşüm yolu mini teşhisi", checks: ["İlk ekranın açıklığı", "Ana iletişim düğmesi", "Mobil görünüm ve iletişim adımları"] },
  reactivation: { title: "Eski müşteri takibi mini teşhisi", checks: ["İzinli ve uygun kayıtlar", "Takipsiz kalan gruplar", "Yanıt sonrası net sonraki adım"] },
};

const sectorOverrides: Array<{ test: RegExp; services: Partial<Record<NeedId, Partial<Service>>> }> = [
  {
    test: /diş|klinik|sağlık|doktor/i,
    services: {
      visibility: { title: "Klinik Fırsat Radarı", demo: ["Yakındaki kliniklerin görünürlük karşılaştırması", "Hizmet ve yorum boşlukları", "Öncelikli hasta kazanma planı"] },
      appointments: { title: "Akıllı Klinik Randevu Sistemi", demo: ["Yeni randevu oluşturma", "Randevu onay ve hatırlatmaları", "İptal / yeniden planlama görünümü"], measure: "Tamamlanan ve boş kalan randevu" },
      follow: { title: "Yeni Hasta Talep Takibi", demo: ["Yeni hasta talep ekranı", "Geri dönüş hatırlatması", "Cevaplandı / bekliyor görünümü"], measure: "Yanıt süresi ve takip edilen talep" },
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
      appointments: { title: "Akıllı Rezervasyon Sistemi", demo: ["Rezervasyon oluşturma", "Onay ve hatırlatma akışı", "İptal / bekleme listesi görünümü"], measure: "Tamamlanan rezervasyon ve dolan masa" },
      follow: { title: "Misafir Talep Takibi", demo: ["Yeni talep ekranı", "Geri dönüş hatırlatması", "Cevaplandı / bekliyor görünümü"], measure: "Yanıt süresi ve takip edilen talep" },
      automation: { title: "Sipariş ve Rezervasyon Akışı", demo: ["Tekrarlanan müşteri soruları", "Onaylı rezervasyon bilgilendirmesi", "Hata ve yoğunluk kaydı"] },
      reactivation: { title: "İzinli Misafir Canlandırma", demo: ["İzinli kayıt kontrolü", "Ziyaret tercihine göre gruplama", "Onaylı kampanya taslağı"] },
    },
  },
];

export default function NeedFinder({ initialBusiness = "" }: { initialBusiness?: string }) {
  const [step, setStep] = useState<Step>(0);
  const [business, setBusiness] = useState("");
  const [sector, setSector] = useState(() => initialBusiness.trim());
  const [website, setWebsite] = useState("");
  const [selected, setSelected] = useState<NeedId[]>([]);
  const plan: PlanId = "teshis";
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

  const matchedSectorPriority = useMemo(() => sectorPriorities.find((profile) => profile.test.test(sector)), [sector]);
  const priorityNeeds = matchedSectorPriority?.ids ?? ([] as NeedId[]);

  function toggleNeed(id: NeedId) {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
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
        <h3>Ücretsiz mini teşhisiniz sıraya alındı.</h3>
        <p>Referans numaranız: <strong>{reference}</strong></p>
        <div className="successNext">
          <span><b>1</b> Bilgiler kontrol edilir</span>
          <span><b>2</b> 60 saniyelik mini teşhis hazırlanır</span>
          <span><b>3</b> Sorun görünürse uygun çözüm konuşulur</span>
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
          <div><small>30 SANİYELİK HIZLI KEŞİF</small><h3>İhtiyacınızı birlikte bulalım.</h3><p>Teknik hizmet seçmeniz gerekmez. Önce 60 SANİYELİK MİNİ TEŞHİS ile problemin gerçekten var olup olmadığını ölçelim.</p></div>
        </div>

        <label className="discoverySector">Hangi sektörde hizmet veriyorsunuz?<input value={sector} onChange={(event) => setSector(event.target.value)} placeholder="Örn. diş kliniği, emlak, restoran…" maxLength={100} autoComplete="organization-title" /></label>

        <fieldset className="discoveryProblems">
          <legend>İşletmenizde neyi geliştirmek istersiniz? <span>(uygun olanların tamamını seçebilirsiniz)</span></legend>
          <div className="problemGrid">
            {needs.map((item) => {
              const recommended = Boolean(matchedSectorPriority && priorityNeeds.includes(item.id));
              const checked = selected.includes(item.id);
              return (
                <label className={checked ? "selected" : recommended ? "recommended" : ""} key={item.id}>
                  <input type="checkbox" checked={checked} aria-describedby="discoveryLimit" onChange={() => toggleNeed(item.id)} />
                  <span aria-hidden="true">{checked ? "✓" : "+"}</span>
                  <strong>{item.symptom}</strong>
                  {recommended && <em>Sektörünüz için önerilen</em>}
                </label>
              );
            })}
          </div>
          <p className="selectionLimit" id="discoveryLimit">{selected.length ? `${selected.length} ihtiyaç seçtiniz. İsterseniz diğerlerini de seçebilirsiniz.` : "İşletmenize uyan bütün ihtiyaçları seçebilirsiniz."}</p>
        </fieldset>

        {selected.length > 0 && (
          <section className="instantSuggestions" aria-label="Size uygun hizmet fikirleri">
            <div className="suggestionHeading"><small>SİZE UYGUN MİNİ TEŞHİSLER</small><strong role="status" aria-live="polite">{selected.length} ölçüm başlığı bulundu</strong></div>
            <div className="suggestionCards">
              {selected.map((need) => { const diagnosis = diagnosisMap[need]; return <article key={diagnosis.title}><span>✓</span><div><strong>{diagnosis.title}</strong><p>Önce problemi ölçer, sonra sonucu birlikte değerlendiririz.</p><small>{diagnosis.checks.length} somut kontrol</small></div></article>; })}
            </div>
            <p className="suggestionNote">Bunlar yalnız teşhis başlıklarıdır. Problem ölçülmeden hizmet önerilmez; istemediğiniz hiçbir işlem yapılmaz.</p>
          </section>
        )}

        <div className="discoveryActions">
          <span>🔒 Şifre veya müşteri bilgisi istemiyoruz</span>
          <button className="primary finderButton" type="button" disabled={!sector.trim() || !selected.length} onClick={() => setStep(1)}>Bu teşhislerle forma geç <b>→</b></button>
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
          {["İşletme", "İhtiyaç", "Teşhis", "Başvuru"].map((label, index) => (
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
          <div className="stepTitle"><small>ADIM 2 / 4</small><h3>Seçimlerinizi gözden geçirin.</h3><p>Hızlı keşifte seçtiklerinizi işaretledik. Size uyan bütün ihtiyaçları ekleyebilir veya kaldırabilirsiniz.</p></div>
          <div className="goalGrid clearGoals">
            {needs.map((item) => (
              <label className={selected.includes(item.id) ? "selected" : ""} key={item.id}>
                <input type="checkbox" checked={selected.includes(item.id)} aria-describedby="formNeedLimit" onChange={() => toggleNeed(item.id)} />
                <strong>{item.label}</strong><small>{item.help}</small>{matchedSectorPriority && priorityNeeds.includes(item.id) && <em>Sektörünüze uygun olabilir</em>}
              </label>
            ))}
          </div>
          <p className="selectionLimit" id="formNeedLimit">{selected.length ? `${selected.length} ihtiyaç seçtiniz. İsterseniz diğerlerini de seçebilirsiniz.` : "Size uyan bütün ihtiyaçları seçebilirsiniz."}</p>
          <div className="flowActions"><button className="secondary" type="button" onClick={() => setStep(1)}>← Geri</button><button className="primary finderButton" type="button" disabled={!selected.length} onClick={() => setStep(3)}>Mini teşhisi göster <span>→</span></button></div>
        </div>
      )}

      {step === 3 && (
        <div className="intakeBody">
          <div className="stepTitle"><small>ADIM 3 / 4 · 60 SANİYELİK MİNİ TEŞHİS</small><h3>Önce problemi görünür yapalım.</h3><p>Henüz hizmet veya paket önermiyoruz. Seçtiğiniz konularda neyi ölçeceğimizi açıkça gösteriyoruz.</p></div>
          <div className="serviceDemoList">
            {selected.map((need, index) => {
              const diagnosis = diagnosisMap[need];
              return <article key={diagnosis.title}>
                <div className="demoNumber">0{index + 1}</div>
                <div><h4>{diagnosis.title}</h4><p>30–60 saniyelik kısa incelemede:</p><ul>{diagnosis.checks.map((item) => <li key={item}>✓ {item}</li>)}</ul><small>Ölçülmeyen problem gerçekmiş gibi sunulmaz.</small></div>
              </article>;
            })}
          </div>
          <section className="trialPreview diagnosisPromise" aria-label="Mini teşhis güvence bilgisi">
            <div><span>ÖNCE TEŞHİS</span><h4>Karar vermeniz gerekmez.</h4><p>Önce ölçümü paylaşırız. Yalnız gerçek bir sorun görünürse uygun çözümü ve 7 günlük ücretsiz denemeyi konuşuruz.</p></div>
            <ol><li><b>1</b><span>Kaynaklı gözlem</span></li><li><b>2</b><span>Ölçülebilir problem</span></li><li><b>3</b><span>Sizin kararınız</span></li></ol>
          </section>
          <div className="flowActions"><button className="secondary" type="button" onClick={() => setStep(2)}>← Değiştir</button><button className="primary finderButton" type="button" onClick={() => setStep(4)}>Mini teşhis iste <span>→</span></button></div>
        </div>
      )}

      {step === 4 && (
        <form className="intakeBody" onSubmit={submit}>
          <div className="stepTitle"><small>ADIM 4 / 4</small><h3>Mini teşhisi nereye gönderelim?</h3><p>Önce sonucu görürsünüz. Paket, fiyat veya kurulum kararı daha sonra ve yalnız sizin onayınızla konuşulur.</p></div>
          <p className="formRequired">* Zorunlu alan</p>
          <div className="contactFields">
            <label>Adınız *<input value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Ad soyad" maxLength={120} autoComplete="name" required /></label>
            <label>E-posta adresiniz *<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ornek@firma.com" maxLength={180} autoComplete="email" required /></label>
            <label>Telefon <span>(isteğe bağlı)</span><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="05xx..." inputMode="tel" maxLength={40} autoComplete="tel" /></label>
            <label className="wideField">Eklemek istediğiniz not <span>(isteğe bağlı)</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Önceliğiniz veya yaşadığınız sorun..." rows={3} maxLength={1000} /><small>Hasta adı, telefon numarası, teşhis, tedavi veya başka bir kişiye ait özel bilgi yazmayın.</small></label>
            <label className="websiteTrap" aria-hidden="true">Web<input value={websiteField} onChange={(event) => setWebsiteField(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
          </div>
          <label className="consentCheck"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>Ücretsiz mini teşhis talebim için bilgilerimin nasıl kullanılacağını açıklayan <a href="/gizlilik" target="_blank" rel="noopener noreferrer">Aydınlatma metnini</a> okudum. *</span></label>
          <label className="consentCheck optionalConsent"><input type="checkbox" checked={marketingConsent} onChange={(event) => setMarketingConsent(event.target.checked)} /><span>İleride sunulabilecek hizmet ve yenilikler hakkında bilgilendirme almak istiyorum. <b>(İsteğe bağlı)</b></span></label>
          <div className="selectionSummary"><span>İlk adım</span><strong>Ücretsiz mini teşhis</strong><small>Satış teklifi değil · otomatik ödeme yok</small></div>
          {error && <p className="formError" role="alert">{error}</p>}
          <div className="flowActions"><button className="secondary" type="button" onClick={() => setStep(3)}>← Geri</button><button className="primary finderButton" type="submit" disabled={sending || !consent}>{sending ? "Güvenle kaydediliyor…" : "Ücretsiz mini teşhisi gönder"} <span>→</span></button></div>
        </form>
      )}
    </div>
  );
}
