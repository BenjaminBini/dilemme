'use strict';

/**
 * Question service tests
 */
var expect = require('chai').expect;
var questionService = require('../../../server/services/question.service');
var userService = require('../../../server/services/user.service');
var Promise = require('bluebird');

module.exports = function() {
  describe('Service: Question', function() {
    describe('#getQuestions', function() {
      it('should return all questions', function() {
        return questionService.getQuestions()
          .should.be.fulfilled
          .then(questions => questions.length.should.be.above(0));
      });
    });
    describe('#getPublishedQuestions', function() {
      it('should return all published questions', function() {
        return questionService.getPublishedQuestions()
          .should.be.fulfilled
          .then(questions => questions.length.should.be.above(0));
      });
    });
    describe('#count', function() {
      it('should return the number of questions', function() {
        return questionService.count()
          .then(count => count.should.be.above(0));
      });
    });
    describe('#getQuestionsByAuthor', function() {
      it('should return the questions written by a specific user', function() {
        return userService.getUserByUsername('joe')
          .then(user => questionService.getQuestionsByAuthor(user._id))
          .should.be.fulfilled
          .then(questions => questions.length.should.equal(3));
      });
    });
    describe('#getQuestionsByTag', function() {
      it('should return the questions having a specific tag', function() {
        return questionService.getQuestionsByTag('sport')
          .should.be.fulfilled
          .then(questions => questions.length.should.be.above(0));
      });
    });
    describe('#getQuestionById', function() {
      it('should return the question with a specific id', function() {
        return questionService.getQuestionById('563237258d2528ac0b65edc8')
          .should.be.fulfilled;
      });
      it('should not return a question if the id does not exist', function() {
        return questionService.getQuestionById('563237258d2528ac0b65edc9')
          .should.be.rejectedWith(Error, 'QUESTION_DOES_NOT_EXIST');
      });
      it('should not return the question if it is not published and user is not an admin', function() {
        return questionService.getQuestionById('56323699a65ccd98297256dd', false)
          .should.be.rejectedWith(Error, 'NOT_AUTHORIZED');
      });
    });
    describe('#getRandomQuestion', function() {
      it('should return a random question', function() {
        return questionService.getRandomQuestion()
          .should.be.fulfilled;
      });
    });
    describe('#getUnansweredRandomQuestion', function() {
      it('should return a random unanswered question', function() {
        var userAnswers = [{
          question: '5632378d8d2528ac0b65edcb'
        }, {
          question: '563237258d2528ac0b65edc8'
        }];
        var userAnswersQuestions = userAnswers.map(answer => answer.question);

        var randomQuestions = [];
        for (let i = 0; i < 100; i++) {
          randomQuestions.push(questionService.getUnansweredRandomQuestion(userAnswers));
        }
        return Promise.all(randomQuestions)
          .should.be.fulfilled
          .then(function(randomQuestions) {
            for (let randomQuestion of randomQuestions) {
              expect(userAnswersQuestions).not.to.include(randomQuestion._id);
            }
          });
      });
    });
    describe('#createQuestion', function() {
      it('#should create a new question', function() {
        var questionData = {
          title: {
            en: 'TestQuestion',
            fr: 'Question test'
          },
          description: {
            en: 'Description',
            fr: 'Description'
          },
          text: {
            en: 'Question text',
            fr: 'Texte question'
          },
          answers: [{
            text: {
              en: 'Answer 1',
              fr: 'Réponse 1'
            },
            votes: 0
          },
          {
            text: {
              en: 'Answer 2',
              fr: 'Réponse 2'
            },
            votes: 0
          }]
        };
        return userService.getUserByUsername('ben')
          .then(author => questionService.createQuestion(questionData, author))
          .should.be.fulfilled
          .then(question => question.author.username.should.equal('ben') && question.status.should.equal(0));
      });
      it('#should not create a new question with a wrong format', function() {
        var questionData = {
          title: {
            en: 'TestQuestion',
            fr: 'Question test'
          },
          description: {
            en: 'Description',
            fr: 'Description'
          },
          text: {
            en: 'Question text',
            fr: 'Texte question'
          },
          answers: [{
            text: {
              en: 'Answer 1',
              fr: 'Réponse 1'
            },
            votes: 0
          }, {
            text: {
              en: 'Answer 2',
              fr: 'Réponse 2'
            },
            votes: 0
          }, {
            text: {
              en: 'Answer 3',
              fr: 'Réponse 3'
            },
            votes: 0
          }]
        };
        return userService.getUserByUsername('ben')
          .then(author => questionService.createQuestion(questionData, author))
          .should.be.rejected;
      });
    });
    describe('#updateQuestion', function() {
      it('should update a question', function() {
        return questionService.getRandomQuestion()
          .then(function(randomQuestion) {
            var questionId = randomQuestion._id;
            var questionData = {
              title: {
                en: 'TestQuestion',
                fr: 'Question test'
              },
              description: {
                en: 'Description',
                fr: 'Description'
              },
              text: {
                en: 'Question text',
                fr: 'Texte question'
              },
              answers: [{
                text: {
                  en: 'Answer 1',
                  fr: 'Réponse 1'
                },
                votes: 0
              }, {
                text: {
                  en: 'Answer 2',
                  fr: 'Réponse 2'
                },
                votes: 0
              }, {
                text: {
                  en: 'Answer 3',
                  fr: 'Réponse 3'
                },
                votes: 0
              }]
            };
            return questionService.updateQuestion(questionId, questionData);
          })
          .should.be.fulfilled
          .then(question => question.title.en.should.equal('TestQuestion'));
      });
      it('should not update a question with a wrong id', function() {
        var questionId = '563237258d2528ac0b65edc9';
        var questionData = {};
        return questionService.updateQuestion(questionId, questionData)
          .should.be.rejectedWith(Error, 'QUESTION_DOES_NOT_EXIST');
      });
    });
    describe('#deleteQuestion', function() {
      it('should delete a question and its references around the application', function() {
        return questionService.deleteQuestion('56323445a65ccd98297256d5')
        .should.be.fulfilled
        .then(() => userService.getUserByUsername('joe'))
        .then(function(joe) {
          var joeAnsweredQuestions = joe.answers.map(answer => answer.question);
          expect(joeAnsweredQuestions).not.include('56323445a65ccd98297256d5');
        });
      });
    });
    describe('#answerQuestion', function() {
      it('should answer the question correctly when an authenticated user answers', function() {
        var questionId;
        var answerNumber = 0;
        var isAuthenticated = true;
        var user;
        var previousAnswerVotesCount;
        return questionService.getQuestionById('56323445a65ccd98297256d5')
          .then(function(question) {
            questionId = question._id;
            previousAnswerVotesCount = question.answers[answerNumber].votes;
          })
          .then(() => userService.getUserById('56323445a65ccd98297256ca'))
          .then(ben => { user = ben; })
          .then(() => questionService.answerQuestion(questionId, answerNumber, isAuthenticated, user))
          .should.be.fulfilled
          .then(function(question) {
            question.answers[answerNumber].votes.should.equal(previousAnswerVotesCount + 1);
          });
      });
    });
    describe('#upvoteQuestion', function() {
    });
  });
};
