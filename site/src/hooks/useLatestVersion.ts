import { useEffect, useState } from "react";

/**
 * "v" + version.txt from the repo (the same file the plugin checks for updates).
 * Always revalidated, so a release shows up without waiting on any cache.
 */
export function useLatestVersion(url: string | undefined) {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    const ctrl = new AbortController();
    fetch(url, { cache: "no-cache", signal: ctrl.signal })
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => {
        t = t.trim();
        if (/^v?\d+(\.\d+)*$/i.test(t)) setVersion("v" + t.replace(/^v/i, ""));
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [url]);

  return version;
}
