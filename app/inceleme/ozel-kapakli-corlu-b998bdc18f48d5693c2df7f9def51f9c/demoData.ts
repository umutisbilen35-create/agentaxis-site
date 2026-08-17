import type { PremiumClinicDemoData } from "../_shared/PremiumClinicDemo";

export const demoData: PremiumClinicDemoData = {
  clinicName: "Özel Kapaklı Ağız ve Diş Sağlığı Polikliniği",
  clinicLabel: "ÖZEL KAPAKLI POLİKLİNİĞİ",
  analysisTitle: "Özel Kapaklı Polikliniği'nin görünür gücü.",
  sourceDate: "16.08.2026",
  officialUrl: "https://www.google.com/maps/place/%C3%96zel+Kapakl%C4%B1+A%C4%9F%C4%B1z+ve+Di%C5%9F+Sa%C4%9Fl%C4%B1%C4%9F%C4%B1+Poliklini%C4%9Fi",
  mapUrl: "https://www.google.com/maps/place/%C3%96zel+Kapakl%C4%B1+A%C4%9F%C4%B1z+ve+Di%C5%9F+Sa%C4%9Fl%C4%B1%C4%9F%C4%B1+Poliklini%C4%9Fi/data=!4m7!3m6!1s0x14b528f73cf62c77:0xd66dc4b83a664c5c!8m2!3d41.327277!4d27.9762322!16s%2Fg%2F11fzf8tkmh!19sChIJdyz2PPcotRQRXExmOrjEbdY?authuser=0&hl=en&rclk=1",
  metrics: [
    { value: "4,7", label: "Google puanı", note: "Profilde görülen puan" },
    { value: "410", label: "incelenen yorum", note: "Bölgedeki en yüksek yorum hacimlerinden biri" },
    { value: "?", label: "iletişim kanalı", note: "Ayrıntılı denetimde doğrulanacak" },
  ],
  signals: [
    { eyebrow: "YORUMLARDA ÖNE ÇIKAN GÜÇLÜ SİNYAL", title: "Büyük ve aktif bir hasta kitlesi.", description: "410 yorum, bölgedeki emsallerine göre çok yüksek bir hacim — uzun süredir yoğun çalışan, tanınan bir klinik olduğunu gösteriyor." },
    { eyebrow: "KAMUYA AÇIK KAYNAKLARDA GÖRÜNMEYEN", title: "Bu hacmin içeride nasıl yönetildiği.", description: "Bu kadar yoğun talebi karşılarken randevu, teyit ve yanıt vermeyen hasta takibinin içeride nasıl yürüdüğü dışarıdan görülemiyor — henüz doğrulanmadı." },
  ],
  services: [
    { code: "01", title: "Randevu iletişimi", description: "Telefon, WhatsApp, e-posta ve formdan gelen talepler tek takip düzeninde toplanabilir.", flow: ["Talep gelir", "Taslak hazırlanır", "Ekip onaylar", "Sonuç kaydedilir"] },
    { code: "02", title: "Hasta takibi", description: "Yanıt vermeyen veya teyit bekleyen hastalar unutulmadan ekibin önüne getirilebilir.", flow: ["Teyit bekler", "Takip görünür olur", "Ekip karar verir", "Gerekirse insan devralır"] },
    { code: "03", title: "Eski hastalarla yeniden iletişim", description: "Yalnız iletişim izni bulunan hastalar için kontrollü dönüş taslakları hazırlanabilir.", flow: ["İzin kontrolü", "Taslak hazırlanır", "Klinik onaylar", "Takip kaydedilir"] },
  ],
};
