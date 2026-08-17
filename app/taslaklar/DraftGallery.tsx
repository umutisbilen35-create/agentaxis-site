"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import ParticleCanvas from "./ParticleCanvas";
import NeedFinder from "../NeedFinder";
import { siteContact } from "../siteConfig";
import styles from "./taslaklar.module.css";

type DraftId = "lumen" | "guven" | "hibrit" | "sinema" | "ucboyut";

const services = [
  ["01", "Müşteri kazanma", "Doğru müşteriye ulaşabileceğiniz fırsatları görünür hâle getirir."],
  ["02", "Müşteri takibi", "Yeni talepleri, geri dönüşleri ve hatırlatmaları tek düzende toplar."],
  ["03", "İş otomasyonu", "Tekrar eden uygun işleri kontrolünüzü koruyarak hızlandırır."],
  ["04", "Randevu ve rezervasyon", "Talep, onay, hatırlatma ve yeniden planlama adımlarını düzenler."],
];

const steps = [
  ["01", "İhtiyacı dinleriz", "İşletmenizi, müşterilerinizi ve yaşadığınız asıl sorunu net biçimde öğreniriz."],
  ["02", "Problemi doğrularız", "Küçük bir teşhisle sorunun nerede olduğunu ve size ne kaybettirdiğini görünür yaparız."],
  ["03", "Güvenli sistemi kurarız", "Uygun sistemi önce test eder, önemli işlemleri sizin onayınıza bağlarız."],
  ["04", "Birlikte ölçeriz", "Kurulan sistemin etkisini takip eder, yalnız doğrulanan sonucu anlaşılır bir raporla paylaşırız."],
];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`${styles.logo} ${light ? styles.logoLight : ""}`}>
      <i><b /></i><span>AgentAxis <strong>Labs</strong></span>
    </span>
  );
}

function TrustStrip() {
  return (
    <div className={styles.trustStrip}>
      <span>✓ Otomatik ödeme yok</span>
      <span>✓ Önemli işlemler sizin onayınızda</span>
    </div>
  );
}

function AssistantDashboard({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`${styles.dashboard} ${dark ? styles.dashboardDark : ""}`}>
      <div className={styles.dashboardTop}>
        <div><span className={styles.statusDot} /> Akıllı İşletme Asistanı</div>
        <small>DEMO GÖRÜNÜMÜ</small>
      </div>
      <div className={styles.dashboardTitle}>
        <div><small>BUGÜNÜN ÖZETİ</small><strong>İşleriniz tek bakışta</strong></div>
        <span>Kontrol sizde</span>
      </div>
      <div className={styles.metrics}>
        <article><small>Yeni talepler</small><strong>3</strong><span>İnceleniyor</span></article>
        <article><small>Takip zamanı</small><strong>2</strong><span>Hatırlatma hazır</span></article>
        <article><small>Onay bekliyor</small><strong>1</strong><span>Siz karar verin</span></article>
      </div>
      <div className={styles.flowLine}>
        <span>Yeni talep</span><i>→</i><span>İhtiyacı anla</span><i>→</i><span>İnsan onayı</span><i>→</i><span>Takip</span>
      </div>
      <div className={styles.dashboardFoot}><span>Son kontrol: şimdi</span><b>Çalışma kaydını gör →</b></div>
    </div>
  );
}

function HeroValuePanel({ onOpenServices }: { onOpenServices?: () => void }) {
  const valueServices = [
    ["◎", "Randevu takibi", "Yeni randevu, iptal ve geri dönüşleri tek düzende görün."],
    ["↺", "Eski hastaları yeniden kazanma", "İletişim izni uygun hastalar için kontrollü hatırlatma listesi hazırlar."],
    ["↗", "Cevapsız talep takibi", "Form, WhatsApp ve telefon taleplerinde dönüş bekleyenleri gösterir."],
    ["✓", "Tedavi sonrası takip", "Kontrol ve memnuniyet adımlarının unutulmasını önler."],
  ];
  return (
    <aside className={styles.heroValuePanel} aria-label="Diş klinikleri için Akıllı İşletme Asistanı örneği">
      <div className={styles.valuePanelTop}><span><i /> Akıllı İşletme Asistanı</span><small>DİŞ KLİNİĞİ ÖRNEĞİ</small></div>
      <div className={styles.valuePanelTitle}><small>NELERİ DÜZENLİYORUZ?</small><h2>Randevu ve hasta takibini tek düzende görün.</h2></div>
      <div className={styles.valueServiceList}>
        {valueServices.map(([icon, title, text]) => (
          <button key={title} type="button" onClick={onOpenServices}>
            <i>{icon}</i><span><strong>{title}</strong><small>{text}</small></span><b>→</b>
          </button>
        ))}
      </div>
      <div className={styles.valuePanelTrust}><span>✓ Önemli işler sizin onayınızda</span></div>
    </aside>
  );
}

export function Services({ dark = false, sectionId }: { dark?: boolean; sectionId?: string }) {
  return (
    <section id={sectionId} className={`${styles.services} ${dark ? styles.servicesDark : ""}`} data-premium-reveal="wait">
      <div className={styles.sectionHeading}>
        <div><small>İŞLETMENİZ İÇİN</small><h2>Sizin yerinize çalışan bir düzen.</h2></div>
        <p>Her hizmet, işletmenizde görünür bir soruna ve ölçülebilir bir başlangıç hedefine bağlanır.</p>
      </div>
      <div className={styles.serviceGrid}>
        {services.map(([no, title, text]) => (
          <article key={no}><span>{no}</span><h3>{title}</h3><p>{text}</p></article>
        ))}
      </div>
    </section>
  );
}

