'use strict';

var util = require('util');
var assert = require('assert');
var TupelListBase = require('./TupelListBase');

module.exports = ParametersTupelList;

function ParametersTupelList() {
  TupelListBase.call(this, { lowerCaseNames: false });
}

util.inherits(ParametersTupelList, TupelListBase);

ParametersTupelList.prototype.set = function (name, value) {
  assert(typeof name === 'string', 'Expected string as first argument');
  assert(typeof value === 'string', 'Expected string as second argument');

  caseSensitiveRemove(this, name);
  this.push({ name: name, value: value });
  return true;
};

ParametersTupelList.prototype.get = function (name) {
  assert(typeof name === 'string', 'Expected string as argument');
  var nameLowerCase = name.toLowerCase();
  var searchFor;

  var filtered = [];
  for (var i = 0; i < this.length; i++) {
    var tupel = this[i];
    if (!searchFor && (tupel.name.toLowerCase() === nameLowerCase)) {
      searchFor = tupel.name;
    }
    if (searchFor && tupel.name === searchFor) {
      filtered.push(tupel.value);
    }
  }

  if (filtered.length > 1) {
    return filtered;
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  return undefined;
};

ParametersTupelList.prototype.remove = function (name) {
  assert(typeof name === 'string', 'Expected string as argument');
  caseInsensitiveRemove(this, name);
};

function caseSensitiveRemove(tupelList, name) {
  var idxCurrentTupel = 0;
  while (idxCurrentTupel < tupelList.length) {
    if (tupelList[idxCurrentTupel].name === name) {
      tupelList.splice(idxCurrentTupel, 1);
      return;
    } else {
      ++idxCurrentTupel;
    }
  }
}

function caseInsensitiveRemove(tupelList, name) {
  var nameLowerCase = name.toLowerCase();
  var searchFor;

  var idxCurrentTupel = 0;
  while (idxCurrentTupel < tupelList.length) {
    var tupel = tupelList[idxCurrentTupel];
    if (!searchFor && (tupel.name.toLowerCase() === nameLowerCase)) {
      searchFor = tupel.name;
    }
    if (searchFor && tupel.name === searchFor) {
      tupelList.splice(idxCurrentTupel, 1);
      return;
    } else {
      ++idxCurrentTupel;
    }
  }
}
