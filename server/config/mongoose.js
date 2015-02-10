/**
 * Mongoose configuration
 */

var mongoose = require('mongoose');
var userModel = require('../models/User');
var questionModel = require('../models/Question');

module.exports = function(config) {
	// Mongodb connection
	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error...'));
	db.once('open', function callback() {
		console.log('db opened');
	});

	// Create default data in the db
	userModel.createDefaultUsers();
	questionModel.createDefaultQuestions();
}