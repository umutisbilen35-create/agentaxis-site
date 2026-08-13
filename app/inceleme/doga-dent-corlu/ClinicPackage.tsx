"use client";

import { useEffect, useState } from "react";
import styles from "./package.module.css";

const mapUrl = "https://www.google.com/maps/place/%C3%96zel+%C3%87orlu+DO%C4%9EA+DENT+A%C4%9F%C4%B1z+Ve+Di%C5%9F+Sa%C4%9Fl%C4%B1%C4%9F%C4%B1+Poliklini%C4%9Fi/@41.1489088,27.8294083,17z/data=!4m8!3m7!1s0x14b4e7f21c616195:0x69732b0e70312d0b!8m2!3d41.1489088!4d27.8294083!9m1!1b1!16s%2Fg%2F11rd4x1h4b";

const services = [
  {
    code: "01",
    title: "Randevu iletişimi",
    description: "Telefon, WhatsApp, e-posta ve formdan gelen talepler tek takip düzeninde toplanabilir.",
    flow: ["Talep gelir", "Taslak hazırlanır", "Ekip onaylar", "Sonuç kaydedilir"],
  },
  {
    code: "02",
    title: "Hasta takibi",
    description: "Yanıt vermeyen veya teyit bekleyen hastalar unutulmadan ekibin önüne getirilebilir.",
    flow: ["Teyit bekler", "Takip görünür olur", "Ekip karar verir", "Gerekirse insan devralır"],
  },
  {
    code: "03",
    title: "Eski hastalarla yeniden iletişim",
    description: "Yalnız iletişim izni bulunan hastalar için kontrollü dönüş taslakları hazırlanabilir.",
    flow: ["İzin kontrolü", "Taslak hazırlanır", "Klinik onaylar", "Takip kaydedilir"],
  },
];

export default function ClinicPackage() {
  const [meetingNote, setMeetingNote] = useState(false);

  useEffect(() => {
    const previousOverflowY = document.body.style.overflowY;
    document.body.style.overflowY = "auto";

    return () => {
      document.body.style.overflowY = previousOverflowY;
    };
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href="#ust"><i><b /></i>AgentAxis <strong>Labs</strong></a>
        <span>ÖZEL ÖNİZLEME · PAYLAŞILMADI</span>
      </header>

      <section className={styles.hero} id="ust">
        <div className={styles.heroCopy}>
          <small className={styles.clinicName}>DOĞA DENT ÇORLU İÇİN HAZIRLANDI</small>
          <h1>Randevu iletişiminiz için<br /><em>küçük bir çalışma</em> hazırladık.</h1>
          <p>Kamuya açık bilgilerinizden yola çıkarak; randevu iletişimi, hasta takibi ve eski hastalarla yeniden iletişim için kliniğinize özel kısa bir örnek hazırladık.</p>
          <a className={styles.primary} href="#analiz">60 saniyelik örnek akışı görün</a>
          <div className={styles.chips}><span>Gerçek bilgilerle hazırlandı</span><span>Gerçek hasta verisi yok</span><span>Kontrol kliniğinizde</span></div>
        </div>
        <div className={styles.orbit} aria-hidden="true"><b>Ai</b><i /><i /><i /></div>
      </section>

      <section className={styles.analysis} id="analiz">
        <div className={styles.analysisHead}>
          <div><small>01 · DOĞRULANMIŞ KISA İNCELEME</small><h2>Doğa Dent Çorlu’nun görünür gücü.</h2></div>
          <span>KAMUYA AÇIK KAYNAKLAR · 28.07.2026</span>
        </div>
        <div className={styles.metrics}>
          <article><strong>4,9</strong><span>Google puanı</span><small>Profilde görülen puan</small></article>
          <article><strong>140</strong><span>incelenen yorum</span><small>En yeni sıralamayla tarandı</small></article>
          <article><strong>4</strong><span>iletişim kanalı</span><small>Telefon · WhatsApp · e-posta · form</small></article>
        </div>
        <div className={styles.signalGrid}>
          <article>
            <small>YORUMLARDA ÖNE ÇIKAN GÜÇLÜ SİNYAL</small>
            <h3>İlgi, özen ve bilgilendirme.</h3>
            <p>İncelenen yorumlarda hasta yaklaşımı, ekip ilgisi ve açıklayıcı iletişim olumlu biçimde öne çıkıyor.</p>
          </article>
          <article>
            <small>KAMUYA AÇIK KAYNAKLARDA GÖRÜNMEYEN</small>
            <h3>Talebin içerideki takip yolu.</h3>
            <p>Randevu talebi, teyit, yanıt vermeyen hasta ve eski hasta iletişiminin içeride nasıl yönetildiği dışarıdan görülemiyor.</p>
          </article>
        </div>
        <div className={styles.sourceLine}>
          <div><b>Bu bir sorun iddiası değildir.</b><span>Yalnız doğrulanan görünür bilgiler ve hizmet fırsatları gösterilir.</span></div>
          <nav><a href="https://www.dogadentcorlu.com/iletisim" target="_blank" rel="noreferrer">Resmî site ↗</a><a href={mapUrl} target="_blank" rel="noreferrer">Google profili ↗</a></nav>
        </div>
      </section>

      <section className={styles.services} id="hizmetler">
        <div className={styles.servicesHead}><div><small>02 · SİZE UYARLANABİLECEK HİZMETLER</small><h2>Güçlü iletişimi düzenli takibe dönüştürün.</h2></div><p>İç süreciniz doğrulandıktan sonra yalnız ihtiyaç duyduğunuz bölüm kurulur.</p></div>
        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <article key={service.code}>
              <div className={styles.serviceTop}><b>{service.code}</b><span>DOĞA DENT İÇİN ÖRNEK</span></div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className={styles.miniFlow}>{service.flow.map((step, index) => <span key={step}>{step}{index < service.flow.length - 1 && <i>→</i>}</span>)}</div>
            </article>
          ))}
        </div>
        <p className={styles.boundary}>Bu bölüm gerçek hasta verisi kullanmaz, dışarı mesaj göndermez ve tıbbi karar vermez. Canlı bağlantılar yalnız klinik onayıyla kurulur.</p>
      </section>

      <section className={styles.cta}>
        <div><small>03 · SONRAKİ ADIM</small><h2>Size uygun hizmeti birlikte netleştirelim.</h2><p>Önce mevcut düzeninizi doğrularız. Yalnız fayda sağlayacak bölüm için kapsam ve fiyat hazırlarız.</p></div>
        <div className={styles.ctaAction}>
          <a href="https://agentaxislabs.com/#hizmetler" target="_blank" rel="noreferrer">AgentAxis Labs hizmetlerini inceleyin</a>
          <button onClick={() => setMeetingNote(true)}>15 dakikalık kısa görüşme</button>
          <span aria-live="polite">{meetingNote ? "Bu yalnız önizlemedir. Görüşme talebi henüz gönderilmedi." : "Teklif değil · Fiyat ve kapsam görüşmeden sonra hazırlanır"}</span>
        </div>
      </section>

      <footer>AgentAxis <strong>Labs</strong><span>Özel çalışma önizlemesi · Otomatik gönderim yok</span></footer>
    </main>
  );
}
