'use strict';

/**
 * Users controller
 */
var Promise = require('bluebird');
var userService = require('../services/user.service');

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
  getUserStats: getUserStats,
  requestNewPassword: requestNewPassword,
  resetPassword: resetPassword
};

/**
 * Return array of all users
 */
function getUsers(req, res, next) {
  userService.getUsers()
    .then(users => res.send(users))
    .catch(err => next(err));
}

/**
 * Return the user with the given id
 */
function getUserById(req, res, next) {
  var userId = req.params.id;
  userService.getUserById(userId)
    .then(user => res.send(user))
    .catch(err => next(err));
}

/**
 * Return the list of users who answered a question
 */
function getUsersByAnsweredQuestion(req, res, next) {
  var questionId = req.params.questionId;
  userService.getUsersByAnsweredQuestion(questionId)
    .then(users => res.send(users))
    .catch(err => next(err));
}

/**
 * Create a new user
 */
function createUser(req, res, next) {
  var facebookId = req.session.facebookId;
  var twitterId = req.session.twitterId;
  var googleId = req.session.googleId;
  var userData = req.body;
  userService.createUser(userData, facebookId, twitterId, googleId)
  .then(function(user) {
    // Log the user (promisify the passport function)
    return new Promise(function(resolve, reject) {
      req.logIn(user, function(err) {
        if (err) {
          reject(err);
        } else {
          // Empty session values
          req.session.googleId = req.session.twitterId = req.session.facebookId = undefined;
          resolve(user);
        }
      });
    });
  })
  .then(user => res.send(user))
  .catch(err => next(err));
}

/**
 * Update a user
 */
function updateUser(req, res, next) {
  var userId = req.params.id;
  var currentUser = req.user;
  var updatedUser = req.body;
  // Check if the user is authorized (admin or current user)
  if (currentUser._id != userId && !currentUser.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.end();
  }

  userService.updateUser(updatedUser, userId)
    .then(function(user) {
      // If the modified user is the logged in user, let's reset it
      if (currentUser._id == userId) { // jshint ignore:line
        req.user = user;
      }
    })
    .then(user => res.send(user))
    .catch(err => next(err));
}

/**
 * Delete a user
 */
function deleteUser(req, res, next) {
  var userId = req.params.id;
  userService.deleteUser(userId)
    .then(() => res.send(userId))
    .catch(err => next(err));
}

/**
  * Return user with his stats
  */
function getUserStats(req, res, next) {
  var userId = req.params.id;
  // Check if the user is authorized (admin or current user)
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.end();
  }
  userService.getUserStats(userId)
    .then(user => res.send(user))
    .catch(err => next(err));
}

/**
 * Send a mail to the user with a link to set a new password
 */
function requestNewPassword(req, res) {
  var username = req.params.username;
  var language = (!!req.body.language && req.body.language.length === 2) ? req.body.language : 'en';

  userService.requestNewPassword(username, language)
    .then(() => res.send({
      newPasswordSent: true
    }))
    .catch(() => res.send({
      newPasswordSent: false
    }));
}

/**
 * Reset the password of the user if he provides the right token
 */
function resetPassword(req, res, next) {
  var newPassword = req.body.newPassword;
  var token = req.body.token;

  userService.resetPassword(newPassword, token)
    .then(function(user) {
      req.password = newPassword;
      req.email = user.email;
      return new Promise(function(resolve, reject) {
        req.logIn(user, function(err) {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });
    })
    .then(user => res.send(user))
    .catch(err => next(err));
}
