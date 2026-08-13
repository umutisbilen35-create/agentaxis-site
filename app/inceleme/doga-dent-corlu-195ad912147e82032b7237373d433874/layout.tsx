import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doğa Dent Çorlu | Özel İnceleme Taslağı",
  description: "Doğa Dent Çorlu için kaynaklı mini inceleme ve sentetik randevu akışı demosu.",
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
    title: "Doğa Dent Çorlu | Özel İnceleme Taslağı",
    description: "Doğa Dent Çorlu için hazırlanmış özel çalışma önizlemesi.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Doğa Dent Çorlu | Özel İnceleme Taslağı",
    description: "Doğa Dent Çorlu için hazırlanmış özel çalışma önizlemesi.",
    images: [],
  },
};

export default function ReviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
