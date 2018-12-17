'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 1000;
  var lastTimeout = null;

  window.debounce = function (cb) {
    return function (array) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.bind(null, array);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
