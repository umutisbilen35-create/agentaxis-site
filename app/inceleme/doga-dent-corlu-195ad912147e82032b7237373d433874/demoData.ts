import type { PremiumClinicDemoData } from "../_shared/PremiumClinicDemo";

export const demoData: PremiumClinicDemoData = {
  clinicName: "Doğa Dent Çorlu",
  clinicLabel: "DOĞA DENT ÇORLU",
  analysisTitle: "Doğa Dent Çorlu’nun görünür gücü.",
  sourceDate: "28.07.2026",
  officialUrl: "https://www.dogadentcorlu.com/iletisim",
  mapUrl: "https://www.google.com/maps/place/%C3%96zel+%C3%87orlu+DO%C4%9EA+DENT+A%C4%9F%C4%B1z+Ve+Di%C5%9F+Sa%C4%9Fl%C4%B1%C4%9F%C4%B1+Poliklini%C4%9Fi/@41.1489088,27.8294083,17z/data=!4m8!3m7!1s0x14b4e7f21c616195:0x69732b0e70312d0b!8m2!3d41.1489088!4d27.8294083!9m1!1b1!16s%2Fg%2F11rd4x1h4b",
  metrics: [
    { value: "4,9", label: "Google puanı", note: "Profilde görülen puan" },
    { value: "140", label: "incelenen yorum", note: "En yeni sıralamayla tarandı" },
    { value: "4", label: "iletişim kanalı", note: "Telefon · WhatsApp · e-posta · form" },
  ],
  signals: [
    { eyebrow: "YORUMLARDA ÖNE ÇIKAN GÜÇLÜ SİNYAL", title: "İlgi, özen ve bilgilendirme.", description: "İncelenen yorumlarda hasta yaklaşımı, ekip ilgisi ve açıklayıcı iletişim olumlu biçimde öne çıkıyor." },
    { eyebrow: "KAMUYA AÇIK KAYNAKLARDA GÖRÜNMEYEN", title: "Talebin içerideki takip yolu.", description: "Randevu talebi, teyit, yanıt vermeyen hasta ve eski hasta iletişiminin içeride nasıl yönetildiği dışarıdan görülemiyor." },
  ],
  services: [
    { code: "01", title: "Randevu iletişimi", description: "Telefon, WhatsApp, e-posta ve formdan gelen talepler tek takip düzeninde toplanabilir.", flow: ["Talep gelir", "Taslak hazırlanır", "Ekip onaylar", "Sonuç kaydedilir"] },
    { code: "02", title: "Hasta takibi", description: "Yanıt vermeyen veya teyit bekleyen hastalar unutulmadan ekibin önüne getirilebilir.", flow: ["Teyit bekler", "Takip görünür olur", "Ekip karar verir", "Gerekirse insan devralır"] },
    { code: "03", title: "Eski hastalarla yeniden iletişim", description: "Yalnız iletişim izni bulunan hastalar için kontrollü dönüş taslakları hazırlanabilir.", flow: ["İzin kontrolü", "Taslak hazırlanır", "Klinik onaylar", "Takip kaydedilir"] },
  ],
};
