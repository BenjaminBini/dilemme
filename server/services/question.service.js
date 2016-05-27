'use strict';

/**
 * Questions service
 */
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
function getQuestions() {
  return Question.find({});
}

/**
 * Return array of published questions
 */
function getPublishedQuestions() {
  return Question.find({status: 1});
}

/**
 * Count number of questions
 */
function count() {
  return Question.count({});
}

/**
 * Return array of questions with the given author
 */
function getQuestionsByAuthor(userId) {
  return Question.find({author: userId});
}

/**
 * Return array of questions with the given tag
 */
function getQuestionsByTag(tag) {
  return Question.find({status: 1, tags: tag});
}

/**
 * Return a question by its id
 */
function getQuestionById(questionId, isAdmin) {
  return Question.findOne({_id: questionId})
    .then(function(question) {
      if (!question) {
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      if (question.status === 0 && !isAdmin) {
        throw new Error('NOT_AUTHORIZED');
      }
      return question;
    })
    .then(question => question.populateQuestion());
}

/**
 * Return a random question
 */
function getRandomQuestion() {
  return Question.random()
    .then(question => question.populateQuestion());
}

/**
 * Return a random question unanswered by the user
 */
function getUnansweredRandomQuestion(userAnswers) {
  var i;
  // We get already answered questions
  var answeredQuestions = [];
  for (i = 0; i < userAnswers.length; i++) { // TODO: lambda
    answeredQuestions.push(userAnswers[i].question);
  }
  // We look for a published question not in the collection of answered questions
  return Question.find({status: 1}).where('_id').nin(answeredQuestions)
    .then(function(questions) {
      if (questions.length === 0) { // If all questions have been answered we return a random one
        return getRandomQuestion();
      } else {
        // We return a random question from this collection
        var rand = Math.floor(Math.random() * questions.length);
        var question = questions[rand];
        return question;
      }
    })
    .then(question => question.populateQuestion());
}

/**
 * Create a new question
 */
function createQuestion(questionData, author) {
  questionData.author = author;
  return Question.create(questionData)
    .then(question => question.populateQuestion());
}

/**
 * Update a question
 */
function updateQuestion(questionId, questionData) {
  return Question.findOne({_id: questionId})
    .then(function(question) {
      if (!question) {
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      question.title = questionData.title;
      question.description = questionData.description;
      question.text = questionData.text;
      question.answers[0].text = questionData.answers[0].text;
      question.answers[1].text = questionData.answers[1].text;
      question.tags = questionData.tags;
      question.status = !!questionData.status ? questionData.status : 0;
      return question.save();
    })
    .then(question => question.populateQuestion());
}

/**
 * Delete a question
 */
function deleteQuestion(questionId) {
  return Question.remove({_id: questionId})
    .then(() => User.find({}))
    .then(function(users) {
      // On supprime les références à la question supprimée dans les réponses utilisateurs
      // On ne s'occupe pas des réponses anonymes : elles sont automatiquement purgées
      var userModified;
      for (let i = 0; i < users.length; i++) {
        userModified = false;
        for (let j = users[i].answers.length - 1; j >= 0; j--) {
          console.log(users[i].answers[j].question);
          if (users[i].answers[j].question.equals(questionId)) {
            users[i].answers.splice(j, 1);
            userModified = true;
          }
        }
        if (userModified) {
          users[i].save();
        }
      }
    });
}

/**
 * Answer a question
 */
function answerQuestion(questionId, answerNumber, isAuthenticated, user, ip) {
  // The answer number must be 0 or 1
  if (answerNumber !== 0 && answerNumber !== 1) {
    return Promise.reject(new Error('WRONG_ANSWER_NUMBER'));
  }

  return Question.findOne({_id: questionId, status: 1})
    .then(function(question) {
      if (!question) { // Trying to answer a non existing question
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      return question.hasBeenAnswered(user, ip)
        .then(function(hasBeenAnswered) { // Has the question been answered ?
          if (hasBeenAnswered) { // Yes ! Throw an error
            if (isAuthenticated) {
              throw new Error('QUESTION_ALREADY_ANSWERED');
            } else {
              throw new Error('QUESTION_ALREADY_ANSWERED_ANONYMOUS');
            }
          }
          // No ! Update the User or the IpAnswer table
          if (isAuthenticated) { // Authenticated mode
            // First push the new answer to the user.answers field
            if (!user.answers) {
              user.answers = [];
            }
            user.answers.push({
              question: questionId,
              answer: answerNumber
            });
            // And save !
            return user.save();
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
            });
          }
        })
        .then(function() { // Update the question
          question.answers[answerNumber].votes = question.answers[answerNumber].votes + 1;
          return question.save();
        })
        .then(question => question.populateQuestion());
    });
}

/**
 * Upvote a question
 */
function upvoteQuestion(questionId, user) {
  var i;

  return Question.findOne({_id: questionId, status: 1})
    .then(function(question) {
      if (!question) {
        throw new Error('QUESTION_DOES_NOT_EXIST');
      }
      for (i = 0; i < user.upvotes.length; i++) {
        if (user.upvotes[i].equals(questionId)) {
          throw new Error('QUESTION_ALREADY_UPVOTED');
        }
      }
      user.upvotes.push(question._id);
      var saveUser = user.save();
      question.upvotes = question.upvotes + 1;
      var saveQuestion = question.save();
      return Promise.all([saveQuestion, saveUser]);
    })
    .then(function(results) {
      var question = results[0];
      return question.populateQuestion();
    });
}
