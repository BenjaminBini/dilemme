function RegisterController($scope, NotifierService, AuthService, $location) {
  $scope.registerFromPage = function () {
    var newUserData = {
      email: $scope.email,
      username: $scope.username,
      password: $scope.password
    };

    AuthService.registerUser(newUserData).then(function () {
      NotifierService.notify('USER_CREATED_SUCCESS');
      $location.path('/');
    }, function (reason) {
      NotifierService.error(reason);
    });
  };

  $scope.registerFromModal = function () {
    var newUserData = {
      email: $scope.email,
      username: $scope.username,
      password: $scope.password
    };
    AuthService.registerUser(newUserData).then(function () {
      NotifierService.notify('USER_CREATED_SUCCESS');
      $scope.closeThisDialog();
    }, function (reason) {
      NotifierService.error(reason);
    });
  };
}

RegisterController.$inject = ['$scope', 'NotifierService', 'AuthService', '$location'];
angular.module('app').controller('RegisterController', RegisterController);