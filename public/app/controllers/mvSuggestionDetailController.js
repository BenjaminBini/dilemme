angular.module('app').controller('mvSuggestionDetailController', function ($scope, $routeParams, mvNotifier, mvSuggestionService, $location) {

  if (!!$routeParams.id) {
    mvSuggestionService.getSuggestionById($routeParams.id).then(function (suggestion) {
      $scope.suggestion = suggestion;
      $scope.isLoaded = true;
    }, function (reason) {
      mvNotifier.error(reason);
    });
  }

  $scope.validate = function () {
    mvSuggestionService.validateSuggestion($scope.suggestion).then(function (question) {
      mvNotifier.notify('The suggestion has been successfully published');
      $location.path('/admin/questions/' + question._id);
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  $scope.delete = function () {
    mvSuggestionService.deleteSuggestion($scope.suggestion).then(function () {

    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

});