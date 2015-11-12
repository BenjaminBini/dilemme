'use strict';

/**
 * Comments service
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Question = mongoose.model('Question');

/**
 * Module interface
 */
module.exports = {
  commentQuestion: commentQuestion,
  deleteComment: deleteComment,
  upvoteComment: upvoteComment
};

/**
 * Add a comment to a question
 */
function commentQuestion(req, res, next) {
  var questionId = req.params.id;
  var comment = req.body;
  if (comment.text && comment.text.length > 1000) {
    return next(new Error('TOO_LONG_COMMENT'));
  }
  Question.findOne({_id: questionId})
    .then(function(question) {
      if (!question) {
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      if (!question.comments) {
        question.comments = [];
      }
      comment.author = req.user._id;
      question.comments.push(comment);
      return question.save();
    })
    .then(question => question.populateQuestion())
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Delete a comment
 */
function deleteComment(req, res, next) {
  var questionId = req.params.id;
  var commentId = req.params.commentId;
  Question.findOne({_id: questionId})
    .then(function(question) {
      if (!question) {
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      var comment = question.comments.id(commentId);
      if (!comment) {
        throw new Error('COMMENT_DOES_NOT_EXIST');
      }
      comment.remove();
      return question.save();
    })
    .then(question => question.populateQuestion())
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Upvote a comment
 */
function upvoteComment(req, res, next) {
  var questionId = req.params.id;
  var commentId = req.params.commentId;
  var i;

  Question.findOne({_id: questionId})
    .then(function(question) {
      if (!question) {
        throw new  Error('QUESTION_DOES_NOT_EXIST');
      }
      var comment = question.comments.id(commentId);
      if (!comment) {
        throw new  Error('COMMENT_DOES_NOT_EXIST');
      }
      for (i = 0; i < req.user.commentUpvotes.length; i++) {
        if (req.user.commentUpvotes[i].equals(commentId)) {
          throw new Error('COMMENT_ALREADY_UPVOTED');
        }
      }
      comment.upvotes = comment.upvotes + 1;
      req.user.commentUpvotes.push(commentId);

      var saveQuestion = question.save();
      var saveUser = req.user.save();
      return Promise.all([saveQuestion, saveUser]);
    })
    .then(function(saveResults) {
      if (!saveResults || saveResults.length !== 2) {
        throw new Error('UNKNOWN_ERROR');
      }
      return saveResults[0];
    })
    .then(question => question.populateQuestion())
    .then(question => res.send(question))
    .catch(err => next(err));
}
