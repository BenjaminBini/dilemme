/**
 * Passport configuration
 */

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

module.exports = function() {

	/**
	 * Serialize the  a user (just save its id)
	 */
	passport.serializeUser(function (user, done) {
		if (user) {
			return done(null, user._id);
		}
	});

	/**
	 * Deserialize a user (get back the user from its id)
	 */
	passport.deserializeUser(function (id, done) {
		User.findOne({_id:id}).exec(function (err, user) {
			// If no user is found, deserialization fail
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			} 
		});
	});

	/**
	 * Use local strategy
	 */
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function (email, password, done) {
			// Get a user by its email and check the password
			User.findOne({email:email}).exec(function (err, user) {
				if (user && user.authenticate(password)) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		}
	));
};