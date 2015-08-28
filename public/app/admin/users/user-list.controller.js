function UserListController($scope, User) {
  $scope.users = User.query();

  $scope.sortOptions = [{
    value: 'username',
    text: 'Sort by username'
  }, {
    value: '- registrationDate',
    text: 'Sort by registration date'  }, {
    value: '- role',
    text: 'Sort by role'
  }];

  $scope.sortOrder = {
    selected: $scope.sortOptions[0].value
  };
}

UserListController.$inject = ['$scope', 'User'];
angular.module('app').controller('UserListController', UserListController);