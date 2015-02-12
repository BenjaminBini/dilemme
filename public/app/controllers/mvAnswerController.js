angular.module('app').controller('mvAnswerController', function($scope, mvQuestion) {
	$scope.answer = function (answer) {
		console.log('Answer ' + answer + ' : ' + $scope.question.answers[answer].text);
	};
});