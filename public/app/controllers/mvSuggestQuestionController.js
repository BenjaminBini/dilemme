angular.module('app').controller('mvSuggestQuestionController', function ($scope, $location, mvNotifier, mvSuggestionService) {
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
      mvNotifier.notify('Your suggestion has been submitted.');
      $scope.closeThisDialog();
      $location.path('/profile');
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };
});