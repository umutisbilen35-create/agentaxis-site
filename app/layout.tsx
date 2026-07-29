import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentAxis Labs | İşletmeler için AI Sistemleri",
  description: "Yerel işletmeler için müşteri takibi, iş otomasyonu ve anlaşılır web siteleri kuruyoruz. 10 günlük ücretsiz pilotla önce görün, sonra karar verin.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  metadataBase: new URL("https://agentaxislabs.com"),
  openGraph: { title: "AgentAxis Labs | İşletmeler için çalışan sistemler", description: "Müşteri takibi, iş otomasyonu ve web sitesi. Önce 10 günlük ücretsiz pilot.", type: "website", locale: "tr_TR", images: [{ url: "/og.png", width: 1536, height: 1024, alt: "AgentAxis Labs — İşletmeler için çalışan sistemler" }] },
  twitter: { card: "summary_large_image", title: "AgentAxis Labs | İşletmeler için çalışan sistemler", description: "Müşteri takibi, iş otomasyonu ve web sitesi. Önce 10 günlük ücretsiz pilot.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: "AgentAxis Labs", url: "https://agentaxislabs.com/" },
      {
        "@type": "Organization",
        name: "AgentAxis Labs",
        url: "https://agentaxislabs.com/",
        email: "umutisbilen35@gmail.com",
        description: "Yerel işletmeler için müşteri takibi, iş otomasyonu ve web sitesi hizmetleri.",
      },
    ],
  };
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}
