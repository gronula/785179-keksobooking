'use strict';

(function () {
  var Keycode = {
    ESC: 27,
    ENTER: 13
  };

  window.util = {
    MainPinSize: {
      WIDTH: 65,
      HEIGHT: 65,
      ACTIVE_HEIGHT: 80,
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === Keycode.ESC) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === Keycode.ENTER) {
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
