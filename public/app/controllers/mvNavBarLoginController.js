function mvNavBarLoginController($scope, $location, mvNotifier, mvAuthService, mvDialog) {
  $scope.signin = function (email, password) {
    mvAuthService.authenticateUser(email, password).then(function (success) {
      if (success) {
        mvNotifier.notify('SIGN_IN_SUCCESS');
      } else {
        mvNotifier.warn('SIGN_IN_ERROR');
      }
    });
  };
  $scope.signout = function () {
    mvAuthService.logoutUser().then(function () {
      $scope.email = '';
      $scope.password = '';
      mvNotifier.notify('SIGN_OUT_SUCCESS');
      $location.path('/');
    });
  };
  $scope.openRegisterModal = function () {
    mvDialog.register();
  };
  $scope.openSuggestModal = function () {
    mvDialog.suggestQuestion();
  };
}

mvNavBarLoginController.$inject = ['$scope', '$location', 'mvNotifier', 'mvAuthService', 'mvDialog'];
angular.module('app').controller('mvNavBarLoginController', mvNavBarLoginController);