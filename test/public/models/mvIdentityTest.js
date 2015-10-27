describe('mvIdentity', function () {
  var testUser = {
    username: 'TestUser',
    roles: ['admin']
  };
  var mockWindow = {
    bootstrappedUserObject: testUser
  };
  var mvIdentity;

  beforeEach(module('app', function ($provide) {
    $provide.value('$window', mockWindow);
  }));

  beforeEach(inject(function (_mvIdentity_, $window) {
    mvIdentity = _mvIdentity_;
  }));

  describe('mvIdentity', function () {
    describe('isAuthenticated', function () {
      it('should return true if the user is logged in', function () {
        expect(mvIdentity.isAuthenticated()).to.be.true;
      });
      it('should return false if the user is not logged in', function () {
        mvIdentity.currentUser = undefined;
        expect(mvIdentity.isAuthenticated()).to.be.false;
      });
    });

    describe('isAuthorized', function() {
      it('should return false if the user is logged out', function () {
        mvIdentity.currentUser = undefined;
        expect(mvIdentity.isAuthorized('admin')).to.be.false;
      });

      it('should return false if the user has not the right role', function () {
        mvIdentity.currentUser.roles = [];
        expect(mvIdentity.isAuthorized('admin')).to.be.false;
      });

      it('should return true if the user has the right role', function () {
        expect(mvIdentity.isAuthorized('admin')).to.be.true;
      });

    });
  });
});