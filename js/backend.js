'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var XHR_STATUS_OK = 200;

  var adFormReset = document.querySelector('.ad-form__reset');
  var adFormSubmit = document.querySelector('.ad-form__submit');
  var isSend = false;

  var xhrEventsHandler = function (xhr, loadHandler, errorHandler) {
    xhr.addEventListener('load', function () {
      if (xhr.status === XHR_STATUS_OK) {
        loadHandler(xhr.response);
        isSend = false;
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
      isSend = false;
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      isSend = false;
    });

    xhr.timeout = 10000;
  };

  window.backend = {
    get: function (loadHandler, errorHandler) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhrEventsHandler(xhr, loadHandler, errorHandler);

      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    post: function (data, loadHandler, errorHandler) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      window.backend.xhrAbortHandler = function () {
        xhr.abort();
        adFormSubmit.disabled = false;
        isSend = false;
        adFormReset.removeEventListener('click', window.backend.xhrAbortHandler);
      };

      if (!isSend) {
        isSend = true;
        adFormReset.addEventListener('click', window.backend.xhrAbortHandler);
      }

      xhrEventsHandler(xhr, loadHandler, errorHandler);

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
