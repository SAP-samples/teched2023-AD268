'use strict';

var MiningSession = require('./mining/Session');
var AnalysisSession = require('./analysis/Session');

exports.create = createTextObject;


function createTextObject($db) {
  return {
    mining: createMiningObject($db),
    analysis: createAnalysisObject($db)
  };
}

function createMiningObject($db) {
  return {
    Session: function (params) {
      return new MiningSession($db, params);
    }
  };
}

function createAnalysisObject($db) {
  return {
    Session: function (params) {
      return new AnalysisSession($db, params);
    }
  };
}
