/*jslint newcap: true*/
function mvIdentity($window, mvUser) {
  var currentUser;
  if (!!$window.bootstrappedUserObject) {
    currentUser = new mvUser();
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

mvIdentity.$inject = ['$window', 'mvUser'];
angular.module('app').factory('mvIdentity', mvIdentity);