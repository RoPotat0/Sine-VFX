/* Sine VFX service worker.
   GitHub Pages sends every file with a fixed 10 minute cache, so after that the
   browser re-asks the server for each one. Files under /assets/ have a content
   hash in their name and never change, so this worker serves them straight from
   its own cache, forever, with no network round trip. Everything else (HTML,
   config.js, videos, the /docs site) is left to the browser as normal. */
const CACHE = "svfx-assets-v1";
const MAX_ENTRIES = 80;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith("/assets/")) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok) {
      await cache.put(req, res.clone());
      // Old builds leave old hashed files behind; drop the oldest past the cap.
      const keys = await cache.keys();
      for (let i = 0; i < keys.length - MAX_ENTRIES; i++) await cache.delete(keys[i]);
    }
    return res;
  })());
});
