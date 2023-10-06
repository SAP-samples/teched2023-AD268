'use strict';

var x509 = require('@sap/node-jwt');
var buffUtils = require('../../utils/buffer-utils');

exports.getIssuer = function(data) {
  return new x509('').getIssuer(buffUtils.getData(data));
};

exports.getSubject = function(data) {
  return new x509('').getSubject(buffUtils.getData(data));
};
