/*jslint newcap: true */
function mvSuggestionService($q, mvSuggestion) {

  return {
    getSuggestionById: function (id) {
      var dfd = $q.defer();

      mvSuggestion.get({_id: id}, function (suggestion) {
        dfd.resolve(suggestion);
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    createSuggestion: function (suggestion) {
      var newSuggestion = new mvSuggestion(suggestion);
      var dfd = $q.defer();

      newSuggestion.$save().then(function () {
        dfd.resolve();
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    getSuggestionsByUser: function (user) {
      var dfd = $q.defer();

      mvSuggestion.getByUser({_id: user._id}, function (suggestions) {
        dfd.resolve(suggestions);
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    validateSuggestion: function (suggestion) {
      var dfd = $q.defer();

      suggestion.$validate({_id: suggestion._id}).then(function (question) {
        dfd.resolve(question);
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    deleteSuggestion: function (suggestion) {
      var dfd = $q.defer();

      suggestion.$delete({_id: suggestion._id}).then(function () {
        dfd.resolve();
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  };
}

mvSuggestionService.$inject = ['$q', 'mvSuggestion'];
angular.module('app').factory('mvSuggestionService', mvSuggestionService);