'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.util = {
    MAIN_PIN_WIDTH: 65,
    MAIN_PIN_HEIGHT: 65,
    MAIN_PIN_ACTIVE_HEIGHT: 80,

    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    getMainPinCoordinates: function (pin, width, height) {
      var pinLeftCoordinate = Number(pin.style.left.slice(0, -2));
      var pinTopCoordinate = Number(pin.style.top.slice(0, -2));
      var pinCoordinates = (pinLeftCoordinate + Math.floor(width)) + ', ' + (pinTopCoordinate + Math.floor(height));

      return pinCoordinates;
    }
  };
})();
