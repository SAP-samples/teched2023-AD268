'use strict';

var passport = require('passport-strategy');
var util = require('util');

function Strategy() {
  passport.Strategy.call(this);
  this.name = 'anonymous';
}

util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function() {
  this.pass();
};

module.exports = Strategy;