export function Process({ dark = false }: { dark?: boolean }) {
  return (
    <section className={`${styles.process} ${dark ? styles.processDark : ""}`} data-premium-reveal="wait">
      <div className={styles.sectionHeading}>
        <div><small>NASIL ÇALIŞIR?</small><h2>Dört sade adım. Her aşamada siz bilirsiniz.</h2></div>
        <p>Önce problemi doğrular, sonra küçük ve güvenilir bir sistem kurarız.</p>
      </div>
      <div className={styles.stepGrid}>
        {steps.map(([no, title, text]) => <article key={no}><span>{no}</span><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
  );
}

function FinalCta({ dark = false }: { dark?: boolean }) {
  return (
    <section className={`${styles.finalCta} ${dark ? styles.finalCtaDark : ""}`} data-premium-reveal="wait">
      <div><small>İLK ADIM ÜCRETSİZ</small><h2>İşletmenizde en değerli fırsat nerede?</h2><p>Yaklaşık iki dakikada anlatın; size uygun başlangıç seçeneklerini gösterelim.</p></div>
      <button>Ücretsiz mini teşhisi başlat <span>→</span></button>
    </section>
  );
}

function TrustDraft() {
  return (
    <div className={`${styles.draft} ${styles.trustDraft}`}>
      <header className={styles.floatingNav}><Logo /><nav><span>Hizmetler</span><span>Nasıl çalışır?</span><span>Kanıt</span></nav><button>Ücretsiz inceleme</button></header>
      <section className={styles.trustHero}>
        <div className={styles.skyGlow} />
        <div className={styles.heroCenter}>
          <div className={styles.pill}>YEREL İŞLETMELER İÇİN UYGULAMALI YAPAY ZEKÂ</div>
          <h1>İşletmeniz için çalışan <em>akıllı bir düzen.</em></h1>
          <p>Müşteri kazanma, takip ve tekrar eden işleri tek sistemde görün. Önemli kararlar daima sizin kontrolünüzde kalsın.</p>
          <div className={styles.actions}><button>Ücretsiz mini teşhis <span>→</span></button><button>Sistemi gör</button></div>
          <TrustStrip />
        </div>
        <AssistantDashboard />
      </section>
      <Services />
      <section className={styles.proofBand}>
        <div><small>KLİNİKLER İÇİN ÖRNEK HEDEF</small><strong><b>%30</b> daha az randevuya gelmeme hedefi</strong><p>Hatırlatma, onay ve takip akışı. Sonuç iddiası değil; gerçek veriye göre ölçülecek pilot hedefidir.</p></div>
        <ul><li><span>01</span>İlk yanıt süresi</li><li><span>02</span>Randevuya geçiş</li><li><span>03</span>Hatırlatma takibi</li></ul>
      </section>
      <Process />
      <FinalCta />
    </div>
  );
}

const capabilityFlows = [
  {
    id: "kazanma",
    label: "Müşteri kazanma",
    icon: "↗",
    title: "Doğru fırsatı görünür hâle getirir",
    flow: ["İşletmeyi incele", "Fırsatı bul", "Mini teşhis", "Onaylı ilk temas"],
  },
  {
    id: "takip",
    label: "Müşteri takibi",
    icon: "◎",
    title: "Yeni talebi doğru sonraki adıma taşır",
    flow: ["Yeni talep", "İhtiyacı anla", "Dönüş zamanı", "Sonucu kaydet"],
  },
  {
    id: "otomasyon",
    label: "İş otomasyonu",
    icon: "↻",
    title: "Tekrar eden uygun işi kontrollü biçimde hızlandırır",
    flow: ["İşi belirle", "Akışı hazırla", "İnsan onayı", "Çalışma kaydı"],
  },
  {
    id: "randevu",
    label: "Randevu yönetimi",
    icon: "◇",
    title: "Randevu talebini onaydan hatırlatmaya kadar düzenler",
    flow: ["Talebi al", "Randevuyu onayla", "Hatırlat", "Sonucu kaydet"],
  },
];

export function CapabilityExperience() {
  const [active, setActive] = useState(0);
  const capability = capabilityFlows[active];

  return (
    <section className={styles.capabilityExperience} aria-label="Hizmetlerin canlı iş akışı">
      <div className={styles.capabilityButtons}>
        {capabilityFlows.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={active === index ? styles.capabilityActive : ""}
            aria-pressed={active === index}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <i>{item.icon}</i><span>{item.label}</span><b>Canlı akışı gör</b>
          </button>
        ))}
      </div>
      <div className={styles.capabilityLive} key={capability.id} aria-live="polite">
        <div className={styles.capabilityLiveHead}><span><i /> {capability.label}</span><small>CANLI İŞ AKIŞI</small></div>
        <h3>{capability.title}</h3>
        <div className={styles.capabilityFlow}>
          {capability.flow.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < capability.flow.length - 1 && <i>→</i>}</div>)}
        </div>
        <p>İmleci başka bir hizmetin üzerine getirerek akışın nasıl değiştiğini görebilirsiniz.</p>
      </div>
    </section>
  );
}

const workflowSteps = [
  {
    no: "01",
    title: "Talebi yakalar",
    text: "Web sitesi veya WhatsApp’tan gelen talep kaybolmadan tek ekrana düşer.",
    signal: "Yeni talep alındı",
    status: "Düzenleniyor",
  },
  {
    no: "02",
    title: "İhtiyacı netleştirir",
    text: "Eksik bilgileri ayırır, konuşmayı doğru hizmet ve sonraki adıma hazırlar.",
    signal: "İhtiyaç özeti hazır",
    status: "Kontrol edildi",
  },
  {
    no: "03",
    title: "Onaya getirir",
    text: "Mesaj, teklif veya randevu gibi önemli işlem siz görmeden gönderilmez.",
    signal: "1 işlem onay bekliyor",
    status: "Siz karar verin",
  },
  {
    no: "04",
    title: "Takibi sürdürür",
    text: "Cevap zamanı ve sonucu kaydeder; unutulan fırsatları görünür tutar.",
    signal: "Takip zamanı belirlendi",
    status: "Planlandı",
  },
];

