'use strict';
var Mail = require('./Mail');
var Part = require('./Part');
var SMTPConnection = require('./SMTPConnection');

exports.createMail = function (settings) {
  var mail = function(mailObjectOpt) {
    return new Mail(settings, mailObjectOpt);
  };
  Object.defineProperty(mail, 'Part', {value: Part});
  return mail;
};

exports.createSMTPConnection = function (settings) {
  return function() {
    return new SMTPConnection(settings);
  };
};
