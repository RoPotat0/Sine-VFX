-- SineVFX licensing / trial database (Cloudflare D1, SQLite dialect)
-- Apply with:  wrangler d1 execute sinevfx --file=./schema.sql --remote

-- One row per license key. A key is the thing you sell/give out.
CREATE TABLE IF NOT EXISTS licenses (
  key           TEXT PRIMARY KEY,            -- e.g. SVFX-XXXX-XXXX-XXXX (opaque, never guessable)
  kind          TEXT NOT NULL,               -- 'paid' | 'trial' | 'lifetime' | 'revoked'
  roblox_user   INTEGER,                     -- bound on first activation; NULL until then
  created_at    INTEGER NOT NULL,            -- unix seconds
  expires_at    INTEGER,                     -- NULL = never
  max_seats     INTEGER NOT NULL DEFAULT 1,  -- how many distinct Studio installs may use it
  note          TEXT                         -- free-form: who it was issued to, order id, etc.
);

-- Every activation of a key on a machine. Seat limiting counts DISTINCT install_id per key.
CREATE TABLE IF NOT EXISTS activations (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  key          TEXT NOT NULL REFERENCES licenses(key) ON DELETE CASCADE,
  install_id   TEXT NOT NULL,                -- random uuid the plugin generates once and persists
  roblox_user  INTEGER,
  first_seen   INTEGER NOT NULL,
  last_seen    INTEGER NOT NULL,
  version      TEXT,                         -- plugin version at last check-in
  UNIQUE(key, install_id)
);

-- Free trials are keyed by Roblox user id so one account cannot farm trials by reinstalling.
CREATE TABLE IF NOT EXISTS trials (
  roblox_user  INTEGER PRIMARY KEY,
  install_id   TEXT,
  started_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL
);

-- Direct grants by Roblox user id -- the replacement for the GitHub whitelist.json that TesterGate
-- used to fetch. A row here needs no key and no trial: the user simply has access, and it can be
-- withdrawn instantly (the old JSON file was CDN-cached and had to be cache-busted on every fetch).
-- 'banned' is stored here too, and is checked BEFORE keys and trials, so one row shuts off an
-- account regardless of what key it holds.
CREATE TABLE IF NOT EXISTS allowlist (
  roblox_user  INTEGER PRIMARY KEY,
  role         TEXT NOT NULL,               -- 'tester' | 'paid' | 'lifetime' | 'banned'
  expires_at   INTEGER,                     -- NULL = never
  added_at     INTEGER NOT NULL,
  last_seen    INTEGER,                     -- refreshed by /v1/check, so you can see who is active
  version      TEXT,                        -- plugin version at last check-in
  note         TEXT                         -- free-form: who they are, why they were added
);

CREATE INDEX IF NOT EXISTS idx_activations_key  ON activations(key);
CREATE INDEX IF NOT EXISTS idx_licenses_user    ON licenses(roblox_user);
CREATE INDEX IF NOT EXISTS idx_allowlist_role   ON allowlist(role);
