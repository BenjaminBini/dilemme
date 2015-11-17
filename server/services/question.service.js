'use strict';

/**
 * Questions service
 */
var requestIp = require('request-ip');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Question = mongoose.model('Question');
var User = mongoose.model('User');
var IpAnswer = mongoose.model('IpAnswer');

/**
 * Module interface
 */
module.exports = {
  getQuestions: getQuestions,
  getPublishedQuestions: getPublishedQuestions,
  count: count,
  getQuestionsByAuthor: getQuestionsByAuthor,
  getQuestionsByTag: getQuestionsByTag,
  getQuestionById: getQuestionById,
  getRandomQuestion: getRandomQuestion,
  getUnansweredRandomQuestion: getUnansweredRandomQuestion,
  createQuestion: createQuestion,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion,
  answerQuestion: answerQuestion,
  upvoteQuestion: upvoteQuestion
};

/**
 * Return array of all questions
 */
function getQuestions(req, res, next) {
  Question.find({})
    .then(questions => res.send(questions))
    .catch(err => next(err));
}

/**
 * Return array of published questions
 */
function getPublishedQuestions(req, res, next) {
  Question.find({status: 1})
    .then(questions => res.send(questions))
    .catch(err => next(err));
}

/**
 * Count number of questions
 */
function count(req, res, next) {
  Question.count({})
    .then(count => res.send({count: count}))
    .catch(err => next(err));
}

/**
 * Return array of questions with the given author
 */
function getQuestionsByAuthor(req, res, next) {
  // Check if the user is authorized (admin or current user)
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.send();
  }

  Question.find({author: req.params.id})
    .then(questions => res.send(questions))
    .catch(err => next(err));
}

/**
 * Return array of questions with the given tag
 */
function getQuestionsByTag(req, res, next) {
  Question.find({status: 1, tags: req.params.tag})
    .then(questions => res.send(questions))
    .catch(err => next(err));
}

/**
 * Return a question by its id
 */
