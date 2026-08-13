import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tam site önizlemesi — AgentAxis Labs",
  description: "AgentAxis Labs koyu-altın tam site ve sentetik çalışan akış önizlemesi.",
  robots: { index: false, follow: false, noarchive: true, nocache: true },
};

export default function FullSitePreviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
