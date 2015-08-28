/*jslint newcap: true */
function SuggestionService($q, Suggestion) {

  return {
    getSuggestionById: function(id) {
      var dfd = $q.defer();

      Suggestion.get({_id: id}, function(suggestion) {
        dfd.resolve(suggestion);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    createSuggestion: function(suggestion) {
      var newSuggestion = new Suggestion(suggestion);
      var dfd = $q.defer();

      newSuggestion.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    getSuggestionsByUser: function(user) {
      var dfd = $q.defer();

      Suggestion.getByUser({_id: user._id}, function(suggestions) {
        dfd.resolve(suggestions);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    validateSuggestion: function(suggestion) {
      var dfd = $q.defer();

      suggestion.$validate({_id: suggestion._id}).then(function(question) {
        dfd.resolve(question);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    deleteSuggestion: function(suggestion) {
      var dfd = $q.defer();

      suggestion.$delete({_id: suggestion._id}).then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  };
}

SuggestionService.$inject = ['$q', 'Suggestion'];
angular.module('app').factory('SuggestionService', SuggestionService);
