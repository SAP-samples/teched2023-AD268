'use strict';

var os = require('os');


module.exports = AppConfig;

function AppConfig(port) {
  var vcapApplication = process.env.VCAP_APPLICATION && JSON.parse(process.env.VCAP_APPLICATION);

  this.port = port || process.env.PORT;
  this.host = cfHost(vcapApplication) || os.hostname(); // may contain port if running on the tub
  this.url = getAppUrl(vcapApplication, this.port);
}

function cfHost(vcapApplication) {
  if (vcapApplication) {
    var uris = vcapApplication.uris;
    if (uris.length > 0 && uris[0]) {
      return uris[0];
    }
  }
}

function getAppUrl(vcapApplication, port) {
  if (vcapApplication) {
    if (vcapApplication.full_application_uris && vcapApplication.full_application_uris[0]) {
      return vcapApplication.full_application_uris[0];
    }
    if (vcapApplication.uris && vcapApplication.uris[0]) {
      return 'https://' + vcapApplication.uris[0];
    }
  }

  return os.hostname() + ':' + port;
}
