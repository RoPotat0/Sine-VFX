import type { ReactNode } from "react";
import ParticleBackground from "./ParticleBackground";
import Nav from "./Nav";
import Footer from "./Footer";

/** Page shell: fixed particle canvas behind a sticky nav, the sections, and the footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ParticleBackground />
      <Nav />
      <main id="top">{children}</main>
      <Footer />
    </>
  );
}
