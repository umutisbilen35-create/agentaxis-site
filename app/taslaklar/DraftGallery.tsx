"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import ParticleCanvas from "./ParticleCanvas";
import NeedFinder from "../NeedFinder";
import styles from "./taslaklar.module.css";

type DraftId = "guven" | "hibrit" | "sinema";

const services = [
  ["01", "Müşteri kazanma", "Doğru müşteriye ulaşabileceğiniz fırsatları görünür hâle getirir."],
  ["02", "Müşteri takibi", "Yeni talepleri, geri dönüşleri ve hatırlatmaları tek düzende toplar."],
  ["03", "İş otomasyonu", "Tekrar eden uygun işleri kontrolünüzü koruyarak hızlandırır."],
  ["04", "Web sitesi", "İşinizi ilk bakışta anlatan ve müşteriyi doğru adıma taşıyan site kurar."],
];

const steps = [
  ["01", "İhtiyacı dinleriz", "İşletmenizi, müşterilerinizi ve yaşadığınız asıl sorunu net biçimde öğreniriz."],
  ["02", "Problemi doğrularız", "Küçük bir teşhisle sorunun nerede olduğunu ve size ne kaybettirdiğini görünür yaparız."],
  ["03", "Güvenli sistemi kurarız", "Uygun sistemi önce test eder, önemli işlemleri sizin onayınıza bağlarız."],
  ["04", "Birlikte ölçeriz", "7 günlük denemede yalnız doğrulanan değişimi anlaşılır bir raporla gösteririz."],
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
      <span>✓ 7 günlük ücretsiz deneme</span>
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
    ["↗", "Müşteri kazanma", "Doğru müşteriye ulaşabileceğiniz fırsatları bulur."],
    ["◎", "Müşteri takibi", "Yeni taleplerin ve geri dönüşlerin unutulmasını önler."],
    ["⚡", "İş otomasyonu", "Tekrar eden uygun işleri kontrollü biçimde hızlandırır."],
    ["◇", "Premium web sitesi", "İşinizi ilk bakışta anlatır ve güven oluşturur."],
  ];
  return (
    <aside className={styles.heroValuePanel} aria-label="Akıllı İşletme Asistanı hizmet özeti">
      <div className={styles.valuePanelTop}><span><i /> Akıllı İşletme Asistanı</span><small>İŞLETMENİZ İÇİN</small></div>
      <div className={styles.valuePanelTitle}><small>NELERİ İYİLEŞTİRİYORUZ?</small><h2>İhtiyacınız olan sistemi birlikte kuruyoruz.</h2></div>
      <div className={styles.valueServiceList}>
        {valueServices.map(([icon, title, text]) => (
          <button key={title} type="button" onClick={onOpenServices}>
            <i>{icon}</i><span><strong>{title}</strong><small>{text}</small></span><b>→</b>
          </button>
        ))}
      </div>
      <div className={styles.valuePanelTrust}><span>✓ 7 gün ücretsiz deneyin</span><span>✓ Önemli işler sizin onayınızda</span></div>
    </aside>
  );
}

function Services({ dark = false }: { dark?: boolean }) {
  return (
    <section className={`${styles.services} ${dark ? styles.servicesDark : ""}`} data-premium-reveal="wait">
      <div className={styles.sectionHeading}>
        <div><small>İŞLETMENİZ İÇİN</small><h2>Sizin yerinize çalışan bir düzen.</h2></div>
        <p>Her hizmet, işletmenizde görünür bir soruna ve ölçülebilir bir başlangıç hedefine bağlanır.</p>
      </div>
      <div className={styles.serviceGrid}>
        {services.map(([no, title, text]) => (
          <article key={no}><span>{no}</span><h3>{title}</h3><p>{text}</p><b>Detayı gör ↗</b></article>
        ))}
      </div>
    </section>
  );
}

