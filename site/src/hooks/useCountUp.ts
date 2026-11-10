import { useEffect, useState } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

/** Counts from 0 up to the number in `raw` ("1850+" → 1,850+), keeping any suffix. */
export function useCountUp(raw: string | undefined, duration = 1100) {
  const str = String(raw ?? "");
  const target = parseInt(str.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = str.replace(/[0-9,]/g, "").trim();
  const format = (n: number) => n.toLocaleString() + suffix;

  const [text, setText] = useState(() => format(prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (prefersReducedMotion()) { setText(format(target)); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      setText(format(Math.round(target * (1 - Math.pow(1 - p, 3)))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, suffix, duration]);

  return text;
}
