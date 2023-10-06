'use strict';

var CRLF = require('../../constants').WEB.MESSAGES.LINE_BREAK;

var ALLOWED_CHARS_FOR_MULTIPART_BOUNDARY = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var MULTIPART_BOUNDARY_LENGTH = 38;

exports.build = function(webEntityResponse, boundary) {
  var state = {
    builtString: '',
    usedBoundaries: [boundary]
  };

  handleEntities(webEntityResponse.entities, boundary, state);

  return state.builtString;
};

function handleEntities(entities, boundary, state) {
  entities.forEach(function(singleEntity) {
    handleEntity(singleEntity, boundary, state);
  });
  state.builtString += '--' + boundary + '--' + CRLF;
}

function handleEntity(entity, boundary, state) {
  state.builtString += '--' + boundary + CRLF;
  handleHeaders(entity.headers, state);

  if (entity.entities.length === 0) {
    state.builtString += CRLF;
    var body = (entity.body ? entity.body.asString() : '');
    state.builtString += body + CRLF;
  } else {
    var newBoundary = generateNewBoundary(state);
    state.builtString += 'content-type: multipart/mixed; boundary=' + newBoundary + CRLF;
    state.builtString += CRLF;
    handleEntities(entity.entities, newBoundary, state);
  }
}

function handleHeaders(headers, state) {
  headers.forEach(function (singleTupelPair) {
    if (!isMultipart(singleTupelPair.name, singleTupelPair.value)) {
      state.builtString += singleTupelPair.name + ': ' + singleTupelPair.value + CRLF;
    }
  });
}

function isMultipart(name, value) {
  return (name === 'content-type' && value.indexOf('multipart') > -1);
}

exports.generateBoundary = function() {
  var generatedBoundary = '';
  var random;
  for (var i = 0; i < MULTIPART_BOUNDARY_LENGTH; i++) {
    random = Math.floor(Math.random() * ALLOWED_CHARS_FOR_MULTIPART_BOUNDARY.length);
    generatedBoundary += ALLOWED_CHARS_FOR_MULTIPART_BOUNDARY.charAt(random);
  }
  return generatedBoundary;
};

function generateNewBoundary(state) {
  var newBoundary;
  var boundaryIsPresentInTheList;
  do {
    newBoundary = exports.generateBoundary();
    boundaryIsPresentInTheList = (state.usedBoundaries.indexOf(newBoundary) > -1);
  } while (boundaryIsPresentInTheList);
  state.usedBoundaries.push(newBoundary);
  return newBoundary;
}
