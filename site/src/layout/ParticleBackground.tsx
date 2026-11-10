import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import particleUrl from "../assets/particle.png";

interface Particle { x: number; y: number; size: number; vx: number; vy: number }

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Fixed full-screen canvas of white particle sprites. They rise at a steady
 * opacity with no spin; one that leaves the top re-enters below the bottom.
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    let w = 0, h = 0, raf = 0, last = 0;
    let parts: Particle[] = [];
    let sprite: HTMLImageElement | null = null;
    const dpr = () => Math.min(devicePixelRatio || 1, 2);

    const spawn = (): Particle => ({
      x: rand(-40, w + 40), y: rand(-40, h + 40),
      size: rand(16, 54),
      vx: rand(-3, 3), vy: -rand(14, 32),
    });

    const resize = () => {
      w = innerWidth; h = innerHeight;
      cv.width = Math.floor(w * dpr()); cv.height = Math.floor(h * dpr());
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
      parts = Array.from({ length: Math.max(16, Math.min(54, Math.round((w * h) / 26000))) }, spawn);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (!sprite) return;
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.5;
      for (const p of parts) ctx.drawImage(sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const frame = (t: number) => {
      const dt = Math.min((t - last) / 1000 || 0, 0.05);
      last = t;
      for (const p of parts) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -60) p.x = w + 60; else if (p.x > w + 60) p.x = -60;
        if (p.y < -60) { p.y = h + 60; p.x = rand(-40, w + 40); }
      }
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const onVisibility = () => (document.hidden ? stop() : start());

    const img = new Image();
    img.onload = () => {
      sprite = img;
      resize();
      if (prefersReducedMotion()) draw();
      else start();
    };
    img.src = particleUrl;

    addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="vfx-bg" aria-hidden="true" />;
}
