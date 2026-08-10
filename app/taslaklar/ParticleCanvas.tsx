"use client";

import { useEffect, useRef } from "react";

type ParticleCanvasProps = {
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

export default function ParticleCanvas({ className }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current as HTMLCanvasElement;
    if (!canvasElement) return;
    const drawingContext = canvasElement.getContext("2d") as CanvasRenderingContext2D;
    if (!drawingContext) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const colors = ["#3566f5", "#7d70ff", "#ff805c"];
    let particles: Particle[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let running = !document.hidden;
    const pointer = { x: -1000, y: -1000, active: false };

    function resize() {
      const rect = canvasElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvasElement.width = Math.max(1, Math.round(width * dpr));
      canvasElement.height = Math.max(1, Math.round(height * dpr));
      drawingContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 700 ? 34 : 72;
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: 1 + Math.random() * 1.7,
        color: colors[index % colors.length],
      }));
      draw(true);
    }

    function draw(staticFrame = false) {
      drawingContext.clearRect(0, 0, width, height);
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        if (!staticFrame && !reducedMotion.matches) {
          if (pointer.active) {
            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const distance = Math.hypot(dx, dy);
            if (distance > 1 && distance < 180) {
              const force = (180 - distance) / 36000;
              particle.vx += dx * force;
              particle.vy += dy * force;
            }
          }
          particle.vx *= 0.995;
          particle.vy *= 0.995;
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -20) particle.x = width + 20;
          if (particle.x > width + 20) particle.x = -20;
          if (particle.y < -20) particle.y = height + 20;
          if (particle.y > height + 20) particle.y = -20;
        }

        drawingContext.beginPath();
        drawingContext.fillStyle = particle.color;
        drawingContext.globalAlpha = 0.5;
        drawingContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        drawingContext.fill();

        for (let peerIndex = index + 1; peerIndex < particles.length; peerIndex += 1) {
          const peer = particles[peerIndex];
          const distance = Math.hypot(peer.x - particle.x, peer.y - particle.y);
          if (distance < 105) {
            drawingContext.beginPath();
            drawingContext.strokeStyle = particle.color;
            drawingContext.globalAlpha = (1 - distance / 105) * 0.13;
            drawingContext.lineWidth = 0.7;
            drawingContext.moveTo(particle.x, particle.y);
            drawingContext.lineTo(peer.x, peer.y);
            drawingContext.stroke();
          }
        }
      }
      drawingContext.globalAlpha = 1;
    }

    function animate() {
      if (!running || reducedMotion.matches) return;
      draw();
      frame = window.requestAnimationFrame(animate);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvasElement.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.x <= rect.width && pointer.y >= 0 && pointer.y <= rect.height;
    }

    function onVisibilityChange() {
      running = !document.hidden;
      window.cancelAnimationFrame(frame);
      if (running && !reducedMotion.matches) animate();
    }

    function onMotionChange() {
      window.cancelAnimationFrame(frame);
      draw(true);
      if (!reducedMotion.matches && running) animate();
    }

    resize();
    if (!reducedMotion.matches) animate();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
