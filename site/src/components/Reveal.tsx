import { createElement, useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

// One shared observer for every Reveal on the page.
const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;
const getObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        callbacks.get(e.target)?.();
        observer!.unobserve(e.target);
      }
    },
    { threshold: 0.12 },
  ));

interface RevealProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children?: ReactNode;
}

/** Fades and lifts its content in the first time it scrolls into view. */
export default function Reveal({ as = "div", className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(prefersReducedMotion);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    callbacks.set(el, () => setShown(true));
    getObserver().observe(el);
    return () => {
      callbacks.delete(el);
      getObserver().unobserve(el);
    };
  }, [shown]);

  const cls = ["reveal", shown && "in", className].filter(Boolean).join(" ");
  return createElement(as, { ref, className: cls }, children);
}
