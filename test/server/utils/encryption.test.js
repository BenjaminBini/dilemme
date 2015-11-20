var expect = require('chai').expect;
var encryption = require('../../../server/utils/encryption');

module.exports = function() {
  describe('Utils: encryption', function() {
    describe('#createSalt', function() {
      it('should return a random salt of 172 char', function() {
        encryption.createSalt().length.should.equal(172);
      });
    });
    describe('#hashPassword', function() {
      it('should return an hex string of 40 chararacters', function() {
        var salt = encryption.createSalt();
        var hashedPassword = encryption.hashPassword(salt, 'password');
        /[^a-f0-9]/.test(hashedPassword).should.equal(false);
        hashedPassword.length.should.equal(40);
      });
    });
    describe('#createToken', function() {
      it('should return a random hex string of 48 characters', function() {
        var token = encryption.createToken();
        /[^a-f0-9]/.test(token).should.equal(false);
        token.length.should.equal(48);
      });
    });
  });
};