function getQuestionById(req, res, next) {
  Question.findOne({_id: req.params.id})
    .then(function(question) {
      if (!question) {
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      if (question.status === 0 && !(req.user && req.user.hasRole('admin'))) {
        res.status(403);
        throw new Error('NOT_AUTHORIZED');
      }
      return Promise.resolve(question);
    })
    .then(question => question.populateQuestion())
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Return a random question
 */
function getRandomQuestion(req, res, next) {
  Question.random().then(question => question.populateQuestion())
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Return a random question unanswered by the user
 */
function getUnansweredRandomQuestion(req, res, next) {
  var i;
  if (!req.isAuthenticated()) { // If not authenticated
    Question.random()
      .then(question => question.populateQuestion())
      .then(question => res.send(question))
      .catch(err => next(err));
  } else {
    // We get already answered questions
    var answeredQuestions = [];
    for (i = 0; i < req.user.answers.length; i++) {
      answeredQuestions.push(req.user.answers[i].question);
    }
    // We look for a published question not in the collection of answered questions
    Question.find({status: 1}).where('_id').nin(answeredQuestions)
      .then(function(questions) {
        if (questions.length === 0) { // If all questions have been answered we return a random one
          return Question.random();
        } else {
          // We return a random question from this collection
          var rand = Math.floor(Math.random() * questions.length);
          var question = questions[rand];
          return question;
        }
      })
      .then(question => question.populateQuestion())
      .then(question => res.send(question))
      .catch(err => next(err));
  }
}

/**
 * Create a new question
 */
function createQuestion(req, res, next) {
  // Get the question data from the request
  var questionData = req.body;
  questionData.author = req.user;

  // Create question
  Question.create(questionData)
    .then(question => question.populateQuestion())
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Update a question
 */
function updateQuestion(req, res, next) {
  Question.findOne({_id: req.params.id})
    .then(function(question) {
      if (!question) {
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      var updatedQuestion = req.body;
      question.title = updatedQuestion.title;
      question.description = updatedQuestion.description;
      question.text = updatedQuestion.text;
      question.answers[0].text = updatedQuestion.answers[0].text;
      question.answers[1].text = updatedQuestion.answers[1].text;
      question.tags = updatedQuestion.tags;
      question.status = !!updatedQuestion.status ? updatedQuestion.status : 0;
      return question.save();
    })
    .then(question => question.populateQuestion())
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Delete a question
 */
function deleteQuestion(req, res, next) {
  Question.remove({_id: req.params.id})
    .then(function() {
      return User.find({});
    })
    .then(function(users) {
      // On supprime les références à la question supprimée dans les réponses utilisateurs
      // On ne s'occupe pas des réponses anonymes : elles sont automatiquement purgées
      var i;
      var j;
      var userModified;
      for (i = 0; i < users.length; i++) {
        for (j = users[i].answers.length - 1; j >= 0; j--) {
          if (users[i].answers[j].question.equals(req.params.id)) {
            users[i].answers.splice(j, 1);
            userModified = true;
          }
        }
        if (userModified) {
          users[i].save();
        }
      }
      res.send(req.params.id);
    })
    .catch(err => next(err));
}

/**
 * Answer a question
 */
function answerQuestion(req, res, next) {
  var questionId = req.params.id;
  var answerNumber = parseInt(req.params.answer, 10);
  var ip = requestIp.getClientIp(req);

  // The answer number must be 0 or 1
  if (answerNumber !== 0 && answerNumber !== 1) {
    return next(new Error('WRONG_ANSWER_NUMBER'));
  }

  Question.findOne({_id: questionId, status: 1})
    .then(function(question) {
      if (!question) { // Trying to answer a non existing question
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      return question.hasBeenAnswered(req.user, ip)
        .then(function(hasBeenAnswered) { // Has the question been answered ?
          if (hasBeenAnswered) { // Yes ! Throw an error
            if (req.isAuthenticated()) {
              throw new Error('QUESTION_ALREADY_ANSWERED');
            } else {
              throw new Error('QUESTION_ALREADY_ANSWERED_ANONYMOUS');
            }
          }
          // No ! Update the User or the IpAnswer table
          if (req.isAuthenticated()) { // Authenticated mode
            // First push the new answer to the user.answers field
            if (!req.user.answers) {
              req.user.answers = [];
            }
            req.user.answers.push({
              question: questionId,
              answer: answerNumber
            });
            // And save !
            return req.user.save();
          } else { // Anonymous mode
            // Try to get the ipAnswer entry for the user
            return IpAnswer.findOne({ip: ip}).then(function(ipAnswer) {
              if (!ipAnswer) {
                throw new Error('UNKNOWN_ERROR');
              }
              ipAnswer.answers.push({
                question: questionId,
                answer: answerNumber
              });
              return ipAnswer.save();
            }).catch(err => next(err));
          }
        })
        .then(function() { // Update the question
          question.answers[answerNumber].votes = question.answers[answerNumber].votes + 1;
          return question.save();
        })
        .then(question => question.populateQuestion())
        .then(question => res.send(question))
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

/**
 * Upvote a question
 */
function upvoteQuestion(req, res, next) {
  var i;
  var questionId = req.params.id;

  Question.findOne({_id: questionId, status: 1})
    .then(function(question) {
      if (!question) {
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      for (i = 0; i < req.user.upvotes.length; i++) {
        if (req.user.upvotes[i].equals(questionId)) {
          throw new Error('QUESTION_ALREADY_UPVOTED');
        }
      }
      req.user.upvotes.push(question._id);
      var saveUser = req.user.save();
      question.upvotes = question.upvotes + 1;
      var saveQuestion = question.save();
      return Promise.all([saveQuestion, saveUser]);
    })
    .then(function(results) {
      var question = results[0];
      return question.populateQuestion();
    })
    .then(question => res.send(question))
    .catch(err => next(err));
}
