var Deferred = require('promised-io/promise').Deferred;
var mongoose = require('mongoose');
var IpAnswer;
var Question;

/**
 * Question schema methods
 */
exports.methods = {
  hasBeenAnswered: function(user, ip) {
    if (!IpAnswer) {
      IpAnswer = mongoose.model('IpAnswer');
    }
    var self = this;
    var q = new Deferred();
    var i;
    if (!user) { // Anonymous mode
      IpAnswer.find({ip: ip}, function(err, ipAnswers) {
        if (err) { // Error case : resolve with true
          q.resolve(true);
        } else {
          if (ipAnswers.length === 0) { // New user, we save it and initialize its IpAnswers entry
            IpAnswer.create({
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
    if (!Question) {
      Question = mongoose.model('Question');
    }
    var question = this;
    return Question.populate(question, [{
      path: 'comments.author',
      select: 'username answers',
      model: 'User'
    }, {
      path: 'author',
      select: 'username',
      model: 'User'
    }]);
  }
};

/**
 * Get a random question
 */
exports.statics = {
  random: function() {
    if (!Question) {
      Question = mongoose.model('Question');
    }
    var p = Question.count({status: 1}).then(function(count) {
      var rand = Math.floor(Math.random() * count);
      return Question.findOne({status: 1}).skip(rand);
    }).catch(function(err) {
      return Promise.reject(err);
    });
    return p;
  }
};
