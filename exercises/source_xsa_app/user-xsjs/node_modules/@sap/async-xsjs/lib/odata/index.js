'use strict';

var serviceFactory = require('./service-factory');
var ODataService = require('./ODataService');

module.exports.createServices = serviceFactory.createServices;
module.exports.ODataService = ODataService;
