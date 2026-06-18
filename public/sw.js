const CACHE_NAME = "vindhyavasini-sansthan-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline app shell");
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// Activate Event (Cleanup old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", cache);
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch Event (Stale-While-Revalidate for local assets, Network-only/first for APIs)
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Only handle GET requests and local origins
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) {
    return;
  }

  // Handle SPA navigation requests - Network First (always load latest online, fallback to cache offline)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put("/index.html", responseClone);
            });
            return networkResponse;
          }
          // If status is not 200 (e.g. server error), try fallback to cached index.html
          return caches.match("/index.html").then((cachedResponse) => {
            return cachedResponse || networkResponse;
          });
        })
        .catch(() => {
          // If network request fails (e.g. offline), fallback to cached index.html
          return caches.match("/index.html");
        }),
    );
    return;
  }

  // Stale-While-Revalidate Strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background to update cache for next load
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Ignore background fetch failures (e.g. offline)
          });
        return cachedResponse;
      }

      // Network Fallback
      return fetch(event.request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    }),
  );
});

// Push Event Listener
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const { title, body, icon, url } = payload;

    const options = {
      body: body || "New update from Namami Vindhyavasini Sansthan",
      icon: icon || "/favicon.png",
      badge: "/favicon.png",
      data: { url: url || "/" },
      vibrate: [100, 50, 100],
    };

    event.waitUntil(self.registration.showNotification(title || "Jai Maa Vindhyavasini", options));
  } catch (err) {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification("Jai Maa Vindhyavasini", {
        body: text,
        icon: "/favicon.png",
        data: { url: "/" },
      }),
    );
  }
});

// Notification Click Listener
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl = (event.notification.data && event.notification.data.url) || "/";
  const targetUrl = new URL(rawUrl, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus().then((focused) => {
            if ("navigate" in focused && typeof focused.navigate === "function") {
              return focused.navigate(targetUrl);
            }
          });
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    }),
  );
});
