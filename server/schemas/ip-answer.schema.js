var mongoose = require('mongoose');

/**
 * IpAnswer schema
 */
exports.schema = mongoose.Schema({
  ip: {
    type: String,
    required: '{PATH} is required'
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
  createdAt: {
    type: Date,
    expires: 50,
    default: Date.now
  }
});
