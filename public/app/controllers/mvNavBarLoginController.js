angular.module('app').controller('mvNavBarLoginController', function ($scope, $location, mvNotifier, mvAuthService, mvDialog) {
  $scope.signin = function (email, password) {
    mvAuthService.authenticateUser(email, password).then(function (success) {
      if (success) {
        mvNotifier.notify('You have successfully signed in.');
      } else {
        mvNotifier.warn('Email/Password combination incorrect');
      }
    });
  };
  $scope.signout = function () {
    mvAuthService.logoutUser().then(function () {
      $scope.username = '';
      $scope.password = '';
      mvNotifier.notify('You have successfully signed out.');
      $location.path('/');
    });
  };
  $scope.openRegisterModal = function () {
    mvDialog.register();
  };
  $scope.openSuggestModal = function () {
    mvDialog.suggestQuestion();
  };
});