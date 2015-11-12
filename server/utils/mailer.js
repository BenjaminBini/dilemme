'use strict';

var nodemailer = require('nodemailer');
var templates = require('../utils/mail-templates');
var Promise = require('bluebird');

/**
 * Export mail sending function
 */
module.exports.sendRequestNewPasswordMail = sendRequestNewPasswordMail;

function sendRequestNewPasswordMail(language, to, token) {
  var subject = templates.newPasswordRequest.subject[language];
  var text = templates.newPasswordRequest.body[language];
  text = text.replace('{{URL}}', process.env.ROOT_PATH + '/forgot-password/reset/' + token);
  return _sendMail('Dilemme <benjamin@dilemme.io>', to, subject, text);
}

function _sendMail(from, to, subject, body) {
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: body
  };
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  });
  return new Promise(function(resolve, reject) {
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}
