"use script";

// A very basic service worker to allow loading of the page offline
// It doesn't try to do any fancy caching, etc. Just the bare minimum to get a working offline app.

var CACHE_NAME = "easierprompter-v1.1";

// When installed: Cache offlines copies of the files
self.addEventListener("install", function(event) {
  // Let any new service worker coming in install itself right away
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        "/core.css", // core.css provides some basic styling
        "/easierprompter/", // the index
        "/easierprompter/dist/bundle.js", // javascript
      ]);
    })
  );
});

// When installed: Go to the network first
// If it found it, use it and cache it so it can be used offline
// If it failed, return from the cache
// This isn't the most optimal thing, but it's the easiest to develop with
self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request)
    .then(function(response) {
      var clone = response.clone();
      if (response.status === 200) {
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
