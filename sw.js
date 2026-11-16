/* Fergard (antiguo hub): este service worker se limpia solo. Cada app (Gym, FilmFer...) ahora es independiente. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.map((k) => caches.delete(k)))).then(() => self.registration.unregister())); });
