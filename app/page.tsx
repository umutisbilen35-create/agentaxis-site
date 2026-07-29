import NeedFinder from "./NeedFinder";

const services = [
  {
    no: "01",
    title: "Müşteri takibi",
    text: "Yeni talepleri, geri dönüşleri ve hatırlatmaları tek düzende toplarız. Hangi müşteriye ne zaman dönüleceği unutulmaz.",
    result: "Daha düzenli takip",
  },
  {
    no: "02",
    title: "İş otomasyonu",
    text: "Her gün tekrar ettiğiniz uygun işleri belirler, insan kontrolünü koruyan basit otomasyonlar kurarız.",
    result: "Daha az tekrar işi",
  },
  {
    no: "03",
    title: "Web sitesi",
    text: "Ne yaptığınızı ilk bakışta anlatan, mobilde düzgün çalışan ve müşteriyi doğru adıma yönlendiren siteler hazırlarız.",
    result: "Daha anlaşılır dijital vitrin",
  },
];

const steps = [
  ["01", "Dinleriz", "İşletmenizi, müşterilerinizi ve yaşadığınız sorunu öğreniriz."],
  ["02", "Doğrularız", "Herkese açık veriler ve sizin verdiğiniz bilgilerle gerçek ihtiyacı buluruz."],
  ["03", "Kurarız", "Uygun sistemi küçük ve ölçülebilir bir pilot olarak hazırlarız."],
  ["04", "Birlikte ölçeriz", "10 gün sonunda neyin işe yaradığını açık bir raporla gösteririz."],
];

