/**
 * Passport configuration
 */

var mongoose = require('mongoose');
var passport = require('passport');
var validator = require('validator');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

module.exports = function() {
  /**
   * Serialize the  a user (just save its id)
   */
  passport.serializeUser(function(user, done) {
    if (user) {
      return done(null, user._id);
    }
  });

  /**
   * Deserialize a user (get back the user from its id)
   */
  passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}).exec(function(err, user) {
      if (err) {
        return;
      }
      // If no user is found, deserialization fail
      if (user) {
        return user.populateUser().then(function() {
          return done(null, user);
        });
      }
      return done(null, false);
    });
  });

  /**
   * Use local strategy
   */
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    // Get a user by its email or username and check the password
    var criteria = validator.isEmail(email) ? {email: email} : {username: email};
    User.findOne(criteria).exec(function(err, user) {
      if (err) {
        return done(null, false);
      }
      if (user && user.authenticate(password)) {
        return user.populateUser().then(function() {
          return done(null, user);
        });
      }
      return done(null, false);
    });
  }));
};
