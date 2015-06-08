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
  var comment = req.body;
  if (comment.text && comment.text.length > 1000) {
    res.status(400);
    return res.send({
      reason: 'TOO_LONG_COMMENT'
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
    if (err) {
      return;
    }
    if (!question) {
      res.status(400);
      return res.send({
        reason: 'QUESTION_DOES_NOT_EXIST'
      });
    }
    var comment = question.comments.id(commentId);
    if (!comment) {
      res.status(400);
      return res.send({
        reason: 'COMMENT_DOES_NOT_EXIST'
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
  var i;
  Question.findOne({_id: questionId}).exec(function (err, question) {
    if (err) {
      return;
    }
    if (!question) {
      res.status(400);
      return res.send({
        reason: 'QUESTION_DOES_NOT_EXIST'
      });
    }
    var comment = question.comments.id(commentId);
    if (!comment) {
      res.status(400);
      return res.send({
        reason: 'COMMENT_DOES_NOT_EXIST'
      });
    }
    for (i = 0; i < req.user.commentUpvotes.length; i++) {
      if (req.user.commentUpvotes[i].equals(commentId)) {
        res.status(400);
        return res.send({
          reason: 'COMMENT_ALREADY_UPVOTED'
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