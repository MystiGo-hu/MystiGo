// sw.js - Alapvető Service Worker
const CACHE_NAME = 'mystigo-cache-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Itt lehetne kezelni az offline módot, de a telepítéshez ennyi is elég
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});