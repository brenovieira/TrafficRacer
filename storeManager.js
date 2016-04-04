(function () {
  'use strict';

  window.StoreManager = {
    get: function (key) {
      return localStorage.getItem(key);
    },
    put: function (key, value) {
      return localStorage.setItem(key, value);
    },
    delete: function (key) {
      return localStorage.removeItem(key);
    },
    clear: function () {
      return localStorage.clear();
    }
  };
})();