export function WorkflowStory() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.storyStep || 0));
    }, { threshold: [0.35, 0.6, 0.85] });
    stepRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const current = workflowSteps[active];

  return (
    <section className={styles.workflowStory} data-premium-reveal="wait">
      <div className={styles.storyIntro}>
        <small>SİSTEMİN İÇİNDE NE OLUR?</small>
        <h2>Bir talep gelir.<br /><em>Hiçbir adım karanlıkta kalmaz.</em></h2>
        <p>Kaydırdıkça Akıllı İşletme Asistanı’nın işi nasıl düzenlediğini görün.</p>
      </div>
      <div className={styles.storyGrid}>
        <div className={styles.storySteps}>
          {workflowSteps.map((step, index) => (
            <article
              key={step.no}
              ref={(element) => { stepRefs.current[index] = element; }}
              data-story-step={index}
              className={active === index ? styles.storyStepActive : ""}
            >
              <span>{step.no}</span><h3>{step.title}</h3><p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className={styles.storySticky}>
          <div className={styles.storyScreen} key={active}>
            <div className={styles.storyScreenTop}><span><i /> Akıllı İşletme Asistanı</span><small>CANLI AKIŞ</small></div>
            <div className={styles.storyPulse}><span>{current.no}</span><div><small>ŞİMDİKİ ADIM</small><strong>{current.title}</strong></div></div>
            <div className={styles.storyMessage}><small>SİSTEM KAYDI</small><strong>{current.signal}</strong><span>{current.status}</span></div>
            <div className={styles.storyTimeline}>{workflowSteps.map((step, index) => <i key={step.no} className={index <= active ? styles.storyDone : ""} />)}</div>
            <p>Önemli dış işlemler insan onayı olmadan tamamlanmaz.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PremiumFinalCta({ onStart }: { onStart?: () => void }) {
  return (
    <section className={styles.premiumFinalCta} data-premium-reveal="wait">
      <div className={styles.finalOrb} aria-hidden="true"><span>Aİ</span><i /><i /></div>
      <div><small>İLK ADIM ÜCRETSİZ</small><h2>Önce sorunu görün.<br />Sonra birlikte karar verin.</h2><p>İşletmenizi yaklaşık iki dakikada anlatın; en değerli başlangıç noktasını ücretsiz mini teşhisle gösterelim.</p></div>
      <button type="button" onClick={onStart}>Ücretsiz incelemeyi başlat <span>→</span></button>
    </section>
  );
}

const previewFlowSteps = [
  ["01", "Yeni talep", "Sentetik bir randevu talebi sisteme gelir."],
  ["02", "İhtiyacı anla", "Uygun sonraki adım onaylı bilgilerle hazırlanır."],
  ["03", "İnsan onayı", "Mesaj gönderilmeden önce işletme kontrol eder."],
  ["04", "Takip", "Hatırlatma ve takip planı görünür olur."],
];

function FullSiteFlowDemo({ onStart, showPreviewBadge = true }: { onStart: () => void; showPreviewBadge?: boolean }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (active >= previewFlowSteps.length - 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setActive((value) => value + 1), 900);
    return () => window.clearTimeout(timer);
  }, [active, playing]);

  return (
    <section className={styles.fullSiteFlow} aria-label="Sentetik çalışan akış örneği">
      <div className={styles.fullSiteFlowHead}>
        <div><small>ÖRNEK / SENTETİK AKIŞ</small><h2>Formdan önce çalışan düzeni görün.</h2><p>Gerçek müşteri verisi kullanılmaz ve hiçbir mesaj gönderilmez.</p></div>
        {showPreviewBadge && <span>CANLI SİTEYE UYGULANMADI</span>}
      </div>
      <div className={styles.fullSiteFlowGrid}>
        {previewFlowSteps.map(([no, title, text], index) => <button type="button" key={no} className={active === index ? styles.fullSiteFlowActive : index < active ? styles.fullSiteFlowDone : ""} onClick={() => { setPlaying(false); setActive(index); }} aria-pressed={active === index}><span>{index < active ? "✓" : no}</span><small>{index === 2 ? "ONAY BEKLİYOR" : index === 3 ? "TASLAK HAZIR" : "SENTETİK KAYIT"}</small><strong>{title}</strong><p>{text}</p></button>)}
      </div>
      <div className={styles.fullSiteFlowActions}><button type="button" onClick={() => { setActive(0); setPlaying(true); }} disabled={playing}>{playing ? "Akış oynuyor…" : "Örnek akışı oynat"} <span>→</span></button><button type="button" onClick={onStart}>İhtiyacınızı anlatın</button></div>
    </section>
  );
}

export type LivePanelId = "hizmetler" | "surec" | "paketler" | "kanit" | "iletisim";

function LumenLoopVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sync = () => {
      const shouldPlay = visible && document.visibilityState === "visible" && !reduced;
      if (shouldPlay) void video.play().catch(() => undefined);
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    }, { threshold: 0.01 });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, []);

  return <video ref={videoRef} src="/media/lumen-arc-rotation-loop.mp4" poster="/media/lumen-arc-loop-poster.jpg" autoPlay muted loop playsInline preload="metadata" />;
}

