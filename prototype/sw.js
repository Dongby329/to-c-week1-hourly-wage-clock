/**
 * Service Worker for 时薪桌面钟
 * Caches core assets for offline access.
 */
var CACHE_NAME = 'wageclock-v1';
var ASSETS = [
  './',
  'login.html',
  'clock.html',
  'calendar.html',
  'setup.html',
  'nav.js',
  'i18n.js',
  'currency.js',
  'target-cursor.js',
  'target-cursor.css',
  'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS).catch(function(err){
        // Silently continue if some assets fail to cache
        console.log('SW: cache addAll partial failure', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  // Only handle GET requests for same-origin or CDN
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        if(!response || response.status !== 200 || response.type !== 'basic'){
          return response;
        }
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(e.request, clone); });
        return response;
      }).catch(function(){
        // Offline fallback — return cached page
        return caches.match(e.request);
      });
    })
  );
});
