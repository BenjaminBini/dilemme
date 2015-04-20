angular.module('app').controller('mvBrowseController', function ($scope, mvQuestionService) {

  mvQuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });

  $scope.sortOptions = [{
    value: 'text + answers[0].text + answers[1].text',
    text: 'Sort by text'
  }, {
    value: '-published',
    text: 'Sort by publication date'
  }, {
    value: '-upvotes',
    text: 'Sort by upvotes'
  }];

  $scope.sortOrder = {
    selected: $scope.sortOptions[0].value
  };
});