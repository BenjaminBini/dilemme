angular.module('app').factory('mvSuggestion', function ($resource) {
  var SuggestionResource = $resource('/api/suggestions/:_id', {_id: '@id'}, {
    update: {
      method: 'PUT',
      isArray: false
    },
    getByUser: {
      method: 'GET',
      isArray: true,
      url: '/api/users/:_id/suggestions'
    },
    validate: {
      method: 'POST',
      isArray: false,
      url: '/api/suggestions/:_id/validate'
    }
  });

  return SuggestionResource;
});