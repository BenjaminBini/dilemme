var Promise = require('bluebird');
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
    var i;
    if (!user) { // Anonymous mode
      return IpAnswer.find({ip: ip}).then(function(ipAnswers) { // Let's see if we recorder answers from this ip address
        if (ipAnswers.length === 0) { // New user, let's save and initialize IpAnswer entry
          return IpAnswer.create({
            ip: ip,
            answers: []
          });
        } else { // User already came recently on the website, we have his ipAnswers
          return ipAnswers;
        }
      }).then(function(ipAnswers) { // Let's see if the ipAnswers contains entries from this question
        var answers = ipAnswers[0]. answers;
        for (i = 0; i < answers.length; i++) {
          if (answers[i].question.equals(self._id)) {
            return Promise.resolve(true); // If yes the question has been answered
          }
          return Promise.resolve(false); // If no, it has not
        }
      }).catch(function() {
        return Promise.resolve(true);
      });
    } else { // Authenticated mode
      for (i = 0; i <  user.answers.length; i++) {
        if (user.answers[i].question._id.equals(self._id)) {
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(false);
    }
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
    return Question.count({status: 1}).then(function(count) {
      if (count === 0) {
        throw new Error('NO_QUESTION_IN_DB');
      }
      var rand = Math.floor(Math.random() * count);
      return Question.findOne({status: 1}).skip(rand);
    }).catch(function(err) {
      return Promise.reject(err);
    });
  }
};
