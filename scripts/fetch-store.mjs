// Pulls the Creator Store listing (description, votes) and all reviews into
// docs/store.json. Run by the Pages workflow on every deploy and once a day,
// since the browser can't call Roblox's APIs directly (CORS).
// Usage: node scripts/fetch-store.mjs
import { writeFile, readFile } from "node:fs/promises";

const ASSET = "96645663824840";
const OUT = new URL("../docs/store.json", import.meta.url);

const get = async (url) => {
  const r = await fetch(url, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
};

try {
  const details = await get(`https://apis.roblox.com/toolbox-service/v1/items/details?assetIds=${ASSET}`);
  const item = details.data?.[0];
  if (!item) throw new Error("asset not found");

  const reviews = [];
  let cursor = "";
  for (let page = 0; page < 20; page++) {
    const q = `limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
    const d = await get(`https://apis.roblox.com/asset-reviews-api/v1/assets/${ASSET}/comments?${q}`);
    reviews.push(...(d.commentResponses || []));
    if (!d.hasMore || !d.nextCursor) break;
    cursor = d.nextCursor;
  }

  const out = {
    updated: new Date().toISOString(),
    description: item.asset.description,
    votes: {
      up: item.voting.upVotes,
      down: item.voting.downVotes,
      total: item.voting.voteCount,
      percent: item.voting.upVotePercent,
    },
    reviews: reviews
      .filter(r => r.text && r.text.trim())
      .map(r => ({
        user: r.commentingUsername,
        userId: r.commentingUserId,
        text: r.text.trim(),
        recommended: r.isRecommended,
        helpful: r.helpfulCount,
        date: r.createdUtc,
        reply: r.reply ? r.reply.text || null : null,
      })),
  };
  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`store.json: ${out.votes.percent}% of ${out.votes.total} votes, ${out.reviews.length} reviews`);
} catch (e) {
  // Never fail the deploy over this; keep the last committed snapshot.
  console.warn("fetch-store failed, keeping existing store.json:", e.message);
  try { await readFile(OUT); } catch { process.exitCode = 1; }
}
