const cacheName = 'v4';

// call install event
self.addEventListener('install', e => {
  console.log('serviceWorker installed');
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
// self.addEventListener('fetch', e => {
//   console.log('serviceWorker: Fetching');
//   e.respondWith(
//     fetch(e.request)
//     .then(res => {
//       //make copy/clone of response
//       const resClone = res.clone();
//       //Open cache
//       caches.open(cacheName).then(cache => {
//         //Add response to cache
//         cache.put(e.request, resClone);
//       });
//       return res; 
//     })
//   );
// });


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});