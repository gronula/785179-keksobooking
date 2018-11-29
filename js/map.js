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

var MAIN_PIN_AFTER_HEIGHT = 22;

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

  for (var j = 0; j < adsNearbyArray.offer.photos.length; j++) {
    var newPhotoElement = document.createElement('img');
    newPhotoElement.className = 'popup__photo';
    newPhotoElement.width = 45;
    newPhotoElement.height = 40;
    newPhotoElement.alt = 'Фотография жилья';
    newPhotoElement.src = adsNearbyArray.offer.photos[j];
    cardElementPhotosFragment.appendChild(newPhotoElement);
  }

  cardElementPhotos.appendChild(cardElementPhotosFragment);

  cardElement.querySelector('.popup__avatar').src = adsNearbyArray.author.avatar;

  map.insertBefore(cardElement, filtersContainer);
};

var mainPin = map.querySelector('.map__pin--main');
var mainPinImage = mainPin.querySelector('img');
var mainPinWidth = mainPinImage.offsetWidth;
var mainPinHeight = mainPinImage.offsetHeight;
var mapFilters = map.querySelector('.map__filters');
var mapFiltersFormElements = mapFilters.children;
var adForm = document.querySelector('.ad-form');
var adFormElements = adForm.children;
var adFormAddress = adForm.querySelector('#address');

var getMainPinCoordinates = function (pin, width, height) {
  var pinLeftCoordinate = Number(pin.style.left.slice(0, -2));
  var pinTopCoordinate = Number(pin.style.top.slice(0, -2));
  var pinCoordinates = (pinLeftCoordinate + width) + ', ' + (pinTopCoordinate + height);

  return pinCoordinates;
};

adFormAddress.value = getMainPinCoordinates(mainPin, mainPinWidth / 2, mainPinHeight / 2);

var activateFormElements = function (form) {
  for (var i = 0; i < form.length; i++) {
    form[i].disabled = false;
  }
};

var deactivateFormElements = function (form) {
  for (var i = 0; i < form.length; i++) {
    form[i].disabled = true;
  }
};

deactivateFormElements(mapFiltersFormElements);
deactivateFormElements(adFormElements);

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  adFormAddress.value = getMainPinCoordinates(mainPin, mainPinWidth / 2, mainPinHeight + MAIN_PIN_AFTER_HEIGHT);

  activateFormElements(mapFiltersFormElements);
  activateFormElements(adFormElements);

  renderPinElement(adsNearby);

  mainPin.removeEventListener('mouseup', activatePage);

  var allRenderedPins = pins.querySelectorAll('.map__pin:not(:first-of-type)');
  var isOpen = false;

  var pinClickHandler = function (allPins, adsNearbyArray) {
    var renderCard = function () {
      if (!isOpen) {
        renderCardElement(adsNearbyArray);
      }
      isOpen = true;

      var popupClose = map.querySelector('.popup__close');
      var cardEl = map.querySelector('.map__card');

      var removeChild = function () {
        map.removeChild(cardEl);
        isOpen = false;
      };

      var onPopupEscPress = function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          removeChild();
          document.removeEventListener('keydown', onPopupEscPress);
        }
      };

      popupClose.addEventListener('click', removeChild);
      document.addEventListener('keydown', onPopupEscPress);
    };

    allPins.addEventListener('click', renderCard);
  };

  for (var i = 0; i < allRenderedPins.length; i++) {
    pinClickHandler(allRenderedPins[i], adsNearby[i]);
  }
};

mainPin.addEventListener('mouseup', activatePage);
