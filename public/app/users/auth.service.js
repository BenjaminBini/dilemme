/*jslint newcap: true */
function AuthService($http, IdentityService, $q, User, UserService) {
  return {
    authenticateUser: function(email, password) {
      var dfd = $q.defer();
      $http.post('/login', {email: email, password: password}).then(function(response) {
        if (response.data.success) {
          var user = new User();
          angular.extend(user, response.data.user);
          IdentityService.currentUser = user;
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    },
    registerUser: function(newUserData) {
      var newUser = new User(newUserData);
      var dfd = $q.defer();

      UserService.createUser(newUser).then(function(user) {
        IdentityService.currentUser = user;
        dfd.resolve();
      }, function(reason) {
        dfd.reject(reason);
      });

      return dfd.promise;
    },
    updateCurrentUser: function(newUserData) {
      var dfd = $q.defer();
      var clone = angular.copy(IdentityService.currentUser);
      angular.extend(clone, newUserData);
      UserService.updateUser(clone).then(function() {
        IdentityService.currentUser = clone;
        dfd.resolve();
      }, function(reason) {
        dfd.reject(reason);
      });
      return dfd.promise;
    },
    logoutUser: function() {
      var dfd = $q.defer();
      $http.post('/logout', {logout: true}).then(function() {
        IdentityService.currentUser = undefined;
        dfd.resolve();
      });
      return dfd.promise;
    },
    authorizeCurrentUserForRoute: function(role) {
      if (IdentityService.isAuthorized(role)) {
        return true;
      }
      return $q.reject('not authorized');
    },
    authorizeAuthenticatedUserForRoute: function() {
      if (IdentityService.isAuthenticated()) {
        return true;
      }
      return $q.reject('not authorized');
    }
  };
}

AuthService.$inject = ['$http', 'IdentityService', '$q', 'User', 'UserService'];
angular.module('app').factory('AuthService', AuthService);
