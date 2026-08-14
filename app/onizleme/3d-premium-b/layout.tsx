import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Premium B — derinlik ve parallax önizleme | AgentAxis Labs",
  description: "AgentAxis Labs mevcut içeriğiyle temiz teknoloji/lüks 3D derinlik önizlemesi. Canlı siteye uygulanmamıştır.",
  robots: { index: false, follow: false, noarchive: true, nocache: true },
};

export default function Premium3DBLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
