angular.module('app').controller('mvAnswerController', function($scope, mvQuestion, mvQuestionService) {
	$scope.answer = function (answer) {
		console.log('Answer ' + answer + ' : ' + $scope.question.answers[answer].text);
		$scope.results = mvQuestionService.getProportions($scope.question);
		$scope.answer = function() {};
	};
});