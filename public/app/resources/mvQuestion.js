angular.module('app').factory('mvQuestion', function ($resource) {
	var QuestionResource = $resource('/api/questions/:_id', {_id: '@id'}, {
		update: {
			method: 'PUT',
			isArray: false
		},
		random: {
			method: 'GET',
			url: '/api/questions/random',
			isArray: false
		},
		queryForTag: {
			method: 'GET',
			url: '/api/questions/tag/:tag',
			isArray: true
		},
		answerQuestion: {
			method: 'POST',
			isArray: false,
			url: '/api/questions/:_id/answer/:answer'
		}
	});

	return QuestionResource;
});