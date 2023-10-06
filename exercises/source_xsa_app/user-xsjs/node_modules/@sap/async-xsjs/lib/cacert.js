'use strict';

var https = require('https');
var assert = require('assert');
var xsenv = require('@sap/xsenv');
var logger = require('./logging').logger;

exports.loadCertificates = loadCertificates;

function loadCertificates(options) {
  assert(!options.ca || Array.isArray(options.ca), 'ca option should be an array');

  // options object is already cloned so it is ok to modify it here
  options.ca = options.ca || xsenv.loadCertificates();
  if (options.ca) {
    https.globalAgent.options.ca = options.ca;
  }

  if (options.hana) {
    if (options.hana.ca || options.hana.certificate) {
      logger.info('Using encrypted HANA connection.');
    } else {
      logger.warn('Using unencrypted HANA connection.');
    }
  }
}
