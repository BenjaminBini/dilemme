/*jslint newcap: true */
function UserService($q, User) {
  return {
    createUser: function(user) {
      var newUser = new User(user);
      var dfd = $q.defer();

      newUser.$save().then(function(user) {
        dfd.resolve(user);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    updateUser: function(user) {
      var dfd = $q.defer();

      user.$update({_id: user._id}).then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    deleteUser: function(user) {
      var dfd = $q.defer();

      user.$delete({_id: user._id}).then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    getStats: function(user) {
      var dfd = $q.defer();

      user.$getStats({_id: user._id}).then(function() {
        dfd.resolve(user.stats);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    getByAnsweredQuestion: function(question) {
      var dfd = $q.defer();
      var i;
      var j;
      User.getByAnsweredQuestion({_questionId: question._id}).$promise.then(function(users) {
        for (i = 0; i < users.length; i++) {
          for (j = 0; j < users[i].answers.length; j++) {
            if (users[i].answers[j].question === question._id) {
              users[i].answer = users[i].answers[j].answer;
            }
          }
        }
        dfd.resolve(users);
      });

      return dfd.promise;
    },
    requestNewPassword: function(username, language) {
      return User.requestNewPassword({_username: username}, {language: language}).$promise;
    },
    resetPassword: function(token, newPassword) {
      var dfd = $q.defer();
      User.resetPassword({
        token: token,
        newPassword: newPassword
      }).$promise.then(function(user) {
        dfd.resolve(user);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  };
}

UserService.$inject = ['$q', 'User'];
angular.module('app').factory('UserService', UserService);
