angular.module('app').controller('mvQuestionDetailController', function ($scope, mvQuestion, $routeParams, mvNotifier, mvQuestionService) {
	var question = {};
	question.answers = [];
	$scope.question = question;

	if ($routeParams.id != 'add') {
		question = mvQuestion.get({_id: $routeParams.id}, function() {
			$scope.question = question;
		});
	}

	$scope.save = function() {
		if (question._id) {
			mvQuestionService.updateQuestion(question).then(function () {
				mvNotifier.notify('Question has been updated');
			}, function (response) {
				mvNotifier.error(response.data.reason);
			});
		} else {
			mvQuestionService.createQuestion(question).then(function () {
				mvNotifier.notify('Question created');
			}, function (reason) {
				mvNotifier.error(reason);
			});
		}
	};
});