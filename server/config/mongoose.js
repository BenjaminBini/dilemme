/**
 * Mongoose configuration
 */

var mongoose = require('mongoose');
var userModel = require('../models/User');
var questionModel = require('../models/Question');
var suggestionModel = require('../models/Suggestion');
var ipAnswersModel = require('../models/IpAnswers');

module.exports = function(config) {
  // Mongodb connection
  mongoose.connect(config.dbURI, {user: config.dbUser, pass: config.dbPassword});
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('db opened');

    // Create default data in the db
    userModel.createDefaultEntries();
    ipAnswersModel.createDefaultEntries();
    questionModel.createDefaultEntries();
    suggestionModel.createDefaultEntries();
  });
};
