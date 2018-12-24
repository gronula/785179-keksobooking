'use strict';

(function () {
  var MAX_PINS_NUMBER = 5;
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var Price = {
    MIN: 10000,
    MAX: 50000
  };

  var map = document.querySelector('.map');
  var pins = map.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin');
  var pinItem = pinTemplate.content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();
  var mapFilters = map.querySelector('.map__filters');
  var houseType = mapFilters.querySelector('#housing-type');
  var housePrice = mapFilters.querySelector('#housing-price');
  var houseRooms = mapFilters.querySelector('#housing-rooms');
  var houseGuests = mapFilters.querySelector('#housing-guests');
  var houseFeatures = mapFilters.querySelector('#housing-features');

  window.pin = {
    renderHandler: function (adsNearbyArray) {
      var pinsNumber = adsNearbyArray.length > MAX_PINS_NUMBER ? MAX_PINS_NUMBER : adsNearbyArray.length;
      for (var i = 0; i < pinsNumber; i++) {
        var pin = pinItem.cloneNode(true);

        pin.style.left = adsNearbyArray[i].location.x - PinSize.WIDTH / 2 + 'px';
        pin.style.top = adsNearbyArray[i].location.y - PinSize.HEIGHT + 'px';

        var pinImage = pin.querySelector('img');
        pinImage.src = adsNearbyArray[i].author.avatar;
        pinImage.alt = adsNearbyArray[i].offer.title;

        pinsFragment.appendChild(pin);
      }
      pins.appendChild(pinsFragment);

      var allRenderedPins = pins.querySelectorAll('.map__pin:not(.map__pin--main)');
      allRenderedPins.forEach(function (it, j) {
        window.map.pinClickHandler(it, adsNearbyArray[j]);
      });
      mapFilters.addEventListener('change', window.pin.filterHandler);
    },
    filterHandler: window.debounce(function () {
      window.map.popupRemoveHandler();
      window.map.pinsRemoveHandler();

      for (var i = 0; i < mapFilters.children.length; i++) {
        switch (mapFilters.children[i]) {
          case houseType:
            var filteredArray = window.map.adsNearbyArray.filter(function (it) {
              return houseType.value === 'any' ? it : it.offer.type === houseType.value;
            });
            break;

          case housePrice:
            filteredArray = filteredArray.filter(function (it) {
              switch (housePrice.value) {
                case 'middle':
                  return it.offer.price >= Price.MIN && it.offer.price < Price.MAX;
                case 'low':
                  return it.offer.price < Price.MIN;
                case 'high':
                  return it.offer.price >= Price.MAX;
                default:
                  return it;
              }
            });
            break;

          case houseRooms:
            filteredArray = filteredArray.filter(function (it) {
              return houseRooms.value === 'any' ? it : it.offer.rooms === Number(houseRooms.value);
            });
            break;

          case houseGuests:
            filteredArray = filteredArray.filter(function (it) {
              return houseGuests.value === 'any' ? it : it.offer.guests === Number(houseGuests.value);
            });
            break;

          case houseFeatures:
            var checkedInputs = houseFeatures.querySelectorAll('input:checked');


            filteredArray = filteredArray.filter(function (it) {
              var count = 0;

              checkedInputs.forEach(function (el) {
                count = it.offer.features.indexOf(el.value) > -1 ? count + 1 : 0;
              });

              return count === checkedInputs.length;
            });
            break;
        }
      }
      window.pin.renderHandler(filteredArray);
    })};
})();
