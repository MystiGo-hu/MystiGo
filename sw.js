const CACHE_NAME = 'mystigo-v1-static';
const DYNAMIC_CACHE = 'mystigo-v1-dynamic';

// Ezeket a fájlokat mindenképp lementjük telepítéskor
const ASSETS_TO_CACHE = [
  '/',
  '/index2.html',
  '/manifest.json',
  '/logo/MystiGo_logo.png',
  '/logo/icon-192_v3.png',
  // Külső könyvtárak (CDN), amik kellenek offline is:
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap'
];

// Telepítés: Cache-eljük a statikus fájlokat
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Statikus fájlok cache-elése');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Aktiválás: Régi cache törlése, ha verziót váltasz
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

// Fetch esemény: Először a Cache-t nézzük, ha nincs, akkor Network
self.addEventListener('fetch', (event) => {
  // Firebase kéréseket hagyjuk a JS-re, ne cache-elje a SW agresszívan,
  // mert a JS kezeli a LocalStorage-ot.
  if (event.request.url.includes('firebase')) {
      return; 
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Ha megvan cache-ben, visszaadjuk
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Ha nincs, letöltjük a netről
      return fetch(event.request).then((networkResponse) => {
        // Opcionális: Dinamikus cache-elés a meglátogatott képekre stb.
        return caches.open(DYNAMIC_CACHE).then((cache) => {
            // Csak http(s) kéréseket cache-elünk
            if(event.request.url.startsWith('http')) {
                cache.put(event.request.url, networkResponse.clone());
            }
            return networkResponse;
        });
      }).catch(() => {
          // Ha nincs net és nincs cache-ben sem (pl. offline vagyunk)
          // Itt adhatnánk vissza egy offline.html-t, ha lenne.
      });
    })
  );
});