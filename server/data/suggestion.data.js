var mongoose = require('mongoose');
var Promise = require('bluebird');
var Suggestion;

/**
 * Create default suggestions in the db
 */
exports.createDefaultEntries = function() {
  if (!Suggestion) {
    Suggestion = mongoose.model('Suggestion');
  }
  Suggestion.find({}).then(function(collection) {
    if (collection.length === 0) {
      var createSuggestions = [Suggestion.create({
        text: 'Would you rather',
        answers: [{
          text: 'eat beef'
        }, {
          text: 'eat chicken'
        }],
        published: new Date('1/1/2015'),
        tags: ['food', 'preferences']
      }), Suggestion.create({
        text: 'Do you prefer',
        answers: [{
          text: 'green'
        }, {
          text: 'blue'
        }],
        published: new Date('1/1/2015'),
        tags: ['color']
      })];
      return Promise.all(createSuggestions);
    } else {
      return Promise.resolve();
    }
  });
};
