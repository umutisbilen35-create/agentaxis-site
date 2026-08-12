"use client";

import { useEffect, useState } from "react";

const measurementId = process.env.NEXT_PUBLIC_GA4_ID?.trim().toUpperCase() ?? "";
const validId = /^G-[A-Z0-9]{6,14}$/.test(measurementId);

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; }
}

function enableAnalytics() {
  if (!validId || document.querySelector("script[data-agentaxis-ga4]")) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true, send_page_view: true });
  const script = document.createElement("script");
  script.async = true; script.dataset.agentaxisGa4 = "true";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export default function PrivacyAnalytics() {
  const [choice, setChoice] = useState<string | null>(null);
  useEffect(() => {
    if (!validId) return;
    const stored = localStorage.getItem("agentaxis_analytics_consent");
    setChoice(stored);
    if (stored === "granted") enableAnalytics();
  }, []);
  if (!validId || choice) return null;
  const decide = (value: "granted" | "denied") => {
    localStorage.setItem("agentaxis_analytics_consent", value); setChoice(value);
    if (value === "granted") enableAnalytics();
  };
  return <aside className="analyticsConsent" aria-label="İsteğe bağlı kullanım ölçümü">
    <p><strong>İsteğe bağlı kullanım ölçümü</strong><span>Siteyi iyileştirmek için kimlik bilgisi içermeyen ziyaret ölçümüne izin verebilirsiniz.</span></p>
    <div><button type="button" onClick={() => decide("denied")}>Yalnız gerekli</button><button type="button" onClick={() => decide("granted")}>Ölçüme izin ver</button></div>
  </aside>;
}
