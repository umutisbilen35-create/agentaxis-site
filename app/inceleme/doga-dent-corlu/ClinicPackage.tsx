"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./package.module.css";

const officialContact = "https://www.dogadentcorlu.com/iletisim";
const mapsArchive = "Google Haritalar salt-okunur arşivi · 28.07.2026";

type ScenarioId = "confirm" | "silent" | "human" | "stop";

const scenarios: Array<{
  id: ScenarioId;
  code: string;
  title: string;
  summary: string;
}> = [
  { id: "confirm", code: "A-104", title: "Randevu teyidi", summary: "Taslak onay bekliyor" },
  { id: "silent", code: "A-118", title: "Yanıt gelmedi", summary: "Yeniden planlama önerisi" },
  { id: "human", code: "A-126", title: "İnsan desteği", summary: "Ekip devralmalı" },
  { id: "stop", code: "A-131", title: "DUR isteği", summary: "Akış hemen sessiz" },
];

const scenarioContent: Record<ScenarioId, {
  reason: string;
  control: string;
  message: string;
  outcome: string;
}> = {
  confirm: {
    reason: "Yarın planlı randevu için teyit alınmadı.",
    control: "Gönderimden önce ekip onayı gerekir.",
    message: "Merhaba, yarınki randevunuzu teyit etmek için yazıyoruz. Uygunluğunuzu paylaşabilir misiniz?",
    outcome: "Onay gelirse randevu durumu güncellenir; belirsiz yanıtta ekip devralır.",
  },
  silent: {
    reason: "İlk hatırlatmaya sentetik senaryoda yanıt gelmedi.",
    control: "İkinci temasın zamanı ve metni ekipçe onaylanır.",
    message: "Randevu saatiniz sizin için uygun değilse yeni bir zaman önerebiliriz. İsterseniz ekibimiz yardımcı olsun.",
    outcome: "Tekrar sayısı sınırlıdır; yanıt yoksa otomatik ısrar edilmez.",
  },
  human: {
    reason: "Mesaj, otomatik akışın karar sınırının dışında.",
    control: "Konuşma kilitlenir ve yalnız yetkili ekip üyesi devralır.",
    message: "Mesajınızı ekibimize aktarıyoruz. Size bir ekip üyemiz yardımcı olacak.",
    outcome: "Akıllı İşletme Asistanı tıbbi yorum yapmaz ve konuşmayı sürdürmez.",
  },
  stop: {
    reason: "Kişi iletişim almak istemediğini belirtti.",
    control: "DUR kaydı tüm otomatik takiplerden önce gelir.",
    message: "Talebiniz alındı. Bu numara için otomatik mesajlar durduruldu.",
    outcome: "İzin kapatılır; DEVAM onayı olmadan yeni otomatik mesaj hazırlanmaz.",
  },
};

const checkpoints = [
  { title: "Mevcut düzen", text: "Yeni randevu talebini bugün kimin ve nasıl devraldığını doğru anladık mı?" },
  { title: "Öncelik", text: "İlk küçük pilotun randevu teyidi ve yanıtsız kalan talepler olması doğru mu?" },
  { title: "Kontrol", text: "Dış mesaj ve hassas kararların ekip onayında kalması sizin için uygun mu?" },
];

