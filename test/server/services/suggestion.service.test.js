'use strict';

/**
 * Suggestions service tests
 */
var expect = require('chai').expect;
var suggestionService = require('../../../server/services/suggestion.service');
var User = require('mongoose').model('User');

module.exports = function() {
  describe('Service: Suggestion', function() {
    describe('#getSuggestions', function() {
      it('should return all suggestions', function() {
        return suggestionService.getSuggestions().should.be.fulfilled
          .then(function(suggestions) {
            suggestions.length.should.be.above(0);
          });
      });
    });
    describe('#getSuggestionById', function() {
      it('should return a suggestion', function() {
        return suggestionService.getSuggestionById('563cd9d56a95e75834450c4c')
        .should.be.fulfilled
        .then(function(suggestion) {
          suggestion.text.should.equal('BenSuggestedIt');
        });
      });
      it('should return an error', function() {
        return suggestionService.getSuggestionById('563cd9d56a95e75834450c4d')
          .should.be.rejectedWith(Error, 'SUGGESTION_DOES_NOT_EXIST');
      });
    });
    describe('#getSuggestionByUser', function() {
      it('should return one suggestion for user "ben"', function() {
        return User.findOne({username: 'ben'}).should.be.fulfilled
          .then(function(user) {
            expect(user).to.exist;
            return suggestionService.getSuggestionsByUser(user.id);
          }).should.be.fulfilled
          .then(function(suggestions) {
            suggestions.length.should.equal(1);
            suggestions[0].text.should.equal('BenSuggestedIt');
          });
      });
    });
    describe('#createSuggestion', function() {
      it('should create a new suggestion', function() {
        var suggestionData = {
          title: 'leoSuggestionTitle',
          text: 'leoSuggestionText',
          answers: [{text: 'answer1'}, {text: 'answer2'}]
        };
        var userId;
        return User.findOne({username: 'leo'}).should.be.fulfilled
          .then(function(user) {
            userId = user.id;
            expect(user).to.exist;
            return suggestionService.createSuggestion(suggestionData, user);
          }).should.be.fulfilled
          .then(function(suggestion) {
            expect(suggestion).to.exist;
            suggestion.author.toString().should.equal(userId);
            suggestion.title.should.equal('leoSuggestionTitle');
          });
      });
    });
    describe('#deleteSuggestion', function() {

    });
    describe('#validateSuggestion', function() {

    });
  });
};
