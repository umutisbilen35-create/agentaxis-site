import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diş Hekimi Gülşah Duran | Özel İnceleme Taslağı",
  description: "Diş Hekimi Gülşah Duran için hazırlanmış sade özel çalışma önizlemesi.",
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
    title: "Diş Hekimi Gülşah Duran | Özel İnceleme Taslağı",
    description: "Diş Hekimi Gülşah Duran için hazırlanmış özel çalışma önizlemesi.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Diş Hekimi Gülşah Duran | Özel İnceleme Taslağı",
    description: "Diş Hekimi Gülşah Duran için hazırlanmış özel çalışma önizlemesi.",
    images: [],
  },
};

export default function ReviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
