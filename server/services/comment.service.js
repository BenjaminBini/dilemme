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
function commentQuestion(questionId, comment, authorId) {
  if (comment && comment.length > 1000) {
    return Promise.reject(new Error('TOO_LONG_COMMENT'));
  }
  return Question.findOne({_id: questionId, status: 1})
    .then(function(question) {
      if (!question) {
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      if (!question.comments) {
        question.comments = [];
      }
      question.comments.push({
        text: comment,
        author: authorId
      });
      return question.save();
    })
    .then(question => question.populateQuestion());
}

/**
 * Delete a comment
 */
function deleteComment(questionId, commentId) {
  return Question.findOne({_id: questionId})
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
    .then(question => question.populateQuestion());
}

/**
 * Upvote a comment
 */
function upvoteComment(questionId, commentId, user) {
  var i;
  return Question.findOne({_id: questionId, status: 1})
    .then(function(question) {
      if (!question) {
        throw new  Error('QUESTION_DOES_NOT_EXIST');
      }
      var comment = question.comments.id(commentId);
      if (!comment) {
        throw new  Error('COMMENT_DOES_NOT_EXIST');
      }
      for (i = 0; i < user.commentUpvotes.length; i++) {
        if (user.commentUpvotes[i].equals(commentId)) {
          throw new Error('COMMENT_ALREADY_UPVOTED');
        }
      }
      comment.upvotes = comment.upvotes + 1;
      user.commentUpvotes.push(commentId);

      var saveQuestion = question.save();
      var saveUser = user.save();
      return Promise.all([saveQuestion, saveUser]);
    })
    .then(function(saveResults) {
      if (!saveResults || saveResults.length !== 2) {
        throw new Error('UNKNOWN_ERROR');
      }
      return saveResults[0];
    })
    .then(question => question.populateQuestion());
}