function Process({ dark = false }: { dark?: boolean }) {
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

const sectorDemos = {
  klinik: {
    label: "Diş kliniği",
    headline: "Randevu talebini yarıda bırakmayın.",
    flow: ["WhatsApp talebi", "İhtiyacı anla", "Uygun saat", "İnsan onayı"],
    insight: "İlk yanıt, randevuya geçiş ve hatırlatma adımları görünür hâle gelir.",
  },
  emlak: {
    label: "Emlak",
    headline: "Alıcı ve satıcı taleplerini karıştırmayın.",
    flow: ["Yeni talep", "Bütçe ve bölge", "Uygun portföy", "Danışman devri"],
    insight: "Talep doğru danışmana, gerekli bilgilerle ve takip zamanı belirlenmiş olarak gider.",
  },
  restoran: {
    label: "Restoran",
    headline: "Rezervasyon konuşmasını net bir sonuca taşıyın.",
    flow: ["Masa talebi", "Kişi ve saat", "Uygunluk kontrolü", "Onay"],
    insight: "Tekrarlanan sorular azalır; ekip yalnız karar veya istisna gereken yerde devreye girer.",
  },
};

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
    icon: "⚡",
    title: "Tekrar eden uygun işi kontrollü biçimde hızlandırır",
    flow: ["İşi belirle", "Akışı hazırla", "İnsan onayı", "Çalışma kaydı"],
  },
  {
    id: "web",
    label: "Web sitesi",
    icon: "◇",
    title: "Ziyaretçiyi ne yaptığınızı anlamaktan doğru adıma götürür",
    flow: ["İlk izlenim", "Net hizmet", "Güven kanıtı", "Ücretsiz inceleme"],
  },
];

