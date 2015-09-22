var mongoose = require('mongoose');
var Deffered = require('promised-io/promise').Deferred;
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
    var q = new Deffered();
    Suggestion.populate(suggestion, [{
      path: 'author',
      select: 'username',
      model: 'User'
    }], function(err) {
      if (err) {
        q.reject();
      } else {
        q.resolve(suggestion);
      }
    });
    return q.promise;
  }
};
