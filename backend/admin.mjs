/**
 * SineVFX admin CLI — wraps the /v1/admin/* endpoints so you never hand-write curl.
 *
 * The bearer token is read from admin-token.txt (gitignored), so it is never typed, pasted, or
 * left in shell history.
 *
 *   node admin.mjs list                       show everyone, most recently active first
 *   node admin.mjs add <userId> [role] [note] grant access   (role defaults to tester)
 *   node admin.mjs remove <userId>            delete the row entirely
 *   node admin.mjs ban <userId> [note]        keep the row but refuse access
 *   node admin.mjs key [kind] [seats] [note]  mint a license key to hand out
 *   node admin.mjs check <userId>             show exactly what the plugin would see
 *
 * Roles: tester | paid | lifetime | banned
 */

import { readFileSync } from "node:fs";

const API = "https://sinevfx-api.chutkapro480.workers.dev";

function token() {
  try {
    return readFileSync(new URL("./admin-token.txt", import.meta.url), "utf8").trim();
  } catch {
    console.error("Could not read admin-token.txt. Recreate it with:\n" +
      '  node -e "require(\'fs\').writeFileSync(\'admin-token.txt\', require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n' +
      "  npx wrangler secret put ADMIN_TOKEN < admin-token.txt");
    process.exit(1);
  }
}

async function call(path, body, withAuth = true) {
  const res = await fetch(API + path, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(withAuth ? { authorization: `Bearer ${token()}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  const text = await res.text();
  try { return { status: res.status, data: JSON.parse(text) }; }
  catch { return { status: res.status, data: { raw: text } }; }
}

function die(msg) { console.error(msg); process.exit(1); }

const when = (t) => (t ? new Date(t * 1000).toISOString().slice(0, 16).replace("T", " ") : "—");

const [cmd, ...args] = process.argv.slice(2);

switch (cmd) {
  case "list": {
    const { data } = await call("/v1/admin/list");
    if (!data.ok) die(`Failed: ${data.error}`);
    if (!data.users.length) { console.log("Nobody on the allowlist yet."); break; }
    console.log(
      "USER ID".padEnd(14) + "ROLE".padEnd(10) + "LAST SEEN".padEnd(18) +
      "VER".padEnd(8) + "NOTE"
    );
    for (const u of data.users) {
      console.log(
        String(u.roblox_user).padEnd(14) +
        String(u.role).padEnd(10) +
        when(u.last_seen).padEnd(18) +
        String(u.version ?? "—").padEnd(8) +
        (u.note ?? "")
      );
    }
    console.log(`\n${data.count} total`);
    break;
  }

  case "add": {
    const [userId, role = "tester", ...note] = args;
    if (!userId) die("Usage: node admin.mjs add <userId> [role] [note]");
    const { data } = await call("/v1/admin/allow", {
      robloxUser: Number(userId), role, note: note.join(" ") || undefined,
    });
    console.log(data.ok ? `Added ${userId} as ${data.role}.` : `Failed: ${data.error}`);
    break;
  }

  case "remove": {
    const [userId] = args;
    if (!userId) die("Usage: node admin.mjs remove <userId>");
    const { data } = await call("/v1/admin/revoke", { robloxUser: Number(userId) });
    console.log(data.ok
      ? (data.removed ? `Removed ${userId}.` : `${userId} was not on the list.`)
      : `Failed: ${data.error}`);
    console.log("Note: they may still get a free trial. Use `ban` to refuse them outright.");
    break;
  }

  case "ban": {
    const [userId, ...note] = args;
    if (!userId) die("Usage: node admin.mjs ban <userId> [note]");
    const { data } = await call("/v1/admin/allow", {
      robloxUser: Number(userId), role: "banned", note: note.join(" ") || undefined,
    });
    console.log(data.ok ? `Banned ${userId}. This beats any key or trial they hold.` : `Failed: ${data.error}`);
    break;
  }

  case "key": {
    const [kind = "paid", seats = "1", ...note] = args;
    const { data } = await call("/v1/admin/issue", {
      kind, seats: Number(seats), note: note.join(" ") || undefined,
    });
    if (!data.ok) die(`Failed: ${data.error}`);
    console.log(`New ${kind} key (${seats} seat${seats === "1" ? "" : "s"}):\n\n  ${data.key}\n`);
    break;
  }

  case "check": {
    const [userId] = args;
    if (!userId) die("Usage: node admin.mjs check <userId>");
    // Deliberately unauthenticated and with a throwaway installId: this is the exact call the
    // plugin makes, so it shows what that user really sees.
    const { data } = await call("/v1/check",
      { installId: "admin-cli-probe", robloxUser: Number(userId) }, false);
    console.log(data);
    break;
  }

  default:
    console.log(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].split("\n")
      .slice(1).map((l) => l.replace(/^ \* ?/, "")).join("\n"));
}
