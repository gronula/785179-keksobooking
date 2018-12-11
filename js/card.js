'use strict';

(function () {
  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card');
  var cardItem = cardTemplate.content.querySelector('.map__card');

  var checkCardBlock = function (array, element, parent) {
    if (array.length === 0) {
      element.removeChild(parent);
    } else {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < array.length; i++) {
        if (parent.classList.contains('popup__features')) {
          var newElement = parent.querySelector('.popup__feature').cloneNode(true);
          newElement.className = 'popup__feature popup__feature--' + array[i];
        } else {
          newElement = parent.querySelector('.popup__photo').cloneNode(true);
          newElement.src = array[i];
        }
        fragment.appendChild(newElement);
      }
      parent.innerHTML = '';
      parent.appendChild(fragment);
    }
  };

  window.card = {
    renderCardElement: function (adsNearbyArray) {
      var cardElement = cardItem.cloneNode(true);
      var cardElementAvatar = cardElement.querySelector('.popup__avatar');
      var cardElementTitle = cardElement.querySelector('.popup__title');
      var cardElementAddress = cardElement.querySelector('.popup__text--address');
      var cardElementPrice = cardElement.querySelector('.popup__text--price');
      var cardElementType = cardElement.querySelector('.popup__type');
      var cardElementCapacity = cardElement.querySelector('.popup__text--capacity');
      var cardElementTime = cardElement.querySelector('.popup__text--time');
      var cardElementFeatures = cardElement.querySelector('.popup__features');
      var cardElementDescription = cardElement.querySelector('.popup__description');
      var cardElementPhotos = cardElement.querySelector('.popup__photos');

      cardElementAvatar.src = adsNearbyArray.author.avatar;
      cardElementTitle.textContent = adsNearbyArray.offer.title;
      cardElementAddress.textContent = adsNearbyArray.offer.address;
      cardElementPrice.textContent = adsNearbyArray.offer.price + '₽/ночь';

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

      cardElementCapacity.textContent = adsNearbyArray.offer.rooms + ' комнаты для ' + adsNearbyArray.offer.guests + ' гостей';
      cardElementTime.textContent = 'Заезд после ' + adsNearbyArray.offer.checkin + ', выезд до ' + adsNearbyArray.offer.checkout;

      checkCardBlock(adsNearbyArray.offer.features, cardElement, cardElementFeatures);

      if (adsNearbyArray.offer.description.length === 0) {
        cardElement.removeChild(cardElementDescription);
      } else {
        cardElement.querySelector('.popup__description').textContent = adsNearbyArray.offer.description;
      }

      checkCardBlock(adsNearbyArray.offer.photos, cardElement, cardElementPhotos);

      map.insertBefore(cardElement, filtersContainer);
    }
  };
})();