function CapabilityExperience() {
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

function SectorDemo() {
  const [sector, setSector] = useState<keyof typeof sectorDemos>("klinik");
  const demo = sectorDemos[sector];
  return (
    <section className={styles.sectorDemo} data-premium-reveal="wait">
      <div className={styles.sectorDemoIntro}>
        <small>SEKTÖRÜNÜZE GÖRE CANLI DEMO</small>
        <h2>Aynı şablon değil.<br /><em>Size uygun akış.</em></h2>
        <p>Bir sektör seçin; Akıllı İşletme Asistanı’nın o işletmede nasıl çalışacağını görün.</p>
        <div className={styles.sectorTabs} role="group" aria-label="Demo sektörü">
          {(Object.keys(sectorDemos) as Array<keyof typeof sectorDemos>).map((id) => (
            <button key={id} className={sector === id ? styles.sectorActive : ""} onClick={() => setSector(id)}>{sectorDemos[id].label}</button>
          ))}
        </div>
      </div>
      <div className={styles.sectorStage} key={sector}>
        <div className={styles.stageTop}><span><i /> {demo.label} akışı</span><small>ETKİLEŞİMLİ ÖRNEK</small></div>
        <h3>{demo.headline}</h3>
        <div className={styles.stageFlow}>
          {demo.flow.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < demo.flow.length - 1 && <i>→</i>}</div>)}
        </div>
        <p>{demo.insight}</p>
        <div className={styles.stageStatus}><span>✓ İnsan onayı korunur</span><span>✓ Her adım kaydedilir</span></div>
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

function WorkflowStory() {
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

type LivePanelId = "hizmetler" | "surec" | "demolar" | "paketler" | "kanit" | "iletisim";

function LivePanel({ panel, onClose, onRequest }: { panel: LivePanelId; onClose: () => void; onRequest: () => void }) {
  return (
    <div className={styles.liveOverlay} role="dialog" aria-modal="true" aria-label="AgentAxis bilgi paneli">
      <button className={styles.liveBackdrop} type="button" onClick={onClose} aria-label="Paneli kapat" />
      <div className={styles.liveModal}>
        <div className={styles.liveModalTop}><Logo /><button type="button" onClick={onClose}>Kapat <span>×</span></button></div>
        <div className={styles.liveModalBody}>
          {panel === "hizmetler" && <Services />}
          {panel === "surec" && <Process />}
          {panel === "demolar" && <section className={styles.catalogPanel}><small>CANLI DEMOLAR</small><h2>Sektörünüze uyarlanan sistemi önce görün.</h2><p>Hazır şablon dayatmıyoruz. İhtiyaca göre uyarlanan örnek akışı birlikte inceliyoruz.</p><div className={styles.catalogGrid}><article><span>01</span><h3>Diş kliniği</h3><p>WhatsApp talebi, randevuya geçiş, hatırlatma ve insan devralma akışı.</p><button type="button" onClick={onRequest}>Benzerini isteyin →</button></article><article><span>02</span><h3>Emlak</h3><p>Yeni talep, uygun portföy eşleşmesi, takip ve görüşme planlama akışı.</p><button type="button" onClick={onRequest}>Benzerini isteyin →</button></article><article><span>03</span><h3>Yerel işletme</h3><p>Müşteri soruları, teklif talebi, geri dönüş ve tekrar eden işlerin takibi.</p><button type="button" onClick={onRequest}>Benzerini isteyin →</button></article></div></section>}
          {panel === "paketler" && <section className={styles.catalogPanel}><small>ESNEK ÇALIŞMA KAPSAMLARI</small><h2>İhtiyacınız kadar sistem kurulur.</h2><p>Önce problemi doğrularız; kullanmayacağınız özellikleri pakete doldurmayız.</p><div className={styles.catalogGrid}><article><span>01</span><h3>Başlangıç</h3><p>Tek bir önemli soruna odaklanan küçük, güvenli ve ölçülebilir sistem.</p><button type="button" onClick={onRequest}>İhtiyacınızı anlatın →</button></article><article><span>02</span><h3>Büyüme</h3><p>Müşteri kazanma ve takip gibi birbiriyle bağlantılı birkaç iş akışı.</p><button type="button" onClick={onRequest}>İhtiyacınızı anlatın →</button></article><article><span>03</span><h3>Özel sistem</h3><p>İşletmenize özel web sitesi, otomasyon ve takip düzeninin birleşimi.</p><button type="button" onClick={onRequest}>İhtiyacınızı anlatın →</button></article></div><div className={styles.catalogTrust}>✓ 7 gün ücretsiz deneyin <span>✓ Otomatik ödeme yok</span> <span>✓ Önemli işler sizin onayınızda</span></div></section>}
          {panel === "kanit" && <section className={styles.modalProof}><small>ŞEFFAF ÇALIŞMA KANITI</small><h2>Kaynağı, çalışan sistemi ve ölçülen sonucu birlikte görürsünüz.</h2><div className={styles.proofCards}><article><span>01</span><strong>Kaynaklı teşhis</strong><p>Problemin nerede olduğunu kanıtıyla gösteririz.</p></article><article><span>02</span><strong>Çalışan sistem</strong><p>Sunum değil, test edilmiş akış kurarız.</p></article><article><span>03</span><strong>Sizin kontrolünüz</strong><p>Önemli dış işlemler açık onayınızla ilerler.</p></article></div></section>}
          {panel === "iletisim" && <section className={styles.liveFinder}><div><small>ÜCRETSİZ MİNİ TEŞHİS</small><h2>İşletmenizi anlatın, doğru başlangıcı birlikte bulalım.</h2><p>Yaklaşık iki dakikada ihtiyacınızı seçin. Otomatik ödeme yok; önemli işlemler sizin onayınızda kalır.</p></div><NeedFinder /></section>}
        </div>
      </div>
    </div>
  );
}

export function HybridDraft({ live = false }: { live?: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const [livePanel, setLivePanel] = useState<LivePanelId | null>(null);

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
    const closeWithEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setLivePanel(null); };
    document.addEventListener("keydown", closeWithEscape);
    return () => document.removeEventListener("keydown", closeWithEscape);
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
    <div className={`${styles.draft} ${styles.hybridDraft} ${live ? styles.liveRoot : ""}`}>
      <header className={styles.hybridNav}><Logo /><nav><button type="button" onClick={() => live && setLivePanel("hizmetler")}><i>◇</i> Hizmetler</button><button type="button" onClick={() => live && setLivePanel("surec")}><i>↺</i> Nasıl çalışır?</button><button type="button" onClick={() => live && setLivePanel("demolar")}><i>▶</i> Demolar</button><button type="button" onClick={() => live && setLivePanel("paketler")}><i>▦</i> Paketler</button><button type="button" onClick={() => live && setLivePanel("kanit")}><i>✓</i> Kanıt</button><button type="button" onClick={() => live && setLivePanel("iletisim")}><i>✎</i> İhtiyacınızı anlatın</button></nav><button type="button" onClick={() => live && setLivePanel("iletisim")}>Ücretsiz inceleme <b>↗</b></button></header>
      <section className={styles.hybridHero} ref={heroRef} onPointerMove={moveHero} onPointerLeave={resetHero}>
        <ParticleCanvas className={styles.particleCanvas} />
        <div className={styles.pointerGlow} aria-hidden="true" />
        <div className={styles.auroraOne} aria-hidden="true" />
        <div className={styles.auroraTwo} aria-hidden="true" />
        <div className={styles.hybridCopy}>
          <div className={styles.livePill}><i /> İŞLETMENİZ İÇİN AKILLI SİSTEMLER <b>KONTROL SİZDE</b></div>
          <h1>Müşteriyi kaçırmayın.<br /><em>Takibi sisteme bırakın.</em></h1>
          <p>Akıllı İşletme Asistanı talebi görür, ihtiyacı düzenler ve doğru sonraki adımı hazırlar. Gönderme ve hesap işlemleri sizin onayınızla ilerler.</p>
          <div className={styles.actions}><button type="button" onClick={() => live && setLivePanel("iletisim")}>Ücretsiz mini teşhis <span>→</span></button><button type="button" onClick={() => live && setLivePanel("surec")}>Nasıl çalıştığını gör</button></div>
          <TrustStrip />
        </div>
        <div className={styles.hybridVisual}>
          <HeroValuePanel onOpenServices={() => live && setLivePanel("hizmetler")} />
        </div>
      </section>
      <CapabilityExperience />
      <WorkflowStory />
      <SectorDemo />
      <Services />
      <section className={styles.hybridProof} data-premium-reveal="wait">
        <div><small>ŞEFFAF ÇALIŞMA KANITI</small><h2>Ne yapıldığını görür,<br />önemli işi siz onaylarsınız.</h2></div>
        <div className={styles.proofCards}><article><span>01</span><strong>Kaynaklı teşhis</strong><p>Problemin nerede olduğunu kanıtıyla gösteririz.</p></article><article><span>02</span><strong>Çalışan sistem</strong><p>Sunum değil, test edilmiş akış kurarız.</p></article><article><span>03</span><strong>Ölçülen değişim</strong><p>7 gün sonunda yalnız gerçek sonucu raporlarız.</p></article></div>
      </section>
      <Process />
      <PremiumFinalCta onStart={() => live && setLivePanel("iletisim")} />
      {live && <footer className={styles.premiumFooter}><Logo /><span>© 2026 AgentAxis Labs</span><a href="mailto:agentaxislabs@gmail.com">agentaxislabs@gmail.com</a><a href="/gizlilik">Gizlilik</a><a href="/kullanim-kosullari">Kullanım koşulları</a></footer>}
      {livePanel && <LivePanel panel={livePanel} onClose={() => setLivePanel(null)} onRequest={() => setLivePanel("iletisim")} />}
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
        <div className={styles.cinemaTrust}><span>7 gün ücretsiz</span><span>Otomatik ödeme yok</span><span>Açık onay kaydı</span><span>Ölçülebilir çalışma</span></div>
      </section>
      <Services dark />
      <Process dark />
      <FinalCta dark />
    </div>
  );
}

const drafts: Record<DraftId, { name: string; note: string; component: React.ReactNode }> = {
  guven: { name: "A — Açık Güven", note: "FintechX etkisi · en sade ve güven veren", component: <TrustDraft /> },
  hibrit: { name: "B — Premium Hibrit Pro", note: "Önerilen · hareketli ve etkileşimli", component: <HybridDraft /> },
  sinema: { name: "C — Sinematik AI", note: "New Era etkisi · en cesur görünüm", component: <CinemaDraft /> },
};

export default function DraftGallery() {
  const [active, setActive] = useState<DraftId>("hibrit");

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
