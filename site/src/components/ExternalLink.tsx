import type { AnchorHTMLAttributes } from "react";

/** A link that opens in a new tab without handing the page an opener. */
export default function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
