import Link from "next/link";

export default function PrivacyPage() {
  return <main className="legal shell">
    <Link className="brand" href="/"><span className="brandMark" aria-hidden="true"><i /></span><span>AgentAxis <b>Labs</b></span></Link>
    <p className="eyebrow"><span /> Son güncelleme: 1 Ağustos 2026</p>
    <h1>Gizlilik ve Aydınlatma Metni</h1>
    <p>Bu metin, ücretsiz işletme inceleme formunda paylaştığınız bilgilerin nasıl kullanıldığını açıklar. Veri sorumlusu AgentAxis Labs’tır. Sorularınız ve başvurularınız için <a href="mailto:agentaxislabs@gmail.com">agentaxislabs@gmail.com</a> adresini kullanabilirsiniz.</p>
    <h2>Hangi bilgileri topluyoruz?</h2>
    <p>İşletme adı, sektör, isteğe bağlı web sitesi veya Google Haritalar bağlantısı, seçtiğiniz ihtiyaçlar ve paket, adınız, e-posta adresiniz, isteğe bağlı telefon numarası ve notunuz. Güvenlik ve kötüye kullanımı önlemek için, platform tarafından sağlandığında bağlantı adresinizin geri döndürülemez özeti de kaydedilebilir. Hasta, teşhis, tedavi veya başka kişilere ait özel bilgi istemiyoruz.</p>
    <h2>Neden ve nasıl kullanıyoruz?</h2>
    <p>Bilgiler form üzerinden elektronik olarak alınır; ücretsiz inceleme talebinizi değerlendirmek, tekrar kayıtları önlemek, sizinle talebiniz hakkında iletişim kurmak, size uygun demo ve hizmet kapsamını hazırlamak amacıyla kullanılır. İsteğe bağlı bilgilendirme kutusunu seçmediğiniz sürece pazarlama mesajı gönderilmez.</p>
    <h2>Kimlerle paylaşılabilir?</h2>
    <p>Bilgileriniz satılmaz. Teknik barındırma, güvenli kayıt veya iletişim hizmeti sağlayan iş ortakları yalnız hizmetin gerektirdiği ölçüde veri işleyebilir. Kanunen zorunlu hâllerde yetkili kamu kurumlarıyla paylaşım yapılabilir.</p>
    <h2>Ne kadar süre saklıyoruz?</h2>
    <p>Sonuçlanmayan ücretsiz inceleme talepleri en fazla 12 ay saklanır ve ardından silinir veya kimliksiz hâle getirilir. Bir hizmet ilişkisi kurulursa ilgili kayıtlar, sözleşme ve yasal yükümlülüklerin gerektirdiği süre boyunca korunabilir.</p>
    <h2>Haklarınız</h2>
    <p>6698 sayılı Kanun’un 11. maddesi kapsamında verinizin işlenip işlenmediğini öğrenme; bilgi, düzeltme veya silme isteme; aktarılan kişileri öğrenme; otomatik değerlendirme sonucuna itiraz etme ve şartları oluştuğunda zararın giderilmesini talep etme haklarına sahipsiniz. Talebinizi yukarıdaki e-posta adresine gönderebilirsiniz; ayrıca yasal şartlar oluştuğunda Kişisel Verileri Koruma Kurumuna başvurma hakkınız bulunur.</p>
    <h2>Güvenlik</h2>
    <p>Yalnız gerekli bilgiler alınır. Şifreniz istenmez; hesap bağlantıları ve canlı işlemler ayrı onayınız olmadan başlatılmaz. Yetkisiz erişimi, tekrar kaydı ve kötüye kullanımı azaltan teknik kontroller uygulanır.</p>
    <a className="primary" href="mailto:agentaxislabs@gmail.com?subject=Kişisel%20Veri%20Talebi">Veri talebi gönderin <span>→</span></a>
  </main>;
}
