// public/sw.js
const CACHE_NAME = "wasm-ai-cache-v1";
const STATIC_ASSETS = ["/", "/manifest.json", "/globe.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip browser extension requests or non-GET requests
  if (event.request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Cache-first strategy: check Cache Storage first, then fallback to Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Verify valid response before caching
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type === "opaque"
          ) {
            return networkResponse;
          }

          // Cache all Next.js static assets, Transformers dependencies, and ONNX models
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Cleanly catch offline failures without crashing the SW
          console.warn("Offline fetch failed for:", event.request.url);
        });
    })
  );
});
