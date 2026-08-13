import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doğa Dent Çorlu | Özel İnceleme Taslağı",
  description: "Doğa Dent Çorlu için kaynaklı mini inceleme ve sentetik randevu akışı demosu.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
    googleBot: { index: false, follow: false, noarchive: true },
  },
};

export default function ReviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
