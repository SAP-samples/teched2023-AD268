'use strict';

var _ = require('lodash');
var utils = require('../utils');
var fs = require('fs');
var fsPath = require('path');

module.exports = Action;

function Action(actionStr, rootDirs) {
  var parts = actionStr.match(/^([^:]+)(:[^:]+\.xsjs)?:{2}(.+)$/);
  if (!parts) {
    throw new Error('Invalid action. Expected "<package>:<XSJS_Service>.xsjs::function", found: "' + actionStr + '"');
  }

  if (!parts[2]) {
    fileExists(rootDirs, parts[1]) ? this.filename = parts[1] : this.packagename = parts[1];
  } else {
    this.packagename = parts[1];
    this.filename = parts[2].slice(1);
  }
  this.funcname = parts[3];
}

Action.prototype.isJavaScript = function () {
  return !!this.filename;
};

Action.prototype.getScriptPath = function () {
  return utils.toPath(this.packagename, this.filename);
};

function fileExists(dirs, pathname) {
  var dir = _.find(dirs, function (dir) {
    var path = fsPath.join(dir, pathname);
    return fs.existsSync(path) && fs.lstatSync(path).isFile();
  });

  return !!dir;
}
