var mongoose = require('mongoose');
var ipAnswersModel = require('../models/IpAnswers');
var Deffered = require("promised-io/promise").Deferred;

/** 
 * Comment schema
 */
var commentSchema = mongoose.Schema({
	text: {
		type: String,
		required: '{PATH} is required'
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		reference: 'User',
		required: '{PATH} is required'
	},
	upvotes: {
		type: Number,
		default: 0
	},
	date: {
		type: Date,
		default: Date.now
	}
});

/**
 * Question schema
 */
var questionSchema = mongoose.Schema({
	title: {
		type: String
	},
	description: {
		type: String
	},
	text: {
		type: String, 
		required: '{PATH} is required'
	},
	answers: [{
		text: {
			type: String,
			required: '{PATH} is required'
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
	upvotes: {
		type: Number,
		default: 0
	},
	tags: {
		type: [String]
	},
	comments: [commentSchema]
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
					}, function (err) {
						if (err) {
							q.resolve(true);
						} else {
							q.resolve(false);
						}
					});
				} else if (ipAnswers.length === 1) { // Known user, we will work with his/her answers
					answers = ipAnswers[0].answers;
					if (answers.length === 0) {
						q.resolve(false);
					}
					for (var i = 0; i < answers.length; i++) {
						if (answers[i].question.equals(self._id)) {
							q.resolve(true);
						} else if (i === answers.length - 1)  {
							q.resolve(false);
						}
					}
				}
			});
		} else { // Authenticated mode
			if (user.answers.length === 0) {
				q.resolve(false);
			}
			for (var i = 0; i < user.answers.length; i++) {
				if (user.answers[i].question.equals(self._id)) {
					q.resolve(true);
				} else if (i === user.answers.length - 1)  {
					q.resolve(false);
				}
			}
		}
		return q.promise;
	},
	populateComments: function () {
		var question = this;
		var q = new Deffered();
		Question.populate(question, {path: 'comments.author', select: 'username answers', model: 'User'}, function (err) {
			if (err) {
				q.reject();
			} else {
				q.resolve(question);
			}
		});
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