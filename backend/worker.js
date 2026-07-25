/**
 * SineVFX API — Cloudflare Worker + D1
 *
 * Endpoints (all POST, JSON in/out):
 *   /v1/check      { installId, robloxUser, version, key? } -> THE one the plugin calls. Resolves
 *                                                              allowlist -> key -> trial and returns
 *                                                              a single verdict.
 *   /v1/activate   { key, installId, robloxUser, version }  -> validate + bind a license
 *   /v1/trial      { installId, robloxUser }                -> start or resume a free trial
 *   /v1/heartbeat  { key|trial, installId, version }        -> keep last_seen fresh, re-check validity
 *   /v1/admin/*    (bearer ADMIN_TOKEN) issue keys, grant/revoke/list allowlist entries
 *
 * Website-only:
 *   /v1/claim  (POST) { username }  -> grant access if the account OWNS the Creator Store
 *                                      plugin or the Robux shirt (proof of purchase, no code)
 *   /v1/price?asset=ID    -> live Robux price read from the Roblox listing (CORS-proxied)
 *   /v1/order?session=ID  -> verifies the Stripe checkout is paid (via the account secret key)
 *                            and mints/returns one code. Needs secret STRIPE_SECRET_KEY.
 *
 * The plugin only ever calls /v1/check. activate/trial/heartbeat stay for direct use and because
 * /v1/check delegates to them, but a client does not need to know which case it falls into.
 *
 * Version info and changelogs deliberately do NOT live here — the plugin reads those straight from
 * the public GitHub repo (CDN-cached, free, no auth). This service only answers "may this install
 * run, and until when".
 *
 * Deploy:
 *   wrangler d1 create sinevfx
 *   wrangler d1 execute sinevfx --file=./schema.sql --remote
 *   wrangler secret put ADMIN_TOKEN         # for /v1/admin/issue
 *   wrangler deploy
 */

// 3 days, per the pricing page. Existing trials keep whatever expires_at they were written with —
// this only affects trials started from here on, so shortening it cannot cut anyone off early.
const TRIAL_DAYS = 3;
// How long the plugin may keep running on a cached verdict when it cannot reach this Worker.
// Sent in every /v1/check reply so it can be retuned here without shipping a plugin update.
const GRACE_DAYS = 7;
// The two Roblox purchases we can verify by ownership: buying either makes the account
// OWN the asset, which Roblox's inventory API confirms — proof of purchase, no code
// needed. Keep these in sync with the creatorStore/shirt links in the site config.
const OWNED_ASSETS = {
  plugin: "108799042998848",   // Creator Store plugin
  shirt:  "138288042903286",   // Robux shirt
};
// CORS is required for the marketing site (GitHub Pages) to call this at all — a browser blocks a
// cross-origin fetch that carries no allow-origin header. The plugin never cared, which is why this
// was absent. "*" is correct here: every endpoint is either public (stats) or authenticated by a
// value in the BODY (key / installId / bearer token), never by an ambient cookie, so there is no
// session for another origin to ride. Do NOT add credentialed auth without narrowing this.
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, authorization",
  "access-control-max-age": "86400",
};
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });
const now = () => Math.floor(Date.now() / 1000);

/** Roblox plugins send no useful Origin; treat every request as untrusted input. */
function clean(v, max = 128) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s || s.length > max) return null;
  return s;
}

