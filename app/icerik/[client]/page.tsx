import type { Metadata } from "next";
import ContentPortal from "./ContentPortal";
import styles from "./portal.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "İçerik Paneli | Akıllı İşletme Asistanı",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ContentPortalPage({ params, searchParams }: {
  params: Promise<{ client: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { client } = await params;
  const { token = "" } = await searchParams;
  return <div className={styles.page}><ContentPortal clientKey={client} token={token} /></div>;
}
