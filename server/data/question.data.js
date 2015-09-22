var mongoose = require('mongoose');
var Question;

/**
 * Create default questions in the db
 */
exports.createDefaultEntries = function() {
  if (!Question) {
    Question = mongoose.model('Question');
  }
  Question.find({}).exec(function(err, collection) {
    if (!Question) {
      Question = mongoose.model('Question');
    }
    if (err) {
      return;
    }
    if (collection.length === 0) {
      Question.create({
        text: {
          en: 'Would you rather',
          fr: 'Préférez-vous'
        },
        answers: [{
          text: {
            en: 'eat beef',
            fr: 'manger du boeuf'
          },
          votes: 10
        }, {
          text: {
            en: 'eat chicken',
            fr: 'manger du poulet'
          }
        }],
        published: new Date('1/1/2015'),
        tags: ['food', 'preferences'],
        status: 1
      });
      Question.create({
        text: {
          en: 'Do you prefer',
          fr: 'Préférez-vous'
        },
        answers: [{
          text: {
            en: 'green',
            fr: 'vert'
          }
        }, {
          text: {
            en: 'blue',
            fr: 'bleu'
          },
          votes: 2
        }],
        published: new Date('1/1/2015'),
        tags: ['color'],
        status: 1
      });
      Question.create({
        text: {
          en: 'Would you rather',
          fr: 'Préférez-vous'
        },
        answers: [{
          text: {
            en: 'go to Italy',
            fr: 'aller en Italie'
          },
          votes: 10
        }, {
          text: {
            en: 'go to France',
            fr: 'aller en France'
          },
          votes: 15
        }],
        published: new Date('1/1/2015')
      });
    }
    console.log('Questions collection has ' + collection.length + ' entries');
  });
};
