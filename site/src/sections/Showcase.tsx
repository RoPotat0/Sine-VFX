import { useEffect, useRef } from "react";
import Section from "../components/Section";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import videoData from "../data/videos.json";
import "./Showcase.css";

interface Clip { src: string; title?: string; poster?: string }

// Paths in videos.json are relative to the site root (files live in public/media).
const CLIPS: Clip[] = (videoData.videos as Clip[])
  .filter((v) => v && v.src)
  .map((v) => ({ ...v, src: "/" + v.src.replace(/^\/+/, ""), poster: v.poster && "/" + v.poster.replace(/^\/+/, "") }));

/** The clips are rendered three times; scrolling past either end jumps one set, so it loops forever. */
const SETS = 3;
/** Decoding several 720p streams at once stutters, so only the clips nearest the centre play. */
const MAX_PLAYING = 3;

export default function Showcase() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !CLIPS.length) return;
    const reduce = prefersReducedMotion();
    const clips = [...strip.querySelectorAll<HTMLElement>(".clip")];
    const videos = [...strip.querySelectorAll<HTMLVideoElement>("video")];
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(t: Window | HTMLElement, type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      t.addEventListener(type, fn as EventListener, opts);
      cleanups.push(() => t.removeEventListener(type, fn as EventListener, opts));
    };

    let setW = 0;
    const measure = () => {
      const next = clips[clips.length / SETS];
      setW = next ? next.offsetLeft - clips[0].offsetLeft : 0;
    };

    const visible = new Set<HTMLVideoElement>();
    const centre = () => strip.scrollLeft + strip.clientWidth / 2;
    const distance = (el: HTMLElement) => Math.abs(el.offsetLeft + el.offsetWidth / 2 - centre());

    const prunePlayback = () => {
      [...visible]
        .sort((a, b) => distance(a.parentElement!) - distance(b.parentElement!))
        .forEach((v, i) => {
          if (i < MAX_PLAYING) { if (v.paused) v.play()?.catch(() => {}); }
          else if (!v.paused) v.pause();
        });
    };

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) { visible.add(v); if (v.preload !== "auto") v.preload = "auto"; }
        else { visible.delete(v); v.pause(); }
      }
      prunePlayback();
    }, { threshold: 0.25 });
    videos.forEach((v) => io.observe(v));
    cleanups.push(() => io.disconnect());

    // Keep the scroll inside the middle set.
    const wrap = () => {
      if (!setW) measure();
      if (!setW) return;
      if (strip.scrollLeft < setW * 0.5) strip.scrollLeft += setW;
      else if (strip.scrollLeft > setW * 1.5) strip.scrollLeft -= setW;
    };

    let rafMark = 0;
    const mark = () => {
      cancelAnimationFrame(rafMark);
      rafMark = requestAnimationFrame(() => {
        let win = clips[0], best = Infinity;
        for (const el of clips) { const d = distance(el); if (d < best) { best = d; win = el; } }
        clips.forEach((el) => el.classList.toggle("active", el === win));
        prunePlayback();
      });
    };

    on(strip, "scroll", () => { wrap(); mark(); }, { passive: true });
    const settleRaf = requestAnimationFrame(() => { measure(); strip.scrollLeft = setW; mark(); });
    on(window, "resize", () => { measure(); mark(); }, { passive: true });

    // Mouse drag with momentum, no snapping.
    let down = false, sx = 0, sl = 0, moved = false;
    let vel = 0, lastX = 0, lastT = 0, glide = 0;

    on(strip, "pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(glide);
      down = true; moved = false; vel = 0;
      sx = lastX = e.clientX; sl = strip.scrollLeft; lastT = performance.now();
      strip.classList.add("dragging");
    });
    on(strip, "pointermove", (e) => {
      if (!down) return;
      const now = performance.now(), dt = now - lastT;
      if (dt > 0) vel = (e.clientX - lastX) / dt;
      lastX = e.clientX; lastT = now;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 3) moved = true;
      strip.scrollLeft = sl - dx;
    });
    const release = () => {
      if (!down) return;
      down = false;
      strip.classList.remove("dragging");
      if (reduce) return;
      let v = vel * 16;
      const step = () => {
        v *= 0.94;
        strip.scrollLeft -= v;
        wrap();
        if (Math.abs(v) > 0.25) glide = requestAnimationFrame(step);
      };
      if (Math.abs(v) > 0.5) glide = requestAnimationFrame(step);
    };
    on(window, "pointerup", release);
    on(window, "pointercancel", release);
    on(strip, "click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, { capture: true });

    return () => {
      cancelAnimationFrame(rafMark);
      cancelAnimationFrame(settleRaf);
      cancelAnimationFrame(glide);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const strip = (
    <div className="strip-wrap">
      <div className="strip" ref={stripRef} aria-label="Showcase clips">
        {CLIPS.length === 0 ? (
          <div className="empty">Add clips to public/media and list them in src/data/videos.json</div>
        ) : (
          Array.from({ length: SETS }, (_, s) =>
            CLIPS.map((v, i) => (
              <div className="clip" key={`${s}-${i}`} aria-hidden={s !== 1 || undefined}>
                <video muted loop playsInline preload="none" src={v.src} poster={v.poster} />
                {v.title && <span className="cap">{v.title}</span>}
              </div>
            )),
          )
        )}
      </div>
    </div>
  );

  return <Section id="showcase" title="Showcase" fullBleed={strip} />;
}