function LivePanel({ panel, onClose, onRequest, lumen = false }: { panel: LivePanelId; onClose: () => void; onRequest: () => void; lumen?: boolean }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector))[0]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      const focusables = Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector));
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, []);

  return (
    <div className={`${styles.liveOverlay} ${lumen ? styles.lumenLiveOverlay : ""}`} role="dialog" aria-modal="true" aria-label="AgentAxis bilgi paneli">
      {lumen && <div className={styles.lumenPanelBackdrop} aria-hidden="true"><LumenLoopVideo /><i /></div>}
      <button className={styles.liveBackdrop} type="button" onClick={onClose} aria-label="Paneli kapat" tabIndex={-1} />
      <div className={styles.liveModal} ref={modalRef}>
        <div className={styles.liveModalTop}><Logo /><button type="button" onClick={onClose}>Kapat <span>×</span></button></div>
        <div className={styles.liveModalBody}>
          {panel === "hizmetler" && <Services />}
          {panel === "surec" && <Process />}
          {panel === "paketler" && (
            <section className={styles.catalogPanel}>
              <small>İŞLETMENİZE UYGUN HİZMETLER</small>
              <h2>İhtiyacınız kadar sistem kurulur.</h2>
              <p>Önce en önemli ihtiyacınızdan başlarız. Kullanmayacağınız özellikler için ödeme yapmazsınız.</p>
              <div className={styles.catalogGrid}>
                <article className={styles.catalogFeatured}>
                  <div className={styles.catalogHeading}>
                    <strong className={styles.catalogTier}>BAŞLANGIÇ</strong>
                    <h3 className={styles.catalogSubtitle}>Randevu Takibi</h3>
                  </div>
                  <div className={styles.catalogPrice}>
                    <strong>7.500 TL</strong><small>tek seferlik ücret</small>
                    <strong>4.000 TL</strong><small>aylık hizmet</small>
                  </div>
                  <ul className={styles.catalogFeatures}>
                    <li>Randevu taleplerini düzenli takip etme</li>
                    <li>Teyit ve hatırlatma mesajları</li>
                    <li>İptal ve gelmeyen müşterileri takip etme</li>
                    <li>Gerektiğinde görüşmeyi çalışanınıza aktarma</li>
                    <li>Aylık kontrol, destek ve kısa sonuç raporu</li>
                  </ul>
                  <p className={styles.catalogScope}>Tek işletme adresi ve tek WhatsApp numarası için geçerlidir.</p>
                  <button type="button" onClick={onRequest}>İhtiyacınızı anlatın →</button>
                </article>
                <article>
                  <div className={styles.catalogHeading}>
                    <strong className={styles.catalogTier}>GELİŞMİŞ</strong>
                    <h3 className={`${styles.catalogSubtitle} ${styles.catalogSubtitleStack}`}>
                      <span>Randevu ve Müşteri</span>
                      <span>Takibi</span>
                    </h3>
                  </div>
                  <div className={styles.catalogPrice}>
                    <strong>12.000 TL</strong><small>tek seferlik ücret</small>
                    <strong>7.000 TL</strong><small>aylık hizmet</small>
                  </div>
                  <ul className={styles.catalogFeatures}>
                    <li>Başlangıç paketindeki tüm hizmetler</li>
                    <li>Yeni müşteri taleplerini tek yerde takip etme</li>
                    <li>Yanıtsız kalan talepleri yeniden takip etme</li>
                    <li>Yalnız izin veren eski müşterilerle yeniden iletişim</li>
                    <li>Aylık kontrol, hata düzeltme, destek ve ayrıntılı sonuç raporu</li>
                    <li>İhtiyaca göre küçük iyileştirmeler</li>
                  </ul>
                  <p className={styles.catalogScope}>Tek işletme adresi ve tek WhatsApp numarası için geçerlidir.</p>
                  <button type="button" onClick={onRequest}>İhtiyacınızı anlatın →</button>
                </article>
                <article>
                  <div className={styles.catalogHeading}>
                    <strong className={styles.catalogTier}>ÖZEL SİSTEM</strong>
                    <h3 className={styles.catalogSubtitle}>İşletmenize Özel Çalışma Düzeni</h3>
                  </div>
                  <ul className={styles.catalogFeatures}>
                    <li>Başlangıç ve Gelişmiş paketlerindeki hizmetler</li>
                    <li>Birden fazla şube veya WhatsApp numarası</li>
                    <li>Kullandığınız programların birbirine bağlanması</li>
                    <li>İşletmenize özel takip ve otomasyonlar</li>
                    <li>Özel raporlama, düzenli kontrol ve destek</li>
                  </ul>
                  <p className={styles.catalogScope}>Kapsam ve fiyat, ihtiyacınız incelendikten sonra belirlenir.</p>
                  <button type="button" onClick={onRequest}>İhtiyacınızı anlatın →</button>
                </article>
              </div>
              <div className={styles.catalogTrust}>
                <span>✓ Otomatik ödeme yok</span>
                <span>✓ Önemli işler sizin onayınızda</span>
                <span>WhatsApp mesajları, kullanılan ek hizmetler ve vergiler teklifte ayrı gösterilir</span>
              </div>
            </section>
          )}
          {panel === "kanit" && <section className={styles.modalProof}><small>ŞEFFAF ÇALIŞMA KANITI</small><h2>Kaynağı, çalışan sistemi ve ölçülen sonucu birlikte görürsünüz.</h2><div className={styles.proofCards}><article><span>01</span><strong>Kaynaklı teşhis</strong><p>Problemin nerede olduğunu kanıtıyla gösteririz.</p></article><article><span>02</span><strong>Çalışan sistem</strong><p>Sunum değil, test edilmiş akış kurarız.</p></article><article><span>03</span><strong>Sizin kontrolünüz</strong><p>Önemli dış işlemler açık onayınızla ilerler.</p></article></div></section>}
          {panel === "iletisim" && <section className={styles.liveFinder}><div><small>ÜCRETSİZ MİNİ TEŞHİS</small><h2>İşletmenizi anlatın, doğru başlangıcı birlikte bulalım.</h2><p>Yaklaşık iki dakikada ihtiyacınızı seçin. Otomatik ödeme yok; önemli işlemler sizin onayınızda kalır.</p><div className={styles.contactDirect}><span>Doğrudan iletişim</span><a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>{siteContact.phoneDisplay && <a href={`tel:${siteContact.phoneHref}`}>{siteContact.phoneDisplay}</a>}{siteContact.whatsappHref && <a href={siteContact.whatsappHref} target="_blank" rel="noreferrer">WhatsApp’tan yazın ↗</a>}{siteContact.instagramHref && <a href={siteContact.instagramHref} target="_blank" rel="noreferrer">Instagram · {siteContact.instagramDisplay} ↗</a>}{siteContact.linkedinHref && <a href={siteContact.linkedinHref} target="_blank" rel="noreferrer">LinkedIn · {siteContact.linkedinDisplay} ↗</a>}{siteContact.youtubeHref && <a href={siteContact.youtubeHref} target="_blank" rel="noreferrer">YouTube ↗</a>}</div></div><NeedFinder /></section>}
        </div>
      </div>
    </div>
  );
}

