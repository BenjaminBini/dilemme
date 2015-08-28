function SuggestionListController($scope, Suggestion) {
  $scope.questions = Suggestion.query();

  $scope.sortOptions = [{
    value: 'text + answers[0].text + answers[1].text',
    text: 'Sort by text'
  }, {
    value: 'published',
    text: 'Sort by publication date'
  }, {
    value: 'upvotes',
    text: 'Sort by upvotes'
  }];

  $scope.sortOrder = {
    selected: $scope.sortOptions[0].value
  };
}

SuggestionListController.$inject = ['$scope', 'Suggestion'];
angular.module('app').controller('SuggestionListController', SuggestionListController);
