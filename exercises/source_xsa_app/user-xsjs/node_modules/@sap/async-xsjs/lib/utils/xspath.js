'use strict';

var util = require('util');

exports.toResourceId = function (pathname) {
  var pos = pathname.lastIndexOf('.');
  if (pos < 0) {
    throw new Error('File without extension: ' + pathname);
  }
  return pathname.substring(1, pos).replace(/\/|\\/g, '.');
};


exports.toPath = function (packagename, filename) {
  var normalizedPackage = packagename ? ('/' + packagename.replace(/\./g, '/')) : '';
  return util.format('%s/%s', normalizedPackage,  filename || '');
};

exports.toXSObjectId = function (packagename, objectname) {
  if (typeof packagename !== 'string') {
    throw new TypeError('Packagename should be a string and is required to build XS object ID');
  }

  if (objectname && (typeof objectname !== 'string')) {
    throw new TypeError('Object name provided to build XS object ID is not a string');
  }

  var packName = packagename.trim();
  var objName = (objectname) ? objectname.trim() : '';

  if (packName && objName) {
    return packName + '.' + objName;
  }

  return packName;
};
