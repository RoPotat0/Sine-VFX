import { useEffect, useState } from "react";
import { CFG } from "../config";
import { DiscordIcon } from "../components/Icons";
import ExternalLink from "../components/ExternalLink";
import logo from "../assets/sine.png";
import "./Nav.css";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="wrap">
        <a className="brand" href="#top">
          <img src={logo} alt="" width={32} height={32} />
          Sine VFX
        </a>
        <nav>
          <a href="#showcase">Showcase</a>
          <a href="#features">Features</a>
          <a href="#buy">Get it</a>
          <a href="/docs/">Docs</a>
          {CFG.discord && (
            <ExternalLink className="dsc" href={CFG.discord}>
              <DiscordIcon />
              Discord
            </ExternalLink>
          )}
        </nav>
      </div>
    </header>
  );
}
