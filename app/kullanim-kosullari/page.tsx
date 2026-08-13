import Link from "next/link";

export default function TermsPage() {
  return <main className="legal shell">
    <Link className="brand" href="/"><span className="brandMark" aria-hidden="true"><i /></span><span>AgentAxis <b>Labs</b></span></Link>
    <p className="eyebrow"><span /> Son güncelleme: 28 Temmuz 2026</p>
    <h1>Kullanım Koşulları</h1>
    <p>Bu site AgentAxis Labs hizmetleri hakkında bilgi vermek ve ücretsiz ön görüşme talebi almak amacıyla sunulur.</p>
    <h2>Raporlar ve öneriler</h2><p>Analizler erişilebilen ve doğrulanabilen verilere dayanır. Hedefler, ölçüm yöntemi ve elde edilen değişim çalışma kapsamında açıkça raporlanır.</p>
    <h2>Hizmet kapsamı</h2><p>Kurulum ve çalışma kapsamı görüşme sonrası yazılı olarak netleştirilir. Hiçbir hizmet otomatik olarak ücretli bir pakete dönüşmez. Harici uygulama, reklam ve iletişim sağlayıcısı maliyetleri ayrıca açıklanır.</p>
    <h2>Dış işlemler</h2><p>CRM değişikliği, mesaj, e-posta, kampanya, ödeme veya hesap bağlantısı gibi işlemler müşterinin açık onayı olmadan yapılmaz.</p>
    <h2>Fikri haklar</h2><p>Site içeriği AgentAxis Labs’a aittir. Müşteriye özel teslimatların kullanım koşulları ilgili teklifte belirtilir.</p>
    <Link className="primary" href="/">Ana sayfaya dön <span>→</span></Link>
  </main>;
}
