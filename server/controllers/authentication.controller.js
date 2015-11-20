'use strict';

/**
 * Authentication controller
 */
var passport = require('passport');

/**
 * Module interface
 */
module.exports = {
  authenticate: authenticate,
  facebookAuthenticate: passport.authenticate('facebook', {scope: ['email']}),
  facebookAuthenticateCallback: facebookAuthenticateCallback,
  twitterAuthenticate: passport.authenticate('twitter'),
  twitterAuthenticateCallback: twitterAuthenticateCallback,
  googleAuthenticate: passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
  }),
  googleAuthenticateCallback: googleAuthenticateCallback,
  requiresApiLogin: requiresApiLogin,
  requiresRole: requiresRole
};

/**
 * Authenticate a user with passport (local strategy)
 */
function authenticate(req, res, next) {
  req.body.email = req.body.email.toLowerCase();
  var auth = passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.send({success: false});
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      res.send({success: true, user: user});
    });
  });
  auth(req, res, next);
}

/**
 * Facebook authentication callback
 */
function facebookAuthenticateCallback(req, res, next) {
  passport.authenticate('facebook', function(err, user) {
    var username = req.session.profileName;
    var email = !!req.session.profileMail ? req.session.profileMail : '';
    req.session.profileName = req.session.profileMail = undefined;
    if (err) {
      return next(err);
    }
    if (!user) {
      res.redirect('/register-external?name=' + username + '&email=' + email);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  })(req, res, next);
}

/**
 * Twitter authentication callback
 */
function twitterAuthenticateCallback(req, res, next) {
  passport.authenticate('twitter', function(err, user) {
    var username = req.session.profileName;
    var email = !!req.session.profileMail ? req.session.profileMail : '';
    req.session.profileName = req.session.profileMail = undefined;
    if (err) {
      return next(err);
    }
    if (!user) {
      res.redirect('/register-external?name=' + username + '&email=' + email);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  })(req, res, next);
}

/**
 * Twitter authentication callback
 */
function googleAuthenticateCallback(req, res, next) {
  passport.authenticate('google', function(err, user) {
    var username = req.session.profileName;
    var email = !!req.session.profileMail ? req.session.profileMail : '';
    req.session.profileName = req.session.profileMail = undefined;
    if (err) {
      return next(err);
    }
    if (!user) {
      res.redirect('/register-external?name=' + username + '&email=' + email);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  })(req, res, next);
}

/**
 * Return 403 error if not authenticated
 */
function requiresApiLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403);
    res.send({
      reason: 'AUTHENTICATION_REQUIRED'
    }).end();
  } else {
    next();
  }
}

/**
 * Return 403 error if the user does not have the given role
 */
function requiresRole(role) {
  return function(req, res, next) {
    if (!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
      res.status(403);
      res.send({
        reason: 'NOT_AUTHORIZED'
      }).end();
    } else {
      next();
    }
  };
}
