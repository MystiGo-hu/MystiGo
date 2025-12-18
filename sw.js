// sw.js - Dinamikus Cache stratégia
const CACHE_NAME = 'mystigo-cache-v1.2';

// Csak az alap vázat mentjük el telepítéskor
const STATIC_ASSETS = [
    'index2.html',
    'manifest.json',
    'logo/MystiGo_logo.png',
    'logo/icon-192_v3.png', // Add hozzá a manifest ikonokat is!
    'logo/icon-512_v4.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // 1. Ha megvan a cache-ben, azonnal adjuk vissza (gyorsaság)
            if (cachedResponse) {
                return cachedResponse;
            }

            // 2. Ha nincs meg, kérjük le a hálózatról
            return fetch(event.request).then((response) => {
                // Ellenőrizzük, hogy érvényes-e a válasz
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // 3. Fontos: Klónozzuk a választ és tegyük be a cache-be a jövőre nézve
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    // Itt mentődnek el a JSON-ök és egyéb dinamikus adatok
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Itt lehetne egy offline hibaoldalt visszaadni, ha semmi nincs
            });
        })
    );
});

