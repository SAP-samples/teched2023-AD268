'use strict';

var CRLF = require('../../constants').WEB.MESSAGES.LINE_BREAK;


exports.parse = function(headersSection) {
  var parsedHeaders = {};

  var arrLines = headersSection.split(CRLF);
  handleHeaderLines(arrLines, parsedHeaders);

  return parsedHeaders;
};

function handleHeaderLines(arrLines, parsedHeaders) {
  var singleLine;
  var isPartOfMultilineHeader;

  for (var i = arrLines.length - 1; i >= 0; i--) {
    singleLine = arrLines[i];
    isPartOfMultilineHeader = (singleLine.indexOf(' ') === 0) && (i > 0);

    if (isPartOfMultilineHeader) {
      singleLine = collapseSpacesAtTheFrontToJustOne(singleLine);
      var indexOfLineForAddingTheCurrentLineTo = i - 1;
      arrLines[indexOfLineForAddingTheCurrentLineTo] += singleLine;
      continue;
    }
    parseHeaderString(singleLine, parsedHeaders);
  }
}

function collapseSpacesAtTheFrontToJustOne(str) {
  return str.replace(/[ ]+/, ' ');
}

function parseHeaderString(str, parsedHeaders) {
  var result = /([^:]+):(.*)/.exec(str);
  if (result && result.length === 3) {
    var name = result[1].trim().toLowerCase();
    var value = result[2].trim();
    var existingValue = parsedHeaders[name];
    if (!existingValue) {
      parsedHeaders[name] = value;
    } else if (typeof existingValue === 'string') {
      parsedHeaders[name] = [existingValue];
      parsedHeaders[name].unshift(value);
    } else {
      // it is an array
      parsedHeaders[name].unshift(value);
    }
  }
}
