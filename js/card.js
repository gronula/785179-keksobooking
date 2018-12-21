'use strict';

(function () {
  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card');
  var cardItem = cardTemplate.content.querySelector('.map__card');
  var adsNearbyTypeMap = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var checkCardBlock = function (array, element, parent) {
    if (array.length === 0) {
      element.removeChild(parent);
    } else {
      var fragment = document.createDocumentFragment();
      array.forEach(function (it) {
        if (parent.classList.contains('popup__features')) {
          var newElement = parent.querySelector('.popup__feature').cloneNode(true);
          newElement.className = 'popup__feature popup__feature--' + it;
        } else {
          newElement = parent.querySelector('.popup__photo').cloneNode(true);
          newElement.src = it;
        }
        fragment.appendChild(newElement);
      });

      parent.innerHTML = '';
      parent.appendChild(fragment);
    }
  };

  window.card = function (adsNearbyArray) {
    var card = cardItem.cloneNode(true);
    var cardAvatar = card.querySelector('.popup__avatar');
    var cardTitle = card.querySelector('.popup__title');
    var cardAddress = card.querySelector('.popup__text--address');
    var cardPrice = card.querySelector('.popup__text--price');
    var cardType = card.querySelector('.popup__type');
    var cardCapacity = card.querySelector('.popup__text--capacity');
    var cardTime = card.querySelector('.popup__text--time');
    var cardFeatures = card.querySelector('.popup__features');
    var cardDescription = card.querySelector('.popup__description');
    var cardPhotos = card.querySelector('.popup__photos');

    cardAvatar.src = adsNearbyArray.author.avatar;
    cardTitle.textContent = adsNearbyArray.offer.title;
    cardAddress.textContent = adsNearbyArray.offer.address;
    cardPrice.textContent = adsNearbyArray.offer.price + '₽/ночь';
    cardType.textContent = adsNearbyTypeMap[adsNearbyArray.offer.type];

    var rooms = adsNearbyArray.offer.rooms.toString();
    var roomsText = rooms + ' комнат для ';
    if (rooms.endsWith('1') && !rooms.endsWith('11')) {
      roomsText = rooms + ' комната для ';
    } else if (rooms.endsWith('2') && !rooms.endsWith('12') || rooms.endsWith('3') && !rooms.endsWith('13') || rooms.endsWith('4') && !rooms.endsWith('14')) {
      roomsText = rooms + ' комнаты для ';
    }

    var guests = adsNearbyArray.offer.guests.toString();
    var guestsText = guests.endsWith('1') && !guests.endsWith('11') ? guests + ' гостя' : guests + ' гостей';

    cardCapacity.textContent = roomsText + guestsText;
    cardTime.textContent = 'Заезд после ' + adsNearbyArray.offer.checkin + ', выезд до ' + adsNearbyArray.offer.checkout;

    checkCardBlock(adsNearbyArray.offer.features, card, cardFeatures);

    if (adsNearbyArray.offer.description.length === 0) {
      card.removeChild(cardDescription);
    } else {
      card.querySelector('.popup__description').textContent = adsNearbyArray.offer.description;
    }

    checkCardBlock(adsNearbyArray.offer.photos, card, cardPhotos);

    map.insertBefore(card, filtersContainer);
  };
})();
