/**
 * Questions controller
 */
var requestIp = require('request-ip');
var mongoose = require('mongoose');
var Question = mongoose.model('Question');
var User = mongoose.model('User');
var IpAnswers = mongoose.model('IpAnswers');

/**
 * Return array of all questions
 * @param   req Request
 * @param   res Response
 * @return      Array of all questions
 */
exports.getQuestions = function (req, res) {
  Question.find({}).exec(function (err, collection) {
    if (err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    return res.send(collection);
  });
};

/**
 * Return array of published questions
 */
exports.getPublishedQuestions = function (req, res) {
  Question.find({status: 1}).exec(function (err, collection) {
    if (err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    return res.send(collection);
  });
};

/**
 * Count number of questions
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.count = function (req, res) {
  Question.count({}, function (err, count) {
    if (err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    res.send({count: count});
  });
};

/**
 * Return array of questions with the given author
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getQuestionsByAuthor = function (req, res) {
  // Check if the user is authorized (admin or current user)
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.send();
  }

  Question.find({author: req.params.id}).exec(function (err, collection) {
    if (err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    return res.send(collection);
  });
};

/**
 * Return array of questions with the given tag
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getQuestionsByTag = function (req, res) {
  Question.find({status: 1, tags: req.params.tag}).exec(function (err, collection) {
    if (err) {
      return;
    }
    res.send(collection);
    return collection;
  });
};

/**
 * Return a question by its id
 * @param  {[type]}   req  Request
 * @param  {[type]}   res  Response
 * @return {[type]}      The question with the given id
 */
exports.getQuestionById = function (req, res) {
  Question.findOne({_id: req.params.id}).exec(function (err, question) {
    if (err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    if (!question) {
      res.status(400);
      return res.send({reason: 'QUESTION_DOES_NOT_EXIST'});
    }
    // If the user is not an admin and the question is not published: not authorized
    if (question.status === 0 && !(req.user && req.user.hasRole('admin'))) {
      res.status(403);
      return res.send({reason: 'NOT_AUTHORIZED'});
    }
    question.populateQuestion().then(function () {
      return res.send(question);
    });
  });
};

/**
 * Return a random question
 * @param  {[type]}   req  Request
 * @param  {[type]}   res  Response
 * @return {[type]}      The question with the given id
 */
exports.getRandomQuestion = function (req, res) {
  Question.random(function (err, question) {
    question.populateQuestion().then(function () {
      return res.send(question);
    });
    return question;
  });
};

/**
 * Return a random question unanswered by the user
 * @param  {[type]}   req  Request
 * @param  {[type]}   res  Response
 * @return {[type]}      The question with the given id
 */
exports.getUnansweredRandomQuestion = function (req, res) {
  var i;
  if (!req.isAuthenticated()) {
    Question.random(function (err, question) {
      question.populateQuestion().then(function () {
        return res.send(question);
      });
    });
  } else {
    // We get already answered questions
    var answeredQuestions = [];
    for (i = 0; i < req.user.answers.length; i++) {
      answeredQuestions.push(req.user.answers[i].question);
    }
    // We look for question not in the collection of answered questions
    Question.find({status: 1}).where('_id').nin(answeredQuestions).exec(function (err, collection) {
      if (err) {
        return res.status(400).send({reason: err.toString()});
      }
      if (collection.length === 0) { // If all questions have been answered we return a random one
        return Question.random(function (err, question) {
          if (err) {
            res.status(400);
            return res.send({reason: err.toString()});
          }
          question.populateQuestion().then(function () {
            return res.send(question);
          });
        });
      }
      // We return a random question from this collection
      var rand = Math.floor(Math.random() * collection.length);
      var question = collection[rand];
      question.populateQuestion().then(function () {
        return res.send(question);
      });
    });
  }
};

/**
 * Create a new question
 * @param  {[type]}   req  Request
 * @param  {[type]}   res  Response
 * @param  {Function} next Next
 * @return {[type]}        Created question
 */
exports.createQuestion = function (req, res) {
  // Get the question data from the request
  var questionData = req.body;
  questionData.author = req.user;

  // Create question
  Question.create(questionData, function (err, question) {
    if (err) {
      // Return 400 code with the error
      res.status(400);
      return res.send({reason: err.toString()});
    }
    // If no error, return the question
    question.populateQuestion().then(function () {
      return res.send(question);
    });
  });
};

/**
 * Update a question
 * @param  {[type]}   req  Request
 * @param  {[type]}   res  Response
 * @return {[type]}        Updated question
 */
exports.updateQuestion = function (req, res) {

  var updatedQuestion = req.body;
  Question.findOne({_id: req.params.id}).exec(function (err, question) {
    if (!question) {
      // If an error occur, return error 400 with the error
      res.status(400);
      return res.send({
        reason: err.toString()
      });
    }
    question.title = updatedQuestion.title;
    question.description = updatedQuestion.description;
    question.text = updatedQuestion.text;
    question.answers[0].text = updatedQuestion.answers[0].text;
    question.answers[1].text = updatedQuestion.answers[1].text;
    question.tags = updatedQuestion.tags;
    question.status = !!updatedQuestion.status ? updatedQuestion.status : 0;
    question.save(function (err) {
      if (err) {
        // If an error occur, return error 400 with the error
        res.status(400);
        return res.send({
          reason: err.toString()
        });
      }
      // Send and return the user
      question.populateQuestion().then(function () {
        return res.send(question);
      });
      return question;
    });
  });
};

/**
 * Delete a question
 * @param  {[type]} req   Request
 * @param  {[type]} resp  Response
 * @return {[type]}         Deleted id
 */
exports.deleteQuestion = function (req, res) {
  Question.remove({ _id: req.params.id}, function (err) {
    if (err) {
      res.status(400);
      return res.send({
        reason: err.toString()
      });
    }
    // On supprime les références à la question supprimée dans les réponses utilisateurs
    // On ne s'occupe pas des réponses anonymes : elles sont automatiquement purgées
    User.find({}).exec(function (err, users) {
      var i, j, userModified;
      if (err) {
        console.log(err.stack);
        res.status(400);
        return res.send({
          reason: 'ERROR_WITH_USERS'
        });
      }
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
      return res.send(req.params.id);
    });
  });
};

/**
 * Answer a question
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.answerQuestion = function (req, res) {
  var questionId = req.params.id;
  var answerNumber = parseInt(req.params.answer, 10);
  var ip = requestIp.getClientIp(req);

  // The answer number must be 0 or 1
  if (answerNumber !== 0 && answerNumber !== 1) {
    return res.status(400).send({
      reason: 'WRONG_ANSWER_NUMBER'
    });
  }

  // Let's get the question we want and update it and the user
  Question.findOne({_id: questionId, status: 1}).exec(function (err, question) {
    // Is no question is found, send a 400
    if (err) {
      return res.status(400).send({
        reason: 'QUESTION_DOES_NOT_EXIST'
      });
    }

    question.hasBeenAnswered(req.user, ip).then(function (hasBeenAnswered) {
      var reason;
      if (hasBeenAnswered) { // If the user has already answered the question, send a 400
        if (req.isAuthenticated()) {
          reason = 'QUESTION_ALREADY_ANSWERED';
        } else {
          reason = 'QUESTION_ALREADY_ANSWERED_ANONYMOUS';
        }
        return res.status(400).send({
          reason: reason
        });
      } else {
        if (req.isAuthenticated()) { // Authenticated mode, push the new answer to user answers list 
          // If the user has no answer object yet (it should not happen, but let's try not to take any risk)
          if (!req.user.answers) {
            req.user.answers = [];
          }
          req.user.answers.push({
            question: questionId,
            answer: answerNumber
          });

          // Save the user
          req.user.save(function (err) {
            if (err) {
              return res.status(400).send({
                reason: err.toString()
              });
            }
          });

        } else { // Anonymous mode

          IpAnswers.findOne({ip: ip}, function (err, ipAnswers) {
            if (err || !ipAnswers) {
              if (err) {
                reason = err.toString();
              } else {
                reason = 'UNKNOWN_ERROR';
              }
              return res.status(400).send({
                reason: reason
              });
            }
            ipAnswers.answers.push({
              question: questionId,
              answer: answerNumber
            });
            ipAnswers.save(function (err) {
              if (err) {
                return res.status(400).send({
                  reason: err.toString()
                });
              }
            });
          });
        }

        // Increase the vote number and save the question
        question.answers[answerNumber].votes = question.answers[answerNumber].votes + 1;
        question.save(function (err) {
          if (err) {
            return res.status(400).send({
              reason: err.toString()
            });
          }

          question.populateQuestion().then(function () {
            return res.send(question);
          });
        });
      }
    });
  });
};

/**
 * Upvote a question
 * @param  {[type]} req Request
 * @param  {[type]} res Response
 * @return {[type]}     
 */
exports.upvoteQuestion = function (req, res) {
  var i;
  var questionId = req.params.id;
  Question.findOne({_id: questionId, status: 1}).exec(function (err, question) {
    if (!question) {
      // If an error occur, return error 400 with the error
      res.status(400);
      return res.send({
        reason: err.toString()
      });
    }
    for (i = 0; i < req.user.upvotes.length; i++) {
      if (req.user.upvotes[i].equals(questionId)) {
        res.status(400);
        return res.send({
          reason: 'QUESTION_ALREADY_UPVOTED'
        });
      }
    }
    req.user.upvotes.push(question._id);
    // Save the user
    req.user.save(function (err) {
      if (err) {
        return res.status(400).send({
          reason: err.toString()
        });
      }
      question.upvotes = question.upvotes + 1;
      question.save(function (err) {
        if (err) {
          // If an error occur, return error 400 with the error
          res.status(400);
          return res.send({
            reason: err.toString()
          });
        }
        // Send and return the question
        question.populateQuestion().then(function () {
          return res.send(question);
        });
      });
    });
  });
};