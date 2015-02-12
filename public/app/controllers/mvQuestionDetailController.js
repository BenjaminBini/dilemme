angular.module('app').controller('mvQuestionDetailController', function ($scope, mvQuestion, $routeParams, mvNotifier, mvQuestionService, $location, mvDialog) {
	var question = {};
	question.answers = [];
	$scope.question = question;
	$scope.isLoaded = false;
	$scope.editionMode = false;

	if ($routeParams.id != 'add') {
		question = mvQuestion.get({_id: $routeParams.id}, function() {
			$scope.question = question;
			$scope.isLoaded = true;
			$scope.editionMode = true;
		});
	} else {
		$scope.isLoaded = true;
	}

	$scope.save = function () {
		if (question.tags !== undefined && !Array.isArray(question.tags)) {
			question.tags = question.tags.split(',');
		}
		if (question._id) {
			mvQuestionService.updateQuestion(question).then(function () {
				mvNotifier.notify('Question has been updated');
				$location.path('/admin/questions');
			}, function (response) {
				mvNotifier.error(response.data.reason);
			});
		} else {
			mvQuestionService.createQuestion(question).then(function () {
				mvNotifier.notify('Question created');
				$location.path('/admin/questions');
			}, function (reason) {
				mvNotifier.error(reason);
			});
		}
	};

	$scope.delete = function () {
		$scope.itemType = 'question';
		mvDialog.confirmDelete($scope).then(function (data) {
			if (data.value === 'confirm') {
				mvQuestionService.deleteQuestion(question).then(function () {
					mvNotifier.notify('Question deleted');
					$location.path('/admin/questions');
				}, function (reason) {
					mvNotifier.error(reason);
				});
			}
		});
	};

});