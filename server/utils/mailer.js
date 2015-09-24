var nodemailer = require('nodemailer');
var templates = require('../utils/mail-templates');
var Deferred = require('promised-io/promise').Deferred;

exports.sendRequestNewPasswordMail = function(language, to, token) {
  var subject = templates.newPasswordRequest.subject[language];
  var text = templates.newPasswordRequest.body[language];
  text = text.replace('{{URL}}', process.env.ROOT_PATH + '/forgot-password/reset/' + token);
  return sendMail('Dilemme <benjamin@dilemme.io>', to, subject, text);
};

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

function sendMail(from, to, subject, body) {
  var q = new Deferred();
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: body
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      q.reject(error);
    } else {
      q.resolve(info);
    }
  });
  return q.promise;
}
