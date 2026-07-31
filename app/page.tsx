"use client";

import { useState } from "react";
import NeedFinder from "./NeedFinder";

type TabId = "anasayfa" | "hizmetler" | "surec" | "kanit" | "iletisim";

const services = [
  {
    no: "01",
    icon: "↗",
    title: "Müşteri kazanma",
    text: "Dijital görünürlüğünüzü ve rakiplerinizi inceler, daha fazla doğru müşteriye ulaşabileceğiniz fırsatları belirleriz.",
    result: "Daha doğru fırsatlar",
  },
  {
    no: "02",
    icon: "◎",
    title: "Müşteri takibi",
    text: "Yeni talepleri, geri dönüşleri ve hatırlatmaları tek düzende toplarız. Hangi müşteriye ne zaman dönüleceği unutulmaz.",
    result: "Daha düzenli takip",
  },
  {
    no: "03",
    icon: "⚡",
    title: "İş otomasyonu",
    text: "Her gün tekrar ettiğiniz uygun işleri belirler, insan kontrolünü koruyan basit otomasyonlar kurarız.",
    result: "Daha az tekrar işi",
  },
  {
    no: "04",
    icon: "◇",
    title: "Web sitesi",
    text: "Ne yaptığınızı ilk bakışta anlatan, mobilde düzgün çalışan ve müşteriyi doğru adıma yönlendiren siteler hazırlarız.",
    result: "Daha anlaşılır dijital vitrin",
  },
  {
    no: "05",
    icon: "↺",
    title: "Eski müşterileri kazanma",
    text: "Uygun izinlere sahip eski müşteri listeniz için düzenli, kontrollü ve ölçülebilir bir yeniden iletişim planı hazırlarız.",
    result: "Değerli ilişkileri canlandırma",
  },
];

const steps = [
  ["01", "Dinleriz", "İşletmenizi, müşterilerinizi ve yaşadığınız sorunu öğreniriz."],
  ["02", "Doğrularız", "Herkese açık veriler ve sizin verdiğiniz bilgilerle gerçek ihtiyacı buluruz."],
  ["03", "Kurarız", "Uygun sistemi 10 günlük ücretsiz Akıllı İşletme Asistanı denemesi olarak hazırlarız."],
  ["04", "Birlikte ölçeriz", "10 gün sonunda neyin işe yaradığını açık bir raporla gösteririz."],
];

