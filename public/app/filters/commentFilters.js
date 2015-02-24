angular.module('commentFilters', []).filter('authorCssClass', function () {
	return function (comment, question) {
		var answers = comment.author.answers;
		if (!answers) {
			return;
		}
		for (var i = 0; i < answers.length; i++) {
			if (answers[i].question == question._id) {
				if (answers[i].answer === 0) {
					return 'red';
				} else {
					return 'blue';
				}
			} 
		}
	}
});