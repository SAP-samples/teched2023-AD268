'use strict';

var util = require('util');

module.exports = EntityList;

function EntityList() {
  Array.call(this);
}

util.inherits(EntityList, Array);
