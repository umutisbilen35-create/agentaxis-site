"use client";

import { useEffect } from "react";
import Link from "next/link";
import NeedFinder from "../../NeedFinder";
import { Services, Process, LumenPackages, LumenProof } from "../DraftGallery";
import styles from "./modern-premium.module.css";

export type PremiumPageKind = "hizmetler" | "nasil-calisir" | "paketler" | "kanit" | "hakkimizda" | "iletisim";

function Brand() {
  return <span className={styles.brand}><i><b /></i><span>AgentAxis <strong>Labs</strong></span></span>;
}

function PremiumNav({ active }: { active: PremiumPageKind }) {
  return (
    <header className={styles.nav}>
      <Link href="/taslaklar/modern-premium" aria-label="Modern Premium ana sayfası"><Brand /></Link>
      <nav>
        <Link className={active === "hizmetler" ? styles.active : ""} href="/taslaklar/modern-premium/hizmetler">Hizmetler</Link>
        <Link className={active === "nasil-calisir" ? styles.active : ""} href="/taslaklar/modern-premium/nasil-calisir">Nasıl çalışır?</Link>
        <Link className={active === "paketler" ? styles.active : ""} href="/taslaklar/modern-premium/paketler">Paketler</Link>
        <Link className={active === "kanit" || active === "hakkimizda" ? styles.active : ""} href="/taslaklar/modern-premium/kanit">Kanıt</Link>
      </nav>
      <Link className={styles.navCta} href="/taslaklar/modern-premium/iletisim">Ücretsiz inceleme <b>↗</b></Link>
    </header>
  );
}

function ContactPage() {
  return (
    <>
      <section className={styles.contactIntro}>
        <small>ÜCRETSİZ MİNİ TEŞHİS</small>
        <h1>İşletmenizi anlatın, doğru başlangıcı birlikte bulalım.</h1>
        <p>Yaklaşık iki dakikada ihtiyacınızı seçin. Otomatik ödeme yok; önemli işlemler sizin onayınızda kalır.</p>
      </section>
      <section className={styles.contactPanel}><NeedFinder /></section>
    </>
  );
}

export default function ModernPremiumPage({ kind }: { kind: PremiumPageKind }) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-premium-reveal="wait"]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.setAttribute("data-premium-reveal", "visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).setAttribute("data-premium-reveal", "visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [kind]);

  return (
    <main className={styles.root}>
      <PremiumNav active={kind} />
      <div className={styles.pageAmbient} aria-hidden="true" />
      <div className={styles.pageBody}>
        {kind === "hizmetler" && <Services dark />}
        {kind === "nasil-calisir" && <Process dark />}
        {kind === "paketler" && <LumenPackages />}
        {(kind === "kanit" || kind === "hakkimizda") && <LumenProof />}
        {kind === "iletisim" && <ContactPage />}
      </div>
      <footer className={styles.footer}><Brand /><span>© 2026 AgentAxis Labs</span><a href="mailto:agentaxislabs@gmail.com">agentaxislabs@gmail.com</a><Link href="/gizlilik">Gizlilik</Link><Link href="/kullanim-kosullari">Kullanım koşulları</Link></footer>
    </main>
  );
}
