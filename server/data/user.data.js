var mongoose = require('mongoose');
var Promise = require('bluebird');
var encrypt = require('../utils/encryption');

var User;

/**
 * Create default users in the db
 */
exports.createDefaultEntries = function() {
  if (!User) {
    User = mongoose.model('User');
  }

  return User.find({}).then(function(collection) {
    if (collection.length === 0) {
      var salt;
      var hash;
      salt = encrypt.createSalt();
      hash = encrypt.hashPassword(salt, 'joe');
      var createJoe = User.create({username: 'joe', email: 'joe@joe.joe', salt: salt, hashedPassword: hash, roles: ['admin'], registrationDate: new Date('10/02/2015')});
      salt = encrypt.createSalt();
      hash = encrypt.hashPassword(salt, 'ben');
      var createBen = User.create({username: 'ben', email: 'ben@ben.ben', salt: salt, hashedPassword: hash, roles: [], registrationDate: new Date('10/02/2014')});
      salt = encrypt.createSalt();
      hash = encrypt.hashPassword(salt, 'leo');
      var createLeo = User.create({username: 'leo', email: 'leo@leo.leo', salt: salt, hashedPassword: hash, registrationDate: new Date('10/02/2013')});
      return Promise.all([createJoe, createBen, createLeo]);
    } else {
      return Promise.resolve();
    }
  });
};
