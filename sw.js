const cacheName = 'v1';
//let dContinue = confirm('update available for the app please conform');
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
addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;     // if valid response is found in cache return it
          } else {
            return fetch(event.request)     //fetch from internet
              .then(function(res) {
                return caches.open(cacheName)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());    //save the response for future
                    return res;   // return the fetched data
                  })
              })
              .catch(function(err) {       // fallback mechanism
                return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                  .then(function(cache) {
                    return cache.match('/index.html');
                  });
              });
          }
        })
    );
  }); 