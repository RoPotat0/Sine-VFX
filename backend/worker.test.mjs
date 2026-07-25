// Integration test: runs the REAL worker.js against the REAL schema.sql on in-memory SQLite,
// via a thin shim implementing the slice of the D1 API the worker uses.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import worker from "./worker.js";

const SCHEMA = new URL("./schema.sql", import.meta.url);

function makeDB() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(SCHEMA, "utf8"));
  return {
    prepare(sql) {
      let args = [];
      const api = {
        bind(...a) { args = a.map(v => (v === undefined ? null : v)); return api; },
        async first() { return db.prepare(sql).get(...args) ?? null; },
        async all() { return { results: db.prepare(sql).all(...args) }; },
        async run() { const r = db.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
      };
      return api;
    },
  };
}

const ADMIN = "test-admin-token";
let env, pass = 0, fail = 0;

const post = (path, body, headers = {}) =>
  worker.fetch(new Request("https://api.test" + path, {
    method: "POST", body: JSON.stringify(body),
    headers: { "content-type": "application/json", ...headers },
  }), env);

async function check(name, got, want) {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  const ok = g === w;
  ok ? pass++ : fail++;
  console.log(`${ok ? "  OK  " : "**FAIL"}  ${name.padEnd(52)} got=${g}${ok ? "" : `  want=${w}`}`);
}

const verdict = async (body) => {
  const r = await post("/v1/check", body);
  const d = await r.json();
  return { ok: d.ok, tier: d.tier };
};

const admin = (p, b) => post(p, b, { authorization: `Bearer ${ADMIN}` });
const DAY = 86400, nowS = () => Math.floor(Date.now() / 1000);

// ─────────────────────────────────────────────────────────────────────────────
env = { DB: makeDB(), ADMIN_TOKEN: ADMIN };

console.log("\n--- allowlist ---");
await admin("/v1/admin/allow", { robloxUser: 111, role: "tester" });
await check("allowlisted tester", await verdict({ installId: "i1", robloxUser: 111 }), { ok: true, tier: "tester" });

await admin("/v1/admin/allow", { robloxUser: 222, role: "banned", note: "chargeback" });
await check("banned user", await verdict({ installId: "i2", robloxUser: 222 }), { ok: false, tier: "banned" });

console.log("\n--- ban beats everything ---");
const kBan = await (await admin("/v1/admin/issue", { kind: "paid", seats: 5 })).json();
await check("banned user holding a VALID key",
  await verdict({ installId: "i2", robloxUser: 222, key: kBan.key }), { ok: false, tier: "banned" });

console.log("\n--- keys ---");
const k1 = await (await admin("/v1/admin/issue", { kind: "paid" })).json();
await check("valid key", await verdict({ installId: "i3", robloxUser: 333, key: k1.key }), { ok: true, tier: "paid" });
await check("same key+install again (seat reuse)",
  await verdict({ installId: "i3", robloxUser: 333, key: k1.key }), { ok: true, tier: "paid" });
await check("seat limit (1 seat, 2nd install)",
  await verdict({ installId: "i4", robloxUser: 444, key: k1.key }), { ok: false, tier: "none" });
await check("bad key does NOT silently fall back to trial",
  await verdict({ installId: "i5", robloxUser: 555, key: "SVFX-NOPE" }), { ok: false, tier: "none" });

console.log("\n--- trials ---");
await check("no key -> trial starts", await verdict({ installId: "i6", robloxUser: 666 }), { ok: true, tier: "trial" });
const t1 = await (await post("/v1/check", { installId: "i6", robloxUser: 666 })).json();
const t2 = await (await post("/v1/check", { installId: "iX", robloxUser: 666 })).json();
await check("trial resumes, not restarted by new install", t2.expiresAt === t1.expiresAt, true);
await check("anonymous (not signed in) refused",
  await verdict({ installId: "i7", robloxUser: 0 }), { ok: false, tier: "anonymous" });

