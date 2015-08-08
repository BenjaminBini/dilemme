function mvSuggestQuestionController($scope, $location, mvNotifier, mvSuggestionService) {
  var question = {};
  question.answers = [];
  $scope.question = question;

  $scope.suggestQuestion = function () {
    var i;
    if (question.tags !== undefined && !Array.isArray(question.tags)) {
      question.tags = question.tags.split(',');
    }
    if (question.tags !== undefined) {
      for (i = 0; i < question.tags.length; i++) {
        question.tags[i] = $.trim(question.tags[i]);
      }
    }
    mvSuggestionService.createSuggestion(question).then(function () {
      mvNotifier.notify('SUGGESTION_SUBMITTED');
      $scope.closeThisDialog();
      $location.path('/profile');
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };
}

mvSuggestQuestionController.$inject = ['$scope', '$location', 'mvNotifier', 'mvSuggestionService'];
angular.module('app').controller('mvSuggestQuestionController', mvSuggestQuestionController);