// Saves the Creator Store description into docs/store.json. The site reads the
// description live (via roproxy); this snapshot is only the fallback if that
// fails. Run by the Pages workflow on every deploy and once a day.
// Usage: node scripts/fetch-store.mjs
import { writeFile, readFile } from "node:fs/promises";

const ASSET = "96645663824840";
const OUT = new URL("../docs/store.json", import.meta.url);

try {
  const r = await fetch(`https://apis.roblox.com/toolbox-service/v1/items/details?assetIds=${ASSET}`);
  if (!r.ok) throw new Error(r.status);
  const item = (await r.json()).data?.[0];
  if (!item) throw new Error("asset not found");
  const out = { updated: new Date().toISOString(), description: item.asset.description };
  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log("store.json: description saved");
} catch (e) {
  // Never fail the deploy over this; keep the last committed snapshot.
  console.warn("fetch-store failed, keeping existing store.json:", e.message);
  try { await readFile(OUT); } catch { process.exitCode = 1; }
}
