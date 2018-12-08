'use strict';

(function () {
  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card');
  var cardItem = cardTemplate.content.querySelector('.map__card');

  window.card = {
    renderCardElement: function (adsNearbyArray) {
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
    }
  };
})();
