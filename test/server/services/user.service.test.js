'use strict';

/**
 * User service tests
 */
var expect = require('chai').expect;
var userService = require('../../../server/services/user.service');
var User = require('mongoose').model('User');

module.exports = function() {
  describe('Service: User', function() {
    describe('#getUsers', function() {
      it('should return all users', function() {
        return userService.getUsers()
        .should.be.fulfilled
        .then(function(users) {
          users.length.should.be.above(0);
        });
      });
    });
    describe('#getUserById', function() {
      it('should return a user', function() {
        return userService.getUserById('56323445a65ccd98297256ca')
          .should.be.fulfilled
          .then(function(user) {
            user.username.should.equal('ben');
          });
      });
      it('should return an error', function() {
        return userService.getUserById('56323445a65ccd98297256cc')
          .should.be.rejectedWith(Error, 'USER_DOES_NOT_EXIST');
      });
    });
    describe('#getUserByUsername', function() {
      it('should return a user', function() {
        return userService.getUserByUsername('leo')
          .should.be.fulfilled
          .then(function(user) {
            user.username.should.equal('leo');
          });
      });
      it('should return an error', function() {
        return userService.getUserByUsername('oel')
          .should.be.rejectedWith(Error, 'USER_DOES_NOT_EXIST');
      });
    });
    describe('#getUserByEmail', function() {
      it('should return a user', function() {
        return userService.getUserByEmail('joe@joe.joe')
          .should.be.fulfilled
          .then(function(user) {
            user.email.should.equal('joe@joe.joe');
          });
      });
      it('should return an error', function() {
        return userService.getUserByEmail('oej@oej.oej')
          .should.be.rejectedWith(Error, 'USER_DOES_NOT_EXIST');
      });
    });
    describe('#getUserById', function() {
      it('should return a user', function() {
        return userService.getUserById('56323445a65ccd98297256ca')
          .should.be.fulfilled
          .then(function(user) {
            user.username.should.equal('ben');
          });
      });
      it('should return an error', function() {
        return userService.getUserById('56323445a65ccd98297256cc')
          .should.be.rejectedWith(Error, 'USER_DOES_NOT_EXIST');
      });
    });
    describe('#getUsersByAnsweredQuestion', function() {
      it('should return the users who answered the given question', function() {
        return userService.getUsersByAnsweredQuestion('56323445a65ccd98297256d5')
          .should.be.fulfilled
          .then(function(users) {
            users.length.should.be.above(0);
          });
      });
    });
    describe('#createUser', function() {
      it('should create a new user with a password', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsername',
          password: 'testPassword'
        };
        return userService.createUser(userData)
          .should.be.fulfilled
          .then(function(user) {
            user.username.should.equal('testusername');
          });
      });
      it('should create a new user with Facebook', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsername'
        };
        return userService.createUser(userData, 'testFacebookId', '', '')
          .should.be.fulfilled
          .then(function(user) {
            user.username.should.equal('testusername');
            user.facebookId.should.equal('testFacebookId');
          });
      });
      it('should create a new user with Twitter', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsername'
        };
        return userService.createUser(userData, '', 'testTwitterId', '')
          .should.be.fulfilled
          .then(function(user) {
            user.username.should.equal('testusername');
            user.twitterId.should.equal('testTwitterId');
          });
      });
      it('should create a new user with Google', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsername'
        };
        return userService.createUser(userData, '', '', 'testGoogleId')
          .should.be.fulfilled
          .then(function(user) {
            user.username.should.equal('testusername');
            user.googleId.should.equal('testGoogleId');
          });
      });
      it('should not create a user with an existing username', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsername',
          password: 'testPassword'
        };
        return userService.createUser(userData)
          .should.be.fulfilled
          .then(function(user) {
            userData.email = 'testEmail2@email.mail';
            return userService.createUser(userData)
              .should.be.rejectedWith(Error, 'USERNAME_ALREADY_EXISTS');
          });
      });
      it('should not create a user with an existing email', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsername',
          password: 'testPassword'
        };
        return userService.createUser(userData)
          .should.be.fulfilled
          .then(function(user) {
            userData.username = 'testUsername2';
            return userService.createUser(userData)
              .should.be.rejectedWith(Error, 'EMAIL_ALREADY_EXISTS');
          });
      });
      it('should not create a user with a username which is an email', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testEmail@email.mail',
          password: 'testPassword'
        };
        return userService.createUser(userData)
          .should.be.rejectedWith(Error, 'USERNAME_IS_EMAIL');
      });
      it('should not create a user with a too long username', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsername',
          password: 'testPassword'
        };
        return userService.createUser(userData)
          .should.be.rejectedWith(Error, 'USERNAME_TOO_LONG');
      });
      it('should not create a user with a too long email', function() {
        var userData = {
          email: 'testEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmail@email.mail',
          username: 'testUsername',
          password: 'testPassword'
        };
        return userService.createUser(userData)
          .should.be.rejectedWith(Error, 'EMAIL_TOO_LONG');
      });
      it('should not create a user with an invalid email', function() {
        var userData = {
          email: 'testEmail',
          username: 'testUsername',
          password: 'testPassword'
        };
        return userService.createUser(userData)
          .should.be.rejectedWith(Error, 'EMAIL_NOT_VALID');
      });
    });
    describe('#updateUser', function() {
      it('should update a user', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsername',
          password: 'testPassword'
        };
        var previousHashedPassword;
        return userService.getUserByUsername('ben')
          .then(function(user) {
            previousHashedPassword = user.hashedPassword;
            return user;
          })
          .then(user => userService.updateUser(userData, user.id))
          .should.be.fulfilled
          .then(function(user) {
            user.email.should.equal('testemail@email.mail');
            user.username.should.equal('testusername');
            user.hashedPassword.should.not.equal(previousHashedPassword);
          });
      });
      it('should update a user without changing the password', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsername'
        };
        var previousHashedPassword;
        return userService.getUserByUsername('ben')
          .then(function(user) {
            previousHashedPassword = user.hashedPassword;
            return user;
          })
          .then(user => userService.updateUser(userData, user.id))
          .should.be.fulfilled
          .then(function(user) {
            user.email.should.equal('testemail@email.mail');
            user.username.should.equal('testusername');
            user.hashedPassword.should.equal(previousHashedPassword);
          });
      });
      it('should not update a user who does not exist', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsername'
        };
        return userService.updateUser(userData, '56323445a65ccd98297256cc')
          .should.be.rejectedWith(Error, 'USER_DOES_NOT_EXIST');
      });
      it('should not update a user with an existing username', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'joe'
        };
        return userService.getUserByUsername('ben')
          .then(user => userService.updateUser(userData, user.id))
          .should.be.rejectedWith(Error, 'USERNAME_ALREADY_EXISTS');
      });
      it('should not update a user with an existing email', function() {
        var userData = {
          email: 'joe@joe.joe',
          username: 'testUsername'
        };
        return userService.getUserByUsername('ben')
          .then(user => userService.updateUser(userData, user.id))
          .should.be.rejectedWith(Error, 'EMAIL_ALREADY_EXISTS');
      });
      it('should not update a user with a username which is an email', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testEmail@email.mail'
        };
        return userService.getUserByUsername('ben')
          .then(user => userService.updateUser(userData, user.id))
          .should.be.rejectedWith(Error, 'USERNAME_IS_EMAIL');
      });
      it('should not update a user with a too long username', function() {
        var userData = {
          email: 'testEmail@email.mail',
          username: 'testUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsernametestUsername'
        };
        return userService.getUserByUsername('ben')
          .then(user => userService.updateUser(userData, user.id))
          .should.be.rejectedWith(Error, 'USERNAME_TOO_LONG');
      });
      it('should not update a user with a too long email', function() {
        var userData = {
          email: 'testEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmailtestEmail.mail',
          username: 'testUsername'
        };
        return userService.getUserByUsername('ben')
          .then(user => userService.updateUser(userData, user.id))
          .should.be.rejectedWith(Error, 'EMAIL_TOO_LONG');
      });
      it('should not update a user with an invalid email', function() {
        var userData = {
          email: 'testEmail',
          username: 'testUsername'
        };
        return userService.getUserByUsername('ben')
          .then(user => userService.updateUser(userData, user.id))
          .should.be.rejectedWith(Error, 'EMAIL_NOT_VALID');
      });
    });
    describe('#deleteUser', function() {
      it('should delete a user', function() {
        var previousCount;
        return userService.getUsers()
            .then(users => previousCount = users.length)
            .then(() => User.findOne({_id: '56323445a65ccd98297256ca'}))
            .should.be.fulfilled
            .then(user => userService.deleteUser(user._id))
            .should.be.fulfilled
            .then(() => userService.getUsers())
            .then(users => users.length.should.equal(previousCount - 1));
      });
    });
    describe('#getUserStats', function() {
      it('should return correct stats', function() {
          return userService.getUserByUsername('joe')
            .then(user => userService.getUserWithStats(user._id))
            .then(function(user) {
              var stats = user.stats;
              expect(stats.answered).to.equal(2);
              expect(stats.color.red).to.equal(1);
              expect(stats.color.blue).to.equal(1);
              expect(stats.agree).to.equal(1);
              expect(stats.tags[0].name).to.equal('preference');
              expect(stats.tags[0].count).to.equal(2);
            });
        });
    });
    describe('#requestNewPassword', function() {

    });
    describe('#resetPassword', function() {

    });
  });
};
