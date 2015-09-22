var mongoose = require('mongoose');
var Suggestion;

/**
 * Create default suggestions in the db
 */
exports.createDefaultEntries = function() {
  if (!Suggestion) {
    Suggestion = mongoose.model('User');
  }
  Suggestion.find({}).exec(function(err, collection) {
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
