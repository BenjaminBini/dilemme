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
      /*
      
      it('should return a random unanswered question', function() {
        var userAnswers = [{
          question: '5632378d8d2528ac0b65edcb'
        }, {
          question: '563237258d2528ac0b65edc8'
        }];

        var randomQuestions = [];
        for (let i = 0; i < 100; i++) {
          randomQuestions.push(questionService.getUnansweredRandomQuestion(userAnswers));
        }
        return Promise.all(randomQuestions)
          .should.be.fulfilled
          .then(questions => questions.map(
              question => expect(userAnswers).to.include(question._id))
            );
        */
      });
    });
    describe('#createQuestion', function() {

    });
    describe('#updateQuestion', function() {

    });
    describe('#deleteQuestion', function() {

    });
    describe('#answerQuestion', function() {

    });
    describe('#upvoteQuestion', function() {

    });
  });
};
