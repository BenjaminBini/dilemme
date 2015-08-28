var mongoose = require('mongoose');

/**
 * IpAnswers schema
 */
var ipAnswersSchema = mongoose.Schema({
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

var IpAnswers = mongoose.model('IpAnswers', ipAnswersSchema);

/**
 * IpAnswers schema methods
 */
ipAnswersSchema.methods = {
};

/**
 * Create default entry in the db
 */
exports.createDefaultEntries = function() {
  IpAnswers.find({}).exec(function(err, collection) {
    if (err) {
      return;
    }
    if (collection.length === 0) {
      IpAnswers.create({
        ip: '0.0.0.0',
        answers: []
      });
    }
    console.log('IpAnswers collection has ' + collection.length + ' entries');
  });
};
