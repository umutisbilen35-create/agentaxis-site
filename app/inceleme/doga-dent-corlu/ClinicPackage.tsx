"use client";

import { useState } from "react";
import styles from "./package.module.css";

const officialContact = "https://www.dogadentcorlu.com/iletisim";
const mapsArchive = "Google Haritalar salt-okunur arşivi · 28.07.2026";

const cases = [
  { id: "A-104", time: "Yarın · 10.30", state: "Hatırlatma taslağı hazır", tone: "ready" },
  { id: "A-118", time: "Yarın · 13.00", state: "Onay bekliyor", tone: "waiting" },
  { id: "A-126", time: "Yarın · 15.30", state: "İnsan kontrolü gerekli", tone: "human" },
];

export default function ClinicPackage() {
  const [selected, setSelected] = useState(cases[0]);
  const [demoState, setDemoState] = useState<"idle" | "approved" | "cancelled">("idle");

  function choose(item: (typeof cases)[number]) {
    setSelected(item);
    setDemoState("idle");
  }

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href="#ust" aria-label="AgentAxis Labs inceleme başlangıcı">
          <i aria-hidden="true"><b /></i><span>AgentAxis <strong>Labs</strong></span>
        </a>
        <nav aria-label="Sayfa bölümleri">
          <a href="#inceleme">İnceleme</a><a href="#demo">Demo</a><a href="#onerimiz">Öneri</a><a href="#kanit">Test</a>
        </nav>
        <span className={styles.private}>PAYLAŞILMADI</span>
      </header>

      <section className={styles.hero} id="ust">
        <div>
          <span className={styles.eyebrow}>DOĞA DENT ÇORLU İÇİN ÖZEL TASLAK</span>
          <h1>Randevu iletişimini<br /><em>birlikte görünür</em> kılalım.</h1>
          <p>Bu sayfa bir satış vaadi değil; herkese açık kaynaklardan başlayan mini inceleme, sentetik iş akışı demosu ve klinikle doğrulanacak soruların tek yerdeki önizlemesidir.</p>
          <div className={styles.heroActions}><a href="#demo">Demoyu deneyin</a><a href="#inceleme">İncelemeyi görün</a></div>
        </div>
        <div className={styles.orbit} aria-hidden="true"><div className={styles.orbitCore}>AI</div><span /><span /><span /></div>
      </section>

      <section className={styles.section} id="inceleme">
        <div className={styles.sectionHead}><span>01 · KAYNAKLI MİNİ İNCELEME</span><h2>Bildiğimiz ile doğrulamamız gerekeni ayırdık.</h2></div>
        <div className={styles.twoCol}>
          <article className={styles.panel}>
            <div className={styles.panelLabel}>KAMUYA AÇIK KAYNAKLARDA DOĞRULANDI</div>
            <ul className={styles.checkList}>
              <li><b>İletişim kanalları mevcut.</b><small>Telefon, GSM/WhatsApp, e-posta ve iletişim formu resmi sitede yer alıyor.</small></li>
              <li><b>Google Haritalar görünürlüğü güçlü.</b><small>Arşiv anında 4,9 puan ve taranmış 140 yorum görünüyordu.</small></li>
              <li><b>Yorumlarda güven dili öne çıkıyor.</b><small>Ham metin anahtar kelime taramasında ilgi, güler yüz ve güven en sık görülen olumlu başlıklardı.</small></li>
            </ul>
            <div className={styles.sources}><a href={officialContact} target="_blank" rel="noreferrer">Resmi iletişim sayfası ↗</a><span>{mapsArchive}</span></div>
          </article>
          <article className={`${styles.panel} ${styles.questionPanel}`}>
            <div className={styles.panelLabel}>KLİNİKLE GÖRÜŞMEDE DOĞRULANACAK</div>
            <ol className={styles.questions}>
              <li><span>01</span>Yeni talebi kim, ne kadar sürede devralıyor?</li>
              <li><span>02</span>Randevu onayı ve hatırlatma hangi düzende ilerliyor?</li>
              <li><span>03</span>Yanıt vermeyen veya gelmeyen hasta için sonraki adım nedir?</li>
              <li><span>04</span>Hangi durumda konuşma insana aktarılıyor?</li>
            </ol>
            <p className={styles.note}>Bunlar tespit edilmiş sorunlar değildir. Ölçüm gelmeden “sorun doğrulandı” veya “kazanç sağlanır” demiyoruz.</p>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.demoSection}`} id="demo">
        <div className={styles.sectionHead}><span>02 · ETKİLEŞİMLİ ÖNİZLEME</span><h2>Randevu ve no-show akışını risksiz deneyin.</h2><p>Sentetik kayıt kullanır. Hasta verisi içermez, dışarı mesaj göndermez ve gerçek randevuyu değiştirmez.</p></div>
        <div className={styles.demoShell}>
          <aside className={styles.caseList}>
            <div className={styles.demoBadge}>SENTETİK DEMO · DIŞ MESAJ GÖNDERMEZ</div>
            {cases.map((item) => <button key={item.id} className={selected.id === item.id ? styles.caseActive : ""} onClick={() => choose(item)}><span>{item.id}<small>{item.time}</small></span><i data-tone={item.tone}>{item.state}</i></button>)}
          </aside>
          <article className={styles.approvalCard}>
            <div className={styles.cardTop}><span>ONAY KARTI</span><strong>{selected.id}</strong></div>
            <div className={styles.approvalGrid}>
              <div><small>KİME</small><b>Sentetik randevu kaydı {selected.id}</b></div>
              <div><small>NEDEN</small><b>Randevu teyidi alınmadı</b></div>
              <div><small>DAYANAK</small><b>Yarın planlı randevu</b></div>
              <div><small>İNSAN KONTROLÜ</small><b>Yanıt belirsizse zorunlu</b></div>
            </div>
            <div className={styles.message}><small>MESAJ ÖNİZLEMESİ</small><p>Merhaba, yarınki randevunuzu teyit etmek için yazıyoruz. Uygunluğunuzu paylaşabilir misiniz?</p></div>
            <div className={styles.buttons}><button onClick={() => setDemoState("approved")}>Taslağı onayla</button><button onClick={() => setDemoState("cancelled")}>İptal et</button></div>
            <div className={styles.result} aria-live="polite">{demoState === "idle" && "Henüz işlem yapılmadı."}{demoState === "approved" && "Demo onayı kaydedildi. Dışarı mesaj gönderilmedi."}{demoState === "cancelled" && "Demo işlemi iptal edildi. Hiçbir kayıt değişmedi."}</div>
          </article>
        </div>
        <div className={styles.flow}>
          <div><span>01</span><b>24 saat önce</b><small>Hatırlatma taslağı hazırlanır.</small></div><i>→</i>
          <div><span>02</span><b>Yanıt ayrıştırılır</b><small>Onay, değişiklik veya belirsiz yanıt.</small></div><i>→</i>
          <div><span>03</span><b>İnsan kontrolü</b><small>Belirsiz ve hassas konuşmalar ekibe bırakılır.</small></div><i>→</i>
          <div><span>04</span><b>Sonuç kaydı</b><small>Onay, yeniden planlama veya no-show notu.</small></div>
        </div>
      </section>

      <section className={styles.section} id="onerimiz">
        <div className={styles.sectionHead}><span>03 · KÜÇÜK VE KONTROLLÜ BAŞLANGIÇ</span><h2>Önce ölçüm. Sonra yalnız gereken sistem.</h2></div>
        <div className={styles.offerGrid}>
          <article><span>DAHİL</span><h3>Randevu iletişim akışı</h3><ul><li>Onay ve hatırlatma taslakları</li><li>Yanıtların temel sınıflandırılması</li><li>İnsan devri ve kayıt görünürlüğü</li><li>Önce/sonra ölçüm tablosu</li></ul></article>
          <article><span>SINIRLAR</span><h3>Kontrol klinikte kalır</h3><ul><li>Tıbbi tanı veya tedavi önermez</li><li>Onaysız dış mesaj göndermez</li><li>Randevuyu kendi başına kesinleştirmez</li><li>Gerçek hasta verisi demoda kullanılmaz</li></ul></article>
          <article className={styles.nextCard}><span>SONRAKİ KARAR</span><h3>Teklif henüz kesinleşmedi.</h3><p>Kapsam, süre ve fiyat; mevcut işlem sayıları ve klinik görüşmesi doğrulandıktan sonra belirlenir. Bu sayfa bağlayıcı teklif değildir.</p><a href="#iletisim-taslagi">İlk temas taslağını görün ↓</a></article>
        </div>
      </section>

      <section className={styles.section} id="kanit">
        <div className={styles.sectionHead}><span>04 · KANIT VE KABUL TESTİ</span><h2>“Çalışıyor” demeden önce neyi göstereceğiz?</h2></div>
        <div className={styles.proofGrid}>
          <div><b>01</b><span>Kaynak</span><p>Her kamuya açık bilgi, tarih ve kaynağıyla gösterilir.</p></div>
          <div><b>02</b><span>Çalışan akış</span><p>Onay, iptal, insan devri ve hata durumları ekranda denenir.</p></div>
          <div><b>03</b><span>Aynı ölçüm</span><p>Başlangıç ve pilot sonrası aynı metrikler karşılaştırılır.</p></div>
          <div><b>04</b><span>Dürüst sonuç</span><p>Şu an gerçek klinik sonucu ölçülmedi; yalnız demo test edildi.</p></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.contactDraft}`} id="iletisim-taslagi">
        <span>GÖNDERİME HAZIR DEĞİL · YALNIZ METİN TASLAĞI</span>
        <h2>İlk temas kısa ve somut.</h2>
        <blockquote>Merhaba, Doğa Dent’in kamuya açık iletişim kanallarını inceledik ve randevu yolculuğunuza dair birkaç soru hazırladık. Mevcut süreciniz hakkında kesin bir varsayım yapmadık; bunun yerine dört kısa doğrulama sorusu ve dışarı mesaj göndermeyen küçük bir randevu/no-show demosu hazırladık. Uygun olursanız 15 dakikada birlikte üzerinden geçebiliriz.</blockquote>
        <p>Bu metin gönderilmedi. Klinik onayı ve gerçek ölçümler gelmeden kesin fiyat veya sonuç vaadi eklenmeyecek.</p>
      </section>

      <footer className={styles.footer}><span>AgentAxis <strong>Labs</strong></span><p>Özel inceleme taslağı · 13 Ağustos 2026 · Yayınlanmadı</p></footer>
    </main>
  );
}
