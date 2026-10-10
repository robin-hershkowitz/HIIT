// Offline support: caches every page so timers open with no signal.
const CACHE = 'derbyfit-v1';
const CORE = ["./",   "./all-cardio-medium-impact-hiit.html",  "./cardio-core-hiit.html",  "./dance-aerobics-5x5.html",  "./dance-lane-hiit.html",  "./dance-skates-timers.html",  "./derby-fit-hiit-timer.html",  "./grapevine-agility-hiit.html",  "./index.html",  "./level1-strength-balance.html",  "./noodle-strength-onskates.html",  "./plow-jump-hiit.html",  "./pre-practice-warmup.html",  "./pure-cardio-hiit.html",  "./skating-lane-2-with-hops.html",  "./skating-lane-drills.html",  "./stretch-cardio-hip-hiit.html",  "./tap-hiit-timer.html",  "./upper-body-weights-hiit.html",  "./weekly-schedule.html", "./app.js", "./manifest.webmanifest", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first (so updates show up), cache as fallback when offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
