var expect = require('chai').expect;
var should = require('chai').should();
var questionSchema = require('../../../server/schemas/question.schema');
var Question = require('mongoose').model('Question', questionSchema.schema);

require('../../utils/db.utils')();

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
});
