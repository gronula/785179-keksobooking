'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  window.debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, arguments);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
