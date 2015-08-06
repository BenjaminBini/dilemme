function mvTagViewController($scope, mvQuestion, $routeParams) {
  $scope.questions = mvQuestion.queryForTag({ tag: $routeParams.tag});
  $scope.tag = $routeParams.tag;
}

mvTagViewController.$inject = ['$scope', 'mvQuestion', '$routeParams'];
angular.module('app').controller('mvTagViewController', mvTagViewController);