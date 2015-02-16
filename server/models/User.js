var mongoose = require('mongoose');
var encrypt = require('../utils/encryption');

/**
 * User schema
 */
var userSchema = mongoose.Schema({
	firstName: {
		type:String, 
		required:'{PATH} is required'
	},
	lastName: {
		type:String, 
		required:'{PATH} is required'
	},
	username: {
		type: String,
		required: '{PATH} is required',
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
	answers : [{
		question: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Question'
		},
		answer: Number
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

var User = mongoose.model('User', userSchema);

/**
 * Create default users in the db
 */
exports.createDefaultUsers = function() {
	User.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			var salt, hash;
			salt = encrypt.createSalt();
			hash = encrypt.hashPassword(salt, 'joe');
			User.create({firstName: 'Joe', lastName: 'Doe', username: 'joe', salt: salt, hashedPassword: hash, roles: ["admin"], registrationDate: new Date('10/02/2015') });
			salt = encrypt.createSalt();
			hash = encrypt.hashPassword(salt, 'ben');
			User.create({firstName: 'Benjamin', lastName: 'Bini', username: 'ben', salt: salt, hashedPassword: hash, roles: [], registrationDate: new Date('10/02/2014')});
			salt = encrypt.createSalt();
			hash = encrypt.hashPassword(salt, 'leo');
			User.create({firstName: 'Léonie', lastName: 'Gros', username: 'leo', salt: salt, hashedPassword: hash, registrationDate: new Date('10/02/2013')});
		}
	});
};