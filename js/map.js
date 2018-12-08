'use strict';

(function () {
  var map = document.querySelector('.map');
  var pins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersFormElements = mapFilters.children;
  var adForm = document.querySelector('.ad-form');
  var adFormElements = adForm.children;
  var adFormAddress = adForm.querySelector('#address');
  var adFormTitle = adForm.querySelector('#title');
  var adFormHouseType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormRoomNumber = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormReset = adForm.querySelector('.ad-form__reset');

  var mapOverlay = map.querySelector('.map__overlay');

  var removePopup = function () {
    var popup = map.querySelector('.popup');
    var currentPin = map.querySelector('.map__pin--active');
    currentPin.classList.remove('map__pin--active');
    map.removeChild(popup);
    mapOverlay.removeEventListener('click', removePopup);
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, removePopup);
  };

  var pinClickHandler = function (allPins, adsNearbyArray) {
    allPins.addEventListener('click', function () {
      mapOverlay.addEventListener('click', removePopup);
      var popup = map.querySelector('.popup');
      if (popup) {
        var titleAds = adsNearbyArray.offer.title;
        if (popup.querySelector('.popup__title').textContent === titleAds) {
          return;
        }
        removePopup();
        mapOverlay.addEventListener('click', removePopup);
      }

      window.card.renderCardElement(adsNearbyArray);
      allPins.classList.add('map__pin--active');
      popup = map.querySelector('.popup');
      var popupClose = popup.querySelector('.popup__close');
      popupClose.addEventListener('click', removePopup);
      document.addEventListener('keydown', onPopupEscPress);
    });
  };

  var successHandler = function (pinsArray) {
    window.pin.renderPinElement(pinsArray);

    var allRenderedPins = pins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < allRenderedPins.length; i++) {
      pinClickHandler(allRenderedPins[i], pinsArray[i]);
    }

    var clearMap = function () {
      if (map.querySelector('.popup')) {
        removePopup();
      }
      for (i = 0; i < allRenderedPins.length; i++) {
        pins.removeChild(allRenderedPins[i]);
      }
      mainPin.style.left = '570px';
      mainPin.style.top = '375px';
      adFormReset.removeEventListener('click', clearMap);
    };
    adFormReset.addEventListener('click', clearMap);
  };

  var activatePage = function () {
    window.backend.get(successHandler);

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    window.form.activateFormElements(mapFiltersFormElements, false);
    window.form.activateFormElements(adFormElements, false);

    adFormTitle.addEventListener('change', window.form.checkTitleValue);
    adFormTitle.addEventListener('input', window.form.checkTitleValue);
    adFormHouseType.addEventListener('change', window.form.setPriceValue);
    adFormPrice.addEventListener('input', window.form.checkPriceValue);
    adFormRoomNumber.addEventListener('change', window.form.setCapacity);
    adFormCapacity.addEventListener('change', window.form.checkCapacity);
    adFormTimeIn.addEventListener('change', window.form.setTimeInOut);
    adFormTimeOut.addEventListener('change', window.form.setTimeInOut);
    adFormSubmit.addEventListener('click', window.form.submit);
    adFormReset.addEventListener('click', window.form.reset);
  };

  document.addEventListener('DOMContentLoaded', function () {
    adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MAIN_PIN_WIDTH / 2, window.util.MAIN_PIN_HEIGHT / 2);
    window.form.activateFormElements(mapFiltersFormElements, true);
    window.form.activateFormElements(adFormElements, true);
    window.form.setPriceValue();
    window.form.setCapacity();
  });

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (map.classList.contains('map--faded')) {
      activatePage();
    }

    adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MAIN_PIN_WIDTH / 2, window.util.MAIN_PIN_ACTIVE_HEIGHT);

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MAIN_PIN_WIDTH / 2, window.util.MAIN_PIN_ACTIVE_HEIGHT);

      var shift = {
        x: startCoords.x - moveEvt.x,
        y: startCoords.y - moveEvt.y
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if ((mainPin.offsetLeft > 0 || shift.x < 0) && (mainPin.offsetLeft < map.clientWidth - window.util.MAIN_PIN_WIDTH || shift.x > 0)) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      } else if (mainPin.offsetLeft <= 0 && shift.x >= 0) {
        mainPin.style.left = 0 + 'px';
      } else {
        mainPin.style.left = map.clientWidth - window.util.MAIN_PIN_WIDTH + 'px';
      }

      if ((mainPin.offsetTop > window.util.MIN_Y - window.util.MAIN_PIN_ACTIVE_HEIGHT || shift.y < 0) && (mainPin.offsetTop < window.util.MAX_Y - window.util.MAIN_PIN_ACTIVE_HEIGHT || shift.y > 0)) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      } else if (mainPin.offsetTop <= window.util.MIN_Y && shift.y >= 0) {
        mainPin.style.top = window.util.MIN_Y - window.util.MAIN_PIN_ACTIVE_HEIGHT + 'px';
      } else {
        mainPin.style.top = window.util.MAX_Y - window.util.MAIN_PIN_ACTIVE_HEIGHT + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