async function activate(env, body) {
  const key = clean(body.key, 64);
  const installId = clean(body.installId, 64);
  if (!key || !installId) return json({ ok: false, error: "missing key or installId" }, 400);

  const lic = await env.DB.prepare("SELECT * FROM licenses WHERE key = ?").bind(key).first();
  if (!lic) return json({ ok: false, error: "invalid key" }, 403);
  if (lic.kind === "revoked") return json({ ok: false, error: "key revoked" }, 403);
  if (lic.expires_at && lic.expires_at < now())
    return json({ ok: false, error: "key expired", expiresAt: lic.expires_at }, 403);

  // Seat limiting: an existing (key, installId) pair is always allowed back in; a NEW install is
  // only allowed if the key still has a free seat.
  const seen = await env.DB.prepare(
    "SELECT id FROM activations WHERE key = ? AND install_id = ?"
  ).bind(key, installId).first();

  if (!seen) {
    const { c } = await env.DB.prepare(
      "SELECT COUNT(*) AS c FROM activations WHERE key = ?"
    ).bind(key).first();
    if (c >= lic.max_seats)
      return json({ ok: false, error: "seat limit reached", seats: lic.max_seats }, 403);
  }

  const t = now();
  await env.DB.prepare(
    `INSERT INTO activations (key, install_id, roblox_user, first_seen, last_seen, version)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(key, install_id) DO UPDATE SET last_seen = excluded.last_seen,
                                                version   = excluded.version,
                                                roblox_user = COALESCE(excluded.roblox_user, activations.roblox_user)`
  ).bind(key, installId, body.robloxUser ?? null, t, t, clean(body.version, 32)).run();

  // Bind the key to the first Roblox user who activates it (informational, not enforced).
  if (!lic.roblox_user && body.robloxUser) {
    await env.DB.prepare("UPDATE licenses SET roblox_user = ? WHERE key = ?")
      .bind(body.robloxUser, key).run();
  }

  return json({ ok: true, kind: lic.kind, expiresAt: lic.expires_at ?? null });
}

async function trial(env, body) {
  const installId = clean(body.installId, 64);
  const user = Number(body.robloxUser) || 0;
  if (!installId) return json({ ok: false, error: "missing installId" }, 400);
  // Keyed by Roblox user so reinstalling does not mint a fresh trial. Anonymous (user 0) is
  // refused rather than silently granting an unlimited-restart trial.
  if (!user) return json({ ok: false, error: "sign in to Studio to start a trial" }, 403);

  const existing = await env.DB.prepare("SELECT * FROM trials WHERE roblox_user = ?")
    .bind(user).first();

  if (existing) {
    const active = existing.expires_at > now();
    return json({
      ok: active,
      kind: "trial",
      expiresAt: existing.expires_at,
      error: active ? undefined : "trial expired",
    });
  }

  const t = now();
  const expires = t + TRIAL_DAYS * 86400;
  await env.DB.prepare(
    "INSERT INTO trials (roblox_user, install_id, started_at, expires_at) VALUES (?, ?, ?, ?)"
  ).bind(user, installId, t, expires).run();
  return json({ ok: true, kind: "trial", expiresAt: expires, days: TRIAL_DAYS });
}

async function heartbeat(env, body) {
  const installId = clean(body.installId, 64);
  const key = clean(body.key, 64);
  if (!installId) return json({ ok: false, error: "missing installId" }, 400);
  if (key) return activate(env, body);           // same validity rules, refreshes last_seen
  return trial(env, body);
}

/**
 * The single question the plugin asks: "may this user run, and until when?"
 *
 * Resolution order is deliberate:
 *   1. banned      -- a ban must beat any key or trial the account also holds
 *   2. allowlist   -- direct grants (testers, comped users) need no key
 *   3. key         -- if the plugin is holding one, validate + refresh the seat
 *   4. trial       -- otherwise start or resume the free trial
 *
 * Always returns 200 with { ok } telling the plugin what to do -- a non-2xx would be
 * indistinguishable from a network failure, and the client treats those very differently
 * (a failure falls back to the cached verdict; a denial revokes it).
 */
