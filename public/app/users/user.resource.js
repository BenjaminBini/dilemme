function User($resource) {
  var UserResource = $resource('/api/users/:_id', {_id: "@id"}, {
    update: {
      method: 'PUT',
      isArray: false
    },
    getStats: {
      method: 'GET',
      isArray: false,
      url: '/api/users/:_id/stats'
    }
  });

  UserResource.prototype.isAdmin = function () {
    return this.roles && this.roles.indexOf('admin') > -1;
  };

  return UserResource;
}

User.$inject = ['$resource'];
angular.module('app').factory('User', User);