'use strict';

/**
 * Users service
 */
var User = require('mongoose').model('User');
var encrypt = require('../utils/encryption');
var mailer = require('../utils/mailer');
var validator = require('validator');
var Promise = require('bluebird');

/**
 * Module interface
 */
module.exports = {
  getUsers: getUsers,
  getUserById: getUserById,
  getUsersByAnsweredQuestion: getUsersByAnsweredQuestion,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUserWithStats: getUserWithStats,
  requestNewPassword: requestNewPassword,
  resetPassword: resetPassword
};

/**
 * Return array of all users
 */
function getUsers() {
  return User.find({});
}

/**
 * Return the user with the given id
 */
function getUserById(userId) {
  return User.findOne({_id: userId})
    .then(function(user) {
      if (!user) {
        throw new Error('USER_DOES_NOT_EXIST');
      }
      return user;
    })
    .then(user => user.populateUser());
}

/**
 * Return the list of users who answered a question
 */
function getUsersByAnsweredQuestion(questionId) {
  return User.find({'answers.question': questionId});
}

/**
 * Create a new user
 */
function createUser(userData, facebookId, twitterId, googleId) {
  // Encrypt password
  userData.salt = encrypt.createSalt();
  if (facebookId || twitterId || googleId) { // If registration from social network
    userData.password = encrypt.createToken();
  }
  if (userData.password) {
    userData.hashedPassword = encrypt.hashPassword(userData.salt, userData.password);
  }
  if (facebookId) {
    userData.facebookId = facebookId;
  }
  if (twitterId) {
    userData.twitterId = twitterId;
  }
  if (googleId) {
    userData.googleId = googleId;
  }

  // Create user
  return User.validate(userData)
    .then(userData => User.create(userData))
    .catch(function(err) {
      var reason = err.message;
      if (reason.indexOf('E11000') > -1) {
        if (reason.indexOf('username') > -1) {
          reason = 'USERNAME_ALREADY_EXISTS';
        } else if (reason.indexOf('email') > -1) {
          reason = 'EMAIL_ALREADY_EXISTS';
        }
      }
      throw new Error(reason);
    });
}

/**
 * Update a user
 */
function updateUser(updatedUser, userId) {
  return User.validate(updatedUser)
    .then(() => User.findOne({_id: userId}))
    .then(function(user) {
      if (!user) {
        throw new Error('USER_DOES_NOT_EXIST');
      }
      user.username = updatedUser.username;
      user.email = updatedUser.email;
      // If needed, generate new hashed password
      if (updatedUser.password && updatedUser.password.length > 0) {
        user.salt = encrypt.createSalt();
        user.hashedPassword = encrypt.hashPassword(user.salt, updatedUser.password);
      }
      return user.save();
    })
    .then(user => user.populateUser())
    .catch(function(err) {
      var reason = err.message;
      // If the error is E11000, the reason is a duplicate username or email
      if (reason.indexOf('E11000') > -1) {
        if (reason.indexOf('username') > -1) {
          reason = 'USERNAME_ALREADY_EXISTS';
        }
        if (reason.indexOf('email') > -1) {
          reason = 'EMAIL_ALREADY_EXISTS';
        }
      }
      throw new Error(reason);
    });
}

/**
 * Delete a user
 */
function deleteUser(userId) {
  return User.remove({_id: userId});
}

/**
  * Return user with his stats
  */
function getUserWithStats(userId) {
  return User.findOne({_id: userId})
    .then(user => user.populateUser())
    .then(user => user.toJSON({virtuals: true}));
}

/**
 * Send a mail to the user with a link to set a new password
 */
function requestNewPassword(username, language) {
  // Try to find the concerned user
  var criteria = validator.isEmail(username) ? {email: username} : {username: username};
  // Create the token
  var token = encrypt.createToken();
  return User.findOne(criteria)
    .then(function(user) {
      if (!user) {
        throw new Error('USER_DOES_NOT_EXIST');
      }
      user.resetPasswordToken = token;
      user.resetPasswordExpire = Date.now() + (1000 * 60 * 60 * 2); // 2 hours in the future
      return user.save();
    })
    .then(function(user) {
      return mailer.sendRequestNewPasswordMail(language, user.email, token);
    });
}

/**
 * Reset the password of the user if he provides the right token
 */
function resetPassword(newPassword, token) {
  if (token === undefined || token.length === 0 || !validator.isHexadecimal(token)) {
    return Promise.reject(new Error('INVALID_TOKEN'));
  }
  return User.findOne({resetPasswordToken: token})
    .then(function(user) {
      if (!user || Date.now() >= user.resetPasswordExpire) {
        throw new Error('INVALID_TOKEN');
      }
      user.salt = encrypt.createSalt();
      user.hashedPassword = encrypt.hashPassword(user.salt, newPassword);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      return user;
    })
    .then(user => User.validate(user))
    .then(user => user.save())
    .then(user => user.populateUser());
}