export function HybridDraft({ live = false, lumen = false, initialPanel = null, previewFlow = false, fullPreview = false, showPreviewBadge = true, showProof = false }: { live?: boolean; lumen?: boolean; initialPanel?: LivePanelId | null; previewFlow?: boolean; fullPreview?: boolean; showPreviewBadge?: boolean; showProof?: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [livePanel, setLivePanel] = useState<LivePanelId | null>(initialPanel === "kanit" && !showProof ? null : initialPanel);

  function openPanel(panel: LivePanelId) {
    if (!livePanel) previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLivePanel(panel);
  }

  function closePanel() {
    setLivePanel(null);
    window.setTimeout(() => previousFocusRef.current?.focus(), 0);
  }

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-premium-reveal="wait"]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.setAttribute("data-premium-reveal", "visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).setAttribute("data-premium-reveal", "visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!livePanel) return;
    const closeWithEscape = (event: KeyboardEvent) => { if (event.key === "Escape") closePanel(); };
    document.addEventListener("keydown", closeWithEscape);
    return () => document.removeEventListener("keydown", closeWithEscape);
  }, [livePanel]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    for (const child of Array.from(page.children)) {
      if (!(child instanceof HTMLElement) || child.classList.contains(styles.liveOverlay)) continue;
      child.inert = Boolean(livePanel);
      if (livePanel) child.setAttribute("aria-hidden", "true");
      else child.removeAttribute("aria-hidden");
    }
  }, [livePanel]);

  function moveHero(event: ReactPointerEvent<HTMLElement>) {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    hero.style.setProperty("--pointer-x", `${x * 100}%`);
    hero.style.setProperty("--pointer-y", `${y * 100}%`);
    hero.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    hero.style.setProperty("--tilt-y", `${(x - 0.5) * 6}deg`);
  }

  function resetHero() {
    const hero = heroRef.current;
    if (!hero) return;
    hero.style.setProperty("--pointer-x", "72%");
    hero.style.setProperty("--pointer-y", "42%");
    hero.style.setProperty("--tilt-x", "0deg");
    hero.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div ref={pageRef} className={`${styles.draft} ${styles.hybridDraft} ${live ? styles.liveRoot : ""} ${lumen ? styles.lumenOriginalRoot : ""} ${fullPreview ? styles.fullPreviewRoot : ""}`}>
      {fullPreview && showPreviewBadge && <div className={styles.fullPreviewBadge}>TAM SİTE ÖNİZLEMESİ · CANLIYA UYGULANMADI</div>}
      <header className={styles.hybridNav}><Logo /><nav><button type="button" onClick={() => live && openPanel("hizmetler")}><i>◇</i> Hizmetler</button><button type="button" onClick={() => live && openPanel("surec")}><i>↺</i> Nasıl çalışır?</button><button type="button" onClick={() => live && openPanel("paketler")}><i>▦</i> Paketler</button>{showProof && <button type="button" onClick={() => live && openPanel("kanit")}><i>✓</i> Kanıt</button>}<button type="button" onClick={() => live && openPanel("iletisim")}><i>✎</i> İhtiyacınızı anlatın</button></nav><button type="button" onClick={() => live && openPanel("iletisim")}>Ücretsiz inceleme <b>↗</b></button></header>
      <section className={styles.hybridHero} ref={heroRef} onPointerMove={moveHero} onPointerLeave={resetHero}>
        {lumen && !livePanel && <div className={styles.lumenOriginalBackdrop} aria-hidden="true"><LumenLoopVideo /><i /></div>}
        {!livePanel && <ParticleCanvas className={styles.particleCanvas} />}
        <div className={styles.pointerGlow} aria-hidden="true" />
        <div className={styles.auroraOne} aria-hidden="true" />
        <div className={styles.auroraTwo} aria-hidden="true" />
        <div className={styles.hybridCopy}>
          <div className={styles.livePill}><i /> İŞLETMENİZ İÇİN AKILLI SİSTEMLER <b>KONTROL SİZDE</b></div>
          <h1>Müşteriyi kaçırmayın.<br /><em>Takibi sisteme bırakın.</em></h1>
          <p>Akıllı İşletme Asistanı talebi görür, ihtiyacı düzenler ve doğru sonraki adımı hazırlar. Gönderme ve hesap işlemleri sizin onayınızla ilerler.</p>
          <div className={styles.actions}><button type="button" onClick={() => live && openPanel("iletisim")}>Ücretsiz mini teşhis <span>→</span></button><button type="button" onClick={() => live && openPanel("surec")}>Nasıl çalıştığını gör</button></div>
        </div>
        <div className={styles.hybridVisual}>
          <HeroValuePanel onOpenServices={() => live && openPanel("hizmetler")} />
        </div>
      </section>
      <CapabilityExperience />
      <WorkflowStory />
      <Services sectionId="hizmetler" />
      {showProof && <section className={styles.hybridProof} data-premium-reveal="wait">
        <div><small>ŞEFFAF ÇALIŞMA KANITI</small><h2>Ne yapıldığını görür,<br />önemli işi siz onaylarsınız.</h2></div>
        <div className={styles.proofCards}><article><span>01</span><strong>Kaynaklı teşhis</strong><p>Problemin nerede olduğunu kanıtıyla gösteririz.</p></article><article><span>02</span><strong>Çalışan sistem</strong><p>Sunum değil, test edilmiş akış kurarız.</p></article><article><span>03</span><strong>Ölçülen değişim</strong><p>Çalışma sonunda yalnız gerçek sonucu raporlarız.</p></article></div>
      </section>}
      <Process />
      {previewFlow && <FullSiteFlowDemo onStart={() => openPanel("iletisim")} showPreviewBadge={showPreviewBadge} />}
      <PremiumFinalCta onStart={() => live && openPanel("iletisim")} />
      {live && <footer className={styles.premiumFooter}><Logo /><span>© 2026 AgentAxis Labs</span><a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>{siteContact.phoneDisplay && <a href={`tel:${siteContact.phoneHref}`}>{siteContact.phoneDisplay}</a>}{siteContact.whatsappHref && <a href={siteContact.whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>}{siteContact.instagramHref && <a href={siteContact.instagramHref} target="_blank" rel="noreferrer">Instagram</a>}{siteContact.linkedinHref && <a href={siteContact.linkedinHref} target="_blank" rel="noreferrer">LinkedIn</a>}{siteContact.youtubeHref && <a href={siteContact.youtubeHref} target="_blank" rel="noreferrer">YouTube</a>}<a href="/gizlilik">Gizlilik</a><a href="/kullanim-kosullari">Kullanım koşulları</a></footer>}
      {livePanel && <LivePanel panel={livePanel} lumen={lumen} onClose={closePanel} onRequest={() => openPanel("iletisim")} />}
    </div>
  );
}

