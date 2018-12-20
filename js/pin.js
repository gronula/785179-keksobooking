'use strict';

(function () {
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70
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
      var maxPinsNumber = adsNearbyArray.length > 5 ? 5 : adsNearbyArray.length;
      for (var i = 0; i < maxPinsNumber; i++) {
        if (adsNearbyArray[i].hasOwnProperty('offer')) {
          var pin = pinItem.cloneNode(true);

          pin.style.left = adsNearbyArray[i].location.x - PinSize.WIDTH / 2 + 'px';
          pin.style.top = adsNearbyArray[i].location.y - PinSize.HEIGHT + 'px';

          var pinImage = pin.querySelector('img');
          pinImage.src = adsNearbyArray[i].author.avatar;
          pinImage.alt = adsNearbyArray[i].offer.title;

          pinsFragment.appendChild(pin);
        }
      }
      pins.appendChild(pinsFragment);

      var allRenderedPins = pins.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (i = 0; i < allRenderedPins.length; i++) {
        window.map.pinClickHandler(allRenderedPins[i], adsNearbyArray[i]);
      }
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

              for (var j = 0; j < checkedInputs.length; j++) {
                count = it.offer.features.indexOf(checkedInputs[j].value) > -1 ? count + 1 : 0;
              }

              return count === checkedInputs.length;
            });
            break;
        }
      }
      window.pin.render(filteredArray);
    })};
})();
