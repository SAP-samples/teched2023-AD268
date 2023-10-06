'use strict';

var util = require('util');
var assert = require('assert');
var TupelListBase = require('./TupelListBase');

module.exports = CookiesTupelList;

function CookiesTupelList() {
  TupelListBase.call(this, { lowerCaseNames: false });
}

util.inherits(CookiesTupelList, TupelListBase);

CookiesTupelList.prototype.set = function (name, value) {
  assert(typeof name === 'string', 'Expected string as first argument');
  assert(typeof value === 'string', 'Expected string as second argument');

  this.push({ name: name, value: value });
  return true;
};

CookiesTupelList.prototype.get = function (name) {
  assert(typeof name === 'string', 'Expected string as argument');
  var nameLowerCase = name.toLowerCase();

  for (var i = 0; i < this.length; i++) {
    if (this[i].name.toLowerCase() === nameLowerCase) {
      return this[i].value;
    }
  }
  return undefined;
};

CookiesTupelList.prototype.remove = function (name) {
  assert(typeof name === 'string', 'Expected string as argument');

  var idxCurrentTupel = 0;
  while (idxCurrentTupel < this.length) {
    if (this[idxCurrentTupel].name === name) {
      this.splice(idxCurrentTupel, 1);
      return;
    } else {
      ++idxCurrentTupel;
    }
  }
};
