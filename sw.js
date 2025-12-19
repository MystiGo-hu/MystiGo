const CACHE_NAME = 'mystigo-v3-static'; // Verziót növeltünk, hogy frissüljön!
const DYNAMIC_CACHE = 'mystigo-v3-dynamic';

const ASSETS_TO_CACHE = [
  '/',
  '/index2.html',
  '/manifest.json',
  '/logo/MystiGo_logo.png',
  '/logo/icon-192_v3.png',
  // CSS és Libek
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap',
  
  // --- KRITIKUS RÉSZ: A Firebase motor mentése ---
  // Ha ezek nincsenek itt, offline módban el sem indul a program!
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Azonnal aktiváljuk az új SW-t
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Statikus fájlok + Firebase SDK cache-elése');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 1. KIVÉTEL: A Firebase ADATBÁZIS kéréseket NE cache-eljük!
  if (url.includes('firebasedatabase.app') || url.includes('.json')) {
      return; 
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Ha megvan cache-ben, visszaadjuk
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Ha nincs, megpróbáljuk letölteni a netről
      return fetch(event.request)
        .then((networkResponse) => {
            // Ha sikerült letölteni, elmentjük a dinamikus cache-be
            return caches.open(DYNAMIC_CACHE).then((cache) => {
                // Csak érvényes http(s) kéréseket mentünk
                if(url.startsWith('http')) {
                    cache.put(event.request.url, networkResponse.clone());
                }
                return networkResponse;
            });
        })
        .catch((error) => {
            // --- ITT A JAVÍTÁS: HIBAKEZELÉS ---
            // Ez fut le, ha nincs net (Offline) és a fájl nincs a cache-ben sem.
            console.warn('[Service Worker] Hálózati hiba (Offline?):', url);
            
            // Itt visszaadhatnánk egy "offline.html"-t vagy egy helyettesítő képet, 
            // de most egyszerűen hagyjuk, hogy a böngésző kezelje a hiányt,
            // csak ne omoljon össze a kód (Uncaught Error).
        });
    })
  );
});