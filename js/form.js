'use strict';

(function () {
  var map = document.querySelector('.map');
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
  var adFormErrorStyle = '0 0 0 1px #f00';
  var adFormReset = adForm.querySelector('.ad-form__reset');

  window.form = {
    activateFormElements: function (form, isActive) {
      for (var i = 0; i < form.length; i++) {
        form[i].disabled = isActive;
      }
    },
    checkTitleValue: function () {
      if (adFormTitle.validity.valueMissing) {
        var adFormErrorMessage = 'Добавьте заголовок объявления.';
      } else if (adFormTitle.validity.tooShort) {
        adFormErrorMessage = 'Минимальная длина — 30 символов';
      } else if (adFormTitle.validity.tooLong) {
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
      switch (adFormHouseType.value) {
        case 'bungalo':
          var minPrice = 0;
          break;
        case 'flat':
          minPrice = 1000;
          break;
        case 'house':
          minPrice = 5000;
          break;
        case 'palace':
          minPrice = 10000;
          break;
      }

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
      var disableCapacityOptions = function () {
        for (var i = 0; i < adFormCapacity.length; i++) {
          if (Number(adFormCapacity[i].value) > Number(adFormRoomNumber.value)) {
            adFormCapacity[i].disabled = true;
          } else if (adFormCapacity[i].value === '0') {
            adFormCapacity[i].disabled = true;
          } else {
            adFormCapacity[i].disabled = false;
          }
        }
      };
      switch (adFormRoomNumber.value) {
        case '3':
          adFormCapacity.value = '3';
          disableCapacityOptions();
          break;
        case '2':
          adFormCapacity.value = '2';
          disableCapacityOptions();
          break;
        case '1':
          adFormCapacity.value = '1';
          disableCapacityOptions();
          break;
        case '100':
          adFormCapacity.value = '0';
          for (var i = 0; i < adFormCapacity.length; i++) {
            if (adFormCapacity[i].value === '0') {
              adFormCapacity[i].disabled = false;
            } else {
              adFormCapacity[i].disabled = true;
            }
          }
          break;
      }

      window.form.checkCapacity();
    },
    checkCapacity: function () {
      if ((Number(adFormCapacity.value) > Number(adFormRoomNumber.value)) ||
          (adFormCapacity.value === '0' && adFormRoomNumber.value !== '100')) {
        switch (adFormCapacity.value) {
          case '0':
            var adFormErrorMessage = 'Минимальное количество гостей не может быть меньше 1.';
            break;
          default:
            adFormErrorMessage = 'Количество гостей не может быть больше ' + adFormRoomNumber.value + '.';
            break;
        }
      } else if (adFormCapacity.value !== '0' && adFormRoomNumber.value === '100') {
        adFormErrorMessage = 'Единственный допустимый вариант: "не для гостей".';
      } else {
        adFormErrorMessage = '';
      }

      adFormCapacity.setCustomValidity(adFormErrorMessage);
      if (adFormErrorMessage !== '') {
        adFormCapacity.style.boxShadow = adFormErrorStyle;
      } else {
        adFormCapacity.style.boxShadow = '';
      }
    },
    setTimeInOut: function (evt) {
      if (evt.target === adFormTimeIn) {
        adFormTimeOut.value = adFormTimeIn.value;
      } else {
        adFormTimeIn.value = adFormTimeOut.value;
      }
    },
    reset: function () {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      adForm.reset();
      window.form.activateFormElements(mapFiltersFormElements, true);
      window.form.activateFormElements(adFormElements, true);
      adFormAddress.value = window.util.getMainPinCoordinates(mainPin, window.util.MAIN_PIN_WIDTH / 2, window.util.MAIN_PIN_HEIGHT / 2);
      window.form.checkTitleValue();
      window.form.setPriceValue();
      window.form.setCapacity();

      adFormReset.removeEventListener('click', window.form.reset);
    }
  };
})();
