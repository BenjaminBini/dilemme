angular.module('app').factory('mvCachedQuestions', function(mvQuestion, $q) {
	var questionList;

	return {
		query: function() {
			if (!questionList) {
				questionList = mvQuestion.query();
			}

			return questionList;
		}
	};
});