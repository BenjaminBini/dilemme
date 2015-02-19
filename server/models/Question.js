var mongoose = require('mongoose');
var ipAnswersModel = require('../models/IpAnswers');
var Deffered = require("promised-io/promise").Deferred;

/**
 * Question schema
 */
var questionSchema = mongoose.Schema({
	text: {
		type: String, 
		required: '{PATH} is required'
	},
	answers: [{
		text: {
			type: String,
			required: '{PATH} is requred'
		},
		votes: {
			type: Number,
			default: 0
		}
	}],
	published: {
		type: Date, 
		default: Date.now
	},
	tags: {
		type: [String]
	}
});

var IpAnswers = mongoose.model('IpAnswers');

/**
 * Question schema methods
 */
questionSchema.methods = {
	hasBeenAnswered: function (user, ip) {
		var self = this;
		var q = new Deffered();
		if (!user) { // Anonymous mode
			IpAnswers.find({ip: ip}, function (err, ipAnswers) {
				if (err) { // Error case : resolve with true
					q.resolve(true);
				}
				if (ipAnswers.length === 0) { // New user, we save it and initialize its IpAnswers entry
					IpAnswers.create({
						ip: ip,
						answers: []
					});
					q.resolve(false);
				} else if (ipAnswers.length === 1) { // Known user, we will work with his/her answers
					answers = ipAnswers[0].answers;
					for (var i = 0; i < answers.length; i++) {
						if (answers[i].question.equals(self._id)) {
							q.resolve(true);
							return;
						}
					}
					q.resolve(false);
				}
			});
		} else { // Authenticated mode
			for (var i = 0; i < user.answers.length; i++) {
				if (user.answers[i].question.equals(self._id)) {
					q.resolve(true);
					return;
				}
			}
			q.resolve(false);
		}
		return q.promise;
	}
}
/**
 * Get a random question
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
questionSchema.statics.random = function(callback) {
	this.count(function(err, count) {
		if (err) {
			return callback(err);
		}
		var rand = Math.floor(Math.random() * count);
		this.findOne().skip(rand).exec(callback);
	}.bind(this));
};


var Question = mongoose.model('Question', questionSchema);

/**
 * Create default questions in the db
 */
exports.createDefaultEntries = function() {
	Question.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			Question.create({ 
				text: 'Would you rather', 
				answers: [{
					text: 'eat beef',
					votes: 10
				}, {
					text: 'eat chicken'
				}],
				published: new Date('1/1/2015'), 
				tags: ['food', 'preferences'] 
			});
			Question.create({ 
				text: 'Do you prefer', 
				answers: [{
					text: 'green'
				}, {
					text: 'blue',
					votes: 2
				}],
				published: new Date('1/1/2015'), 
				tags: ['color'] 
			});
			Question.create({ 
				text: 'Would you rather', 
				answers: [{
					text: 'go to Italy',
					votes: 10
				}, {
					text: 'go to France',
					votes: 15
				}],
				published: new Date('1/1/2015')
			});
			Question.create({ 
				text: 'Would you rather', 
				answers: [{
					text: 'play football'
				}, {
					text: 'play rugby'
				}],
				published: new Date('1/1/2015')
			});
			Question.create({ 
				text: 'Do you prefer', 
				answers: [{
					text: 'Manchester United'
				}, {
					text: 'Manchester City'
				}]
			});
			Question.create({ 
				text: 'Would you rather', 
				answers: [{
					text: 'be immportal'
				}, {
					text: 'be mortal'
				}]
			});
			Question.create({ 
				text: 'Do you prefer', 
				answers: [{
					text: 'men'
				}, {
					text: 'women'
				}]
			});
			Question.create({ 
				text: 'Do you prefer', 
				answers: [{
					text: 'bar'
				}, {
					text: 'clubs'
				}]
			});
			Question.create({ 
				text: 'Do you prefer', 
				answers: [{
					text: 'apples'
				}, {
					text: 'oranges'
				}]
			});
			Question.create({ 
				text: 'Do you prefer', 
				answers: [{
					text: 'mathematics'
				}, {
					text: 'history'
				}]
			});
		}
		console.log ('Questions collection has ' + collection.length + ' entries');
	});
};