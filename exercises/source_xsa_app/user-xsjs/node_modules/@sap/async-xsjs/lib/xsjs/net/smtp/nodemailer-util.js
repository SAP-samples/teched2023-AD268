'use strict';

var assert = require('assert');
var Part = require('./Part');
var util = require('util');
var buffUtils = require('../../../utils/buffer-utils');

function getDataAsStringAndEncoding(data) {
  var partDataAsString = '';
  var encoding = null;
  if (data) {
    if (typeof data === 'string') {
      partDataAsString = data;
    } else {
      partDataAsString = buffUtils.toBuffer(data).toString('base64');
      encoding = 'base64';
    }
  }
  return { data: partDataAsString, encoding: encoding };
}

function getAttachment(part, isInline) {
  var partDataAsStringAndEncoding = getDataAsStringAndEncoding(part.data);
  var attachment = {
    filename: part.fileName || '',
    content: partDataAsStringAndEncoding.data || '',
    contentType: part.contentType || '',
    encoding: partDataAsStringAndEncoding.encoding
  };
  if (isInline) {
    attachment.cid = part.contentId || '';
    attachment.contentDisposition = 'inline';
  }
  return attachment;
}

exports.toNodemailerMail = function (mail) {
  assert(mail.constructor.name === 'Mail', 'Not a mail object: ' + mail);
  assert(mail.sender, 'Mail.send(): missing sender');
  assert(mail.to || mail.cc || mail.bcc, 'Mail.send(): missing recipients');
  var mailOptions = {
    from: mail.sender,
    to: mail.to,
    cc: mail.cc,
    bcc: mail.bcc,
    subject: mail.subject || '',
    attachments: [],
    alternatives: [],
    html: ''
  };

  if (mail.parts && util.isArray(mail.parts)) {
    mail.parts.forEach(function (part) {
      if (part.type === Part.TYPE_TEXT) {
        var alternatives = [];
        if (part.contentType === 'text/html') {
          mailOptions.html = part.text;
        } else {
          mailOptions.text = part.text;
        }
        if (part.alternative) {
          alternatives.push({ content: part.alternative, contentType: part.alternativeContentType || 'text/plain' });
        }
        if (alternatives) {
          mailOptions.alternatives = alternatives;
        }
      } else if (part.type === Part.TYPE_ATTACHMENT) {
        mailOptions.attachments.push(getAttachment(part, false));
      } else if (part.type === Part.TYPE_INLINE) {
        mailOptions.attachments.push(getAttachment(part, true));
      } else {
        throw new Error('Part.type cannot be: ' + part.type);
      }
    });
  }
  return mailOptions;
};
