// sw.js - MystiGo Optimalizált Service Worker
const CACHE_NAME = 'mystigo-cache-v1.1';

// Azok a fájlok, amiket offline is el akarunk érni (az app váza)
const ASSETS_TO_CACHE = [
    'index2.html',
    'logo/MystiGo_logo.png',
    'logo/MystiGo_logo_cat.png',
    'manifest.json',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Telepítéskor elmentjük a fontos fájlokat
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Fájlok gyorsítótárazása...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Aktiváláskor töröljük a régi verziókat, ha vannak
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Régi cache törlése:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Hálózati kérések kezelése: először a netről próbálja, ha nincs, a cache-ből
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});