/**
 * Passport configuration
 */

var mongoose = require('mongoose');
var passport = require('passport');
var validator = require('validator');
var encrypt = require('../utils/encryption');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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

  /**
   * Use FB strategy
   */
  passport.use(new FacebookStrategy({
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: process.env.ROOT_PATH + '/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({facebookId: profile.id}).then(function(user) {
        if (!user) {
          var salt = encrypt.createSalt();
          User.create({
            username: profile.displayName,
            email: profile.email,
            salt: salt,
            hashedPassword: encrypt.hashPassword(salt, encrypt.createToken()),
            facebookId: profile.id
          }).then(function(user) {
            return done(null, user);
          });
        } else {
          return done(null, user);
        }
      }, function(err) {
        if (err) {
          return done(null, false);
        }
      });
    }
  ));

};