async function check(env, body) {
  const installId = clean(body.installId, 64);
  const user = Number(body.robloxUser) || 0;
  const version = clean(body.version, 32);
  if (!installId) return json({ ok: false, tier: "none", error: "missing installId" }, 400);

  const base = { graceDays: GRACE_DAYS };
  const t = now();

  if (user) {
    const row = await env.DB.prepare("SELECT * FROM allowlist WHERE roblox_user = ?")
      .bind(user).first();

    if (row) {
      // Refresh presence regardless of verdict, so the table doubles as an activity view.
      // COALESCE so a version-less probe (the admin CLI, a curl smoke test) records the visit
      // without wiping the last version the real plugin reported.
      await env.DB.prepare(
        "UPDATE allowlist SET last_seen = ?, version = COALESCE(?, version) WHERE roblox_user = ?"
      ).bind(t, version, user).run();

      if (row.role === "banned")
        return json({ ...base, ok: false, tier: "banned", message: row.note || "Access revoked." });

      if (!row.expires_at || row.expires_at > t)
        return json({ ...base, ok: true, tier: row.role, expiresAt: row.expires_at ?? null });

      // An expired allowlist grant is not fatal: fall through so a key or trial can still apply.
    }
  }

  if (clean(body.key, 64)) {
    const res = await activate(env, body);
    const data = await res.clone().json();
    if (data.ok) return json({ ...base, ok: true, tier: data.kind, expiresAt: data.expiresAt ?? null });
    // Bad/expired/seat-limited key: say so rather than silently dropping them onto a trial.
    return json({ ...base, ok: false, tier: "none", message: data.error });
  }

  // Not signed in: distinct from "expired". The plugin shows a "sign in" prompt for this, and a
  // trial cannot be keyed to an account anyway.
  if (!user)
    return json({ ...base, ok: false, tier: "anonymous",
                  message: "Sign in to Roblox Studio to use SineVFX." });

  const res = await trial(env, body);
  const data = await res.clone().json();
  return json({
    ...base,
    ok: !!data.ok,
    tier: data.ok ? "trial" : "expired",
    expiresAt: data.expiresAt ?? null,
    message: data.error,
  });
}

/**
 * Every /v1/admin/* route shares one bearer check. Returns null when the caller is authorised.
 *
 * Both sides are trimmed: a token pasted into `wrangler secret put` on Windows routinely picks up a
 * trailing \r or space, and comparing raw then fails in a way that looks identical to a wrong token.
 * An unset ADMIN_TOKEN is rejected outright rather than matching a caller who sends "Bearer ".
 */
function requireAdmin(env, req) {
  const expected = (env.ADMIN_TOKEN || "").trim();
  const got = (req.headers.get("authorization") || "").trim().replace(/^Bearer\s+/i, "");
  if (!expected || got !== expected) return json({ ok: false, error: "unauthorized" }, 401);
  return null;
}

/** Admin: grant (or update) access for a Roblox user id. This replaces editing whitelist.json. */
async function allow(env, req, body) {
  const denied = requireAdmin(env, req);
  if (denied) return denied;
  const user = Number(body.robloxUser) || 0;
  const role = clean(body.role, 16) || "tester";
  if (!user) return json({ ok: false, error: "missing robloxUser" }, 400);
  if (!["tester", "paid", "lifetime", "banned"].includes(role))
    return json({ ok: false, error: "bad role" }, 400);

  await env.DB.prepare(
    `INSERT INTO allowlist (roblox_user, role, expires_at, added_at, note)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(roblox_user) DO UPDATE SET role       = excluded.role,
                                            expires_at = excluded.expires_at,
                                            note       = excluded.note`
  ).bind(user, role, body.expiresAt ?? null, now(), clean(body.note, 256)).run();
  return json({ ok: true, robloxUser: user, role });
}

/** Admin: remove a user entirely. To BAN instead, use /v1/admin/allow with role 'banned'. */
async function revoke(env, req, body) {
  const denied = requireAdmin(env, req);
  if (denied) return denied;
  const user = Number(body.robloxUser) || 0;
  if (!user) return json({ ok: false, error: "missing robloxUser" }, 400);
  const r = await env.DB.prepare("DELETE FROM allowlist WHERE roblox_user = ?").bind(user).run();
  return json({ ok: true, removed: r.meta?.changes ?? 0 });
}

/** Admin: dump the allowlist, most recently active first. */
async function listUsers(env, req) {
  const denied = requireAdmin(env, req);
  if (denied) return denied;
  const { results } = await env.DB.prepare(
    "SELECT * FROM allowlist ORDER BY COALESCE(last_seen, added_at) DESC LIMIT 500"
  ).all();
  return json({ ok: true, count: results.length, users: results });
}

