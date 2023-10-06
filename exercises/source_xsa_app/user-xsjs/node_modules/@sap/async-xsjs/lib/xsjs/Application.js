'use strict';

module.exports = Application;

function Application(locale, webResponse) {
  Object.defineProperties(this, {
    _langValue: {
      value: locale.applicationLanguage,
      writable: true
    },
    _webResponse: {
      value: webResponse
    }
  });
}

Object.defineProperties(Application.prototype, {
  language: {
    set: function (value) {
      this._langValue = value;
      this._webResponse.cookies.set('xsAppLanguage', value);
    },
    get: function () {
      return this._langValue;
    },
    enumerable: true
  }
});
