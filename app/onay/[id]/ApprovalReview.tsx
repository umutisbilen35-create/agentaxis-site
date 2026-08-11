"use client";

import { useEffect, useState } from "react";
import styles from "./approval.module.css";

type Approval = { title: string; caption: string; plannedAt: string; status: string; imageUrl: string; clientNote?: string };

export default function ApprovalReview({ publicId, token }: { publicId: string; token: string }) {
  const [approval, setApproval] = useState<Approval | null>(null);
  const [error, setError] = useState(""); const [note, setNote] = useState(""); const [busy, setBusy] = useState(false);
  const endpoint = `/api/content-approvals/${encodeURIComponent(publicId)}?token=${encodeURIComponent(token)}`;
  useEffect(() => { fetch(endpoint, { cache: "no-store" }).then(async (response) => {
    const data = await response.json(); if (!response.ok) throw new Error(data.message); setApproval(data);
  }).catch((cause) => setError(cause instanceof Error ? cause.message : "İçerik alınamadı.")); }, [endpoint]);

  async function decide(decision: "approve" | "revise" | "reject") {
    if (decision === "revise" && !note.trim()) { setError("Düzeltme için kısa bir not yazın."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ decision, note }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message);
      setApproval((current) => current ? { ...current, status: data.status } : current);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Karar kaydedilemedi."); }
    finally { setBusy(false); }
  }

  if (error && !approval) return <main className={styles.shell}><h1>Bağlantı açılamadı</h1><p>{error}</p></main>;
  if (!approval) return <main className={styles.shell}><p>İçerik güvenle hazırlanıyor…</p></main>;
  if (approval.status !== "waiting_for_review") return <main className={styles.shell}><span className={styles.eyebrow}>AKILLI İŞLETME ASİSTANI</span><h1>Kararınız kaydedildi</h1><p>Bu bağlantı güvenlik nedeniyle kapatıldı. Teşekkür ederiz.</p></main>;

  return <main className={styles.shell}>
    <header><span className={styles.eyebrow}>AKILLI İŞLETME ASİSTANI</span><h1>Paylaşımınızı kontrol edin</h1><p>Onayınız olmadan Instagram’da paylaşılmaz.</p></header>
    <div className={styles.grid}><img src={approval.imageUrl} alt="Instagram paylaşım önizlemesi" />
      <section><h2>{approval.title}</h2><div className={styles.caption}>{approval.caption}</div><p className={styles.time}>Planlanan yayın: {new Date(approval.plannedAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
        <label htmlFor="note">Düzeltme notu</label><textarea id="note" maxLength={1000} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Yalnız düzeltme istiyorsanız yazın" />
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}><button className={styles.approve} disabled={busy} onClick={() => decide("approve")}>Onayla</button><button className={styles.revise} disabled={busy} onClick={() => decide("revise")}>Düzelt</button><button className={styles.reject} disabled={busy} onClick={() => decide("reject")}>Reddet</button></div>
      </section></div>
  </main>;
}