const faqs = [
  ["Akıllı İşletme Asistanı nedir?", "İşletmenizin ihtiyaçlarını analiz eden, en faydalı işleri sıraya koyan ve uygulanacak sistemi anlaşılır bir plana dönüştüren dijital iş asistanıdır."],
  ["İşletmeme nasıl yardımcı olur?", "Müşteri takibi, tekrar eden işler ve web sitesi gibi alanları inceler. İşletmeniz için en değerli başlangıç noktasını bulup uygulanabilir adımları hazırlar."],
  ["10 günlük ücretsiz deneme nasıl çalışır?", "Bir hedef seçer, sınırlı kapsamda çalışan sistemi kurar ve 10 gün boyunca birlikte ölçeriz. Deneme ücretsizdir ve otomatik olarak ücretli hizmete dönüşmez."],
  ["Neden AgentAxis’e güvenebilirim?", "Her önemli adımı size gösteririz. Analiz kaynaklarını, verilen izinleri, yapılan işleri ve ölçülen değişimi açık biçimde paylaşırız; kontrol her zaman sizde kalır."],
  ["Verilerim ve hesaplarım güvende mi?", "Yalnız gerekli olan en düşük erişimi kullanırız. Yetki sınırlarını önceden birlikte belirler, önemli hesap işlemlerini sizin açık onayınızla yaparız."],
  ["10 günün sonunda ne olur?", "Ortaya çıkan sistemi ve ölçüm sonuçlarını birlikte inceleriz. Size fayda sağlıyorsa devam seçeneğini konuşuruz; otomatik ödeme veya zorunlu geçiş olmaz."],
  ["Akıllı İşletme Asistanı her şeyi benim yerime mi yapar?", "Uygun rutin işleri düzenler ve hızlandırır. Önemli kararlar, mesajlar ve hesap işlemleri sizin kontrolünüzde kalır."],
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("anasayfa");
  const [sector, setSector] = useState("");

  function tabAc(tab: TabId) {
    setActiveTab(tab);
  }

  function sektoruAsistanaGonder(event: React.FormEvent) {
    event.preventDefault();
    if (!sector.trim()) return;
    setActiveTab("iletisim");
  }

  return (
    <main>
      <nav className="nav shell" aria-label="Ana menü">
        <button className="brand brandButton" type="button" onClick={() => tabAc("anasayfa")} aria-label="AgentAxis Labs ana sayfa">
          <span className="brandMark" aria-hidden="true"><i /></span>
          <span>AgentAxis <b>Labs</b></span>
        </button>
        <div className="navLinks" role="tablist" aria-label="Site bölümleri">
          <button className={activeTab === "hizmetler" ? "active" : ""} type="button" onClick={() => tabAc("hizmetler")} role="tab" aria-selected={activeTab === "hizmetler"}>Hizmetler</button>
          <button className={activeTab === "surec" ? "active" : ""} type="button" onClick={() => tabAc("surec")} role="tab" aria-selected={activeTab === "surec"}>Nasıl çalışır?</button>
          <button className={activeTab === "kanit" ? "active" : ""} type="button" onClick={() => tabAc("kanit")} role="tab" aria-selected={activeTab === "kanit"}>Çalışma kanıtı</button>
          <button className={`navCta ${activeTab === "iletisim" ? "active" : ""}`} type="button" onClick={() => tabAc("iletisim")} role="tab" aria-selected={activeTab === "iletisim"}>Ücretsiz inceleme iste</button>
        </div>
      </nav>

      <div className="tabStage">
      <section className="tabPanel homePanel" hidden={activeTab !== "anasayfa"} aria-label="Ana sayfa">
      <div className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow"><span /> Yerel işletmeler için uygulamalı yapay zekâ</p>
          <h1>İşletmenizi büyüten dijital sistemi <em>birlikte kuruyoruz.</em></h1>
          <p className="lead">
            Akıllı İşletme Asistanı işletmenizi inceler; müşteri kazanma, takip, otomasyon ve web sitesi alanlarında en değerli fırsatı bulur. Uygulama sizin bilginiz ve kontrolünüz altında ilerler.
          </p>
          <div className="heroActions">
            <button className="primary" type="button" onClick={() => tabAc("iletisim")}>Ücretsiz ön inceleme iste <span>→</span></button>
            <button className="secondary linkButton" type="button" onClick={() => tabAc("surec")}>Süreç nasıl işliyor?</button>
          </div>
          <div className="trustRow" aria-label="Güven ilkelerimiz">
            <span>✓ 10 günlük ücretsiz Akıllı İşletme Asistanı denemesi</span>
            <span>✓ Otomatik ödeme yok</span>
            <span>✓ Önemli işlemler sizin onayınızda</span>
          </div>
        </div>

        <aside className="heroPanel" aria-label="Akıllı İşletme Asistanı güven ve kontrol özeti">
          <div className="assistantBadge"><span>Aİ</span><div><small>DİJİTAL İŞ ASİSTANINIZ</small><strong>Akıllı İşletme Asistanı</strong></div><i>Kontrol sizde</i></div>
          <h2>Sektörünüzü söyleyin, size nasıl yardımcı olabileceğimizi gösterelim.</h2>
          <div className="assistantServices" aria-label="Akıllı İşletme Asistanı hizmetleri">
            {services.map((service) => <span key={service.no}><i>{service.icon}</i>{service.title}</span>)}
          </div>
          <form className="heroAssistantForm" onSubmit={sektoruAsistanaGonder}>
            <label htmlFor="sector">Hangi sektörde hizmet veriyorsunuz?</label>
            <div><input id="sector" value={sector} onChange={(event) => setSector(event.target.value)} placeholder="Örn. emlak, klinik, restoran…" /><button type="submit" disabled={!sector.trim()}>Asistana anlat <span>→</span></button></div>
          </form>
          <div className="panelControls"><span>✓ Önemli işleri siz onaylarsınız</span><span>✓ Yapılan işi açıkça görürsünüz</span></div>
        </aside>
      </div>

      <section className="homeServices" aria-label="Tüm hizmetlerimiz">
        <div className="shell">
          <div className="homeServicesHead"><div><small>İHTİYACINIZ OLABİLECEK HİZMETLER</small><h2>Akıllı İşletme Asistanı işletmeniz için doğru başlangıcı bulur.</h2></div><button type="button" onClick={() => tabAc("hizmetler")}>Tüm detayları gör <span>→</span></button></div>
          <div className="homeServiceGrid">
            {services.map((service) => <button type="button" key={service.no} onClick={() => tabAc("hizmetler")}><i>{service.icon}</i><strong>{service.title}</strong><small>{service.result}</small></button>)}
          </div>
          <div className="exampleOutcome" aria-label="Klinikler için örnek otomasyon hedefi">
            <div><small>KLİNİKLER İÇİN ÖRNEK OTOMASYON HEDEFİ</small><strong><b>%30</b> daha az randevuya gelmeme</strong></div>
            <p>Hatırlatma, onay ve takip akışlarıyla boş kalan randevuları azaltmaya yönelik sistem kurabiliriz.</p>
            <span>Hedef, mevcut veriler incelendikten sonra işletmeye özel belirlenir.</span>
          </div>
          <div className="controlPromise">
            <strong>Güven sözümüz:</strong>
            <span>Şeffaf kapsam</span><span>Sizin açık onayınız</span><span>Ölçülebilir çalışma</span><span>Otomatik ödeme yok</span>
          </div>
        </div>
      </section>
      </section>

      <section className="tabPanel" hidden={activeTab !== "hizmetler"} aria-label="Hizmetler">
      <div className="section shell">
        <div className="sectionHead">
          <div>
            <p className="eyebrow"><span /> Hizmetler</p>
            <h2>İşletmeniz için ne kuruyoruz?</h2>
          </div>
          <p>Her şeyi aynı anda satmaya çalışmayız. İnceleme sonucunda en faydalı başlangıç noktasını birlikte seçeriz.</p>
        </div>
        <div className="serviceGrid">
          {services.map((service) => (
            <article key={service.no}>
              <div className="serviceTop"><span>{service.icon}</span><small>{service.result}</small></div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </div>
      </section>

      <section className="tabPanel processSection" hidden={activeTab !== "surec"} aria-label="Nasıl çalışır?">
        <div className="shell">
          <div className="processIntro">
            <p className="eyebrow light"><span /> Basit ve kontrollü süreç</p>
            <h2>Dört adımda, ne olduğunu bilerek ilerleyin.</h2>
            <p>Teknik karmaşayı biz yönetiriz. Siz her aşamada ne yapıldığını ve sıradaki adımı bilirsiniz.</p>
          </div>
          <div className="processGrid">
            {steps.map(([no, title, text]) => (
              <article key={no}><span>{no}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="tabPanel" hidden={activeTab !== "kanit"} aria-label="Çalışma kanıtı">
      <div className="evidence shell">
        <div className="evidenceCopy">
          <p className="eyebrow"><span /> Şeffaf çalışma kanıtı</p>
          <h2>Yaptığımız işi açık ve doğrulanabilir biçimde gösteriyoruz.</h2>
          <p>Örnek analizleri gerçek müşteri sonucu gibi sunmayız. Bir çalışmayı ancak kaynağı, çalışan sistemi ve ölçülen sonucu görülebiliyorsa kanıt kabul ederiz.</p>
        </div>
        <div className="evidenceChecklist">
          <article><span>01</span><div><strong>Kaynaklı analiz</strong><p>Her bulgunun nereden geldiği açıkça gösterilir.</p></div></article>
          <article><span>02</span><div><strong>Çalışan sistem</strong><p>Sunum değil, gerçek kullanımda çalışan Akıllı İşletme Asistanı sistemi kurulur.</p></div></article>
          <article><span>03</span><div><strong>Ölçülebilir sonuç</strong><p>10 günlük denemede yalnız gerçekten ölçülen değişim raporlanır.</p></div></article>
          <article><span>04</span><div><strong>Sizin kontrolünüz</strong><p>Mesaj, yayın ve hesap işlemleri açık onayınız olmadan yapılmaz.</p></div></article>
        </div>
        <div className="evidenceRule">
          <b>Neyi kanıt sayıyoruz?</b>
          <span>Kaynağı görülebilen analiz, çalışan sistem, açık onay kaydı ve ücretsiz deneme sonunda ölçülen gerçek sonuç.</span>
        </div>
      </div>
      </section>

      <section className="tabPanel" hidden={activeTab !== "iletisim"} aria-label="Ücretsiz inceleme">
      <div className="finderSection shell">
        <div>
          <div className="finderCopy">
            <p className="eyebrow"><span /> Ücretsiz ön inceleme</p>
            <h2>İşletmenizi anlatın, uygun başlangıcı birlikte bulalım.</h2>
            <p>Akıllı İşletme Asistanı; işletmenizi anlamaya, en değerli fırsatı seçmeye ve uygulanabilir başlangıç planını oluşturmaya yardımcı olur.</p>
          </div>
          <div className="compactFaq">
            <h3>Akıllı İşletme Asistanı hakkında merak edilenler</h3>
            {faqs.map(([question, answer]) => (
              <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>
            ))}
          </div>
        </div>
        <NeedFinder initialBusiness={sector} />
      </div>
      <footer className="shell compactFooter">
        <span>© 2026 AgentAxis Labs</span><a href="mailto:agentaxislabs@gmail.com">agentaxislabs@gmail.com</a><a href="/gizlilik">Gizlilik</a><a href="/kullanim-kosullari">Kullanım koşulları</a>
      </footer>
      </section>
      </div>
    </main>
  );
}
