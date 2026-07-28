// Beauty CRM Service Worker
// Caches the app shell for offline use

const CACHE_NAME = 'beauty-crm-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/logo.jpg',
  '/favicon.svg',
];

// Install: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Claim all clients so the SW controls pages immediately
  self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener('fetch', (event) => {
  // Only handle navigation and same-origin requests
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (e.g., Firebase, analytics)
  if (url.origin !== self.location.origin) return;

  // Skip API / Firebase calls
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/__/')
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline: serve from cache
        return caches.match(request).then((cached) => {
          return cached || caches.match('/index.html');
        });
      })
  );
});