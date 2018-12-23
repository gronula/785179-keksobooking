'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var adForm = document.querySelector('.ad-form');
  var adFormAvatarContainer = adForm.querySelector('.ad-form-header__preview');
  var adFormPhotoContainer = adForm.querySelector('.ad-form__photo-container');
  var adFormPhoto = adForm.querySelector('.ad-form__photo');
  var photoFragment = document.createDocumentFragment();
  var isRemoved = false;
  var dataUrlsArray = [];

  var renderPhotos = function (data) {
    var adFormImageContainer = adFormPhoto.cloneNode(true);
    var adFormImage = document.createElement('img');

    adFormPhotoContainer.setAttribute('data-load', 'yes');

    adFormImageContainer.style.display = 'flex';
    adFormImageContainer.style.justifyContent = 'center';
    adFormImageContainer.style.alignItems = 'center';

    adFormImage.src = data;
    adFormImage.style.maxWidth = '70px';
    adFormImage.style.maxHeight = '70px';

    adFormImageContainer.appendChild(adFormImage);
    photoFragment.appendChild(adFormImageContainer);
  };

  window.upload = {
    avatarChangeHandler: function () {
      var adFormAvatarPreview = adForm.querySelector('.ad-form-header__preview img');
      var file = this.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          adFormAvatarContainer.style.justifyContent = 'center';
          adFormAvatarContainer.style.flexShrink = 0;
          adFormAvatarContainer.style.padding = 0;
          adFormAvatarPreview.src = reader.result;
          adFormAvatarPreview.style.maxWidth = '70px';
          adFormAvatarPreview.style.maxHeight = '70px';
          adFormAvatarPreview.style.borderRadius = '5px';
          adFormAvatarPreview.removeAttribute('width');
          adFormAvatarPreview.removeAttribute('height');
        });

        reader.readAsDataURL(file);
      }
    },
    photoChangeHandler: function () {
      var files = this.files;
      var fileNames = [];
      var count = 0;
      var match = 0;

      for (var i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image')) {
          fileNames.push(files[i]);
          match++;
        }
      }

      if (!isRemoved && match) {
        isRemoved = true;
        adFormPhotoContainer.removeChild(adFormPhoto);
      }

      fileNames.forEach(function (it) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          count++;
          if (!dataUrlsArray.includes(reader.result)) {
            dataUrlsArray.push(reader.result);
            renderPhotos(reader.result);
          }
          if (count === match) {
            adFormPhotoContainer.appendChild(photoFragment);
          }
        });
        reader.readAsDataURL(it);
      });
    },
    resetClickHandler: function () {
      if (adFormAvatarContainer.hasAttribute('style')) {
        adFormAvatarContainer.removeAttribute('style');
        adFormAvatarContainer.innerHTML = '<img src="img/muffin-grey.svg" alt="Аватар пользователя" width="40" height="44">';
      }

      if (adFormPhotoContainer.hasAttribute('data-load')) {
        var adFormPhotos = adForm.querySelectorAll('.ad-form__photo');

        adFormPhotoContainer.removeAttribute('data-load');

        adFormPhotos.forEach(function (it) {
          adFormPhotoContainer.removeChild(it);
        });

        adFormPhotoContainer.appendChild(adFormPhoto);

        isRemoved = false;
        dataUrlsArray = [];
      }
    }
  };
})();