export default function ClinicPackage() {
  const [scenario, setScenario] = useState<ScenarioId>("confirm");
  const [demoState, setDemoState] = useState<"idle" | "approved" | "cancelled">("idle");
  const [answers, setAnswers] = useState([false, false, false]);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);

  const selected = useMemo(() => scenarios.find((item) => item.id === scenario) ?? scenarios[0], [scenario]);
  const detail = scenarioContent[scenario];
  const proposalReady = answers.every(Boolean);

  useEffect(() => {
    if (!playing) return;
    if (step >= 3) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 850);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  function chooseScenario(id: ScenarioId) {
    setScenario(id);
    setDemoState("idle");
    setPlaying(false);
    setStep(0);
  }

  function playFlow() {
    setStep(0);
    setPlaying(true);
    setDemoState("idle");
  }

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href="#ust" aria-label="AgentAxis Labs inceleme başlangıcı">
          <i aria-hidden="true"><b /></i><span>AgentAxis <strong>Labs</strong></span>
        </a>
        <nav aria-label="Sayfa bölümleri">
          <a href="#inceleme">İnceleme</a><a href="#dogrulama">Doğrulama</a><a href="#demo">Demo</a><a href="#kapsam">Kapsam</a>
        </nav>
        <span className={styles.private}>PAYLAŞILMADI · SENTETİK</span>
      </header>

      <section className={styles.hero} id="ust">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>DOĞA DENT ÇORLU İÇİN ÇALIŞMA ÖNİZLEMESİ</span>
          <h1>Randevu iletişimini<br /><em>birlikte görünür</em> kılalım.</h1>
          <p>Bu bir sonuç vaadi değil. Kamuya açık bilgilerle başlayan mini incelemeyi, üç doğrulama sorusunu ve gerçek hasta verisi kullanmayan çalışan akış demosunu tek yerde topladık.</p>
          <div className={styles.heroActions}><a href="#demo">Örnek akışı deneyin</a><a href="#inceleme">Mini incelemeyi görün</a></div>
          <div className={styles.heroTrust}><span>Gerçek hasta verisi yok</span><span>Dışarı mesaj göndermez</span><span>Kontrol klinikte</span></div>
        </div>
        <div className={styles.orbit} aria-hidden="true"><div className={styles.orbitCore}>Ai</div><span /><span /><span /></div>
      </section>

      <section className={styles.section} id="inceleme">
        <div className={styles.sectionHead}><span>01 · KAYNAKLI MİNİ İNCELEME</span><h2>Bildiğimizi ve henüz bilmediğimizi ayırdık.</h2><p>Kamuya açık bir işaret, tek başına işletmede sorun olduğu anlamına gelmez. Bu nedenle kesin hüküm değil, görüşmede doğrulanacak küçük bir başlangıç hazırladık.</p></div>
        <div className={styles.twoCol}>
          <article className={styles.panel}>
            <div className={styles.panelLabel}>KAMUYA AÇIK KAYNAKLARDA GÖRÜLDÜ</div>
            <ul className={styles.checkList}>
              <li><b>İletişim kanalları görünür.</b><small>Telefon, GSM/WhatsApp, e-posta ve iletişim formu resmi sitede yer alıyor.</small></li>
              <li><b>Google Haritalar görünürlüğü güçlü.</b><small>Arşiv anında 4,9 puan ve taranmış 140 yorum görünüyordu.</small></li>
              <li><b>Yorumlarda güven dili öne çıkıyor.</b><small>Ham metin taramasında ilgi, güler yüz ve güven sık görülen olumlu başlıklardı.</small></li>
            </ul>
            <div className={styles.sources}><a href={officialContact} target="_blank" rel="noreferrer">Resmî iletişim sayfası ↗</a><span>{mapsArchive}</span></div>
          </article>
          <article className={`${styles.panel} ${styles.questionPanel}`}>
            <div className={styles.panelLabel}>GÖRÜŞMEDE ÖLÇÜLECEK</div>
            <div className={styles.metricList}>
              <div><span>01</span><p><b>İlk yanıt süresi</b><small>Başlangıç değeri klinikle doldurulacak.</small></p></div>
              <div><span>02</span><p><b>Randevu teyit oranı</b><small>Başlangıç değeri klinikle doldurulacak.</small></p></div>
              <div><span>03</span><p><b>Yanıtsız kalan talep</b><small>Başlangıç değeri klinikle doldurulacak.</small></p></div>
              <div><span>04</span><p><b>İnsan devri sayısı</b><small>Başlangıç değeri klinikle doldurulacak.</small></p></div>
            </div>
            <p className={styles.note}>Şu an gerçek klinik sonucu ölçülmedi. Aynı göstergeleri pilot öncesinde ve sonrasında karşılaştırmadan başarı iddiası yazılmayacak.</p>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.checkpointSection}`} id="dogrulama">
        <div className={styles.sectionHead}><span>02 · ÜÇ DOĞRULAMA NOKTASI</span><h2>Öneriden önce aynı şeyi konuştuğumuzdan emin olalım.</h2><p>Her satırda “Evet, doğru” seçilirse küçük pilot kapsamı görünür. Bu seçimler yalnız bu sayfadaki demoyu değiştirir; hiçbir yere gönderilmez.</p></div>
        <div className={styles.checkpoints}>
          {checkpoints.map((item, index) => (
            <button key={item.title} type="button" aria-pressed={answers[index]} onClick={() => setAnswers((current) => current.map((value, i) => i === index ? !value : value))} className={answers[index] ? styles.checkpointActive : ""}>
              <span>0{index + 1}</span><div><b>{item.title}</b><p>{item.text}</p></div><i>{answers[index] ? "Evet, doğru ✓" : "Birlikte doğrulayalım"}</i>
            </button>
          ))}
        </div>
        <div className={styles.checkpointStatus} aria-live="polite"><b>{answers.filter(Boolean).length}/3</b><span>{proposalReady ? "Üç nokta da aynı yönde. Pilot kapsamı görüşmeye hazır." : "Kapsamı açmak için üç noktayı birlikte doğrulayın."}</span></div>
      </section>

      <section className={`${styles.section} ${styles.demoSection}`} id="demo">
        <div className={styles.sectionHead}><span>03 · ÇALIŞAN AKIŞ ÖNİZLEMESİ</span><h2>Randevu ve no-show akışını risksiz deneyin.</h2><p>Sentetik kayıt kullanır. Sağlık verisi içermez, gerçek randevuyu değiştirmez ve dışarı mesaj göndermez.</p></div>
        <div className={styles.demoShell}>
          <aside className={styles.caseList}>
            <div className={styles.demoBadge}>SENTETİK · DIŞ MESAJ YOK</div>
            {scenarios.map((item) => <button key={item.id} className={scenario === item.id ? styles.caseActive : ""} onClick={() => chooseScenario(item.id)}><span>{item.code}<small>{item.title}</small></span><i>{item.summary}</i></button>)}
          </aside>
          <article className={styles.approvalCard}>
            <div className={styles.cardTop}><span>İNSAN ONAY KARTI</span><strong>{selected.code}</strong></div>
            <div className={styles.approvalGrid}>
              <div><small>DURUM</small><b>{selected.title}</b></div>
              <div><small>NEDEN</small><b>{detail.reason}</b></div>
              <div><small>İNSAN KONTROLÜ</small><b>{detail.control}</b></div>
              <div><small>SONRAKİ KAYIT</small><b>{detail.outcome}</b></div>
            </div>
            <div className={styles.message}><small>MESAJ TASLAĞI</small><p>{detail.message}</p></div>
            <div className={styles.buttons}><button onClick={() => setDemoState("approved")}>Taslağı onayla</button><button onClick={() => setDemoState("cancelled")}>İptal et</button></div>
            <div className={styles.result} aria-live="polite">{demoState === "idle" && "Henüz işlem yapılmadı."}{demoState === "approved" && "Demo onayı kaydedildi. Dışarı mesaj gönderilmedi."}{demoState === "cancelled" && "Demo işlemi iptal edildi. Hiçbir kayıt değişmedi."}</div>
          </article>
        </div>
        <div className={styles.flowHeader}><div><b>Akışın görünür kaydı</b><span>Her adım durdurulabilir ve insana bırakılabilir.</span></div><button type="button" onClick={playing ? () => setPlaying(false) : playFlow}>{playing ? "Akışı duraklat" : "Örnek akışı oynat"}</button></div>
        <div className={styles.flow}>
          {["Talep alındı", "Taslak hazırlandı", "İnsan kontrolü", scenario === "stop" ? "Akış durdu" : "Sonuç kaydı"].map((title, index) => <div key={title} className={step >= index ? styles.flowActive : ""}><span>0{index + 1}</span><b>{title}</b><small>{index === 0 && "Sentetik olay sıraya girer."}{index === 1 && "İzin ve kural kontrol edilir."}{index === 2 && "Ekip onaylar veya devralır."}{index === 3 && (scenario === "stop" ? "Yeni takip hazırlanmaz." : "Durum ölçüme yazılır.")}</small></div>)}
        </div>
      </section>

      <section className={styles.section} id="kapsam">
        <div className={styles.sectionHead}><span>04 · KÜÇÜK PİLOT KAPSAMI</span><h2>Önce tek akış. Sonra yalnız gereken sistem.</h2><p>Tek şube, tek WhatsApp hattı ve tek randevu/no-show akışıyla başlayıp önce–sonra ölçümü yaparız. Web sitesi hizmeti bu kapsamda değildir.</p></div>
        <div className={styles.offerGrid}>
          <article><span>KURULUM</span><h3>{proposalReady ? "5.000 TL" : "Doğrulama bekliyor"}</h3><p>Akış kurulumu, test numarası, senaryo ayarları ve ekip kabul testi.</p><small>Başlangıçta %50, yazılı kabulde %50.</small></article>
          <article><span>AYLIK YÖNETİM</span><h3>{proposalReady ? "3.000 TL / ay" : "Doğrulama bekliyor"}</h3><p>İzleme, hata takibi, küçük iyileştirmeler ve aylık ölçüm özeti.</p><small>Canlıya geçişte peşin · 3 aylık pilot.</small></article>
          <article><span>HARİCİ GİDERLER</span><h3>Gerçek kullanım kadar</h3><p>Meta mesaj, SMS, CRM veya ek yazılım giderleri ayrı ve belgeli gösterilir.</p><small>KDV ve müşteri seçimine bağlı araçlar dahil değildir.</small></article>
        </div>
        <div className={`${styles.scopeLock} ${proposalReady ? styles.scopeReady : ""}`}><b>{proposalReady ? "Görüşmeye hazır başlangıç kapsamı" : "Bu rakamlar bağlayıcı teklif değildir"}</b><p>Klinik görüşmesi, işlem hacmi ve entegrasyon testi tamamlanınca kapsam ve fiyat yazılı olarak kesinleşir.</p></div>
      </section>

      <section className={styles.section} id="kanit">
        <div className={styles.sectionHead}><span>05 · KANIT VE SINIRLAR</span><h2>Hazır olanı, kurulacak olandan ayırdık.</h2></div>
        <div className={styles.proofGrid}>
          <div><b>TEST EDİLDİ</b><span>Sentetik akış</span><p>Onay, iptal, DUR ve insan devri örnek kayıtlarla çalışır.</p></div>
          <div><b>TEST EDİLDİ</b><span>Güvenlik katmanı</span><p>İzin, tekrar ve hatalı imza senaryoları teknik testten geçti.</p></div>
          <div><b>KURULUM GEREKLİ</b><span>Klinik bağlantıları</span><p>Gerçek numara, takvim/CRM ve ekip yetkileri müşteri onayından sonra bağlanır.</p></div>
          <div><b>ÖLÇÜM GEREKLİ</b><span>Gerçek sonuç</span><p>Henüz gerçek klinik sonucu yok; pilot verisi gelmeden oran veya kazanç sözü verilmez.</p></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.contactDraft}`} id="iletisim-taslagi">
        <span>SONRAKİ ADIM · HENÜZ GÖNDERİLMEDİ</span>
        <h2>15 dakikada birlikte doğrulayalım.</h2>
        <p className={styles.contactLead}>Amaç satış baskısı yapmak değil; üç soruya yanıt bulup küçük pilotun gerçekten gerekli olup olmadığını anlamak.</p>
        <blockquote>Merhaba, Doğa Dent’in kamuya açık iletişim kanallarını inceledik. Mevcut düzeniniz hakkında kesin bir varsayım yapmadan, üç kısa doğrulama sorusu ve dışarı mesaj göndermeyen randevu/no-show önizlemesi hazırladık. Uygun olursanız 15 dakikada birlikte üzerinden geçebiliriz.</blockquote>
        <div className={styles.finalBadges}><span>Otomatik gönderim yok</span><span>Bağlayıcı teklif değil</span><span>Karar klinikte</span></div>
      </section>

      <footer className={styles.footer}><span>AgentAxis <strong>Labs</strong></span><p>Özel inceleme taslağı · 13 Ağustos 2026 · Paylaşılmadı</p></footer>
    </main>
  );
}
