// Define a version for your cache
const CACHE_NAME = 'progresion-de-carga-v3';

// List all the files and resources that need to be cached
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/index.tsx',
    '/App.tsx',
    '/constants.ts',
    '/types.ts',
    '/components/WorkoutDay.tsx',
    '/components/CardioTable.tsx',
    '/components/StrengthTable.tsx',
    '/components/Summary.tsx',
    '/components/Notification.tsx',
    '/components/CardioModal.tsx',
    '/components/Exercises.tsx',
    '/components/MediaLightbox.tsx',
    '/components/MyExercises.tsx',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://ga.jspm.io/npm:es-module-shims@1.10.0/dist/es-module-shims.js',
    'https://esm.sh/react@18.2.0',
    'https://esm.sh/react-dom@18.2.0/client',
    'https://esm.sh/react@18.2.0/jsx-runtime'
];

// Install event: triggered when the service worker is first installed.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                // Add all specified URLs to the cache
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Fetch event: triggered for every network request made by the page.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If the request is found in the cache, return the cached response
                if (response) {
                    return response;
                }
                // Otherwise, fetch the request from the network
                return fetch(event.request);
            })
    );
});

// Activate event: triggered when the service worker is activated.
// This is a good place to clean up old caches.
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // If the cache is not in our whitelist, delete it
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});