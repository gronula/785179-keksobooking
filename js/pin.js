'use strict';

(function () {
  var map = document.querySelector('.map');
  var pins = map.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin');
  var pinItem = pinTemplate.content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();

  window.pin = {
    renderPinElement: function (adsNearbyArray) {
      for (var i = 0; i < adsNearbyArray.length; i++) {
        var pinElement = pinItem.cloneNode(true);

        pinElement.style.left = adsNearbyArray[i].location.x - window.util.PIN_WIDTH / 2 + 'px';
        pinElement.style.top = adsNearbyArray[i].location.y - window.util.PIN_HEIGHT + 'px';

        var pinElementImage = pinElement.querySelector('img');
        pinElementImage.src = adsNearbyArray[i].author.avatar;
        pinElementImage.alt = adsNearbyArray[i].offer.title;

        pinsFragment.appendChild(pinElement);
      }

      pins.appendChild(pinsFragment);
    }
  };
})();
