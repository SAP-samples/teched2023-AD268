'use strict';

var xspath = require('./xspath');
exports.toResourceId = xspath.toResourceId;
exports.toPath = xspath.toPath;
exports.toXSObjectId = xspath.toXSObjectId;

var callstack = require('./xsstack');
exports.getCallingXsjs = callstack.getCallingXsjs;
exports.getCallingXsjsRelativePath = callstack.getCallingXsjsRelativePath;

var xsjsrunner = require('./xs-function-runner');
exports.runXsFunction = xsjsrunner.runXsFunction;
exports.createXsFunctionThisArg = xsjsrunner.createXsFunctionThisArg;

exports.XsJsFunctionRunner = require('./XsJsFunctionRunner');
exports.XsJsLibFunctionRunner = require('./XsJsLibFunctionRunner');
