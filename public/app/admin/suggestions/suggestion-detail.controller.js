function SuggestionDetailController($scope, $routeParams, NotifierService, SuggestionService, $location, ModalService) {

  if (!!$routeParams.id) {
    SuggestionService.getSuggestionById($routeParams.id).then(function(suggestion) {
      $scope.suggestion = suggestion;
      $scope.isLoaded = true;
    }, function(reason) {
      NotifierService.error(reason);
    });
  }

  $scope.validate = function() {
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
    SuggestionService.validateSuggestion($scope.suggestion).then(function(question) {
      NotifierService.notify('SUGGESTION_PUBLISHED_SUCCESS');
      $location.path('/admin/questions/' + question._id);
    }, function(reason) {
      NotifierService.error(reason);
    });
  };

  $scope.delete = function() {
    $scope.itemType = 'SUGGESTION';
    ModalService.confirmDelete($scope).then(function(data) {
      if (data.value === 'confirm') {
        SuggestionService.deleteSuggestion($scope.suggestion).then(function() {
          NotifierService.notify('SUGGESTION_REMOVED_SUCCESS');
          $location.path('/admin/suggestions');
        }, function(reason) {
          NotifierService.error(reason);
        });
      }
    });
  };
}

SuggestionDetailController.$inject = ['$scope', '$routeParams', 'NotifierService', 'SuggestionService', '$location', 'ModalService'];
angular.module('app').controller('SuggestionDetailController', SuggestionDetailController);
