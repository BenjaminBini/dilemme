var mongoose = require('mongoose');

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

/**
 * Question schema methods
 */
questionSchema.methods = {
	hasBeenAnswered: function (user) {
		if (!user || !user.isAuthenticated()) {
			return true;
		}
		if (!req.user.answers) {
			return false;
		}
		var alreadyAnswered = false;
		for (var i = 0; i < req.user.answers.length; i++) {
			if (req.user.answers[i].question == this._id) {
				alreadyAnsweredQuestion = true;
				break;
			}
		}
		return alreadyAnswered;
	}
}

/**
 * Question schema statics methods
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
exports.createDefaultQuestions = function() {
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
	});
};