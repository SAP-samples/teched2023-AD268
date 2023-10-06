'use strict';

var util = require('util');
var moment = require('moment');

// This is a workaround for the output that moment js produces when you try to instantiate a Javascript specific date via the moment constructor.
moment.createFromInputFallback = function(config) {
  config._d = new Date(NaN);
};

exports.formatDate = function(date) {
  // see node_modules/hdb/lib/protocol/Writer.js for the expected format
  return zpad(date.getFullYear(), 4) + '-' + zpad(date.getMonth() + 1, 2) + '-' + zpad(date.getDate(), 2);
};

exports.formatTime = function(date) {
  // see node_modules/hdb/lib/protocol/Writer.js for the expected format
  return zpad(date.getHours(), 2) + ':' + zpad(date.getMinutes(), 2) + ':' +
    zpad(date.getSeconds(), 2);
};

exports.formatDateTime = function(date) {
  // see node_modules/hdb/lib/protocol/Writer.js for the expected format
  return exports.formatDate(date) + 'T' + exports.formatTime(date) + '.' + zpad(date.getMilliseconds(), 3);
};

exports.parseDateTime = function(value, format) {
  if (!format && isAbabFormat(value)) {
    format = 'YYYYMMDD';
  }

  if (format) {
    // Change the format if it is HANA Specific so that moment understands it.
    var HANA_TO_MOMENTJS_MAPPING = {
      // RM not supported !!! W and WW are not supported !!!
      MM: 'M',
      DD: 'D',
      MONTH: 'MMMM',
      MON: 'MMM',
      HH24: 'H',
      HH12: 'h',
      MI: 'm',
      SS: 's',
      AM: 'A',
      PM: 'A'
    };

    Object.keys(HANA_TO_MOMENTJS_MAPPING).forEach(function(hanaFormat) {
      var momentFormat = HANA_TO_MOMENTJS_MAPPING[hanaFormat];
      format = format.replace(hanaFormat, momentFormat);
    });

    // Fractional seconds. Example: HH:MI:SS.FFX, where X e {1, 2, ..., 7}. NOTE: In XS1 X represented the digits of fractional second. In XS Advanced they are always 3 digit.
    format = format.replace(/FF\d/, 'SSS');

    var momentDate = moment(value, format);
    if (!momentDate.isValid()) {
      throw new TypeError(util.format('Provided timestamp value: %s does not match the given format: %s or invalid format.', value, format));
    }

    return momentDate.toDate();
  }

  // Do not allow hours like '14:00:00 PM'. Note: third part of expression produces moment js output.
  if (isNaN(Date.parse(value)) && value.indexOf('T') < 0 && !moment(value).isValid()) {
    throw new TypeError(util.format('Provided timestamp value: %s is not valid.', value));
  }

  var separators = findDateSeparators(value);
  // If date is DD MM YYYY, which is moment js specific, switch it to YYYY MM DD
  value = exchangeYearAndDate(separators, value);

  // If timestamp is not moment specific we can't just pass it to the moment constructor, so we need format.
  if (!timestampIsMomentSpecific(value)) {
    format = 'Y' + separators[0] + 'M' + separators[1] + 'D h:m:s.SSS A';
  }

  return moment(value, format).toDate();
};


// ABAP Data Type, DATS format is in form YYYYMMDD
var ABAP_TIMESTAMP_LENGTH = 8;

function isAbabFormat(value) {
  var eightDigits = new RegExp('\\d{' + ABAP_TIMESTAMP_LENGTH + '}');

  return (value.length === ABAP_TIMESTAMP_LENGTH && eightDigits.test(value));
}

function findDateSeparators(timestamp) {
  var index = 0;
  var separators = [];

  while (separators.length < 2) {
    var currentChar = timestamp[index];
    // If the char at this position is separator
    if (currentChar === '-' || currentChar === '/') {
      separators.push(currentChar);
    }
    index++;
  }
  return separators;
}

function exchangeYearAndDate(separators, timestamp) {
  var separatorIndexes = [timestamp.indexOf(separators[0]), timestamp.lastIndexOf(separators[1]) + 1];
  var dateLastIndex = timestamp.split(' ')[0].split('T')[0].length;
  var newTimestamp = timestamp;

  var year = timestamp.slice(separatorIndexes[1], dateLastIndex);
  if (year.length > 2) {
    var month = timestamp.slice(separatorIndexes[0], separatorIndexes[1]);
    var day = timestamp.slice(0, separatorIndexes[0]);
    var restOfTheTimestamp = timestamp.slice(dateLastIndex);

    newTimestamp = year + month + day + restOfTheTimestamp;
  }
  return newTimestamp;
}

function timestampIsMomentSpecific(timestamp) {
  var momentSpecificCharacters = ['+', 'W', 'Z'];
  var isMomentSpecific = false;
  momentSpecificCharacters.forEach(function(character) {
    if (timestamp.indexOf(character) > -1) {
      isMomentSpecific = true;
    }
  });
  return isMomentSpecific;
}

function zpad(n, digits) {
  var s = n + '';
  while (s.length < digits) {
    s = '0' + s;
  }
  return s;
}
