'use strict';

var WebBody = require('../xsjs/web/WebBody');
var buffUtils = require('./buffer-utils');

module.exports = {
  isWebBodyOrArrayBuffer: function(parameter) {
    return parameter instanceof WebBody || buffUtils.isArrayBuffer(parameter);
  },

  extractBuffer: function (source) {
    return (source instanceof WebBody) ? buffUtils.bodyToBuffer(source) : buffUtils.toBuffer(source);
  }
};
