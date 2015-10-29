/**
 * Mongoose configuration
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var userSchema = require('../schemas/user.schema');
var userData = require('../data/user.data');
var suggestionSchema = require('../schemas/suggestion.schema');
var suggestionData = require('../data/suggestion.data');
var ipAnswerSchema = require('../schemas/ip-answer.schema');
var questionSchema = require('../schemas/question.schema');
var questionData = require('../data/question.data');

module.exports = function() {
  // Init schemas
  mongoose.model('User', userSchema.schema);
  mongoose.model('Suggestion', suggestionSchema.schema);
  mongoose.model('IpAnswer', ipAnswerSchema.schema);
  mongoose.model('Question', questionSchema.schema);

  // Set mongoose promises to be bluebird
  mongoose.Promise = Promise;

  // Mongodb connection
  mongoose.connect(process.env.MONGO_URI);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('db opened');

    // Create default data in the db
    userData.createDefaultEntries();
    suggestionData.createDefaultEntries();
    questionData.createDefaultEntries();
  });
};
