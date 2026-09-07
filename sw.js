// Skisim Service Worker (ADR-0031) — installierbare PWA + Offline.
// CACHE ist an die App-Version gekoppelt; tools/release.js zieht die Version bei
// jedem Release mit, damit Clients nach einem Deploy zuverlässig aktualisieren.
const CACHE = 'skisim-2026.09.0001';

// App-Shell (same-origin). Schriften stecken inline in index.html -> kein Font-Caching nötig.
const SHELL = [
  './',
  'index.html',
  'manifest.json',
  'icon.svg',
  'icon-192.png',
  'icon-512.png',
  'favicon-32.png',
  'apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(SHELL);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // Nur eigene GET-Anfragen behandeln. Lizenz-API (cross-origin) und WebSocket bleiben unangetastet.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  const isNav = req.mode === 'navigate' || (req.destination === 'document');
  if (isNav) {
    // HTML: network-first -> frische Version online, Offline-Fallback aus dem Cache.
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        const c = await caches.open(CACHE);
        c.put('index.html', res.clone());
        return res;
      } catch (err) {
        const c = await caches.open(CACHE);
        return (await c.match('index.html')) || (await c.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Übrige eigene Assets (Icons, Manifest): cache-first mit Netz-Fallback.
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.ok && res.type === 'basic') {
        const c = await caches.open(CACHE);
        c.put(req, res.clone());
      }
      return res;
    } catch (err) {
      return Response.error();
    }
  })());
});
