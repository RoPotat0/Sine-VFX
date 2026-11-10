import { CFG } from "../config";
import { DiscordIcon } from "../components/Icons";
import ExternalLink from "../components/ExternalLink";
import logo from "../assets/sine.png";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <span className="brand">
          <img src={logo} alt="" width={32} height={32} />
          Sine VFX
        </span>
        {CFG.discord && (
          <ExternalLink href={CFG.discord}>
            <DiscordIcon />
            Discord
          </ExternalLink>
        )}
        <a href="/docs/">Docs</a>
      </div>
      <p className="credit">Inspired by VFX Forge &amp; QP2.</p>
    </footer>
  );
}
