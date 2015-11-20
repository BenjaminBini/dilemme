'use strict';

/**
 * Mongoose configuration
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var userSchema = require('../schemas/user.schema');
var suggestionSchema = require('../schemas/suggestion.schema');
var ipAnswerSchema = require('../schemas/ip-answer.schema');
var questionSchema = require('../schemas/question.schema');
var restore = require('mongodb-restore');

/**
 * Export Mongoose configuration
 */
module.exports = configureMongoose;

/**
 * Configure Mongoose
 */
function configureMongoose() {
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
    console.log('Database opened');

    // Create default data in the db if there is no user
    var User = mongoose.model('User');
    User.count({}).then(function(count) {
      if (count === 0) {
        console.log('Populating database with sample data');
        restore({
          uri: process.env.MONGO_URI,
          root: __dirname + '/../../server/data/sample',
          drop: true,
          dropCollections: true,
          metadata: true
        });
      }
    });
  });
}