/** Admin: mint a key. Protected by a bearer secret, never called from the plugin. */
async function issue(env, req, body) {
  const denied = requireAdmin(env, req);
  if (denied) return denied;
  const key = "SVFX-" + crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
  await env.DB.prepare(
    "INSERT INTO licenses (key, kind, created_at, expires_at, max_seats, note) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(key, body.kind || "paid", now(), body.expiresAt ?? null, body.seats ?? 1, clean(body.note, 256))
   .run();
  return json({ ok: true, key });
}

/**
 * Public counters for the website. Deliberately aggregate-only — no ids, no names, nothing that
 * identifies a user — because this is the one endpoint served to anonymous browsers.
 *   installs = distinct Studio installs that ever activated a key
 *   users    = distinct Roblox accounts across activations + trials + allowlist (banned excluded)
 */
async function stats(env) {
  const one = async (sql) => ((await env.DB.prepare(sql).first()) || {}).n || 0;
  const [installs, users, trialsN, licensesN] = await Promise.all([
    one("SELECT COUNT(DISTINCT install_id) AS n FROM activations"),
    one(`SELECT COUNT(*) AS n FROM (
           SELECT roblox_user FROM activations WHERE roblox_user IS NOT NULL
           UNION SELECT roblox_user FROM trials
           UNION SELECT roblox_user FROM allowlist WHERE role != 'banned')`),
    one("SELECT COUNT(*) AS n FROM trials"),
    one("SELECT COUNT(*) AS n FROM licenses WHERE kind IN ('paid','lifetime')"),
  ]);
  return json({ ok: true, installs, users, trials: trialsN, licenses: licensesN });
}

/**
 * Website redemption: turn a purchased key into access for a Roblox ACCOUNT, with no Studio install
 * involved. This is the "buy now, activate later / I only know my username" path.
 *
 * It writes an `allowlist` row rather than an `activations` row on purpose:
 *   - /v1/check already resolves allowlist BEFORE keys, so the plugin lights up on next launch with
 *     the user having typed nothing into Studio;
 *   - activations are seat records tied to a real installId, and a browser has none — binding one
 *     here would burn a seat on a machine that does not exist.
 *
 * The username -> id lookup runs HERE, not in the page: Roblox's users API sends no CORS headers, so
 * a browser cannot call it directly.
 */
/**
 * Roblox's edge intermittently answers a perfectly valid request with 522/5xx (a
 * momentary connection blip, not a real error). Retrying a few times turns those
 * transient failures back into the real answer. Returns the Response, or null if it
 * genuinely could not reach Roblox after all attempts.
 */
async function robloxFetch(path, opts, tries = 3) {
  // roproxy.com is a public mirror of the Roblox API; trying it after roblox.com
  // means both independent hosts have to blip at once before we give up.
  for (const host of ["roblox.com", "roproxy.com"]) {
    for (let i = 0; i < tries; i++) {
      try {
        const r = await fetch(`https://${path.replace("{host}", host)}`, opts);
        if (r.status !== 429 && r.status < 500) return r;   // 2xx / 4xx are real answers
      } catch { /* network error — fall through to retry */ }
      await new Promise(res => setTimeout(res, 200 * (i + 1)));
    }
  }
  return null;                                 // gave up (transient 5xx / 429 / network)
}

/** Returns { id, name }, null (no such user), or "busy" (Roblox unreachable right now). */
async function resolveRobloxUser(username) {
  const res = await robloxFetch("users.{host}/v1/usernames/users", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
  });
  if (!res || !res.ok) return "busy";          // blocked/blip, not "user doesn't exist"
  const data = await res.json().catch(() => null);
  if (!data || !Array.isArray(data.data)) return "busy";
  const hit = data.data[0];
  return hit && hit.id ? { id: hit.id, name: hit.name } : null;   // clean empty = no such user
}

