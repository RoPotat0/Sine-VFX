import type { ReactNode } from "react";
import { CFG } from "../config";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import ExternalLink from "../components/ExternalLink";
import { ArrowIcon, ChevronIcon, ShirtIcon } from "../components/Icons";
import robloxLogo from "../assets/roblox.png";
import "./Buy.css";

interface StoreCardProps {
  href: string;
  title: ReactNode;
  sub: string;
  /** Badge content; defaults to the Roblox logo. */
  badge?: ReactNode;
  tone?: "blue" | "green";
}

function StoreCard({ href, title, sub, badge, tone = "blue" }: StoreCardProps) {
  return (
    <Reveal>
      <ExternalLink className="storecard" href={href}>
        <span className={`scbadge ${tone}`}>{badge ?? <img src={robloxLogo} alt="Roblox" width={24} height={24} />}</span>
        <span className="sctext">
          <b>{title}</b>
          <span>{sub}</span>
        </span>
        <span className="scarrow"><ArrowIcon /></span>
      </ExternalLink>
    </Reveal>
  );
}

/** Collapsed explanation under an option. */
function Explain({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <details className="explain">
        <summary>How it works<ChevronIcon /></summary>
        <div className="explain-body">{children}</div>
      </details>
    </Reveal>
  );
}

export default function Buy() {
  const store = CFG.pay?.creatorStore;
  const shirt = CFG.pay?.shirt;
  const shirtPrice = CFG.pay?.shirtPrice ?? "3000 Robux";

  return (
    <Section id="buy" title="Get Sine VFX">
      {store && (
        <>
          <StoreCard
            href={store}
            title={<>Get it on the Creator Store &middot; {CFG.price ?? "$7.99"}</>}
            sub="Buy once, installs straight into Studio"
          />
          <Explain>
            <p>Bought on the Roblox Creator Store, so it installs and updates itself right inside Studio.</p>
          </Explain>
        </>
      )}

      {store && shirt && <Reveal className="ordiv">or</Reveal>}

      {shirt && (
        <div className="shirtblock">
          <StoreCard
            href={shirt}
            title={<>Buy the Sine VFX shirt &middot; {shirtPrice}</>}
            sub="Pay with Robux, then verify in Discord to get the plugin"
            badge={<ShirtIcon />}
            tone="green"
          />
          <Explain>
            <ol className="shirtsteps">
              <li>Buy the shirt on Roblox with your {shirtPrice}.</li>
              <li>
                Join the {CFG.discord ? <ExternalLink href={CFG.discord}>Discord</ExternalLink> : "Discord"} and
                open the <b>Buyer Role</b> post.
              </li>
              <li>Hit <b>Connect</b>, sign in with Roblox, and the bot verifies your purchase.</li>
              <li>You get the <b>Buyer</b> role and the plugin file. Done.</li>
            </ol>
            <p>
              The shirt version is a local plugin, so it does not auto-update like the Creator Store one. You must
              join the Discord and verify to receive it.
            </p>
          </Explain>
        </div>
      )}
    </Section>
  );
}
