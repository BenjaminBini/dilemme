'use strict';

/**
 * Passport configuration
 */
var mongoose = require('mongoose');
var passport = require('passport');
var validator = require('validator');
var encrypt = require('../utils/encryption');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = mongoose.model('User');

/**
 * Export Passport configuration
 */
module.exports = configurePassport;

/**
 * Configure Passport
 */
function configurePassport() {

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
   * Local strategy
   */
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    // Get a user by its email or username and check the password
    var criteria = validator.isEmail(email) ? {email: email} : {username: email};
    User.findOne(criteria).exec(function(err, user) {
      if (err) {
        return done(err, false);
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
   * Facebook Strategy
   * Workflow :
   * - if the user with the good facebookId exists, we log him in
   * - if not, we see if we have a username and an email
   * -- if we have them we check if a user with this username or this email exists
   * --- if yes, it's not possible to create the user automatically so we put the facebookId, the username and the mail (if it exists) in the session
   *     and redirect the user to a page where he can set his username and mail address
   * --- if not then we can create the profile and log the user in
   * -- if we don't have them (a username and a mail), we put all the stuff in the session and redirect the user to the form (read above)
   */
  passport.use(new FacebookStrategy({
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: process.env.ROOT_PATH + '/auth/facebook/callback',
      passReqToCallback: true
    }, facebookStrategyCallback)
  );

  /**
   * Twitter Strategy
   * To know the workflow, read the comment in the Facebook Strategy section
   */
  passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_ID,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: process.env.ROOT_PATH + '/auth/twitter/callback',
      passReqToCallback: true
    }, twitterAuthenticationCallback)
  );

  /**
   * Google Strategy
   */
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.ROOT_PATH + '/auth/google/callback',
      passReqToCallback: true
    }, googleAuthenticationCallback)
  );

  function facebookStrategyCallback(req, accessToken, refreshToken, profile, done) {
    User.findOne({facebookId: profile.id}).then(function(user) {
      if (!user) { // No user : let's see if we can create one
        if (!!profile.displayName && !!profile.emails && profile.emails.length > 0) { // If username and email address exist we can query the DB
          User.find({}).or([{username: profile.displayName.toLowerCase()}, {email: profile.emails[0].value}]).then(function(users) {
            if (users.length > 0) { // Can't create, a user with this email address or username already exists put data in session and refuse login
              putProfileDataInSession(req, profile, 'facebook');
              return done(null, false);
            } else { // Can create and conect
              var salt = encrypt.createSalt();
              var password = encrypt.createToken();
              var hashedPassword = encrypt.hashPassword(salt, password);
              User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                salt: salt,
                hashedPassword: hashedPassword,
                facebookId: profile.id
              }).then(function(user) {
                return done(null, user);
              });
            }
          });
        } else { // If no username or address exist, data in session and refuse login
          putProfileDataInSession(req, profile, 'facebook');
          return done(null, false);
        }
      } else {
        return done(null, user);
      }
    }, function(err) {
      if (err) {
        return done(err, false);
      }
    });
  }

  function twitterAuthenticationCallback(req, token, tokenSecret, profile, done) {
    User.findOne({twitterId: profile.id}).then(function(user) {
      if (!user) { // No user : let's see if we can create one
        if (!!profile.displayName && !!profile.emails && profile.emails.length > 0) { // If username and email address exist we can query the DB
          User.find({}).or([{username: profile.displayName.toLowerCase()}, {email: profile.emails[0].value}]).then(function(users) {
            if (users.length > 0) { // Can't create, a user with this email address or username already exists put data in session and refuse login
              putProfileDataInSession(req, profile, 'twitter');
              return done(null, false);
            } else { // Can create and conect
              var salt = encrypt.createSalt();
              var password = encrypt.createToken();
              var hashedPassword = encrypt.hashPassword(salt, password);
              User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                salt: salt,
                hashedPassword: hashedPassword,
                twitterId: profile.id
              }).then(function(user) {
                return done(null, user);
              });
            }
          });
        } else { // If no username or address exist, data in session and refuse login
          putProfileDataInSession(req, profile, 'twitter');
          return done(null, false);
        }
      } else {
        return done(null, user);
      }
    }, function(err) {
      if (err) {
        return done(err, false);
      }
    });
  }

  function googleAuthenticationCallback(req, token, tokenSecret, profile, done) {
    User.findOne({googleId: profile.id}).then(function(user) {
      if (!user) { // No user : let's see if we can create one
        if (!!profile.displayName && !!profile.emails && profile.emails.length > 0) { // If username and email address exist we can query the DB
          User.find({}).or([{username: profile.displayName.toLowerCase()}, {email: profile.emails[0].value}]).then(function(users) {
            if (users.length > 0) { // Can't create, a user with this email address or username already exists put data in session and refuse login
              putProfileDataInSession(req, profile, 'google');
              return done(null, false);
            } else { // Can create and conect
              var salt = encrypt.createSalt();
              var password = encrypt.createToken();
              var hashedPassword = encrypt.hashPassword(salt, password);
              User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                salt: salt,
                hashedPassword: hashedPassword,
                googleId: profile.id
              }).then(function(user) {
                return done(null, user);
              });
            }
          });
        } else { // If no username or address exist, data in session and refuse login
          putProfileDataInSession(req, profile, 'google');
          return done(null, false);
        }
      } else {
        return done(null, user);
      }
    }, function(err) {
      if (err) {
        return done(err, false);
      }
    });
  }

  function putProfileDataInSession(req, profile, provider) {
    if (provider === 'facebook') {
      req.session.facebookId = profile.id;
    } else if (provider === 'twitter') {
      req.session.twitterId = profile.id;
    } else if (provider === 'google') {
      req.session.googleId = profile.id;
    }
    req.session.profileName = profile.displayName;
    if (!!profile.emails && profile.emails.length > 0) {
      req.session.profileMail = profile.emails[0].value;
    }
  }

}
