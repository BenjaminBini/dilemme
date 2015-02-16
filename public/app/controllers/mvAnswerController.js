angular.module('app').controller('mvAnswerController', function($scope, mvQuestion, mvQuestionService, $location) {
	$scope.answer = function (answer) {
		console.log('Answer ' + answer + ' : ' + $scope.question.answers[answer].text);
		$scope.results = mvQuestionService.getProportions($scope.question);
		$scope.answer = function() {};
	};

	$scope.nextQuestion = function () {
		$location.path('/questions/random');
	}
});