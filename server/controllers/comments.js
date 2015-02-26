/**
 * Comments controller
 */
var mongoose = require('mongoose');
var Question = mongoose.model('Question');


/**
 * Add a comment to a question
 * @param  {[type]} req Request
 * @param  {[type]} res Response
 * @return {[type]}     
 */
exports.commentQuestion = function (req, res) {
	var questionId = req.params.id;
	var user = req.user;
	var comment = req.body
	if (comment.text && comment.text.length > 1000) {
		res.status(400);
		return res.send({
			reason: 'Your comment is too long (1000 characters maximum)'
		});
	}
	Question.findOne({_id: questionId}).exec(function (err, question) {
		if (!question) {
			res.status(400);
			return res.send({
				reason: err.toString()
			});
		}
		if (!question.comments) {
			question.comments = [];
		}
		comment.author = req.user._id;
		question.comments.push(comment);
		question.save(function (err) {
			if (err) {
				res.status(400);
				return res.send({
					reason: err.toString()
				});
			}
			question.populateQuestion().then(function () {
				return res.send(question);
			});
		});
	});
};

/**
 * Delete a comment
 * @param  {[type]} req Request
 * @param  {[type]} res Response
 * @return {[type]}     
 */
exports.deleteComment = function (req, res) {
	var questionId = req.params.id;
	var commentId = req.params.commentId;
	Question.findOne({_id: questionId}).exec(function (err, question) {
		if (!question) {
			res.status(400);
			return res.send({
				reason: 'This question does not exist'
			});
		}
		var comment = question.comments.id(commentId);
		if (!comment) {
			res.status(400);
			return res.send({
				reason: 'This comment does not exist'
			});
		}
		comment.remove();
		question.save(function (err) {
			if (err) {
				res.status(400);
				return res.send({
					reason: err.toString()
				});
			}
			question.populateQuestion().then(function () {
				return res.send(question);
			});
		});
	});
};

/**
 * Upvote a comment
 * @param  {[type]} req Request
 * @param  {[type]} res Response
 * @return {[type]}     
 */
exports.upvoteComment = function (req, res) {
	var questionId = req.params.id;
	var commentId = req.params.commentId;
	Question.findOne({_id: questionId}).exec(function (err, question) {
		if (!question) {
			res.status(400);
			return res.send({
				reason: 'This question does not exist'
			});
		}
		var comment = question.comments.id(commentId);
		if (!comment) {
			res.status(400);
			return res.send({
				reason: 'This comment does not exist'
			});
		}
		for (var i = 0; i < req.user.commentUpvotes.length; i++) {
			if (req.user.commentUpvotes[i].equals(commentId)) {
				res.status(400);
				return res.send({
					reason: 'You already voted for this comment'
				});
			}
		}
		req.user.commentUpvotes.push(commentId);
		req.user.save(function (err) {
			if (err) {
				res.status(400);
				return res.send({
					reason: err.toString()
				});
			}
			comment.upvotes = comment.upvotes + 1;
			question.save(function (err) {
				if (err) {
					res.status(400);
					return res.send({
						reason: err.toString()
					});
				}
				question.populateQuestion().then(function () {
					return res.send(question);
				});
			});
		});
	});
};