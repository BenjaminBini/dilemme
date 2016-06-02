'use strict';

var Promise = require('bluebird');
var mongoose = require('mongoose');

/**
 * Question schema instance methods
 */
exports.methods = {
  hasBeenAnswered: hasBeenAnswered,
  populateQuestion: populateQuestion
};

/**
 * Question schema statics methods
 */
exports.statics = {
  random: random
};

/**
 * Tell if the question has already been answered by the current user
 */
function hasBeenAnswered(user, ip) {
  if (!user) { // Anonymous mode
    return _hasBeenAnswerByIp.bind(this)(ip);
  } else { // Authenticated mode
    return _hasBeenAnsweredByUser.bind(this)(user);
  }
}

function _hasBeenAnswerByIp(ip) {
  var question = this;
  var IpAnswer = mongoose.model('IpAnswer');
  return IpAnswer.find({ip: ip})
    .then(function(ipAnswers) { // Let's see if the ipAnswers contains entries from this question
      if (ipAnswers.length == 0) { // New user
        return Promise.resolve(false);
      }
      var answers = ipAnswers[0].answers;
      for (let answer of answers) {
        if (answer.question.equals(question._id)) {
          return Promise.resolve(true); // If yes the question has been answered
        }
      }
      return Promise.resolve(false); // If no, it has not
    });
}

function _hasBeenAnsweredByUser(user) {
  var i;
  var question = this;
  return user.populateUser()
    .then(function(user) {
      for (i = 0; i < user.answers.length; i++) {
        if (user.answers[i].question._id.equals(question._id)) {
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(false);
    });
}

/**
 * Populate the question with its author and comments authors
 */
function populateQuestion() {
  var Question = mongoose.model('Question');
  var question = this;
  return Question.populate(question, [{
    path: 'comments.author',
    select: 'username answers',
    model: 'User'
  }, {
    path: 'author',
    select: 'username',
    model: 'User'
  }]);
}

/**
 * Get a random question
 */
function random() {
  var Question = mongoose.model('Question');
  return Question.count({status: 1})
    .then(function(count) {
      if (count === 0) {
        throw new Error('NO_QUESTION_IN_DB');
      }
      var rand = Math.floor(Math.random() * count);
      return Question.findOne({status: 1}).skip(rand);
    });
}
