'use strict';

var TITLES_ARRAY = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPES_ARRAY = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var CHECKS_ARRAY = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES_ARRAY = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS_ARRAY = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var PINS_NUMBER = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var MIN_X = 0;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;

var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var MAIN_PIN_TIP_HEIGHT = 15;

var ESC_KEYCODE = 27;

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomArrayElement = function (array) {
  return array[getRandomInt(0, array.length)];
};

var sortArrayRandom = function (array) {
  return array.slice().sort(function () {
    return Math.random() - 0.5;
  });
};

var getArrayOfRandomLength = function (arr) {
  var newArray = arr.slice();
  newArray.length = getRandomInt(0, arr.length + 1);
  for (var i = 0; i < newArray.length; i++) {
    newArray[i] = arr[i];
  }
  return newArray;
};

var getRandomArrayPins = function (numberOfElements) {
  var array = [];
  for (var i = 0; i < numberOfElements; i++) {
    array[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: TITLES_ARRAY[i],
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
        type: getRandomArrayElement(TYPES_ARRAY),
        rooms: getRandomInt(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomInt(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayElement(CHECKS_ARRAY),
        checkout: getRandomArrayElement(CHECKS_ARRAY),
        features: getArrayOfRandomLength(FEATURES_ARRAY),
        description: '',
        photos: sortArrayRandom(PHOTOS_ARRAY)
      },
      location: {
        x: getRandomInt(MIN_X + PIN_WIDTH / 2, MAX_X - PIN_WIDTH / 2),
        y: getRandomInt(MIN_Y, MAX_Y)
      }
    };

    array[i].offer.address = array[i].location.x + ', ' + array[i].location.y;
  }

  return array;
};

var adsNearby = getRandomArrayPins(PINS_NUMBER);

var map = document.querySelector('.map');

var filtersContainer = map.querySelector('.map__filters-container');

var pins = map.querySelector('.map__pins');

var pinTemplate = document.querySelector('#pin');

var pinItem = pinTemplate.content.querySelector('.map__pin');

var pinsFragment = document.createDocumentFragment();

var cardTemplate = document.querySelector('#card');

var cardItem = cardTemplate.content.querySelector('.map__card');

var renderPinElement = function (adsNearbyArray) {
  for (var i = 0; i < adsNearbyArray.length; i++) {
    var pinElement = pinItem.cloneNode(true);

    pinElement.style.left = adsNearbyArray[i].location.x - PIN_WIDTH / 2 + 'px';
    pinElement.style.top = adsNearbyArray[i].location.y - PIN_HEIGHT + 'px';

    var pinElementImage = pinElement.querySelector('img');
    pinElementImage.src = adsNearbyArray[i].author.avatar;
    pinElementImage.alt = adsNearbyArray[i].offer.title;

    pinsFragment.appendChild(pinElement);
  }

  pins.appendChild(pinsFragment);
};

var renderCardElement = function (adsNearbyArray) {
  var cardElement = cardItem.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = adsNearbyArray.offer.title;

  cardElement.querySelector('.popup__text--address').textContent = adsNearbyArray.offer.address;

  cardElement.querySelector('.popup__text--price').textContent = adsNearbyArray.offer.price + '₽/ночь';

  var cardElementType = cardElement.querySelector('.popup__type');

  switch (adsNearbyArray.offer.type) {
    case 'flat':
      cardElementType.textContent = 'Квартира';
      break;

    case 'bungalo':
      cardElementType.textContent = 'Бунгало';
      break;

    case 'house':
      cardElementType.textContent = 'Дом';
      break;

    case 'palace':
      cardElementType.textContent = 'Дворец';
      break;
  }

  cardElement.querySelector('.popup__text--capacity').textContent = adsNearbyArray.offer.rooms + ' комнаты для ' + adsNearbyArray.offer.guests + ' гостей';

  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adsNearbyArray.offer.checkin + ', выезд до ' + adsNearbyArray.offer.checkout;

  var cardElementFeatures = cardElement.querySelector('.popup__features');
  cardElementFeatures.innerHTML = '';
  var cardElementFeaturesFragment = document.createDocumentFragment();

  for (var i = 0; i < adsNearbyArray.offer.features.length; i++) {
    var newFeatureElement = document.createElement('li');
    newFeatureElement.className = 'popup__feature popup__feature--' + adsNearbyArray.offer.features[i];
    cardElementFeaturesFragment.appendChild(newFeatureElement);
  }

  cardElementFeatures.appendChild(cardElementFeaturesFragment);

  cardElement.querySelector('.popup__description').textContent = adsNearbyArray.offer.description;

  var cardElementPhotos = cardElement.querySelector('.popup__photos');
  cardElementPhotos.innerHTML = '';
  var cardElementPhotosFragment = document.createDocumentFragment();

  for (i = 0; i < adsNearbyArray.offer.photos.length; i++) {
    var newPhotoElement = document.createElement('img');
    newPhotoElement.className = 'popup__photo';
    newPhotoElement.width = 45;
    newPhotoElement.height = 40;
    newPhotoElement.alt = 'Фотография жилья';
    newPhotoElement.src = adsNearbyArray.offer.photos[i];
    cardElementPhotosFragment.appendChild(newPhotoElement);
  }

  cardElementPhotos.appendChild(cardElementPhotosFragment);

  cardElement.querySelector('.popup__avatar').src = adsNearbyArray.author.avatar;

  map.insertBefore(cardElement, filtersContainer);
};

var mainPin = map.querySelector('.map__pin--main');
var mapFilters = map.querySelector('.map__filters');
var mapFiltersFormElements = mapFilters.children;
var adForm = document.querySelector('.ad-form');
var adFormElements = adForm.children;
var adFormAddress = adForm.querySelector('#address');

var getMainPinCoordinates = function (pin, width, height) {
  var pinLeftCoordinate = Number(pin.style.left.slice(0, -2));
  var pinTopCoordinate = Number(pin.style.top.slice(0, -2));
  var pinCoordinates = (pinLeftCoordinate + Math.floor(width)) + ', ' + (pinTopCoordinate + Math.floor(height));

  return pinCoordinates;
};

adFormAddress.value = getMainPinCoordinates(mainPin, MAIN_PIN_WIDTH / 2, MAIN_PIN_HEIGHT / 2);

var activateFormElements = function (form, isActive) {
  for (var i = 0; i < form.length; i++) {
    form[i].disabled = isActive;
  }
};

activateFormElements(mapFiltersFormElements, true);
activateFormElements(adFormElements, true);

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
  if (evt.keyCode === ESC_KEYCODE) {
    removePopup();
  }
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

    renderCardElement(adsNearbyArray);
    allPins.classList.add('map__pin--active');
    popup = map.querySelector('.popup');
    var popupClose = popup.querySelector('.popup__close');
    popupClose.addEventListener('click', removePopup);
    document.addEventListener('keydown', onPopupEscPress);
  });
};

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  activateFormElements(mapFiltersFormElements, false);
  activateFormElements(adFormElements, false);

  renderPinElement(adsNearby);

  var allRenderedPins = pins.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < allRenderedPins.length; i++) {
    pinClickHandler(allRenderedPins[i], adsNearby[i]);
  }


  adFormTitle.addEventListener('change', checkTitleValue);
  adFormTitle.addEventListener('input', checkTitleValue);

  adFormHouseType.addEventListener('change', setPriceValue);
  adFormPrice.addEventListener('input', checkPriceValue);

  adFormRoomNumber.addEventListener('change', setCapacity);
  adFormCapacity.addEventListener('change', checkCapacity);

  adFormTimeIn.addEventListener('change', setTimeInOut);
  adFormTimeOut.addEventListener('change', setTimeInOut);

  adFormSubmit.addEventListener('click', function () {
    checkTitleValue();
    checkPriceValue();
    checkCapacity();
  });

  var reset = function () {
    if (map.querySelector('.popup')) {
      removePopup();
    }
    for (i = 0; i < allRenderedPins.length; i++) {
      pins.removeChild(allRenderedPins[i]);
    }

    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    adForm.reset();
    activateFormElements(mapFiltersFormElements, true);
    activateFormElements(adFormElements, true);
    adFormAddress.value = getMainPinCoordinates(mainPin, MAIN_PIN_WIDTH / 2, MAIN_PIN_HEIGHT / 2);
    checkTitleValue();
    setPriceValue();
    setCapacity();

    adFormReset.removeEventListener('click', reset);
  };

  adFormReset.addEventListener('click', reset);
};

