'use strict';

// http://help.sap.com/saphelp_hanaplatform/helpdata/en/6e/fe500d91ee462c85cce7609646e17a/content.htm?frameset=/en/34/29fc63a1de4cd6876ea211dc86ee54/frameset.htm&current_toc=/en/34/29fc63a1de4cd6876ea211dc86ee54/plain.htm&node_id=82&fullscreen=true
var _ = require('lodash');

module.exports = Destination;

/**
 * According to SPS10 documentation here is a list of properties destinations can have:
 *
 * host = "download.finance.yahoo.com";
 * port = 80;
 * //All of the following keywords are optional
 * description = "";
 * useSSL = false;
 * sslAuth = client;
 * sslHostCheck = true;
 * pathPrefix = "/d/quotes.csv?f=a";
 * authType = none;
 * samlProvider = "";
 * samlACS = "header";
 * samlAttributes = "";
 * samlNameId = ["email"];
 * proxyType = none;
 * proxyHost = ""; //in-line comments are allowed
 * proxyPort = 0;
 * timeout = 0;
 * remoteSID = "Q7E";
 * remoteClient = "007";
 * oAuthAppConfigPackage = "sap.hana.test";
 * oAuthAppConfig = "abapTest";
 *
 * @param options
 */

function Destination(options) {
  this.host = '';
  this.port = 80;
  this.description = '';
  this.timeout = 10000;

  _.extend(this, options);
}
