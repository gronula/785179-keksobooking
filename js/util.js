'use strict';

(function () {
  window.util = {
    MIN_X: 0,
    MAX_X: 1200,
    MIN_Y: 130,
    MAX_Y: 630,
    MAIN_PIN_WIDTH: 65,
    MAIN_PIN_HEIGHT: 65,
    MAIN_PIN_ACTIVE_HEIGHT: 80,
    PIN_WIDTH: 50,
    PIN_HEIGHT: 70,
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    isEscEvent: function (evt, action) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === window.util.ENTER_KEYCODE) {
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
