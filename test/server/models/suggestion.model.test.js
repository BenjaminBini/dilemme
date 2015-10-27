var expect = require('chai').expect;
var should = require('chai').should();
var suggestionSchema = require('../../../server/schemas/suggestion.schema');
var Suggestion = require('mongoose').model('Suggestion', suggestionSchema.schema);

require('../../utils/db.utils')();

var suggestion = {
  text: 'Would you rather',
  answers: [{
    text: 'eat your mama',
    votes: 10
  }, {
    text: 'eat your papa'
  }],
  published: new Date('1/1/2015'),
  tags: ['food', 'preferences', 'family']
};

describe('Model: Suggestion', function() {
  it('should create a new Suggestion', function(done) {
    return Suggestion.create(suggestion, function(err, newSuggestion) {
      expect(err).not.to.exist;
      expect(newSuggestion).to.exist;
      newSuggestion.text.should.equal('Would you rather');
      newSuggestion.answers.length.should.equal(2);
      newSuggestion.answers[1].text.should.equal('eat your papa');
      newSuggestion.tags.length.should.equal(3);
      return done();
    });
  });
});
