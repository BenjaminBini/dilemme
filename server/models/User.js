var mongoose = require('mongoose');
var validator = require('validator');
var encrypt = require('../utils/encryption');

/**
 * User schema
 */
var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: '{PATH} is required',
		unique: true,
		lowercase: true
	},
	email: {
		type: String,
		requred: '{PATH} is requred',
		unique: true,
		lowercase: true
	},
	salt: {type:String, required:'{PATH} is required'},
	hashedPassword: {
		type: String, 
		required:'{PATH} is required'
	},
	roles: [String],
	registrationDate: {
		type: Date,
		default: Date.now
	},
	answers: [{
		question: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Question',
			required: '{PATH} is required'
		},
		answer: {
			type: Number,
			required:'{PATH} is required'
		}
	}],
	upvotes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}],
	commentUpvotes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});


/**
 * User schema methods
 */
userSchema.methods = {
	/**
	 * Check if the password is correct
	 * @param  passwordToMatch Password to check
	 * @return                 True if the password is correct
	 */
	authenticate: function (passwordToMatch) {
		return encrypt.hashPassword(this.salt, passwordToMatch) === this.hashedPassword;
	},
	/**
	 * Check if the user has the given role
	 * @param  {[type]}  role Role to check
	 * @return {Boolean}      True if the user has the role
	 */
	hasRole: function (role) {
		return this.roles.indexOf(role) > -1;
	}
};

/**
 * User static methods
 */
userSchema.statics = {
	validate: function (user) {
		var err;
		if (validator.isEmail(user.username)) {
			err = 'Username must not be an email address';
		} else if (!validator.isEmail(user.email)) {
			err = 'Email address is not valid';
		} else if (!validator.isLength(user.username, 1, 70)) {
			err = 'Username is too long'
		}
		return err;
	}
}

var User = mongoose.model('User', userSchema);

/**
 * Create default users in the db
 */
exports.createDefaultEntries = function() {
	User.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			var salt, hash;
			salt = encrypt.createSalt();
			hash = encrypt.hashPassword(salt, 'joe');
			User.create({username: 'joe', email: 'joe@joe.joe', salt: salt, hashedPassword: hash, roles: ["admin"], registrationDate: new Date('10/02/2015') });
			salt = encrypt.createSalt();
			hash = encrypt.hashPassword(salt, 'ben');
			User.create({username: 'ben', email: 'ben@ben.ben', salt: salt, hashedPassword: hash, roles: [], registrationDate: new Date('10/02/2014')});
			salt = encrypt.createSalt();
			hash = encrypt.hashPassword(salt, 'leo');
			User.create({username: 'leo', email: 'leo@leo.leo', salt: salt, hashedPassword: hash, registrationDate: new Date('10/02/2013')});
		}
		console.log ('Users collection has ' + collection.length + ' entries');
	});
};