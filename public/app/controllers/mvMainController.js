angular.module('app').controller('mvMainController', function($scope, mvQuestion) {
	var question = mvQuestion.random(function () {
		$scope.question = question;
	});
});