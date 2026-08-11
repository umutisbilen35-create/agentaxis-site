"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./portal.module.css";

type Suggestion = { key: string; category: string; hook: string; angle: string };
type Approval = { public_id: string; title: string; caption: string; planned_at: string; status: string; client_note?: string; imageUrl: string };
type ContentRequest = { public_id: string; source: string; topic: string; note?: string; status: string; created_at: string };
type Notification = { public_id: string; type: string; status: string; created_at: string; sent_at?: string };
type PortalData = { client: { name: string; emailNotifications: boolean }; suggestions: Suggestion[]; approvals: Approval[]; requests: ContentRequest[]; notifications: Notification[] };

const statusLabels: Record<string, string> = {
  waiting_for_review: "Onayınızı bekliyor", approved: "Onaylandı", revision_requested: "Düzeltme istendi",
  rejected: "Reddedildi", new: "İstek alındı", preparing: "Hazırlanıyor", ready: "Hazır",
};

export default function ContentPortal({ clientKey, token }: { clientKey: string; token: string }) {
  const [data, setData] = useState<PortalData | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [suggestionNote, setSuggestionNote] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const endpoint = `/api/content-portal/${encodeURIComponent(clientKey)}?token=${encodeURIComponent(token)}`;

  const load = useCallback(async () => {
    const response = await fetch(endpoint, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Panel alınamadı.");
    setData(payload);
  }, [endpoint]);

  useEffect(() => { load().catch((cause) => setError(cause instanceof Error ? cause.message : "Panel alınamadı.")); }, [load]);

  async function submit(body: Record<string, unknown>, busyKey: string) {
    setBusy(busyKey); setError(""); setMessage("");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "İşlem kaydedilemedi.");
      setMessage(payload.message); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "İşlem kaydedilemedi."); }
    finally { setBusy(""); }
  }

  async function requestSuggestion(suggestion: Suggestion) {
    await submit({ action: "request", source: "system_suggestion", suggestionKey: suggestion.key, note: suggestionNote }, `suggestion:${suggestion.key}`);
    setSuggestionNote("");
  }

  async function requestCustom() {
    if (!topic.trim()) { setError("Paylaşım konusunu yazın."); return; }
    await submit({ action: "request", source: "client_custom", topic, note: customNote }, "custom");
    setTopic(""); setCustomNote("");
  }

  async function decide(publicId: string, decision: "approve" | "revise" | "reject") {
    const decisionNote = decisionNotes[publicId] ?? "";
    if (decision === "revise" && !decisionNote.trim()) { setError("Düzeltme için kısa bir not yazın."); return; }
    await submit({ action: "decision", publicId, decision, note: decisionNote }, `decision:${publicId}`);
  }

  if (error && !data) return <main className={styles.shell}><h1>Panel açılamadı</h1><p className={styles.error}>{error}</p></main>;
  if (!data) return <main className={styles.shell}><p>İçerik paneliniz güvenle hazırlanıyor…</p></main>;
  const pending = data.approvals.filter((approval) => approval.status === "waiting_for_review");

  return <main className={styles.shell}>
    <header className={styles.header}>
      <div><span className={styles.eyebrow}>AKILLI İŞLETME ASİSTANI</span><h1>{data.client.name} İçerik Paneli</h1><p>Fikir seçin, özel isteğinizi yazın ve hazırlanan paylaşımları tek ekrandan onaylayın.</p></div>
      <span className={data.client.emailNotifications ? styles.connected : styles.waiting}>{data.client.emailNotifications ? "E-posta bildirimleri açık" : "E-posta adresi müşteri geldiğinde eklenecek"}</span>
    </header>

    {(message || error) && <div className={error ? styles.alertError : styles.alert} role="status">{error || message}</div>}

    <section className={styles.section}>
      <div className={styles.sectionTitle}><span>1</span><div><h2>Akıllı içerik önerileri</h2><p>Size uygun fikri seçin; hook ve içerik açısı hazır gelsin.</p></div></div>
      <div className={styles.suggestions}>{data.suggestions.map((suggestion) => <article key={suggestion.key} className={styles.suggestion}>
        <span>{suggestion.category}</span><h3>{suggestion.hook}</h3><p>{suggestion.angle}</p>
        <button disabled={Boolean(busy)} onClick={() => requestSuggestion(suggestion)}>{busy === `suggestion:${suggestion.key}` ? "Kaydediliyor…" : "Bu fikri hazırla"}</button>
      </article>)}</div>
      <label className={styles.sharedNote}>Öneriye eklemek istediğiniz not (isteğe bağlı)<textarea maxLength={1000} value={suggestionNote} onChange={(event) => setSuggestionNote(event.target.value)} placeholder="Örn. ailelere hitap etsin, sade ve güven veren bir dil kullansın" /></label>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionTitle}><span>2</span><div><h2>Benim özel paylaşım isteğim</h2><p>Konu veya kampanya notunuzu doğrudan yazın.</p></div></div>
      <div className={styles.customForm}>
        <div><label>Paylaşım konusu<textarea maxLength={300} value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Örn. yeni evlenen çiftlere tamamlayıcı sağlık sigortasını anlatalım" /></label><label className={styles.customNote}>Ek not (isteğe bağlı)<textarea maxLength={1000} value={customNote} onChange={(event) => setCustomNote(event.target.value)} placeholder="Örn. salı günü yayımlansın, turuncu renk daha belirgin olsun" /></label></div>
        <button disabled={Boolean(busy)} onClick={requestCustom}>{busy === "custom" ? "Gönderiliyor…" : "İsteğimi gönder"}</button>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionTitle}><span>3</span><div><h2>Onay bekleyen görseller</h2><p>Onayınız olmadan Instagram’da paylaşılmaz.</p></div></div>
      {pending.length === 0 ? <p className={styles.empty}>Şu anda onay bekleyen görsel yok.</p> : <div className={styles.approvals}>{pending.map((approval) => <article key={approval.public_id} className={styles.approval}>
        <img src={approval.imageUrl} alt="Instagram paylaşım önizlemesi" />
        <div><span className={styles.status}>{statusLabels[approval.status]}</span><h3>{approval.title}</h3><div className={styles.caption}>{approval.caption}</div><p><strong>Planlanan yayın:</strong> {new Date(approval.planned_at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
          <label>Düzeltme notu<textarea maxLength={1000} value={decisionNotes[approval.public_id] ?? ""} onChange={(event) => setDecisionNotes((current) => ({ ...current, [approval.public_id]: event.target.value }))} placeholder="Yalnız düzeltme istiyorsanız yazın" /></label>
          <div className={styles.actions}><button disabled={Boolean(busy)} className={styles.approve} onClick={() => decide(approval.public_id, "approve")}>Onayla</button><button disabled={Boolean(busy)} className={styles.revise} onClick={() => decide(approval.public_id, "revise")}>Düzelt</button><button disabled={Boolean(busy)} className={styles.reject} onClick={() => decide(approval.public_id, "reject")}>Reddet</button></div>
        </div>
      </article>)}</div>}
    </section>

    <section className={styles.section}>
      <div className={styles.sectionTitle}><span>4</span><div><h2>İstek ve paylaşım geçmişi</h2><p>Hazırlık durumunu buradan takip edin.</p></div></div>
      <div className={styles.history}>{data.requests.length === 0 ? <p className={styles.empty}>Henüz içerik isteği yok.</p> : data.requests.map((request) => <div key={request.public_id}><span>{statusLabels[request.status] ?? request.status}</span><p>{request.topic}</p><time>{new Date(request.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</time></div>)}</div>
      {data.notifications.length > 0 && <div className={styles.notificationSummary}><strong>E-posta bildirim durumu:</strong> {data.notifications[0].status === "sent" ? "Son görsel bildirimi gönderildi." : "Yeni görsel bildirimi gönderim sırasında."}</div>}
    </section>
  </main>;
}
