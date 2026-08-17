import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Özel Kapaklı Ağız ve Diş Sağlığı Polikliniği | Özel İnceleme Taslağı",
  description: "Özel Kapaklı Ağız ve Diş Sağlığı Polikliniği için kaynaklı mini inceleme ve sentetik randevu akışı demosu.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
    noimageindex: true,
    googleBot: { index: false, follow: false, noarchive: true, noimageindex: true },
  },
  openGraph: {
    title: "Özel Kapaklı Polikliniği | Özel İnceleme Taslağı",
    description: "Özel Kapaklı Polikliniği için hazırlanmış özel çalışma önizlemesi.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Özel Kapaklı Polikliniği | Özel İnceleme Taslağı",
    description: "Özel Kapaklı Polikliniği için hazırlanmış özel çalışma önizlemesi.",
    images: [],
  },
};

export default function ReviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