function CinemaDraft() {
  return (
    <div className={`${styles.draft} ${styles.cinemaDraft}`}>
      <header className={styles.cinemaNav}><Logo light /><nav><span>Hizmetler</span><span>Sistem</span><span>Kanıt</span></nav><button>Teşhisi başlat <b>↗</b></button></header>
      <section className={styles.cinemaHero}>
        <div className={styles.galaxy} aria-hidden="true">{Array.from({ length: 52 }).map((_, i) => <i key={i} />)}</div>
        <div className={styles.cinemaCopy}>
          <div className={styles.cinemaPill}>AKILLI İŞLETME ASİSTANI · KONTROL SİZDE</div>
          <h1>İşletmeniz için<br /><em>yaşayan bir sistem.</em></h1>
          <p>Talepleri, takibi ve tekrar eden işleri tek merkezde düzenleyin. Yapay zekâ hazırlar; önemli kararı siz verirsiniz.</p>
          <div className={styles.actions}><button>Ücretsiz mini teşhis <span>→</span></button><button>Canlı sistemi gör</button></div>
        </div>
        <div className={styles.cinemaPanel}><AssistantDashboard dark /></div>
        <div className={styles.cinemaTrust}><span>Otomatik ödeme yok</span><span>Açık onay kaydı</span><span>Ölçülebilir çalışma</span></div>
      </section>
      <Services dark />
      <Process dark />
      <FinalCta dark />
    </div>
  );
}

const lumenScenes = [
  ["01", "Müşteri kazanma", "Doğru müşteriye ulaşabileceğiniz fırsatları görünür hâle getirir."],
  ["02", "Müşteri takibi", "Yeni talepleri, geri dönüşleri ve hatırlatmaları tek düzende toplar."],
  ["03", "İş otomasyonu", "Tekrar eden uygun işleri kontrolünüzü koruyarak hızlandırır."],
  ["04", "Randevu ve rezervasyon", "Talep, onay, hatırlatma ve yeniden planlama adımlarını düzenler."],
];

function LumenScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [useStatic, setUseStatic] = useState(false);

  const goTo = (className: string) => {
    document.querySelector(`.${className}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
    const lowMemory = (navigatorWithMemory.deviceMemory ?? 16) < 6;
    if (reducedMotion || lowMemory) {
      setUseStatic(true);
      return;
    }

    const section = sectionRef.current;
    const video = videoRef.current;
    const galleryScroller = section?.closest<HTMLElement>(`.${styles.gallery}`) ?? null;
    if (!section || !video) return;
    const scrollTarget: HTMLElement | Window = galleryScroller ?? window;

    let frame = 0;
    const update = () => {
      frame = 0;
      const sectionRect = section.getBoundingClientRect();
      const viewportTop = galleryScroller?.getBoundingClientRect().top ?? 0;
      const viewportHeight = galleryScroller?.clientHeight ?? window.innerHeight;
      const distance = section.offsetHeight - viewportHeight;
      const progress = Math.min(1, Math.max(0, (viewportTop - sectionRect.top) / Math.max(distance, 1)));
      if (Number.isFinite(video.duration) && video.duration > 0) {
        const targetTime = progress * Math.max(video.duration - 0.04, 0);
        if (Math.abs(video.currentTime - targetTime) > 0.025) video.currentTime = targetTime;
      }
      setActiveScene(Math.min(lumenScenes.length - 1, Math.floor(progress * lumenScenes.length)));
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    scrollTarget.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    video.addEventListener("loadedmetadata", update);
    update();
    return () => {
      scrollTarget.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      video.removeEventListener("loadedmetadata", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className={styles.lumenScroll} ref={sectionRef} aria-label="Kaydırmalı premium AgentAxis deneyimi">
      <div className={styles.lumenSticky}>
        {useStatic ? (
          <img className={styles.lumenMedia} src="/media/lumen-arc-reference.png" alt="Işık ve porselen dokulu soyut Lumen Arc objesi" />
        ) : (
          <video
            ref={videoRef}
            className={styles.lumenMedia}
            src="/media/lumen-arc-scroll.mp4"
            poster="/media/lumen-arc-reference.png"
            muted
            playsInline
            preload="auto"
            aria-label="Kaydırma hareketine bağlı Lumen Arc obje animasyonu"
          />
        )}
        <div className={styles.lumenShade} aria-hidden="true" />
        <header className={styles.lumenNav}><Logo light /><nav><a href="/taslaklar/modern-premium/hizmetler">Hizmetler</a><a href="/taslaklar/modern-premium/nasil-calisir">Nasıl çalışır?</a><a href="/taslaklar/modern-premium/paketler">Paketler</a><a href="/taslaklar/modern-premium/kanit">Kanıt</a></nav><a className={styles.lumenNavCta} href="/taslaklar/modern-premium/iletisim">Ücretsiz inceleme <b>↗</b></a></header>
        <div className={styles.lumenCopy}>
          <div className={styles.lumenPill}><i /> İŞLETMENİZ İÇİN AKILLI SİSTEMLER <b>KONTROL SİZDE</b></div>
          <div className={styles.lumenHeadline}>
            <h1 className={styles.lumenHeadlineFirst}>Müşteriyi kaçırmayın.<br /><em>Takibi sisteme bırakın.</em></h1>
          </div>
          <p>Akıllı İşletme Asistanı talebi görür, ihtiyacı düzenler ve doğru sonraki adımı hazırlar. Gönderme ve hesap işlemleri sizin onayınızla ilerler.</p>
          <div className={styles.lumenActions}><button type="button" onClick={() => goTo(styles.finalCta)}>Ücretsiz mini teşhis <span>→</span></button><button type="button" onClick={() => goTo(styles.process)}>Nasıl çalıştığını gör</button></div>
        </div>
        <div className={styles.lumenScene} aria-live="polite">
          {lumenScenes.map(([no, title, text], index) => (
            <article key={no} className={activeScene === index ? styles.lumenSceneActive : ""}>
              <span>{no}</span><div><strong>{title}</strong><p>{text}</p></div>
            </article>
          ))}
        </div>
        <div className={styles.lumenProgress} aria-hidden="true">{lumenScenes.map((scene, index) => <i key={scene[0]} className={index <= activeScene ? styles.lumenProgressDone : ""} />)}</div>
        <div className={styles.lumenHint}>AŞAĞI KAYDIR · HAREKETİ KEŞFET <span>↓</span></div>
      </div>
    </section>
  );
}

export function LumenPackages() {
  const packages = [
    ["01", "Başlangıç", "Tek bir önemli soruna odaklanan küçük, güvenli ve ölçülebilir sistem."],
    ["02", "Büyüme", "Müşteri kazanma ve takip gibi birbiriyle bağlantılı birkaç iş akışı."],
    ["03", "Özel sistem", "İşletmenize özel otomasyon, takip ve randevu düzeninin birleşimi."],
  ];
  return <section className={styles.lumenInfoSection}><div className={styles.lumenInfoHead}><small>ESNEK ÇALIŞMA KAPSAMLARI</small><h2>İhtiyacınız kadar sistem kurulur.</h2><p>Önce problemi doğrularız; kullanmayacağınız özellikleri pakete doldurmayız.</p></div><div className={styles.lumenInfoGrid}>{packages.map(([no,title,text])=><article key={no}><span>{no}</span><h3>{title}</h3><p>{text}</p><a href="/taslaklar/modern-premium/iletisim">İhtiyacınızı anlatın →</a></article>)}</div></section>;
}

export function LumenProof() {
  const proof = [
    ["01", "Kaynaklı teşhis", "Problemin nerede olduğunu kanıtıyla gösteririz."],
    ["02", "Çalışan sistem", "Sunum değil, test edilmiş akış kurarız."],
    ["03", "Ölçülen değişim", "Çalışma sonunda yalnız gerçek sonucu raporlarız."],
  ];
  return <section className={`${styles.lumenInfoSection} ${styles.lumenProofSection}`}><div className={styles.lumenInfoHead}><small>ŞEFFAF ÇALIŞMA KANITI</small><h2>Ne yapıldığını görür, önemli işi siz onaylarsınız.</h2><p>Kaynağı, çalışan sistemi ve ölçülen sonucu birlikte görürsünüz.</p></div><div className={styles.lumenInfoGrid}>{proof.map(([no,title,text])=><article key={no}><span>{no}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}

export function LumenDraft() {
  return (
    <div className={`${styles.draft} ${styles.lumenDraft}`}>
      <LumenScrollHero />
      <CapabilityExperience />
      <WorkflowStory />
      <Services dark />
      <LumenProof />
      <Process dark />
      <FinalCta dark />
    </div>
  );
}

const spatialServices = [
  ["↗", "Müşteri kazanma", "Doğru fırsatı bulur"],
  ["◎", "Müşteri takibi", "Talebi kaybetmez"],
  ["⚡", "İş otomasyonu", "Tekrarı hızlandırır"],
  ["◇", "Randevu yönetimi", "Talebi düzenli takibe alır"],
];

function SpatialCore() {
  return (
    <div className={styles.spatialCore} aria-label="Akıllı İşletme Asistanı 3D iş akışı">
      <div className={styles.coreHalo} />
      <div className={styles.coreOrbitOne}><i /><i /><i /></div>
      <div className={styles.coreOrbitTwo}><i /><i /></div>
      <div className={styles.coreSphere}><span>Aİ</span><small>CANLI</small></div>
      <div className={`${styles.coreNode} ${styles.nodeOne}`}><i>↗</i><span><b>Yeni talep</b><small>Algılandı</small></span></div>
      <div className={`${styles.coreNode} ${styles.nodeTwo}`}><i>◎</i><span><b>İhtiyaç</b><small>Netleştirildi</small></span></div>
      <div className={`${styles.coreNode} ${styles.nodeThree}`}><i>✓</i><span><b>İnsan onayı</b><small>Kontrol sizde</small></span></div>
      <div className={`${styles.coreNode} ${styles.nodeFour}`}><i>↺</i><span><b>Takip</b><small>Planlandı</small></span></div>
    </div>
  );
}

function SpatialDraft() {
  const spatialRef = useRef<HTMLElement>(null);
  const [liteMode, setLiteMode] = useState(false);

  useEffect(() => {
    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
    const lowMemoryDevice = (navigatorWithMemory.deviceMemory ?? 16) <= 8;
    const limitedCpu = (navigator.hardwareConcurrency ?? 12) <= 8;
    setLiteMode(lowMemoryDevice || limitedCpu);
  }, []);

  function moveSpatial(event: ReactPointerEvent<HTMLElement>) {
    if (liteMode) return;
    const section = spatialRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    section.style.setProperty("--spatial-ry", `${x * 9}deg`);
    section.style.setProperty("--spatial-rx", `${y * -7}deg`);
    section.style.setProperty("--spatial-x", `${(x + 0.5) * 100}%`);
    section.style.setProperty("--spatial-y", `${(y + 0.5) * 100}%`);
  }

  function resetSpatial() {
    const section = spatialRef.current;
    if (!section) return;
    section.style.setProperty("--spatial-ry", "0deg");
    section.style.setProperty("--spatial-rx", "0deg");
  }

  return (
    <div className={`${styles.draft} ${styles.spatialDraft} ${liteMode ? styles.spatialLite : ""}`}>
      <header className={styles.spatialNav}><Logo light /><nav><span>Hizmetler</span><span>Nasıl çalışır?</span><span>Çalışma kanıtı</span></nav><button>Ücretsiz inceleme <b>↗</b></button></header>
      <section className={styles.spatialHero} ref={spatialRef} onPointerMove={moveSpatial} onPointerLeave={resetSpatial}>
        <div className={styles.spatialGrid} aria-hidden="true" />
        <div className={styles.spatialGlow} aria-hidden="true" />
        <div className={styles.spatialCopy}>
          <div className={styles.spatialPill}><i /> PREMIUM AI SİSTEMLERİ <b>3D DENEYİM</b></div>
          <h1>İşletmenizin<br />akışı artık<br /><em>görünür.</em></h1>
          <p>Talebi yakalayan, ihtiyacı düzenleyen ve doğru sonraki adımı hazırlayan Akıllı İşletme Asistanı. Önemli kararlar daima sizde.</p>
          <div className={styles.spatialActions}><button>Ücretsiz mini teşhis <span>→</span></button><button>Canlı akışı keşfet</button></div>
          <div className={styles.spatialTrust}><span>✓ Otomatik ödeme yok</span><span>✓ İnsan onayı</span></div>
        </div>
        <div className={styles.spatialStage}><SpatialCore /></div>
      </section>
      <section className={styles.spatialServices}>
        <div><small>TEK MERKEZ · DÖRT YETENEK</small><h2>Sizin yerinize çalışan<br />premium bir düzen.</h2></div>
        <div className={styles.spatialCardGrid}>
          {spatialServices.map(([icon, title, text], index) => <article key={title} style={{ "--card-i": index } as React.CSSProperties}><i>{icon}</i><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><b>Akışı gör ↗</b></article>)}
        </div>
      </section>
    </div>
  );
}

const drafts: Record<DraftId, { name: string; note: string; component: React.ReactNode }> = {
  lumen: { name: "E — Lumen Scroll", note: "Mert yöntemi · özgün sinematik pilot", component: <LumenDraft /> },
  guven: { name: "A — Açık Güven", note: "FintechX etkisi · en sade ve güven veren", component: <TrustDraft /> },
  hibrit: { name: "B — Premium Hibrit Pro", note: "Önerilen · hareketli ve etkileşimli", component: <HybridDraft /> },
  sinema: { name: "C — Sinematik AI", note: "New Era etkisi · en cesur görünüm", component: <CinemaDraft /> },
  ucboyut: { name: "D — 3D Akıllı Çekirdek", note: "FintechX × New Era · premium 3D demo", component: <SpatialDraft /> },
};

export default function DraftGallery() {
  const [active, setActive] = useState<DraftId>("lumen");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-premium-reveal="wait"]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.setAttribute("data-premium-reveal", "visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).setAttribute("data-premium-reveal", "visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [active]);

  return (
    <main className={styles.gallery}>
      <div className={styles.previewBar}>
        <div><strong>AgentAxis ana sayfa taslakları</strong><span>Canlı siteye uygulanmadı</span></div>
        <div className={styles.draftSwitch}>
          {(Object.keys(drafts) as DraftId[]).map((id) => <button key={id} className={active === id ? styles.selected : ""} onClick={() => setActive(id)}><strong>{drafts[id].name}</strong><small>{drafts[id].note}</small></button>)}
        </div>
      </div>
      {drafts[active].component}
    </main>
  );
}
