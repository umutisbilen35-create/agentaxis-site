"use client";

import { useEffect, useState } from "react";
import styles from "../doga-dent-corlu-195ad912147e82032b7237373d433874/package.module.css";

export type PremiumClinicDemoData = {
  clinicName: string;
  clinicLabel: string;
  labelPrefix?: string;
  analysisTitle: string;
  sourceDate: string;
  officialUrl: string;
  mapUrl: string;
  metrics?: Array<{ value: string; label: string; note: string }>;
  signals?: Array<{ eyebrow: string; title: string; description: string }>;
  services: Array<{
    code: string;
    title: string;
    description: string;
    flow: string[];
  }>;
};

export default function PremiumClinicDemo({ data }: { data: PremiumClinicDemoData }) {
  const [meetingNote, setMeetingNote] = useState(false);
  const hasAnalysis = Boolean((data.metrics && data.metrics.length > 0) || (data.signals && data.signals.length > 0));

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
        <a className={styles.brand} href="https://agentaxislabs.com/" target="_blank" rel="noreferrer"><i><b /></i>AgentAxis <strong>Labs</strong></a>
        <span>ÖZEL ÇALIŞMA · YALNIZ SİZİN İÇİN</span>
      </header>

      <section className={styles.hero} id="ust">
        <div className={styles.heroCopy}>
          <small className={styles.clinicName}>{data.labelPrefix && <>{data.labelPrefix} </>}<span className={styles.clinicNameStrong}>{data.clinicLabel}</span> İÇİN HAZIRLANDI</small>
          <h1>Randevu iletişiminiz için<br /><em>küçük bir çalışma</em> hazırladık.</h1>
          <p>Randevu iletişimi, hasta takibi ve eski hastalarla yeniden iletişim için kliniğinize uygulanabilecek kısa bir örnek hazırladık.</p>
          <a className={styles.primary} href={hasAnalysis ? "#analiz" : "#hizmetler"}>60 saniyelik örnek akışı görün</a>
          <div className={styles.chips}>{hasAnalysis && <span>Gerçek bilgilerle hazırlandı</span>}<span>Gerçek hasta verisi yok</span><span>Kontrol kliniğinizde</span></div>
        </div>
        <div className={styles.orbit} aria-hidden="true"><b>Ai</b><i /><i /><i /></div>
      </section>

      {((data.metrics && data.metrics.length > 0) || (data.signals && data.signals.length > 0)) && (
        <section className={styles.analysis} id="analiz">
          <div className={styles.analysisHead}>
            <div><small>01 · DOĞRULANMIŞ KISA İNCELEME</small><h2>{data.analysisTitle}</h2></div>
            <span>KAMUYA AÇIK KAYNAKLAR · {data.sourceDate}</span>
          </div>
          {data.metrics && data.metrics.length > 0 && (
            <div className={styles.metrics}>
              {data.metrics.map((metric) => <article key={`${metric.value}-${metric.label}`}><strong>{metric.value}</strong><span>{metric.label}</span><small>{metric.note}</small></article>)}
            </div>
          )}
          {data.signals && data.signals.length > 0 && (
            <div className={styles.signalGrid}>
              {data.signals.map((signal) => <article key={signal.eyebrow}><small>{signal.eyebrow}</small><h3>{signal.title}</h3><p>{signal.description}</p></article>)}
            </div>
          )}
          <div className={styles.sourceLine}>
            <div><b>Bu bir sorun iddiası değildir.</b><span>Yalnız doğrulanan görünür bilgiler ve hizmet fırsatları gösterilir.</span></div>
            <nav><a href={data.officialUrl} target="_blank" rel="noreferrer">Resmî site ↗</a><a href={data.mapUrl} target="_blank" rel="noreferrer">Google profili ↗</a></nav>
          </div>
        </section>
      )}

      <section className={styles.services} id="hizmetler">
        <div className={styles.servicesHead}><div><small>02 · SİZE UYARLANABİLECEK HİZMETLER</small><h2>Güçlü iletişimi düzenli takibe dönüştürün.</h2></div><p>İç süreciniz doğrulandıktan sonra yalnız ihtiyaç duyduğunuz bölüm kurulur.</p></div>
        <div className={styles.serviceGrid}>
          {data.services.map((service) => (
            <article key={service.code}>
              <div className={styles.serviceTop}><b>{service.code}</b><span>{data.clinicLabel} İÇİN ÖRNEK</span></div>
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
          <a className={styles.ctaPrimary} href="https://agentaxislabs.com/" target="_blank" rel="noreferrer" onClick={() => setMeetingNote(true)}>15 dakikalık kısa görüşme</a>
          <span aria-live="polite">{meetingNote ? "AgentAxis Labs sitesine yönlendiriliyorsunuz." : "Teklif değil · Fiyat ve kapsam görüşmeden sonra hazırlanır"}</span>
        </div>
      </section>

      <footer>AgentAxis <strong>Labs</strong><span>Özel çalışma önizlemesi · Otomatik gönderim yok</span></footer>
    </main>
  );
}
