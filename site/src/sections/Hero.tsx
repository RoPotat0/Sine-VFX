import { CFG } from "../config";
import { DiscordIcon, SineMark } from "../components/Icons";
import ExternalLink from "../components/ExternalLink";
import { useCountUp } from "../hooks/useCountUp";
import { useLatestVersion } from "../hooks/useLatestVersion";
import logo from "../assets/sine.png";
import "./Hero.css";

export default function Hero() {
  const users = useCountUp(CFG.users);
  const version = useLatestVersion(CFG.versionUrl);

  return (
    <section className="hero">
      <div className="wrap">
        <img className="hero-logo" src={logo} alt="Sine VFX" width={126} height={126} />
        <h1 className="wordmark">Sine VFX</h1>
        <div className="sinewave" aria-hidden="true" />
        <p className="sub">
          <b>The future of Roblox VFX.</b> An all-in-one VFX editor and toolkit built for Roblox Studio
        </p>

        <div className="actions">
          <a className="btn btn-primary big" href="#buy">
            <SineMark />
            Buy plugin
          </a>
          {CFG.discord && (
            <ExternalLink className="btn btn-soft big" href={CFG.discord}>
              <DiscordIcon />
              Discord
            </ExternalLink>
          )}
        </div>

        <div className="stats">
          <div className="stat"><b>{users}</b><span>Users</span></div>
          <div className="stat"><b>{version ?? "v…"}</b><span>latest</span></div>
        </div>
      </div>
    </section>
  );
}
