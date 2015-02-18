angular.module('app').controller('mvAnswerController', function($scope, mvQuestion, mvQuestionService, $location, mvNotifier, mvIdentity) {	
	$scope.answer = function (answer) {
		$scope.results = mvQuestionService.getProportions($scope.question);
		mvQuestionService.answerQuestion($scope.question, answer).then(function () {
			$scope.results = mvQuestionService.getProportions($scope.question);
			
			// Push the answer to current user answer list
			if (mvIdentity.isAuthenticated()) {
				mvIdentity.currentUser.answers.push({
					question: $scope.question._id,
					answer: answer
				});
			}
		}, function (reason) {
			mvNotifier.error(reason);
		});
		// Of course we can do it only once
		$scope.answer = function() {};
	};

	$scope.nextQuestion = function () {
		$location.path('/questions/random/unanswered');
	}

	// Check if the user has already answered the question (TODO : anonymous answer)
	// If yes, show the answer
	$scope.$watch('question', function (question) {
		if (!!question && mvIdentity.isAuthenticated()) {
			var answers = mvIdentity.currentUser.answers;
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].question == question._id) {
					$scope.userAnswer = answers[i].answer;
					$scope.results = mvQuestionService.getProportions($scope.question);
					$scope.answer = function () {};
					break;
				}
			}
		}
	});
});