var mongoose = require('mongoose');
var Suggestion;

/**
 * Suggestion schema instance methods
 */
exports.methods = {
  populateSuggestion: function() {
    if (!Suggestion) {
      Suggestion = mongoose.model('Suggestion');
    }
    var suggestion = this;
    return Suggestion.populate(suggestion, [{
      path: 'author',
      select: 'username',
      model: 'User'
    }]);
  }
};
