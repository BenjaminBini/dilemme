'use strict';

var encrypt = require('../utils/encryption');
var validator = require('validator');

/**
 * User instance methods
 */
exports.methods = {
  toJSON: toJSON,
  authenticate: authenticate,
  hasRole: hasRole,
  populateUser: populateUser
};

/**
 * User statics methods
 */
exports.statics = {
  validate: validate
};

/**
 * Override "toJSON" method to hide hashedPassword
 */
function toJSON(options) {
  var user = this.toObject(options);
  delete user.hashedPassword;
  delete user.salt;
  delete user.resetPasswordToken;
  if (!!user.facebookId) {
    user.hasFacebook = true;
  }
  if (!!user.twitterId) {
    user.hasTwitter = true;
  }
  if (!!user.googleId) {
    user.hasGoogle = true;
  }
  delete user.facebookId;
  delete user.twitterId;
  delete user.googleId;
  return user;
}

/**
 * Check if the password is correct
 */
function authenticate(passwordToMatch) {
  return encrypt.hashPassword(this.salt, passwordToMatch) === this.hashedPassword;
}

/**
 * Check if the user has the given role
 */
function hasRole(role) {
  return this.roles.indexOf(role) > -1;
}

/**
 * Populate the user with its answers questions
 */
function populateUser() {
  var User = require('mongoose').model('User');
  var user = this;
  return User.populate(user, [{
    path: 'answers.question',
    model: 'Question'
  }]);
}

/**
 * Validate data for a user
 */
function validate(user) {
  return new Promise(function(resolve, reject) {
    var reason;
    if (validator.isEmail(user.username)) {
      reason = 'USERNAME_IS_EMAIL';
    } else if (!validator.isLength(user.email, 1, 150)) {
      reason = 'EMAIL_TOO_LONG';
    } else if (!validator.isEmail(user.email)) {
      reason = 'EMAIL_NOT_VALID';
    } else if (!validator.isLength(user.username, 1, 70)) {
      reason = 'USERNAME_TOO_LONG';
    }
    if (reason === undefined) {
      resolve(user);
    }  else {
      reject(new Error(reason));
    }
  });
}
  }
  return err;
}
