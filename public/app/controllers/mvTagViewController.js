angular.module('app').controller('mvTagViewController', function($scope, mvQuestion, $routeParams) {
	$scope.questions = mvQuestion.queryForTag({ tag: $routeParams.tag});
	$scope.tag = $routeParams.tag;
});