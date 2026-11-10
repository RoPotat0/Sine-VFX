import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
  /** Content that should run edge to edge instead of inside the centred column. */
  fullBleed?: ReactNode;
}

/** A page section: centred column, revealed heading with the gradient underline, then content. */
export default function Section({ id, title, children, fullBleed }: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="wrap">
        <Reveal as="h2" className="section-title">{title}</Reveal>
        {children}
      </div>
      {fullBleed}
    </section>
  );
}
