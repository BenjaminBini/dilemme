'use strict';

var mongoose = require('mongoose');
var userModel = require('../models/user.model.js');

/**
 * User schema
 */
exports.schema = new mongoose.Schema({
  username: {
    type: String,
    required: '{PATH} is required',
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: '{PATH} is requred',
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
  facebookId: {
    type: String
  },
  twitterId: {
    type: String
  },
  googleId: {
    type: String
  },
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

/**
 * User schema virtual fields
 */

// Stats
exports.schema.virtual('stats').get(userModel.virtuals.getStats);
