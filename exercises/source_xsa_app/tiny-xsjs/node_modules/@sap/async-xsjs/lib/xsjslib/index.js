'use strict';

var TextBundleWrapper = require('./TextBundleWrapper');
var sqlInjectionUtils = require('@sap/hdbext').sqlInjectionUtils;

module.exports = function(xsruntime) {
  return {
    'sap.hana.xs.i18n.text' : new TextBundleWrapper(xsruntime.settings.rootDirs),
    'sap.hana.admin.common.lib.SQLInjectionUtils' : sqlInjectionUtils
  };
};
