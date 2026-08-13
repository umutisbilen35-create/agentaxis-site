import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Örnek çalışan akış — AgentAxis Labs önizleme",
  description: "AgentAxis Labs sentetik iş akışı ve form yerleşimi önizlemesi.",
  robots: { index: false, follow: false, noarchive: true, nocache: true },
};

export default function PreviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
