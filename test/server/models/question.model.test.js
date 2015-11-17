var expect = require('chai').expect;
var should = require('chai').should();
var questionSchema = require('../../../server/schemas/question.schema');
var userSchema = require('../../../server/schemas/user.schema');
var Question = require('mongoose').model('Question', questionSchema.schema);
var User = require('mongoose').model('User', userSchema.schema);

module.exports = function() {
  var question = {
    text: {
      en: 'Would you rather',
      fr: 'Préférez-vous'
    },
    answers: [{
      text: {
        en: 'fly me to the moon',
        fr: 'aller sur la lune'
      },
      votes: 10
    }, {
      text: {
        en: 'dance among the stars',
        fr: 'danser parmi les étoiles'
      }
    }],
    published: new Date('1/1/2015'),
    tags: ['food', 'preferences'],
    status: 1
  };

  describe('Model: Question', function() {
    it('should create a new Question', function() {
      return Question.create(question).should.be.fulfilled.then(function(newQuestion) {
        expect(newQuestion).to.exist;
        newQuestion.text.en.should.equal('Would you rather');
        newQuestion.text.fr.should.equal('Préférez-vous');
        newQuestion.answers.length.should.equal(2);
        newQuestion.answers[1].votes.should.equal(0);
        newQuestion.answers[1].text.en.should.equal('dance among the stars');
        newQuestion.tags.length.should.equal(2);
      });
    });
    it('should not create a new Question without text', function() {
      delete question.text;
      return Question.create(question).should.be.rejected;
    });
    it('should confirm that a new anonymous user did not answer a question', function() {
      return Question.findOne({'title.en': 'JoeAnsweredIt'}).should.be.fulfilled
        .then(question => question.hasBeenAnswered(undefined, 'test-ip')).should.be.fulfilled
        .then(hasBeenAnswered => hasBeenAnswered.should.equal(false));
    });
    it('should confirm that a returning anonymous user answered the question "JoeCreatedIt"', function() {
      return Question.findOne({'title.en': 'JoeCreatedIt'}).should.be.fulfilled
        .then(question => question.hasBeenAnswered(undefined, 'ip-with-an-answer-for-joecreatedit')).should.be.fulfilled
        .then(hasBeenAnswered => hasBeenAnswered.should.equal(true));
    });
    it('should confirm that joe did not answered the question with the title "JoeDidNotAnswerIt"', function() {
      return Question.findOne({'title.en': 'JoeDidNotAnswerIt'}).should.be.fulfilled
        .then(function(question) {
          expect(question).to.exist;
          return User.findOne({username: 'joe'}).should.be.fulfilled
            .then(user => user.populateUser())
            .then(user => question.hasBeenAnswered(user)).should.be.fulfilled
            .then(function(hasBeenAnswered) {
              hasBeenAnswered.should.equal(false);
            }).should.be.fulfilled;
        });
    });
    it('should confirm that joe answered the question with the title "JoeAnsweredIt"', function() {
      return Question.findOne({'title.en': 'JoeAnsweredIt'}).should.be.fulfilled
        .then(function(question) {
          expect(question).to.exist;
          return User.findOne({username: 'joe'}).should.be.fulfilled
            .then(user => user.populateUser()).should.be.fulfilled
            .then(user => question.hasBeenAnswered(user)).should.be.fulfilled
            .then(function(hasBeenAnswered) {
              hasBeenAnswered.should.equal(true);
            }).should.be.fulfilled;
        });
    });
    it('should populate question with author name', function() {
      return Question.findOne({'title.en': 'JoeCreatedIt'}).should.be.fulfilled
        .then(question => question.populateQuestion()).should.be.fulfilled
        .then(function(question) {
          expect(question).to.exist;
          question.author.username.should.equal('joe');
        }).should.be.fulfilled;
    });
    it('should populate question with comments author names', function() {
      return Question.findOne({'title.en': 'JoeCommentedIt'}).should.be.fulfilled
        .then(question => question.populateQuestion()).should.be.fulfilled
        .then(function(question) {
          expect(question).to.exist;
          question.comments.length.should.equal(1);
          question.comments.map(function(comment) {
            comment.author.username.should.equal('joe');
          });
        }).should.be.fulfilled;
    });
    it('should return a random question', function() {
      return Question.random().should.be.fulfilled;
    });
    it('should reject the promise if no question in the database', function() {
      return Question.remove({}).should.be.fulfilled
        .then(Question.random)
        .should.be.rejectedWith(Error, 'NO_QUESTION_IN_DB');
    });
  });

};
