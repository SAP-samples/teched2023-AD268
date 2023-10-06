'use strict';

var util = require('util');
var assert = require('assert');
var TupelListBase = require('./TupelListBase');


module.exports = HeadersTupelList;

function HeadersTupelList() {
  TupelListBase.call(this, { lowerCaseNames: true });
}

util.inherits(HeadersTupelList, TupelListBase);

HeadersTupelList.prototype.set = function (name, value) {
  assert(typeof name === 'string', 'Expected string as first argument');
  assert(typeof value === 'string', 'Expected string as second argument');

  this.remove(name);
  this.push({ name: name.toLowerCase(), value: value });
  return true;
};

HeadersTupelList.prototype.get = function (name) {
  assert(typeof name === 'string', 'Expected string as argument');
  name = name.toLowerCase();

  var filtered = this.filter(function (tupel) {
    return tupel.name === name;
  }).map(function (tupel) {
    return tupel.value;
  });
  if (filtered.length > 1) {
    return filtered;
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  return undefined;
};

HeadersTupelList.prototype.remove = function (name) {
  assert(typeof name === 'string', 'Expected string as argument');
  name = name.toLowerCase();

  var currentPairIndex = 0;
  while (currentPairIndex < this.length) {
    if (this[currentPairIndex].name === name) {
      this.splice(currentPairIndex, 1);
    } else {
      ++currentPairIndex;
    }
  }
};
