const CACHE_NAME = 'bm-tyres-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './shop.html',
  './about.html',
  './contact.html',
  './styles.css',
  './script.js',
  './products.json',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(err => console.warn('Cache addAll failed', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(resp => {
        // optionally cache new requests
        return resp;
      });
    }).catch(() => {
      // fallback if needed (could return offline page)
      return caches.match('./index.html');
    })
  );
});
