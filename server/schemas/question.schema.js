var mongoose = require('mongoose');
var questionModel = require('../models/question.model');

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
exports.schema = mongoose.Schema({
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

/**
 * Question schema instance methods
 */
exports.schema.methods = questionModel.methods;

/**
 * Question schema statics methods
 */
exports.schema.statics = questionModel.statics;
