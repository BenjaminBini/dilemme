/**
 * Auth configuration
 */

var passport = require('passport');

/**
 * Authenticate a user with passport
 * @param     req  Request
 * @param     res  Response
 * @param  	  next Next
 */
exports.authenticate =  function (req, res, next) {
	req.body.username = req.body.username.toLowerCase();
	var auth = passport.authenticate('local', function (err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			res.send({success:false});
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			res.send({success:true, user:user});
		});
	});
	auth(req, res, next);
};


/**
 * Return 403 error if not authenticated
 * @param     req  Request
 * @param     res  Response
 * @param  	  next Next
 */
exports.requiresApiLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.status(403);
		res.end();
	} else {
		next();
	}
};


/**
 * Return 403 error if the user does not have the given role
 * @param     role Role to check
 */
exports.requiresRole = function (role) {
	return function(req, res, next) {
		if (!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
			res.status(403);
			res.end();
		} else {
			next();
		}
	}
}