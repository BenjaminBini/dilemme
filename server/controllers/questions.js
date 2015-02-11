/**
 * Courses controller
 */

var encrypt = require('../utils/encryption');
var Question = require('mongoose').model('Question');

/**
 * Return array of all questions
 * @param   req Request
 * @param   res Response
 * @return      Array of all questions
 */
exports.getQuestions = function(req, res) {
	Question.find({}).exec(function(err, collection) {
		res.send(collection);
		return collection;
	});
};


exports.getQuestionById = function (req, res) {
	Question.findOne({_id: req.params.id}).exec(function (err, course) {
		res.send(course);
	});
}

/**
 * Create a new question
 * @param  {[type]}   req  Request
 * @param  {[type]}   res  Response
 * @param  {Function} next Next
 * @return {[type]}        Created question
 */
exports.createQuestion = function(req, res, next) {
	// Get the question data from the request
	var questionData = req.body;

	// Create question
	Question.create(questionData, function (err, question) {
		if (err) {
			// Return 400 code with the error
			res.status(400);
			return res.send({reason: err.toString()});
		}
		// If no error, return the user
		res.send(question);
		return question;
	});
};

/**
 * Update a question
 * @param  {[type]}   req  Request
 * @param  {[type]}   res  Response
 * @return {[type]}        Updated question
 */
exports.updateQuestion = function(req, res) {

	var updatedQuestion = req.body;
	Question.findOne({_id: updatedQuestion._id}).exec(function (err, question) {
		question.text = updatedQuestion.text;
		question.answers[0].text = updatedQuestion.answers[0].text;
		question.answers[1].text = updatedQuestion.answers[1].text;
		question.tags = updatedQuestion.tags;
		question.save(function(err) {
			if (err) {
				// If an error occure, return error 400 with the error
				res.status(400);
				return res.send({
					reason: err.toString()
				});
			}
			// Send and return the user
			res.send(question);
			return question;
		});
	});
};

/**
 * Delete a question
 * @param  {[type]} req 	Request
 * @param  {[type]} resp 	Response
 * @return {[type]}         Deleted id
 */
exports.deleteQuestion = function(req, res) {
	console.log('DELETE QUESTION : ' + JSON.stringify(req.body));
	var question = req.body;
	Question.remove({ _id: question._id}, function (err) {
		if (err) {
			res.status(400);
			return res.send({
				reason: err.toString()
			});
		}
		res.send(question._id);
		return question._id;
	});
}