var mongoose = require('mongoose');
var userModel = require('../models/user.model.js');

/**
 * User schema
 */
exports.schema = mongoose.Schema({
  username: {
    type: String,
    required: '{PATH} is required',
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    requred: '{PATH} is requred',
    unique: true,
    lowercase: true
  },
  salt: {type: String, required: '{PATH} is required'},
  hashedPassword: {
    type: String,
    required: '{PATH} is required'
  },
  roles: [String],
  registrationDate: {
    type: Date,
    default: Date.now
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: '{PATH} is required'
    },
    answer: {
      type: Number,
      required: '{PATH} is required'
    }
  }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  commentUpvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

/**
 * User schema instance methods
 */
exports.schema.methods = userModel.methods;

/**
 * User schema static methods
 */
exports.schema.statics = userModel.statics;

exports.schema.virtual('stats').get(function() {
  var answers = this.answers;
  var stats = {};
  var i;
  var j;
  var k;

  // Answered questions
  stats.answered = this.answers.length;

  // Color stats
  var redAnswers = 0;
  var blueAnswers = 0;
  for (i = 0; i < answers.length; i++) {
    if (answers[i].answer === 0) {
      redAnswers++;
    } else {
      blueAnswers++;
    }
  }
  stats.color = {
    red: redAnswers,
    blue: blueAnswers
  };

  // Agreement with majority
  var agree = 0;
  var userAnswer;
  for (i = 0; i < answers.length; i++) {
    userAnswer = answers[i].answer;
    if (answers[i].question.answers[userAnswer].votes >= answers[i].question.answers[1 - userAnswer].votes) {
      agree = agree + 1;
    }
  }
  stats.agree = agree;

  // Tags stats
  stats.tags = [];
  var tags;
  var tag;
  var tagExists;
  for (i = 0; i < answers.length; i++) {
    tags = answers[i].question.tags;
    for (j = 0; j < tags.length; j++) {
      tag = tags[j];
      tagExists = false;
      for (k = 0; k < stats.tags.length; k++) {
        if (stats.tags[k].name === tag) {
          stats.tags[k].count++;
          tagExists = true;
          break;
        }
      }
      if (!tagExists) {
        stats.tags.push({
          name: tag,
          count: 1
        });
      }
    }
  }

  return stats;
});
