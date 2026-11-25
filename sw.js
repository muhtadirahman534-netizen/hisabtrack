/* HisabTrack — offline service worker */
var CACHE = "hisabtrack-v5";
var ASSETS = [
  "./", "./index.html", "./styles.css", "./app.js", "./i18n.js", "./pwa.js",
  "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png"
];
var BASE = new URL("./", self.location.href);
function abs(p) { return new URL(p, BASE).href; }

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (p) {
        return c.add(abs(p)).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var u;
  try { u = new URL(req.url); } catch (err) { return; }
  if (u.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        if (!res.ok) throw new Error("offline");
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(abs("./index.html"), copy); });
        return res;
      }).catch(function () {
        return caches.match(abs("./index.html")).then(function (r) {
          return r || caches.match(abs("./"));
        });
      })
    );
    return;
  }

  /* Static files: fresh from network when online, cached copy when offline. */
  e.respondWith(
    fetch(req).then(function (res) {
      if (res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () { return caches.match(req); })
  );
});