async function redeem(env, body) {
  const key = clean(body.key, 64);
  const username = clean(body.username, 32);
  if (!key || !username) return json({ ok: false, error: "missing key or username" }, 400);

  const lic = await env.DB.prepare("SELECT * FROM licenses WHERE key = ?").bind(key).first();
  if (!lic) return json({ ok: false, error: "That code is not valid." }, 403);
  if (lic.kind === "revoked") return json({ ok: false, error: "That code has been revoked." }, 403);
  if (lic.expires_at && lic.expires_at < now())
    return json({ ok: false, error: "That code has expired." }, 403);

  const user = await resolveRobloxUser(username);
  if (user === "busy") return json({ ok: false, error: "Roblox is busy right now. Please try again in a moment." }, 503);
  if (!user) return json({ ok: false, error: "No Roblox account with that username." }, 404);

  // Already bound to someone else -> a second person cannot reuse the same code.
  if (lic.roblox_user && lic.roblox_user !== user.id)
    return json({ ok: false, error: "That code has already been redeemed." }, 409);

  const banned = await env.DB.prepare(
    "SELECT role FROM allowlist WHERE roblox_user = ? AND role = 'banned'"
  ).bind(user.id).first();
  if (banned) return json({ ok: false, error: "That account cannot redeem codes." }, 403);

  const role = lic.kind === "lifetime" ? "lifetime" : "paid";
  await env.DB.batch([
    env.DB.prepare("UPDATE licenses SET roblox_user = ? WHERE key = ?").bind(user.id, key),
    env.DB.prepare(
      `INSERT INTO allowlist (roblox_user, role, expires_at, added_at, note)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(roblox_user) DO UPDATE SET
         role = excluded.role, expires_at = excluded.expires_at, note = excluded.note`
    ).bind(user.id, role, lic.expires_at || null, now(), "web redeem " + key),
  ]);

  return json({ ok: true, tier: role, username: user.name, robloxUser: user.id,
                expiresAt: lic.expires_at || null });
}

/**
 * "Do I already have this?" for the website, answered by Roblox username alone.
 * Read-only and deliberately thin: it reports a tier and an expiry, never ids,
 * notes, keys or anything else about the account.
 */
async function status(env, body) {
  const username = clean(body.username, 32);
  if (!username) return json({ ok: false, error: "missing username" }, 400);

  const user = await resolveRobloxUser(username);
  if (user === "busy") return json({ ok: false, error: "Roblox is busy right now. Please try again in a moment." }, 503);
  if (!user) return json({ ok: false, error: "No Roblox account with that username." }, 404);

  const allow = await env.DB.prepare(
    "SELECT role, expires_at FROM allowlist WHERE roblox_user = ?"
  ).bind(user.id).first();

  if (allow && allow.role === "banned")
    return json({ ok: true, has: false, tier: "banned", username: user.name });

  if (allow && (!allow.expires_at || allow.expires_at > now()))
    return json({ ok: true, has: true, tier: allow.role, expiresAt: allow.expires_at || null,
                  username: user.name });

  const trial = await env.DB.prepare(
    "SELECT expires_at FROM trials WHERE roblox_user = ?"
  ).bind(user.id).first();

  if (trial && trial.expires_at > now())
    return json({ ok: true, has: true, tier: "trial", expiresAt: trial.expires_at,
                  username: user.name });

  return json({ ok: true, has: false, tier: trial ? "expired" : "none", username: user.name });
}

/**
 * Live Robux price, read straight from the Roblox listing so the site never shows a
 * stale hardcoded number. Roblox's economy API sends no CORS headers, so the browser
 * cannot call it — the Worker does, and caches the answer at the edge for 10 minutes.
 * `asset` defaults to the shirt/collectible the Robux button points at.
 */
async function price(env, url) {
  const asset = clean(url.searchParams.get("asset"), 32);
  const id = /^\d+$/.test(asset || "") ? asset : "138288042903286";
  try {
    const r = await fetch(`https://economy.roblox.com/v2/assets/${id}/details`, {
      headers: { accept: "application/json" },
      cf: { cacheTtl: 600, cacheEverything: true },
    });
    if (!r.ok) return json({ ok: false, error: "roblox " + r.status });
    const d = await r.json();
    const robux = Number(d.PriceInRobux) || null;
    return json({ ok: true, robux, forSale: !!d.IsForSale });
  } catch {
    return json({ ok: false, error: "could not reach Roblox" });
  }
}