const faqs = [
  ["Her işletmeye aynı sistemi mi kuruyorsunuz?", "Hayır. Önce mevcut iş akışınızı inceleriz. Yalnız doğrulanan ihtiyaca uygun çözümü öneririz."],
  ["10 günlük pilot gerçekten ücretsiz mi?", "Evet. Bir işletmeye bir kez sunulur ve süre sonunda kendiliğinden ücretli hizmete dönüşmez."],
  ["Hesap şifrelerimi vermem gerekir mi?", "İlk inceleme için hayır. Sonraki aşamada bir bağlantı gerekirse nedenini ve yetki sınırını önceden açıklarız."],
  ["Kesin müşteri veya gelir garantisi veriyor musunuz?", "Hayır. Kanıtlanmamış sonuç sözü vermeyiz. Pilot boyunca ölçebildiğimiz gerçek değişimi raporlarız."],
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Ana menü">
        <a className="brand" href="#top" aria-label="AgentAxis Labs ana sayfa">
          <span className="brandMark" aria-hidden="true"><i /></span>
          <span>AgentAxis <b>Labs</b></span>
        </a>
        <div className="navLinks">
          <a href="#hizmetler">Hizmetler</a>
          <a href="#surec">Nasıl çalışır?</a>
          <a href="#kanit">Çalışma kanıtı</a>
          <a className="navCta" href="#iletisim">Ücretsiz inceleme iste</a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="heroCopy">
          <p className="eyebrow"><span /> Yerel işletmeler için uygulamalı yapay zekâ</p>
          <h1>Kaçan müşterileri ve tekrar eden işleri <em>düzene koyuyoruz.</em></h1>
          <p className="lead">
            İşletmenizi inceliyor; müşteri takibi, iş otomasyonu veya web sitesi tarafında gerçekten ihtiyaç duyduğunuz sistemi kuruyoruz.
          </p>
          <div className="heroActions">
            <a className="primary" href="#iletisim">Ücretsiz ön inceleme iste <span>→</span></a>
            <a className="secondary" href="#surec">Süreç nasıl işliyor?</a>
          </div>
          <div className="trustRow" aria-label="Güven ilkelerimiz">
            <span>✓ 10 günlük ücretsiz pilot</span>
            <span>✓ Otomatik ödeme yok</span>
            <span>✓ Önemli işlemler sizin onayınızda</span>
          </div>
        </div>

        <aside className="heroPanel" aria-label="AgentAxis çalışma özeti">
          <p>İLK GÖRÜŞMEDE</p>
          <h2>Önce sorunu netleştiririz.</h2>
          <ul>
            <li><span>01</span><div><b>Mevcut durumu görürüz</b><small>Google, web sitesi ve iş akışı</small></div></li>
            <li><span>02</span><div><b>En önemli fırsatı seçeriz</b><small>Gereksiz hizmet eklemeyiz</small></div></li>
            <li><span>03</span><div><b>Deneme planını açıklarız</b><small>Kapsam, izin ve olası maliyetler</small></div></li>
          </ul>
          <div className="panelNote"><strong>Sonuç:</strong> Ne yapılacağı, neden yapılacağı ve nasıl ölçüleceği belli bir başlangıç planı.</div>
        </aside>
      </section>

      <section className="clarityBar">
        <div className="shell">
          <strong>Fikir veya sunum değil.</strong>
          <span>Çalışan, ölçülen ve önemli adımları sizin kontrolünüzde kalan sistemler.</span>
        </div>
      </section>

      <section className="section shell" id="hizmetler">
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
              <div className="serviceTop"><span>{service.no}</span><small>{service.result}</small></div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="processSection" id="surec">
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

      <section className="evidence shell" id="kanit">
        <div className="evidenceCopy">
          <p className="eyebrow"><span /> Şeffaf çalışma kanıtı</p>
          <h2>Henüz büyük sonuçlar uydurmuyoruz. Yaptığımız işi olduğu gibi gösteriyoruz.</h2>
          <p>AgentAxis erken aşamada bir uygulamalı yapay zekâ stüdyosudur. Bu nedenle müşteri sonucu gibi sunulan yapay rakamlar veya sahte yorumlar kullanmıyoruz.</p>
        </div>
        <div className="evidenceGrid">
          <article><strong>3</strong><span>Herkese açık verilerle hazırlanmış örnek işletme analizi</span></article>
          <article><strong>10 gün</strong><span>Gerçek kullanımda ölçülen, ücretsiz ve tek kullanımlık pilot</span></article>
          <article><strong>0</strong><span>Kullanıcı onayı olmadan yapılan dış işlem</span></article>
        </div>
        <div className="evidenceRule">
          <b>Neyi kanıt sayıyoruz?</b>
          <span>Kaynağı görülebilen analiz, çalışan sistem, açık onay kaydı ve pilot sonunda ölçülen gerçek sonuç.</span>
        </div>
      </section>

      <section className="finderSection shell" id="ihtiyac">
        <div className="finderCopy">
          <p className="eyebrow"><span /> Nereden başlayacağınızı bilmiyor musunuz?</p>
          <h2>İşletmenizi anlatın, uygun başlangıcı birlikte bulalım.</h2>
          <p>Jarvis yalnız verdiğiniz bilgilere göre ön seçenekleri gösterir. Kesin öneri, gerçek incelemeden sonra hazırlanır.</p>
        </div>
        <NeedFinder />
      </section>

      <section className="faq shell" id="sss">
        <div>
          <p className="eyebrow"><span /> Sık sorulanlar</p>
          <h2>Başlamadan önce bilmeniz gerekenler.</h2>
        </div>
        <div className="faqList">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<span>+</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact shell" id="iletisim">
        <div>
          <p className="eyebrow light"><span /> İlk adım</p>
          <h2>İşletmenizdeki en değerli fırsatı birlikte bulalım.</h2>
          <p>İlk görüşme satış baskısı içermez. Mevcut durumunuzu dinler, uygun başlangıç olup olmadığını açıkça söyleriz.</p>
        </div>
        <a className="primary lightButton" href="mailto:umutisbilen35@gmail.com?subject=AgentAxis%20Ücretsiz%20Ön%20İnceleme">Ücretsiz inceleme iste <span>→</span></a>
      </section>

      <footer className="shell">
        <div>
          <a className="brand" href="#top"><span className="brandMark" aria-hidden="true"><i /></span><span>AgentAxis <b>Labs</b></span></a>
          <p>Yerel işletmeler için anlaşılır ve kontrollü yapay zekâ sistemleri.</p>
        </div>
        <div className="footerContact"><small>İletişim</small><a href="mailto:umutisbilen35@gmail.com">umutisbilen35@gmail.com</a></div>
        <div className="footerLinks"><a href="/gizlilik">Gizlilik</a><a href="/kullanim-kosullari">Kullanım koşulları</a><span>© 2026 AgentAxis Labs</span></div>
      </footer>
    </main>
  );
}
