'use strict';

var TextBundle = require('@sap/textbundle').TextBundle;
var utils = require('../utils');
var nodeUtils = require('util');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

module.exports = TextBundleWrapperFactory;

function TextBundleWrapperFactory(xsRootDirs) {
  assert(nodeUtils.isArray(xsRootDirs), 'Invalid root dirs parameter provided, array of directories expected');
  this._xsRootDirs = xsRootDirs;
}

TextBundleWrapperFactory.prototype.loadBundle = function(sapPackage, file, locale) {
  var modifiedPath;
  var textBundlePath;
  var i = 0;

  for (i = 0; i < this._xsRootDirs.length; i++) {
    modifiedPath = path.join(this._xsRootDirs[i], utils.toPath(sapPackage, file));
    if (fs.existsSync(modifiedPath + '.hdbtextbundle')) {
      textBundlePath = modifiedPath + '.hdbtextbundle';
    } else if (fs.existsSync(modifiedPath + '.properties')) {
      textBundlePath = modifiedPath + '.properties';
    }
  }
  assert(textBundlePath, 'Could not find bundle ' + file + ' in package ' + sapPackage);
  return new TextBundleWrapper(new TextBundle({ path: textBundlePath, locale: locale }));
};

function TextBundleWrapper(textBundle) {
  this.textBundle = textBundle;
}

TextBundleWrapper.prototype.getText = function(key, args) {
  var params = args;
  if (typeof args === 'object' && !nodeUtils.isArray(args)) {
    params = Object.keys(args).sort().map(function(element) {
      return args[element];
    });
  }
  return this.textBundle.getText(key, params);
};
