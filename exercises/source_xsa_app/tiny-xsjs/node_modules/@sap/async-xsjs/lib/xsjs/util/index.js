'use strict';

var crypto = require('crypto');
var isArrayBuffer = require('../../utils/buffer-utils').isArrayBuffer;
var SAXParser = require('./SAXParser');

module.exports.Zip = require('./Zip');
module.exports.codec = require('./codec');
module.exports.compression = require('./compression');

module.exports.stringify = function stringify(buf) {
  if (!isArrayBuffer(buf)) {
    throw new Error('Input parameter must be ArrayBuffer');
  }
  return String.fromCharCode.apply(null, new Uint8Array(buf)); // eslint-disable-line no-undef
};

module.exports.createUuid = function createUuid() {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
};

module.exports.SAXParser = SAXParser;
