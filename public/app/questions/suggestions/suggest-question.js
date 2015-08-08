function SuggestQuestionController($scope, $location, NotifierService, SuggestionService) {
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
    SuggestionService.createSuggestion(question).then(function () {
      NotifierService.notify('SUGGESTION_SUBMITTED');
      $scope.closeThisDialog();
      $location.path('/profile');
    }, function (reason) {
      NotifierService.error(reason);
    });
  };
}

SuggestQuestionController.$inject = ['$scope', '$location', 'NotifierService', 'SuggestionService'];
angular.module('app').controller('SuggestQuestionController', SuggestQuestionController);