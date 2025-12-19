const CACHE_NAME = 'mystigo-cache-v1.7';

const STATIC_ASSETS = [
    './index2.html',
    './manifest.json',
    './logo/icon-512_v4.png', // Vessző pótolva! (Splashhez kell)
    './logo/icon-192_v3.png', // Ez is kell (Ikonhoz)
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                          .map((name) => caches.delete(name))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});