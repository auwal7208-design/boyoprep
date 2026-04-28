// BoyoPrep Service Worker — v1.0
const CACHE_NAME = 'boyoprep-v1';
const ASSETS = [
  '/boyoprep/',
  '/boyoprep/index.html',
  '/boyoprep/english.html',
  '/boyoprep/mathematics.html',
  '/boyoprep/biology.html',
  '/boyoprep/physics.html',
  '/boyoprep/chemistry.html',
  '/boyoprep/economics.html',
  '/boyoprep/government.html',
  '/boyoprep/geography.html',
  '/boyoprep/literature.html',
  '/boyoprep/crk.html',
  '/boyoprep/agriculture.html',
  '/boyoprep/commerce.html',
  '/boyoprep/about.html',
  '/boyoprep/contact.html',
  '/boyoprep/privacy.html',
  '/boyoprep/manifest.json',
];

// Install — cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('BoyoPrep: Caching all pages...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache new requests
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // If offline and not cached, show offline page
        return caches.match('/boyoprep/index.html');
      });
    })
  );
});
