var mongoose = require('mongoose');
var Deffered = require("promised-io/promise").Deferred;

/**
 * Suggestion schema (same as Question schema)
 */
var suggestionSchema = mongoose.model('Question').schema;


/**
 * Suggestion schema methods
 */
suggestionSchema.methods = {
  populateSuggestion: function () {
    var suggestion = this;
    var q = new Deffered();
    Suggestion.populate(suggestion, [{
      path: 'author',
      select: 'username',
      model: 'User'
    }], function (err) {
      if (err) {
        q.reject();
      } else {
        q.resolve(suggestion);
      }
    });
    return q.promise;
  }
};


/**
 * Create default suggestions in the db
 */
exports.createDefaultEntries = function () {
  Suggestion.find({}).exec(function (err, collection) {
    if (err) {
      return;
    }
    if (collection.length === 0) {
      Suggestion.create({
        text: 'Would you rather',
        answers: [{
          text: 'eat beef',
          votes: 10
        }, {
          text: 'eat chicken'
        }],
        published: new Date('1/1/2015'),
        tags: ['food', 'preferences']
      });
      Suggestion.create({
        text: 'Do you prefer',
        answers: [{
          text: 'green'
        }, {
          text: 'blue',
          votes: 2
        }],
        published: new Date('1/1/2015'),
        tags: ['color']
      });
    }
    console.log('Suggestions collection has ' + collection.length + ' entries');
  });
};

var Suggestion = mongoose.model('Suggestion', suggestionSchema);