var adFormTitle = adForm.querySelector('#title');
var adFormHouseType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');
var adFormRoomNumber = adForm.querySelector('#room_number');
var adFormCapacity = adForm.querySelector('#capacity');
var adFormTimeIn = adForm.querySelector('#timein');
var adFormTimeOut = adForm.querySelector('#timeout');
var adFormSubmit = adForm.querySelector('.ad-form__submit');
var adFormReset = adForm.querySelector('.ad-form__reset');
var adFormErrorStyle = '0 0 0 1px #f00';

var checkTitleValue = function () {
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
};

var setPriceValue = function () {
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

  checkPriceValue();
};
var checkPriceValue = function () {
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
};

var setCapacity = function () {
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

  checkCapacity();
};

var checkCapacity = function () {
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
};

var setTimeInOut = function (evt) {
  if (evt.target === adFormTimeIn) {
    adFormTimeOut.value = adFormTimeIn.value;
  } else {
    adFormTimeIn.value = adFormTimeOut.value;
  }
};

document.addEventListener('DOMContentLoaded', function () {
  setPriceValue();
  setCapacity();
});

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  if (map.classList.contains('map--faded')) {
    activatePage();
  }

  adFormAddress.value = getMainPinCoordinates(mainPin, MAIN_PIN_WIDTH / 2, MAIN_PIN_HEIGHT + MAIN_PIN_TIP_HEIGHT);

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    adFormAddress.value = getMainPinCoordinates(mainPin, MAIN_PIN_WIDTH / 2, MAIN_PIN_HEIGHT + MAIN_PIN_TIP_HEIGHT);

    var shift = {
      x: startCoords.x - moveEvt.x,
      y: startCoords.y - moveEvt.y
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mainPinX = Number(mainPin.style.left.slice(0, -2));
    var mainPinY = Number(mainPin.style.top.slice(0, -2));

    if (mainPinX < MIN_X) {
      mainPin.style.left = MIN_X + 'px';
    } else if (mainPinX > MAX_X - MAIN_PIN_WIDTH) {
      mainPin.style.left = MAX_X - MAIN_PIN_WIDTH + 'px';
    }

    if (mainPinY < MIN_Y - MAIN_PIN_HEIGHT - MAIN_PIN_TIP_HEIGHT) {
      mainPin.style.top = MIN_Y - MAIN_PIN_HEIGHT - MAIN_PIN_TIP_HEIGHT + 'px';
    } else if (mainPinY > MAX_Y - MAIN_PIN_HEIGHT - MAIN_PIN_TIP_HEIGHT) {
      mainPin.style.top = MAX_Y - MAIN_PIN_HEIGHT - MAIN_PIN_TIP_HEIGHT + 'px';
    }

    mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
