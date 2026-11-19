// JACK22 Studio : garde l'appli en mémoire pour qu'elle s'installe et s'ouvre aussi sans connexion.
// Réseau d'abord : en ligne, on reçoit toujours la dernière version (pas d'« ancienne version » coincée) ;
// hors ligne, on reprend la dernière copie gardée. Les fichiers d'autres sites (polices, radios) ne sont pas gardés.
const CACHE = 'jackworld-studio-studio-2026-11-19';
const DEPART = ['index.html', 'manifest.webmanifest', 'icon-192.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(DEPART)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('jackworld-studio-studio-') && key !== CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || req.headers.has('range')) return;
  event.respondWith(fetch(req).then(response => {
    if (response.ok && response.type === 'basic') {
      const copie = response.clone();
      caches.open(CACHE).then(cache => cache.put(req, copie));
    }
    return response;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === 'navigate' ? caches.match(DEPART[0]) : undefined))));
});

// Le Studio demande si ses fichiers sont prêts hors connexion.
self.addEventListener('message', event => {
  if (event.data?.type !== 'JACK22_CACHE_STATUS' || !event.ports?.[0]) return;
  caches.open(CACHE).then(cache => cache.match(DEPART[0])).then(r => {
    event.ports[0].postMessage({ type: 'JACK22_CACHE_READY', ready: !!r });
  }).catch(() => event.ports[0].postMessage({ type: 'JACK22_CACHE_READY', ready: false }));
});
