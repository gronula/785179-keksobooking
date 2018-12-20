'use strict';

(function () {
  var AD_FORM_TITLE_MIN_LENGTH = 30;
  var AD_FORM_TITLE_MAX_LENGTH = 100;

  var main = document.querySelector('main');
  var map = main.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersFormElements = mapFilters.children;
  var adForm = main.querySelector('.ad-form');
  var adFormElements = adForm.children;
  var adFormAvatarUpload = adForm.querySelector('#avatar');
  var adFormAddress = adForm.querySelector('#address');
  var adFormTitle = adForm.querySelector('#title');
  var adFormHouseType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormRoomNumber = adForm.querySelector('#room_number');
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

  var adFormRoomNumberMap = {
    '3': '3',
    '2': '2',
    '1': '1',
    '100': '0'
  };

  var postFormAgain = function (evt) {
    evt.stopPropagation();
    errorItemButton.removeEventListener('click', postFormAgain);
    window.backend.post(new FormData(adForm), successHandler, errorHandler);
  };

  var successHandler = function () {
    var overlay = main.querySelector('.error');
    if (overlay) {
      main.replaceChild(successItem, overlay);
    }
    main.insertBefore(successItem, main.firstElementChild);
    window.map.clearMap();
    window.form.reset();
    mapFilters.removeEventListener('change', window.pin.filterPins);
    adFormReset.removeEventListener('click', window.backend.xhrAbort);
    document.addEventListener('click', window.form.removeMessage);
    document.addEventListener('keydown', window.form.messageEscHandler);
    adFormSubmit.disabled = false;
    window.map.isActive = false;
  };

  var errorHandler = function (errorMessage) {
    main.insertBefore(errorItem, main.firstElementChild);
    errorItemText.textContent = errorMessage;
    errorItemButton.addEventListener('click', postFormAgain);
    document.addEventListener('click', window.form.removeMessage);
    document.addEventListener('keydown', window.form.messageEscHandler);
    adFormSubmit.disabled = false;
  };

  window.form = {
    activateFormElements: function (form, isActive) {
      for (var i = 0; i < form.length; i++) {
        form[i].disabled = isActive;
      }
    },
    checkTitleValue: function () {
      if (adFormTitle.validity.valueMissing) {
        var adFormErrorMessage = 'Добавьте заголовок объявления.';
      } else if (adFormTitle.value.length < AD_FORM_TITLE_MIN_LENGTH) {
        adFormErrorMessage = 'Минимальная длина — 30 символов';
      } else if (adFormTitle.value.length > AD_FORM_TITLE_MAX_LENGTH) {
        adFormErrorMessage = 'Максимальная длина — 100 символов';
      } else {
        adFormErrorMessage = '';
      }

      adFormTitle.setCustomValidity(adFormErrorMessage);
      if (adFormErrorMessage !== '') {
        adFormTitle.style.boxShadow = adFormErrorStyle;
      } else {
        adFormTitle.style.boxShadow = '';
      }
    },
    setPriceValue: function () {
      var minPrice = adFormHouseTypeMap[adFormHouseType.value];
      adFormPrice.min = minPrice;
      adFormPrice.placeholder = minPrice;

      window.form.checkPriceValue();
    },
    checkPriceValue: function () {
      if (adFormPrice.validity.valueMissing) {
        var adFormErrorMessage = 'Укажите цену за ночь.';
      } else if (adFormPrice.validity.rangeUnderflow) {
        adFormErrorMessage = 'Цена за ночь должна быть больше или равна ' + adFormPrice.min + '.';
      } else if (adFormPrice.validity.rangeOverflow) {
        adFormErrorMessage = 'Цена за ночь должна быть меньше или равна ' + adFormPrice.max + '.';
      } else {
        adFormErrorMessage = '';
      }

      adFormPrice.setCustomValidity(adFormErrorMessage);
      if (adFormErrorMessage !== '') {
        adFormPrice.style.boxShadow = adFormErrorStyle;
      } else {
        adFormPrice.style.boxShadow = '';
      }
    },
    setCapacity: function () {
      adFormCapacity.value = adFormRoomNumberMap[adFormRoomNumber.value];

      for (var i = 0; i < adFormCapacity.length; i++) {
        if (adFormCapacity.value === '0') {
          if (adFormCapacity[i].value === '0') {
            adFormCapacity[i].disabled = false;
          } else {
            adFormCapacity[i].disabled = true;
          }
        } else {
          if (Number(adFormCapacity[i].value) > Number(adFormRoomNumber.value) || adFormCapacity[i].value === '0') {
            adFormCapacity[i].disabled = true;
          } else {
            adFormCapacity[i].disabled = false;
          }
        }
      }
    },
    setTimeInOut: function (evt) {
      if (evt.target === adFormTimeIn) {
        adFormTimeOut.value = adFormTimeIn.value;
      } else {
        adFormTimeIn.value = adFormTimeOut.value;
      }
    },
    messageEscHandler: function (evt) {
      window.util.isEscEvent(evt, window.form.removeMessage);
    },
    removeMessage: function () {
      switch (main.firstElementChild.classList.value) {
        case 'promo':
          break;

        default:
          main.removeChild(main.firstElementChild);
          break;
      }

      document.removeEventListener('click', window.form.removeMessage);
      document.removeEventListener('keydown', window.form.messageEscHandler);
    },
    submit: function (evt) {
      window.form.checkTitleValue();
      window.form.setPriceValue();
      window.form.setCapacity();
      if (adForm.checkValidity()) {
        adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MAIN_PIN_WIDTH / 2, window.util.MAIN_PIN_ACTIVE_HEIGHT);
        adFormSubmit.disabled = true;
        window.backend.post(new FormData(adForm), successHandler, errorHandler);
      }
      evt.preventDefault();
    },
    reset: function () {
      map.classList.add('map--faded');
      mapFilters.reset();
      adForm.classList.add('ad-form--disabled');
      adForm.reset();
      window.form.activateFormElements(mapFiltersFormElements, true);
      window.form.activateFormElements(adFormElements, true);
      window.upload.reset();
      adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MAIN_PIN_WIDTH / 2, window.util.MAIN_PIN_HEIGHT / 2);
      adFormTitle.style.boxShadow = '';
      window.form.setPriceValue();
      window.form.setCapacity();

      mapFilters.removeEventListener('change', window.pin.filterPins);
      adFormAvatarUpload.removeEventListener('change', window.upload.singleFileUpload);
      adFormTitle.removeEventListener('change', window.form.checkTitleValue);
      adFormTitle.removeEventListener('input', window.form.checkTitleValue);
      adFormHouseType.removeEventListener('change', window.form.setPriceValue);
      adFormPrice.removeEventListener('input', window.form.checkPriceValue);
      adFormRoomNumber.removeEventListener('change', window.form.setCapacity);
      adFormTimeIn.removeEventListener('change', window.form.setTimeInOut);
      adFormTimeOut.removeEventListener('change', window.form.setTimeInOut);
      adFormPhotoUpload.removeEventListener('change', window.upload.multipleFileUpload);
      adFormSubmit.removeEventListener('click', window.form.submit);
      adFormReset.removeEventListener('click', window.form.reset);
    }
  };
})();
