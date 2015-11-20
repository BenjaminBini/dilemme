var expect = require('chai').expect;
var suggestionSchema = require('../../../server/schemas/suggestion.schema');
var Suggestion = require('mongoose').model('Suggestion', suggestionSchema.schema);

module.exports = function() {
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
    describe('CRUD', function() {
      describe('#Create', function() {
        it('should create a new Suggestion', function() {
          return Suggestion.create(suggestion).should.be.fulfilled
            .then(function(newSuggestion) {
              expect(newSuggestion).to.exist;
              newSuggestion.text.should.equal('Would you rather');
              newSuggestion.answers.length.should.equal(2);
              newSuggestion.answers[1].text.should.equal('eat your papa');
              newSuggestion.tags.length.should.equal(3);
            });
        });
      });
    });
    describe('Static methods', function() {
      it('should populate the suggestion with its author', function() {
        return Suggestion.findOne({title: 'BenSuggestedIt'}).should.be.fulfilled
          .then(function(suggestion) {
            expect(suggestion.author.username).not.to.exist;
            return suggestion;
          })
          .then(suggestion => suggestion.populateSuggestion()).should.be.fulfilled
          .then(function(suggestion) {
            expect(suggestion).to.exist;
            suggestion.author.username.should.equal('ben');
          });
      });
    });
  });
};
