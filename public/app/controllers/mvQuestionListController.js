angular.module('app').controller('mvQuestionListController', function($scope, mvQuestion) {
	$scope.questions = mvQuestion.query();

	$scope.sortOptions = [
	{
		value: "text + answers[0].text + answers[1].text",
		text: "Sort by text"
	}, {
		value: "published",
		text: "Sort by publication date"	
	}, {
		value: "upvotes",
		text: "Sort by upvotes"
	}]

	$scope.sortOrder = {
		selected: $scope.sortOptions[0].value
	}

});