import type { Metadata } from "next";
import ApprovalReview from "./ApprovalReview";
import styles from "./approval.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "İçerik Onayı | AgentAxis Labs", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function ApprovalPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }> }) {
  const { id } = await params; const { token = "" } = await searchParams;
  return <div className={styles.page}><ApprovalReview publicId={id} token={token} /></div>;
}
