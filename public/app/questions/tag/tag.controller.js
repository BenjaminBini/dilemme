function TagViewController($scope, Question, $routeParams) {
  $scope.questions = Question.queryForTag({tag: $routeParams.tag});
  $scope.tag = $routeParams.tag;
}

TagViewController.$inject = ['$scope', 'Question', '$routeParams'];
angular.module('app').controller('TagViewController', TagViewController);
