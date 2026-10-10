// Shared app behavior for every Derby.Fit page.
(function () {
  // 1. Offline support
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
  }
  // 2. Keep the screen awake while a page is open and visible
  var lock = null;
  function keepAwake() {
    if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
    navigator.wakeLock.request('screen').then(function (l) {
      lock = l;
      l.addEventListener('release', function () { lock = null; });
    }).catch(function () {});
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && !lock) keepAwake();
  });
  // iOS only grants the lock after a tap, so also request on first touch
  ['click', 'touchend'].forEach(function (ev) {
    document.addEventListener(ev, function () { if (!lock) keepAwake(); }, { passive: true });
  });
  keepAwake();
})();
