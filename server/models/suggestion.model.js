var mongoose = require('mongoose');

/**
 * Suggestion schema instance methods
 */
exports.methods = {
  populateSuggestion: function() {
    var Suggestion = mongoose.model('Suggestion');
    var suggestion = this;
    return Suggestion.populate(suggestion, [{
      path: 'author',
      select: 'username',
      model: 'User'
    }]);
  }
};
