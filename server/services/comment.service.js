/**
 * Comments controller
 */
var mongoose = require('mongoose');
var Question = mongoose.model('Question');

/**
 * Add a comment to a question
 */
exports.commentQuestion = function(req, res, next) {
  var questionId = req.params.id;
  var comment = req.body;
  if (comment.text && comment.text.length > 1000) {
    return next(new Error('TOO_LONG_COMMENT'));
  }
  Question.findOne({_id: questionId}).exec(function(err, question) {
    if (!question) {
      return next(err);
    }
    if (!question.comments) {
      question.comments = [];
    }
    comment.author = req.user._id;
    question.comments.push(comment);
    question.save(function(err) {
      if (err) {
        return next(err);
      }
      question.populateQuestion().then(function() {
        return res.send(question);
      });
    });
  });
};

/**
 * Delete a comment
 */
exports.deleteComment = function(req, res, next) {
  var questionId = req.params.id;
  var commentId = req.params.commentId;
  Question.findOne({_id: questionId}).exec(function(err, question) {
    if (err) {
      return;
    }
    if (!question) {
      return next(new Error('QUESTION_DOES_NOT_EXIST'));
    }
    var comment = question.comments.id(commentId);
    if (!comment) {
      return next(new Error('COMMENT_DOES_NOT_EXIST'));
    }
    comment.remove();
    question.save(function(err) {
      if (err) {
        return next(err);
      }
      question.populateQuestion().then(function() {
        return res.send(question);
      });
    });
  });
};

/**
 * Upvote a comment
 */
exports.upvoteComment = function(req, res, next) {
  var questionId = req.params.id;
  var commentId = req.params.commentId;
  var i;
  Question.findOne({_id: questionId}).exec(function(err, question) {
    if (err) {
      return;
    }
    if (!question) {
      return next(new Error('QUESTION_DOES_NOT_EXIST'));
    }
    var comment = question.comments.id(commentId);
    if (!comment) {
      return next(new Error('COMMENT_DOES_NOT_EXIST'));
    }
    for (i = 0; i < req.user.commentUpvotes.length; i++) {
      if (req.user.commentUpvotes[i].equals(commentId)) {
        return next(new Error('COMMENT_ALREADY_UPVOTED'));
      }
    }
    req.user.commentUpvotes.push(commentId);
    req.user.save(function(err) {
      if (err) {
        return next(err);
      }
      comment.upvotes = comment.upvotes + 1;
      question.save(function(err) {
        if (err) {
          return next(err);
        }
        question.populateQuestion().then(function() {
          return res.send(question);
        });
      });
    });
  });
};
