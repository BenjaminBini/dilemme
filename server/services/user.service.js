/**
 * User service
 */
var User = require('mongoose').model('User');
var encrypt = require('../utils/encryption');
var mailer = require('../utils/mailer');
var validator = require('validator');

/**
 * Return array of all users
 */
exports.getUsers = function(req, res, next) {
  User.find({}).exec(function(err, collection) {
    if (err) {
      return next(err);
    }
    res.send(collection);
    return collection;
  });
};

/**
 * Return the user with the given id
 */
exports.getUserById = function(req, res, next) {
  User.findOne({_id: req.params.id}).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    user.populateUser().then(function() {
      res.send(user);
    });
  });
};

/**
 * Create a new user
 */
exports.createUser = function(req, res, next) {
  // Get the user data from the request
  var userData = req.body;
  // Encrypt password
  userData.salt = encrypt.createSalt();
  userData.hashedPassword = encrypt.hashPassword(userData.salt, userData.password);

  // Validate data
  var validationErrorMessage = User.validate(userData);
  if (validationErrorMessage) {
    return next(new Error(validationErrorMessage));
  }

  // Create user
  User.create(userData, function(err, user) {
    if (err) {
      // If the error is E11000, the reason is a duplicate username or email
      var reason = err.message;
      if (err.toString().indexOf('E11000') > -1) {
        if (err.toString().indexOf('username') > -1) {
          reason = 'USERNAME_ALREADY_EXISTS';
        } else if (err.toString().indexOf('email') > -1) {
          reason = 'EMAIL_ALREADY_EXISTS';
        }
      }
      return next(new Error(reason));
    }
    // If no error, login the user
    req.logIn(user, function(err) {
      // If login fail
      if (err) {
        return next(err);
      }

      // Send and return the user
      return res.send(user);
    });
  });
};

/**
 * Update a user
 */
exports.updateUser = function(req, res, next) {
  // Get the user data from the request
  var userUpdates = req.body;

  // Check if the user is authorized (admin or current user)
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.end();
  }

  // Validate data
  var err = User.validate(userUpdates);
  if (err) {
    return next(err);
  }

  // Get the user we have to modify
  User.findOne({_id: req.params.id}).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('USER_DOES_NOT_EXIST'));
    }
    user.username = userUpdates.username;
    user.email = userUpdates.email;
    // If needed, generate new hashed password
    if (userUpdates.password && userUpdates.password.length > 0) {
      user.salt = encrypt.createSalt();
      user.hashedPassword = encrypt.hashPassword(user.salt, userUpdates.password);
    }
    // If the modified user is the logged in user, let's reset it
    if (req.user._id == req.params.id) { // jshint ignore:line
      req.user = user;
    }
    // Save the user
    user.save(function(err) {
      if (err) {
        var reason = err.message;
        // If the error is E11000, the reason is a duplicate username or email
        if (err.toString().indexOf('username') > -1) {
          reason = 'USERNAME_ALREADY_EXISTS';
        } else if (err.toString().indexOf('email') > -1) {
          reason = 'EMAIL_ALREADY_EXISTS';
        }
        // If an error occure, return error 400 with the error
        return next(new Error(reason));
      }
      // Send and return the user
      user.populateUser().then(function() {
        res.send(user);
        return user;
      });
    });
  });
};

/**
 * Delete a user
 */
exports.deleteUser = function(req, res, next) {
  User.remove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.send(req.params.id);
    return req.params.id;
  });
};

/**
  * Return user with his stats
  */
exports.getUserStats = function(req, res, next) {
  // Check if the user is authorized (admin or current user)
  //
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.end();
  }
  User.findOne({_id: req.params.id}).exec(function(err, user) {
    if (err) {
      return next(new Error('USER_DOES_NOT_EXIST'));
    }
    user.populateUser().then(function() {
      res.send(user.toJSON({virtuals: true}));
    });
  });
};

/**
 * Return the list of users who answered a question
 */
exports.getUsersByAnsweredQuestion = function(req, res, next) {
  User.find({'answers.question': req.params.questionId}).then(function(collection) {
    res.send(collection);
  }, function(err) {
    return next(err);
  });
};

/**
 * Send a mail to the user with a link to set a new password
 */
exports.requestNewPassword = function(req, res) {
  // Try to find the concerned user
  var username = req.params.username;
  var criteria = validator.isEmail(username) ? {email: username} : {username: username};
  User.findOne(criteria).then(function(user) {
    if (user) {
      // Get the user language (default it to English if necessary)
      var language = (!!req.body.language && req.body.language.length === 2) ? req.body.language : 'en';
      // Create the token
      var token = encrypt.createToken();
      // Send the mail and send the response to the user
      mailer.sendRequestNewPasswordMail(language, user.email, token).then(function() {
        res.send({
          newPasswordSent: true
        });
      }, function() {
        res.send({
          newPasswordSent: false
        });
      });
      // Set the token and the expire date of the user reset password request
      user.resetPasswordToken = token;
      user.resetPasswordExpire = Date.now() + (1000 * 60 * 60 * 2); // 2 hours in the future
      user.save();
    } else {
      res.send({
        newPasswordSent: false
      });
    }
  });
};

exports.resetPassword = function(req, res, next) {
  var newPassword = req.body.newPassword;
  var token = req.body.token;
  if (token === undefined || token.length === 0 || !validator.isHexadecimal(token)) {
    return next(new Error('INVALID_TOKEN'));
  }
  User.findOne({resetPasswordToken: token}).then(function(user) {
    if (user && Date.now() < user.resetPasswordExpire) {
      user.salt = encrypt.createSalt();
      user.hashedPassword = encrypt.hashPassword(user.salt, newPassword);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      // Validate data (just in case)
      var validationErrorMessage = User.validate(user);
      if (validationErrorMessage) {
        return next(new Error(validationErrorMessage));
      }

      // Save the user
      user.save().then(function() {
        req.password = newPassword;
        req.email = user.email;
        // Login the user
        req.logIn(user, function(err) {
          // If login fail, continue the middleware chain
          if (err) {
            return next(err);
          }

          // Send and return the user
          user.populateUser().then(function() {
            res.send(user);
          });
        });
      });
    } else {
      return next(new Error('INVALID_TOKEN'));
    }
  });
};