const services = [
  {
    no: "01",
    title: "Dijital durum analizi",
    text: "Google Haritalar, web sitesi ve müşteri yolculuğunuzdaki gerçek fırsatları kanıtlarla belirleriz.",
  },
  {
    no: "02",
    title: "Yapay zekâ otomasyonları",
    text: "Tekrarlanan işleri sadeleştirir, ekibinizin zamanını müşteriye ve büyümeye geri kazandırırız.",
  },
  {
    no: "03",
    title: "30 günlük uygulama planı",
    text: "Karmaşık raporlar yerine, önceliklendirilmiş ve ölçülebilir bir yol haritası sunarız.",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="AgentAxis Labs ana sayfa">
          <span className="brandMark" aria-hidden="true"><i /></span>
          <span>AgentAxis <b>Labs</b></span>
        </a>
        <a className="navCta" href="#iletisim">Ücretsiz rapor iste</a>
      </nav>

      <section className="hero shell" id="top">
        <div className="heroCopy">
          <p className="eyebrow"><span /> Yerel işletmeler için AI sistemleri</p>
          <h1>İşletmenizi ileri taşıyan <em>yapay zekâ sistemleri.</em></h1>
          <p className="lead">
            Müşteri kazanma süreçlerinizi analiz ediyor, tekrarlanan işleri otomatikleştiriyor ve uygulanabilir bir büyüme planına dönüştürüyoruz.
          </p>
          <div className="heroActions">
            <a className="primary" href="#iletisim">Ücretsiz durum raporu al <span>→</span></a>
            <a className="secondary" href="#nasil">Nasıl çalışıyoruz?</a>
          </div>
          <div className="trustRow">
            <span>✓ Kanıta dayalı analiz</span>
            <span>✓ Şeffaf süreç</span>
            <span>✓ Abartılı garanti yok</span>
          </div>
        </div>

        <div className="axisCard" aria-label="Analizden uygulamaya süreç şeması">
          <div className="axisLine" />
          <div className="axisNode active"><small>01</small><strong>Analiz</strong><span>Mevcut durum</span></div>
          <div className="axisNode"><small>02</small><strong>Strateji</strong><span>Doğru öncelikler</span></div>
          <div className="axisNode"><small>03</small><strong>Otomasyon</strong><span>Ölçülebilir sistem</span></div>
          <div className="metric"><b>30</b><span>günlük net<br />uygulama planı</span></div>
        </div>
      </section>

      <section className="proof">
        <div className="shell proofGrid">
          <p>İlk adım satış değil, <b>mevcut durumunuzu doğru anlamaktır.</b></p>
          <div><strong>1 sayfa</strong><span>Sade ve anlaşılır rapor</span></div>
          <div><strong>3–5 fırsat</strong><span>Gerçek veriye dayalı öneri</span></div>
          <div><strong>0 baskı</strong><span>Karar tamamen size ait</span></div>
        </div>
      </section>

      <section className="section shell" id="nasil">
        <div className="sectionHead">
          <p className="eyebrow"><span /> Çalışma modeli</p>
          <h2>Karmaşayı üç net adıma indiriyoruz.</h2>
        </div>
        <div className="serviceGrid">
          {services.map((service) => (
            <article key={service.no}>
              <span className="serviceNo">{service.no}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="report shell">
        <div>
          <p className="eyebrow light"><span /> Başlangıç hizmeti</p>
          <h2>Google Haritalar Dijital Durum Raporu</h2>
          <p>İşletmenizin bölgesindeki görünürlüğünü, rakip konumunu ve iyileştirme fırsatlarını tek sayfada görün.</p>
        </div>
        <ul>
          <li><i>01</i> Doğrulanmış rakip karşılaştırması</li>
          <li><i>02</i> Güçlü yönler ve açık fırsatlar</li>
          <li><i>03</i> Hesap erişimi gerektirmeyen öneriler</li>
          <li><i>04</i> 30 günlük uygulanabilir yol haritası</li>
        </ul>
      </section>

      <section className="contact shell" id="iletisim">
        <div>
          <p className="eyebrow"><span /> İlk adımı atalım</p>
          <h2>İşletmeniz için ücretsiz bir dijital durum raporu hazırlayalım.</h2>
        </div>
        <a className="primary" href="mailto:umutisbilen35@gmail.com?subject=Ücretsiz%20Dijital%20Durum%20Raporu">Raporumu iste <span>→</span></a>
      </section>

      <footer className="shell">
        <a className="brand" href="#top"><span className="brandMark" aria-hidden="true"><i /></span><span>AgentAxis <b>Labs</b></span></a>
        <p>Yerel işletmeler için güvenilir yapay zekâ sistemleri.</p>
        <span>© 2026 AgentAxis Labs</span>
      </footer>
    </main>
  );
}
