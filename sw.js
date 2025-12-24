const CACHE_NAME = 'mystigo-v7-static'; 
const DYNAMIC_CACHE = 'mystigo-v7-dynamic';

const ASSETS_TO_CACHE = [
  './',
  './index2.html',
  './index2.1.html',
  './manifest.json',
  './logo/MystiGo_logo.png',
  './logo/icon-192_v3.png'
];

// Telepítés - Statikus fájlok cache-elése
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Elő-cache-elés kész');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktiválás - Régi cache törlése
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Régi cache törlése:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch eseménykezelő - A legfontosabb rész a bejelentkezés szempontjából
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // --- KRITIKUS JAVÍTÁS ---
  // Ha a kérés NEM a mi oldalunkra irányul (hanem Google, Firebase, Tailwind stb.),
  // akkor a Service Worker ne avatkozzon be. Hagyja, hogy a böngésző natívan kezelje.
  if (!url.startsWith(self.location.origin)) {
    return; // Kilépünk, nem csinálunk semmit
  }

  // Firebase adatbázis kéréseket (JSON) se cache-eljünk
  if (url.includes('firebasedatabase.app') || url.includes('.json')) {
    return;
  }

  // Csak a saját domaineden belüli fájlokra (index.html, képek, saját JS) fut le a cache logika
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request)
        .then((networkResponse) => {
            // Csak sikeres GET kéréseket mentünk a dinamikus cache-be
            if (event.request.method === 'GET' && networkResponse.status === 200) {
                return caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(event.request.url, networkResponse.clone());
                    return networkResponse;
                });
            }
            return networkResponse;
        })
        .catch((error) => {
            console.warn('[Service Worker] Offline állapot, a fájl nincs meg:', url);
            // Itt adhatnál vissza egy offline.html-t is
        });
    })
  );

});



