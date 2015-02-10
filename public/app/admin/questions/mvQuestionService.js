angular.module('app').factory('mvQuestionService', function($http, mvIdentity, $q, mvQuestion) {
	return {
		createQuestion: function (newQuestionData) {
			var newQuestion = new mvQuestion(newQuestionData);
			var dfd = $q.defer();

			newQuestion.$save().then(function () {
				dfd.resolve();
			}, function (response) {
				dfd.reject(response.data.reason);
			});

			return dfd.promise;
		},
		updateQuestion: function (newQuestionData) {
			var dfd = $q.defer();

			newQuestionData.$update().then(function () {
				dfd.resolve();
			}, function (response) {
				dfd.reject(response.data.reason);
			});

			return dfd.promise;
		}
	}
});