'use strict';

(function () {
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

  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 10;

  window.data = {
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getRandomArrayElement: function (array) {
      return array[this.getRandomInt(0, array.length)];
    },
    sortArrayRandom: function (array) {
      return array.slice().sort(function () {
        return Math.random() - 0.5;
      });
    },
    getArrayOfRandomLength: function (array) {
      var newArray = array.slice();
      newArray.length = this.getRandomInt(0, array.length + 1);
      for (var i = 0; i < newArray.length; i++) {
        newArray[i] = array[i];
      }
      return newArray;
    },
    getRandomArrayPins: function (numberOfElements) {
      var array = [];
      for (var i = 0; i < numberOfElements; i++) {
        array[i] = {
          author: {
            avatar: 'img/avatars/user0' + (i + 1) + '.png'
          },
          offer: {
            title: TITLES_ARRAY[i],
            price: this.getRandomInt(MIN_PRICE, MAX_PRICE),
            type: this.getRandomArrayElement(TYPES_ARRAY),
            rooms: this.getRandomInt(MIN_ROOMS, MAX_ROOMS),
            guests: this.getRandomInt(MIN_GUESTS, MAX_GUESTS),
            checkin: this.getRandomArrayElement(CHECKS_ARRAY),
            checkout: this.getRandomArrayElement(CHECKS_ARRAY),
            features: this.getArrayOfRandomLength(FEATURES_ARRAY),
            description: '',
            photos: this.sortArrayRandom(PHOTOS_ARRAY)
          },
          location: {
            x: this.getRandomInt(window.util.MIN_X + window.util.PIN_WIDTH / 2, window.util.MAX_X - window.util.PIN_WIDTH / 2),
            y: this.getRandomInt(window.util.MIN_Y, window.util.MAX_Y)
          }
        };

        array[i].offer.address = array[i].location.x + ', ' + array[i].location.y;
      }
      return array;
    }
  };
})();
