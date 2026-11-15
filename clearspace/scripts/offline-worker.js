// The production build inserts the version and exact shell, stylesheet, and audio paths.
const prefix = "clearspace-core:" + self.registration.scope + ":";
const cacheName = prefix + "BUILD_REVISION";
const indexUrl = new URL("index.html", self.registration.scope).href;
const assets = new Set(
  ["BUILD_FILES"].map((file) => new URL(file, self.registration.scope).href),
);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll([...assets])),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(prefix) && key !== cacheName)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  url.search = "";
  const entry =
    request.mode === "navigate" &&
    (url.href === self.registration.scope || url.href === indexUrl);
  const key = entry ? indexUrl : request.url;
  if (!assets.has(key)) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      const cached = await cache.match(key);
      return cached || fetch(request);
    })(),
  );
});
