'use strict';

var _ = require('lodash');
var path = require('path');
var assert = require('assert');
var utils = require('../utils');

module.exports = function xsjsRequire(packagename, rootDirs) {
  assert(_.isString(packagename), 'packagename must be a string');

  var xsjsDir = path.parse(utils.getCallingXsjs(rootDirs)).dir;
  var isLocalFile = ['./', '/', '../'].some(function(prefix) {
    return _.startsWith(packagename, prefix);
  });
  if (isLocalFile) { // We are requiring a file on the system
    return require(path.resolve(xsjsDir, packagename));
  }

  var nodeCache = require.cache[__filename];
  var oldLookupPaths = nodeCache.paths;
  var newLookupPaths = [];
  var systemRoot = path.parse(xsjsDir).root;
  for (;;) {
    if (path.basename(xsjsDir) !== 'node_modules') {
      newLookupPaths.push(path.join(xsjsDir, 'node_modules'));
      if (xsjsDir === systemRoot) {
        break;
      }
    }
    xsjsDir = path.resolve(xsjsDir, '..');
  }

  nodeCache.paths = newLookupPaths;
  try {
    return require(packagename);
  } finally {
    nodeCache.paths = oldLookupPaths;
  }
};
