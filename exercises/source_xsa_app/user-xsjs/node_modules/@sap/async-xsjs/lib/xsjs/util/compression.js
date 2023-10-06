'use strict';

var _ = require('lodash');
var zlib = require('zlib');
var buffUtils = require('../../utils/buffer-utils');
var compressionUtils = require('../../utils/compression-utils');

module.exports = {
  gunzip: function (source) {
    if (!compressionUtils.isWebBodyOrArrayBuffer(source)) {
      throw new Error('gunzip: expected either ArrayBuffer or Request/Response Body argument.');
    }
    var buffer = compressionUtils.extractBuffer(source);
    return buffUtils.toArrayBuffer(zlib.gunzipSync(buffer));
  },

  gzip: function (source) {
    if (!_.isString(source) && !compressionUtils.isWebBodyOrArrayBuffer(source)) {
      throw new Error('gzip: expected either string, ArrayBuffer or Request/Response Body argument.');
    }
    var content = _.isString(source) ? source : compressionUtils.extractBuffer(source);
    return buffUtils.toArrayBuffer(zlib.gzipSync(content));
  }
};
