// Rootline service worker (scope: /tracker/).
//
// Deliberately conservative: pages and API calls always go to the network
// (they're per-user and private, so they're never cached); only Next's
// content-hashed static assets and icons are cached, which makes repeat
// launches fast. When the network is down, page loads fall back to an
// offline screen.

const VERSION = "rootline-v1";
const OFFLINE_URL = "/tracker/offline";
const STATIC_CACHE = `${VERSION}-static`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, "/tracker/icons/icon-192.png"]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Supabase, photos, checkout: untouched

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  const cacheable = url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/tracker/icons/");
  if (cacheable) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      })
    );
  }
});
