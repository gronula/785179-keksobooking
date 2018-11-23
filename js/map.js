'use strict';

var TITLE_ARRAY = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPE_ARRAY = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var CHECK_ARRAY = [
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

// var PHOTOS_ARRAY = [
//   'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
//   'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
//   'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
// ];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function sortRandom() {
  return Math.random() - 0.5;
}

var getRandomArray = function (numberOfElements) {
  var array = [];
  for (var i = 0; i < numberOfElements; i++) {
    var object = {
      author: {
        avatar: ''
      },
      offer: {
        title: '',
        address: '',
        price: '',
        type: '',
        rooms: '',
        guests: '',
        checkin: '',
        checkout: '',
        features: [],
        description: '',
        photos: []
      },
      location: {
        x: '',
        y: ''
      }
    };
    object.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';

    object.location.x = getRandomInt(130, 631);
    object.location.y = getRandomInt(130, 631);

    object.offer.title = TITLE_ARRAY[i];
    object.offer.address = object.location.x + ', ' + object.location.y;
    object.offer.price = getRandomInt(1000, 1000001);
    object.offer.type = TYPE_ARRAY[getRandomInt(0, TYPE_ARRAY.length)];
    object.offer.rooms = getRandomInt(1, 6);
    object.offer.guests = getRandomInt(1, 10);
    object.offer.checkin = CHECK_ARRAY[getRandomInt(0, CHECK_ARRAY.length)];
    object.offer.checkout = CHECK_ARRAY[getRandomInt(0, CHECK_ARRAY.length)];
    object.offer.features.length = getRandomInt(1, FEATURES_ARRAY.length + 1);
    for (var j = 0; j < object.offer.features.length; j++) {
      object.offer.features[j] = FEATURES_ARRAY[j];
    }
    object.offer.description = '';

    var PHOTOS_ARRAY = [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ];

    object.offer.photos = PHOTOS_ARRAY.sort(sortRandom);

    array.push(object);
  }

  return array;
};

var adsNearby = getRandomArray(8);

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pins = document.querySelector('.map__pins');

var filtersContainer = document.querySelector('.map__filters-container');

var pinTemplate = document.querySelector('#pin');

var pinItem = pinTemplate.content.querySelector('.map__pin');

var pinsFragment = document.createDocumentFragment();

var cardTemplate = document.querySelector('#card');

var cardItem = cardTemplate.content.querySelector('.map__card');

var cardsFragment = document.createDocumentFragment();

var renderPinElement = function (adsNearbyArray) {
  var pinElement = pinItem.cloneNode(true);

  pinElement.style.left = adsNearbyArray.location.x + 'px';
  pinElement.style.top = adsNearbyArray.location.y + 'px';

  pinElement.querySelector('img').src = adsNearbyArray.author.avatar;
  pinElement.querySelector('img').alt = adsNearbyArray.offer.title;

  return pinElement;
};

var renderCardElement = function (adsNearbyArray) {
  var cardElement = cardItem.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = adsNearbyArray.offer.title;

  cardElement.querySelector('.popup__text--address').textContent = adsNearbyArray.offer.address;

  cardElement.querySelector('.popup__text--price').textContent = adsNearbyArray.offer.price + '₽/ночь';

  var cardElementType = cardElement.querySelector('.popup__type');

  if (adsNearbyArray.offer.type === 'flat') {
    cardElementType.textContent = 'Квартира';
  } else if (adsNearbyArray.offer.type === 'bungalo') {
    cardElementType.textContent = 'Бунгало';
  } else if (adsNearbyArray.offer.type === 'house') {
    cardElementType.textContent = 'Дом';
  } else if (adsNearbyArray.offer.type === 'palace') {
    cardElementType.textContent = 'Дворец';
  }

  cardElement.querySelector('.popup__text--capacity').textContent = adsNearbyArray.offer.rooms + ' комнаты для ' + adsNearbyArray.offer.guests + ' гостей';

  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adsNearbyArray.offer.checkin + ', выезд до ' + adsNearbyArray.offer.checkout;

  var cardElementFeatures = cardElement.querySelector('.popup__features');
  var cardElementFeaturesChildren = cardElementFeatures.children;
  var cardElementFeaturesFragment = document.createDocumentFragment();

  for (var i = cardElementFeaturesChildren.length - 1; i >= 0; i--) {
    var cardElementFeaturesChild = cardElementFeaturesChildren[i];
    cardElementFeaturesChild.parentElement.removeChild(cardElementFeaturesChild);
  }

  for (var j = 0; j < adsNearbyArray.offer.features.length; j++) {
    var newFeatureElement = document.createElement('li');
    newFeatureElement.className = 'popup__feature popup__feature--' + adsNearbyArray.offer.features[j];
    cardElementFeaturesFragment.appendChild(newFeatureElement);
  }

  cardElementFeatures.appendChild(cardElementFeaturesFragment);

  cardElement.querySelector('.popup__description').textContent = adsNearbyArray.offer.description;

  var cardElementPhotos = cardElement.querySelector('.popup__photos');
  var cardElementPhotosChildren = cardElementPhotos.children;
  var cardElementPhotosFragment = document.createDocumentFragment();

  for (var k = cardElementPhotosChildren.length - 1; k >= 0; k--) {
    var cardElementPhotosChild = cardElementPhotosChildren[k];
    cardElementPhotosChild.parentElement.removeChild(cardElementPhotosChild);
  }

  for (var l = 0; l < adsNearbyArray.offer.photos.length; l++) {
    var newPhotoElement = document.createElement('img');
    newPhotoElement.className = 'popup__photo';
    newPhotoElement.width = 45;
    newPhotoElement.height = 40;
    newPhotoElement.alt = 'Фотография жилья';
    newPhotoElement.src = adsNearbyArray.offer.photos[l];
    cardElementPhotosFragment.appendChild(newPhotoElement);
  }

  cardElementPhotos.appendChild(cardElementPhotosFragment);

  cardElement.querySelector('.popup__avatar').src = adsNearbyArray.author.avatar;

  return cardElement;
};

for (var i = 0; i < adsNearby.length; i++) {
  pinsFragment.appendChild(renderPinElement(adsNearby[i]));
  cardsFragment.appendChild(renderCardElement(adsNearby[i]));
}

pins.appendChild(pinsFragment);
map.insertBefore(cardsFragment, filtersContainer);
