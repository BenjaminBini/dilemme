/*jslint newcap: true */
function UserService($q, User) {
  return {
    createUser: function (user) {
      var newUser = new User(user);
      var dfd = $q.defer();

      newUser.$save().then(function (user) {
        dfd.resolve(user);
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    updateUser: function (user) {
      var dfd = $q.defer();

      user.$update({_id: user._id}).then(function () {
        dfd.resolve();
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    deleteUser: function (user) {
      var dfd = $q.defer();

      user.$delete({_id: user._id}).then(function () {
        dfd.resolve();
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    getStats: function (user) {
      var dfd = $q.defer();

      user.$getStats({_id: user._id}).then(function () {
        dfd.resolve(user.stats);
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  };
}

UserService.$inject = ['$q', 'User'];
angular.module('app').factory('UserService', UserService);