/**
 * Stripe auto-fulfilment, webhook-free. The success page hands us the checkout
 * session id (public, in the redirect URL); we ask Stripe's API — with the account's
 * secret key — whether that session is actually paid, and only then mint a code.
 *
 * Idempotent: the session id is stored in the licence note, so polling (or a second
 * visit to the receipt link) always returns the same one code, never a new one.
 *
 * Safe to expose: a session id is unguessable and cannot be forged as paid, and this
 * only ever reads Stripe / writes one licence — the secret key never leaves the Worker.
 */
/**
 * PayPal auto-fulfilment via IPN (Instant Payment Notification). PayPal POSTs here on
 * every completed payment; we bounce the exact body straight back to PayPal, which only
 * answers "VERIFIED" for a genuine notification to this account. Then we mint a code
 * tagged with the payer email + transaction id. No API keys needed — turning on IPN in
 * PayPal account settings is the entire setup.
 */
async function paypalIPN(env, raw) {
  const verify = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": "SineVFX-IPN/1.0" },
    body: "cmd=_notify-validate&" + raw,
  });
  const verdict = (await verify.text()).trim();
  if (verdict !== "VERIFIED") return new Response("", { status: 200 });   // spoofed / invalid: ignore

  const p = new URLSearchParams(raw);
  const status = p.get("payment_status");
  const txn = p.get("txn_id");
  const email = (p.get("payer_email") || "").toLowerCase();
  const gross = parseFloat(p.get("mc_gross") || "0");

  // Only a completed payment of at least $4 mints a code; everything else is ignored.
  if (status === "Completed" && txn && email && gross >= 4) {
    const seen = await env.DB.prepare("SELECT key FROM licenses WHERE note LIKE ?")
      .bind("paypal|%|" + txn).first();
    if (!seen) {
      const key = "SVFX-" + crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
      await env.DB.prepare(
        "INSERT INTO licenses (key, kind, created_at, expires_at, max_seats, note) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(key, "paid", now(), null, 1, `paypal|${email}|${txn}`).run();
    }
  }
  return new Response("", { status: 200 });   // always 200 so PayPal stops re-sending
}

/** The PayPal return page polls this with the payer's email to fetch their code. */
async function paypalOrder(env, url) {
  const email = clean((url.searchParams.get("email") || "").toLowerCase(), 128);
  if (!email) return json({ ok: false, error: "missing email" }, 400);
  const row = await env.DB.prepare(
    "SELECT key FROM licenses WHERE note LIKE ? ORDER BY created_at DESC LIMIT 1"
  ).bind("paypal|" + email + "|%").first();
  if (!row) return json({ ok: true, pending: true });
  return json({ ok: true, key: row.key });
}

