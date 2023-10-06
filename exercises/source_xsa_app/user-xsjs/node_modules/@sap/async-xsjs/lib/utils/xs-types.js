'use strict';

var Zip = require('../xsjs/util/Zip');
var WebBody = require('../xsjs/web/WebBody');
var BasicWebEntity = require('../xsjs/web/BasicWebEntity');

module.exports.isWebBody = isWebBody;
module.exports.isZip = isZip;
module.exports.isBasicWebEntity = isBasicWebEntity;

function isWebBody(obj) {
  return obj instanceof WebBody;
}

function isZip(obj) {
  return obj instanceof Zip;
}

function isBasicWebEntity(obj) {
  return obj instanceof BasicWebEntity;
}
