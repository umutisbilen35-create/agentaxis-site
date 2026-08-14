import type { Metadata } from "next";

export function buildDemoMetadata(clinicName: string): Metadata {
  return {
    title: `${clinicName} | Özel İnceleme Taslağı`,
    description: `${clinicName} için kaynaklı mini inceleme ve sentetik randevu akışı demosu.`,
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
      title: `${clinicName} | Özel İnceleme Taslağı`,
      description: `${clinicName} için hazırlanmış özel çalışma önizlemesi.`,
      images: [],
    },
    twitter: {
      card: "summary",
      title: `${clinicName} | Özel İnceleme Taslağı`,
      description: `${clinicName} için hazırlanmış özel çalışma önizlemesi.`,
      images: [],
    },
  };
}