// expired trial
env.DB.prepare("UPDATE trials SET expires_at = ? WHERE roblox_user = ?").bind(nowS() - DAY, 666);
await (async () => { const p = env.DB.prepare("UPDATE trials SET expires_at = ? WHERE roblox_user = ?"); await p.bind(nowS() - DAY, 666).run(); })();
await check("expired trial", await verdict({ installId: "i6", robloxUser: 666 }), { ok: false, tier: "expired" });

console.log("\n--- expired allowlist grant falls through ---");
await admin("/v1/admin/allow", { robloxUser: 777, role: "paid", expiresAt: nowS() - DAY });
await check("expired grant, no key -> trial",
  await verdict({ installId: "i8", robloxUser: 777 }), { ok: true, tier: "trial" });
const k2 = await (await admin("/v1/admin/issue", { kind: "lifetime" })).json();
await check("expired grant + valid key -> key wins",
  await verdict({ installId: "i9", robloxUser: 888, key: k2.key }), { ok: true, tier: "lifetime" });

console.log("\n--- client contract ---");
const g = await (await post("/v1/check", { installId: "i1", robloxUser: 111 })).json();
await check("graceDays always present", typeof g.graceDays === "number", true);
await check("denial is HTTP 200, not an error status",
  (await post("/v1/check", { installId: "i2", robloxUser: 222 })).status, 200);
await check("missing installId -> 400", (await post("/v1/check", { robloxUser: 1 })).status, 400);

console.log("\n--- admin auth ---");
await check("admin without token -> 401", (await post("/v1/admin/list", {})).status, 401);
await check("admin with bad token -> 401",
  (await post("/v1/admin/list", {}, { authorization: "Bearer wrong" })).status, 401);
const list = await (await admin("/v1/admin/list", {})).json();
await check("admin list returns rows", list.ok && list.count >= 3, true);
await admin("/v1/admin/revoke", { robloxUser: 111 });
await check("revoked user drops to trial", await verdict({ installId: "i1", robloxUser: 111 }), { ok: true, tier: "trial" });

// ── admin token robustness (added after a real "unauthorized" mismatch on Windows) ──
console.log("\n--- admin token whitespace ---");
{
  const envWs = { DB: makeDB(), ADMIN_TOKEN: "abc123\r\n" };   // secret stored with a stray CRLF
  const call = (auth) => worker.fetch(new Request("https://api.test/v1/admin/list", {
    method: "POST", body: "{}", headers: { "content-type": "application/json", authorization: auth },
  }), envWs);
  await check("secret has trailing CRLF, clean header", (await call("Bearer abc123")).status, 200);
  await check("header has trailing space",              (await call("Bearer abc123 ")).status, 200);
  await check("wrong token still rejected",             (await call("Bearer nope")).status, 401);

  const envEmpty = { DB: makeDB(), ADMIN_TOKEN: "" };
  const callE = (auth) => worker.fetch(new Request("https://api.test/v1/admin/list", {
    method: "POST", body: "{}", headers: { "content-type": "application/json", authorization: auth },
  }), envEmpty);
  await check("unset ADMIN_TOKEN rejects 'Bearer '",    (await callE("Bearer ")).status, 401);
  await check("unset ADMIN_TOKEN rejects empty header", (await callE("")).status, 401);
}

console.log("\n--- version telemetry ---");
{
  await admin("/v1/admin/allow", { robloxUser: 900, role: "tester" });
  await post("/v1/check", { installId: "a", robloxUser: 900, version: "1.2.3" });
  const read = async () => (await env.DB.prepare(
    "SELECT version FROM allowlist WHERE roblox_user = ?").bind(900).first()).version;
  await check("plugin check-in records version", await read(), "1.2.3");
  await post("/v1/check", { installId: "a", robloxUser: 900 });   // version-less probe
  await check("version-less probe does not wipe it", await read(), "1.2.3");
  await post("/v1/check", { installId: "a", robloxUser: 900, version: "1.3.0" });
  await check("newer version overwrites", await read(), "1.3.0");
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
