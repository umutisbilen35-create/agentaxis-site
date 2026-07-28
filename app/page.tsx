import NeedFinder from "./NeedFinder";

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
          <p className="eyebrow"><span /> Daha az iş yükü, daha çok müşteri</p>
          <h1>Müşteriyi kaçırmayın. <em>İş yükünü yapay zekâya bırakın.</em></h1>
          <p className="lead">
            Hangi sektörde olursanız olun; geç cevaplanan talepler, unutulan takipler ve her gün tekrarlanan işler hem müşterilerinizi hem zamanınızı kaybettirir. AgentAxis Labs darboğazları bulur, doğru yapay zekâ sistemini kurar ve işletmenizin daha düzenli büyümesini sağlar.
          </p>
          <div className="painRow" aria-label="Çözdüğümüz ortak işletme sorunları">
            <span>Kaçan müşteri talepleri</span>
            <span>Unutulan geri dönüşler</span>
            <span>Zaman alan rutin işler</span>
          </div>
          <div className="heroActions">
            <a className="primary" href="#iletisim">İşletmemdeki fırsatları göster <span>→</span></a>
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
          <div className="axisNode active"><small>01</small><strong>Fırsatı bul</strong><span>Müşterinin nerede kaybolduğunu görün</span></div>
          <div className="axisNode"><small>02</small><strong>Sistemi kur</strong><span>Takip ve tekrarlanan işleri otomatikleştirin</span></div>
          <div className="axisNode"><small>03</small><strong>Kontrolü koru</strong><span>Her önemli adım sizin onayınızda</span></div>
          <div className="metric"><b>7/24</b><span>çalışan düzen,<br />insanda kalan kontrol</span></div>
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

      <section className="pilot shell" id="pilot">
        <div className="pilotBadge"><b>10</b><span>GÜNLÜK<br />PİLOT</span></div>
        <div className="pilotCopy">
          <p className="eyebrow light"><span /> Önce görün, sonra karar verin</p>
          <h2>İşletmenize özel hizmeti 10 gün boyunca gerçek ortamda deneyin.</h2>
          <p>Hazır bir sunum veya tek çözümlük kısıt değil; ihtiyaçlarınızı birlikte belirliyor, 10 gün boyunca uygun analizleri, takip düzenini ve otomasyonları kurup iyileştiriyoruz.</p>
          <div className="pilotSteps">
            <span><b>01</b> İhtiyaçları öğren</span>
            <span><b>02</b> Uygun hizmetleri kur</span>
            <span><b>03</b> 10 gün çalıştır ve iyileştir</span>
            <span><b>04</b> Sonuçları birlikte değerlendir</span>
          </div>
          <p className="pilotNote">Bu deneme her işletmeye bir kez sunulur. SMS tamamen müşterinin tercihidir; isterse kendi sağlayıcısını bağlar. Deneme kendiliğinden ücretliye dönüşmez.</p>
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

      <section className="finderSection shell" id="ihtiyac">
        <div className="finderCopy">
          <p className="eyebrow"><span /> Nereden başlayacağınızı bilmiyor musunuz?</p>
          <h2>İşletmenize hazır bir paket dayatmıyoruz.</h2>
          <p>Önce ihtiyaçlarınızı anlıyor, sonra 10 günlük denemeyi işletmenize gerçekten fayda sağlayacak hizmetlerle şekillendiriyoruz.</p>
        </div>
        <NeedFinder />
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
