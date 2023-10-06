'use strict';

var vsi = require('@sap/node-vsi');
var buffUtils = require('../../utils/buffer-utils');

module.exports = AntiVirus;

function AntiVirus(profile) {
  var vsiProfile = vsi.vsiProfile;
  profile = typeof profile !== 'undefined' ? profile : '';
  this.av = new vsiProfile(profile);
  if (this.av.getLastError() !== '') {
    this.isAvAvailable = false;
    return;
  }
  this.isAvAvailable = true;
}

AntiVirus.prototype.isAvailable = function() {
  return this.isAvAvailable;
};

AntiVirus.prototype.scan = function(data, name) {
  data = buffUtils.getData(data).toString('binary');
  name = name || 'binary';
  var rc = this.av.scanBytes(name, data, data.length);
  if (rc !== 0) {
    throw new Error(this.av.getLastError());
  }
  return true;
};
