import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Premium A — sinematik koyu-altın önizleme | AgentAxis Labs",
  description: "AgentAxis Labs mevcut içeriğiyle sinematik koyu-altın 3D hero önizlemesi. Canlı siteye uygulanmamıştır.",
  robots: { index: false, follow: false, noarchive: true, nocache: true },
};

export default function Premium3DALayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
