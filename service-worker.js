const CACHE_NAME = 'calculator-v2'; 

const urlsToCache = [
  '/',  
  '/index.html',            
  '/style.css',             
  '/script.js',             
  '/manifest.json', 
  '/rates.json',          
  '/img/favicon.ico',       
  '/img/bg-main.png',
  '/img/faanzlogo-transparent.png',
  '/img/android-icon.png'
];

// Install event: cache all files
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate the new service worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  clients.claim(); // Take control of all clients right away
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
