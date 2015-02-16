angular.module('app').controller('mvAnswerController', function($scope, mvQuestion, mvQuestionService, $location, mvNotifier) {
	
	// Answer the question
	$scope.answer = function (answer) {
		$scope.results = mvQuestionService.getProportions($scope.question);
		mvQuestionService.answerQuestion($scope.question, answer).then(function () {
			$scope.results = mvQuestionService.getProportions($scope.question);
		}, function (reason) {
			mvNotifier.error(reason);
		});
		// Of course we can do it only once
		$scope.answer = function() {};
	};

	$scope.nextQuestion = function () {
		$location.path('/questions/random');
	}
});