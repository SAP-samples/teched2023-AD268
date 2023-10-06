'use strict';

var util = require('util');

module.exports = TupelListBase;

function TupelListBase(options) {
  Array.call(this);
  Object.defineProperties(this, {
    lowerCaseNames: {
      value: options.lowerCaseNames
    }
  });
}

util.inherits(TupelListBase, Array);


TupelListBase.prototype._addData = function (data) {
  if (typeof data !== 'object') {
    return;
  }
  Object.keys(data).forEach(function (property) {
    var value = data[property];
    var name = (this.lowerCaseNames) ? property.toLowerCase() : property;

    if (!Array.isArray(value)) {
      addTupelPair(this, name, value);
    } else {
      value.forEach(function (arrayElement) {
        addTupelPair(this, name, arrayElement);
      }, this);
    }
  }, this);
};

function addTupelPair(tupelList, name, value) {
  if (typeof value === 'string') {
    tupelList.push({ name: name, value: value });
  } else if (typeof value === 'number') {
    tupelList.push({ name: name, value: '' + value });
  } else {
    throw new Error('Could not handle TupelList value: ' + JSON.stringify(value));
  }
}
