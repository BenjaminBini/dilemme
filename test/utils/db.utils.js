var mongoose = require('mongoose');
var userSchema = require('../../server/schemas/user.schema');
var suggestionSchema = require('../../server/schemas/suggestion.schema');
var questionSchema = require('../../server/schemas/question.schema');
var ipAnswerSchema = require('../../server/schemas/ip-answer.schema');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var restore = require('mongodb-restore');
var Promise = require('bluebird');
require('dotenv').load();

module.exports = function() {
  process.env.NODE_ENV = 'test';

  // Init mongoose schemas
  mongoose.model('User', userSchema.schema);
  mongoose.model('Suggestion', suggestionSchema.schema);
  mongoose.model('Question', questionSchema.schema);
  mongoose.model('IpAnswer', ipAnswerSchema.schema);

  // Init 'should'
  chai.should();

  // Use chaiAsPromised
  chai.use(chaiAsPromised);

  // Use bluebird promises
  mongoose.Promise = Promise;

  // Before each test hook
  beforeEach(function(done) {
    // Remove mocha timeout
    this.timeout(0);

    // If not connected connect and then populate
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGO_TEST_URI, function(err) {
        if (err) {
          throw err;
        }
        return populateDB(done);
      });
    } else { // If connected, populate
      return populateDB(done);
    }

    function populateDB(done) {
      // Create default data in the db
      restore({
        uri: process.env.MONGO_TEST_URI,
        root: __dirname + '/../../server/data/sample',
        drop: true,
        dropCollections: true,
        metadata: true,
        callback: done
      });
    }

  });

  after(function(done) {
    mongoose.disconnect();
    done();
  });

};