async function order(env, url) {
  const session = clean(url.searchParams.get("session"), 128);
  if (!session) return json({ ok: false, error: "missing session" }, 400);

  const tag = "stripe:" + session;
  const existing = await env.DB.prepare("SELECT key FROM licenses WHERE note = ?").bind(tag).first();
  if (existing) return json({ ok: true, key: existing.key });

  const sk = (env.STRIPE_SECRET_KEY || "").trim();
  if (!sk) return json({ ok: false, error: "stripe not configured" }, 500);

  const r = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session)}`,
    { headers: { authorization: "Bearer " + sk } });
  if (!r.ok) return json({ ok: true, pending: true });      // not found yet / still processing
  const s = await r.json().catch(() => null);
  const paid = s && (s.payment_status === "paid" || s.status === "complete");
  if (!paid) return json({ ok: true, pending: true });

  const key = "SVFX-" + crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
  await env.DB.prepare(
    "INSERT INTO licenses (key, kind, created_at, expires_at, max_seats, note) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(key, "paid", now(), null, 1, tag).run();
  return json({ ok: true, key });
}

/**
 * Ownership check against Roblox. Returns "yes" / "no" / "private" (the buyer's
 * inventory is not public, so Roblox refuses to answer — code 11).
 */
/** "yes" / "no" / "private" (inventory not public) / "busy" (Roblox unreachable). */
async function ownsAsset(userId, assetId) {
  const r = await robloxFetch(
    `inventory.{host}/v1/users/${userId}/items/Asset/${assetId}/is-owned`,
    { headers: { accept: "application/json" } });
  if (!r) return "busy";
  if (r.status === 403) return "private";      // code 11 = inventory not public
  const txt = (await r.text()).trim();
  if (txt === "true") return "yes";
  if (txt === "false") return "no";
  return "private";
}

/**
 * Website "I bought it on Roblox" unlock. The buyer types their username; we confirm
 * they OWN the Creator Store plugin or the Robux shirt, and if so grant access — no
 * code involved, because the purchase itself is the proof. Requires a public inventory.
 */
async function claim(env, body) {
  const username = clean(body.username, 32);
  if (!username) return json({ ok: false, error: "missing username" }, 400);

  const user = await resolveRobloxUser(username);
  if (user === "busy") return json({ ok: false, error: "busy",
    message: "Roblox is busy right now. Please try again in a moment." }, 503);
  if (!user) return json({ ok: false, error: "No Roblox account with that username." }, 404);

  const banned = await env.DB.prepare(
    "SELECT role FROM allowlist WHERE roblox_user = ? AND role = 'banned'").bind(user.id).first();
  if (banned) return json({ ok: false, error: "That account cannot be unlocked." }, 403);

  let owns = false, anyPrivate = false, anyBusy = false;
  for (const id of Object.values(OWNED_ASSETS)) {
    const r = await ownsAsset(user.id, id);
    if (r === "yes") { owns = true; break; }
    if (r === "private") anyPrivate = true;
    if (r === "busy") anyBusy = true;
  }

  if (!owns) {
    if (anyBusy) return json({ ok: false, error: "busy", message:
      "Roblox is busy right now. Please try again in a moment." }, 503);
    if (anyPrivate)
      return json({ ok: false, error: "private", message:
        "Your Roblox inventory is private, so we can't see the purchase. Set Inventory to " +
        "Everyone in Roblox privacy settings, then try again." });
    return json({ ok: false, error: "notfound", message:
      "We don't see that purchase on this account yet. If you just bought it, wait a minute and retry." });
  }

  await env.DB.prepare(
    `INSERT INTO allowlist (roblox_user, role, expires_at, added_at, note)
     VALUES (?, 'paid', NULL, ?, ?)
     ON CONFLICT(roblox_user) DO UPDATE SET role = 'paid', expires_at = NULL, note = excluded.note`
  ).bind(user.id, now(), "roblox purchase claim").run();

  return json({ ok: true, tier: "paid", username: user.name });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    // Preflight: the browser sends OPTIONS before any POST carrying content-type: application/json.
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    // PayPal IPN posts a form body (not JSON) that must be echoed back verbatim to
    // verify it, so handle it before the JSON parse below.
    if (url.pathname === "/v1/paypal/ipn" && req.method === "POST")
      return await paypalIPN(env, await req.text());

    // GET-able routes, so the site (and edge caches) can hit them directly.
    if (url.pathname === "/v1/stats") return await stats(env);
    if (url.pathname === "/v1/price") return await price(env, url);
    if (url.pathname === "/v1/order") return await order(env, url);
    if (url.pathname === "/v1/paypal/order") return await paypalOrder(env, url);

    if (req.method !== "POST") return json({ ok: false, error: "POST only" }, 405);
    let body = {};
    try { body = await req.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

    try {
      switch (url.pathname) {
        case "/v1/check":        return await check(env, body);
        case "/v1/redeem":       return await redeem(env, body);
        case "/v1/claim":        return await claim(env, body);
        case "/v1/status":       return await status(env, body);
        case "/v1/activate":     return await activate(env, body);
        case "/v1/trial":        return await trial(env, body);
        case "/v1/heartbeat":    return await heartbeat(env, body);
        case "/v1/admin/issue":  return await issue(env, req, body);
        case "/v1/admin/allow":  return await allow(env, req, body);
        case "/v1/admin/revoke": return await revoke(env, req, body);
        case "/v1/admin/list":   return await listUsers(env, req);
        default:                 return json({ ok: false, error: "not found" }, 404);
      }
    } catch (e) {
      // Never leak internals to the plugin; log for yourself with `wrangler tail`.
      console.error(e);
      return json({ ok: false, error: "server error" }, 500);
    }
  },
};
