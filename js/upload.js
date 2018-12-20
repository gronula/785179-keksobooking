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
  var count;
  var match;

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
    singleFile: function () {
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
    multipleFile: function () {
      var files = this.files;
      count = 0;
      match = 0;

      for (var i = 0; i < files.length; i++) {
        var file = files[i].name.toLowerCase();

        FILE_TYPES.forEach(function (it) {
          if (file.endsWith(it)) {
            match++;
            if (!isRemoved) {
              isRemoved = true;
              adFormPhotoContainer.removeChild(adFormPhoto);
            }

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

            reader.readAsDataURL(files[i]);
          }
        });
      }
    },
    reset: function () {
      if (adFormAvatarContainer.hasAttribute('style')) {
        adFormAvatarContainer.removeAttribute('style');
        adFormAvatarContainer.innerHTML = '<img src="img/muffin-grey.svg" alt="Аватар пользователя" width="40" height="44">';
      }

      if (adFormPhotoContainer.hasAttribute('data-load')) {
        var adFormPhotos = adForm.querySelectorAll('.ad-form__photo');

        adFormPhotoContainer.removeAttribute('data-load');

        for (var i = 0; i < adFormPhotos.length; i++) {
          adFormPhotoContainer.removeChild(adFormPhotos[i]);
        }

        adFormPhotoContainer.appendChild(adFormPhoto);

        isRemoved = false;
        dataUrlsArray = [];
      }
    }
  };
})();
