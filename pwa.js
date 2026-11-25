/* HisabTrack — install prompt */
(function () {
  "use strict";
  var deferred = null;

  function button() { return document.getElementById("pwa-install"); }

  function hide() {
    var b = button();
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function show() {
    if (!deferred || button()) return;
    var actions = document.querySelector(".topbar-actions");
    if (!actions) return;
    var b = document.createElement("button");
    b.id = "pwa-install";
    b.type = "button";
    b.className = "btn btn-outline btn-sm";
    b.setAttribute("aria-label", "অ্যাপ ইনস্টল করুন");
    b.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/></svg> অ্যাপ ইনস্টল';
    b.addEventListener("click", function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; hide(); }).catch(function () { deferred = null; hide(); });
    });
    actions.insertBefore(b, actions.firstChild);
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    show();
  });
  window.addEventListener("appinstalled", function () { deferred = null; hide(); });

  if (document.body) {
    new MutationObserver(function () { if (deferred) show(); }).observe(document.body, { childList: true, subtree: true });
    show();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      new MutationObserver(function () { if (deferred) show(); }).observe(document.body, { childList: true, subtree: true });
      show();
    });
  }
})();
