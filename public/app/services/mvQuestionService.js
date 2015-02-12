angular.module('app').factory('mvQuestionService', function($http, $q, mvQuestion) {
	return {
		createQuestion: function (question) {
			var newQuestion = new mvQuestion(question);
			var dfd = $q.defer();

			newQuestion.$save().then(function () {
				dfd.resolve();
			}, function (response) {
				dfd.reject(response.data.reason);
			});

			return dfd.promise;
		},
		updateQuestion: function (question) {
			var dfd = $q.defer();

			question.$update({_id: question._id}).then(function () {
				dfd.resolve();
			}, function (response) {
				dfd.reject(response.data.reason);
			});

			return dfd.promise;
		},
		deleteQuestion: function (question) {
			var dfd = $q.defer();

			question.$delete({_id: question._id}).then(function () {
				dfd.resolve();
			}, function (response) {
				dfd.reject(response.data.reason);
			});

			return dfd.promise;
		}
	}
});