/* Service worker de RoboKids: permite instalar la app y abrirla sin conexión.
   Estrategia: red primero (siempre ves la versión nueva) y, si no hay internet, usa la copia guardada.
   Solo toca archivos de este mismo sitio; Firebase/Firestore y CDNs pasan directo. */
const VERSION = "robokids-v1";
const BASICOS = ["./", "./index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if(req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if(res && res.ok){ const copia = res.clone(); caches.open(VERSION).then(c => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
