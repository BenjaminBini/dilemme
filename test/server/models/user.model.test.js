var expect = require('chai').expect;
var userSchema = require('../../../server/schemas/user.schema');
var User = require('mongoose').model('User', userSchema.schema);

module.exports = function() {
  describe('Model: User', function() {
    it('should create a new User', function() {
      var user = {
        username: 'PIC_OR_DIDNT_HAPPEN',
        email: 'yomama@myplace.com',
        salt: 'salty',
        hashedPassword: 'passwordy'
      };
      return User.create(user).should.be.fulfilled.then(function(newUser) {
        expect(newUser).to.exist;
        newUser.username.should.equal('pic_or_didnt_happen');
        newUser.email.should.equal('yomama@myplace.com');
        newUser.salt.should.equal('salty');
        newUser.hashedPassword.should.equal('passwordy');
      }).catch(err => console.log(err.actual));
    });
    it('should not create a new User with an existing username', function() {
      var user = {
        username: 'PIC_OR_DIDNT_HAPPEN',
        email: 'yomama@myplace.com',
        salt: 'salty',
        hashedPassword: 'passwordy'
      };
      var user2 = {
        username: 'PIC_OR_DIDNT_HAPPEN',
        email: 'yoGRANMA@myplace.com',
        salt: 'salty',
        hashedPassword: 'passwordy'
      };
      return User.create(user).should.be.fulfilled
        .then(newUser => User.create(user2)).should.be.rejected;
    });
    it('should not create a new User with an existing email', function() {
      var user = {
        username: 'PIC_OR_DIDNT_HAPPEN',
        email: 'yomama@myplace.com',
        salt: 'salty',
        hashedPassword: 'passwordy'
      };
      var user2 = {
        username: 'sk8terb0y',
        email: 'yomama@myplace.com',
        salt: 'salty',
        hashedPassword: 'passwordy'
      };
      return User.create(user).should.be.fulfilled
        .then(() => User.create(user2)).should.be.rejected;
    });
    it('should remove password, salt, reset token and providers ID when serializing to JSON', function() {
      var user = new User();
      user.salt = 'salty';
      user.hashedPassword = 'passwordy';
      user.facebookId = 'fb';
      user.twitterId = 'twitter';
      user.googleId = 'google';
      var jsonUser = user.toJSON();
      expect(jsonUser.salt).not.to.exist;
      expect(jsonUser.hashedPassword).not.to.exist;
      expect(jsonUser.facebookId).not.to.exist;
      expect(jsonUser.twitterId).not.to.exist;
      expect(jsonUser.googleId).not.to.exist;
    });
    it('should add "hasTwitter", "addFacebook" and "hasGoogle" to the serialized user if the user is connected with these providers', function() {
      var user = new User();
      user.facebookId = 'fb';
      user.twitterId = 'twitter';
      user.googleId = 'google';
      var jsonUser = user.toJSON();
      expect(jsonUser.hasFacebook).to.exist;
      expect(jsonUser.hasTwitter).to.exist;
      expect(jsonUser.hasGoogle).to.exist;
    });
    it('should not add "hasTwitter", "addFacebook" and "hasGoogle" to the serialized user if the user is not connected with these providers', function() {
      var user = new User();
      var jsonUser = user.toJSON();
      expect(jsonUser.hasFacebook).not.to.exist;
      expect(jsonUser.hasTwitter).not.to.exist;
      expect(jsonUser.hasGoogle).not.to.exist;
    });
    it('should authenticate user if password is good', function() {
      return User.findOne({username: 'joe'}).then(function(user) {
        user.authenticate('joe').should.equal(true);
      });
    });
    it('should not authenticate user if password is wrong', function() {
      return User.findOne({username: 'joe'}).then(function(user) {
        user.authenticate('jeoe').should.equal(false);
      });
    });
    it('should confirm that the user "joe" is an admin', function() {
      return User.findOne({username: 'joe'}).then(function(user) {
        user.hasRole('admin').should.equal(true);
      });
    });
    it('should confirm that the user "ben" is not an admin', function() {
      return User.findOne({username: 'ben'}).then(function(user) {
        user.hasRole('admin').should.equal(false);
      });
    });
  });
};
