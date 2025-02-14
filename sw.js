const CACHE_NAME = "bashword-v4";
const ASSETS = [
  "/",
  "/index.html",
  "/result.html",
  "/levels.html",
  "/assets/styles/main.css",
  "/js/app.js",
  "/js/game.js",
  "/js/keyboard.js",
  "/js/storage.js",
  "/js/results.js",
  "/js/levels.js",
  "/js/header.js",
  "/data/dictionary.js",
  "/data/keyboard-layout.js",
  "/data/dictionary.txt",
  "/data/dictionary-1.txt",
  "/data/dictionary-2.txt",
  "/data/dictionary-3.txt",
  "/data/dictionary-4.txt",
  "/data/dictionary-5.txt"
];

self.addEventListener("install", event => {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
      caches.match(event.request)
          .then(response => response || fetch(event.request))
  );
});
