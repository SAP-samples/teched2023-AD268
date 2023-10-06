'use strict';

var crypto = require('crypto');
var buffUtils = require('../../utils/buffer-utils');

function hashInput(data, key, algorithmType) {
  data = buffUtils.getData(data);
  var algorithm = key ? crypto.createHmac(algorithmType, key) : crypto.createHash(algorithmType);
  algorithm.update(data, 'utf8');
  return buffUtils.toArrayBuffer(algorithm.digest());
}

exports.md5 = function(data, key) {
  return hashInput(data, key, 'md5');
};

exports.sha1 = function(data, key) {
  return hashInput(data, key, 'sha1');
};

exports.sha256 = function(data, key) {
  return hashInput(data, key, 'sha256');
};
