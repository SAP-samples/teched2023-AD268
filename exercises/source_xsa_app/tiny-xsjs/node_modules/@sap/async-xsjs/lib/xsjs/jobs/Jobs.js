'use strict';

var Job = require('./Job');
module.exports = Jobs;

// $.jobs
function Jobs(runtime) {
  this.Job = function (constructJob) {
    return new Job(runtime, constructJob);
  };
}
