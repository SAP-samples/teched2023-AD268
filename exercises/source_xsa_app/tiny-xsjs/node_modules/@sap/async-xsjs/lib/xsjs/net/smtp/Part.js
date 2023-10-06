'use strict';
module.exports = Part;

function Part(partObjectOpt) {
  this.alternative = partObjectOpt && partObjectOpt.alternative || '';
  this.alternativeContentType = partObjectOpt && partObjectOpt.alternativeContentType || '';
  this.contentId = partObjectOpt && partObjectOpt.contentId || '';
  this.contentType = partObjectOpt && partObjectOpt.contentType || '';
  this.data = partObjectOpt && partObjectOpt.data || '';
  this.encoding = partObjectOpt && partObjectOpt.encoding || '';
  this.fileName = partObjectOpt && partObjectOpt.fileName || '';
  this.fileNameEncoding = partObjectOpt && partObjectOpt.fileNameEncoding || 'UTF-8';
  this.text = partObjectOpt && partObjectOpt.text || '';
  this.type = partObjectOpt && partObjectOpt.type || Part.prototype.TYPE_TEXT;
}

Object.defineProperties(Part, {
  TYPE_TEXT: {
    value: 'text',
    enumerable: true
  },
  TYPE_ATTACHMENT: {
    value: 'attachment',
    enumerable: true
  },
  TYPE_INLINE: {
    value: 'inline',
    enumerable: true
  }
});
