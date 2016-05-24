'use strict';

var nodemailer = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');
var templates = require('../utils/mail-templates');
var Promise = require('bluebird');

/**
 * Export mail sending function
 */
module.exports.sendRequestNewPasswordMail = sendRequestNewPasswordMail;

function sendRequestNewPasswordMail(language, to, token, doNotSendMail) {
  if (language.toLowerCase() !== 'en' && language.toLowerCase() !== 'fr') {
    language = 'en';
  }
  var subject = templates.newPasswordRequest.subject[language];
  var text = templates.newPasswordRequest.body[language];
  text = text.replace('{{URL}}', process.env.ROOT_PATH + '/forgot-password/reset/' + token);

  var transport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });
  if (doNotSendMail === true) {
    transport = nodemailer.createTransport(stubTransport());
  }

  return _sendMail('Dilemme <benjamin@dilemme.io>', to, subject, text, transport);
}

function _sendMail(from, to, subject, body, transport) {
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: body
  };
  return new Promise(function(resolve, reject) {
    transport.sendMail(mailOptions, function(error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}
