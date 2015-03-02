angular.module('app').controller('mvAnswerController', function($scope, mvQuestion, mvQuestionService, $location, mvNotifier, mvIdentity, localStorageService, mvDialog, $window) {	
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

	$scope.upvote = function () {
		mvQuestionService.upvoteQuestion($scope.question).then(function () {
		}, function (reason) {
			mvNotifier.error(reason);
		});
	}

	$scope.comment = function (comment) {
		mvQuestionService.commentQuestion($scope.question, comment).then(function (question) {
			mvNotifier.notify('Your comment has been successfully posted');
			$scope.question = question;
		}, function (reason) {
			mvNotifier.error(reason);
		});
	}

	$scope.deleteComment = function (commentId) {
		$scope.itemType = 'comment';
		mvDialog.confirmDelete($scope).then(function (data) {
			if (data.value === 'confirm') {
				mvQuestionService.deleteComment($scope.question, commentId).then(function (question) {
					mvNotifier.notify('The comment has been removed');
				}, function (reason) {
					mvNotifier.error(reason);
				});
			}
		});
	}

	$scope.upvoteComment = function (commentId) {
		mvQuestionService.upvoteComment($scope.question, commentId).then(function (question) {
		}, function (reason) {
			mvNotifier.error(reason);
		});
	}

	$scope.sortOptions = [{
		value: "date",
		text: "Sort by date"
	}, {
		value: "upvotes",
		text: "Sort by upvotes"	
	}];

	$scope.sortOrder = {
		selected: $scope.sortOptions[0].value
	};

	$scope.nextQuestion = function () {
		$location.path('/questions/random/unanswered');
	}

	$scope.openRegisterModal = function () {
		mvDialog.register();
	};

	$scope.openLoginModal = function () {
		mvDialog.login();
	};

	$scope.facebookShare = function () {
		FB.ui({
			method: 'feed',
			name: 'Dilemme : ' + $scope.question.text + ' ' + $scope.question.answers[0].text + ' or ' + $scope.question.answers[1].text + ' ?',
			link: 'http://dilemme.io/questions/' + $scope.question._id,
			description: $scope.question.description
		});
	}

	$scope.twitterShare = function() {
		var link = 'https://twitter.com/share?';
		link += 'url=http://dilemme.io/questions/' + $scope.question._id;
		link += '&text=Dilemme : ' + $scope.question.text + ' ' + $scope.question.answers[0].text + ' or ' + $scope.question.answers[1].text + ' ?';

		var width = 555;
		var height = 255;
		var left = $window.innerWidth / 2 - width / 2;
		var top = $window.innerHeight / 2 - height / 2;
		return $window.open(link, '', 'width=' + width + ', height=' + height +', top=' + top + ', left=' + left);
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