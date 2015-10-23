var encrypt = require('../utils/encryption');
var Deffered = require('promised-io/promise').Deferred;
var validator = require('validator');
var User;

/**
 * User methods (instance methods)
 */
exports.methods = {
  /**
   * Override "toJSON" method to hide hashedPassword
   */
  toJSON: function(options) {
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
    return user;
  },
  /**
   * Check if the password is correct
   */
  authenticate: function(passwordToMatch) {
    return encrypt.hashPassword(this.salt, passwordToMatch) === this.hashedPassword;
  },
  /**
   * Check if the user has the given role
   */
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  },
  populateUser: function() {
    var user = this;
    var q = new Deffered();
    if (!User) {
      User = require('mongoose').model('User');
    }
    User.populate(user, [{
      path: 'answers.question',
      model: 'Question'
    }], function(err) {
      if (err) {
        q.reject();
      } else {
        q.resolve(user);
      }
    });
    return q.promise;
  }
};

/**
 * User statics methods
 */
exports.statics = {
  validate: function(user) {
    var err;
    if (validator.isEmail(user.username)) {
      err = 'Username must not be an email address';
    } else if (!validator.isEmail(user.email)) {
      err = 'Email address is not valid';
    } else if (!validator.isLength(user.email, 1, 150)) {
      err = 'Email address it too long';
    } else if (!validator.isLength(user.username, 1, 70)) {
      err = 'Username is too long';
    }
    return err;
  }
};
