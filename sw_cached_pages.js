const cacheName = 'v1';

const cacheAssets = [
  'about.html',
  'index.html',
  '/css/style.css',
  '/js/main.js'
];

// call install event
self.addEventListener('install', e => {
  console.log('serviceWorker installed');

  e.waitUntil(
    caches
    .open(cacheName)
    .then((cache) => {
      console.log('service worker: caching files');
      cache.addAll(cacheAssets);
    })
    .then(() => self.skipWaiting())
  )
});

//Call activate event 
self.addEventListener('activate', e => {
  console.log('serviceWorker activated');
  //remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName){
            console.log('SW: Clearing');
            return caches.delete(cache);
          }
        })
        );
    })
  );
});

//call fetch event 
self.addEventListener('fetch', e => {
  console.log('serviceWorker: Fetching');
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});