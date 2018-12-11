'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var xhrEventHandler = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000;
  };

  window.backend = {
    get: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhrEventHandler(xhr, onLoad, onError);

      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    post: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhrEventHandler(xhr, onLoad, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
