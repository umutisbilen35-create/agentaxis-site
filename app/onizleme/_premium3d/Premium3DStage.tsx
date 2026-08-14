"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./stage.module.css";

export type StageVariant = "a" | "b";

/**
 * Yalnız önizleme rotalarında kullanılan 3D sahne katmanı.
 * İçeriğe hiç dokunmaz: dekoratiftir, aria-hidden'dır ve tıklama almaz.
 * Ağır 3D kütüphanesi yoktur; rotaya özel hafif görsel + CSS katmanları kullanılır.
 */
export default function Premium3DStage({ variant }: { variant: StageVariant }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [assetFailed, setAssetFailed] = useState(false);

  // Kaydırma ve imleç değerlerini yalnız sahne elemanına CSS değişkeni olarak yazar.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let pending = false;
    let scrollValue = window.scrollY;
    let pointerX = 0;
    let pointerY = 0;

    const apply = () => {
      pending = false;
      const viewportHeight = window.innerHeight || 1;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
      stage.style.setProperty("--ax-s", Math.min(1, scrollValue / scrollable).toFixed(4));
      stage.style.setProperty("--ax-v", Math.min(2.4, scrollValue / viewportHeight).toFixed(4));
      stage.style.setProperty("--ax-px", pointerX.toFixed(4));
      stage.style.setProperty("--ax-py", pointerY.toFixed(4));
    };

    const schedule = () => {
      if (pending) return;
      pending = true;
      frame = window.requestAnimationFrame(apply);
    };

    const onScroll = () => {
      if (reducedMotion.matches) return;
      scrollValue = window.scrollY;
      schedule();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || !finePointer.matches) return;
      pointerX = (event.clientX / (window.innerWidth || 1)) * 2 - 1;
      pointerY = (event.clientY / (window.innerHeight || 1)) * 2 - 1;
      schedule();
    };

    const onResize = () => {
      schedule();
    };

    const onMotionChange = () => {
      window.cancelAnimationFrame(frame);
      pending = false;
      if (reducedMotion.matches) {
        scrollValue = 0;
        pointerX = 0;
        pointerY = 0;
      } else {
        scrollValue = window.scrollY;
      }
      apply();
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  // Bu rotalarda miras alınan hero/panel videosu CSS ile gizlidir ama tarayıcı
  // yine de yaklaşık 6 MB (video + poster) indirir. Görünmeyen kaynak boşaltılır;
  // ortak bileşen dosyası değiştirilmeden yalnız bu önizlemede iptal edilir.
  useEffect(() => {
    const root = stageRef.current?.parentElement;
    if (!root) return;

    const releaseHiddenVideos = () => {
      for (const video of Array.from(root.querySelectorAll("video"))) {
        if (video.dataset.axPreviewReleased === "1") continue;
        video.dataset.axPreviewReleased = "1";
        video.pause();
        video.removeAttribute("autoplay");
        video.removeAttribute("poster");
        video.removeAttribute("src");
        video.load();
      }
    };

    releaseHiddenVideos();
    const observer = new MutationObserver(releaseHiddenVideos);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const variantClass = variant === "a" ? styles.stageA : styles.stageB;
  const assetSrc =
    variant === "a"
      ? "/media/agentaxis-premium-3d-a-v2.jpg"
      : "/media/agentaxis-premium-3d-b-v2.jpg";

  return (
    <div ref={stageRef} className={`${styles.stage} ${variantClass}`} aria-hidden="true">
      <div className={styles.room} />
      <div className={styles.halo} />
      <div className={styles.objectShell}>
        {assetFailed ? (
          <div className={styles.objectFallback} />
        ) : (
          <img
            className={styles.object}
            src={assetSrc}
            alt=""
            decoding="async"
            draggable={false}
            onError={() => setAssetFailed(true)}
          />
        )}
      </div>
      <div className={styles.horizon} />
      <div className={styles.grid} />
      <div className={styles.plates}>
        <i className={styles.plateFar} />
        <i className={styles.plateMid} />
        <i className={styles.plateNear} />
      </div>
      <div className={styles.rake} />
      <div className={styles.dust} />
      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  );
}
