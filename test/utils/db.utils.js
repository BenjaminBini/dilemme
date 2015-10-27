var mongoose = require('mongoose');
var userSchema = require('../../server/schemas/user.schema');
var suggestionSchema = require('../../server/schemas/suggestion.schema');
var questionSchema = require('../../server/schemas/question.schema');
var userData = require('../../server/data/user.data');
var suggestionData = require('../../server/data/suggestion.data');
var questionData = require('../../server/data/question.data');
require('dotenv').load();
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

module.exports = function() {
  process.env.NODE_ENV = 'test';
  
  beforeEach(function(done) {
    chai.use(chaiAsPromised);
  
    function clearDB() {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
      }
      return Promise.resolve();
    }

    function populateDB() {
      mongoose.model('User', userSchema.schema);
      mongoose.model('Suggestion', suggestionSchema.schema);
      mongoose.model('Question', questionSchema.schema);
      // Create default data in the db
      return userData.createDefaultEntries()
      .then(questionData.createDefaultEntries)
      .then(suggestionData.createDefaultEntries)
      .catch(function(err) {
        console.log(err);
      });
    }

    function initDB(done) {
      return clearDB().then(populateDB).then(function() {
        return done();
      });
    }

    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGO_TEST_URI, function(err) {
        if (err) {
          throw err;
        }
        return initDB(done);
      });
    } else {
      return initDB(done);
    }
    
  });

  after(function(done) {
    mongoose.disconnect();
    done();
  });

};
