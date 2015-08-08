/*jslint newcap: true*/
function IdentityService($window, User) {
  var currentUser;
  if (!!$window.bootstrappedUserObject) {
    currentUser = new User();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }

  return {
    currentUser: currentUser,
    isAuthenticated: function () {
      return !!this.currentUser;
    },
    isAuthorized: function (role) {
      return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
    }
  };
}

IdentityService.$inject = ['$window', 'User'];
angular.module('app').factory('IdentityService', IdentityService);