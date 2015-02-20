angular.module('app').factory('mvQuestionService', function($http, $q, mvQuestion, localStorageService) {
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
		},
		getProportions: function (question) {
			var firstAnswerVotes = question.answers[0].votes;
			var secondAnswerVotes = question.answers[1].votes;
			var totalVotes = firstAnswerVotes + secondAnswerVotes;

			var firstAnswerProportion, secondAnswerProportion;
			if (totalVotes == 0) {
				firstAnswerProportion = 50;
			} else {
				firstAnswerProportion = Math.round(firstAnswerVotes / totalVotes * 100);
			}
			secondAnswerProportion = 100 - firstAnswerProportion;
			return [firstAnswerProportion, secondAnswerProportion];
		},
		answerQuestion: function(question, answerNumber) {
			var dfd = $q.defer();

			question.$answerQuestion({_id: question._id, answer: answerNumber}).then(function () {
				dfd.resolve();
			}, function (response) {
				dfd.reject(response.data.reason);
			});

			return dfd.promise;
		},
		saveAnswerLocally: function(question, answer) {
			var dfd = $q.defer();

			var anonymousAnswer = {
				question: question._id,
				answer: answer
			}
			var anonymousAnswers = localStorageService.get('answers');
			if (!anonymousAnswers) {
				anonymousAnswers = [];
			}
			anonymousAnswers.push(anonymousAnswer);
			localStorageService.set('answers', anonymousAnswers);
			dfd.resolve();

			return dfd.promise;
		}
	}
});