function mvRegisterController($scope, mvNotifier, mvAuthService, $location) {
  $scope.registerFromPage = function () {
    var newUserData = {
      email: $scope.email,
      username: $scope.username,
      password: $scope.password
    };

    mvAuthService.registerUser(newUserData).then(function () {
      mvNotifier.notify('USER_CREATED_SUCCESS');
      $location.path('/');
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  $scope.registerFromModal = function () {
    var newUserData = {
      email: $scope.email,
      username: $scope.username,
      password: $scope.password
    };
    mvAuthService.registerUser(newUserData).then(function () {
      mvNotifier.notify('USER_CREATED_SUCCESS');
      $scope.closeThisDialog();
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };
}

mvRegisterController.$inject = ['$scope', 'mvNotifier', 'mvAuthService', '$location'];
angular.module('app').controller('mvRegisterController', mvRegisterController);