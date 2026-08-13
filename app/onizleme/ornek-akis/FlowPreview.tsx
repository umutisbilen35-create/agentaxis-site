"use client";

import { useEffect, useRef, useState } from "react";
import NeedFinder from "../../NeedFinder";
import styles from "./preview.module.css";

const steps = [
  { no: "01", title: "Yeni talep", text: "Sentetik bir randevu talebi sisteme gelir.", status: "Talep alındı" },
  { no: "02", title: "İhtiyacı anla", text: "Onaylı bilgilerle uygun sonraki adım hazırlanır.", status: "Randevu niyeti" },
  { no: "03", title: "İnsan onayı", text: "Mesaj gönderilmeden önce işletme kontrol eder.", status: "Onay bekliyor" },
  { no: "04", title: "Takip", text: "Onaydan sonra hatırlatma ve takip planı görünür olur.", status: "Taslak hazır" },
];

export default function FlowPreview() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!playing) return;
    if (active >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setActive((value) => value + 1), 900);
    return () => window.clearTimeout(timer);
  }, [active, playing]);

  function play() {
    setActive(0);
    setPlaying(true);
  }

  return (
    <main className={styles.previewRoot}>
      <div className={styles.brandBackdrop} aria-hidden="true">
        <video src="/media/lumen-arc-scroll.mp4" poster="/media/lumen-arc-reference.png" autoPlay muted loop playsInline />
        <i />
      </div>
      <header className={styles.nav}>
        <span className={styles.logo}><i><b /></i><span>AgentAxis <strong>Labs</strong></span></span>
        <span className={styles.previewBadge}>ÖNİZLEME · CANLI SİTEYE UYGULANMADI</span>
      </header>

      <section className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>AKILLI İŞLETME ASİSTANI · KISA ÖRNEK</p>
          <h1>Bir talep nasıl<br /><em>kontrollü takibe dönüşür?</em></h1>
          <p className={styles.lead}>Önce örnek akışı görün. Sonra işletmenizde hangi noktayı ölçmemizi istediğinize siz karar verin.</p>
        </div>
        <aside className={styles.truthCard}>
          <span className={styles.truthStatus}><i /> ÖRNEK / SENTETİK AKIŞ</span>
          <strong>Gerçek müşteri veya hasta verisi kullanılmaz.</strong>
          <p>Bu demo çalışma mantığını gösterir. Canlı WhatsApp, CRM veya takvim bağlantısı değildir; hiçbir mesaj göndermez.</p>
        </aside>
      </section>

      <section className={styles.demoShell} aria-label="Sentetik randevu takip akışı">
        <div className={styles.demoTop}>
          <div><small>AKILLI İŞLETME ASİSTANI</small><strong>Randevu takip örneği</strong></div>
          <span><i /> DEMO GÖRÜNÜMÜ</span>
        </div>

        <div className={styles.flowGrid}>
          {steps.map((step, index) => (
            <button
              type="button"
              key={step.no}
              className={index === active ? styles.active : index < active ? styles.done : ""}
              onClick={() => { setPlaying(false); setActive(index); }}
              aria-pressed={index === active}
            >
              <span>{index < active ? "✓" : step.no}</span>
              <small>{step.status}</small>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </button>
          ))}
        </div>

        <div className={styles.demoResult} aria-live="polite">
          <span>{steps[active].no}</span>
          <div><small>ŞU ANDA GÖRÜNEN ADIM</small><strong>{steps[active].title}</strong><p>{steps[active].text}</p></div>
          <b>{active === 2 ? "İŞLETME KARAR VERİR" : active === 3 ? "DIŞ GÖNDERİM YOK" : "SENTETİK KAYIT"}</b>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={play} disabled={playing}>{playing ? "Akış oynuyor…" : "Örnek akışı oynat"} <span>→</span></button>
          <button type="button" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>İhtiyacımı anlatmak istiyorum</button>
        </div>
      </section>

      <section className={styles.statusBand} aria-label="Demo durum açıklaması">
        <article><span>01</span><div><strong>Yerel / sentetik test</strong><p>Örnek veriyle çalışan akış gösterilir.</p></div></article>
        <article><span>02</span><div><strong>Canlı bağlantı gerekli</strong><p>WhatsApp, CRM ve takvim müşteri bazında ayrıca kurulur.</p></div></article>
        <article><span>03</span><div><strong>Gerçek sonuç henüz yok</strong><p>Sonuç yalnız canlı pilotta ölçülür; önceden vaat edilmez.</p></div></article>
      </section>

      <section className={styles.formSection} ref={formRef}>
        <div className={styles.formIntro}>
          <p className={styles.eyebrow}>ŞİMDİ SİZİN İHTİYACINIZ</p>
          <h2>Örneği gördünüz.<br />Doğru başlangıcı birlikte bulalım.</h2>
          <p>Teknik hizmet seçmeniz gerekmez. İşletmenizde neyi geliştirmek istediğinizi seçin; önce problemin gerçekten var olup olmadığını ölçelim.</p>
        </div>
        <NeedFinder />
      </section>

      <footer><span className={styles.logo}><i><b /></i><span>AgentAxis <strong>Labs</strong></span></span><p>Bu sayfa yalnız tasarım önizlemesidir. Canlı ana sayfaya uygulanmamıştır.</p></footer>
    </main>
  );
}
