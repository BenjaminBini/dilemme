var mongoose = require('mongoose');
var suggestionModel = require('../models/suggestion.model.js');

/**
 * Suggestion schema (same as Question schema)
 */
exports.schema = new mongoose.Schema({
  title: {
    type: String,
    required: '{PATH} is required'
  },
  description: {
    type: String,
    required: '{PATH} is required'
  },
  text: {
    type: String,
    required: '{PATH} is required'
  },
  answers: [{
    text: {
      type: String,
      required: '{PATH} is required'
    }
  }],
  tags: {
    type: [String]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    reference: 'User'
  },
  published: {
    type: Date,
    default: Date.now
  }
});

/**
 * Suggestion schema instance methods
 */
exports.schema.methods = suggestionModel.methods;
