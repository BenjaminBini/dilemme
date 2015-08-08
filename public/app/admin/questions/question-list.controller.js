function QuestionListController($scope, Question) {
  $scope.questions = Question.query();

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
}

QuestionListController.$inject = ['$scope', 'Question'];
angular.module('app').controller('QuestionListController', QuestionListController);