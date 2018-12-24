'use strict';

(function () {
  var AdFormTitleLength = {
    MIN: 30,
    MAX: 100
  };

  var main = document.querySelector('main');
  var map = main.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters');
  var adForm = main.querySelector('.ad-form');
  var adFormAvatarUpload = adForm.querySelector('#avatar');
  var adFormAddress = adForm.querySelector('#address');
  var adFormTitle = adForm.querySelector('#title');
  var adFormHouseType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormRoomsNumber = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');
  var adFormPhotoUpload = adForm.querySelector('#images');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var successTemplate = document.querySelector('#success');
  var successItem = successTemplate.content.querySelector('.success');
  var errorTemplate = document.querySelector('#error');
  var errorItem = errorTemplate.content.querySelector('.error');
  var errorItemText = errorItem.querySelector('.error__message');
  var errorItemButton = errorItem.querySelector('.error__button');
  var adFormErrorStyle = '0 0 0 1px #f00';

  var adFormHouseTypeMap = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var adFormRoomsNumberMap = {
    '3': '3',
    '2': '2',
    '1': '1',
    '100': '0'
  };

  var formPostAgainHandler = function (evt) {
    evt.stopPropagation();
    window.form.titleInputHandler();
    window.form.houseTypeChangeHandler();
    if (adForm.checkValidity()) {
      adFormSubmit.disabled = true;
      errorItemButton.removeEventListener('click', formPostAgainHandler);
      window.backend.post(new FormData(adForm), successHandler, errorHandler);
    }
  };

  var successHandler = function () {
    var overlay = main.querySelector('.error');
    if (overlay) {
      main.replaceChild(successItem, overlay);
    }
    main.insertBefore(successItem, main.firstElementChild);
    window.map.resetClickHandler();
    window.form.resetHandler();
    window.form.roomsNumberChangeHandler();
    mapFilters.removeEventListener('change', window.pin.filterHandler);
    document.addEventListener('click', window.form.messageClickHandler);
    document.addEventListener('keydown', window.form.messageEscHandler);
    adFormSubmit.disabled = false;
    window.map.isActive = false;
  };

  var errorHandler = function (errorMessage) {
    main.insertBefore(errorItem, main.firstElementChild);
    errorItemText.textContent = errorMessage;
    errorItemButton.addEventListener('click', formPostAgainHandler);
    document.addEventListener('click', window.form.messageClickHandler);
    document.addEventListener('keydown', window.form.messageEscHandler);
    adFormSubmit.disabled = false;
  };

  window.form = {
    activate: function (form, isActive) {
      for (var i = 0; i < form.length; i++) {
        form[i].disabled = isActive;
      }
    },
    titleInputHandler: function () {
      var adFormErrorMessage = '';

      if (adFormTitle.validity.valueMissing) {
        adFormErrorMessage = 'Добавьте заголовок объявления.';
      } else if (adFormTitle.value.trim().length < AdFormTitleLength.MIN) {
        adFormErrorMessage = 'Минимальная длина — 30 символов';
      } else if (adFormTitle.value.trim().length > AdFormTitleLength.MAX) {
        adFormErrorMessage = 'Максимальная длина — 100 символов';
      }

      adFormTitle.setCustomValidity(adFormErrorMessage);
      adFormTitle.style.boxShadow = adFormErrorMessage === '' ? '' : adFormErrorStyle;
    },
    houseTypeChangeHandler: function () {
      var minPrice = adFormHouseTypeMap[adFormHouseType.value];
      adFormPrice.min = minPrice;
      adFormPrice.placeholder = minPrice;

      window.form.priceInputHandler();
    },
    priceInputHandler: function () {
      var adFormErrorMessage = '';

      if (adFormPrice.validity.valueMissing) {
        adFormErrorMessage = 'Укажите цену за ночь.';
      } else if (adFormPrice.validity.rangeUnderflow) {
        adFormErrorMessage = 'Цена за ночь должна быть больше или равна ' + adFormPrice.min + '.';
      } else if (adFormPrice.validity.rangeOverflow) {
        adFormErrorMessage = 'Цена за ночь должна быть меньше или равна ' + adFormPrice.max + '.';
      }

      adFormPrice.setCustomValidity(adFormErrorMessage);
      adFormPrice.style.boxShadow = adFormErrorMessage === '' ? '' : adFormErrorStyle;
    },
    roomsNumberChangeHandler: function () {
      adFormCapacity.value = adFormRoomsNumberMap[adFormRoomsNumber.value];

      for (var i = 0; i < adFormCapacity.length; i++) {
        if (adFormCapacity.value === '0') {
          adFormCapacity[i].disabled = adFormCapacity[i].value === '0' ? false : true;
        } else {
          adFormCapacity[i].disabled = Number(adFormCapacity[i].value) > Number(adFormRoomsNumber.value) || adFormCapacity[i].value === '0' ? true : false;
        }
      }
    },
    timeOutChangeHandler: function () {
      adFormTimeIn.value = adFormTimeOut.value;
    },
    timeInChangeHandler: function () {
      adFormTimeOut.value = adFormTimeIn.value;
    },
    messageEscHandler: function (evt) {
      window.util.isEscEvent(evt, window.form.messageClickHandler);
    },
    messageClickHandler: function () {
      switch (main.firstElementChild.classList.value) {
        case 'success':
          main.removeChild(main.firstElementChild);
          break;

        case 'error':
          main.removeChild(main.firstElementChild);
          break;
      }

      errorItemButton.removeEventListener('click', formPostAgainHandler);
      document.removeEventListener('click', window.form.messageClickHandler);
      document.removeEventListener('keydown', window.form.messageEscHandler);
    },
    submitHandler: function (evt) {
      window.form.titleInputHandler();
      window.form.houseTypeChangeHandler();
      if (adForm.checkValidity()) {
        window.map.popupRemoveHandler();
        adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MainPinSize.WIDTH / 2, window.util.MainPinSize.ACTIVE_HEIGHT);
        adFormSubmit.disabled = true;
        window.backend.post(new FormData(adForm), successHandler, errorHandler);
        evt.preventDefault();
      }
    },
    resetHandler: function (evt) {
      if (evt) {
        evt.preventDefault();
      }
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');

      mapFilters.reset();
      adForm.reset();

      window.form.activate(mapFilters.children, true);
      window.form.activate(adForm.children, true);

      window.upload.resetClickHandler();
      adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MainPinSize.WIDTH / 2, window.util.MainPinSize.HEIGHT / 2);
      adFormTitle.style.boxShadow = '';
      window.form.houseTypeChangeHandler();
      window.form.roomsNumberChangeHandler();

      mainPin.addEventListener('keydown', window.map.mainPinEnterHandler);
      mapFilters.removeEventListener('change', window.pin.filterHandler);
      adFormAvatarUpload.removeEventListener('change', window.upload.avatarChangeHandler);
      adFormTitle.removeEventListener('input', window.form.titleInputHandler);
      adFormHouseType.removeEventListener('change', window.form.houseTypeChangeHandler);
      adFormPrice.removeEventListener('input', window.form.priceInputHandler);
      adFormRoomsNumber.removeEventListener('change', window.form.roomsNumberChangeHandler);
      adFormTimeIn.removeEventListener('change', window.form.timeInChangeHandler);
      adFormTimeOut.removeEventListener('change', window.form.timeOutChangeHandler);
      adFormPhotoUpload.removeEventListener('change', window.upload.photoChangeHandler);
      adFormSubmit.removeEventListener('click', window.form.submitHandler);
      adFormReset.removeEventListener('click', window.form.resetHandler);
    }
  };
})();
