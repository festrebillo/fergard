/* Service worker de Fergard: guarda la cáscara de la página y de Gym para abrir sin conexión.
   Los datos NUNCA pasan por el caché (las llamadas al script de Google y a accounts.google.com se dejan pasar sin tocarlas).
   Las fotos de ejercicios se guardan al verlas (primero caché) en un caché propio que no se borra al actualizar. */
const CACHE = "fergard-v0.2.0";
const IMG = "gym-img-v1";
const FILES = ["./", "index.html", "config.js", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png",
  "gym/", "gym/index.html", "gym/gym.css", "gym/gym.js", "gym/core.js", "gym/data/exercises.json"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== IMG).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (/\/gym\/(img|t)\//.test(u.pathname)) {          // fotos: primero caché
    e.respondWith(caches.open(IMG).then((c) => c.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }))));
    return;
  }
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
