'use strict';

var assert = require('assert');
var _ = require('lodash');
var Action = require('./Action');

module.exports = Job;

function Job (xsjob, urlPath, rootDirs) {
  this._validateXsjob(xsjob);

  if (!urlPath) {
    throw new TypeError('urlPath is required, provide valid value');
  }

  this.action = new Action(xsjob.action, rootDirs);
  this.urlPath = urlPath;
  this.active = true;

  this._xsjob = xsjob;
}

Job.prototype.toSchedulerJob = function(host, jobsCallbackUrl) {
  if (!host) {
    throw new TypeError('Valid host is expected');
  }
  if (!jobsCallbackUrl) {
    throw new TypeError('Jobs callback URL expected');
  }

  var schedules = this._xsjob.schedules.map(function(schedule) {
    return {
      description: schedule.description,
      cron: schedule.xscron,
      data: schedule.parameter,
      active: true
    };
  });

  var jobUrl = _.trimEnd(jobsCallbackUrl, '/') + '/' + _.trimStart(this.urlPath, '/');
  return {
    name: Job.buildName(host, this.urlPath),
    description: this._xsjob.description,
    action: jobUrl,
    schedules: schedules,
    httpMethod: 'POST',
    active: true
  };
};

Job.prototype._validateXsjob = function(xsjob) {
  if (!xsjob) {
    throw new TypeError('xsjob is required, provide valid value');
  }

  if (!xsjob.action) {
    throw new TypeError('Missing action property');
  }

  var schedules = xsjob.schedules;
  if (!Array.isArray(schedules) || schedules.length === 0) {
    throw new TypeError('Missing job schedules');
  }

  for (var i = 0; i < schedules.length; i++) {
    if (!schedules[i].xscron) {
      throw new TypeError('Missing xscron for schedule [' + i + ']');
    }
  }
};

Job.buildName = function(hostName, jobPath) {
  assert(hostName, 'valid hostname expected');
  assert(jobPath, 'Job path expected');

  var host = (hostName.charAt(hostName.length - 1) === '/') ? hostName : (hostName + '/') ;
  var jobName = host + jobPathToName(jobPath);

  return jobName.replace(/[^a-zA-Z0-9._]/g, '_');
};

function jobPathToName(jobPath) {
  assert(jobPath, 'valid path expected');

  var path = (jobPath.charAt(0) === '/') ? jobPath.substr(1) : jobPath;
  var segments = path.split('/');

  var fileName = segments.pop();
  if (segments.length === 0) {
    return fileName;
  }
  var packName = segments.join('.');

  if (fileName.indexOf('.') > -1) {
    return packName + '_' + fileName;
  }

  return packName + '.' + fileName;
}

