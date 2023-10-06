'use strict';

var _ = require('lodash');

exports.parse = function(arg) {
  var parsedContent = {};

  if (_.isString(arg)) {
    parseFromString(arg, parsedContent);
  } else if (_.isArray(arg)) {
    parseFromArrayOfStrings(arg, parsedContent);
  } else {
    throw new Error('SetCookieParser: case not supported. Pass either a string or an array.');
  }

  return parsedContent;
};

function parseFromString(str, parsedContent) {
  var result = /([^=]+)=(.*)/.exec(str);
  if (result && result.length === 3) {
    var cookieName = result[1];
    var cookieValue = result[2];
    parsedContent[cookieName] = cookieValue;
  }
}

function parseFromArrayOfStrings(arr, parsedContent) {
  arr.forEach(function(singleCookie) {
    parseFromString(singleCookie, parsedContent);
  });
}
