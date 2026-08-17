import type { PremiumClinicDemoData } from "../_shared/PremiumClinicDemo";

export const demoData: PremiumClinicDemoData = {
  clinicName: "Diş Hekimi Gülşah Duran",
  clinicLabel: "GÜLŞAH DURAN",
  labelPrefix: "DİŞ HEKİMİ",
  analysisTitle: "",
  sourceDate: "16.08.2026",
  officialUrl: "https://www.google.com/maps/place/Di%C5%9F+Hekimi+G%C3%BCl%C5%9Fah+Duran",
  mapUrl: "https://www.google.com/maps/place/Di%C5%9F+Hekimi+G%C3%BCl%C5%9Fah+Duran/data=!4m7!3m6!1s0x14b391ad72bed255:0xa8258fcc97951dcd!8m2!3d40.8883268!4d26.9036104!16s%2Fg%2F11xlsmnlyb!19sChIJVdK-cq2RsxQRzR2Vl8yPJag?authuser=0&hl=en&rclk=1",
  services: [
    { code: "01", title: "Randevu iletişimi", description: "Telefon, WhatsApp, e-posta ve formdan gelen talepler tek takip düzeninde toplanabilir.", flow: ["Talep gelir", "Taslak hazırlanır", "Ekip onaylar", "Sonuç kaydedilir"] },
    { code: "02", title: "Hasta takibi", description: "Yanıt vermeyen veya teyit bekleyen hastalar unutulmadan ekibin önüne getirilebilir.", flow: ["Teyit bekler", "Takip görünür olur", "Ekip karar verir", "Gerekirse insan devralır"] },
    { code: "03", title: "Eski hastalarla yeniden iletişim", description: "Yalnız iletişim izni bulunan hastalar için kontrollü dönüş taslakları hazırlanabilir.", flow: ["İzin kontrolü", "Taslak hazırlanır", "Klinik onaylar", "Takip kaydedilir"] },
  ],
};
