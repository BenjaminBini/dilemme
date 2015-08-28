function Question($resource) {
  var QuestionResource = $resource('/api/questions/:_id', {_id: '@id'}, {
    update: {
      method: 'PUT',
      isArray: false
    },
    count: {
      method: 'GET',
      url: '/api/questions/count',
      isArray: false
    },
    random: {
      method: 'GET',
      url: '/api/questions/random',
      isArray: false
    },
    unansweredRandom: {
      method: 'GET',
      url: '/api/questions/random/unanswered',
      isArray: false
    },
    queryPublished: {
      method: 'GET',
      isArray: true,
      url: '/api/questions/published'
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
    },
    upvoteQuestion: {
      method: 'POST',
      isArray: false,
      url: '/api/questions/:_id/upvote'
    },
    commentQuestion: {
      method: 'POST',
      isArray: false,
      url: '/api/questions/:_id/comment'
    },
    deleteComment: {
      method: 'DELETE',
      isArray: false,
      url: '/api/questions/:_id/comment/:_commentId'
    },
    upvoteComment: {
      method: 'POST',
      isArray: false,
      url: '/api/questions/:_id/comment/:_commentId/upvote'
    },
    getByAuthor: {
      method: 'GET',
      isArray: true,
      url: '/api/users/:_id/questions'
    }
  });

  return QuestionResource;
}

Question.$inject = ['$resource'];
angular.module('app').factory('Question', Question);
