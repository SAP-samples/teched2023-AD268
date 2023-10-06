'use strict';

var callsite = require('callsite');
var path = require('path');

exports.getCallingXsjs = function () {
  var stack = callsite();
  var frame;
  while ((frame = stack.shift())) {
    var file = frame.getFileName();
    var ext = path.extname(file);
    if (ext === '.xsjs' || ext === '.xsjslib') {
      return file;
    }
  }
};

exports.getCallingXsjsRelativePath = function (rootDirs) {
  var file = this.getCallingXsjs();
  var callingXsjs;
  rootDirs.forEach(function (dir) {
    var isCurrentWorkingDir = path.relative(dir, file).indexOf('..') === -1;
    if (isCurrentWorkingDir) {
      callingXsjs = path.relative(dir, file);
    }
  });
  return callingXsjs;
};