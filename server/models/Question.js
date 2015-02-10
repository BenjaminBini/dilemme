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
}

var Question = mongoose.model('Question', questionSchema);

/**
 * Create default questions in the db
 */
exports.createDefaultQuestions = function() {
	Question.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			Question.create({ 
				text: 'Would you rather...', 
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
				text: 'Do you prefer...', 
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
				text: 'Would you rather...', 
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
				text: 'Would you rather...', 
				answers: [{
					text: 'play football'
				}, {
					text: 'play rugby'
				}],
				published: new Date('1/1/2015')
			});
			Question.create({ 
				text: 'Do you prefere...', 
				answers: [{
					text: 'Manchester United'
				}, {
					text: 'Manchester City'
				}]
			});
		}
	});
};