angular.module('app').controller('mvQuestionRandomController', function($location, mvQuestion) {
	
	// Redirect to random question page
	var question = mvQuestion.random(function () {
		$location.path('/questions/' + question._id);
	})
});