'use strict';

var _ = require('lodash');
var vm = require('vm');
var ctypes = require('./ctypes');

module.exports.create = create;

function create(xsruntime, additionalContext) {
  var sandbox = vm.createContext(_.extend(
    {
      $          : xsruntime,
      ctypes     : ctypes,
      console    : console,
      xsruntime  : xsruntime,
      Uint8Array : Uint8Array // eslint-disable-line no-undef
    }, additionalContext));
  vm.runInContext('\
      if (!Number.isInteger) { Number.isInteger = function(i) { return typeof i === "number"; } };\
      String.prototype.contains   = function(str) {return this.indexOf(str) >=  0;};\
      String.prototype.startsWith = function(str) {return this.indexOf(str) === 0;};\
      String.prototype.endsWith   = function(str) {\
                                                    var l = this.lastIndexOf(str);\
                                                    return l === -1 ?  false : l + str.length === this.length;\
                                                  };\
      [\'Array\',\'String\'].forEach(function(fn) {\
        var obj = eval(fn);\
        Object.getOwnPropertyNames(obj.prototype).filter(function(p) {\
                return typeof obj.prototype[p] === \'function\'}).forEach(function(o)\
                  {\
                    obj[o] = function()\
                    {\
                      var args = Array.prototype.slice.call(arguments);\
                      var f = args.shift();\
                      return obj.prototype[o].apply(f, args);\
                    }\
                  });\
      });', sandbox);
  return sandbox;
}
