'use strict';

var util = require('util');
var BasicWebEntity = require('./BasicWebEntity');

module.exports = WebEntityResponse;

function WebEntityResponse(arg) {
  BasicWebEntity.call(this, arg);

  this.entities.create = function() {
    var newEntity = new WebEntityResponse();
    this.push(newEntity);
    return newEntity;
  };

}

util.inherits(WebEntityResponse, BasicWebEntity);

WebEntityResponse.create = function(headers, body) {
  var entityResponse = new WebEntityResponse();
  entityResponse.headers._addData(headers);
  entityResponse.setBody(body);
  return entityResponse;
};
