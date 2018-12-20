'use strict';

(function () {
  var Coordinate = {
    MIN_Y: 130,
    MAX_Y: 630
  };
  var main = document.querySelector('main');
  var map = main.querySelector('.map');
  var pins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var mapOverlay = map.querySelector('.map__overlay');
  var mapFilters = map.querySelector('.map__filters');
  var adForm = main.querySelector('.ad-form');
  var adFormAvatarUpload = adForm.querySelector('#avatar');
  var adFormAddress = adForm.querySelector('#address');
  var adFormTitle = adForm.querySelector('#title');
  var adFormHouseType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormRoomNumber = adForm.querySelector('#room_number');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');
  var adFormPhotoUpload = adForm.querySelector('#images');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var errorTemplate = document.querySelector('#error');
  var errorItem = errorTemplate.content.querySelector('.error');
  var errorItemText = errorItem.querySelector('.error__message');
  var errorItemButton = errorItem.querySelector('.error__button');
  var isActive = false;

  var removePopup = function () {
    if (map.querySelector('.popup')) {
      var popup = map.querySelector('.popup');
      var currentPin = map.querySelector('.map__pin--active');
      currentPin.classList.remove('map__pin--active');
      map.removeChild(popup);
      mapOverlay.removeEventListener('click', removePopup);
      document.removeEventListener('keydown', popupEscHandler);
    }
  };

  var removePins = function () {
    var allRenderedPins = pins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < allRenderedPins.length; i++) {
      pins.removeChild(allRenderedPins[i]);
    }
  };

  var clear = function () {
    removePopup();
    removePins();
    mainPin.style.left = '570px';
    mainPin.style.top = '375px';
    adFormReset.removeEventListener('click', clear);
    isActive = false;
  };

  var popupEscHandler = function (evt) {
    window.util.isEscEvent(evt, removePopup);
  };

  var pinClickHandler = function (allPins, adsNearbyItem) {
    allPins.addEventListener('click', function () {
      mapOverlay.addEventListener('click', removePopup);
      var popup = map.querySelector('.popup');
      if (popup) {
        var titleAds = adsNearbyItem.offer.title;
        if (popup.querySelector('.popup__title').textContent === titleAds) {
          return;
        }
        removePopup();
        mapOverlay.addEventListener('click', removePopup);
      }

      window.card(adsNearbyItem);
      allPins.classList.add('map__pin--active');
      popup = map.querySelector('.popup');
      var popupClose = popup.querySelector('.popup__close');
      popupClose.addEventListener('click', removePopup);
      document.addEventListener('keydown', popupEscHandler);
    });
  };

  var getPinsAgain = function (evt) {
    evt.stopPropagation();
    errorItemButton.removeEventListener('click', getPinsAgain);
    window.backend.get(successHandler, errorHandler);
  };

  var successHandler = function (pinsArray) {
    window.map.adsNearbyArray = pinsArray;
    var overlay = main.querySelector('.error');
    if (overlay) {
      main.removeChild(overlay);
    }
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MainPinSize.WIDTH / 2, window.util.MainPinSize.ACTIVE_HEIGHT);

    window.pin.render(pinsArray);

    window.form.activate(mapFilters.children, false);
    window.form.activate(adForm.children, false);

    adFormAvatarUpload.addEventListener('change', window.upload.singleFile);
    adFormTitle.addEventListener('change', window.form.checkTitleValue);
    adFormTitle.addEventListener('input', window.form.checkTitleValue);
    adFormHouseType.addEventListener('change', window.form.setPriceValue);
    adFormPrice.addEventListener('input', window.form.checkPriceValue);
    adFormRoomNumber.addEventListener('change', window.form.setCapacity);
    adFormTimeIn.addEventListener('change', window.form.setTimeInOut);
    adFormTimeOut.addEventListener('change', window.form.setTimeInOut);
    adFormPhotoUpload.addEventListener('change', window.upload.multipleFile);
    adFormSubmit.addEventListener('click', window.form.submit);
    adFormReset.addEventListener('click', clear);
    adFormReset.addEventListener('click', window.form.reset);
    isActive = true;
  };

  var errorHandler = function (errorMessage) {
    main.insertBefore(errorItem, main.firstElementChild);
    errorItemText.textContent = errorMessage;
    errorItemButton.addEventListener('click', getPinsAgain);
    document.addEventListener('click', window.form.removeMessage);
    document.addEventListener('keydown', window.form.messageEscHandler);
    isActive = false;
  };

  var activatePage = function () {
    if (!isActive) {
      isActive = true;
      window.backend.get(successHandler, errorHandler);
    }

    adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MainPinSize.WIDTH / 2, window.util.MainPinSize.ACTIVE_HEIGHT);
    mainPin.removeEventListener('keydown', mainPinEnterHandler);
  };

  var mainPinEnterHandler = function (evt) {
    window.util.isEnterEvent(evt, activatePage);
  };

  document.addEventListener('DOMContentLoaded', function () {
    adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MainPinSize.WIDTH / 2, window.util.MainPinSize.HEIGHT / 2);
    window.form.activate(mapFilters.children, true);
    window.form.activate(adForm.children, true);
    window.form.setPriceValue();
    window.form.setCapacity();

    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var mouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        activatePage();

        adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MainPinSize.WIDTH / 2, window.util.MainPinSize.ACTIVE_HEIGHT);

        var shift = {
          x: startCoords.x - moveEvt.x,
          y: startCoords.y - moveEvt.y
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        if ((mainPin.offsetLeft > 0 || shift.x < 0) && (mainPin.offsetLeft < map.clientWidth - window.util.MainPinSize.WIDTH || shift.x > 0)) {
          mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
        } else if (mainPin.offsetLeft <= 0 && shift.x >= 0) {
          mainPin.style.left = 0 + 'px';
        } else {
          mainPin.style.left = map.clientWidth - window.util.MainPinSize.WIDTH + 'px';
        }

        if ((mainPin.offsetTop > Coordinate.MIN_Y - window.util.MainPinSize.ACTIVE_HEIGHT || shift.y < 0) && (mainPin.offsetTop < Coordinate.MAX_Y - window.util.MainPinSize.ACTIVE_HEIGHT || shift.y > 0)) {
          mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
        } else if (mainPin.offsetTop <= Coordinate.MIN_Y && shift.y >= 0) {
          mainPin.style.top = Coordinate.MIN_Y - window.util.MainPinSize.ACTIVE_HEIGHT + 'px';
        } else {
          mainPin.style.top = Coordinate.MAX_Y - window.util.MainPinSize.ACTIVE_HEIGHT + 'px';
        }
      };

      var mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });

    mainPin.addEventListener('keydown', mainPinEnterHandler);
  });

  window.map = {
    isActive: isActive,
    removePopup: removePopup,
    removePins: removePins,
    clear: clear,
    pinClickHandler: pinClickHandler,
    mainPinEnterHandler: mainPinEnterHandler
  };
})();
