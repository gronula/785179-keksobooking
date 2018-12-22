'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var XHR_STATUS_OK = 200;
  var XHR_TIMEOUT = 10000;

  var xhrEventsHandler = function (xhr, loadHandler, errorHandler) {
    xhr.addEventListener('load', function () {
      if (xhr.status === XHR_STATUS_OK) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = XHR_TIMEOUT;
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

      xhrEventsHandler(xhr, loadHandler, errorHandler);

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
