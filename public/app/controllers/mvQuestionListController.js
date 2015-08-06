function mvQuestionListController($scope, mvQuestion) {
  $scope.questions = mvQuestion.query();

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

mvQuestionListController.$inject = ['$scope', 'mvQuestion'];
angular.module('app').controller('mvQuestionListController', mvQuestionListController);