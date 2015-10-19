/**
 * Auth configuration
 */

var passport = require('passport');

/**
 * Authenticate a user with passport (local strategy)
 */
exports.authenticate =  function(req, res, next) {
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
};

/**
 * Facebook authentication
 */
exports.facebookAuthenticate = passport.authenticate('facebook');

/**
 * Facebook authentication callback
 */
exports.facebookAuthenticateCallback = passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/'});

/**
 * Return 403 error if not authenticated
 */
exports.requiresApiLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403);
    res.send({
      reason: 'AUTHENTICATION_REQUIRED'
    }).end();
  } else {
    next();
  }
};

/**
 * Return 403 error if the user does not have the given role
 */
exports.requiresRole = function(role) {
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
};
