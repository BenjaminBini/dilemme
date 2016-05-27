'use strict';

/**
 * Question controller
 */
var questionService = require('../services/question.service');
var requestIp = require('request-ip');

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
  questionService.getQuestions()
    .then(questions => res.send(questions))
    .catch(err => next(err));
}

/**
 * Return array of published questions
 */
function getPublishedQuestions(req, res, next) {
  questionService.getPublishedQuestions()
    .then(questions => res.send(questions))
    .catch(err => next(err));
}

/**
 * Count number of questions
 */
function count(req, res, next) {
  questionService.count()
    .then(count => res.send({count: count}))
    .catch(err => next(err));
}

/**
 * Return array of questions with the given author
 */
function getQuestionsByAuthor(req, res, next) {
  var userId = req.params.id;
  var currentUser = req.user;

  // Check if the user is authorized (admin or current user)
  if (currentUser != userId && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.send();
  }

  questionService.getQuestionsByAuthor(userId)
    .then(questions => res.send(questions))
    .catch(err => next(err));
}

/**
 * Return array of questions with the given tag
 */
function getQuestionsByTag(req, res, next) {
  var tag = req.params.tag;

  questionService.getQuestionsByTag(tag)
    .then(questions => res.send(questions))
    .catch(err => next(err));
}

/**
 * Return a question by its id
 */
function getQuestionById(req, res, next) {
  var questionId = req.params.id;
  var isAdmin = req.user && req.user.hasRole('admin');

  questionService.getQuestionById(questionId, isAdmin)
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Return a random question
 */
function getRandomQuestion(req, res, next) {
  questionService.getRandomQuestion()
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Return a random question unanswered by the user
 */
function getUnansweredRandomQuestion(req, res, next) {
  var userAnswers;
  if (req.isAuthenticated()) {
    userAnswers = req.user.answers;
  } else {
    userAnswers = [];
  }

  questionService.getUnansweredRandomQuestion(userAnswers)
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Create a new question
 */
function createQuestion(req, res, next) {
  var questionData = req.body;
  var author = req.user;

  questionService.createQuestion(questionData, author)
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Update a question
 */
function updateQuestion(req, res, next) {
  var questionId = req.params.id;
  var questionData = req.body;
  questionService.updateQuestion(questionId, questionData)
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Delete a question
 */
function deleteQuestion(req, res, next) {
  var questionId = req.params.id;
  questionService.deleteQuestion(questionId)
    .then(() => res.send(questionId))
    .catch(err => next(err));
}

/**
 * Answer a question
 */
function answerQuestion(req, res, next) {
  var questionId = req.params.id;
  var answerNumber = parseInt(req.params.answer, 10);
  var ip = requestIp.getClientIp(req);
  var user = req.user;
  var isAuthenticated = req.isAuthenticated();

  questionService.answerQuestion(questionId, answerNumber, isAuthenticated, user, ip)
    .then(question => res.send(question))
    .catch(err => next(err));
}

/**
 * Upvote a question
 */
function upvoteQuestion(req, res, next) {
  var questionId = req.params.id;
  var user = req.user;

  questionService.upvoteQuestion(questionId, user)
    .then(question => res.send(question))
    .catch(err => next(err));
}
