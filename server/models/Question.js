var mongoose = require('mongoose');
require('../models/IpAnswers');
var Deferred = require('promised-io/promise').Deferred;
var Question;

/**
 * Comment schema
 */
var commentSchema = mongoose.Schema({
  text: {
    type: String,
    required: '{PATH} is required'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    reference: 'User',
    required: '{PATH} is required'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

/**
 * Question schema
 */
var questionSchema = mongoose.Schema({
  title: {
    en: {
      type: String
    },
    fr: {
      type: String
    }
  },
  description: {
    en: {
      type: String
    },
    fr: {
      type: String
    }
  },
  text: {
    en: {
      type: String,
      required: '{PATH} is required'
    },
    fr: {
      type: String,
      required: '{PATH} is required'
    }
  },
  answers: [{
    text: {
      en: {
        type: String,
        required: '{PATH} is required'
      },
      fr: {
        type: String,
        required: '{PATH} is required'
      }
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  published: {
    type: Date,
    default: Date.now
  },
  upvotes: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String]
  },
  comments: [commentSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    reference: 'User'
  },
  status: {
    type: Number,
    default: 0
  }
});

var IpAnswers = mongoose.model('IpAnswers');

/**
 * Question schema methods
 */
questionSchema.methods = {
  hasBeenAnswered: function(user, ip) {
    var self = this;
    var q = new Deferred();
    var i;
    if (!user) { // Anonymous mode
      IpAnswers.find({ip: ip}, function(err, ipAnswers) {
        if (err) { // Error case : resolve with true
          q.resolve(true);
        } else {
          if (ipAnswers.length === 0) { // New user, we save it and initialize its IpAnswers entry
            IpAnswers.create({
              ip: ip,
              answers: []
            }, function(err) {
              if (err) {
                q.resolve(true);
              } else {
                q.resolve(false);
              }
            });
          } else if (ipAnswers.length === 1) { // Known user, we will work with his/her answers
            var answers = ipAnswers[0].answers;
            if (answers.length === 0) {
              q.resolve(false);
            }
            for (i = 0; i < answers.length; i++) {
              if (answers[i].question.equals(self._id)) {
                q.resolve(true);
                break;
              }
              if (i === answers.length - 1) {
                q.resolve(false);
              }
            }
          }
        }
      });
    } else { // Authenticated mode
      if (user.answers.length === 0) {
        q.resolve(false);
      }
      for (i = 0; i <  user.answers.length; i++) {
        if (user.answers[i].question._id.equals(self._id)) {
          q.resolve(true);
          break;
        }
        if (i === user.answers.length - 1) {
          q.resolve(false);
        }
      }
    }
    return q.promise;
  },
  populateQuestion: function() {
    var question = this;
    var q = new Deferred();
    Question.populate(question, [{
      path: 'comments.author',
      select: 'username answers',
      model: 'User'
    }, {
      path: 'author',
      select: 'username',
      model: 'User'
    }], function(err) {
      if (err) {
        q.reject();
      } else {
        q.resolve(question);
      }
    });
    return q.promise;
  }
};

/**
 * Get a random question
 */
questionSchema.statics.random = function(callback) {
  this.count({status: 1}, function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne({status: 1}).skip(rand).exec(callback);
  }.bind(this));
};

Question = mongoose.model('Question', questionSchema);

/**
 * Create default questions in the db
 */
exports.createDefaultEntries = function() {
  Question.find({}).exec(function(err, collection) {
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
