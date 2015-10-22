function RegisterController($scope, NotifierService, AuthService, $location) {
  $scope.isExternal = $location.url().startsWith('/register-external');
  if ($scope.isExternal) {
    $scope.username = $location.search().name;
    $scope.email = $location.search().email;
  }
  $scope.registerFromPage = function() {
    var newUserData = {
      email: $scope.email,
      username: $scope.username,
      password: $scope.password
    };

    AuthService.registerUser(newUserData).then(function() {
      NotifierService.notify('USER_CREATED_SUCCESS');
      $location.path('/');
    }, function(reason) {
      NotifierService.error(reason);
    });
  };

  $scope.registerFromModal = function() {
    var newUserData = {
      email: $scope.email,
      username: $scope.username,
      password: $scope.password
    };
    AuthService.registerUser(newUserData).then(function() {
      NotifierService.notify('USER_CREATED_SUCCESS');
      $scope.closeThisDialog();
    }, function(reason) {
      NotifierService.error(reason);
    });
  };
}

RegisterController.$inject = ['$scope', 'NotifierService', 'AuthService', '$location'];
angular.module('app').controller('RegisterController', RegisterController);
