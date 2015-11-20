'use strict';

/**
 * Comments API controller
 */
var commentService = require('../services/comment.service');

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
  var authorId = req.user._id;
  commentService.commentQuestion(questionId, comment, authorId)
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Delete a comment
 */
function deleteComment(req, res, next) {
  var questionId = req.params.id;
  var commentId = req.params.commentId;
  commentService.deleteComment(questionId, commentId)
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Upvote a comment
 */
function upvoteComment(req, res, next) {
  var questionId = req.params.id;
  var commentId = req.params.commentId;
  var user =  req.user;
  commentService.upvoteComment(questionId, commentId, user)
    .then(question => res.send(question))
    .catch(err => next(err));
}
