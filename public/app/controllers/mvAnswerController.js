angular.module('app').controller('mvAnswerController', function($scope, mvQuestion, mvQuestionService, $location, mvNotifier, mvIdentity, localStorageService) {	
	$scope.answer = function (answer) {
		$scope.results = mvQuestionService.getProportions($scope.question);
		mvQuestionService.answerQuestion($scope.question, answer).then(function () {
			$scope.results = mvQuestionService.getProportions($scope.question);
			
			// Push the answer to current user answer list if authenticated
			if (mvIdentity.isAuthenticated()) {
				mvIdentity.currentUser.answers.push({
					question: $scope.question._id,
					answer: answer
				});
			} else { // Push it in the local storage/cookie
				mvQuestionService.saveAnswerLocally($scope.question, answer);
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
		if (!!question) {
			var answers;
			if (mvIdentity.isAuthenticated()) {
				answers = mvIdentity.currentUser.answers;
			} else {
				answers = localStorageService.get('answers');
			}
			if (answers) {
				for (var i = 0; i < answers.length; i++) {
					if (answers[i].question == question._id) {
						$scope.userAnswer = answers[i].answer;
						$scope.results = mvQuestionService.getProportions($scope.question);
						$scope.answer = function () {};
						break;
					}
				}
			}
		}
	});
});