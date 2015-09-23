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
exports.getUsers = function(req, res) {
  User.find({}).exec(function(err, collection) {
    if (err) {
      return;
    }
    res.send(collection);
    return collection;
  });
};

/**
 * Return the user with the given id
 */
exports.getUserById = function(req, res) {
  User.findOne({_id: req.params.id}).exec(function(err, user) {
    if (err) {
      return res.send(400);
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
  var err = User.validate(userData);
  if (err) {
    return res.status(400).send({
      reason: err
    });
  }

  // Create user
  User.create(userData, function(err, user) {
    if (err) {
      // If the error is E11000, the reason is a duplicate username or email
      if (err.toString().indexOf('E11000') > -1) {
        if (err.toString().indexOf('username') > -1) {
          err = 'USERNAME_ALREADY_EXISTS';
        } else if (err.toString().indexOf('email') > -1) {
          err = 'EMAIL_ALREADY_EXISTS';
        }
      }
      // Return 400 code with the error
      res.status(400);
      return res.send({reason: err});
    }
    // If no error, login the user
    req.logIn(user, function(err) {
      // If login fail, continue the middleware chain
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
exports.updateUser = function(req, res) {
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
    return res.status(400).send({
      reason: err
    });
  }

  // Get the user we have to modify
  User.findOne({_id: req.params.id}).exec(function(err, user) {
    if (err || !user) {
      return res.sendStatus(400);
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
        // If the error is E11000, the reason is a duplicate username or email
        if (err.toString().indexOf('username') > -1) {
          err = 'USERNAME_ALREADY_EXISTS';
        } else if (err.toString().indexOf('email') > -1) {
          err = 'EMAIL_ALREADY_EXISTS';
        }
        // If an error occure, return error 400 with the error
        res.status(400);
        return res.send({
          reason: err.toString()
        });
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
exports.deleteUser = function(req, res) {
  User.remove({_id: req.params.id}, function(err) {
    if (err) {
      res.status(400);
      return res.send({
        reason: err.toString()
      });
    }
    res.send(req.params.id);
    return req.params.id;
  });
};

/**
  * Return user with his stats
  */
exports.getUserStats = function(req, res) {
  // Check if the user is authorized (admin or current user)
  //
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.end();
  }
  User.findOne({_id: req.params.id}).exec(function(err, user) {
    if (err) {
      return res.status(400).send({
        reason: 'USER_DOES_NOT_EXIST'
      });
    }
    user.populateUser().then(function() {
      res.send(user.toJSON({virtuals: true}));
    });
  });
};

/**
 * Return the list of users who answered a question
 */
exports.getUsersByAnsweredQuestion = function(req, res) {
  User.find({'answers.question': req.params.questionId}).then(function(collection) {
    res.send(collection);
  }, function(err) {
    res.status(400);
    return res.send({
      reason: err.toString()
    });
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
    // Get the user language (default it to English if necessary)
    var language = (!!req.body.language && req.body.language.length === 2) ? req.body.language : 'en';
    // Send the mail and send the response to the user
    mailer.sendRequestNewPasswordMail(language, user.email).then(function() {
      res.send({
        newPasswordSent: true
      });
    }, function() {
      res.send({
        newPasswordSent: false
      });
    });
    // Set the token and the date of the user
    user.resetPasswordToken = encrypt.createToken();
    user.resetPasswordExpire = Date.now() + (1000 * 60 * 60 * 2); // 2 hours in the future
    user.save();
  }, function() {
    res.send({
      newPasswordSent: false
    });
  });
};
