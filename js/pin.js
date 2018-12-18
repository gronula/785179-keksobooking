'use strict';

(function () {
  var map = document.querySelector('.map');
  var pins = map.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin');
  var pinItem = pinTemplate.content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersFormElements = mapFilters.children;
  var houseType = mapFilters.querySelector('#housing-type');
  var housePrice = mapFilters.querySelector('#housing-price');
  var houseRooms = mapFilters.querySelector('#housing-rooms');
  var houseGuests = mapFilters.querySelector('#housing-guests');
  var houseFeatures = mapFilters.querySelector('#housing-features');

  window.pin = {
    renderPinElement: function (adsNearbyArray) {
      var maxPinsNumber = adsNearbyArray.length > 5 ? 5 : adsNearbyArray.length;
      for (var i = 0; i < maxPinsNumber; i++) {
        if (adsNearbyArray[i].hasOwnProperty('offer')) {
          var pinElement = pinItem.cloneNode(true);

          pinElement.style.left = adsNearbyArray[i].location.x - window.util.PIN_WIDTH / 2 + 'px';
          pinElement.style.top = adsNearbyArray[i].location.y - window.util.PIN_HEIGHT + 'px';

          var pinElementImage = pinElement.querySelector('img');
          pinElementImage.src = adsNearbyArray[i].author.avatar;
          pinElementImage.alt = adsNearbyArray[i].offer.title;

          pinsFragment.appendChild(pinElement);
        }
      }
      pins.appendChild(pinsFragment);

      var allRenderedPins = pins.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (i = 0; i < allRenderedPins.length; i++) {
        window.map.pinClickHandler(allRenderedPins[i], adsNearbyArray[i]);
      }
      mapFilters.addEventListener('change', window.pin.filterPins);
    },
    filterPins: window.debounce(function () {
      window.map.removePopup();
      window.map.removePins();

      for (var i = 0; i < mapFiltersFormElements.length; i++) {
        switch (mapFiltersFormElements[i]) {
          case houseType:
            var filteredArray = window.map.abc.filter(function (it) {
              if (houseType.value === 'any') {
                return it;
              }

              return it.offer.type === houseType.value;
            });
            break;

          case housePrice:
            filteredArray = filteredArray.filter(function (it) {
              switch (housePrice.value) {
                case 'middle':
                  return it.offer.price >= 10000 && it.offer.price < 50000;
                case 'low':
                  return it.offer.price < 10000;
                case 'high':
                  return it.offer.price >= 50000;
                default:
                  return it;
              }
            });
            break;

          case houseRooms:
            filteredArray = filteredArray.filter(function (it) {
              if (houseRooms.value === 'any') {
                return it;
              }

              return it.offer.rooms === Number(houseRooms.value);
            });
            break;

          case houseGuests:
            filteredArray = filteredArray.filter(function (it) {
              if (houseGuests.value === 'any') {
                return it;
              }

              return it.offer.guests === Number(houseGuests.value);
            });
            break;

          case houseFeatures:
            var checkedInputs = houseFeatures.querySelectorAll('input:checked');

            filteredArray = filteredArray.filter(function (it) {
              var count = 0;

              for (var j = 0; j < checkedInputs.length; j++) {
                if (it.offer.features.indexOf(checkedInputs[j].value) > -1) {
                  count++;
                }
              }

              return count === checkedInputs.length;
            });
            break;
        }
      }
      window.pin.renderPinElement(filteredArray);
    })};
})();
