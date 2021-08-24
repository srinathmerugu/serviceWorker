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

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         // Cache hit - return response
//         if (response) {
//           return response;
//         }

//         return fetch(event.request).then(
//           function(response) {
//             // Check if we received a valid response
//             if(!response || response.status !== 200 || response.type !== 'basic') {
//               return response;
//             }

//             // IMPORTANT: Clone the response. A response is a stream
//             // and because we want the browser to consume the response
//             // as well as the cache consuming the response, we need
//             // to clone it so we have two streams.
//             var responseToCache = response.clone();

//             caches.open(CACHE_NAME)
//               .then(function(cache) {
//                 cache.put(event.request, responseToCache);
//               });

//             return response;
//           }
//         );
//       })
//     );
// });
