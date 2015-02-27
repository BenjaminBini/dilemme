angular.module('app').controller('mvSuggestQuestionController', function($scope, mvNotifier) {
	var question = $scope.question = {};
	question.tags = [];

	$scope.suggestQuestion = function () {
		if (question.tags !== undefined && !Array.isArray(question.tags)) {
			question.tags = question.tags.split(',');
		}
		if (question.tags !== undefined) {
			for (var i = 0; i < question.tags.length; i++) {
				question.tags[i] = $.trim(question.tags[i]);
			}
		}
		console.dir($scope.question);
	}
	
	$scope.signin = function(email, password) {
		mvAuthService.authenticateUser(email, password).then(function(success) {
			if (success) {
				mvNotifier.notify('You have successfully signed in.');
				$scope.closeThisDialog();
			} else {
				mvNotifier.warn('Email/Password combination incorrect');
			}
		})
	};
});