angular.module('app').factory('mvSuggestionService', function ($q, mvSuggestion) {

  return {
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
    }
  };

});