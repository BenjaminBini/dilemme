angular.module('app').controller('mvSuggestionDetailController', function ($scope, $routeParams, mvNotifier, mvSuggestionService, $location, mvDialog) {

  if (!!$routeParams.id) {
    mvSuggestionService.getSuggestionById($routeParams.id).then(function (suggestion) {
      $scope.suggestion = suggestion;
      $scope.isLoaded = true;
    }, function (reason) {
      mvNotifier.error(reason);
    });
  }

  $scope.validate = function () {
    var i;
    var tags = [];
    if ($scope.suggestion.tags !== undefined) {
      if (!Array.isArray($scope.suggestion.tags)) {
        $scope.suggestion.tags = $scope.suggestion.tags.split(',');
      }
      for (i = 0; i < $scope.suggestion.tags.length; i++) {
        if ($scope.suggestion.tags[i].length > 0) {
          tags.push($.trim($scope.suggestion.tags[i]));
        }
      }
    }
    $scope.suggestion.tags = tags;
    mvSuggestionService.validateSuggestion($scope.suggestion).then(function (question) {
      mvNotifier.notify('The suggestion has been successfully published');
      $location.path('/admin/questions/' + question._id);
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  $scope.delete = function () {
    $scope.itemType = 'suggestion';
    mvDialog.confirmDelete($scope).then(function (data) {
      if (data.value === 'confirm') {
        mvSuggestionService.deleteSuggestion($scope.suggestion).then(function () {
          mvNotifier.notify('The suggestion has been deleted');
          $location.path('/admin/suggestions');
        }, function (reason) {
          mvNotifier.error(reason);
        });
      }
    });
  };

});