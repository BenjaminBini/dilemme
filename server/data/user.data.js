var mongoose = require('mongoose');
var encrypt = require('../utils/encryption');

var User;

/**
 * Create default users in the db
 */
exports.createDefaultEntries = function() {
  if (!User) {
    User = mongoose.model('User');
  }

  User.find({}).exec(function(err, collection) {
    if (err) {
      return;
    }
    if (collection.length === 0) {
      var salt;
      var hash;
      salt = encrypt.createSalt();
      hash = encrypt.hashPassword(salt, 'joe');
      User.create({username: 'joe', email: 'joe@joe.joe', salt: salt, hashedPassword: hash, roles: ['admin'], registrationDate: new Date('10/02/2015')});
      salt = encrypt.createSalt();
      hash = encrypt.hashPassword(salt, 'ben');
      User.create({username: 'ben', email: 'ben@ben.ben', salt: salt, hashedPassword: hash, roles: [], registrationDate: new Date('10/02/2014')});
      salt = encrypt.createSalt();
      hash = encrypt.hashPassword(salt, 'leo');
      User.create({username: 'leo', email: 'leo@leo.leo', salt: salt, hashedPassword: hash, registrationDate: new Date('10/02/2013')});
    }
    console.log('Users collection has ' + collection.length + ' entries');
  });
};
