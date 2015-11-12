'use strict';

var mongoose = require('mongoose');

/**
 * Suggestion schema instance methods
 */
exports.methods = {
  populateSuggestion: populateSuggestion
};

/**
 * Populate a suggestion with its auther username
 */
function populateSuggestion() {
  var Suggestion = mongoose.model('Suggestion');
  var suggestion = this;
  return Suggestion.populate(suggestion, [{
    path: 'author',
    select: 'username',
    model: 'User'
  }]);
}
