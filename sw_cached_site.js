const cacheName = 'v2';

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
self.addEventListener('fetch', e => {
  console.log('serviceWorker: Fetching');
  e.respondWith(
    fetch(e.request)
    .then(res => {
      //make copy/clone of response
      const resClone = res.clone();
      //Open cache
      caches.open(cacheName).then(cache => {
        //Add response to cache
        cache.put(e.request, resClone);
      });
      return res; 
    }).catch(err => caches.match(e.request).then(res => res))
  );
});