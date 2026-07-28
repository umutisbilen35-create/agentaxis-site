import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentAxis Labs | İşletmeler için AI Sistemleri",
  description: "Yerel işletmelere müşteri kazandıran ve tekrarlanan işleri otomatikleştiren yapay zekâ sistemleri.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  metadataBase: new URL("https://agentaxislabs.com"),
  openGraph: { title: "AgentAxis Labs", description: "İşletmenizi ileri taşıyan yapay zekâ sistemleri.", type: "website", locale: "tr_TR", images: [{ url: "/og.png", width: 1536, height: 1024, alt: "AgentAxis Labs" }] },
  twitter: { card: "summary_large_image", title: "AgentAxis Labs", description: "İşletmenizi ileri taşıyan yapay zekâ sistemleri.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
