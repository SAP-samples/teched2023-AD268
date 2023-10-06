'use strict';

var qs = require('querystring');
var contentTypeParser = require('content-type');
var HeadersParser = require('./HeadersParser');
var WebEntityRequest = require('../WebEntityRequest');
var WebEntityResponse = require('../WebEntityResponse');
var CRLF = require('../../constants').WEB.MESSAGES.LINE_BREAK;
var MESSAGE_TYPE = require('../../constants').WEB.MESSAGE_TYPE;


exports.parseFromBuffer = function(inputBuffer, boundary, targetBasicWebEntity, messageType) {
  var inputString = inputBuffer ? inputBuffer.toString('utf8') : '';
  exports.parse(inputString, boundary, targetBasicWebEntity, messageType);
};

exports.parse = function(inputString, boundary, targetBasicWebEntity, messageType, coordinates) {
  if (!coordinates) {
    coordinates = [{level: 1}];
  }

  var state = {
    currentState : inputString,
    boundary : '--' + boundary,
    closingBoundary : '--' + boundary + '--',
    targetBasicWebEntity : targetBasicWebEntity,
    messageType : messageType,
    coordinates : coordinates
  };

  separateParts(state);
  handleParts(state);
};

function separateParts(state) {
  removeFirstBoundaryAndBefore(state);
  removeLastBoundaryAndAfter(state);
  state.currentState = state.currentState.split(CRLF + state.boundary + CRLF);
}

function removeFirstBoundaryAndBefore(state) {
  var searchFor = state.boundary + CRLF;
  var foundAt = state.currentState.indexOf(searchFor);
  if (foundAt < 0) {
    throw new Error(buildErrorMessage(state) + ' Could not find encapsulation boundary (' + state.boundary + ') followed by a CRLF in the multipart body');
  }
  state.currentState = state.currentState.substring(foundAt + searchFor.length);
}

function removeLastBoundaryAndAfter(state) {
  var searchFor = CRLF + state.closingBoundary;
  var foundAt = state.currentState.indexOf(searchFor);
  if (foundAt < 0) {
    throw new Error(buildErrorMessage(state) + ' Could not find closing boundary (' + state.closingBoundary + ') preceded by a CRLF');
  }
  state.currentState = state.currentState.substring(0, foundAt);
}

function handleParts(state) {
  for (var i = 0; i < state.currentState.length; i++) {
    handleSinglePart(state, state.currentState[i], i + 1);
  }
}

function handleSinglePart(state, strSinglePart, partNumber) {
  var coordinatesLastElement = state.coordinates[state.coordinates.length - 1];
  coordinatesLastElement.part = partNumber;

  var parsedHeaders = parseHeaders(state, strSinglePart);
  var parsedBody = parseBody(strSinglePart);
  var parsedParameters = parseParameters(state, parsedHeaders, parsedBody);

  if (thereAreNestedEntities(parsedHeaders)) {
    var containerEntity;

    if (state.messageType === MESSAGE_TYPE.REQUEST) {
      containerEntity = new WebEntityRequest();
      containerEntity.parameters._addData(parsedParameters);
    } else {
      containerEntity = new WebEntityResponse();
    }

    containerEntity.headers._addData(parsedHeaders);
    containerEntity.body = undefined;
    state.targetBasicWebEntity.entities.push(containerEntity);

    var boundary = extractBoundaryFromString(state, parsedHeaders);
    var newCoordinates = state.coordinates.slice();
    newCoordinates.push({ level: coordinatesLastElement.level + 1 });
    exports.parse(parsedBody, boundary, containerEntity, state.messageType, newCoordinates);
  } else {
    if (state.messageType === MESSAGE_TYPE.REQUEST) {
      state.targetBasicWebEntity.entities.push(WebEntityRequest.create(parsedHeaders, parsedParameters, parsedBody));
    } else {
      state.targetBasicWebEntity.entities.push(WebEntityResponse.create(parsedHeaders, parsedBody));
    }
  }
}

function parseHeaders(state, strSinglePart) {
  var areThereHeaders = strSinglePart.indexOf(CRLF) !== 0;
  if (areThereHeaders) {
    var endOfHeadersSection = strSinglePart.indexOf(CRLF + CRLF);
    if (endOfHeadersSection < 0) {
      throw new Error(buildErrorMessage(state) + ' There should be a blank line between the headers and the body. Providing a body (empty one is also acceptable) is mandatory');
    }
    var headersSection = strSinglePart.substring(0, endOfHeadersSection);
    return HeadersParser.parse(headersSection);
  } else {
    return {};
  }
}

function parseBody(strSinglePart) {
  var areThereHeaders = strSinglePart.indexOf(CRLF) !== 0;
  if (areThereHeaders) {
    // here we rely that 'parseHeaders' has checked that there is a blank line between headers and body
    var startOfBody = strSinglePart.indexOf(CRLF + CRLF) + CRLF.length + CRLF.length;
    return strSinglePart.substring(startOfBody);
  } else {
    return strSinglePart.substring(CRLF.length);
  }
}

function parseParameters(state, parsedHeaders, parsedBody) {
  if (state.messageType === MESSAGE_TYPE.RESPONSE) {
    return {};
  }
  if (parsedHeaders['content-type'] === 'application/x-www-form-urlencoded') {
    return qs.parse(parsedBody);
  } else {
    return {};
  }
}

function thereAreNestedEntities(parsedHeaders) {
  var contentType = parsedHeaders['content-type'];
  if (!contentType) {
    return false;
  }
  return (contentType.indexOf('multipart') > -1);
}

function extractBoundaryFromString(state, parsedHeaders) {
  var contentType = parsedHeaders['content-type'];
  var boundary = contentTypeParser.parse(contentType).parameters.boundary;
  if (!boundary) {
    throw new Error(buildErrorMessage(state) + ' No boundary parameter found on header Content-Type (' + contentType + ')');
  }
  return boundary;
}

function buildErrorMessage(state) {
  var str = 'Error in multipart message: ';
  state.coordinates.forEach(function(coordinate) {
    str += 'level ' + coordinate.level;
    if (coordinate.part) {
      str += ', part ' + coordinate.part;
    }
    str += '; ';
  });
  return str;
}
