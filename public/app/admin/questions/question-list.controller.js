function QuestionListController($scope, $filter, QuestionService, NotifierService) {

  QuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });

  $scope.sortOptions = [{
    value: 'text + answers[0].text + answers[1].text',
    text: 'Sort by text'
  }, {
    value: '- published',
    text: 'Sort by publication date'
  }, {
    value: '- upvotes',
    text: 'Sort by upvotes'
  }, {
    value: '- (answers[0].votes + answers[1].votes)',
    text: 'Sort by answers'
  }];

  $scope.sortOrder = {
    selected: $scope.sortOptions[0].value
  };

  $scope.publishSelection = function () {
    var selectedQuestions = $filter('filter')($scope.questions, {selected: true});
    if (selectedQuestions.length > 0) {
      QuestionService.publishQuestions(selectedQuestions).then(function () {
        NotifierService.notify('QUESTIONS_PUBLISHED_SUCCESS');
      });
    }
  };

  $scope.unpublishSelection = function () {
    var selectedQuestions = $filter('filter')($scope.questions, {selected: true});
    if (selectedQuestions.length > 0) {
      QuestionService.unpublishQuestions(selectedQuestions).then(function () {
        NotifierService.notify('QUESTIONS_UNPUBLISHED_SUCCESS');
      });
    }
  };

  var allSelected = false;
  $scope.toggleAll = function () {
    allSelected = !allSelected;
    angular.forEach($scope.questions, function (question) {
      question.selected = allSelected;
    });
  };
}

QuestionListController.$inject = ['$scope', '$filter', 'QuestionService', 'NotifierService'];
angular.module('app').controller('QuestionListController', QuestionListController);