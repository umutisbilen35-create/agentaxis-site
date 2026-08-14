"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./stage.module.css";

export type StageVariant = "a" | "b";

/**
 * Yalnız önizleme rotalarında kullanılan 3D sahne katmanı.
 * İçeriğe hiç dokunmaz: dekoratiftir, aria-hidden'dır ve tıklama almaz.
 * Ağır 3D kütüphanesi yoktur; tek hafif döngü videosu + CSS katmanları kullanılır.
 */
export default function Premium3DStage({ variant }: { variant: StageVariant }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

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

  // Video yalnız görünürken ve hareket kısıtlaması yokken oynar.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Video hiç açılmazsa CSS yedeğine geçilir.
    // Sayfa arka plandayken tarayıcı videoyu yüklemez; bu bir hata değildir,
    // bu yüzden sayaç yalnız sayfa görünürken çalışır.
    let failTimer = 0;

    function clearFailTimer() {
      if (failTimer) {
        window.clearTimeout(failTimer);
        failTimer = 0;
      }
    }

    function armFailTimer() {
      clearFailTimer();
      if (document.visibilityState !== "visible") return;
      failTimer = window.setTimeout(() => {
        const element = videoRef.current;
        if (element && element.readyState === 0 && document.visibilityState === "visible") {
          setVideoFailed(true);
        }
      }, 8000);
    }

    function sync() {
      const element = videoRef.current;
      if (!element) return;
      if (reducedMotion.matches || document.visibilityState !== "visible") {
        clearFailTimer();
        element.pause();
        return;
      }
      armFailTimer();
      void element.play().catch(() => undefined);
    }

    function onLoadedData() {
      const element = videoRef.current;
      if (!element) return;
      clearFailTimer();
      if (reducedMotion.matches) {
        // Hareket kısıtlıysa sabit ve dolu bir kare gösterilir.
        try {
          element.currentTime = Math.min(1, element.duration || 1);
        } catch {
          /* tarayıcı izin vermezse ilk kare kalır */
        }
        element.pause();
      }
    }

    video.addEventListener("loadeddata", onLoadedData);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    sync();

    return () => {
      clearFailTimer();
      video.removeEventListener("loadeddata", onLoadedData);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      video.pause();
    };
  }, [videoFailed]);

  const variantClass = variant === "a" ? styles.stageA : styles.stageB;

  return (
    <div ref={stageRef} className={`${styles.stage} ${variantClass}`} aria-hidden="true">
      <div className={styles.room} />
      <div className={styles.halo} />
      {videoFailed ? (
        <div className={styles.objectFallback} />
      ) : (
        <video
          ref={videoRef}
          className={styles.object}
          src="/media/lumen-arc-rotation-loop.mp4"
          poster="/media/lumen-arc-loop-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          onError={() => setVideoFailed(true)}
        />
      )}
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
